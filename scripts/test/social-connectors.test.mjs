import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { run, runAsync } from "../social/cli.mjs";
import { makeEnv } from "../social/lib/io.mjs";
import { makeSecretReader, redact } from "../social/lib/secrets.mjs";
import { buildFacets } from "../social/lib/connectors/bluesky.mjs";
import { request } from "../social/lib/connectors/http.mjs";

const NOW = new Date("2026-11-20T10:00:00Z");
const TOKEN = "tok-SECRET-1234567890";

function setup(t, platform = "mastodon", { itemOver = {}, body = "• One honest line about the tool.", approve = true, mediaFile = null } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "social-conn-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const hub = path.join(root, "hub");
  const soc = path.join(root, "private");
  fs.mkdirSync(path.join(hub, "site", "tech"), { recursive: true });
  fs.mkdirSync(path.join(soc, "drafts"), { recursive: true });
  fs.mkdirSync(path.join(soc, "media"), { recursive: true });
  fs.writeFileSync(path.join(hub, "site", "tech", "ok.md"), "---\ndraft: false\n---\n");
  const lim = (v) => ({ value: v, checked: true, url: "https://example.com/r", date: "2026-11-17" });
  fs.writeFileSync(path.join(soc, "limits.json"), JSON.stringify({
    platforms: { [platform]: { hashtags_allowed: false, title_max: lim(300), body_max: lim(500) } },
  }));
  fs.writeFileSync(path.join(soc, "banned-words.txt"), "synergy\n");
  fs.writeFileSync(path.join(soc, "claims-blocklist.txt"), "secure\n");
  fs.writeFileSync(path.join(soc, "company-blocklist.txt"), "Acme Hiring\n");
  fs.writeFileSync(path.join(soc, "link-allowlist.txt"), "https://github.com/Miguel-Shinyenyi\n");
  fs.writeFileSync(path.join(soc, "drafts", "p1.txt"), body);
  if (mediaFile) fs.writeFileSync(path.join(soc, mediaFile), "x");
  const item = { id: "p1", platform, kind: "post", source: "site/tech/ok.md", title: "Plain title", body_file: "drafts/p1.txt", link: null, media: [], status: "drafted", ai_assisted: "no", ...itemOver };
  fs.writeFileSync(path.join(soc, "queue.jsonl"), JSON.stringify(item) + "\n");
  const env = makeEnv({ socialDir: soc, hubDir: hub });
  if (approve) {
    assert.equal(run(["lint", "p1"], env, NOW).code, 0);
    assert.equal(run(["approve", "p1", "--confirmed"], env, NOW).code, 0);
  }
  const conn = (o) => fs.writeFileSync(path.join(soc, "connectors.json"), JSON.stringify(o));
  const queue = () => JSON.parse(fs.readFileSync(path.join(soc, "queue.jsonl"), "utf8").trim().split("\n")[0]);
  return { env, soc, conn, queue };
}

const enabled = (extra = {}) => ({ enabled: true, terms_read: { url: "https://example.com/terms", date: "2026-11-17" }, ...extra });
const MASTO = { mastodon: enabled({ instance: "https://masto.example" }) };

function fakeFetch(replies) {
  const calls = [];
  const fn = async (url, opts) => {
    calls.push({ url, opts });
    const r = replies.shift();
    if (r instanceof Error) throw r;
    const status = r.status ?? 200;
    return { ok: status < 400, status, text: async () => (typeof r.body === "string" ? r.body : JSON.stringify(r.body)) };
  };
  fn.calls = calls;
  return fn;
}
const secretsOf = (map) => makeSecretReader({ env: Object.fromEntries(Object.entries(map).map(([k, v]) => [`SOCIAL_SECRET_${k}`, v])), exec: () => { throw new Error("no keychain"); } });
const go = (f, args, fetch, secrets = secretsOf({ MASTODON_TOKEN: TOKEN })) => runAsync(args, f.env, NOW, { fetch, readSecret: secrets });

test("dry run sends nothing, shows the plan and only says whether a secret is found", async (t) => {
  const f = setup(t);
  f.conn(MASTO);
  const fetch = fakeFetch([]);
  const r = await go(f, ["publish", "p1"], fetch);
  assert.equal(r.code, 0, r.out.join("\n"));
  assert.equal(fetch.calls.length, 0);
  const text = r.out.join("\n");
  assert.match(text, /would: POST https:\/\/masto\.example\/api\/v1\/statuses/);
  assert.match(text, /MASTODON_TOKEN found/);
  assert.ok(!text.includes(TOKEN));
  assert.equal(f.queue().status, "approved");
});

