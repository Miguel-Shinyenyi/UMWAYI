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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// dev.to rate-limits article creation to roughly one per 30s. The first run of this script
// posted two articles and then 429'd on the remaining four, because it fired them
// back-to-back with no gap. Two defences, since either alone is not enough: hold a minimum
// gap between creations so the limit is normally never reached, and still retry on a 429 in
// case the limit is stricter than we think or the account is busy elsewhere.
const DEVTO_MIN_GAP_MS = 31000;
const DEVTO_RETRY_WAIT_MS = 35000;
const DEVTO_MAX_ATTEMPTS = 3;
let devtoLastPostAt = 0;

async function devtoCreate(bodyMarkdown, { title, summary, tags, canonical }) {
  return fetch("https://dev.to/api/articles", {
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
}

async function publishToDevTo({ title, summary, bodyMarkdown, tags, canonical }) {
  let lastError;
  for (let attempt = 1; attempt <= DEVTO_MAX_ATTEMPTS; attempt++) {
    const since = Date.now() - devtoLastPostAt;
    if (devtoLastPostAt && since < DEVTO_MIN_GAP_MS) {
      await sleep(DEVTO_MIN_GAP_MS - since);
    }

    const res = await devtoCreate(bodyMarkdown, { title, summary, tags, canonical });
    const text = await res.text();
    devtoLastPostAt = Date.now();

    if (res.ok) return JSON.parse(text).url;

    lastError = `dev.to ${res.status}: ${text}`;
    // Only a 429 is worth retrying. Anything else (bad tag, duplicate title, bad key) will
    // fail again identically, and retrying it just delays the rest of the queue.
    if (res.status !== 429 || attempt === DEVTO_MAX_ATTEMPTS) break;
    console.log(`dev.to rate-limited on "${title}", waiting ${DEVTO_RETRY_WAIT_MS / 1000}s (attempt ${attempt} of ${DEVTO_MAX_ATTEMPTS})`);
    await sleep(DEVTO_RETRY_WAIT_MS);
  }
  throw new Error(lastError);
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
    // This is what a retired endpoint looks like from here: gql.hashnode.com 301s to an
    // announcement page, so we get HTML back instead of GraphQL. Say that plainly rather
    // than dumping 300 characters of Next.js markup into the log, which is what the first
    // run did and which told us nothing.
    const looksLikeHtml = /^\s*(<!DOCTYPE|<html)/i.test(text);
    throw new Error(
      looksLikeHtml
        ? "Hashnode returned HTML, not GraphQL. Free GraphQL API access was retired on 2026-05-13; " +
          "every query and mutation now needs a Pro plan on the publication " +
          "(https://hashnode.com/changelog/2026-05-13-graphql-api-paid-access). " +
          "Until Pro is active, unset the HASHNODE_TOKEN secret so this is skipped cleanly instead of failing every run."
        : `Hashnode publication lookup returned non-JSON: ${text.slice(0, 300)}`
    );
  }
  if (json.errors) throw new Error(`Hashnode publication lookup: ${JSON.stringify(json.errors)}`);
  const pub = json.data?.me?.publications?.edges?.[0]?.node;
  if (!pub) throw new Error("No Hashnode publication found on this account.");
  return pub.id;
}

// NOTE: these field names are still UNVERIFIED against a real response, and the 2026-09-29
// run did not test them. It never got that far: the publication lookup above failed first,
// because Hashnode retired free GraphQL API access on 2026-05-13 and now requires a Pro
// plan for queries as well as mutations. So the original worry (wrong field names, taken
// from a community writeup) was never the blocker, and is also still not ruled out.
// If Pro is ever enabled, expect to verify these against
// https://apidocs.hashnode.com/ on the first real attempt: title, publicationId,
// contentMarkdown, tags as {slug,name} objects capped at 5, originalArticleURL for the
// canonical. A rejected request names the offending field.
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