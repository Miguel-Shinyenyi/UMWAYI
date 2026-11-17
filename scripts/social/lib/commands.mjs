// The five commands. None of them posts anything. Each returns { code, out }.
// Exit codes: 0 pass, 2 fail, 3 cannot decide, 64 usage. Never 1.
import { contentHash, effectiveStatus } from "./queue.mjs";
import { runChecks, exitCodeFor } from "./checks.mjs";
import { readQueue, writeQueue, gatherContext, appendLedger, readLedger } from "./io.mjs";

const NEXT_ACTION = {
  idea: "write the body file, then set the status to drafted",
  drafted: "run: social lint ID",
  linted: "show Miguel platform, account, exact text, link, media and time, and wait for his yes",
  approved: "post it in Miguel's signed-in browser after his word, then run: social record ID URL",
};
const PRIORITY = { approved: 0, linted: 1, drafted: 2, idea: 3 };

function find(items, id) {
  return items.find((i) => i.id === id) ?? null;
}

export function hashOf(ctx) {
  return contentHash({ title: ctx.item.title, link: ctx.item.link, body: ctx.body });
}

function formatResult(result) {
  const out = [];
  for (const f of result.fails) out.push(`FAIL ${f}`);
  for (const u of result.unknowns) out.push(`CANNOT DECIDE ${u}`);
  return out;
}

function save(env, items, item, patch) {
  Object.assign(item, patch);
  writeQueue(env, items);
}

export function lint(env, id) {
  const items = readQueue(env);
  const item = find(items, id);
  if (!item) return { code: 64, out: [`no item with id ${id}`] };
  const ctx = gatherContext(env, item);
  const result = runChecks(ctx);
  const code = exitCodeFor(result);
  const out = formatResult(result);
  const hash = ctx.body === null ? null : hashOf(ctx);

  if (item.status === "approved") {
    if (hash !== item.approved_sha256) {
      save(env, items, item, { status: "drafted", approved_sha256: null });
      out.push("the content changed after approval: status is back to drafted");
    } else if (code !== 0) {
      save(env, items, item, { status: "drafted", approved_sha256: null });
      out.push("checks no longer pass: status is back to drafted");
    }
  } else if (item.status === "drafted" || item.status === "linted") {
    const next = code === 0 ? "linted" : "drafted";
    if (next !== item.status) save(env, items, item, { status: next });
  }
  out.push(code === 0 ? `PASS ${id}: every check passed` : `${id}: ${code === 2 ? "failed" : "cannot decide"}`);
  return { code, out };
}

export function next(env, today) {
  const items = readQueue(env);
  const due = [];
  for (const item of items) {
    let status = item.status;
    if (status === "approved") {
      const ctx = gatherContext(env, item);
      status = ctx.body === null ? "drafted" : effectiveStatus(item, hashOf(ctx));
    }
    if (!(status in NEXT_ACTION)) continue;
    if (item.earliest_date && item.earliest_date > today) continue;
    due.push({ item, status });
  }
  due.sort((a, b) =>
    (a.item.earliest_date ?? "").localeCompare(b.item.earliest_date ?? "") ||
    PRIORITY[a.status] - PRIORITY[b.status] ||
    a.item.id.localeCompare(b.item.id));
  if (!due.length) return { code: 0, out: [`nothing is due on or before ${today}`] };
  const out = due.map(({ item, status }, i) => {
    const why = `${item.platform} ${item.kind}, ${status}, due ${item.earliest_date ?? "any day"}`;
    const note = item.status === "approved" && status === "drafted" ? " (content changed since approval)" : "";
    return `${i + 1}. ${item.id}: ${why}${note}. Next: ${NEXT_ACTION[status].replace("ID", item.id)}`;
  });
  return { code: 0, out };
}

export function approve(env, id, confirmed) {
  if (!confirmed) return { code: 64, out: ["approve needs --confirmed, after Miguel's yes in chat for this exact item"] };
  const items = readQueue(env);
  const item = find(items, id);
  if (!item) return { code: 64, out: [`no item with id ${id}`] };
  if (item.status === "posted" || item.status === "skipped" || item.status === "idea") {
    return { code: 2, out: [`FAIL ${id} is ${item.status} and cannot be approved`] };
  }
  const ctx = gatherContext(env, item);
  const result = runChecks(ctx);
  const code = exitCodeFor(result);
  if (code !== 0) return { code, out: [...formatResult(result), `${id} was not approved`] };
  const hash = hashOf(ctx);
  if (item.status === "approved" && item.approved_sha256 === hash) {
    return { code: 0, out: [`${id} is already approved, sha256 ${hash}`] };
  }
  save(env, items, item, { status: "approved", approved_sha256: hash });
  return { code: 0, out: [`approved ${id}, sha256 ${hash}`] };
}

export function record(env, id, url, now) {
  const items = readQueue(env);
  const item = find(items, id);
  if (!item) return { code: 64, out: [`no item with id ${id}`] };
  if (!/^https:\/\/[^\s]+$/.test(url ?? "")) return { code: 64, out: ["record needs an https URL"] };
  if (item.status !== "approved") return { code: 2, out: [`FAIL ${id} is ${item.status}, not approved, so it cannot be recorded`] };
  const ctx = gatherContext(env, item);
  if (ctx.body === null || hashOf(ctx) !== item.approved_sha256) {
    save(env, items, item, { status: "drafted", approved_sha256: null });
    return { code: 2, out: [`FAIL the content of ${id} changed after approval; it is back to drafted and was not recorded`] };
  }
  save(env, items, item, { status: "posted", posted_url: url, posted_at: now.toISOString() });
  return { code: 0, out: [`recorded ${id} at ${url}`] };
}

export function metrics(env, id, values, now) {
  const items = readQueue(env);
  const item = find(items, id);
  if (!item) return { code: 64, out: [`no item with id ${id}`] };
  if (item.status !== "posted") return { code: 2, out: [`FAIL ${id} is ${item.status}; numbers are recorded only for posted items`] };
  const keys = Object.keys(values);
  if (!keys.length) return { code: 64, out: ["metrics needs at least one of --views, --upvotes, --comments"] };
  appendLedger(env, { id, platform: item.platform, read_at: now.toISOString(), ...values });
  return { code: 0, out: [`recorded ${keys.map((k) => `${k} ${values[k]}`).join(", ")} for ${id}`] };
}

export function report(env) {
  const items = readQueue(env);
  const counts = new Map();
  for (const item of items) {
    let status = item.status;
    if (status === "approved") {
      const ctx = gatherContext(env, item);
      status = ctx.body === null ? "drafted" : effectiveStatus(item, hashOf(ctx));
    }
    const row = counts.get(item.platform) ?? {};
    row[status] = (row[status] ?? 0) + 1;
    counts.set(item.platform, row);
  }
  const out = [];
  if (!counts.size) out.push("the queue is empty");
  for (const [platform, row] of [...counts.entries()].sort()) {
    out.push(`${platform}: ${Object.entries(row).map(([s, n]) => `${s} ${n}`).join(", ")}`);
  }
  const latest = new Map();
  for (const e of readLedger(env)) latest.set(e.id, e);
  for (const item of items.filter((i) => i.status === "posted")) {
    const e = latest.get(item.id);
    const nums = e ? ["views", "upvotes", "comments"].filter((k) => k in e).map((k) => `${k} ${e[k]}`).join(", ") : "no numbers read yet";
    out.push(`posted ${item.id} (${item.platform}) ${item.posted_url}: ${nums}${e ? ` at ${e.read_at}` : ""}`);
  }
  return { code: 0, out };
}
