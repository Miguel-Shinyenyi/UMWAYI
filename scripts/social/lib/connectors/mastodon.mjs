// Mastodon: POST /api/v1/statuses with a user token that has the write:statuses scope.
// Docs: https://docs.joinmastodon.org/methods/statuses/ (read 2026-11-17).
// The character limit depends on the instance, so it is set in connectors.json.
import { request, checkHttpsHost } from "./http.mjs";

export const mastodon = {
  platform: "mastodon",
  secrets: ["MASTODON_TOKEN"],
  configKeys: ["instance"],
  defaultLimit: 500,
  media: false,

  describe(text, cfg) {
    const origin = checkHttpsHost(cfg.instance, "mastodon instance");
    return [`POST ${origin}/api/v1/statuses`, `header Authorization: Bearer [MASTODON_TOKEN]`, `header Idempotency-Key: [hash of the approved content]`, `body: status (${[...text].length} characters), visibility public`];
  },

  async publish({ text, hash, cfg, secrets, fetch }) {
    const origin = checkHttpsHost(cfg.instance, "mastodon instance");
    const token = secrets.MASTODON_TOKEN;
    const res = await request(fetch, `${origin}/api/v1/statuses`, {
      headers: { Authorization: `Bearer ${token}`, "Idempotency-Key": hash.slice(0, 32) },
      json: { status: text, visibility: "public" },
      secrets: [token],
    });
    if (typeof res.url !== "string" || !res.url.startsWith("https://")) throw new Error("the reply had no post URL");
    return { url: res.url };
  },
};
