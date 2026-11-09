// scripts/lib/substack-promo.mjs
//
// Builds the promotion paragraphs for the Substack footer from an article's `linkedin:`
// front matter, so Substack carries the same event links and company pointers as LinkedIn.
// Substack has no company mentions, so a mention becomes a link to the company page.
// Give each mention a `url` (its LinkedIn company page) in the front matter. Without one,
// the name is plain text.

const LINK_ATTRS = { target: "_blank", rel: "noopener noreferrer nofollow", class: null };

function linkText(text, href) {
  return { type: "text", text, marks: [{ type: "link", attrs: { href, ...LINK_ATTRS } }] };
}

function paragraph(content) {
  return { type: "paragraph", attrs: { textAlign: null }, content };
}

function checkUrl(url, what) {
  if (!/^https:\/\/[^\s]+$/.test(url || "")) throw new Error(`Invalid ${what} URL: ${JSON.stringify(url)}`);
  return url;
}

// Returns an array of ProseMirror paragraph nodes. Empty when the article has nothing to promote.
export function buildPromoParagraphs(linkedin = {}) {
  const out = [];

  for (const l of linkedin.links || []) {
    out.push(paragraph([{ type: "text", text: `${l.label}: ` }, linkText(checkUrl(l.url, "link"), l.url)]));
  }

  const mentions = linkedin.mentions || [];
  if (mentions.length) {
    const content = [{ type: "text", text: "Follow: " }];
    mentions.forEach((m, i) => {
      if (i > 0) content.push({ type: "text", text: " · " });
      content.push(m.url ? linkText(m.name, checkUrl(m.url, "mention")) : { type: "text", text: m.name });
    });
    out.push(paragraph(content));
  }

  return out;
}
