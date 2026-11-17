# Social connectors

Status: built 2026-11-17. Three connectors, all off by default. Nothing here has posted anything.

## What this is

An optional layer on top of the queue in [social-launch.md](social-launch.md). It can send an approved, unchanged, checked text post through a platform's own free API. It is for platforms where that is allowed. It never replaces the owner's yes.

A person still decides each post. The tool only removes the copy and paste.

## The gates

`publish ID` is a dry run. It sends nothing and prints the exact requests it would make, with every secret shown as a name. It posts only when you add `--live --confirmed`, and only if all of these hold:

* the item has mode `api`
* the item is approved and its title, link and body still match the approved hash
* every rule check passes now
* the platform is switched on in `connectors.json` with the terms page URL and the date it was read
* the platform has a setting for every key it needs
* the text fits the limit
* the item has no media (the connectors send text only)
* every secret exists

The `--confirmed` flag stands for the owner's yes in chat for that exact item.

A failure records nothing. Check the platform before trying again, because a step may have succeeded.

## Secrets

Secrets are never in a file in the repo, never printed and never logged. They are read at the moment of use from:

1. the environment variable `SOCIAL_SECRET_<NAME>`, then
2. the macOS Keychain, service `umwayi-social`, account `<NAME>`.

The owner stores them himself. Error text from a platform has every secret value removed before it is shown.

## The connectors

| Platform | Secret name | Settings in connectors.json | Notes |
| --- | --- | --- | --- |
| Mastodon | `MASTODON_TOKEN` | `instance` (an https host) | Token needs the write:statuses scope. Uses an idempotency key so a retry cannot post twice. Limit is per instance. |
| Bluesky | `BLUESKY_APP_PASSWORD` | `handle`, optional `service` | Use an app password, not the account password. Links get facets so they are clickable. |
| Threads | `THREADS_TOKEN` | `user_id` | Needs the threads_content_publish permission. Text limit 500. 250 posts per 24 hours. |
| LinkedIn | `LINKEDIN_TOKEN` | `author_urn`, optional `mentions` | Reuses `scripts/lib/linkedin.mjs`, the module `cross-post.mjs` uses, so escaping, hashtags, mentions and the link card are built the same way. Same credentials as the article flow. The token lasts about 60 days. Needs an https link on the item. |

Not confirmed against a live platform: the Bluesky and Threads endpoint names are from memory, because the Bluesky docs page returned no text and the Threads page did not show the paths. The first live post on each is a test the owner approves.

## Platforms with no connector

* X: the official API is pay per use, so posting costs money. Skipped.
* Hacker News: no official way to submit. Posted by hand.
* Product Hunt: the official API is read only by default and may not be used commercially. Scheduling is on the site.
* Reddit: API access needs approval and the policy page could not be read. Posted by hand.
* YouTube: uploads through the API need quota and an audit that was not confirmed. Use YouTube Studio.
* Instagram: needs a professional account and a Meta app. Not built.
* Indie Hackers, Peerlist, DevHunt: no official API found.

## Credentials

The article flow (`scripts/cross-post.mjs`) runs in GitHub Actions with secrets that are already set: `DEVTO_API_KEY`, `LINKEDIN_TOKEN`, `LINKEDIN_AUTHOR_URN`. Hashnode needs a paid plan and its token is left unset. Medium issues no new tokens. GitHub never shows a secret's value, so the local tool cannot read them. To post a launch post from this machine, the owner stores the credential in the Keychain under the names in the table. Nothing is created or stored for him.

New credentials are needed for Mastodon, Bluesky and Threads. LinkedIn needs the token copied into the Keychain once, and the author URN in `connectors.json`.

Already in the repo and unchanged: `scripts/cross-post.mjs` for DEV and LinkedIn articles. The Substack script uses a login cookie, which the social rules do not allow for new work. It is unchanged and the owner decides about it.

## Commands

* `connectors`: each connector, whether it is on, whether the terms are recorded, which settings and secrets exist, and why the other platforms have none. Secret values are never shown.
* `publish ID`: dry run.
* `publish ID --live --confirmed`: posts, then records the URL and the time.

## Tests

`social-connectors.test.mjs` uses a fake network, so no test can reach a platform. It checks each gate, the redaction of secrets and the request shapes. A mutation run broke 17 gates one at a time and every break failed a test.
