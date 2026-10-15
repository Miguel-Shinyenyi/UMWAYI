// scripts/lib/substack-convert.mjs
//
// Converts the Markdown subset the site's articles use into Substack's body format, a
// ProseMirror document. Node and mark names come from what Substack's own editor wrote on
// 2026-10-15 (see docs/substack-setup.md, section A2). Pure functions, no network.
//
// Supported: ## headings, paragraphs, **bold**, *italic*, `code`, [links](url), bullet and
// numbered lists (flat), > blockquotes, fenced code blocks, block images.
// Unsupported (throws, never drops content): tables, raw HTML, horizontal rules, nested
// lists, inline images inside a sentence.

const LINK_ATTRS = { target: "_blank", rel: "noopener noreferrer nofollow", class: null };

export class UnsupportedMarkdown extends Error {}

const textNode = (text, marks) => (marks.length ? { type: "text", text, marks } : { type: "text", text });

function paragraph(content) {
  return { type: "paragraph", attrs: { textAlign: null }, ...(content.length ? { content } : {}) };
}

function mergeText(nodes) {
  const out = [];
  for (const n of nodes) {
    const prev = out[out.length - 1];
    if (prev && n.type === "text" && prev.type === "text" && JSON.stringify(prev.marks) === JSON.stringify(n.marks)) {
      prev.text += n.text;
    } else {
      out.push({ ...n });
    }
  }
  return out;
}

