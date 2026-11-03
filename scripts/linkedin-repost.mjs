// scripts/linkedin-repost.mjs
//
// Re-posts one article to LinkedIn using its `linkedin:` front matter block (hashtags,
// company mentions, extra links), then deletes the old post. The new post is created
// first, so a rejected request leaves the old post untouched.
//
// Usage (from the repo root; run by .github/workflows/linkedin-repost.yml):
//   node scripts/linkedin-repost.mjs --slug <slug> [--delete-urn <urn>] [--dry-run]
//
// Env: SITE_BASE_URL, LINKEDIN_TOKEN, LINKEDIN_AUTHOR_URN. --dry-run needs only SITE_BASE_URL
// and prints the post text and request body without sending anything.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import matter from "gray-matter";
import { buildPostBody, createPost, deletePost } from "./lib/linkedin.mjs";

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const slug = flag("--slug");
const oldUrn = flag("--delete-urn");
const dryRun = args.includes("--dry-run");

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: node scripts/linkedin-repost.mjs --slug <slug> [--delete-urn <urn>] [--dry-run]");
  process.exit(64);
}
if (oldUrn && !/^urn:li:(share|ugcPost):\d+$/.test(oldUrn)) {
  console.error(`--delete-urn must look like urn:li:share:123, got ${JSON.stringify(oldUrn)}`);
  process.exit(64);
}

const base = process.env.SITE_BASE_URL;
if (!base) {
  console.error("SITE_BASE_URL is not set. Refusing to post without a link back to the site.");
  process.exit(1);
}
const token = process.env.LINKEDIN_TOKEN;
const author = process.env.LINKEDIN_AUTHOR_URN;
if (!dryRun && (!token || !author)) {
  console.error("LINKEDIN_TOKEN and LINKEDIN_AUTHOR_URN must be set.");
  process.exit(1);
}

// LinkedIn posts exist for site/tech/ only, the same scope as cross-post.mjs.
const file = `site/tech/${slug}.md`;
if (!existsSync(file)) {
  console.error(`No article at ${file}.`);
  process.exit(1);
}
const parsed = matter(readFileSync(file, "utf8"));
const fm = parsed.data;
if (fm.draft) {
  console.error(`${file} is a draft. Refusing to post it.`);
  process.exit(1);
}

const canonical = `${base.replace(/\/$/, "")}/tech/${slug}/`;
const post = { title: fm.title, summary: fm.summary, canonical, linkedin: fm.linkedin };

if (dryRun) {
  console.log(JSON.stringify(buildPostBody({ author: author || "urn:li:person:EXAMPLE", ...post }), null, 2));
  console.log(`\nWould delete: ${oldUrn || "(nothing)"}\nNothing was sent.`);
  process.exit(0);
}

const newUrn = await createPost({ token, author, ...post });
console.log(`Posted ${newUrn}`);

// Record the new post right away, so the link is kept even if the delete below fails.
fm.crossposted = { ...(fm.crossposted || {}), linkedin: newUrn };
writeFileSync(file, matter.stringify(parsed.content, fm));

if (oldUrn && oldUrn !== newUrn) {
  try {
    await deletePost({ token, urn: oldUrn });
    console.log(`Deleted ${oldUrn}`);
  } catch (err) {
    console.error(`New post is live, but deleting ${oldUrn} failed: ${err.message}`);
    process.exit(1);
  }
}
