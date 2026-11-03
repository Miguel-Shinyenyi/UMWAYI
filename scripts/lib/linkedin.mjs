// scripts/lib/linkedin.mjs
//
// Builds and sends LinkedIn posts for cross-post.mjs and linkedin-repost.mjs.
//
// An article can carry a `linkedin:` block in its front matter:
//
//   linkedin:
//     hashtags: [Meta, MetaAI]
//     mentions:
//       - name: Meta
//         urn: "urn:li:organization:10667"
//     links:
//       - label: Event
//         url: https://example.com/event
//
// Posts use the Posts API. Its commentary is "little text format": the characters
// | { } @ [ ] ( ) < > # \ * _ ~ are markup, so plain text must escape them.
// A mention is @[Name](urn) and a hashtag is {hashtag|\#|Tag}.

const API = "https://api.linkedin.com/rest/posts";
export const LINKEDIN_VERSION = process.env.LINKEDIN_API_VERSION || "202511";

const RESERVED = /[|{}@\[\]()<>#\\*_~]/g;

export function escapeLittleText(text) {
  return String(text ?? "").replace(RESERVED, (c) => `\\${c}`);
}

function hashtag(tag) {
  const clean = String(tag).replace(/^#/, "").replace(/[^\p{L}\p{N}_]/gu, "");
  if (!clean) throw new Error(`Invalid LinkedIn hashtag: ${JSON.stringify(tag)}`);
  return `{hashtag|\\#|${clean}}`;
}

function mention({ name, urn }) {
  if (!name || !/^urn:li:(organization|person):[\w-]+$/.test(urn || "")) {
    throw new Error(`Invalid LinkedIn mention: ${JSON.stringify({ name, urn })}`);
  }
  return `@[${escapeLittleText(name)}](${urn})`;
}

function checkUrl(url) {
  if (!/^https:\/\/[^\s]+$/.test(url || "")) throw new Error(`Invalid link URL: ${JSON.stringify(url)}`);
  return url;
}

// Returns the post text in little text format. URLs stay unescaped so they remain links.
export function buildCommentary({ title, summary, canonical, linkedin = {} }) {
  const blocks = [escapeLittleText(title)];
  if (summary) blocks.push(escapeLittleText(summary));

  const links = (linkedin.links || []).map((l) => `${escapeLittleText(l.label)}: ${checkUrl(l.url)}`);
  if (links.length) blocks.push(links.join("\n"));

  const mentions = (linkedin.mentions || []).map(mention);
  if (mentions.length) blocks.push(mentions.join(" "));

  const tags = (linkedin.hashtags || []).map(hashtag);
  if (tags.length) blocks.push(tags.join(" "));

  blocks.push(checkUrl(canonical));
  return blocks.join("\n\n");
}

export function buildPostBody({ author, title, summary, canonical, linkedin }) {
  return {
    author,
    commentary: buildCommentary({ title, summary, canonical, linkedin }),
    visibility: "PUBLIC",
    distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
    content: { article: { source: canonical, title, description: summary || "" } },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };
}

function headers(token, extra = {}) {
  return {
    Authorization: `Bearer ${token}`,
    "LinkedIn-Version": LINKEDIN_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
    ...extra,
  };
}

function failure(res, text) {
  if (res.status === 401) {
    return new Error(
      `LinkedIn 401: the access token has expired (personal tokens last ~60 days with no auto-refresh). Redo the OAuth flow and update the LINKEDIN_TOKEN secret. Response: ${text}`
    );
  }
  return new Error(`LinkedIn ${res.status}: ${text}`);
}

// Creates the post and returns its URN (from the x-restli-id header).
export async function createPost({ token, author, title, summary, canonical, linkedin }) {
  const res = await fetch(API, {
    method: "POST",
    headers: headers(token, { "content-type": "application/json" }),
    body: JSON.stringify(buildPostBody({ author, title, summary, canonical, linkedin })),
  });
  const text = await res.text();
  if (!res.ok) throw failure(res, text);
  const urn = res.headers.get("x-restli-id");
  if (!urn) throw new Error(`LinkedIn created a post but returned no id. Response: ${text}`);
  return urn;
}

export async function deletePost({ token, urn }) {
  const res = await fetch(`${API}/${encodeURIComponent(urn)}`, {
    method: "DELETE",
    headers: headers(token, { "X-RestLi-Method": "DELETE" }),
  });
  if (!res.ok) throw failure(res, await res.text());
}
