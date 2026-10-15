# Substack publishing: setup and acceptance checks

Status on 2026-10-15: all stages done. The 10 existing articles are on Substack, posted with no email. The record is `scripts/substack-posted.json`.

## Purpose

Publish the articles in `site/philosophy/` and `site/tech/` to Miguel's Substack from a script that runs on his machine. Substack has no public publishing API, so the script uses his session cookie (`substack.sid`) and the same undocumented endpoints Substack's own web editor calls. Journal excerpts (`site/journals/`) and project pages are not included.

## Decisions already made (2026-10-15)

- Publish with no email to subscribers.
- Run only on Miguel's machine. Not in GitHub Actions.
- Cover every existing article in `site/philosophy/` and `site/tech/` and every future one.

## Safety rules

- The `substack.sid` value is never printed, logged, committed or echoed. It lives in `~/.config/umwayi/substack.env` (mode 600), outside the repo. Miguel creates that file himself. It is never pasted into a chat.
- The cookie is used only to publish Miguel's own articles. The script does not read, change or delete subscribers, settings, billing, email or other account data.
- The endpoints are undocumented. They are found by watching Substack's own editor, never guessed. They can change without notice.
- No post goes live until the "no email" flag is proven (check B7).
- A 403 or 407 from a host stops the work. No workaround.

## Acceptance checks (written first, run at the end of each stage)

### Stage 1: discovery

| ID | Check |
|----|-------|
| A1 | This file records, from observed requests: how a draft is created, how images are uploaded, how a post is updated, how it is published, and which field controls email sending. Request paths and field names are cited. Cookie and tokens are redacted. |
| A2 | This file records how Substack stores post bodies, and for each Markdown feature the site uses (headings, lists, links, bold, italics, blockquotes, fenced code blocks with a language, tables, inline images, SVG illustrations) whether Substack supports it and how the script converts it. Unsupported features get a stated fallback. No content is dropped silently. |
| A3 | This file records what Substack does with the canonical link, publish date and tags, whether a post can be dated in the past, and what cannot be set. |
| A4 | Substack's terms of service and content guidelines are read, and what they say about automation and unofficial API use is reported before Stage 2. If they forbid it, stop. |

### Stage 2: build and test

| ID | Check |
|----|-------|
| B1 | `scripts/substack-post.mjs` reads the env file and checks the cookie with one harmless read of Miguel's own publication info. On 401 or 403 it exits nonzero with a clear message. It never prints the cookie. |
| B2 | It scans `site/philosophy/` and `site/tech/`, skips `draft: true`, skips articles already posted (a record file in the repo maps slug to Substack URL), and supports `--dry-run`, `--only <slug>` and `--draft`. |
| B3 | Conversion keeps the title, the summary as subtitle, the body, the code blocks and the illustration (uploaded as an image). It ends with one line, "Originally published at <site URL>", linked to the article on the site. |
| B4 | Tests cover the Markdown conversion on fixed input: a code block, a list, a link, an image. The test command is reported. |
| B5 | A dry run over every article lists each one with its action (create or skip). Miguel sees it. |
| B6 | `--draft` on one article. Miguel opens the draft in Substack and confirms it looks right. Fix until he confirms. Test drafts are deleted only if he asks. |
| B7 | The exact no-email field and value in the publish request are shown, and match the request Substack's own editor sends with "send email" off. |
| B8 | One article is published with no email, after Miguel says yes. He confirms it is live and that Substack's post stats show 0 emails sent. |
| B9 | After B8 only: the rest are published one at a time, at least 60 seconds apart, newest last, stopping at the first error. Each URL goes into the record file. |

### Stage 3: backfill and hub files

| ID | Check |
|----|-------|
| C1 | This file is complete: setup, how to run for a new article, how to renew the cookie, what to do when it fails, the undocumented-endpoint warning. |
| C2 | `scripts/package.json` has a `substack` npm script. The one command to run after a new article is documented here. |
| C3 | An em dash search over every new file returns 0. |
| C4 | A search of the repo and its history for the cookie value returns 0. |
| C5 | UMWAYI `main` equals `origin/main` after the push. |

