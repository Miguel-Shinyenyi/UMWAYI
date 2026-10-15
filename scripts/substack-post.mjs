// scripts/substack-post.mjs
//
// Publishes site/philosophy/** and site/tech/** articles to Miguel's Substack from his own
// machine, using his session cookie. Substack has no public publishing API, so this calls the
// same undocumented endpoints Substack's web editor calls (observed 2026-10-15, see
// docs/substack-setup.md). They can change without notice. Not run from GitHub Actions.
//
// Usage (from scripts/):
//   npm run substack -- --dry-run            list what would happen, send nothing
//   npm run substack -- --only <slug> --draft   create a draft, do not publish
//   npm run substack                          publish every article not yet recorded, no email
// Flags: --check (cookie check only)  --dry-run  --only <slug>  --draft  --draft-id <id>  --trace  --gap-seconds <n>
//
// The cookie is read from ~/.config/umwayi/substack.env (SUBSTACK_SID=...). It is never
// printed, logged or committed. Requires Node 20+.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { markdownToDoc, imageNode, collectImages, UnsupportedMarkdown } from "./lib/substack-convert.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const RECORD_FILE = path.join(HERE, "substack-posted.json");
const ENV_FILE = process.env.SUBSTACK_ENV_FILE || path.join(os.homedir(), ".config", "umwayi", "substack.env");
const DEFAULT_SITE_BASE_URL = "https://miguel-shinyenyi.github.io/miguel-site";
const DEFAULT_PUBLICATION_URL = "https://shinyenyi.substack.com";
const CATEGORIES = [
  { dir: "site/philosophy", category: "philosophy" },
  { dir: "site/tech", category: "tech" },
];
const DEFAULT_GAP_SECONDS = 60;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- args -------------------------------------------------------------------------------

function parseArgs(argv) {
  const a = { check: false, dryRun: false, draft: false, trace: false, only: null, draftId: null, gapSeconds: DEFAULT_GAP_SECONDS };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--check") a.check = true;
    else if (k === "--dry-run") a.dryRun = true;
    else if (k === "--draft") a.draft = true;
    else if (k === "--trace") a.trace = true;
    else if (k === "--only") a.only = argv[++i];
    else if (k === "--draft-id") a.draftId = argv[++i];
    else if (k === "--gap-seconds") a.gapSeconds = Number(argv[++i]);
    else fail(`Unknown argument: ${k}`, 64);
  }
  if (a.draftId && !a.only) fail("--draft-id needs --only <slug>.", 64);
  if (!(a.gapSeconds >= DEFAULT_GAP_SECONDS)) fail(`--gap-seconds must be at least ${DEFAULT_GAP_SECONDS}.`, 64);
  return a;
}

function fail(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

// ---- env and cookie ---------------------------------------------------------------------

function loadEnv() {
  if (!existsSync(ENV_FILE)) {
    fail(
      `No env file at ${ENV_FILE}.\nCreate it yourself with a line SUBSTACK_SID=<your substack.sid cookie value>,\nthen run: chmod 600 ${ENV_FILE}\nDo not paste the value into a chat or a commit.`,
      3
    );
  }
  const mode = statSync(ENV_FILE).mode & 0o777;
  if (mode & 0o077) fail(`${ENV_FILE} is readable by other users (mode ${mode.toString(8)}). Run: chmod 600 ${ENV_FILE}`, 3);
  const env = {};
  for (const line of readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !line.trim().startsWith("#")) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
  }
  if (!env.SUBSTACK_SID) fail(`SUBSTACK_SID is missing in ${ENV_FILE}.`, 3);
  return env;
}

// ---- http -------------------------------------------------------------------------------

class AuthError extends Error {}

