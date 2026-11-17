import test from "node:test";
import assert from "node:assert/strict";
import { runChecks, exitCodeFor, urlAllowed, extractUrls, parseList } from "../social/lib/checks.mjs";

const limits = {
  hashtags_allowed: false,
  title_max: { value: 80, checked: true, url: "https://example.com/rules", date: "2026-11-17" },
  body_max: { value: 500, checked: true, url: "https://example.com/rules", date: "2026-11-17" },
};

function ctx(over = {}) {
  const { item: itemOver, ...rest } = over;
  return {
    item: {
      id: "x", platform: "threads", kind: "post", title: "A plain title", body_file: "drafts/x.txt",
      link: null, media: [], ai_assisted: "no", source: "site/tech/a.md", ...itemOver,
    },
    body: "A short body.",
    bodyProblem: null,
    limits,
    banned: ["synergy"],
    claims: ["production ready", "deterministic output", "secure"],
    companies: ["Acme Hiring"],
    allowlist: ["https://github.com/Miguel-Shinyenyi"],
    source: { state: "ok" },
    mediaProblems: [],
    ...rest,
  };
}

const code = (c) => exitCodeFor(runChecks(c));
const fails = (c) => runChecks(c).fails.join("\n");

test("a clean item passes with exit 0", () => {
  assert.equal(code(ctx()), 0);
});

test("an em dash is caught", () => {
  assert.equal(code(ctx({ body: "Fast — and small." })), 2);
  assert.match(fails(ctx({ body: "Fast — and small." })), /no-em-dash/);
});

test("a hashtag is caught unless the platform allows it", () => {
  assert.match(fails(ctx({ body: "New tool #AI" })), /no-hashtag/);
  assert.equal(code(ctx({ body: "New tool #AI", limits: { ...limits, hashtags_allowed: true } })), 0);
  assert.equal(code(ctx({ body: "Item #1 of 3 is done" })), 0);
});

test("a blocked claim is caught, including inside a longer sentence, but not inside another word", () => {
  assert.match(fails(ctx({ body: "It is production ready today." })), /claims: "production ready"/);
  assert.match(fails(ctx({ body: "It gives deterministic output." })), /claims/);
  assert.equal(code(ctx({ body: "It has a security note." })), 0);
  assert.match(fails(ctx({ body: "It is Secure." })), /claims: "secure"/);
});

test("a banned word and a company name are caught, case does not matter", () => {
  assert.match(fails(ctx({ body: "Great SYNERGY here" })), /banned-words/);
  assert.match(fails(ctx({ body: "I met acme hiring last week" })), /company/);
});

test("an over-long title and an over-long body are caught", () => {
  assert.match(fails(ctx({ item: { title: "x".repeat(81) } })), /limit: title is 81 characters, over the 80 limit/);
  assert.match(fails(ctx({ body: "y".repeat(501) })), /limit: body is 501/);
  assert.equal(code(ctx({ item: { title: "x".repeat(80) } })), 0);
});

test("a limit is counted in characters, not bytes", () => {
  assert.equal(code(ctx({ item: { title: "é".repeat(80) } })), 0);
});

test("an unconfirmed or unknown limit means cannot decide, an over-long text still fails", () => {
  const unchecked = { ...limits, title_max: { value: 80, checked: false } };
  assert.equal(code(ctx({ limits: unchecked })), 3);
  const unknown = { ...limits, title_max: { value: "unknown", checked: false } };
  assert.equal(code(ctx({ limits: unknown })), 3);
  assert.equal(code(ctx({ limits: unchecked, item: { title: "x".repeat(90) } })), 2);
  assert.equal(code(ctx({ limits: null })), 3);
});

test("markdown, asterisks and hyphen bullets are caught", () => {
  assert.match(fails(ctx({ body: "A **bold** word" })), /asterisk/);
  assert.match(fails(ctx({ body: "Use `code` here" })), /backtick/);
  assert.match(fails(ctx({ body: "# Heading\ntext" })), /heading marker/);
  assert.match(fails(ctx({ body: "See [site](https://github.com/Miguel-Shinyenyi/x)" })), /link syntax/);
  assert.match(fails(ctx({ body: "- first\n- second" })), /bullet/);
  assert.equal(code(ctx({ body: "• first\n• second" })), 0);
});

test("a source that is not draft false is caught", () => {
  assert.match(fails(ctx({ source: { state: "draft", detail: "site/tech/a.md does not have draft: false" } })), /source: .*draft: false/);
  assert.match(fails(ctx({ item: { source: null }, source: { state: "none" } })), /no source/);
});

test("a missing media file is caught", () => {
  assert.match(fails(ctx({ mediaProblems: ["media/a.mp4 does not exist"] })), /media: media\/a.mp4 does not exist/);
});

test("a missing body file is caught", () => {
  assert.match(fails(ctx({ body: null, bodyProblem: "body_file drafts/x.txt does not exist" })), /body:/);
  assert.match(fails(ctx({ body: null, item: { body_file: null } })), /no body_file/);
});

test("links must be https and on the allowlist", () => {
  assert.equal(code(ctx({ body: "Repo: https://github.com/Miguel-Shinyenyi/umwayi-os" })), 0);
  assert.match(fails(ctx({ body: "See https://evil.example/x" })), /not on the allowlist/);
  assert.match(fails(ctx({ body: "See http://github.com/Miguel-Shinyenyi/x" })), /not https/);
  assert.match(fails(ctx({ item: { link: "https://github.com/Miguel-Shinyenyievil/x" } })), /not on the allowlist/);
});

test("a missing list file means cannot decide, never a pass", () => {
  assert.equal(code(ctx({ banned: null })), 3);
  assert.equal(code(ctx({ claims: null })), 3);
  assert.equal(code(ctx({ companies: null })), 3);
  assert.equal(code(ctx({ allowlist: null })), 3);
});

test("ai_assisted unknown means cannot decide", () => {
  assert.equal(code(ctx({ item: { ai_assisted: "unknown" } })), 3);
});

test("a fail beats a cannot decide", () => {
  assert.equal(code(ctx({ body: "Fast — yes", banned: null })), 2);
});

test("helpers: urlAllowed, extractUrls, parseList", () => {
  assert.equal(urlAllowed("https://a.b/c", ["https://a.b"]), true);
  assert.equal(urlAllowed("https://a.bc/c", ["https://a.b"]), false);
  assert.deepEqual(extractUrls("See https://a.b/c. And (https://d.e/f)"), ["https://a.b/c", "https://d.e/f"]);
  assert.deepEqual(parseList("# note\n\nfoo\n bar \n"), ["foo", "bar"]);
});

test("a kind-specific limit beats the general one for that kind only", () => {
  const withKind = { ...limits, body_max: { value: 100, checked: true }, post_body_max: { value: 5000, checked: true } };
  const long = "w".repeat(400);
  assert.equal(code(ctx({ body: long, limits: withKind })), 0);
  assert.match(fails(ctx({ body: long, limits: withKind, item: { kind: "listing" } })), /over the 100 limit/);
});