## Result (2026-10-15)

All 10 articles in `site/philosophy/` and `site/tech/` are published on `https://shinyenyi.substack.com`. The first (`you-cannot-stop-what-arrives`) went through B8. The other nine went through B9, one at a time, 60 seconds apart, oldest first, no errors. A check of each post's record afterwards showed `is_published: true`, `should_send_email: false`, `email_sent_at: null` and a public page that answers 200. The publication had no subscribers at the time. Substack builds the post URL from the article title, so a few URLs differ from the site's file names. The record file holds each real URL.

The discovery throwaways (two test drafts, one test post and the tag `testtag`) were deleted afterwards.

## Gates

- After Stage 1: show findings and the terms of service finding. Ask whether to go on.
- After B6, after B7, after B8: wait for Miguel's yes.
- After Stage 3: stop.

## Stage 0 findings (2026-10-15)

- Node is v23.11.0. `cross-post.mjs` needs Node 20+ for built-in `fetch`. Fine.
- `scripts/package.json` already depends on `gray-matter`. The new script can reuse it.
- Articles in scope: 7 in `site/philosophy/`, 3 in `site/tech/`. None is `draft: true`. None contains an em dash.
- Markdown features the articles use today: `##` headings, lists, links, bold, italics, fenced code blocks. No tables and no inline images in the bodies. Each article has one SVG illustration set in front matter (`illustration`).
- The env file path `~/.config/umwayi/substack.env` does not exist yet. It sits outside the repo, so `.gitignore` needs no change.

### Where the prompt and the existing pipeline differ

1. `cross-post.mjs` records each posted URL inside the article's front matter, under `crossposted:`. This task asks for a separate record file that maps slug to Substack URL. A record file avoids editing files under `site/`, which would trigger a site rebuild on every run. The path and format of that file are still to be agreed (open question 1).
2. `cross-post.mjs` reads `SITE_BASE_URL` from the environment and refuses to run without it. That variable is a GitHub repo variable. It is not set on Miguel's machine. The local script needs the value from the env file or a constant (open question 2).
3. `cross-post.mjs` does not pass illustrations to dev.to. The Substack script uploads the SVG as an image. Substack may not accept SVG, so a conversion to PNG may be needed. This belongs to Stage 1 (A2).

## Open questions

1. Record file location and format. Proposal: `scripts/substack-posted.json`, `{ "<category>/<slug>": "<Substack URL>" }`.
2. Site base URL for the "Originally published at" line. Proposal: read `SITE_BASE_URL` from the env file, fall back to a constant in the script.

## How to use it

**Warning: the endpoints are undocumented.** `scripts/substack-post.mjs` calls the same private endpoints Substack's web editor calls. Substack can change or remove them without notice, and its terms of service do not name this kind of use (see A4 below). Treat it as best effort and keep the site as the source of truth.

### One-time setup

1. Create `~/.config/umwayi/substack.env`, outside the repo, with one line: `SUBSTACK_SID=<value of the substack.sid cookie>`. Optional lines: `SITE_BASE_URL`, `SUBSTACK_PUBLICATION_URL`, `SUBSTACK_USER_ID`.
2. Run `chmod 600 ~/.config/umwayi/substack.env`. The script refuses a file that other users can read.
3. In Chrome the cookie is under DevTools, Application, Cookies, `shinyenyi.substack.com`, `substack.sid`. Never paste it into a chat, a commit or a log.
4. From `scripts/`, run `npm install` once.
5. Check it works: `node scripts/substack-post.mjs --check` prints "Cookie accepted." and sends nothing else.

### After writing a new article (the one command)

From `scripts/`:

```
npm run substack
```

It posts every non-draft article in `site/philosophy/` and `site/tech/` that is not yet in `scripts/substack-posted.json`, with no email to subscribers, one at a time, at least 60 seconds apart, and stops at the first error. Then commit `scripts/substack-posted.json` and push.

Safer order for a new article:

