import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "../social/cli.mjs";
import { makeEnv } from "../social/lib/io.mjs";
import { similarity } from "../social/lib/checks.mjs";
import { PLATFORMS, templateFor } from "../social/lib/drafts.mjs";

const NOW = new Date("2026-11-20T10:00:00Z");
const TEMPLATES = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "social", "templates");
const REPO = "https://github.com/Miguel-Shinyenyi/umwayi-os";

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "social-drafts-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const hub = path.join(root, "hub");
  const soc = path.join(root, "private");
  fs.mkdirSync(path.join(hub, "site", "tech"), { recursive: true });
  fs.mkdirSync(path.join(soc, "drafts"), { recursive: true });
  fs.writeFileSync(path.join(hub, "site", "tech", "the-ci-wait-halved.md"), "---\ndraft: false\n---\n");
  fs.writeFileSync(path.join(hub, "site", "tech", "still-draft.md"), "---\ndraft: true\n---\n");
  const lim = (v) => ({ value: v, checked: true, url: "https://example.com/r", date: "2026-11-17" });
  const plat = {};
  for (const p of Object.keys(PLATFORMS)) plat[p] = { hashtags_allowed: false, title_max: lim(300), body_max: lim(3000) };
  fs.writeFileSync(path.join(soc, "limits.json"), JSON.stringify({ platforms: plat }));
  fs.writeFileSync(path.join(soc, "banned-words.txt"), "synergy\n");
  fs.writeFileSync(path.join(soc, "claims-blocklist.txt"), "secure\n");
  fs.writeFileSync(path.join(soc, "company-blocklist.txt"), "Acme Hiring\n");
  fs.writeFileSync(path.join(soc, "link-allowlist.txt"), "https://github.com/Miguel-Shinyenyi\nhttps://Miguel-Shinyenyi.github.io/miguel-site\n");
  const env = makeEnv({ socialDir: soc, hubDir: hub });
  const queue = (...items) => fs.writeFileSync(path.join(soc, "queue.jsonl"), items.map((i) => JSON.stringify(i)).join("\n") + "\n");
  const readQueue = () => fs.readFileSync(path.join(soc, "queue.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const read = (rel) => fs.readFileSync(path.join(soc, rel), "utf8");
  const write = (rel, text) => fs.writeFileSync(path.join(soc, rel), text);
  return { hub, soc, env, queue, readQueue, read, write, cli: (...a) => run(a, env, NOW) };
}
const idea = (over = {}) => ({ id: "x1", platform: "reddit", kind: "post", source: REPO, status: "idea", ai_assisted: "no", mode: "manual", ...over });

test("every template exists, uses only [[placeholders]] and breaks none of the style rules", () => {
  for (const [name, def] of Object.entries(PLATFORMS)) {
    const names = typeof def.template === "string" ? [def.template] : Object.values(def.template);
    for (const n of names) assert.ok(fs.existsSync(path.join(TEMPLATES, `${n}.txt`)), `${name}: ${n}`);
  }
  for (const f of fs.readdirSync(TEMPLATES)) {
    const text = fs.readFileSync(path.join(TEMPLATES, f), "utf8");
    assert.ok(!text.includes("—"), `${f} has an em dash`);
    assert.ok(!/[*`]/.test(text), `${f} has markdown`);
    assert.ok(!/^\s*[-+]\s/m.test(text), `${f} has a hyphen bullet`);
    assert.ok(!/(^|\s)#\p{L}/u.test(text), `${f} has a hashtag`);
    assert.ok(/\[\[[^\]]+\]\]/.test(text), `${f} has no placeholder`);
  }
});

test("draft starts a body file from the template, sets drafted and shows the guidance", (t) => {
  const f = fixture(t);
  f.queue(idea());
  const r = f.cli("draft", "x1");
  assert.equal(r.code, 0, r.out.join("\n"));
  assert.match(r.out[0], /started drafts\/x1.txt from template reddit-post; status is now drafted/);
  assert.match(r.out.join("\n"), /limits for reddit: title 300, body 3000/);
  assert.match(r.out.join("\n"), /every \[\[placeholder\]\] must be replaced/);
  assert.match(f.read("drafts/x1.txt"), /I built \[\[what it is\]\]/);
  const q = f.readQueue()[0];
  assert.equal(q.status, "drafted");
  assert.equal(q.body_file, "drafts/x1.txt");
});

test("draft never overwrites, starts only from idea, and refuses unknown items and platforms", (t) => {
  const f = fixture(t);
  f.queue(idea());
  f.write("drafts/x1.txt", "my own text, do not touch");
  assert.equal(f.cli("draft", "x1").code, 2);
  assert.equal(f.read("drafts/x1.txt"), "my own text, do not touch");
  fs.rmSync(path.join(f.soc, "drafts", "x1.txt"));
  f.queue(idea({ status: "drafted" }));
  const notIdea = f.cli("draft", "x1");
  assert.equal(notIdea.code, 2);
  assert.match(notIdea.out.join(), /is drafted; a draft is started only from idea/);
  assert.ok(!fs.existsSync(path.join(f.soc, "drafts", "x1.txt")));
  assert.equal(f.cli("draft", "nope").code, 64);
  f.queue(idea({ platform: "myspace" }));
  assert.equal(f.cli("draft", "x1").code, 3);
  f.queue(idea({ body_file: "../escape.txt" }));
  assert.equal(f.cli("draft", "x1").code, 2);
});

test("draft fills the link placeholder when the item has a link", (t) => {
  const f = fixture(t);
  f.queue(idea({ platform: "threads", link: REPO, mode: "browser" }));
  f.cli("draft", "x1");
  assert.ok(f.read("drafts/x1.txt").includes(REPO));
  assert.ok(!f.read("drafts/x1.txt").includes("[[Link]]"));
});

test("hacker news gets a Show HN comment for a repo and a link comment for an article", () => {
  assert.equal(templateFor("hackernews", "post", REPO), "showhn-comment");
  assert.equal(templateFor("hackernews", "post", "site/tech/the-ci-wait-halved.md"), "hn-link-comment");
  assert.equal(templateFor("reddit", "reply_draft", null), "reply-draft");
  assert.equal(templateFor("myspace", "post", REPO), null);
});

test("a fresh draft cannot pass lint until every placeholder is replaced", (t) => {
  const f = fixture(t);
  f.queue(idea({ platform: "threads", mode: "browser" }));
  f.cli("draft", "x1");
  const r = f.cli("lint", "x1");
  assert.equal(r.code, 2);
  assert.match(r.out.join("\n"), /placeholder: "\[\[Hook/);
  f.write("drafts/x1.txt", "• One honest line about the tool.\n• A second honest line about its limit.");
  assert.equal(f.cli("lint", "x1").code, 0);
  f.write("drafts/x1.txt", "• One honest line.\n[[still to do]]");
  assert.equal(f.cli("lint", "x1").code, 2);
});

test("similarity: same words score high, different words low, short texts are not compared", () => {
  const a = "I built a small rules gate for coding agents and it answers yes no or ask me first for every action";
  assert.ok(similarity(a, a) > 0.99);
  assert.ok(similarity(a, "A recipe for lemon cake needs flour sugar butter eggs and plenty of lemon zest") < 0.2);
  assert.equal(similarity("too short", "too short"), 0);
});

test("a post that copies another post on the same platform fails, other platforms and kinds do not", (t) => {
  const f = fixture(t);
  const text = "• I built a small rules gate for coding agents and it answers yes no or ask me first for every action it sees.";
  f.write("drafts/a.txt", text);
  f.write("drafts/b.txt", text + " Tell me what you think.");
  f.queue(
    idea({ id: "a", platform: "reddit", status: "drafted", body_file: "drafts/a.txt" }),
    idea({ id: "b", platform: "reddit", status: "drafted", body_file: "drafts/b.txt" }),
  );
  const r = f.cli("lint", "b");
  assert.equal(r.code, 2);
  assert.match(r.out.join("\n"), /copy: \d+ percent the same as a on reddit/);
  // a different platform is fine
  f.queue(
    idea({ id: "a", platform: "reddit", status: "drafted", body_file: "drafts/a.txt" }),
    idea({ id: "b", platform: "threads", mode: "browser", status: "drafted", body_file: "drafts/b.txt" }),
  );
  assert.equal(f.cli("lint", "b").code, 0);
  // a skipped item and a different kind are ignored
  f.queue(
    idea({ id: "a", platform: "reddit", status: "skipped", body_file: "drafts/a.txt" }),
    idea({ id: "b", platform: "reddit", status: "drafted", body_file: "drafts/b.txt" }),
  );
  assert.equal(f.cli("lint", "b").code, 0);
  f.queue(
    idea({ id: "a", platform: "reddit", kind: "reply_draft", status: "drafted", body_file: "drafts/a.txt" }),
    idea({ id: "b", platform: "reddit", status: "drafted", body_file: "drafts/b.txt" }),
  );
  assert.equal(f.cli("lint", "b").code, 0);
  // and a really different text passes
  f.write("drafts/b.txt", "• A lemon cake needs flour, sugar and butter, and I baked one on Sunday after a long walk in the rain.");
  f.queue(
    idea({ id: "a", platform: "reddit", status: "drafted", body_file: "drafts/a.txt" }),
    idea({ id: "b", platform: "reddit", status: "drafted", body_file: "drafts/b.txt" }),
  );
  assert.equal(f.cli("lint", "b").code, 0);
});

test("fanout from a published article makes one drafted item and one template file per platform", (t) => {
  const f = fixture(t);
  const r = f.cli("fanout", "site/tech/the-ci-wait-halved.md", "--platforms", "threads,reddit,hackernews,linkedin", "--date", "2026-11-24");
  assert.equal(r.code, 0, r.out.join("\n"));
  const q = f.readQueue();
  assert.deepEqual(q.map((i) => i.id), ["the-ci-wait-halved-threads", "the-ci-wait-halved-reddit", "the-ci-wait-halved-hackernews", "the-ci-wait-halved-linkedin"]);
  assert.deepEqual(q.map((i) => i.mode), ["browser", "manual", "manual", "browser"]);
  for (const i of q) {
    assert.equal(i.status, "drafted");
    assert.equal(i.earliest_date, "2026-11-24");
    assert.equal(i.link, "https://Miguel-Shinyenyi.github.io/miguel-site/tech/the-ci-wait-halved/");
    assert.ok(fs.existsSync(path.join(f.soc, i.body_file)));
  }
  assert.match(f.read("drafts/the-ci-wait-halved-hackernews.txt"), /Link to the piece|miguel-site\/tech/);
  assert.ok(f.read("drafts/the-ci-wait-halved-threads.txt").includes("miguel-site/tech/the-ci-wait-halved/"));
  assert.equal(f.cli("lint", "the-ci-wait-halved-threads").code, 2);
});

test("fanout from a repo uses the Show HN template and the repo link", (t) => {
  const f = fixture(t);
  assert.equal(f.cli("fanout", REPO, "--platforms", "hackernews,producthunt").code, 0);
  const q = f.readQueue();
  assert.equal(q[0].id, "umwayi-os-hackernews");
  assert.match(f.read("drafts/umwayi-os-hackernews.txt"), /You can try it without signing up/);
  assert.match(f.read("drafts/umwayi-os-producthunt.txt"), /Ask for feedback, never for upvotes/);
  assert.equal(q[0].link, REPO);
  assert.equal(q[1].kind, "listing");
});

test("fanout refuses a draft true source, a source outside the site, bad input, and changes nothing on a refusal", (t) => {
  const f = fixture(t);
  f.queue(idea({ id: "the-ci-wait-halved-reddit", status: "idea" }));
  const before = f.readQueue();
  assert.equal(f.cli("fanout", "site/tech/still-draft.md", "--platforms", "threads").code, 2);
  for (const bad of ["site/tech/nope.md", "../secret.md", "/etc/hosts"]) {
    const r = f.cli("fanout", bad, "--platforms", "threads");
    assert.equal(r.code, 2);
    assert.match(r.out.join(), /is not a file under the hub's site folder/);
  }
  assert.equal(f.cli("fanout", "https://github.com/someone-else/repo", "--platforms", "threads").code, 2);
  assert.equal(f.cli("fanout", "site/tech/the-ci-wait-halved.md", "--platforms", "threads,myspace").code, 64);
  assert.equal(f.cli("fanout", "site/tech/the-ci-wait-halved.md", "--platforms", "threads,threads").code, 64);
  assert.equal(f.cli("fanout", "site/tech/the-ci-wait-halved.md").code, 64);
  assert.equal(f.cli("fanout", "site/tech/the-ci-wait-halved.md", "--platforms", "threads", "--date", "soon").code, 64);
  // an existing id stops the whole fanout, so threads is not created either
  assert.equal(f.cli("fanout", "site/tech/the-ci-wait-halved.md", "--platforms", "threads,reddit").code, 2);
  assert.deepEqual(f.readQueue(), before);
  assert.ok(!fs.existsSync(path.join(f.soc, "drafts", "the-ci-wait-halved-threads.txt")));
});

test("fanout never overwrites an existing draft file", (t) => {
  const f = fixture(t);
  f.write("drafts/the-ci-wait-halved-threads.txt", "mine");
  const r = f.cli("fanout", "site/tech/the-ci-wait-halved.md", "--platforms", "threads");
  assert.equal(r.code, 2);
  assert.equal(f.read("drafts/the-ci-wait-halved-threads.txt"), "mine");
});
