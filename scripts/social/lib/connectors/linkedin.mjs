// LinkedIn: the same official Posts API and the same text rules that scripts/cross-post.mjs
// and scripts/linkedin-repost.mjs already use. This reuses their module (scripts/lib/linkedin.mjs)
// for escaping, @mentions, #hashtags and the article link, so a launch post is built the same
// way as an article post. The same credentials apply: LINKEDIN_TOKEN, and the author URN.
// The token lasts about 60 days with no refresh; when it expires LinkedIn answers 401.
import { request, ConnectorError } from "./http.mjs";
import { buildCommentaryFromText, LINKEDIN_VERSION } from "../../../lib/linkedin.mjs";

const API = "https://api.linkedin.com/rest/posts";

function build(text, cfg, item) {
  if (!/^urn:li:(person|organization):[\w-]+$/.test(String(cfg.author_urn ?? ""))) {
    throw new ConnectorError("linkedin author_urn must look like urn:li:person:xxxx");
  }
  if (!item?.link || !item.link.startsWith("https://")) throw new ConnectorError("a LinkedIn launch post needs an https link on the item");
  const linked = text.split(item.link).join("[article link]");
  const commentary = buildCommentaryFromText(linked, { canonical: item.link, linkedin: { mentions: cfg.mentions ?? [] } });
  const title = (item.title && item.title.trim()) || text.split("\n")[0].slice(0, 100);
  return {
    author: cfg.author_urn,
    commentary,
    visibility: "PUBLIC",
    distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
    content: { article: { source: item.link, title, description: "" } },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };
}

export const linkedin = {
  platform: "linkedin",
  secrets: ["LINKEDIN_TOKEN"],
  configKeys: ["author_urn"],
  defaultLimit: 3000,
  media: false,

  describe(text, cfg, item) {
    const body = build(text, cfg, item);
    return [
      `POST ${API} (LinkedIn-Version ${LINKEDIN_VERSION}, token [LINKEDIN_TOKEN], author ${cfg.author_urn})`,
      `body: ${[...body.commentary].length} characters of commentary, link card for ${item.link}`,
    ];
  },

  async publish({ text, cfg, secrets, fetch, item }) {
    const body = build(text, cfg, item);
    const token = secrets.LINKEDIN_TOKEN;
    const res = await request(fetch, API, {
      headers: { Authorization: `Bearer ${token}`, "LinkedIn-Version": LINKEDIN_VERSION, "X-Restli-Protocol-Version": "2.0.0" },
      json: body,
      secrets: [token],
      allowEmpty: true,
    });
    const urn = res._headers?.["x-restli-id"];
    if (!urn || !/^urn:li:(share|ugcPost):\d+$/.test(urn)) throw new Error("LinkedIn created a post but returned no id; check LinkedIn before trying again");
    return { url: `https://www.linkedin.com/feed/update/${urn}/` };
  },
};