1. `npm run substack -- --dry-run` lists what would happen and checks every article converts.
2. `npm run substack -- --only <slug> --draft` creates a draft only. Open the link it prints and check it.
3. `npm run substack -- --only <slug> --draft-id <id>` publishes that checked draft, no email.

Flags: `--check`, `--dry-run`, `--only <slug>`, `--draft`, `--draft-id <id>`, `--trace` (prints each write request, never the cookie), `--gap-seconds <n>` (at least 60).

### What it does for each article

Creates a draft, uploads the illustration as an image (Substack accepts SVG), converts the body to Substack's format, sets the title and the summary as the subtitle, saves with `should_send_email: false`, attaches the article's tags, then publishes with `{"send":false,"saved_segment_id":null}`. The last line of every post is "Originally published at" with a link to the article on the site. It stops without publishing if the saved draft does not say `should_send_email: false`, and fails if `email_sent_at` is set after publishing.

### What it cannot do

- Set a canonical URL (Substack has no field for it).
- Date a post in the past.
- Convert tables, raw HTML, horizontal rules, nested lists or images inside a sentence. It stops with a clear message instead of dropping content.
- Unpublish or delete. Use Substack's Posts page.

### Renewing the cookie

The cookie expires. When the script prints that Substack answered 401 or 403, or exits with code 2:

1. Sign in to Substack in Chrome.
2. Copy the new `substack.sid` value from DevTools as above.
3. Replace the value in `~/.config/umwayi/substack.env` yourself.
4. Run `node scripts/substack-post.mjs --check`.

### When it fails

| Message or code | Meaning | What to do |
|---|---|---|
| Exit 2, "answered 401/403" | Cookie expired or refused | Renew the cookie. Do not retry in a loop. If it is a 403 with a new cookie, stop and check Substack in the browser. |
| Exit 3 | Env file missing, unreadable, or lacks `SUBSTACK_SID` | Follow the one-time setup. |
| Exit 4, "cannot convert" | The article uses Markdown the converter does not support | Change the article or extend `scripts/lib/substack-convert.mjs` and its tests. |
| Exit 1, "FAILED ...: ... 4xx" | An endpoint changed or rejected a field | Open Substack's editor, do the same action by hand, and compare with the requests in Stage 1 findings below. Update the script and this file. |
| "Post is out of date" (409) | The saved draft changed under the script | Close any open editor tab for that draft, then rerun with `--draft-id`. |

A failed run can leave a draft behind. Delete stray drafts on Substack's Posts page.

### Tests

`cd scripts && npm test` runs the converter tests. They need no network.

## Stage 1 findings (2026-10-15)

**These endpoints are undocumented. Substack can change or remove them without notice.** Observed on `https://shinyenyi.substack.com` (publication id 11718062) by watching Substack's own editor in Chrome. The cookie and tokens were never read or logged.

### A1: observed requests (partial)

