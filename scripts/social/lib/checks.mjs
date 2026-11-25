// The rule checks for one queue item. Pure: everything it needs arrives in ctx.
// Result: { fails, unknowns, notes }. fails -> exit 2, unknowns -> exit 3, neither -> exit 0.

const EM_DASH = "—";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phraseRegex(phrase) {
  return new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(phrase.trim())}(?![\\p{L}\\p{N}])`, "iu");
}

export function parseList(text) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
}

// Share of words two texts have in common (0 to 1). Short texts give 0.
export function similarity(a, b) {
  const words = (t) => new Set(String(t).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 3));
  const x = words(a);
  const y = words(b);
  if (x.size < 8 || y.size < 8) return 0;
  let both = 0;
  for (const w of x) if (y.has(w)) both++;
  return both / (x.size + y.size - both);
}

export function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

export function extractUrls(text) {
  const out = [];
  for (const m of text.matchAll(/https?:\/\/[^\s)>\]"'<]+/g)) {
    out.push(m[0].replace(/[.,;:!?]+$/, ""));
  }
  return out;
}

export function urlAllowed(url, allowlist) {
  if (!url.startsWith("https://")) return false;
  return allowlist.some((entry) => {
    const e = entry.trim();
    if (!e.startsWith("https://")) return false;
    if (url === e) return true;
    const base = e.endsWith("/") ? e : `${e}/`;
    return url.startsWith(base) || url.startsWith(`${e}?`) || url.startsWith(`${e}#`);
  });
}

function limitState(entry, name) {
  const lim = entry?.[name];
  if (!lim || typeof lim !== "object") return { value: "unknown", checked: false };
  return { value: lim.value, checked: lim.checked === true, url: lim.url ?? null, date: lim.date ?? null };
}

function lengthOf(s) {
  return [...s].length;
}

export function runChecks(ctx) {
  const fails = [];
  const unknowns = [];
  const notes = [];
  const { item } = ctx;
  const title = item.title ?? "";
  const body = ctx.body ?? "";
  const text = `${title}\n${body}`;

  // Inputs that must exist.
  if (item.body_file === null) fails.push("body: the item has no body_file");
  else if (ctx.bodyProblem) fails.push(`body: ${ctx.bodyProblem}`);

  // Platform limits.
  const entry = ctx.limits;
  if (!entry) {
    unknowns.push(`limits: no entry for platform ${item.platform} in limits.json`);
  } else {
    const checks = [];
    if (item.title !== null) checks.push(["title_max", "title", lengthOf(title)]);
    if (ctx.body !== null && ctx.body !== undefined) checks.push(["body_max", "body", lengthOf(body)]);
    for (const [key, label, len] of checks) {
      // A platform with two text fields can set a limit for one kind: "<kind>_body_max" beats "body_max".
      const st = limitState(entry, entry?.[`${item.kind}_${key}`] ? `${item.kind}_${key}` : key);
      if (typeof st.value === "number") {
        if (len > st.value) fails.push(`limit: ${label} is ${len} characters, over the ${st.value} limit${st.checked ? "" : " (limit not yet confirmed)"}`);
        else if (!st.checked) unknowns.push(`limit: ${label} limit ${st.value} for ${item.platform} is not confirmed on the platform's own page`);
      } else {
        unknowns.push(`limit: ${label} limit for ${item.platform} is unknown`);
      }
    }
  }

  // Style rules.
  const ph = /\[\[[^\]]*\]\]/.exec(text);
  if (ph) fails.push(`placeholder: "${ph[0].slice(0, 40)}" on line ${lineOf(text, ph.index)} is not filled in`);

  for (const o of ctx.others ?? []) {
    const sim = similarity(body, o.body);
    if (sim >= 0.7) fails.push(`copy: ${Math.round(sim * 100)} percent the same as ${o.id} on ${item.platform}; write each post for its own place`);
  }

  const dash = text.indexOf(EM_DASH);
  if (dash !== -1) fails.push(`no-em-dash: found on line ${lineOf(text, dash)}`);

  if (entry?.hashtags_allowed !== true) {
    const m = /(^|[\s(])#\p{L}[\p{L}\p{N}_]*/u.exec(text);
    if (m) fails.push(`no-hashtag: found on line ${lineOf(text, m.index)} and ${item.platform} does not allow hashtags here`);
  }

  if (text.includes("*")) fails.push(`no-markdown: asterisk on line ${lineOf(text, text.indexOf("*"))}`);
  if (text.includes("`")) fails.push(`no-markdown: backtick on line ${lineOf(text, text.indexOf("`"))}`);
  const heading = /^\s*#{1,6}\s/m.exec(text);
  if (heading) fails.push(`no-markdown: heading marker on line ${lineOf(text, heading.index)}`);
  const mdlink = /\[[^\]]+\]\([^)]+\)/.exec(text);
  if (mdlink) fails.push(`no-markdown: link syntax on line ${lineOf(text, mdlink.index)}`);
  const hyphen = /^\s*[-+]\s/m.exec(text);
  if (hyphen) fails.push(`bullet: line ${lineOf(text, hyphen.index)} starts with a hyphen; start bullet lines with the bullet character`);

  // Word lists. A missing claims, company or allowlist file is "cannot decide", never a pass.
  // A missing banned-words.txt is the exception: the owner has no list, so that check is skipped.
  const lists = [
    ["banned-words", ctx.banned, "banned-words.txt"],
    ["claims", ctx.claims, "claims-blocklist.txt"],
    ["company", ctx.companies, "company-blocklist.txt"],
  ];
  for (const [name, list, file] of lists) {
    if (!list) {
      if (name !== "banned-words") unknowns.push(`${name}: ${file} is missing, so this check cannot run`);
      continue;
    }
    for (const phrase of list) {
      const m = phraseRegex(phrase).exec(text);
      if (m) fails.push(`${name}: "${phrase}" on line ${lineOf(text, m.index)}`);
    }
  }

  // Links.
  if (!ctx.allowlist) {
    unknowns.push("links: link-allowlist.txt is missing, so link checks cannot run");
  } else {
    const urls = [...extractUrls(text)];
    if (item.link) urls.push(item.link);
    for (const u of new Set(urls)) {
      if (!u.startsWith("https://")) fails.push(`links: ${u} is not https`);
      else if (!urlAllowed(u, ctx.allowlist)) fails.push(`links: ${u} is not on the allowlist`);
    }
  }

  // Source article or repo.
  const src = ctx.source;
  if (!src || src.state === "none") fails.push("source: the item has no source");
  else if (src.state !== "ok") fails.push(`source: ${src.detail}`);

  // Media.
  for (const m of ctx.mediaProblems ?? []) fails.push(`media: ${m}`);

  // AI assistance label.
  if (item.ai_assisted === "unknown") unknowns.push(`ai_assisted: not set for ${item.platform}; ask Miguel`);

  return { fails, unknowns, notes };
}

export function exitCodeFor(result) {
  if (result.fails.length) return 2;
  if (result.unknowns.length) return 3;
  return 0;
}
