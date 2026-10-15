// Run with: npm test (from scripts/). Fixed sample input, no network.
import test from "node:test";
import assert from "node:assert/strict";
import { markdownToDoc, parseInline, collectImages, UnsupportedMarkdown } from "../lib/substack-convert.mjs";

const SITE = "https://example.test/site";

test("heading and paragraph with inline marks", () => {
  const doc = markdownToDoc("## What I noticed\n\nA **bold** word, an *italic* one and `code` here.");
  assert.equal(doc.content[0].type, "heading");
  assert.deepEqual(doc.content[0].attrs, { textAlign: null, level: 2 });
  assert.deepEqual(doc.content[0].content, [{ type: "text", text: "What I noticed" }]);
  const p = doc.content[1];
  assert.equal(p.type, "paragraph");
  assert.deepEqual(p.content, [
    { type: "text", text: "A " },
    { type: "text", text: "bold", marks: [{ type: "strong" }] },
    { type: "text", text: " word, an " },
    { type: "text", text: "italic", marks: [{ type: "em" }] },
    { type: "text", text: " one and " },
    { type: "text", text: "code", marks: [{ type: "code" }] },
    { type: "text", text: " here." },
  ]);
});

test("fenced code block keeps language and text, empty language becomes plaintext", () => {
  const doc = markdownToDoc("```java\nint x = 1;\nreturn x;\n```\n\n```\nplain\n  diagram\n```");
  assert.deepEqual(doc.content[0], {
    type: "highlighted_code_block",
    attrs: { language: "java", nodeId: null },
    content: [{ type: "text", text: "int x = 1;\nreturn x;" }],
  });
  assert.equal(doc.content[1].attrs.language, "plaintext");
  assert.equal(doc.content[1].content[0].text, "plain\n  diagram");
});

test("code block content is not parsed as Markdown", () => {
  const doc = markdownToDoc("```\n## not a heading\n- not a list\n**not bold**\n```");
  assert.equal(doc.content.length, 1);
  assert.equal(doc.content[0].content[0].text, "## not a heading\n- not a list\n**not bold**");
});

test("numbered list keeps order and start", () => {
  const doc = markdownToDoc("1. first\n2. second line\n   continues here\n3. third");
  const list = doc.content[0];
  assert.equal(list.type, "ordered_list");
  assert.deepEqual(list.attrs, { start: 1, order: 1 });
  assert.equal(list.content.length, 3);
  assert.equal(list.content[1].content[0].content[0].text, "second line continues here");
});

test("bullet list", () => {
  const doc = markdownToDoc("- one\n- two");
  assert.equal(doc.content[0].type, "bullet_list");
  assert.equal(doc.content[0].content.length, 2);
  assert.equal(doc.content[0].content[0].type, "list_item");
});

test("link becomes a link mark, relative links become absolute", () => {
  const nodes = parseInline("see [the post](https://a.test/x) and [home](/tech/a/)", { siteBase: SITE });
  const links = nodes.filter((n) => n.marks);
  assert.deepEqual(links[0], {
    type: "text",
    text: "the post",
    marks: [{ type: "link", attrs: { href: "https://a.test/x", target: "_blank", rel: "noopener noreferrer nofollow", class: null } }],
  });
  assert.equal(links[1].marks[0].attrs.href, `${SITE}/tech/a/`);
});

test("block image becomes captionedImage > image2 using the upload response", () => {
  const md = "Before\n\n![A status board](illustrations/a.svg)\n\nAfter";
  assert.deepEqual(collectImages(md), [{ alt: "A status board", src: "illustrations/a.svg" }]);
  const images = {
    "illustrations/a.svg": { url: "https://cdn.test/a_800x450.svg", bytes: 5647, contentType: "image/svg+xml", imageWidth: 800, imageHeight: 450 },
  };
  const doc = markdownToDoc(md, { images });
  const node = doc.content[1];
  assert.equal(node.type, "captionedImage");
  assert.equal(node.content[0].type, "image2");
  assert.equal(node.content[0].attrs.src, "https://cdn.test/a_800x450.svg");
  assert.equal(node.content[0].attrs.alt, "A status board");
  assert.equal(node.content[0].attrs.type, "image/svg+xml");
  assert.equal(doc.content.length, 3);
});

test("blockquote", () => {
  const doc = markdownToDoc("> a quote\n> on two lines");
  assert.equal(doc.content[0].type, "blockquote");
  assert.equal(doc.content[0].content[0].content[0].text, "a quote on two lines");
});

test("identifiers with underscores and stars in words are left alone", () => {
  const nodes = parseInline("use snake_case_name and 2*3 here");
  assert.deepEqual(nodes, [{ type: "text", text: "use snake_case_name and 2*3 here" }]);
});

test("unsupported Markdown throws instead of dropping content", () => {
  assert.throws(() => markdownToDoc("| a | b |\n|---|---|\n| 1 | 2 |"), UnsupportedMarkdown);
  assert.throws(() => markdownToDoc("text\n\n---\n\nmore"), UnsupportedMarkdown);
  assert.throws(() => markdownToDoc("<div>hi</div>"), UnsupportedMarkdown);
  assert.throws(() => markdownToDoc("- a\n  - nested"), UnsupportedMarkdown);
  assert.throws(() => markdownToDoc("a sentence with ![img](x.png) inside"), UnsupportedMarkdown);
  assert.throws(() => markdownToDoc("![x](missing.png)"), UnsupportedMarkdown);
});

test("no em dash is introduced by the converter", () => {
  const doc = markdownToDoc("## A\n\nPlain text, with a comma.");
  assert.ok(!JSON.stringify(doc).includes(String.fromCharCode(0x2014)));
});
