// scripts/cross-post.mjs
//
// Scans site/tech/** and site/philosophy/** for articles not yet cross-posted to a
// given platform, publishes them, and writes the returned URL back into the article's
// frontmatter under a `crossposted:` block so re-runs are idempotent (each platform is
// only ever posted to once per article).
//
// dev.to and Hashnode: every non-draft article in site/tech/ and site/philosophy/.
// Medium: same scope, in principle, but as of 2026-09-29 Medium has stopped issuing new
//   integration tokens entirely, not just discouraging them, so a new account has no way
//   to get one. This code path is left in place (gated on MEDIUM_TOKEN existing) in case
//   that changes, but expect it to sit unused. See docs/cross-post-setup.md.
// LinkedIn: site/tech/ only, a short TL;DR + link post rather than a full cross-post,
//   since the personal-profile share API isn't meant for long-form content. Best-effort:
//   a failure here surfaces as a failed workflow run rather than being silently dropped,
//   but never blocks dev.to/Hashnode.
//
// Requires Node 20+ (built-in fetch). Run from the repo root.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const SITE_BASE_URL = process.env.SITE_BASE_URL; // e.g. https://miguel-shinyenyi.github.io/miguel-site
if (!SITE_BASE_URL) {
  console.error("SITE_BASE_URL is not set. Refusing to publish without a canonical link back to the site.");
  process.exit(1);
}

const DEVTO_API_KEY = process.env.DEVTO_API_KEY;
const HASHNODE_TOKEN = process.env.HASHNODE_TOKEN;
const HASHNODE_PUBLICATION_ID = process.env.HASHNODE_PUBLICATION_ID;
const MEDIUM_TOKEN = process.env.MEDIUM_TOKEN;
const LINKEDIN_TOKEN = process.env.LINKEDIN_TOKEN;
const LINKEDIN_AUTHOR_URN = process.env.LINKEDIN_AUTHOR_URN; // e.g. urn:li:person:xxxxxxx

const CATEGORIES = [
  { dir: "site/tech", category: "tech", linkedin: true },
  { dir: "site/philosophy", category: "philosophy", linkedin: false },
];

let hadFailure = false;
const summary = [];

function listArticles(dir) {
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
}

function canonicalUrl(category, slug) {
  return `${SITE_BASE_URL.replace(/\/$/, "")}/${category}/${slug}/`;
}

async function publishToDevTo({ title, summary, bodyMarkdown, tags, canonical }) {
  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "api-key": DEVTO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      article: {
        title,
        published: true,
        body_markdown: bodyMarkdown,
        tags: tags.slice(0, 4).map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, "")),
        canonical_url: canonical,
        description: summary,
      },
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`dev.to ${res.status}: ${text}`);
  const json = JSON.parse(text);
  return json.url;
}

async function hashnodePublicationId() {
  if (HASHNODE_PUBLICATION_ID) return HASHNODE_PUBLICATION_ID;
  const res = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: { Authorization: HASHNODE_TOKEN, "content-type": "application/json" },
    body: JSON.stringify({
      query: `query { me { publications(first: 5) { edges { node { id title url } } } } }`,
    }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Hashnode publication lookup returned non-JSON: ${text.slice(0, 300)}`);
  }
  if (json.errors) throw new Error(`Hashnode publication lookup: ${JSON.stringify(json.errors)}`);
  const pub = json.data?.me?.publications?.edges?.[0]?.node;
  if (!pub) throw new Error("No Hashnode publication found on this account.");
  return pub.id;
}

// NOTE: field names below match Hashnode's community-documented publishPost mutation
// as of late 2024 (title, publicationId, contentMarkdown, tags as {slug,name} objects
// capped at 5, originalArticleURL for canonical attribution). I could not reach
// https://apidocs.hashnode.com/ directly to verify the current, exact schema before
// writing this. Before the first real run, load that page yourself (or run this once
// against a throwaway draft) and adjust field names here if the API rejects the request,
// the error will name the invalid field.
async function publishToHashnode({ title, bodyMarkdown, tags, canonical }) {
  const publicationId = await hashnodePublicationId();
  const res = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: { Authorization: HASHNODE_TOKEN, "content-type": "application/json" },
    body: JSON.stringify({
      query: `mutation Pub($input: PublishPostInput!) { publishPost(input: $input) { post { id url slug } } }`,
      variables: {
        input: {
          title,
          publicationId,
          contentMarkdown: bodyMarkdown,
          originalArticleURL: canonical,
          tags: tags.slice(0, 5).map((t) => ({ slug: t.toLowerCase().replace(/[^a-z0-9]/g, "-"), name: t })),
        },
      },
    }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Hashnode returned non-JSON (likely an infra error page): ${text.slice(0, 300)}`);
  }
  if (json.errors) throw new Error(`Hashnode: ${JSON.stringify(json.errors)}`);
  return json.data.publishPost.post.url;
}

