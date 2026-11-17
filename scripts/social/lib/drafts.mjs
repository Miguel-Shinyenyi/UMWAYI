// draft: start a body file from a template. fanout: one source, one queue item and one
// draft per platform. Neither posts anything, and neither overwrites a file or an item.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { fileURLToPath } from "node:url";
import { readQueue, writeQueue, safeInside } from "./io.mjs";
import { QueueError } from "./queue.mjs";

const TEMPLATE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "templates");
export const SITE_BASE = "https://Miguel-Shinyenyi.github.io/miguel-site";

// platform -> what a draft for it is, who posts it, and which template starts it.
// "hackernews" picks showhn-comment for a repository and hn-link-comment for an article.
export const PLATFORMS = {
  threads: { kind: "post", mode: "browser", template: "threads-post" },
  linkedin: { kind: "post", mode: "browser", template: "linkedin-post" },
  indiehackers: { kind: "post", mode: "browser", template: "indiehackers-post" },
  reddit: { kind: "post", mode: "manual", template: "reddit-post" },
  hackernews: { kind: "post", mode: "manual", template: { repo: "showhn-comment", article: "hn-link-comment" } },
  discord: { kind: "post", mode: "manual", template: "discord-post" },
  producthunt: { kind: "listing", mode: "browser", template: "producthunt-comment" },
  youtube: { kind: "video", mode: "browser", template: "youtube-description" },
  peerlist: { kind: "listing", mode: "browser", template: "directory-listing" },
  devhunt: { kind: "listing", mode: "browser", template: "directory-listing" },
  futuretools: { kind: "listing", mode: "browser", template: "directory-listing" },
  uneed: { kind: "listing", mode: "browser", template: "directory-listing" },
  microlaunch: { kind: "listing", mode: "browser", template: "directory-listing" },
  betalist: { kind: "listing", mode: "manual", template: "directory-listing" },
};

export function sourceType(source) {
  return source && source.startsWith("https://") ? "repo" : "article";
}

export function templateFor(platform, kind, source) {
  const def = PLATFORMS[platform];
  if (kind === "reply_draft") return "reply-draft";
  if (!def) return null;
  return typeof def.template === "string" ? def.template : def.template[sourceType(source)];
}

function readTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATE_DIR, `${name}.txt`), "utf8");
}

function articleUrl(source) {
  const m = /^site\/(tech|philosophy|journals|projects)\/([a-z0-9-]+)\.md$/.exec(source);
  if (!m) return null;
  const section = m[1] === "journals" ? "journal" : m[1];
  return `${SITE_BASE}/${section}/${m[2]}/`;
}

function guidance(env, item) {
  const lines = [];
  let limits = null;
  try {
    limits = JSON.parse(fs.readFileSync(path.join(env.socialDir, "limits.json"), "utf8")).platforms?.[item.platform] ?? null;
  } catch { /* no limits file yet */ }
  const lim = (k) => {
    const v = limits?.[k];
    if (!v || typeof v.value !== "number") return "unknown";
    return `${v.value}${v.checked ? "" : " (not confirmed)"}`;
  };
  lines.push(`limits for ${item.platform}: title ${lim("title_max")}, body ${lim("body_max")}`);
  lines.push("rules: no em dash, no markdown, no asterisks, no hashtags unless the platform entry allows them, bullet lines start with the bullet character, short sentences, active voice");
  lines.push("every [[placeholder]] must be replaced, or lint fails");
  lines.push("claims: only what the claims list allows; say tested on Claude Code only for the Agensi skills; no price until Miguel confirms");
  return lines;
}