| Step | Request | Notes |
|------|---------|-------|
| List drafts | `GET /api/v1/post_management/drafts?offset=0&limit=25&order_by=draft_updated_at&order_direction=desc` | Returns `posts`, `offset`, `limit`, `total`, `isCapped`. |
| Create a draft | `POST /api/v1/drafts` | The editor calls it on opening `/publish/post?type=newsletter`. It returned draft id 220569393. Request body not captured (the call ran before the logger was in place). |
| Read a draft | `GET /api/v1/drafts/{id}` | Fields include `draft_title`, `draft_subtitle`, `draft_body`, `type` ("newsletter"), `audience` ("everyone"), `slug`, `search_engine_title`, `search_engine_description`, `social_title`, `cover_image`, `description`, `section_chosen`, `draft_section_id`, `write_comment_permissions`, and **`should_send_email`** (default `true`). |
| Update a draft | `PUT /api/v1/drafts/{id}` (XHR) | Body, observed: `draft_title`, `draft_subtitle`, `draft_podcast_url`, `draft_podcast_duration`, `draft_body` (a JSON string), `section_chosen`, `draft_section_id`, `translations`, `draft_bylines` (`[{id, is_guest}]`), `last_updated_at` (ISO time), `audience`. |
| Email flag | `should_send_email` on the draft object. Default is `true`. | Observed 2026-10-15: with the editor's "Send via email and the Substack app" switch turned off (real click on its label), the editor's `PUT /api/v1/drafts/{id}` carried `"should_send_email": false`. With the switch untouched the same PUT carried `true`. The button then reads "Publish now" instead of "Send to everyone now". A script-set DOM click that did not update the page's state left it `true`, so the UI alone is not proof. |
| Pre-publish check | `GET /api/v1/drafts/{id}/prepublish` | Called right after that PUT, before the publish step. |
| Publish confirm step | A second dialog (appeared on the first publish attempt, did not appear when the draft already had `should_send_email:false` on republish), "Do you want to send this post via email?", with buttons "Publish on web only" and "Also send via email". | `GET /api/v1/drafts/{id}/prepublish` returns `{"errors":[],"suggestions":[{"identifier":"MISSING_SEND_AS_EMAIL_PROMPT"}]}`, which triggers it. The editor waits on "Publishing..." until one button is pressed. |
| Publish | `POST /api/v1/drafts/{id}/publish` | Observed 2026-10-15. Body: `{"send":false,"saved_segment_id":null}`. `send:false` is the no-email flag in the publish request itself. Sent after the PUT above (which also carries `should_send_email:false`). The page then moves to `/publish/posts/detail/{id}/share-center`. Server result: `is_published: true`, `post_date` set, `slug` from the title, `should_send_email: false`, `email_sent_at: null`. |
| Unpublish | `POST /api/v1/drafts/{id}/unpublish` | Observed 2026-10-15. Body: `{}`. After it `is_published` is `false`; `post_date` stays set. |
| Extra PUT fields | `audience_before_archived`, `syndicate_voiceover_to_rss`, `syndicate_to_section_id`, `should_syndicate_to_other_feed`, `explicit`, `podcast_episode_number`, `podcast_season_number`, `podcast_episode_type`, `hide_from_feed`, `write_comment_permissions`, `default_comment_sort`, `should_send_email`, `meter_type`, `account_based_meter_type`, `cover_image`, `search_engine_title`, `search_engine_description` | Sent by the publish dialog's save. |
| Image upload | Not yet observed. | Needs an image added in the editor. |

### A2: body format (observed 2026-10-15 in a test draft)

`draft_body` is a ProseMirror document serialised as a JSON string. Node and mark names, as the editor wrote them:

| Markdown feature | Substack node or mark | Script conversion |
|---|---|---|
| `##` heading | `heading` with `attrs.level` (2 observed) | Direct. The site uses `##` only. |
| Paragraph | `paragraph` with `attrs.textAlign: null` | Direct. |
| `**bold**` | text with mark `strong` | Direct. |
| `*italic*` | text with mark `em` | Direct. |
| `` `code` `` | text with mark `code` | Direct. |
| Link | text with mark `link`, `attrs: {href, target:"_blank", rel:"noopener noreferrer nofollow", class:null}` | Direct. Relative site links become absolute URLs on the site. |
| Bullet list | `bullet_list` > `list_item` > `paragraph` | Direct. |
| Numbered list | `ordered_list` with `attrs {start:1, order:1}` > `list_item` > `paragraph` | Direct. |
| Blockquote | `blockquote` > `paragraph` | Direct. |
| Fenced code block | `highlighted_code_block` with `attrs.language` (typed "```" gave `"plaintext"`; the editor shows an "Auto-detect" picker) and a single `text` child | Direct. The language string for java, sql, bash and so on is not yet confirmed. It is checked on the first `--draft` (B6). Unknown language falls back to `plaintext`. |
| Table | Not observed. | Not used in any article today. Fallback: the script fails with a clear message rather than dropping rows. |
| Inline image | Not observed. | Not used in any article body today. Same fallback. |
| Illustration (SVG) | Not observed. | See image upload below. |

### Image upload (A1, observed 2026-10-15 with Miguel inserting the image by hand)

