// pack: one private file to copy and paste from. It reads the queue and the drafts, runs the
// checks, and writes COPY-PASTE-PACK.md in the private folder. It posts nothing and changes
// no queue item. An item that is not approved says so at the top, with the reasons.
import fs from "node:fs";
import path from "node:path";
import { readQueue, gatherContext } from "./io.mjs";
import { runChecks, exitCodeFor } from "./checks.mjs";
import { effectiveStatus } from "./queue.mjs";
import { hashOf } from "./commands.mjs";

export const PLACES = {
  hackernews: { url: "https://news.ycombinator.com/submit", steps: "Open the page. Paste the title in the title box and the repo link in the url box. Submit. Then open your new post and add the text below as the first comment, within minutes. Post once and never repost." },
  reddit: { url: "https://www.reddit.com/submit", steps: "Open the page for the subreddit you chose. Check its rules first. Paste the title and the text. Post. Do not post the same text in another subreddit." },
  discord: { url: "the server you joined", steps: "Introduce yourself first. Post only in the showcase channel. One message per server. No direct messages." },
  threads: { url: "https://www.threads.com", steps: "Open Threads. Start a new post. Paste the text. Post." },
  linkedin: { url: "https://www.linkedin.com", steps: "Start a post. Paste the text. Check that each mention and hashtag resolves. Post." },
  indiehackers: { url: "https://www.indiehackers.com", steps: "Open the group that fits. Start a post. Paste the title and the text. Post once." },
  producthunt: { url: "https://www.producthunt.com", steps: "Fill the product page: tagline from the title, description from the description item, and the maker comment from the comment item. Schedule it for 12:01 AM Pacific, which is 11:01 in Nairobi. Do not ask anyone to vote." },
  youtube: { url: "https://studio.youtube.com", steps: "Upload the video. Paste the title and the description. Add chapters from the final cut. Answer the AI use question. Show the answers to Claude before you save." },
  instagram: { url: "https://www.instagram.com", steps: "Create the Reel. Paste the caption. Make sure the link is in your bio first." },
  peerlist: { url: "https://peerlist.io/launchpad", steps: "Add the project to your profile with all mandatory fields. Paste the tagline and the description. Launch on a Monday. Do not ask for votes." },
  devhunt: { url: "https://devhunt.org", steps: "Open the submit page and sign in. Stop at any price. Paste the tagline and the description." },
  futuretools: { url: "https://www.futuretools.io/submit-a-tool", steps: "Fill the form. Paste the short description. Pricing model: Open Source. They may not list it." },
  uneed: { url: "https://www.uneed.best/submit-a-tool", steps: "Submit with the free queue. Do not click fast-track or skip the line." },
  microlaunch: { url: "https://microlaunch.net", steps: "Use the free launch. Do not click Premium or Pro." },
  betalist: { url: "https://betalist.com/submit", steps: "Submit the address and your email. A claim link arrives by email. Check the free queue and the fit before you pick a plan. Do not pay." },
};

export function buildPack(env, today) {
  const items = readQueue(env).filter((i) => i.status !== "posted" && i.status !== "skipped");
  items.sort((a, b) => (a.earliest_date ?? "").localeCompare(b.earliest_date ?? "") || a.id.localeCompare(b.id));
  const all = readQueue(env);
  const blockers = new Map();
  const sections = [];
  for (const item of items) {
    const ctx = gatherContext(env, item, all);
    const result = runChecks(ctx);
    const code = exitCodeFor(result);
    let status = item.status;
    if (status === "approved" && ctx.body !== null) status = effectiveStatus(item, hashOf(ctx));
    const cleared = status === "approved" && code === 0;
    for (const r of [...result.fails, ...result.unknowns]) {
      const key = r.replace(/ for [a-z]+/, "").replace(/ on line \d+/, "");
      blockers.set(key, (blockers.get(key) ?? 0) + 1);
    }
    const place = PLACES[item.platform] ?? { url: "", steps: "Paste the text where it belongs." };
    const head = cleared ? "CLEARED: Miguel approved this exact text" : "NOT CLEARED, do not post yet";
    const lines = [];
    lines.push(`=== ${item.id} ===`);
    lines.push(head);
    lines.push(`Platform: ${item.platform}. Who posts: ${item.mode === "manual" ? "you, by hand" : "you paste it, or Claude fills the form in your Chrome after your yes"}. Proposed date: ${item.earliest_date ?? "any day"}. Open: ${place.url}`);
    if (!cleared) {
      const why = [...result.fails.map((f) => `fails: ${f}`), ...result.unknowns.map((u) => `cannot decide: ${u}`)];
      if (status !== "approved") why.push(`status is ${status}, not approved`);
      lines.push("Why not:", ...why.map((w) => `  ${w}`));
    }
    if (item.notes) lines.push(`Note: ${item.notes}`);
    lines.push(`Steps: ${place.steps}`);
    if (item.title) lines.push("", "----- TITLE, copy from here -----", item.title, "----- end of title -----");
    lines.push("", "----- TEXT, copy from here -----", ctx.body === null ? "(no text: " + (ctx.bodyProblem ?? "no body file") + ")" : ctx.body.trimEnd(), "----- end of text -----");
    if (item.link) lines.push(`Link: ${item.link}`);
    lines.push(`After you post: send me the URL and I record it. Item id: ${item.id}`);
    sections.push(lines.join("\n"));
  }
  const top = [
    "COPY AND PASTE PACK",
    `Made ${today}. Private. Nothing here has been posted.`,
    "Only paste an item marked CLEARED. A cleared item is one you approved, whose text has not changed since, and that passes every check.",
    "",
    "WHAT STOPS ITEMS FROM BEING CLEARED, with how many items each affects:",
    ...(blockers.size ? [...blockers.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `  ${n} x ${k}`) : ["  nothing"]),
    "",
  ];
  return top.join("\n") + "\n" + sections.join("\n\n") + "\n";
}

export function pack(env, today) {
  const text = buildPack(env, today);
  const file = path.join(env.socialDir, "COPY-PASTE-PACK.md");
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, text, { mode: 0o600 });
  fs.renameSync(tmp, file);
  const cleared = (text.match(/^CLEARED:/gm) ?? []).length;
  const total = (text.match(/^=== /gm) ?? []).length;
  return { code: 0, out: [`wrote ${file}`, `${total} items, ${cleared} cleared to post, ${total - cleared} not cleared`, "nothing was posted"] };
}
