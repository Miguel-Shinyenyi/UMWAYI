import { mastodon } from "./mastodon.mjs";
import { bluesky } from "./bluesky.mjs";
import { threads } from "./threads.mjs";
import { linkedin } from "./linkedin.mjs";

export const CONNECTORS = { mastodon, bluesky, threads, linkedin };

// Platforms that have no official free write API, or none we may use, and why.
export const NO_CONNECTOR = {
  x: "the official API is pay per use (a post costs money), and the social rules say never pay",
  hackernews: "there is no official way to submit; Miguel posts it himself",
  producthunt: "the official API is read only by default and may not be used for commercial purposes; scheduling is done on the site",
  reddit: "API access needs Reddit's approval and its policy page could not be read; post by hand",
  youtube: "uploads through the API need quota and an audit that was not confirmed; use YouTube Studio",
  instagram: "needs a professional account and a Meta app; not built yet",
  indiehackers: "no official API found",
  peerlist: "no official API found",
  devhunt: "no official API found",
};
