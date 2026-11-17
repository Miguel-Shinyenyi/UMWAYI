// publish and connectors. Posting through an official API is allowed only when every
// gate is open: the item is approved and unchanged, its checks pass, the platform is
// enabled in connectors.json with the terms page recorded, the secrets exist, and the
// owner said yes for this exact item (--live --confirmed). Default is a dry run.
import { effectiveStatus } from "./queue.mjs";
import { runChecks, exitCodeFor } from "./checks.mjs";
import { readQueue, writeQueue, gatherContext, readConnectorsConfig } from "./io.mjs";
import { hashOf } from "./commands.mjs";
import { CONNECTORS, NO_CONNECTOR } from "./connectors/index.mjs";
import { redact } from "./secrets.mjs";

function postedText(item, body) {
  if (item.link && !body.includes(item.link)) return `${body.trimEnd()}\n${item.link}`;
  return body;
}

export function connectorsStatus(env, readSecret) {
  const cfgAll = readConnectorsConfig(env);
  const out = [];
  for (const [name, c] of Object.entries(CONNECTORS)) {
    const cfg = cfgAll[name] ?? {};
    const terms = cfg.terms_read?.url && cfg.terms_read?.date ? `terms read ${cfg.terms_read.date}` : "terms NOT recorded";
    const secrets = c.secrets.map((n) => `${n} ${readSecret(n) ? "found" : "missing"}`).join(", ");
    const keys = c.configKeys.map((k) => `${k} ${cfg[k] ? "set" : "missing"}`).join(", ");
    out.push(`${name}: ${cfg.enabled === true ? "enabled" : "off"}, ${terms}; ${keys}; secrets: ${secrets}; text only`);
  }
  for (const [name, why] of Object.entries(NO_CONNECTOR)) out.push(`${name}: no connector, ${why}`);
  return { code: 0, out };
}

export async function publish(env, id, { live = false, confirmed = false } = {}, deps) {
  const { fetch, readSecret, now } = deps;
  const connectors = deps.connectors ?? CONNECTORS;
  const items = readQueue(env);
  const item = items.find((i) => i.id === id);
  if (!item) return { code: 64, out: [`no item with id ${id}`] };
  if (live && !confirmed) return { code: 64, out: ["--live needs --confirmed, after Miguel's yes for this exact item"] };
  if (item.status !== "approved") return { code: 2, out: [`FAIL ${id} is ${item.status}, not approved`] };

  const ctx = gatherContext(env, item);
  if (ctx.body === null || effectiveStatus(item, hashOf(ctx)) !== "approved") {
    item.status = "drafted";
    item.approved_sha256 = null;
    writeQueue(env, items);
    return { code: 2, out: [`FAIL the content of ${id} changed after approval; it is back to drafted`] };
  }
  const result = runChecks(ctx);
  const code = exitCodeFor(result);
  if (code !== 0) return { code, out: [...result.fails.map((f) => `FAIL ${f}`), ...result.unknowns.map((u) => `CANNOT DECIDE ${u}`), "checks do not pass, nothing was sent"] };

  const connector = connectors[item.platform];
  if (!connector) return { code: 3, out: [`CANNOT DECIDE no connector for ${item.platform}: ${NO_CONNECTOR[item.platform] ?? "none built"}`] };
  if (item.media.length) return { code: 3, out: ["CANNOT DECIDE this item has media and the connectors send text only"] };

  const cfg = readConnectorsConfig(env)[item.platform] ?? {};
  if (cfg.enabled !== true) return { code: 3, out: [`CANNOT DECIDE ${item.platform} is off in connectors.json`] };
  if (!cfg.terms_read?.url || !cfg.terms_read?.date) return { code: 3, out: [`CANNOT DECIDE the terms of ${item.platform} are not recorded in connectors.json (terms_read url and date)`] };
  const missingCfg = connector.configKeys.filter((k) => !cfg[k]);
  if (missingCfg.length) return { code: 3, out: [`CANNOT DECIDE connectors.json is missing ${missingCfg.join(", ")} for ${item.platform}`] };

  const text = postedText(item, ctx.body);
  const limit = Number.isInteger(cfg.max_chars) ? cfg.max_chars : connector.defaultLimit;
  const len = [...text].length;
  if (len > limit) return { code: 2, out: [`FAIL the text is ${len} characters, over the ${limit} limit for ${item.platform}`] };

  let plan;
  try {
    plan = connector.describe(text, cfg);
  } catch (e) {
    return { code: 3, out: [`CANNOT DECIDE ${e.message}`] };
  }
  const present = connector.secrets.map((n) => `${n} ${readSecret(n) ? "found" : "missing"}`);
  if (!live) {
    return { code: 0, out: [`dry run for ${id} on ${item.platform}, ${len} of ${limit} characters`, ...plan.map((l) => `would: ${l}`), `secrets: ${present.join(", ")}`, "nothing was sent"] };
  }

  const secrets = {};
  for (const n of connector.secrets) {
    const v = readSecret(n);
    if (!v) return { code: 3, out: [`CANNOT DECIDE secret ${n} is missing; the owner stores it in the Keychain or the environment`] };
    secrets[n] = v;
  }
  let res;
  try {
    res = await connector.publish({ text, hash: item.approved_sha256, cfg, secrets, fetch, now });
  } catch (e) {
    return { code: 2, out: [`FAIL ${item.platform} refused or failed: ${redact(e.message, Object.values(secrets))}`, "nothing was recorded; check the platform before trying again, because a step may have succeeded"] };
  }
  item.status = "posted";
  item.posted_url = res.url;
  item.posted_at = now.toISOString();
  writeQueue(env, items);
  return { code: 0, out: [`posted ${id} at ${res.url}`, "recorded"] };
}