- Request: `POST /api/v1/image`. The body is JSON with an `image` field holding a data URI (`data:image/svg+xml;base64,...`). Other fields in that body were not captured (the log kept only the first 300 characters). Check on the first `--draft` whether `postId` or another field is needed.
- Response (200): `{"id":364024466,"url":"https://substack-post-media.s3.amazonaws.com/public/images/<uuid>_800x450.svg","contentType":"image/svg+xml","bytes":5647,"imageWidth":800,"imageHeight":450}`.
- **Substack accepts SVG.** It stores it as `.svg` on its S3 media bucket and keeps the original size. So no PNG conversion is needed for the illustrations.
- In the body the image is a `captionedImage` node containing an `image2` node. `image2.attrs`: `src` (the S3 URL), `srcNoWatermark`, `fullscreen`, `imageSize`, `height`, `width`, `resizeWidth`, `bytes`, `alt`, `title`, `type` ("image/svg+xml"), `href`, `belowTheFold`, `topImage`, `internalRedirect` (`https://<pub>.substack.com/i/<postId>_img_<url-encoded src>`), `isProcessing`, `align`, `offset`. Observed `height` 819 and `width` 1456 even though the response said 450 and 800, so the editor sizes it itself. The script will copy `src`, `bytes`, `type`, `alt` and set `internalRedirect` as shown, then check the first draft by eye.
- A scripted file selection on the Thumbnail input did not start an upload, so the cover thumbnail path is not used.

### A3: canonical link, date, tags (observed 2026-10-15)

- **Canonical link:** no field. The draft object and the publish dialog's save carry `search_engine_title`, `search_engine_description` and `social_title`, but no canonical URL. It cannot be set. The "Originally published at" line is the substitute.
- **Tags (observed):** the publish dialog's "Add tags" box saves each tag as it is entered. A new tag is created with `POST /api/v1/publication/post-tag`, body `{"name":"testtag"}`, which returns `{id, publication_id, name, slug, hidden}`. It is attached with `POST /api/v1/post/{postId}/tag/{tagId}` (empty body). Existing tags are listed with `GET /api/v1/publication/post-tag`. The tag is not in the draft object. The script can map each article's `tags` front matter to this pair of calls.
- **Publish date:** the editor's publish flow has no date field (only "Schedule time to email and publish", which is a future time). The PUT body has no `post_date`. `post_date` is set by the server at first publish and kept on unpublish and republish. Back-dating is not available through the editor flow.
- **What cannot be set:** canonical URL, a past publish date.

### A4: terms of service (read 2026-10-15)

Sources: `https://substack.com/tos` (last updated 2026-10-06) and `https://substack.com/content`.

- No clause names the API, unofficial API use, session cookies or a publishing script. The ToS has no API terms of its own.
- Clauses that could apply:
  - It bans crawling or scraping "by any means (manual or automated)". This script writes Miguel's own posts and scrapes nothing.
  - It bans "any processes that run or are activated while you are not logged into Substack". The script runs on demand, while Miguel is the logged-in account holder, but it is automation using his session.
  - It bans decompiling or reverse engineering to "obtain the source code". Reading network traffic from the editor is not that, but it sits close.
  - It bans "an unreasonable load". One post per 60 seconds is light.
  - Breach "may result in immediate termination of your account."
- The content guidelines say nothing on bots or API use. They are anti-spam and anti-"artificial activity on community surfaces".

Finding: automation is not explicitly forbidden. It is not explicitly allowed either. The risk is a termination decision by Substack. Miguel decides whether to accept it.

### Other

- The discovery throwaways (two test drafts, one test post and the tag `testtag`) were deleted from Substack on 2026-10-15.
- Publishing a draft from the editor with the email switch off sent `PUT` (with `should_send_email: false`), then `GET .../prepublish`, then `POST .../publish` with `{"send":false,"saved_segment_id":null}`. The server then showed `is_published: true` and `email_sent_at: null`.
- A republished post keeps its first `post_date`.
- Confirmed by the first `--draft` run: the code block language string `java` is accepted and kept, and the image request works with `{image, postId}`.