export function draft(env, id) {
  const items = readQueue(env);
  const item = items.find((i) => i.id === id);
  if (!item) return { code: 64, out: [`no item with id ${id}`] };
  if (item.status !== "idea") return { code: 2, out: [`FAIL ${id} is ${item.status}; a draft is started only from idea`] };
  const name = templateFor(item.platform, item.kind, item.source);
  if (!name) return { code: 3, out: [`CANNOT DECIDE no template for ${item.platform}`] };
  const rel = item.body_file ?? `drafts/${id}.txt`;
  const real = safeInside(env.socialDir, rel);
  if (!real) return { code: 2, out: [`FAIL body_file ${rel} is outside the private folder`] };
  if (fs.existsSync(real)) return { code: 2, out: [`FAIL ${rel} already exists; it is not overwritten`] };
  let text = readTemplate(name);
  if (item.link) text = text.replaceAll("[[Link]]", item.link).replaceAll("[[Link to the piece]]", item.link);
  fs.mkdirSync(path.dirname(real), { recursive: true });
  fs.writeFileSync(real, text, { mode: 0o600, flag: "wx" });
  item.body_file = rel;
  item.status = "drafted";
  writeQueue(env, items);
  return { code: 0, out: [`started ${rel} from template ${name}; status is now drafted`, ...guidance(env, item), `next: fill the text, then run: social lint ${id}`] };
}

export function fanout(env, source, platforms, date) {
  if (!source || !platforms.length) return { code: 64, out: ["fanout needs a source and --platforms a,b,c"] };
  for (const p of platforms) if (!PLATFORMS[p]) return { code: 64, out: [`unknown platform ${p}; known: ${Object.keys(PLATFORMS).join(", ")}`] };
  if (new Set(platforms).size !== platforms.length) return { code: 64, out: ["a platform is listed twice; one post per platform"] };

  let slug;
  let link = null;
  if (source.startsWith("https://")) {
    if (!(source === "https://github.com/Miguel-Shinyenyi" || source.startsWith("https://github.com/Miguel-Shinyenyi/"))) {
      return { code: 2, out: [`FAIL ${source} is not a repository under github.com/Miguel-Shinyenyi`] };
    }
    slug = source.split("/").filter(Boolean).pop().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    link = source;
  } else {
    const real = safeInside(path.join(env.hubDir, "site"), source.startsWith("site/") ? source.slice(5) : source);
    if (!real || !fs.existsSync(real)) return { code: 2, out: [`FAIL ${source} is not a file under the hub's site folder`] };
    let data;
    try {
      data = matter(fs.readFileSync(real, "utf8")).data;
    } catch {
      return { code: 2, out: [`FAIL ${source} has front matter that cannot be read`] };
    }
    if (data.draft !== false) return { code: 2, out: [`FAIL ${source} does not have draft: false, so it cannot be a source`] };
    slug = path.basename(real, ".md").toLowerCase();
    link = articleUrl(source.startsWith("site/") ? source : `site/${source}`);
  }
  slug = slug.slice(0, 40).replace(/-+$/, "");

  const items = readQueue(env);
  const made = [];
  for (const platform of platforms) {
    const id = `${slug}-${platform}`.slice(0, 64);
    if (items.some((i) => i.id === id)) return { code: 2, out: [`FAIL an item with id ${id} already exists; nothing was created`] };
    const rel = `drafts/${id}.txt`;
    const real = safeInside(env.socialDir, rel);
    if (!real || fs.existsSync(real)) return { code: 2, out: [`FAIL ${rel} already exists or is not allowed; nothing was created`] };
    made.push({ platform, id, rel, real, def: PLATFORMS[platform] });
  }
  const out = [];
  for (const m of made) {
    const name = templateFor(m.platform, m.def.kind, source);
    let text = readTemplate(name);
    if (link) text = text.replaceAll("[[Link]]", link).replaceAll("[[Link to the piece]]", link);
    fs.mkdirSync(path.dirname(m.real), { recursive: true });
    fs.writeFileSync(m.real, text, { mode: 0o600, flag: "wx" });
    items.push({
      id: m.id, platform: m.platform, kind: m.def.kind, source, title: null, body_file: m.rel, link,
      media: [], earliest_date: date ?? null, status: "drafted", approved_sha256: null, posted_url: null,
      posted_at: null, ai_assisted: "unknown", notes: "Created by fanout. Write each text for its own platform; do not paste one text everywhere.", mode: m.def.mode,
    });
    out.push(`${m.id} [${m.def.mode}] from ${name}`);
  }
  writeQueue(env, items);
  return { code: 0, out: [`created ${made.length} drafted items from ${source}:`, ...out.map((l) => `* ${l}`), "each text is a template with [[placeholders]] and fails lint until it is written", "next: social next"] };
}
