// File access for the social tools: the private folder, the hub's site folder,
// and the queue. Every path that comes from the queue is checked to stay inside its folder.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import matter from "gray-matter";
import { parseQueue, serializeQueue, QueueError } from "./queue.mjs";
import { parseList } from "./checks.mjs";

export const DEFAULT_SOCIAL_DIR = path.join(os.homedir(), "Downloads", "umwayi-video-pack-v2", "social");
const MAX_BODY_BYTES = 100_000;

export function makeEnv({ socialDir, hubDir } = {}) {
  return {
    socialDir: path.resolve(socialDir || process.env.SOCIAL_DIR || DEFAULT_SOCIAL_DIR),
    hubDir: path.resolve(hubDir || path.join(path.dirname(new URL(import.meta.url).pathname), "..", "..", "..")),
  };
}

// Returns the real path of rel inside root, or null if it escapes (.., absolute path, symlink out).
export function safeInside(root, rel) {
  if (typeof rel !== "string" || rel === "" || path.isAbsolute(rel) || rel.includes("\0")) return null;
  const full = path.resolve(root, rel);
  const rootReal = fs.existsSync(root) ? fs.realpathSync(root) : path.resolve(root);
  let real;
  try {
    real = fs.realpathSync(full);
  } catch {
    return full.startsWith(path.resolve(root) + path.sep) ? full : null;
  }
  return real.startsWith(rootReal + path.sep) ? real : null;
}

function readOptional(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw new QueueError(`cannot read ${path.basename(file)}: ${e.code}`);
  }
}

export function readQueue(env) {
  const text = readOptional(path.join(env.socialDir, "queue.jsonl"));
  return text === null ? [] : parseQueue(text);
}

export function writeQueue(env, items) {
  const file = path.join(env.socialDir, "queue.jsonl");
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, serializeQueue(items), { mode: 0o600 });
  fs.renameSync(tmp, file);
}

export function appendLedger(env, entry) {
  fs.appendFileSync(path.join(env.socialDir, "ledger.jsonl"), JSON.stringify(entry) + "\n", { mode: 0o600 });
}

export function readLedger(env) {
  const text = readOptional(path.join(env.socialDir, "ledger.jsonl"));
  if (text === null) return [];
  return text.split("\n").filter((l) => l.trim()).map((l, i) => {
    try {
      return JSON.parse(l);
    } catch {
      throw new QueueError(`ledger line ${i + 1}: not valid JSON`);
    }
  });
}

function readBody(env, item) {
  if (item.body_file === null) return { body: null, problem: null };
  const real = safeInside(env.socialDir, item.body_file);
  if (!real) return { body: null, problem: `body_file ${item.body_file} is outside the private folder` };
  let st;
  try {
    st = fs.statSync(real);
  } catch {
    return { body: null, problem: `body_file ${item.body_file} does not exist` };
  }
  if (!st.isFile()) return { body: null, problem: `body_file ${item.body_file} is not a file` };
  if (st.size > MAX_BODY_BYTES) return { body: null, problem: `body_file is over ${MAX_BODY_BYTES} bytes` };
  const buf = fs.readFileSync(real);
  try {
    return { body: new TextDecoder("utf-8", { fatal: true }).decode(buf), problem: null };
  } catch {
    return { body: null, problem: "body_file is not UTF-8 text" };
  }
}

function checkSource(env, item) {
  const src = item.source;
  if (!src) return { state: "none" };
  if (src.startsWith("https://")) {
    const ok = src === "https://github.com/Miguel-Shinyenyi" || src.startsWith("https://github.com/Miguel-Shinyenyi/");
    return ok ? { state: "ok" } : { state: "badurl", detail: `${src} is not a repo under github.com/Miguel-Shinyenyi` };
  }
  const siteDir = path.join(env.hubDir, "site");
  const real = safeInside(siteDir, src.startsWith("site/") ? src.slice(5) : src);
  if (!real) return { state: "outside", detail: `${src} is not a file under the hub's site folder` };
  let text;
  try {
    if (!fs.statSync(real).isFile()) return { state: "missing", detail: `${src} is not a file` };
    text = fs.readFileSync(real, "utf8");
  } catch {
    return { state: "missing", detail: `${src} does not exist` };
  }
  let data;
  try {
    data = matter(text).data;
  } catch {
    return { state: "draft", detail: `${src} has front matter that cannot be read` };
  }
  if (data.draft !== false) return { state: "draft", detail: `${src} does not have draft: false` };
  return { state: "ok" };
}

function checkMedia(env, item) {
  const problems = [];
  for (const m of item.media) {
    const real = safeInside(env.socialDir, m);
    if (!real) {
      problems.push(`${m} is outside the private folder`);
      continue;
    }
    try {
      if (!fs.statSync(real).isFile()) problems.push(`${m} is not a file`);
    } catch {
      problems.push(`${m} does not exist`);
    }
  }
  return problems;
}

export function gatherContext(env, item) {
  const { body, problem } = readBody(env, item);
  let limitsDoc = null;
  const limitsText = readOptional(path.join(env.socialDir, "limits.json"));
  if (limitsText !== null) {
    try {
      limitsDoc = JSON.parse(limitsText);
    } catch {
      throw new QueueError("limits.json is not valid JSON");
    }
  }
  const list = (name) => {
    const t = readOptional(path.join(env.socialDir, name));
    return t === null ? null : parseList(t);
  };
  return {
    item,
    body,
    bodyProblem: problem,
    limits: limitsDoc?.platforms?.[item.platform] ?? null,
    banned: list("banned-words.txt"),
    claims: list("claims-blocklist.txt"),
    companies: list("company-blocklist.txt"),
    allowlist: list("link-allowlist.txt"),
    source: checkSource(env, item),
    mediaProblems: checkMedia(env, item),
  };
}