const PATTERNS = [
  { name: "code", re: /`([^`]+)`/ },
  { name: "image", re: /!\[[^\]]*\]\([^)]*\)/ },
  { name: "link", re: /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/ },
  { name: "bold", re: /\*\*(.+?)\*\*|__(.+?)__/ },
  { name: "em", re: /\*(?!\s)(.+?)(?<!\s)\*|(?<![\w])_(?!\s)(.+?)(?<!\s)_(?![\w])/ },
];

export function parseInline(text, { siteBase = "" } = {}, marks = []) {
  const nodes = [];
  let rest = text;
  while (rest.length) {
    let best = null;
    for (const p of PATTERNS) {
      const m = p.re.exec(rest);
      if (m && (!best || m.index < best.m.index)) best = { p, m };
    }
    if (!best) {
      nodes.push(textNode(rest.replace(/\\([\\`*_{}[\]()#+\-.!|>])/g, "$1"), marks));
      break;
    }
    const { p, m } = best;
    if (m.index > 0) nodes.push(textNode(rest.slice(0, m.index).replace(/\\([\\`*_{}[\]()#+\-.!|>])/g, "$1"), marks));
    if (p.name === "image") {
      throw new UnsupportedMarkdown(`inline image inside a sentence: ${m[0]}`);
    } else if (p.name === "code") {
      nodes.push(textNode(m[1], [...marks, { type: "code" }]));
    } else if (p.name === "link") {
      let href = m[2];
      if (href.startsWith("/")) href = siteBase.replace(/\/$/, "") + href;
      nodes.push(...parseInline(m[1], { siteBase }, [...marks, { type: "link", attrs: { href, ...LINK_ATTRS } }]));
    } else if (p.name === "bold") {
      nodes.push(...parseInline(m[1] ?? m[2], { siteBase }, [...marks, { type: "strong" }]));
    } else {
      nodes.push(...parseInline(m[1] ?? m[2], { siteBase }, [...marks, { type: "em" }]));
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return mergeText(nodes);
}

const FENCE = /^```(.*)$/;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const LIST_ITEM = /^(\s*)([-*+]|\d+\.)\s+(.*)$/;
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/;

function startsBlock(line) {
  return FENCE.test(line) || HEADING.test(line) || LIST_ITEM.test(line) || /^>/.test(line) || IMAGE_LINE.test(line);
}

/** Returns every block image in the Markdown as {alt, src}, so the caller can upload them first. */
export function collectImages(markdown) {
  const out = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (FENCE.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = IMAGE_LINE.exec(line);
    if (m) out.push({ alt: m[1], src: m[2] });
  }
  return out;
}

export function imageNode(info, alt = null) {
  return {
    type: "captionedImage",
    content: [
      {
        type: "image2",
        attrs: {
          src: info.url,
          srcNoWatermark: null,
          fullscreen: null,
          imageSize: null,
          height: info.imageHeight ?? null,
          width: info.imageWidth ?? null,
          resizeWidth: null,
          bytes: info.bytes ?? null,
          alt: alt || null,
          title: null,
          type: info.contentType ?? null,
          href: null,
          belowTheFold: false,
          topImage: false,
          internalRedirect: info.internalRedirect ?? null,
          isProcessing: false,
          align: null,
          offset: false,
        },
      },
    ],
  };
}

/**
 * @param {string} markdown article body
 * @param {{siteBase?: string, images?: Record<string, object>}} opts images maps a Markdown
 *   image src to the upload response ({url, bytes, contentType, imageWidth, imageHeight}).
 * @returns {{type: "doc", content: object[]}}
 */
export function markdownToDoc(markdown, { siteBase = "", images = {} } = {}) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const content = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const fence = FENCE.exec(line);
    if (fence) {
      const lang = fence[1].trim() || "plaintext";
      const body = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++]);
      if (i >= lines.length) throw new UnsupportedMarkdown("unterminated code fence");
      i++;
      const code = body.join("\n");
      content.push({
        type: "highlighted_code_block",
        attrs: { language: lang, nodeId: null },
        ...(code.length ? { content: [{ type: "text", text: code }] } : {}),
      });
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      content.push({
        type: "heading",
        attrs: { textAlign: null, level: heading[1].length },
        content: parseInline(heading[2], { siteBase }),
      });
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) throw new UnsupportedMarkdown("horizontal rule");
    if (/^\s*\|/.test(line)) throw new UnsupportedMarkdown("table");
    if (/^\s*<\/?[a-zA-Z]/.test(line)) throw new UnsupportedMarkdown(`raw HTML: ${line.trim().slice(0, 40)}`);

    const img = IMAGE_LINE.exec(line);
    if (img) {
      const info = images[img[2]];
      if (!info) throw new UnsupportedMarkdown(`image not uploaded: ${img[2]}`);
      content.push(imageNode(info, img[1]));
      i++;
      continue;
    }

    if (/^>/.test(line)) {
      const paras = [[]];
      while (i < lines.length && /^>/.test(lines[i])) {
        const inner = lines[i].replace(/^>\s?/, "");
        if (inner.trim()) paras[paras.length - 1].push(inner.trim());
        else if (paras[paras.length - 1].length) paras.push([]);
        i++;
      }
      content.push({
        type: "blockquote",
        content: paras.filter((p) => p.length).map((p) => paragraph(parseInline(p.join(" "), { siteBase }))),
      });
      continue;
    }

    const item = LIST_ITEM.exec(line);
    if (item) {
      if (item[1].length > 0) throw new UnsupportedMarkdown(`nested list item: ${line.trim().slice(0, 40)}`);
      const ordered = /\d/.test(item[2]);
      const start = ordered ? parseInt(item[2], 10) : 1;
      const items = [];
      while (i < lines.length) {
        const m = LIST_ITEM.exec(lines[i]);
        if (!m) break;
        if (m[1].length > 0) throw new UnsupportedMarkdown(`nested list item: ${lines[i].trim().slice(0, 40)}`);
        if (/\d/.test(m[2]) !== ordered) break;
        const parts = [m[3].trim()];
        i++;
        while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) parts.push(lines[i++].trim());
        items.push({ type: "list_item", content: [paragraph(parseInline(parts.join(" "), { siteBase }))] });
        // A blank line between items keeps the list going if the next item has the same kind.
        let j = i;
        while (j < lines.length && !lines[j].trim()) j++;
        const next = j < lines.length ? LIST_ITEM.exec(lines[j]) : null;
        if (next && next[1].length === 0 && /\d/.test(next[2]) === ordered) i = j;
        else break;
      }
      content.push(
        ordered
          ? { type: "ordered_list", attrs: { start, order: start }, content: items }
          : { type: "bullet_list", content: items }
      );
      continue;
    }

    const parts = [];
    while (i < lines.length && lines[i].trim() && (parts.length === 0 || !startsBlock(lines[i]))) {
      parts.push(lines[i++].trim());
    }
    content.push(paragraph(parseInline(parts.join(" "), { siteBase })));
  }

  return { type: "doc", content };
}