test("every gate refuses on its own", async (t) => {
  // not approved
  let f = setup(t, "mastodon", { approve: false });
  f.conn(MASTO);
  assert.equal((await go(f, ["publish", "p1"], fakeFetch([]))).code, 2);
  // off, terms missing, config key missing
  f = setup(t);
  assert.equal((await go(f, ["publish", "p1"], fakeFetch([]))).code, 3);
  f.conn({ mastodon: { enabled: false, instance: "https://masto.example", terms_read: { url: "u", date: "d" } } });
  assert.match((await go(f, ["publish", "p1"], fakeFetch([]))).out.join(), /off in connectors/);
  f.conn({ mastodon: { enabled: true, instance: "https://masto.example" } });
  assert.match((await go(f, ["publish", "p1"], fakeFetch([]))).out.join(), /terms of mastodon are not recorded/);
  f.conn({ mastodon: enabled() });
  assert.match((await go(f, ["publish", "p1"], fakeFetch([]))).out.join(), /missing instance/);
  // a bad instance address
  f.conn({ mastodon: enabled({ instance: "http://masto.example" }) });
  assert.equal((await go(f, ["publish", "p1"], fakeFetch([]))).code, 3);
  f.conn({ mastodon: enabled({ instance: "https://masto.example/path" }) });
  assert.equal((await go(f, ["publish", "p1"], fakeFetch([]))).code, 3);
});

test("an item edited after approval is refused and drops back to drafted", async (t) => {
  const f = setup(t);
  f.conn(MASTO);
  fs.writeFileSync(path.join(f.soc, "drafts", "p1.txt"), "• Changed after approval.");
  const fetch = fakeFetch([]);
  const r = await go(f, ["publish", "p1", "--live", "--confirmed"], fetch);
  assert.equal(r.code, 2);
  assert.equal(fetch.calls.length, 0);
  assert.equal(f.queue().status, "drafted");
});

test("failing checks, media, a platform with no connector, and an over-long text are refused", async (t) => {
  let f = setup(t, "mastodon", { body: "Fast — bad", approve: false });
  f.conn(MASTO);
  // approve cannot pass, so force the state by hand
  const q = f.queue();
  assert.equal(run(["approve", "p1", "--confirmed"], f.env, NOW).code, 2);
  assert.equal(q.status, "drafted");

  f = setup(t, "mastodon", { itemOver: { media: ["media/clip.mp4"] }, mediaFile: "media/clip.mp4" });
  f.conn(MASTO);
  assert.match((await go(f, ["publish", "p1"], fakeFetch([]))).out.join(), /media/);

  f = setup(t, "reddit");
  const r = await go(f, ["publish", "p1"], fakeFetch([]));
  assert.equal(r.code, 3);
  assert.match(r.out.join(), /no connector for reddit/);

  f = setup(t, "mastodon", { body: "• " + "x".repeat(60) });
  f.conn({ mastodon: enabled({ instance: "https://masto.example", max_chars: 50 }) });
  assert.match((await go(f, ["publish", "p1"], fakeFetch([]))).out.join(), /over the 50 limit/);
});

test("--live needs --confirmed and the secret", async (t) => {
  const f = setup(t);
  f.conn(MASTO);
  const fetch = fakeFetch([]);
  assert.equal((await go(f, ["publish", "p1", "--live"], fetch)).code, 64);
  const r = await go(f, ["publish", "p1", "--live", "--confirmed"], fetch, secretsOf({}));
  assert.equal(r.code, 3);
  assert.match(r.out.join(), /MASTODON_TOKEN is missing/);
  assert.equal(fetch.calls.length, 0);
});

test("mastodon live: one request, token only in the header, result recorded", async (t) => {
  const f = setup(t);
  f.conn(MASTO);
  const fetch = fakeFetch([{ body: { url: "https://masto.example/@me/1" } }]);
  const r = await go(f, ["publish", "p1", "--live", "--confirmed"], fetch);
  assert.equal(r.code, 0, r.out.join("\n"));
  assert.equal(fetch.calls.length, 1);
  const c = fetch.calls[0];
  assert.equal(c.url, "https://masto.example/api/v1/statuses");
  assert.equal(c.opts.headers.Authorization, `Bearer ${TOKEN}`);
  assert.equal(c.opts.redirect, "error");
  assert.ok(c.opts.headers["Idempotency-Key"].length === 32);
  assert.deepEqual(JSON.parse(c.opts.body), { status: "• One honest line about the tool.", visibility: "public" });
  assert.ok(!r.out.join().includes(TOKEN));
  const q = f.queue();
  assert.equal(q.status, "posted");
  assert.equal(q.posted_url, "https://masto.example/@me/1");
  assert.equal((await go(f, ["publish", "p1"], fakeFetch([]))).code, 2);
});

