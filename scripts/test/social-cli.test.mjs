import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { run } from "../social/cli.mjs";
import { makeEnv } from "../social/lib/io.mjs";

const NOW = new Date("2026-11-20T10:00:00Z");

function fixture(t, { lists = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "social-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const hub = path.join(root, "hub");
  const soc = path.join(root, "private");
  fs.mkdirSync(path.join(hub, "site", "tech"), { recursive: true });
  fs.mkdirSync(path.join(soc, "drafts"), { recursive: true });
  fs.mkdirSync(path.join(soc, "media"), { recursive: true });
  fs.writeFileSync(path.join(hub, "site", "tech", "ok.md"), "---\ntitle: Ok\ndraft: false\n---\nBody\n");
  fs.writeFileSync(path.join(hub, "site", "tech", "draft.md"), "---\ntitle: D\ndraft: true\n---\nBody\n");
  fs.writeFileSync(path.join(hub, "site", "tech", "nofield.md"), "---\ntitle: N\n---\nBody\n");
  fs.writeFileSync(path.join(soc, "media", "clip.mp4"), "x");
  fs.writeFileSync(path.join(soc, "limits.json"), JSON.stringify({
    platforms: { threads: {
      hashtags_allowed: false,
      title_max: { value: 80, checked: true, url: "https://example.com/r", date: "2026-11-17" },
      body_max: { value: 500, checked: true, url: "https://example.com/r", date: "2026-11-17" },
    } },
  }));
  if (lists) {
    fs.writeFileSync(path.join(soc, "banned-words.txt"), "synergy\n");
    fs.writeFileSync(path.join(soc, "claims-blocklist.txt"), "production ready\nsecure\ndeterministic output\n");
    fs.writeFileSync(path.join(soc, "company-blocklist.txt"), "Acme Hiring\n");
    fs.writeFileSync(path.join(soc, "link-allowlist.txt"), "https://github.com/Miguel-Shinyenyi\n");
  }
  const env = makeEnv({ socialDir: soc, hubDir: hub });
  const body = (name, text) => fs.writeFileSync(path.join(soc, "drafts", name), text);
  const queue = (...items) => fs.writeFileSync(path.join(soc, "queue.jsonl"), items.map((i) => JSON.stringify(i)).join("\n") + "\n");
  const readQueue = () => fs.readFileSync(path.join(soc, "queue.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const cli = (...args) => run(args, env, NOW);
  return { root, hub, soc, env, body, queue, readQueue, cli };
}

const item = (over = {}) => ({
  id: "p1", platform: "threads", kind: "post", source: "site/tech/ok.md", title: "A plain title",
  body_file: "drafts/p1.txt", link: null, media: [], earliest_date: "2026-11-20", status: "drafted",
  ai_assisted: "no", ...over,
});

test("lint passes a clean item and moves it to linted", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "• It checks one thing.\n• It says what it cannot do.");
  f.queue(item());
  const r = f.cli("lint", "p1");
  assert.equal(r.code, 0, r.out.join("\n"));
  assert.equal(f.readQueue()[0].status, "linted");
});

test("planted fault: em dash", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "Fast — and small.");
  f.queue(item());
  const r = f.cli("lint", "p1");
  assert.equal(r.code, 2);
  assert.match(r.out.join("\n"), /no-em-dash/);
  assert.equal(f.readQueue()[0].status, "drafted");
});

test("planted fault: hashtag", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "A new tool #AI");
  f.queue(item());
  assert.match(f.cli("lint", "p1").out.join("\n"), /no-hashtag/);
});

test("planted fault: blocked claim", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "It is production ready.");
  f.queue(item());
  const r = f.cli("lint", "p1");
  assert.equal(r.code, 2);
  assert.match(r.out.join("\n"), /claims: "production ready"/);
});

test("planted fault: over-long title", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "Short body.");
  f.queue(item({ title: "t".repeat(81) }));
  const r = f.cli("lint", "p1");
  assert.equal(r.code, 2);
  assert.match(r.out.join("\n"), /limit: title is 81/);
});

test("planted fault: source with draft true, and a source with no draft field", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "Short body.");
  f.queue(item({ source: "site/tech/draft.md" }));
  assert.match(f.cli("lint", "p1").out.join("\n"), /source: .*draft: false/);
  f.queue(item({ source: "site/tech/nofield.md" }));
  assert.match(f.cli("lint", "p1").out.join("\n"), /source: .*draft: false/);
});

