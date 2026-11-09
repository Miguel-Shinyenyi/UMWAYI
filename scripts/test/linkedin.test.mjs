// Run with: npm test (from scripts/). Fixed sample input, no network.
import test from "node:test";
import assert from "node:assert/strict";
import { escapeLittleText, buildCommentary, buildPostBody } from "../lib/linkedin.mjs";

const CANONICAL = "https://example.test/site/tech/a-post/";

test("escapes little text format characters", () => {
  assert.equal(escapeLittleText("Q&A (part #1) @home [x] a_b *c* ~d~ {e} <f> g|h \\"), "Q&A \\(part \\#1\\) \\@home \\[x\\] a\\_b \\*c\\* \\~d\\~ \\{e\\} \\<f\\> g\\|h \\\\");
});

test("plain post has title, summary and link", () => {
  assert.equal(
    buildCommentary({ title: "Title", summary: "Summary.", canonical: CANONICAL }),
    `Title\n\nSummary.\n\n${CANONICAL}`
  );
});

test("hashtags, mentions and links are added in order", () => {
  const text = buildCommentary({
    title: "Title",
    summary: "Summary.",
    canonical: CANONICAL,
    linkedin: {
      hashtags: ["Meta", "#MetaAI", "AI Hackathon"],
      mentions: [
        { name: "Meta", urn: "urn:li:organization:10667" },
        { name: "AI at Meta", urn: "urn:li:organization:35482514" },
      ],
      links: [{ label: "Event", url: "https://dev.meta.ai/events/global-hackathon" }],
    },
  });
  assert.equal(
    text,
    [
      "Title",
      "Summary.",
      "Event: https://dev.meta.ai/events/global-hackathon",
      "@[Meta](urn:li:organization:10667) @[AI at Meta](urn:li:organization:35482514)",
      "{hashtag|\\#|Meta} {hashtag|\\#|MetaAI} {hashtag|\\#|AIHackathon}",
      CANONICAL,
    ].join("\n\n")
  );
});

test("rejects a bad mention urn, hashtag and link", () => {
  const base = { title: "T", canonical: CANONICAL };
  assert.throws(() => buildCommentary({ ...base, linkedin: { mentions: [{ name: "X", urn: "urn:li:foo:1" }] } }), /Invalid LinkedIn mention/);
  assert.throws(() => buildCommentary({ ...base, linkedin: { hashtags: ["!!!"] } }), /Invalid LinkedIn hashtag/);
  assert.throws(() => buildCommentary({ ...base, linkedin: { links: [{ label: "x", url: "javascript:alert(1)" }] } }), /Invalid link URL/);
});

test("post body is public, in the main feed, with an article card", () => {
  const body = buildPostBody({ author: "urn:li:person:abc", title: "T", summary: "S", canonical: CANONICAL });
  assert.equal(body.author, "urn:li:person:abc");
  assert.equal(body.visibility, "PUBLIC");
  assert.equal(body.distribution.feedDistribution, "MAIN_FEED");
  assert.deepEqual(body.content.article, { source: CANONICAL, title: "T", description: "S" });
  assert.equal(body.lifecycleState, "PUBLISHED");
});

import { buildCommentaryFromText, loadPostText } from "../lib/linkedin.mjs";

test("written post: mention, hashtag, article link and plain URL", () => {
  const out = buildCommentaryFromText(
    "Built on @Acme Co (beta).\n\nTry: https://a.example/x.\n\nStory: [article link]\n\n#BuildIt",
    {
      canonical: "https://s.example/p/",
      linkedin: { mentions: [{ name: "Acme Co", urn: "urn:li:organization:5" }] },
    }
  );
  assert.equal(
    out,
    "Built on @[Acme Co](urn:li:organization:5) \\(beta\\).\n\nTry: https://a.example/x.\n\nStory: https://s.example/p/\n\n{hashtag|\\#|BuildIt}"
  );
});

test("written post: appends the article link when the text has no placeholder", () => {
  const out = buildCommentaryFromText("Hello.", { canonical: "https://s.example/p/" });
  assert.equal(out, "Hello.\n\nhttps://s.example/p/");
});

test("written post: an @name with no mention entry is an error", () => {
  assert.throws(() => buildCommentaryFromText("Hi @Nobody", { canonical: "https://s.example/p/" }), /no matching entry/);
});

test("loadPostText reads the section under '## The post'", () => {
  const t = loadPostText("docs/plans/founding-dev-linkedin-post.md");
  assert.match(t, /^I designed a landing page/);
  assert.doesNotMatch(t, /Link to the article/);
});
