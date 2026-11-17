// Strict reader and writer for the social queue (one JSON object per line).
// Pure functions. A fault raises QueueError, which the CLI turns into exit 3.
import { createHash } from "node:crypto";

export class QueueError extends Error {}

export const STATUSES = ["idea", "drafted", "linted", "approved", "posted", "skipped"];
export const KINDS = ["post", "video", "listing", "reply_draft"];
export const AI_VALUES = ["yes", "no", "unknown"];
export const FIELDS = [
  "id", "platform", "kind", "source", "title", "body_file", "link", "media",
  "earliest_date", "status", "approved_sha256", "posted_url", "posted_at",
  "ai_assisted", "notes",
];

const ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
const PLATFORM_RE = /^[a-z0-9][a-z0-9-]{0,31}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SHA_RE = /^[0-9a-f]{64}$/;

function isRealDate(s) {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
}

function textOrNull(item, key, where) {
  const v = item[key];
  if (v === undefined || v === null) return null;
  if (typeof v !== "string") throw new QueueError(`${where}: ${key} must be text or null`);
  return v;
}

export function parseQueue(text) {
  const items = [];
  const seen = new Set();
  const lines = text.split("\n");
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    const where = `queue line ${i + 1}`;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      throw new QueueError(`${where}: not valid JSON`);
    }
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
      throw new QueueError(`${where}: not an object`);
    }
    for (const key of Object.keys(obj)) {
      if (!FIELDS.includes(key)) throw new QueueError(`${where}: unknown field ${key}`);
    }
    if (typeof obj.id !== "string" || !ID_RE.test(obj.id)) throw new QueueError(`${where}: bad id`);
    if (seen.has(obj.id)) throw new QueueError(`${where}: duplicate id ${obj.id}`);
    seen.add(obj.id);
    const w = `${where} (${obj.id})`;
    if (typeof obj.platform !== "string" || !PLATFORM_RE.test(obj.platform)) throw new QueueError(`${w}: bad platform`);
    if (!KINDS.includes(obj.kind)) throw new QueueError(`${w}: unknown kind`);
    if (!STATUSES.includes(obj.status)) throw new QueueError(`${w}: unknown status`);
    const ai = obj.ai_assisted ?? "unknown";
    if (!AI_VALUES.includes(ai)) throw new QueueError(`${w}: ai_assisted must be yes, no or unknown`);
    let media = obj.media ?? [];
    if (!Array.isArray(media) || !media.every((m) => typeof m === "string" && m.length > 0)) {
      throw new QueueError(`${w}: media must be a list of file names`);
    }
    const date = textOrNull(obj, "earliest_date", w);
    if (date !== null && (!DATE_RE.test(date) || !isRealDate(date))) throw new QueueError(`${w}: earliest_date must be a real YYYY-MM-DD date`);
    const sha = textOrNull(obj, "approved_sha256", w);
    if (sha !== null && !SHA_RE.test(sha)) throw new QueueError(`${w}: approved_sha256 must be 64 hex characters`);
    const item = {
      id: obj.id,
      platform: obj.platform,
      kind: obj.kind,
      source: textOrNull(obj, "source", w),
      title: textOrNull(obj, "title", w),
      body_file: textOrNull(obj, "body_file", w),
      link: textOrNull(obj, "link", w),
      media: [...media],
      earliest_date: date,
      status: obj.status,
      approved_sha256: sha,
      posted_url: textOrNull(obj, "posted_url", w),
      posted_at: textOrNull(obj, "posted_at", w),
      ai_assisted: ai,
      notes: textOrNull(obj, "notes", w),
    };
    if (item.status === "approved" && !item.approved_sha256) throw new QueueError(`${w}: approved needs approved_sha256`);
    if (item.status === "posted" && !item.posted_url) throw new QueueError(`${w}: posted needs posted_url`);
    items.push(item);
  });
  return items;
}

export function serializeQueue(items) {
  return items.map((it) => JSON.stringify(Object.fromEntries(FIELDS.map((f) => [f, it[f] ?? null])))).join("\n") + (items.length ? "\n" : "");
}

// The hash covers exactly what will be posted: title, link and body.
export function contentHash({ title, link, body }) {
  return createHash("sha256").update(JSON.stringify({ title: title ?? "", link: link ?? "", body: body ?? "" })).digest("hex");
}

// An approved item whose content changed is a drafted item again.
export function effectiveStatus(item, currentHash) {
  if (item.status === "approved" && item.approved_sha256 !== currentHash) return "drafted";
  return item.status;
}