async function publishToMedium({ title, bodyMarkdown, tags, canonical }) {
  const meRes = await fetch("https://api.medium.com/v1/me", {
    headers: { Authorization: `Bearer ${MEDIUM_TOKEN}` },
  });
  const meText = await meRes.text();
  if (!meRes.ok) throw new Error(`Medium /v1/me ${meRes.status}: ${meText}`);
  const userId = JSON.parse(meText).data.id;

  const res = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MEDIUM_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title,
      contentFormat: "markdown",
      content: bodyMarkdown,
      canonicalUrl: canonical,
      tags: tags.slice(0, 5),
      publishStatus: "public",
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Medium ${res.status}: ${text}`);
  return JSON.parse(text).data.url;
}

async function postToLinkedIn({ title, tldr, canonical }) {
  const commentary = `${title}\n\n${tldr}\n\n${canonical}`;
  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LINKEDIN_TOKEN}`,
      "content-type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: LINKEDIN_AUTHOR_URN,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: commentary },
          shareMediaCategory: "ARTICLE",
          media: [{ status: "READY", originalUrl: canonical }],
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        `LinkedIn 401: the access token has expired (personal tokens last ~60 days with no auto-refresh). Redo the OAuth flow and update the LINKEDIN_TOKEN secret. Response: ${text}`
      );
    }
    throw new Error(`LinkedIn ${res.status}: ${text}`);
  }
  return res.headers.get("x-restli-id") || "posted";
}

for (const { dir, category, linkedin } of CATEGORIES) {
  for (const file of listArticles(dir)) {
    const filePath = path.join(dir, file);
    const raw = readFileSync(filePath, "utf8");
    const parsed = matter(raw);
    const fm = parsed.data;

    if (fm.draft) continue;

    const slug = file.replace(/\.md$/, "");
    const canonical = canonicalUrl(category, slug);
    const crossposted = fm.crossposted || {};
    let changed = false;

    const bodyMarkdown = `${parsed.content.trim()}\n\n---\n\nOriginally published on [my site](${canonical}).\n`;

    if (!crossposted.devto && DEVTO_API_KEY) {
      try {
        crossposted.devto = await publishToDevTo({
          title: fm.title,
          summary: fm.summary,
          bodyMarkdown,
          tags: fm.tags || [],
          canonical,
        });
        changed = true;
        summary.push(`dev.to: ${fm.title} -> ${crossposted.devto}`);
      } catch (err) {
        hadFailure = true;
        summary.push(`dev.to FAILED for ${fm.title}: ${err.message}`);
      }
    }

    if (!crossposted.hashnode && HASHNODE_TOKEN) {
      try {
        crossposted.hashnode = await publishToHashnode({
          title: fm.title,
          bodyMarkdown,
          tags: fm.tags || [],
          canonical,
        });
        changed = true;
        summary.push(`Hashnode: ${fm.title} -> ${crossposted.hashnode}`);
      } catch (err) {
        hadFailure = true;
        summary.push(`Hashnode FAILED for ${fm.title}: ${err.message}`);
      }
    }

    if (!crossposted.medium && MEDIUM_TOKEN) {
      try {
        crossposted.medium = await publishToMedium({
          title: fm.title,
          bodyMarkdown,
          tags: fm.tags || [],
          canonical,
        });
        changed = true;
        summary.push(`Medium: ${fm.title} -> ${crossposted.medium}`);
      } catch (err) {
        hadFailure = true;
        summary.push(`Medium FAILED (best-effort, unsupported API) for ${fm.title}: ${err.message}`);
      }
    }

    if (linkedin && !crossposted.linkedin && LINKEDIN_TOKEN) {
      try {
        crossposted.linkedin = await postToLinkedIn({
          title: fm.title,
          tldr: fm.summary,
          canonical,
        });
        changed = true;
        summary.push(`LinkedIn: ${fm.title} -> posted`);
      } catch (err) {
        hadFailure = true;
        summary.push(`LinkedIn FAILED for ${fm.title}: ${err.message}`);
      }
    }

    if (changed) {
      fm.crossposted = crossposted;
      const updated = matter.stringify(parsed.content, fm);
      writeFileSync(filePath, updated);
    }
  }
}

const summaryText = summary.length ? summary.join("\n") : "Nothing new to cross-post.";
console.log(summaryText);
if (process.env.GITHUB_STEP_SUMMARY) {
  writeFileSync(process.env.GITHUB_STEP_SUMMARY, `## Cross-post results\n\n\`\`\`\n${summaryText}\n\`\`\`\n`, {
    flag: "a",
  });
}

if (hadFailure) {
  console.error("\nOne or more platforms failed. See above. dev.to/Hashnode successes, if any, were still saved.");
  process.exit(1);
}