test("the link is added when the body does not hold it", async (t) => {
  const f = setup(t, "mastodon", { itemOver: { link: "https://github.com/Miguel-Shinyenyi/umwayi-os" } });
  f.conn(MASTO);
  const fetch = fakeFetch([{ body: { url: "https://masto.example/@me/2" } }]);
  assert.equal((await go(f, ["publish", "p1", "--live", "--confirmed"], fetch)).code, 0);
  assert.match(JSON.parse(fetch.calls[0].opts.body).status, /\nhttps:\/\/github\.com\/Miguel-Shinyenyi\/umwayi-os$/);
});

test("bluesky live: sign in, then create the record with link facets", async (t) => {
  const f = setup(t, "bluesky", { body: "• café notes https://github.com/Miguel-Shinyenyi/umwayi-os" });
  f.conn({ bluesky: enabled({ handle: "me.bsky.social" }) });
  const fetch = fakeFetch([{ body: { accessJwt: "jwt-SECRET-9999999", did: "did:plc:abc" } }, { body: { uri: "at://did:plc:abc/app.bsky.feed.post/3kxyz" } }]);
  const r = await go(f, ["publish", "p1", "--live", "--confirmed"], fetch, secretsOf({ BLUESKY_APP_PASSWORD: "app-pass-1234" }));
  assert.equal(r.code, 0, r.out.join("\n"));
  assert.equal(fetch.calls.length, 2);
  assert.equal(fetch.calls[0].url, "https://bsky.social/xrpc/com.atproto.server.createSession");
  assert.deepEqual(JSON.parse(fetch.calls[0].opts.body), { identifier: "me.bsky.social", password: "app-pass-1234" });
  const second = fetch.calls[1];
  assert.equal(second.opts.headers.Authorization, "Bearer jwt-SECRET-9999999");
  const rec = JSON.parse(second.opts.body).record;
  assert.equal(rec.$type, "app.bsky.feed.post");
  assert.equal(rec.facets.length, 1);
  const bytes = new TextEncoder().encode(rec.text);
  const { byteStart, byteEnd } = rec.facets[0].index;
  assert.equal(new TextDecoder().decode(bytes.slice(byteStart, byteEnd)), "https://github.com/Miguel-Shinyenyi/umwayi-os");
  assert.equal(f.queue().posted_url, "https://bsky.app/profile/me.bsky.social/post/3kxyz");
  assert.ok(!r.out.join().includes("app-pass-1234"));
});

test("threads live: create, publish, permalink; the token is not in any URL", async (t) => {
  const f = setup(t, "threads");
  f.conn({ threads: enabled({ user_id: "12345" }) });
  const fetch = fakeFetch([{ body: { id: "c1" } }, { body: { id: "m1" } }, { body: { permalink: "https://www.threads.com/@me/post/abc" } }]);
  const r = await go(f, ["publish", "p1", "--live", "--confirmed"], fetch, secretsOf({ THREADS_TOKEN: TOKEN }));
  assert.equal(r.code, 0, r.out.join("\n"));
  assert.equal(fetch.calls.length, 3);
  for (const c of fetch.calls) assert.ok(!c.url.includes(TOKEN));
  assert.equal(fetch.calls[0].url, "https://graph.threads.net/v1.0/12345/threads");
  assert.match(fetch.calls[0].opts.body, /media_type=TEXT/);
  assert.equal(fetch.calls[1].url, "https://graph.threads.net/v1.0/12345/threads_publish");
  assert.equal(f.queue().posted_url, "https://www.threads.com/@me/post/abc");
});

test("a platform error is shown without the secret and nothing is recorded", async (t) => {
  const f = setup(t);
  f.conn(MASTO);
  const fetch = fakeFetch([{ status: 401, body: `invalid token ${TOKEN}` }]);
  const r = await go(f, ["publish", "p1", "--live", "--confirmed"], fetch);
  assert.equal(r.code, 2);
  const text = r.out.join("\n");
  assert.match(text, /HTTP 401/);
  assert.ok(!text.includes(TOKEN));
  assert.match(text, /\[redacted\]/);
  assert.equal(f.queue().status, "approved");
});

test("a network failure is exit 2, leaks nothing and records nothing", async (t) => {
  const f = setup(t);
  f.conn(MASTO);
  const r = await go(f, ["publish", "p1", "--live", "--confirmed"], fakeFetch([new Error(`boom ${TOKEN}`)]));
  assert.equal(r.code, 2);
  assert.ok(!r.out.join().includes(TOKEN));
  assert.equal(f.queue().status, "approved");
});

test("connectors lists every connector and why the others have none, with no secret values", async (t) => {
  const f = setup(t, "mastodon", { approve: false });
  f.conn({ mastodon: enabled({ instance: "https://masto.example" }) });
  const r = await go(f, ["connectors"], fakeFetch([]));
  assert.equal(r.code, 0);
  const text = r.out.join("\n");
  assert.match(text, /mastodon: enabled, terms read 2026-11-17; instance set; secrets: MASTODON_TOKEN found/);
  assert.match(text, /bluesky: off, terms NOT recorded/);
  assert.match(text, /x: no connector, the official API is pay per use/);
  assert.match(text, /hackernews: no connector/);
  assert.ok(!text.includes(TOKEN));
});