function makeClient({ sid, base, trace }) {
  const scrub = (s) => String(s).split(sid).join("[cookie]");
  const traceReq = (method, p, body) => {
    if (!trace || method === "GET") return;
    const shown =
      body && typeof body === "object"
        ? Object.fromEntries(
            Object.entries(body).map(([k, v]) => [k, typeof v === "string" && v.length > 80 ? `[${v.length} chars]` : v])
          )
        : body;
    console.log(`TRACE ${method} ${p} ${shown === undefined ? "" : JSON.stringify(shown)}`);
  };

  async function call(method, p, body) {
    traceReq(method, p, body);
    const res = await fetch(base + p, {
      method,
      redirect: "manual",
      headers: {
        cookie: `substack.sid=${sid}`,
        accept: "application/json",
        origin: base,
        referer: `${base}/publish`,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    if (res.status === 401 || res.status === 403 || (res.status >= 300 && res.status < 400)) {
      throw new AuthError(
        `Substack answered ${res.status} to ${method} ${p}. The cookie has most likely expired or been refused. Do not retry in a loop. Renew it: see docs/substack-setup.md, "Renewing the cookie".`
      );
    }
    if (!res.ok) throw new Error(`${method} ${p} -> ${res.status}: ${scrub(text).slice(0, 300)}`);
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { raw: scrub(text).slice(0, 300) };
    }
  }
  return { get: (p) => call("GET", p), post: (p, b) => call("POST", p, b ?? {}), put: (p, b) => call("PUT", p, b) };
}

// B1: one harmless read of Miguel's own publication data (post counts). Fails on 401/403.
async function checkCookie(api) {
  await api.get("/api/v1/post_management/counts?query=");
}

// ---- articles ---------------------------------------------------------------------------

function loadRecord() {
  return existsSync(RECORD_FILE) ? JSON.parse(readFileSync(RECORD_FILE, "utf8")) : {};
}

function saveRecord(rec) {
  const sorted = Object.fromEntries(Object.entries(rec).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(RECORD_FILE, JSON.stringify(sorted, null, 2) + "\n");
}

function scanArticles() {
  const out = [];
  for (const { dir, category } of CATEGORIES) {
    const abs = path.join(REPO, dir);
    if (!existsSync(abs)) continue;
    for (const file of readdirSync(abs).filter((f) => f.endsWith(".md"))) {
      const parsed = matter(readFileSync(path.join(abs, file), "utf8"));
      const slug = file.replace(/\.md$/, "");
      out.push({ category, slug, key: `${category}/${slug}`, fm: parsed.data, body: parsed.content.trim(), date: String(parsed.data.date ?? "") });
    }
  }
  // Oldest first, so the newest article is posted last.
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.key.localeCompare(b.key));
}

function plan(articles, record, only) {
  return articles.map((a) => {
    let action = "create";
    let why = "";
    if (a.fm.draft) (action = "skip"), (why = "draft: true");
    else if (record[a.key]) (action = "skip"), (why = `already posted ${record[a.key]}`);
    else if (only && a.slug !== only) (action = "skip"), (why = "not selected by --only");
    return { ...a, action, why };
  });
}

function illustrationPath(a) {
  return a.fm.illustration ? path.join(REPO, "site", "illustrations", a.fm.illustration) : null;
}

function buildBody(a, siteBase, images) {
  const canonical = `${siteBase.replace(/\/$/, "")}/${a.category}/${a.slug}/`;
  const doc = markdownToDoc(a.body, { siteBase, images });
  const lead = [];
  if (images.__illustration) lead.push(imageNode(images.__illustration, a.fm.illustrationAlt));
  const footer = {
    type: "paragraph",
    attrs: { textAlign: null },
    content: [
      { type: "text", text: "Originally published at " },
      {
        type: "text",
        text: canonical,
        marks: [{ type: "link", attrs: { href: canonical, target: "_blank", rel: "noopener noreferrer nofollow", class: null } }],
      },
    ],
  };
  return { type: "doc", content: [...lead, ...doc.content, footer] };
}

// The two requests that decide whether subscribers are emailed. Used for real and for --dry-run.
function buildDraftSave(a, doc, bylines) {
  return {
    draft_title: a.fm.title,
    draft_subtitle: a.fm.summary ?? "",
    draft_body: JSON.stringify(doc),
    section_chosen: false,
    draft_section_id: null,
    draft_bylines: bylines,
    audience: "everyone",
    should_send_email: false,
  };
}
const buildPublishRequest = () => ({ send: false, saved_segment_id: null });

// The create-draft call needs the author's id in draft_bylines. Read it from the author
// byline on an existing draft or published post; SUBSTACK_USER_ID in the env file overrides.
async function discoverUserId(api, env) {
  if (env.SUBSTACK_USER_ID) return Number(env.SUBSTACK_USER_ID);
  for (const list of ["drafts?offset=0&limit=5&order_by=draft_updated_at&order_direction=desc", "published?offset=0&limit=5&order_by=post_date&order_direction=desc"]) {
    const res = await api.get(`/api/v1/post_management/${list}`);
    for (const p of res.posts ?? []) {
      const id = (p.draftBylines ?? p.publishedBylines ?? p.bylines ?? [])[0]?.id;
      if (id) return id;
    }
  }
  throw new Error("Could not find the author id from existing posts. Add SUBSTACK_USER_ID=<your numeric id> to the env file.");
}

async function uploadImage(api, filePath, postId) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp" }[ext];
  if (!mime) throw new Error(`Unsupported image type: ${filePath}`);
  const data = readFileSync(filePath).toString("base64");
  const info = await api.post("/api/v1/image", { image: `data:${mime};base64,${data}`, postId });
  if (!info.url) throw new Error(`Image upload returned no url for ${path.basename(filePath)}`);
  return info;
}

async function syncTags(api, postId, tags) {
  if (!tags.length) return;
  const existing = await api.get("/api/v1/publication/post-tag");
  const byName = new Map((Array.isArray(existing) ? existing : []).map((t) => [t.name.toLowerCase(), t]));
  for (const name of tags) {
    let tag = byName.get(String(name).toLowerCase());
    if (!tag) {
      tag = await api.post("/api/v1/publication/post-tag", { name });
      byName.set(String(name).toLowerCase(), tag);
    }
    try {
      await api.post(`/api/v1/post/${postId}/tag/${tag.id}`);
    } catch (e) {
      // A reused draft already has its tags. Substack answers 400 "Tag already set".
      if (!String(e.message).includes("Tag already set")) throw e;
    }
  }
}

async function postOne(api, a, { base, siteBase, draftOnly, draftId, userId }) {
  let draft;
  if (draftId) {
    draft = await api.get(`/api/v1/drafts/${draftId}`);
    draft.id = draft.id ?? Number(draftId);
  } else {
    draft = await api.post("/api/v1/drafts", { type: "newsletter", audience: "everyone", draft_bylines: [{ id: userId, is_guest: false }] });
  }
  const postId = draft.id;
  if (!postId) throw new Error("Draft creation returned no id.");
  const bylines = [{ id: userId, is_guest: false }];

  const images = {};
  const illo = illustrationPath(a);
  if (illo) images.__illustration = await uploadImage(api, illo, postId);
  for (const { src } of collectImages(a.body)) {
    const file = path.resolve(REPO, "site", src);
    images[src] = await uploadImage(api, file, postId);
  }
  for (const info of Object.values(images)) {
    info.internalRedirect = `${base}/i/${postId}_img_${encodeURIComponent(info.url)}`;
  }

  const doc = buildBody(a, siteBase, images);
  await api.put(`/api/v1/drafts/${postId}`, buildDraftSave(a, doc, bylines));
  await syncTags(api, postId, a.fm.tags || []);

  const saved = await api.get(`/api/v1/drafts/${postId}`);
  if (saved.should_send_email !== false) {
    throw new Error(`Refusing to go on: the draft ${postId} reports should_send_email=${saved.should_send_email}, not false.`);
  }
  if (draftOnly) return { postId, url: `${base}/publish/post/${postId}`, published: false };

  await api.get(`/api/v1/drafts/${postId}/prepublish`);
  await api.post(`/api/v1/drafts/${postId}/publish`, buildPublishRequest());
  const after = await api.get(`/api/v1/drafts/${postId}`);
  if (!after.is_published) throw new Error(`Publish call returned but draft ${postId} is not published.`);
  if (after.email_sent_at) throw new Error(`Post ${postId} shows email_sent_at=${after.email_sent_at}. Check Substack now.`);
  return { postId, url: `${base}/p/${after.slug}`, published: true };
}

// ---- main -------------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const record = loadRecord();
  const siteBase = (process.env.SITE_BASE_URL || DEFAULT_SITE_BASE_URL).replace(/\/$/, "");
  const rows = plan(scanArticles(), record, args.only);

  if (args.only && !rows.some((r) => r.slug === args.only)) fail(`No article with slug "${args.only}".`, 64);

  if (args.dryRun) {
    for (const r of rows) {
      let conv = "";
      if (r.action === "create") {
        try {
          const fake = { url: "https://example.invalid/x.svg", bytes: 0, contentType: "image/svg+xml" };
          const imgs = { __illustration: fake };
          for (const { src } of collectImages(r.body)) imgs[src] = fake;
          const doc = buildBody(r, siteBase, imgs);
          conv = `  [converts: ${doc.content.length} blocks]`;
        } catch (e) {
          conv = `  [CANNOT CONVERT: ${e.message}]`;
        }
      }
      console.log(`${r.action.padEnd(6)} ${r.key}${r.why ? `  (${r.why})` : ""}${conv}`);
    }
    const todo = rows.filter((r) => r.action === "create");
    console.log(`\n${todo.length} to create, ${rows.length - todo.length} to skip. Nothing was sent.`);
    if (todo.length) {
      const first = todo[0];
      console.log(`\nRequests for ${first.key}, in order (bodies shortened):`);
      console.log("  POST /api/v1/drafts   {type, audience}");
      if (illustrationPath(first)) console.log("  POST /api/v1/image    {image: data URI of the illustration, postId}");
      console.log(`  PUT  /api/v1/drafts/{id}   ${JSON.stringify({ ...buildDraftSave(first, { type: "doc", content: [] }, []), draft_body: "[ProseMirror JSON]" })}`);
      console.log(`  POST /api/v1/publication/post-tag and POST /api/v1/post/{id}/tag/{tagId} for each of: ${(first.fm.tags || []).join(", ") || "(no tags)"}`);
      if (!args.draft) {
        console.log("  GET  /api/v1/drafts/{id}/prepublish");
        console.log(`  POST /api/v1/drafts/{id}/publish   ${JSON.stringify(buildPublishRequest())}`);
      } else {
        console.log("  (--draft: stops here, no publish request)");
      }
    }
    return;
  }

  const todo = rows.filter((r) => r.action === "create");
  if (!todo.length && !args.check) {
    console.log("Nothing new to post.");
    return;
  }

  const env = loadEnv();
  const base = (env.SUBSTACK_PUBLICATION_URL || DEFAULT_PUBLICATION_URL).replace(/\/$/, "");
  const api = makeClient({ sid: env.SUBSTACK_SID, base, trace: args.trace });
  try {
    await checkCookie(api);
  } catch (e) {
    if (e instanceof AuthError) fail(e.message, 2);
    throw e;
  }
  console.log("Cookie accepted.");
  if (args.check) return;
  const userId = await discoverUserId(api, env);

  let posted = 0;
  for (const a of todo) {
    if (posted > 0 && !args.draft) {
      console.log(`Waiting ${args.gapSeconds}s before the next post.`);
      await sleep(args.gapSeconds * 1000);
    }
    try {
      const r = await postOne(api, a, { base, siteBase, draftOnly: args.draft, draftId: args.draftId, userId });
      if (r.published) {
        record[a.key] = r.url;
        saveRecord(record);
        console.log(`published ${a.key} -> ${r.url} (no email)`);
      } else {
        console.log(`draft ${a.key} -> ${r.url}`);
      }
      posted++;
    } catch (e) {
      if (e instanceof AuthError) fail(e.message, 2);
      if (e instanceof UnsupportedMarkdown) fail(`${a.key}: cannot convert, ${e.message}. Nothing was dropped; fix the article or the converter.`, 4);
      console.error(`FAILED ${a.key}: ${e.message}`);
      console.error("Stopping at the first error.");
      process.exit(1);
    }
  }
}

main().catch((e) => {
  console.error(`Unexpected error: ${e.message}`);
  process.exit(1);
});
