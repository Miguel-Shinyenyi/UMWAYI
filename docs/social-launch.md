# Social launch tools

Status: built 2026-11-17. Checks and a queue. Nothing here posts anything.

## What it is

A small command line tool in `scripts/social/`. A person posts. The tool keeps the queue and runs the rule checks, so a rule break cannot ship by accident.

It follows the plan in `docs/plans/social-agent.md` (steps V2 and V5). It does not render video and it does not call any platform.

## Where things live

The hub is public, so only code and this page are here. Everything else is in a private folder outside the repo, set by the environment variable `SOCIAL_DIR`.

Private folder contents:

* `queue.jsonl`: one JSON object per line, one line per planned post.
* `drafts/`: the text of each post.
* `media/`: video and image files.
* `limits.json`: the length limits of each platform, each with the page it came from and the date it was read.
* `banned-words.txt`, `claims-blocklist.txt`, `company-blocklist.txt`, `link-allowlist.txt`: one entry per line, lines starting with `#` ignored.
* `ledger.jsonl`: the numbers read from each platform.

None of these files is ever committed.

## The queue

Fields: `id`, `platform`, `kind` (post, video, listing, reply_draft), `source`, `title`, `body_file`, `link`, `media`, `earliest_date`, `status`, `approved_sha256`, `posted_url`, `posted_at`, `ai_assisted` (yes, no, unknown), `notes`, `mode`.

Statuses: idea, drafted, linted, approved, posted, skipped.

Mode says who posts: `browser` (filled in the owner's signed-in Chrome, he approves each item), `manual` (he copies and pastes it himself, the default) or `api` (sent through an official API, see [social-connectors.md](social-connectors.md)).

The reader is strict. An unknown field, an unknown status, a bad date or a duplicate id stops every command with exit 3.

`source` is a file under `site/` with `draft: false`, or a repository under the owner's GitHub account.

## Commands

Run from `scripts/`: `npm run social -- COMMAND`.

* `draft ID`: starts the item's body file from the template for its platform, never overwrites a file, sets the status to drafted and prints the limits and rules.
* `fanout SOURCE --platforms a,b,c [--date DATE]`: one drafted item and one template file per platform, from one published article or one repository. It refuses a source with `draft: true`, an unknown platform, a platform listed twice or an id that exists, and creates nothing when it refuses.
* `lint ID`: runs every check on one item. A pass moves it to linted. A fail or a missing input moves it back to drafted.
* `next [--today DATE]`: lists the items due, in order, with the reason and the next step. It writes nothing.
* `approve ID --confirmed`: run only after the owner says yes in chat for that exact item. It stores the SHA-256 of the title, link and body.
* `record ID URL`: run after the post is live. It stores the URL and the time. It refuses unless the item is approved and the hash still matches.
* `metrics ID --views N --upvotes N --comments N`: adds the numbers read from the platform to the ledger.
* `reminders [--today DATE]`: what the owner posts by hand and has not yet: post now, not ready, and coming up.
* `report`: counts by platform and status, and the latest numbers for each posted item.

Exit codes: 0 pass, 2 fail with reasons, 3 cannot decide, 64 usage. Never 1.

## The checks

* Length limits from `limits.json`, counted in characters. A limit that is unknown, or not marked as confirmed on the platform's own page, gives exit 3. A text that is over a number gives exit 2 either way.
* No em dash.
* No hashtag, unless the platform entry allows it.
* No unfilled `[[placeholder]]`. A fresh template cannot pass.
* No copy: a post that shares 70 percent or more of its words with another post on the same platform fails, so one text is not pasted everywhere.
* No markdown: no asterisk, backtick, heading marker, link syntax or hyphen bullet. Bullet lines start with the bullet character.
* No word from the banned list, no phrase from the claims blocklist, no company name from the private blocklist. A missing list gives exit 3. It is never read as an empty list.
* Every link is https and on the allowlist.
* The source is a published article or the owner's own repository.
* Every media file exists and sits inside the private folder. A path that leaves the folder, by `..`, an absolute path or a symlink, is refused.
* `ai_assisted` is set. Unknown gives exit 3.

## Drafts and cross posting

Templates are in `scripts/social/templates/`. Each is plain text with `[[placeholders]]` and the limit stated in it: Show HN comment, article link comment, Reddit, Indie Hackers, Threads, LinkedIn, directory listing, Product Hunt comment, YouTube description, Discord, and a reply.

`fanout` picks the template for each platform. Hacker News gets a Show HN comment for a repository and a link comment for an article. Every text is then written for its own place.

Articles already go to DEV and LinkedIn through `scripts/cross-post.mjs` when they are published. This queue is for launch posts and extra posts, not for that.

## The order of a post

1. `next` picks the item.
2. `lint` must exit 0.
3. The owner is shown the platform, account, exact text, link, media and time, and says yes.
4. `approve ID --confirmed`.
5. The owner posts in his own signed-in browser, from the stored text. Nothing is retyped.
6. `record ID URL` after it is live.
7. `metrics` after 10 minutes and after one day.

Editing the title, link or body after approval changes the hash. The item goes back to drafted, and `record` refuses it.

## What it does not do

* The commands above post nothing. Optional posting through official free APIs is a separate layer, off by default: see [social-connectors.md](social-connectors.md).
* It does not log in, vote, follow or like anything.
* It does not check that a claim is true. It blocks the phrases the owner listed. A claim that is not on the list passes.
* It does not read replies. Replies are drafted by a person and sent by the owner.

## Tests

`npm test` in `scripts/` runs them. `social-*.test.mjs` has a planted fault for each rule: an em dash, a hashtag, a blocked claim, an over-long title, a source with `draft: true`, a missing media file and a body edited after approval. Each is caught.
