#!/usr/bin/env node
// social: queue and rule checks for launch posts. It never posts anything.
// Usage: node social/cli.mjs COMMAND [ARGS]   (or: npm run social -- COMMAND)
//   lint ID
//   next [--today YYYY-MM-DD]
//   approve ID --confirmed
//   record ID URL
//   metrics ID [--views N] [--upvotes N] [--comments N]
//   draft ID                start a body file from the platform's template
//   fanout SOURCE --platforms a,b,c [--date D]   one drafted item per platform
//   report
//   reminders [--today D]   what Miguel posts by hand and has not yet
//   connectors
//   publish ID [--live --confirmed]   dry run unless both flags are given
// Environment: SOCIAL_DIR, the private folder (default ~/Downloads/umwayi-video-pack-v2/social).
// Exit codes: 0 pass, 2 fail, 3 cannot decide, 64 usage. Never 1.
import { makeEnv } from "./lib/io.mjs";
import * as cmd from "./lib/commands.mjs";
import { publish, connectorsStatus } from "./lib/publish.mjs";
import { draft, fanout } from "./lib/drafts.mjs";
import { makeSecretReader } from "./lib/secrets.mjs";

const USAGE = "usage: social lint ID | next [--today D] | approve ID --confirmed | record ID URL | metrics ID [--views N] [--upvotes N] [--comments N] | draft ID | fanout SOURCE --platforms a,b,c [--date D] | report | reminders [--today D] | connectors | publish ID [--live --confirmed]";

function parse(argv) {
  const pos = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--confirmed") opts.confirmed = true;
    else if (a === "--live") opts.live = true;
    else if (["--today", "--views", "--upvotes", "--comments", "--platforms", "--date"].includes(a)) {
      if (i + 1 >= argv.length) return null;
      opts[a.slice(2)] = argv[++i];
    } else if (a.startsWith("--")) return null;
    else pos.push(a);
  }
  return { pos, opts };
}

export function run(argv, env = makeEnv(), now = new Date()) {
  const parsed = parse(argv);
  if (!parsed || parsed.pos.length === 0) return { code: 64, out: [USAGE] };
  const [name, ...args] = parsed.pos;
  const { opts } = parsed;
  const usage = { code: 64, out: [USAGE] };
  try {
    switch (name) {
      case "lint":
        return args.length === 1 ? cmd.lint(env, args[0]) : usage;
      case "next": {
        if (args.length) return usage;
        const today = opts.today ?? now.toISOString().slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) return { code: 64, out: ["--today must be YYYY-MM-DD"] };
        return cmd.next(env, today);
      }
      case "approve":
        return args.length === 1 ? cmd.approve(env, args[0], opts.confirmed === true) : usage;
      case "record":
        return args.length === 2 ? cmd.record(env, args[0], args[1], now) : usage;
      case "metrics": {
        if (args.length !== 1) return usage;
        const values = {};
        for (const k of ["views", "upvotes", "comments"]) {
          if (opts[k] === undefined) continue;
          if (!/^\d{1,9}$/.test(opts[k])) return { code: 64, out: [`--${k} must be a whole number`] };
          values[k] = Number(opts[k]);
        }
        return cmd.metrics(env, args[0], values, now);
      }
      case "draft":
        return args.length === 1 ? draft(env, args[0]) : usage;
      case "fanout": {
        if (args.length !== 1) return usage;
        const date = opts.date ?? null;
        if (date !== null && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return { code: 64, out: ["--date must be YYYY-MM-DD"] };
        const platforms = (opts.platforms ?? "").split(",").map((p) => p.trim()).filter(Boolean);
        return fanout(env, args[0], platforms, date);
      }
      case "reminders": {
        if (args.length) return usage;
        const today = opts.today ?? now.toISOString().slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) return { code: 64, out: ["--today must be YYYY-MM-DD"] };
        return cmd.reminders(env, today);
      }
      case "report":
        return args.length === 0 ? cmd.report(env) : usage;
      default:
        return usage;
    }
  } catch (e) {
    // A fault in the queue or config, or any unexpected error, is "cannot decide". Never exit 1.
    const known = e && e.constructor && e.constructor.name === "QueueError";
    return { code: 3, out: [known ? `cannot decide: ${e.message}` : `cannot decide: unexpected error (${e?.name ?? "unknown"})`] };
  }
}

// publish and connectors are the only commands that can reach the network, and only
// publish with --live --confirmed does. Everything else goes through run().
export async function runAsync(argv, env = makeEnv(), now = new Date(), deps = {}) {
  const parsed = parse(argv);
  const name = parsed?.pos[0];
  if (name !== "publish" && name !== "connectors") return run(argv, env, now);
  const d = { fetch: globalThis.fetch, readSecret: makeSecretReader(), now, ...deps };
  const args = parsed.pos.slice(1);
  try {
    if (name === "connectors") return args.length === 0 ? connectorsStatus(env, d.readSecret) : { code: 64, out: [USAGE] };
    if (args.length !== 1) return { code: 64, out: [USAGE] };
    return await publish(env, args[0], { live: parsed.opts.live === true, confirmed: parsed.opts.confirmed === true }, d);
  } catch (e) {
    const known = e && e.constructor && e.constructor.name === "QueueError";
    return { code: 3, out: [known ? `cannot decide: ${e.message}` : `cannot decide: unexpected error (${e?.name ?? "unknown"})`] };
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { code, out } = await runAsync(process.argv.slice(2));
  for (const line of out) console.log(line);
  process.exitCode = code;
}