test("planted fault: a source outside the site folder, and a source that is not our repo", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "Short body.");
  fs.writeFileSync(path.join(f.hub, "secret.md"), "---\ndraft: false\n---\n");
  f.queue(item({ source: "../secret.md" }));
  assert.match(f.cli("lint", "p1").out.join("\n"), /not a file under the hub's site folder/);
  f.queue(item({ source: "https://github.com/someone-else/repo" }));
  assert.match(f.cli("lint", "p1").out.join("\n"), /not a repo under/);
  f.queue(item({ source: "https://github.com/Miguel-Shinyenyi/umwayi-os" }));
  assert.equal(f.cli("lint", "p1").code, 0);
});

test("planted fault: missing media file", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "Short body.");
  f.queue(item({ media: ["media/gone.mp4"] }));
  assert.match(f.cli("lint", "p1").out.join("\n"), /media: media\/gone.mp4 does not exist/);
  f.queue(item({ media: ["media/clip.mp4"] }));
  assert.equal(f.cli("lint", "p1").code, 0);
});

test("a body_file or media path that escapes the private folder is refused", (t) => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.root, "outside.txt"), "hello");
  f.queue(item({ body_file: "../outside.txt" }));
  assert.match(f.cli("lint", "p1").out.join("\n"), /outside the private folder/);
  fs.symlinkSync(path.join(f.root, "outside.txt"), path.join(f.soc, "drafts", "link.txt"));
  f.queue(item({ body_file: "drafts/link.txt" }));
  assert.match(f.cli("lint", "p1").out.join("\n"), /outside the private folder/);
  f.body("p1.txt", "ok");
  f.queue(item({ media: ["/etc/hosts"] }));
  assert.match(f.cli("lint", "p1").out.join("\n"), /outside the private folder/);
});

test("planted fault: body edited after approve drops the item back to drafted", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "• One honest line.");
  f.queue(item());
  assert.equal(f.cli("lint", "p1").code, 0);
  assert.equal(f.cli("approve", "p1", "--confirmed").code, 0);
  const q = f.readQueue()[0];
  assert.equal(q.status, "approved");
  assert.match(q.approved_sha256, /^[0-9a-f]{64}$/);
  f.body("p1.txt", "• One honest line, edited.");
  const r = f.cli("lint", "p1");
  assert.match(r.out.join("\n"), /back to drafted/);
  const after = f.readQueue()[0];
  assert.equal(after.status, "drafted");
  assert.equal(after.approved_sha256, null);
});

test("record refuses an unapproved item and an item edited after approval", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "• One honest line.");
  f.queue(item());
  assert.equal(f.cli("record", "p1", "https://example.com/post/1").code, 2);
  f.cli("lint", "p1");
  f.cli("approve", "p1", "--confirmed");
  f.body("p1.txt", "• Changed after approval.");
  const r = f.cli("record", "p1", "https://example.com/post/1");
  assert.equal(r.code, 2);
  assert.equal(f.readQueue()[0].status, "drafted");
});

test("record stores the URL and time for an approved item, once", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "• One honest line.");
  f.queue(item());
  f.cli("lint", "p1");
  f.cli("approve", "p1", "--confirmed");
  const r = f.cli("record", "p1", "https://example.com/post/1");
  assert.equal(r.code, 0, r.out.join("\n"));
  const q = f.readQueue()[0];
  assert.equal(q.status, "posted");
  assert.equal(q.posted_url, "https://example.com/post/1");
  assert.equal(q.posted_at, NOW.toISOString());
  assert.equal(f.cli("record", "p1", "https://example.com/post/2").code, 2);
  assert.equal(f.cli("record", "p1", "http://example.com").code, 64);
});

test("approve needs --confirmed and a passing lint", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "• One honest line.");
  f.queue(item());
  assert.equal(f.cli("approve", "p1").code, 64);
  f.body("p1.txt", "Bad — line");
  assert.equal(f.cli("approve", "p1", "--confirmed").code, 2);
  assert.equal(f.readQueue()[0].status, "drafted");
});

test("a missing list file gives exit 3 for lint and approve", (t) => {
  const f = fixture(t, { lists: false });
  f.body("p1.txt", "• One honest line.");
  f.queue(item());
  assert.equal(f.cli("lint", "p1").code, 3);
  assert.equal(f.cli("approve", "p1", "--confirmed").code, 3);
});

test("a broken queue, an unknown status and an unknown field give exit 3", (t) => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.soc, "queue.jsonl"), "{broken\n");
  assert.equal(f.cli("lint", "p1").code, 3);
  assert.equal(f.cli("next").code, 3);
  f.queue(item({ status: "scheduled" }));
  assert.equal(f.cli("report").code, 3);
  f.queue({ ...item(), extra: 1 });
  assert.equal(f.cli("next").code, 3);
});

