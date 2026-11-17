// Threads: two steps. Create a media container, then publish it.
// Docs: https://developers.facebook.com/docs/threads/posts (read 2026-11-17): permission
// threads_content_publish, text limit 500, 250 published posts per 24 hours.
// The page did not show the exact endpoint paths. They are from memory and must be
// confirmed on the first live post, which the owner approves. Text posts only.
import { request } from "./http.mjs";

const API = "https://graph.threads.net/v1.0";

export const threads = {
  platform: "threads",
  secrets: ["THREADS_TOKEN"],
  configKeys: ["user_id"],
  defaultLimit: 500,
  media: false,

  describe(text, cfg) {
    return [
      `POST ${API}/${cfg.user_id}/threads (media_type TEXT, ${[...text].length} characters, token [THREADS_TOKEN])`,
      `POST ${API}/${cfg.user_id}/threads_publish (creation_id from step 1)`,
      `GET ${API}/{post id}?fields=permalink`,
    ];
  },

  async publish({ text, cfg, secrets, fetch }) {
    if (!/^\d{1,30}$/.test(String(cfg.user_id ?? ""))) throw new Error("threads user_id must be digits");
    const token = secrets.THREADS_TOKEN;
    const made = await request(fetch, `${API}/${cfg.user_id}/threads`, {
      form: { media_type: "TEXT", text, access_token: token },
      secrets: [token],
    });
    if (!made.id) throw new Error("step 1 returned no container id");
    const pub = await request(fetch, `${API}/${cfg.user_id}/threads_publish`, {
      form: { creation_id: made.id, access_token: token },
      secrets: [token],
    });
    if (!pub.id) throw new Error("step 2 returned no post id");
    const info = await request(fetch, `${API}/${encodeURIComponent(pub.id)}?fields=permalink`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      secrets: [token],
    });
    if (typeof info.permalink !== "string" || !info.permalink.startsWith("https://")) throw new Error("no permalink in the reply");
    return { url: info.permalink };
  },
};
