import test from "node:test";
import assert from "node:assert/strict";
import { buildPromoParagraphs } from "../lib/substack-promo.mjs";

test("no linkedin block gives no paragraphs", () => {
  assert.deepEqual(buildPromoParagraphs(undefined), []);
  assert.deepEqual(buildPromoParagraphs({}), []);
});

test("links become one paragraph each, with a linked URL", () => {
  const p = buildPromoParagraphs({ links: [{ label: "Event", url: "https://example.com/e" }] });
  assert.equal(p.length, 1);
  assert.equal(p[0].content[0].text, "Event: ");
  assert.equal(p[0].content[1].marks[0].attrs.href, "https://example.com/e");
});

test("mentions become a Follow line; a mention without url is plain text", () => {
  const p = buildPromoParagraphs({
    mentions: [
      { name: "Meta", urn: "urn:li:organization:1", url: "https://www.linkedin.com/company/meta/" },
      { name: "Other", urn: "urn:li:organization:2" },
    ],
  });
  const c = p[0].content;
  assert.equal(c[0].text, "Follow: ");
  assert.equal(c[1].marks[0].attrs.href, "https://www.linkedin.com/company/meta/");
  assert.equal(c[2].text, " · ");
  assert.equal(c[3].marks, undefined);
});

test("rejects a non-https link", () => {
  assert.throws(() => buildPromoParagraphs({ links: [{ label: "x", url: "http://a.b" }] }), /Invalid link URL/);
});
