# Cross-post setup: secrets, tokens, and the LinkedIn renewal cycle

Save this as `docs/cross-post-setup.md` in UMWAYI. Everything below is a one-time setup
per platform except LinkedIn, which needs repeating roughly every 60 days.

## Files to add to UMWAYI

- `.github/workflows/cross-post.yml`
- `scripts/cross-post.mjs`
- `scripts/package.json`

## Repo variable (not a secret, it's public information)

- `SITE_BASE_URL`: your site's real URL, e.g. `https://miguel-shinyenyi.github.io/miguel-site`.
  Settings → Secrets and variables → Actions → Variables tab → New repository variable.

## dev.to

1. Go to dev.to → Settings → Extensions → DEV API Keys.
2. Generate a key.
3. GitHub secret: `DEVTO_API_KEY`.

## Hashnode

1. Go to Hashnode → Account Settings → Developer → Personal Access Tokens, generate one.
2. GitHub secret: `HASHNODE_TOKEN`.
3. `HASHNODE_PUBLICATION_ID` is optional: the script looks it up automatically on first
   run if you skip it. Set it only if you have more than one Hashnode publication and
   need to pick a specific one (the automatic lookup takes the first one it finds).
4. Before the first real run: I could not reach Hashnode's own API docs page
   (`apidocs.hashnode.com`) from where this was written, so the exact field names in
   `scripts/cross-post.mjs`'s `publishToHashnode` function are based on a community
   writeup, not the official reference. Worth a quick check against the real docs, or a
   test run against a throwaway draft article, before trusting it on real content. If a
   field name is wrong, Hashnode's error message will name it.

## Medium: not available right now

Medium's API is officially deprecated, and as of very recently (a report dated
2026-09-24) they've stopped issuing new integration tokens entirely, not just
discouraging them. The old workaround of a hidden settings URL only helps accounts that
already had a token from before that cutoff. Since your Medium account is new, there's
currently no way to get one.

Practically: leave `MEDIUM_TOKEN` unset. `scripts/cross-post.mjs` only attempts a Medium
post when that secret exists, so this just means Medium is skipped, nothing breaks. If
Medium reopens token issuance later, or you're able to get one some other way, add the
secret and it'll pick up automatically on the next run.

## LinkedIn (needs redoing roughly every 60 days)

Personal-profile posting access tokens expire in about 60 days, and LinkedIn doesn't
offer a refresh token outside their partner program. There's no way around this for a
personal account, so this step is a recurring chore, not a one-time setup. The workflow
fails loudly (a red run) when the token expires, so you'll know when it's time.

One-time app setup:

1. Go to https://www.linkedin.com/developers/apps, create an app.
2. Under Products, add **both**: "Share on LinkedIn" (grants `w_member_social`, lets you
   post) and "Sign In with LinkedIn using OpenID Connect" (grants `openid`/`profile`,
   lets you look up your own member ID via `/v2/userinfo`). Both are self-service, no
   manual LinkedIn review needed. Skipping the second one is what causes a 403
   `ACCESS_DENIED` on `/v2/userinfo` even with a valid token, the token's scope simply
   doesn't cover that endpoint.
3. Under Auth, note the Client ID and Client Secret, and set an OAuth redirect URL (for
   a manual one-off flow, `https://www.linkedin.com/developers/tools/oauth/redirect` or
   your own placeholder page both work, since you'll copy the code out of the URL by
   hand). This exact URL also needs to be added to the app's "Authorized redirect URLs
   for your app" list under Auth, or the flow fails before you get a code.

Getting a token (do this now, and again every ~60 days):

1. Open this URL in a browser, filling in your client ID and redirect URI, requesting
   all three scopes in one go so the resulting token can both post and identify you:
   ```
   https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>&scope=openid%20profile%20w_member_social
   ```
2. Approve it. LinkedIn redirects to your redirect URI with `?code=...` in the URL, copy
   that code. It's single-use and short-lived, exchange it right away rather than saving
   it for later.
3. Exchange it for a token:
   ```
   curl -X POST https://www.linkedin.com/oauth/v2/accessToken \
     -d grant_type=authorization_code \
     -d code=<CODE_FROM_STEP_2> \
     -d redirect_uri=<REDIRECT_URI> \
     -d client_id=<CLIENT_ID> \
     -d client_secret=<CLIENT_SECRET>
   ```
   `invalid_client` here means the client_id/secret pair is wrong, not the code, usually
   an incompletely copied secret (use the app page's copy button, not manual selection)
   or a secret from a different app. Copy the client_secret straight from the copy
   button into the command with no retyping.
4. The response's `access_token` is what goes in the `LINKEDIN_TOKEN` GitHub secret.
5. You also need your own LinkedIn member URN once per token (it comes from the same
   token, so do this right after step 4, don't reuse an old token from before you added
   the OpenID Connect product):
   ```
   curl -H "Authorization: Bearer <ACCESS_TOKEN>" https://api.linkedin.com/v2/userinfo
   ```
   The `sub` field in the response is your member ID; the URN is `urn:li:person:<sub>`.
   GitHub secret: `LINKEDIN_AUTHOR_URN`. This changes each time you redo the flow only if
   `sub` itself changes, which it normally won't once the same LinkedIn account is used,
   but it costs nothing to re-check it against the new token each time.

When the token expires, the workflow's LinkedIn step returns a 401 with a message
pointing back to this section. Redo steps 1 to 4 above (the app itself doesn't need
recreating) and update the `LINKEDIN_TOKEN` secret.

A practical note on running these curl commands by hand: the authorization code, the
client secret, and the access token are all live credentials the moment they exist.
Worth regenerating the client secret on the app's Auth page after this kind of manual
setup session, since anything typed into a terminal or pasted into a chat has left the
one place it needs to stay.

## Scope, as currently set

- dev.to, Hashnode, Medium: every non-draft article in `site/tech/` and
  `site/philosophy/`.
- LinkedIn: `site/tech/` only, posted as a TL;DR (the article's `summary` frontmatter
  field) plus a link, not the full article. If this should widen later, change the
  `linkedin: false` entry for the philosophy category in `scripts/cross-post.mjs`'s
  `CATEGORIES` list to `true`.
- `site/journal/` and `site/projects/` are excluded from all four platforms by design,
  since journal excerpts are personal-voice content and project pages are portfolio
  pages, not blog posts, not because of a technical limit. To include either later, add
  an entry to the same `CATEGORIES` list.