test("a broken connectors.json is exit 3", async (t) => {
  const f = setup(t);
  fs.writeFileSync(path.join(f.soc, "connectors.json"), "[1]");
  assert.equal((await go(f, ["publish", "p1"], fakeFetch([]))).code, 3);
});

test("secrets: env first, keychain second, bad names refused, redact removes values", () => {
  const read = makeSecretReader({ env: { SOCIAL_SECRET_A_KEY: "from-env" }, exec: () => "from-keychain\n" });
  assert.equal(read("A_KEY"), "from-env");
  assert.equal(read("OTHER"), "from-keychain");
  const none = makeSecretReader({ env: {}, exec: () => { throw new Error("x"); } });
  assert.equal(none("OTHER"), null);
  assert.throws(() => read("bad name; rm"), /bad secret name/);
  assert.equal(redact("a tok-123456 b tok-123456", ["tok-123456", "x"]), "a [redacted] b [redacted]");
});

test("buildFacets uses UTF-8 byte offsets", () => {
  const text = "café https://a.example/x.";
  const [f] = buildFacets(text);
  const slice = new TextDecoder().decode(new TextEncoder().encode(text).slice(f.index.byteStart, f.index.byteEnd));
  assert.equal(slice, "https://a.example/x");
});

test("publish usage faults", async (t) => {
  const f = setup(t);
  assert.equal((await go(f, ["publish"], fakeFetch([]))).code, 64);
  assert.equal((await go(f, ["publish", "nope"], fakeFetch([]))).code, 64);
  assert.equal((await go(f, ["connectors", "x"], fakeFetch([]))).code, 64);
});

test("an unapproved item is refused with a clear reason and is not changed", async (t) => {
  const f = setup(t, "mastodon", { approve: false });
  f.conn(MASTO);
  const r = await go(f, ["publish", "p1", "--live", "--confirmed"], fakeFetch([]));
  assert.equal(r.code, 2);
  assert.match(r.out.join(), /is drafted, not approved/);
  assert.equal(f.queue().status, "drafted");
});

test("checks that fail after approval stop a publish, even when the content is unchanged", async (t) => {
  const f = setup(t);
  f.conn(MASTO);
  fs.writeFileSync(path.join(f.soc, "banned-words.txt"), "honest\n");
  const fetch = fakeFetch([]);
  const r = await go(f, ["publish", "p1", "--live", "--confirmed"], fetch);
  assert.equal(r.code, 2);
  assert.match(r.out.join(), /banned-words: "honest"/);
  assert.equal(fetch.calls.length, 0);
});

test("publish scrubs secrets from any connector error, not only http ones", async (t) => {
  const f = setup(t);
  f.conn(MASTO);
  const leaky = { secrets: ["MASTODON_TOKEN"], configKeys: [], defaultLimit: 500,
    describe: () => ["x"], publish: async ({ secrets }) => { throw new Error(`bad ${secrets.MASTODON_TOKEN}`); } };
  const r = await runAsync(["publish", "p1", "--live", "--confirmed"], f.env, NOW, { fetch: fakeFetch([]), readSecret: secretsOf({ MASTODON_TOKEN: TOKEN }), connectors: { mastodon: leaky } });
  assert.equal(r.code, 2);
  assert.ok(!r.out.join().includes(TOKEN));
  assert.match(r.out.join(), /\[redacted\]/);
});

test("the http helper refuses a non-https address and never follows redirects", async () => {
  const fetch = fakeFetch([{ body: {} }]);
  await assert.rejects(() => request(fetch, "http://example.com/x", { json: {} }), /not https/);
  assert.equal(fetch.calls.length, 0);
  await request(fetch, "https://example.com/x", { json: {} });
  assert.equal(fetch.calls[0].opts.redirect, "error");
});

test("threads sends the token in the form body of both steps", async (t) => {
  const f = setup(t, "threads");
  f.conn({ threads: enabled({ user_id: "12345" }) });
  const fetch = fakeFetch([{ body: { id: "c1" } }, { body: { id: "m1" } }, { body: { permalink: "https://www.threads.com/@me/post/abc" } }]);
  await go(f, ["publish", "p1", "--live", "--confirmed"], fetch, secretsOf({ THREADS_TOKEN: TOKEN }));
  assert.ok(fetch.calls[0].opts.body.includes(`access_token=${encodeURIComponent(TOKEN)}`));
  assert.ok(fetch.calls[1].opts.body.includes(`access_token=${encodeURIComponent(TOKEN)}`));
  assert.equal(fetch.calls[2].opts.headers.Authorization, `Bearer ${TOKEN}`);
});