test("a broken limits.json gives exit 3", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "ok");
  f.queue(item());
  fs.writeFileSync(path.join(f.soc, "limits.json"), "{nope");
  assert.equal(f.cli("lint", "p1").code, 3);
});

test("next lists due items in order, skips future and finished ones, writes nothing", (t) => {
  const f = fixture(t);
  f.body("a.txt", "x");
  f.queue(
    item({ id: "late", earliest_date: "2026-11-19", status: "drafted" }),
    item({ id: "early", earliest_date: "2026-11-18", status: "drafted" }),
    item({ id: "future", earliest_date: "2026-11-25", status: "drafted" }),
    item({ id: "done", earliest_date: "2026-11-01", status: "posted", posted_url: "https://example.com/x" }),
    item({ id: "skip", status: "skipped" }),
  );
  const before = fs.readFileSync(path.join(f.soc, "queue.jsonl"), "utf8");
  const r = f.cli("next");
  assert.equal(r.code, 0);
  assert.equal(r.out.length, 2);
  assert.match(r.out[0], /^1\. early \[manual\]:/);
  assert.match(r.out[1], /^2\. late \[manual\]:/);
  assert.match(r.out[0], /Next: run: social lint early/);
  assert.equal(fs.readFileSync(path.join(f.soc, "queue.jsonl"), "utf8"), before);
  assert.match(f.cli("next", "--today", "2026-11-30").out.join("\n"), /future/);
  assert.match(f.cli("next", "--today", "2026-01-01").out[0], /nothing is due/);
});

test("next shows an edited approved item as drafted without writing", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "• One honest line.");
  f.queue(item());
  f.cli("lint", "p1");
  f.cli("approve", "p1", "--confirmed");
  f.body("p1.txt", "• Edited.");
  const r = f.cli("next");
  assert.match(r.out[0], /content changed since approval/);
  assert.equal(f.readQueue()[0].status, "approved");
});

test("report counts by platform and status and shows numbers read from the platform", (t) => {
  const f = fixture(t);
  f.queue(
    item({ id: "a", status: "drafted" }),
    item({ id: "b", status: "idea" }),
    item({ id: "c", platform: "reddit", status: "posted", posted_url: "https://example.com/c" }),
  );
  assert.equal(f.cli("metrics", "a", "--views", "3").code, 2);
  assert.equal(f.cli("metrics", "c").code, 64);
  assert.equal(f.cli("metrics", "c", "--views", "x").code, 64);
  assert.equal(f.cli("metrics", "c", "--views", "120", "--upvotes", "7", "--comments", "2").code, 0);
  const r = f.cli("report");
  assert.equal(r.code, 0);
  const text = r.out.join("\n");
  assert.match(text, /reddit: posted 1/);
  assert.match(text, /threads: drafted 1, idea 1/);
  assert.match(text, /views 120, upvotes 7, comments 2/);
});

test("usage faults exit 64 and nothing ever exits 1", (t) => {
  const f = fixture(t);
  assert.equal(f.cli().code, 64);
  assert.equal(f.cli("nope").code, 64);
  assert.equal(f.cli("lint").code, 64);
  assert.equal(f.cli("lint", "a", "b").code, 64);
  assert.equal(f.cli("next", "--today").code, 64);
  assert.equal(f.cli("next", "--today", "tomorrow").code, 64);
  assert.equal(f.cli("lint", "--wat", "a").code, 64);
  assert.equal(f.cli("lint", "missing-id").code, 64);
  for (const args of [[], ["lint"], ["report"], ["next"], ["approve", "x"]]) {
    assert.notEqual(f.cli(...args).code, 1);
  }
});

test("mode defaults to manual, is validated, and the approved next step follows the mode", (t) => {
  const f = fixture(t);
  f.body("p1.txt", "\u2022 One honest line.");
  f.queue(item({ mode: "robot" }));
  assert.equal(f.cli("next").code, 3);
  for (const [mode, text] of [["browser", /signed-in Chrome/], ["manual", /remind Miguel to post it by hand: the text is in drafts\/p1.txt/], ["api", /social publish p1/]]) {
    f.queue(item({ mode }));
    f.cli("lint", "p1");
    f.cli("approve", "p1", "--confirmed");
    assert.match(f.cli("next").out[0], text);
    assert.match(f.cli("next").out[0], new RegExp(`p1 \\[${mode}\\]`));
  }
  f.queue(item());
  assert.match(f.cli("next").out[0], /p1 \[manual\]/);
});

