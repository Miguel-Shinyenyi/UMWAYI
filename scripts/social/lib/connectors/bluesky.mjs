// Bluesky: AT Protocol over HTTPS. Sign in with an app password, then create an
// app.bsky.feed.post record. Links need facets to be clickable; they are built here.
// The Bluesky docs page could not be read on 2026-11-17 (it returned no text), so the
// endpoint names below are from memory of the AT Protocol and must be confirmed on the
// first live post, which the owner approves.
import { request, checkHttpsHost } from "./http.mjs";

const URL_RE = /https:\/\/[^\s)>\]"'<]+/g;

export function buildFacets(text) {
  const enc = new TextEncoder();
  const facets = [];
  for (const m of text.matchAll(URL_RE)) {
    const url = m[0].replace(/[.,;:!?]+$/, "");
    const start = enc.encode(text.slice(0, m.index)).length;
    const end = start + enc.encode(url).length;
    facets.push({ index: { byteStart: start, byteEnd: end }, features: [{ $type: "app.bsky.richtext.facet#link", uri: url }] });
  }
  return facets;
}

export const bluesky = {
  platform: "bluesky",
  secrets: ["BLUESKY_APP_PASSWORD"],
  configKeys: ["handle"], // "service" is optional and defaults to https://bsky.social
  defaultLimit: 300,
  media: false,

  describe(text, cfg) {
    const origin = checkHttpsHost(cfg.service ?? "https://bsky.social", "bluesky service");
    return [
      `POST ${origin}/xrpc/com.atproto.server.createSession (handle ${cfg.handle}, password [BLUESKY_APP_PASSWORD])`,
      `POST ${origin}/xrpc/com.atproto.repo.createRecord (collection app.bsky.feed.post, ${[...text].length} characters, ${buildFacets(text).length} link facets)`,
    ];
  },

  async publish({ text, cfg, secrets, fetch, now = new Date() }) {
    const origin = checkHttpsHost(cfg.service ?? "https://bsky.social", "bluesky service");
    const pw = secrets.BLUESKY_APP_PASSWORD;
    const session = await request(fetch, `${origin}/xrpc/com.atproto.server.createSession`, {
      json: { identifier: cfg.handle, password: pw },
      secrets: [pw],
    });
    if (typeof session.accessJwt !== "string" || typeof session.did !== "string") throw new Error("sign-in reply was not understood");
    const record = { $type: "app.bsky.feed.post", text, createdAt: now.toISOString() };
    const facets = buildFacets(text);
    if (facets.length) record.facets = facets;
    const res = await request(fetch, `${origin}/xrpc/com.atproto.repo.createRecord`, {
      headers: { Authorization: `Bearer ${session.accessJwt}` },
      json: { repo: session.did, collection: "app.bsky.feed.post", record },
      secrets: [pw, session.accessJwt],
    });
    const rkey = typeof res.uri === "string" ? res.uri.split("/").pop() : null;
    if (!rkey) throw new Error("the reply had no post id");
    return { url: `https://bsky.app/profile/${cfg.handle}/post/${rkey}` };
  },
};