test("reminders lists what Miguel posts by hand: post now, not ready, and coming up", (t) => {
  const f = fixture(t);
  f.body("ready.txt", "\u2022 One honest line.");
  f.body("later.txt", "\u2022 Another honest line.");
  f.queue(
    item({ id: "ready", body_file: "drafts/ready.txt", mode: "manual", earliest_date: "2026-11-18" }),
    item({ id: "later", body_file: "drafts/later.txt", mode: "manual", earliest_date: "2026-11-25" }),
    item({ id: "idea1", mode: "manual", status: "idea", earliest_date: "2026-11-19" }),
    item({ id: "viabrowser", mode: "browser", body_file: "drafts/ready.txt" }),
    item({ id: "done", mode: "manual", status: "posted", posted_url: "https://example.com/x" }),
  );
  f.cli("lint", "ready");
  f.cli("approve", "ready", "--confirmed");
  f.cli("lint", "later");
  f.cli("approve", "later", "--confirmed");
  const r = f.cli("reminders");
  assert.equal(r.code, 0);
  const text = r.out.join("\n");
  assert.match(text, /POST NOW ready on threads \(2 days past its date\): paste the text from drafts\/ready.txt/);
  assert.match(text, /NOT READY idea1 on threads \(1 days past its date\): status idea/);
  assert.match(text, /later on threads: approved, due 2026-11-25/);
  assert.ok(!text.includes("viabrowser"));
  assert.ok(!text.includes("done"));
  assert.equal(f.cli("reminders", "x").code, 64);
  assert.equal(f.cli("reminders", "--today", "bad").code, 64);
  f.queue(item({ id: "none", mode: "browser" }));
  assert.match(f.cli("reminders").out[0], /Nothing by hand is waiting today/);
});

test("pack writes a private file, marks only approved and unchanged items as cleared, and changes nothing", (t) => {
  const f = fixture(t);
  f.body("ok.txt", "\u2022 One honest line to paste.");
  f.body("bad.txt", "\u2022 A line with a placeholder [[todo]].");
  f.body("edit.txt", "\u2022 Another honest line to paste.");
  f.queue(
    item({ id: "ok", body_file: "drafts/ok.txt", title: "My title", link: "https://github.com/Miguel-Shinyenyi/umwayi-os" }),
    item({ id: "bad", body_file: "drafts/bad.txt" }),
    item({ id: "edit", body_file: "drafts/edit.txt" }),
    item({ id: "gone", body_file: "drafts/ok.txt", status: "posted", posted_url: "https://example.com/x" }),
    item({ id: "skip", body_file: "drafts/ok.txt", status: "skipped" }),
  );
  for (const id of ["ok", "edit"]) {
    assert.equal(f.cli("lint", id).code, 0, id);
    assert.equal(f.cli("approve", id, "--confirmed").code, 0, id);
  }
  f.body("edit.txt", "\u2022 Edited after approval.");
  const before = fs.readFileSync(path.join(f.soc, "queue.jsonl"), "utf8");
  const r = f.cli("pack");
  assert.equal(r.code, 0);
  assert.match(r.out.join(), /3 items, 1 cleared to post, 2 not cleared/);
  assert.match(r.out.join(), /nothing was posted/);
  assert.equal(fs.readFileSync(path.join(f.soc, "queue.jsonl"), "utf8"), before);
  const file = path.join(f.soc, "COPY-PASTE-PACK.md");
  assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  const text = fs.readFileSync(file, "utf8");
  assert.match(text, /=== ok ===\nCLEARED: Miguel approved this exact text/);
  assert.match(text, /=== bad ===\nNOT CLEARED, do not post yet[\s\S]*?placeholder/);
  assert.match(text, /=== edit ===\nNOT CLEARED, do not post yet[\s\S]*?status is drafted, not approved/);
  assert.ok(!text.includes("=== gone ==="));
  assert.ok(!text.includes("=== skip ==="));
  assert.match(text, /----- TEXT, copy from here -----\n\u2022 One honest line to paste\.\n----- end of text -----/);
  assert.match(text, /----- TITLE, copy from here -----\nMy title\n/);
  assert.match(text, /1 x placeholder/);
});

test("pack counts what blocks items and handles an empty queue and bad input", (t) => {
  const f = fixture(t);
  assert.equal(f.cli("pack").code, 0);
  assert.match(fs.readFileSync(path.join(f.soc, "COPY-PASTE-PACK.md"), "utf8"), /nothing\n/);
  assert.equal(f.cli("pack", "x").code, 64);
  assert.equal(f.cli("pack", "--today", "bad").code, 64);
  fs.writeFileSync(path.join(f.soc, "queue.jsonl"), "{broken\n");
  assert.equal(f.cli("pack").code, 3);
});
