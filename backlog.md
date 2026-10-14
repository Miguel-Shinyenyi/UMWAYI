# Backlog

Every open question and pending decision or action across all projects, in one place, so
nothing gets silently dropped between sessions. When something here gets resolved, it's
marked answered with the date and a one-line resolution, never just deleted or left
ambiguous. New items get added here as they come up, not left to live only inside a single
project file.

## Open questions

### Career prep
- [ ] Whether the register-calibration/self-prediction pattern from 2026-09-16 extends
      beyond technical explanations, connecting to the PostHog rejection feedback, or stays
      separate. (Raised 2026-09-16)

### CMU masters
- [ ] Which program: MSCS, MSAII, or MSE. Changes the statement of purpose entirely.
      (Raised 2026-09-18) Update 2026-10-13: Miguel named MSIT as an application he will
      make. Not yet confirmed whether it replaces the programs listed or is one of several.

### Routine machine
- [ ] Exact target durations per schedule block, no duration was specified when the
      schedule was designed. (Raised 2026-09-18)
- [ ] Whether the weekly schedule layout needs adjusting once actually lived with. Expected
      to need tuning, not a sign anything was wrong. (Raised 2026-09-18)
- [ ] Poll hub-sync on a schedule, or trigger it manually. (Raised 2026-09-18)
- [ ] Whether a moved or renamed file in UMWAYI could get double-counted by hub-sync, needs
      a real check once used, not assumed away. (Raised 2026-09-18)
- [ ] Whether the Board view talks to the backend directly or through the intelligence
      service for materializing today's tasks. (Raised 2026-09-19)
- [ ] Exact chart types for the Reports view, deliberately deferred until real data exists
      to look at. (Raised 2026-09-19)

### Personal site
- [ ] Postgres or MongoDB for Waline's free-tier database, whichever Vercel's marketplace
      makes simplest. (Raised 2026-09-20)
- [ ] What happens if the free-tier database goes inactive and gets suspended, whether that
      needs a keepalive or is an accepted risk. (Raised 2026-09-20)
- [x] Whether the flock's teardrop marks and the mascot read clearly to someone seeing the
      site for the first time. (Raised 2026-09-22) Answered 2026-09-23: superseded. The full
      redesign removed the geometric mascot and the flock entirely.
- [ ] Whether replacing the UMWAYI method's six stages with four pillars and a four-step loop
      on the homepage loses something real, or is a fair simplification. (Raised 2026-09-23)
- [x] Hashnode, LinkedIn, dev.to, and Medium links in the footer point to `#` until those
      accounts exist. (Raised 2026-09-23) Answered 2026-09-23: all four accounts exist now.
      Real URLs kept in `site/links.md`, which the footer reads.
- [x] The settlement-engine repo (`Invoice-Financing`) is recorded here as private, but its
      GitHub page loaded without sign-in on 2026-09-23. (Raised 2026-09-23) Answered
      2026-09-23: Miguel made it public. Linked from its project page.
- [ ] The UMWAYI repo is public on GitHub, so `projects/career-prep.md`, several journal
      entries, and `MASTER_CONTEXT.md` name the companies the site now keeps private. The
      site no longer shows them, but anyone reading the repo can. Decide whether that's
      acceptable, or whether those files, or the repo, should be private. Making the repo
      private would break the site's build clone until it's given a read token. (Raised
      2026-09-23)
- [ ] Read the seven new journal excerpts in `site/journals/` (09-18 to 09-23) and correct
      anything that isn't how he'd put it, or that he'd rather keep private. (Raised
      2026-09-23)
- [ ] "This helped" stops a second click per browser, not per device. Clearing site data or
      switching browsers resets it. Accept that, or change the Waline server to enforce it.
      (Raised 2026-09-23)

### Settlement engine
- [x] Whether outbox and double-ledger will surface similarly real, correctable gaps once
      studied this closely, or whether idempotency's crash gap was specific to its own
      complexity. Not assumed either way. (Raised 2026-09-21) Answered 2026-09-25: yes for
      the ledger. `LedgerEntry` rows are written but never read anywhere in the codebase;
      `LedgerAccount.balance` is a stored column mutated directly, with nothing checking it
      against the sum of its own entries. The outbox held up as designed: the event write and
      the business write share one transaction, and the publisher only marks a row published
      after a confirmed send.
- [ ] Who carries out a correction after a mismatch is resolved: a person editing the
      database directly, which is the only path today (no endpoint corrects data, and nothing
      moves a settlement to `REVERSED`), or a person deciding and the engine executing it
      through an audited adjustment entry and a reverse transition. A direct edit skips the
      state machine, the ledger entries and the outbox event. Recommendation given
      2026-10-09: the person decides, the engine executes. Not yet decided by Miguel.
      (Raised 2026-10-02)
- [ ] How an UNKNOWN settlement with no external reference gets recovered. Reconciliation
      only loads settlements where `externalRef` is not null, so a gateway exception, an
      exhausted finalize retry budget and the stale-pending sweep all leave settlements that
      reconciliation can never see, with no mismatch opened for them. Two fixes are already
      named in `docs/reconciliation.md`: ask the external system what it received for this
      settlement, or match on amount, date and account. Neither is built. Re-confirmed
      against the code 2026-10-02. (Raised in the project's own docs; added here 2026-10-02)
- [ ] Whether a reconciliation mismatch should alert a person. `reconciliation.mismatch_found`
      has no consumer and no Prometheus rule covers mismatches, so one is seen only if
      someone opens the reconciliation page. Options: a consumer on the topic, or an alert
      rule on the open-mismatch count. (Raised 2026-10-02)
- [x] Whether a resolved settlement mismatch whose disagreement persists reopens on the next
      run. `flagMismatch` only skips a settlement that already has an `OPEN` row, so by
      reading it the answer is yes, but it has not been run. The ledger-mismatch version of
      this loop is documented and verified. (Raised 2026-10-09) Answered 2026-10-13: yes.
      `docs/mcp.md` records it observed live in the Lab: after a resolve, the next
      reconciliation run opened a new mismatch with a new id for the same settlement. Seen by
      Claude Code in the repo's own docs, not rerun here.
- [ ] Whether the reconciliation candidate query needs a time window or paging. Each run
      loads every settlement that has ever had a reference and checks each one against the
      external side, every 60 seconds. Fine at the current size, worth revisiting before
      real volume. (Raised 2026-10-09)

### Open source
- [ ] Whether the maintainers want a follow-up for the second half of supabase/mcp #457, and
      which direction (a rule for code strings, or a real parser). Comment posted
      2026-10-14. (Raised 2026-10-14)
- [x] Whether mclenhard/mcp-evals is still maintained. Answered 2026-10-14: last commit June
      2025, dormant, dropped.
- [x] Which modelcontextprotocol/java-sdk issue to take. Answered 2026-10-14: the good first
      issues each have two to five pull requests. Two reproductions chosen instead (#859,
      #882), see the board in `projects/open-source.md`.
- [ ] How long a first maintainer reply and a review take across these repositories. The board
      dates will show it. (Raised 2026-10-14)

### Self-observation
- [ ] Whether the minimal-banter pattern shows up even with people already known and trusted,
      or only with strangers. The specific occasions it was noticed on are in the 2026-09-20
      entry in `journal/entries/` (encrypted), not repeated here, since this file is public.
      Not manufactured as a test, noticed when it naturally comes up. (Raised 2026-09-20)
- [ ] Whether this morning's structured exercise genuinely satisfies the ancestral-movement
      drive Sapiens describes, or is itself another modern substitute. (Raised 2026-09-20)
- [ ] How much broader the "Routine Machine as an intuitive pre-answer" insight gets as
      reading and building continue together. (Raised 2026-09-20)
- [ ] Whether "my anxiety comes from an addiction to control everything" actually holds up
      against a real instance, or is just the label that was closest at hand. Raised as a
      question by Miguel himself, not concluded either way. (Raised 2026-09-22)

## Pending decisions and actions

### Hub infrastructure
- [x] Encrypt `journal/entries/` with git-crypt, since the UMWAYI repo is public and the
      journal is the one folder that should never be readable there. (Raised 2026-09-24)
      Answered 2026-09-29: git-crypt alone wouldn't have done it, since it only encrypts
      commits made after it's turned on and years of plaintext entries were already
      public in history. Miguel decided to rewrite history first (`git filter-repo`
      dropping `journal/entries/` from every past commit, then a force-push), then
      re-add the current entries fresh under git-crypt so they're encrypted from that
      point on. Full step-by-step handed to Claude Code as
      `claude-code-prompt-git-crypt.md`, since it needs local push access this hub
      doesn't have. For my own ability to decrypt and read journal entries in future
      sessions: Miguel chose to store the exported git-crypt key as a file in this
      claude.ai Project rather than re-attaching it each session, which trades "only
      git-crypt keyholders can read this" for "whoever can open this Project can", a
      trade he made deliberately, not a default I picked.

      Executed 2026-09-30, not just planned. Scope was widened mid-run, before the
      force-push: the plan covered `journal/entries/` only, but
      `journal/weekly-summaries/` holds the same class of content, including the two
      personal situations recorded as private in the 2026-09-20 entry, so stripping only
      `entries/` would have left that readable. Miguel chose to widen. History went from
      39 commits to 32 (six journal-only commits became empty and were pruned), both
      paths are absent from every commit and every git object, and the current content was
      re-added encrypted, verified as ciphertext from `raw.githubusercontent.com`, not just
      from a local commit. `journal/TEMPLATE.md` stays plaintext on purpose: a blank
      scaffold, no personal content. The full round trip was checked, all ten files
      decrypt byte-identical to their pre-rewrite originals.

      The fork question is answered: the repo had zero forks and `network_count` 0 at the
      time of the rewrite, so no one else holds the old plaintext history. Backups that do
      hold it are local only (`~/umwayi-mirror-backup-20260930`,
      `~/umwayi-journal-backup-20260930`) and must never be pushed anywhere public.

      Decided and deliberately not fixed: `backlog.md`, `MASTER_CONTEXT.md` and
      `SYNC_LOG.md` named those two situations, and all three stay public. Their current
      text is generalised and now points to the encrypted entry, and
      `MASTER_CONTEXT.md`'s rule was rewritten so it can't recur, a private item is never
      restated in a public file, including as a note about what was withheld. The earlier
      wording remains in commits before `446d3b5`. Purging it would have needed a second
      `filter-repo` pass and force-push; Miguel decided against that on 2026-09-30, so the
      old commits keep it. Not an oversight.
- [ ] Weekly summaries are written on request, not on a schedule, and one went missing once
      already. `2026-09-21-to-2026-09-27` and `2026-09-28-to-2026-10-04` exist (the second
      pushed 2026-10-09). `2026-10-05-to-2026-10-11` does not yet. Decide whether to schedule
      them. (Raised 2026-10-09)

- [ ] Review and push the agent-practice changes from 2026-10-13: `docs/agent-practices.md`
      and the `MASTER_CONTEXT.md` rules (this repo), a root `CLAUDE.md` for this repo, and a
      root `CLAUDE.md` in each of Invoice-Financing (`dev`), Routine Machine (`main`) and
      miguel-site (`main`), plus a user-level `~/.claude/CLAUDE.md` on Miguel's machine. A
      `CLAUDE.md` is read at the start of every Claude Code task, so read each one before
      merging. (Raised 2026-10-13)
- [ ] Measure whether the practices help: count corrections needed after each Claude Code run
      (late patches, missed requirements, claims that turn out unverified) and compare with
      the Lab prompt, which needed one late patch. Not measured yet. (Raised 2026-10-13)
- [ ] Decide on pruning the hub. `backlog.md` (about 400 lines) and `SYNC_LOG.md` (about 440)
      only grow, because the rule is to never delete a line. Option: move closed items and old
      entries to an archive file in the same repo, so nothing is deleted and less is read each
      session. Also whether the site rules in `MASTER_CONTEXT.md` should become a pointer to
      `site/README.md`, since both hold them. Both change a standing rule, so neither is
      applied. (Raised 2026-10-13)

### Career prep
- [ ] Actually work through the PostHog rejection feedback properly, what was said, what
      was felt, what's genuinely open versus already being decided about it. Deferred
      multiple times, still not started. (Raised 2026-09-16)

### Website and publishing
- [ ] Journal excerpt publication is on hold, by Miguel's decision on 2026-10-11. None
      written. If it resumes, the 2026-10-01 entry was the only one that made a point no
      published piece already covers. (Raised 2026-10-11)
- [ ] The luxury trap (Sapiens, Part Two) is a possible philosophy article. Before writing,
      check it against `more-copies-is-not-a-better-life` and the other published pieces,
      because the repetition rule allows two per point and the trap overlaps with the
      measure-versus-welfare point. Raise it, do not write it unasked. (Raised 2026-10-13)
- [x] Create dev.to and Medium accounts, still don't exist. (Raised in the original site
      plan, 2026-09-16, carried forward) Answered 2026-09-23: both exist, along with Hashnode
      and LinkedIn profiles.
- [x] Decide whether the broader hub cross-posting plan (Hashnode, dev.to, Medium, LinkedIn)
      is still intended, separate from the narrower decision already made to keep the site
      itself GitHub-Pages-only. (Raised 2026-09-20) Answered 2026-09-29: yes. A GitHub
      Actions workflow (`cross-post.yml` + `scripts/cross-post.mjs`) posts every non-draft
      `site/tech/` and `site/philosophy/` article to dev.to, Hashnode, and Medium as a
      full cross-post with a canonical link back to the site, and posts a TL;DR (the
      article's `summary` field) plus a link to LinkedIn for `site/tech/` articles only,
      journal excerpts stay off all four platforms on purpose, personal-voice content
      duplicated onto professional-audience platforms is a different call than an argued
      piece, and Miguel chose the narrower scope when asked. Idempotent via a
      `crossposted:` frontmatter block per article, so re-runs only fill in what's
      missing. Correction, 2026-09-29: Medium was first described here as deprecated but
      still functional, that was wrong. Medium stopped issuing new integration tokens
      entirely as of a report dated 2026-09-24, and Miguel's Medium account is new, so
      there's currently no way to get a token at all, not just a fragile one. Medium is
      out of the pipeline for now, not best-effort; `MEDIUM_TOKEN` stays unset and the
      script skips it cleanly. LinkedIn's personal-posting token still expires roughly
      every 60 days with no refresh mechanism, confirmed and unchanged; Miguel chose to
      run it anyway, on the condition that a failure there surfaces loudly (a failed
      workflow run) rather than silently skipping the post, dev.to and Hashnode results
      still get committed either way. Setup steps for every secret this needs, including
      the recurring LinkedIn re-auth, are in `docs/cross-post-setup.md`. Hashnode's
      official API field list
      (`apidocs.hashnode.com`) couldn't be reached from here to verify against; the
      script's field names come from a community writeup and are flagged in the setup
      doc as worth checking, or testing against a throwaway draft, before the first real
      run.

      First real run 2026-09-30, and the four-platform plan did not survive it. Of 14
      intended posts, 2 landed: both `site/tech/` articles on dev.to, live and verified,
      recorded in frontmatter by commit `691e1ac` so a retry cannot double-post them. The
      other 12 failed for three unrelated reasons, worth keeping separate because only one
      is a code bug:
      - dev.to rate-limits article creation to about one per 30s, and the script fired all
        six back-to-back with no gap, so four got `429`. Fixed 2026-09-30: a minimum gap
        between creations plus a bounded retry on `429` only.
      - Hashnode failed on all six, and not for the reason that was flagged. Its free
        GraphQL API was retired on 2026-05-13 and every query and mutation now needs a paid
        Pro plan; `gql.hashnode.com` 301s to the announcement, which is why the script got
        HTML. The field-name worry was never reached, so it is still untested rather than
        disproved. This is a spending decision, not a fix.
      - LinkedIn failed on both tech articles with `403 ACCESS_DENIED` naming `/author`,
        which means `LINKEDIN_AUTHOR_URN` is not in the required `urn:li:person:<id>` form.
        The token and its scopes are fine; only the secret's value is wrong.
- [x] Decide whether Hashnode is worth a paid Pro plan purely to keep it in the cross-post
      pipeline, given Medium is already out and that would leave dev.to and LinkedIn as the
      only free platforms. Their changelog also advertises an "MCP connect" feature for
      read/write access to posts, which may or may not be a free alternative route; not
      verified. Until this is decided, `HASHNODE_TOKEN` should be unset so the script skips
      Hashnode cleanly instead of failing every run. (Raised 2026-09-30) Answered 2026-10-01:
      no, not worth paying for. dev.to and LinkedIn already work for free; paying to keep one
      leg of a plan that started as "if possible" running isn't worth it on its own. Hashnode
      is parked here as a future problem, worth revisiting only if the unverified "MCP
      connect" route turns out to be a free way back in. The homepage's "All articles on
      Hashnode" link now points to dev.to instead (`index.astro`'s lookup switched from the
      `Hashnode` label to `dev.to`), and the Hashnode entry was removed from the footer's
      profile list (`site/links.md`). The Hashnode account itself is untouched, nothing was
      deleted there. `HASHNODE_TOKEN` should stay unset in the workflow's secrets (it already
      should be, per the previous entry), since the script otherwise has no platform left to
      try for that article and would log nothing rather than fail, which is the quiet way for
      this decision to stay correct without a secret to remember to touch again.
- [x] Fix `LINKEDIN_AUTHOR_URN` to the full `urn:li:person:<sub>` form, re-checking `sub`
      via `/v2/userinfo` as `docs/cross-post-setup.md` describes. Only Miguel can do this,
      it is a secret value. (Raised 2026-09-30) Answered 2026-09-30: fixed by Miguel, and
      both tech articles posted to LinkedIn on the next run. The diagnosis held exactly: the
      token and its scopes were never the problem, the same token works unchanged, it was
      only the URN's form. Reading which field the `403` named, `/author`, is what separated
      this from an expired token or a missing product scope.
- [x] Re-run the cross-post workflow for the four articles that were rate-limited, once the
      throttle fix is in. (Raised 2026-09-30) Answered 2026-09-30: all four posted, zero
      `429`s, and the run took about 90s, matching the three 31s gaps the throttle inserts.
      The two already-published articles were skipped rather than reposted, so the
      `crossposted:` idempotency works. dev.to is now 6 of 6, LinkedIn 2 of 2 (tech only, by
      design). Hashnode is the only failing platform, and only because of the paid-plan
      change, not a bug.
- [x] Whether the two-typeface design contrast holds up on mobile. (Raised 2026-09-18)
      Answered 2026-09-22: it didn't. Three real bugs confirmed by rendering the site at
      375px and measuring, not guessed from CSS: header nav overflow, and one CSS line
      (`.article-grid`'s mobile breakpoint missing `minmax(0, ...)`) causing both headline
      and code-block overflow on article pages. Fixed same day by Claude Code, commit
      `726e635`, independently reverified against the live pushed repo with a fresh
      production build and a separate mobile-viewport measurement, not taken on the commit
      message alone.
- [x] Mobile-first redesign with a bolder accent, playful/interactive touches (daisyUI,
      Tailwind), and a personal mark. (Raised 2026-09-22) Answered 2026-09-22: built and
      pushed by Claude Code same day, commit `726e635`. `docs/design.md` in `miguel-site`
      carries the full, dated reasoning, including where the build differed from the brief.
- [x] Whether the shepherd-based personal mark and the bolder accent chrome actually read
      well once seen directly, not assumed from the plan or the code alone. (Raised
      2026-09-22) Answered 2026-09-22: the first cautious version (quiet six-dot mark, no
      mascot) was seen live and read as flat, no real presence, confirmed by direct
      screenshot review before Miguel said so himself. Reversed into a full mascot and hero
      redesign at Miguel's explicit request, built and pushed by Claude Code, commit
      `9e5210f`. That version was independently verified directly: a fresh production build
      (13 pages, no errors), a repeated mobile-viewport overflow check confirming the new
      hero illustration didn't reintroduce the earlier bug class, and real screenshots in
      light mode, dark mode, and with reduced motion set, all read clearly with no leftover
      color-collision issues. The design reads well. Whether its individual marks are
      legible to a first-time viewer without context is a separate, still-open question
      above.

- [x] Full redesign around the illustrated shepherd, from Miguel's own spec. (Raised
      2026-09-23) Answered 2026-09-23: built and pushed by Claude Code, commits `3b884cc` and
      `7f4ac16`. Checked against a fresh production build (14 pages, no page-level overflow
      at 390px). Eight gaps against the reference found and handed to Claude Code in the same
      round as the content move below.
- [x] Move all site content into UMWAYI's `site/` folder and have the site build from it.
      (Raised 2026-09-23) Answered 2026-09-23: pushed on both sides, `miguel-site` commit
      `8066b2b`. A fresh build clones `site/` and copies all 10 pages, 10 illustrations,
      and the photo.
- [x] Footer email sign-up saves to Waline as a subscription request. It collects
      addresses; nothing sends the "new article" email yet. Decide how that gets sent.
      (Raised 2026-09-23) Answered 2026-09-23: the sign-up moves to MailerLite (account
      2655737). Addresses land in MailerLite's subscriber list, and emails go out as
      MailerLite campaigns. The site gets an RSS feed in the same change.
- [ ] On MailerLite's free plan, each new-article email is sent by hand as a campaign.
      Sending automatically from the site's RSS feed needs a paid plan (Comfort or Power).
      Decide which, once there are subscribers to write to. (Raised 2026-09-23)
- [x] Turn double opt-in on or off in the MailerLite form's settings. (Raised 2026-09-23)
      Answered 2026-09-23: on, confirmed from the inbox by Miguel (`miguel-site` commit
      `680e833`).
- [ ] With double opt-in on, "You're on the list" is true of the list, but nobody gets an
      email until they click the confirmation link. Decide whether the success message
      should say "Check your inbox to confirm." (Raised 2026-09-23)
- [ ] One test address went into the live MailerLite list twice during testing (JavaScript
      on and off). Remove it, or keep it as a real subscriber. (Raised 2026-09-23)
- [x] The homepage showed only three journal entries of nine. (Raised 2026-09-23)
      Answered 2026-09-23: all nine were live at `/journal/`, but each Writing tab shows the
      three newest and had no link to the rest. Fixed in `miguel-site` commit `55f0b17`:
      each tab now ends with a counted link to its full list, confirmed in a fresh build.
- [ ] Delete any test comments Claude Code posted to live Waline threads while checking
      "This helped" and the sign-up form, from the Waline admin page. (Raised 2026-09-23)
      Claude Code listed six in `docs/design.md`: objectId 3 ("This helped" on
      `/miguel-site/tech/idempotency-keys`), 4, 6, 7, 8 (`/miguel-site/subscribe`), and 5
      (`/miguel-site/rate-limit-probe`). It says none shows on the live site. That holds
      for the last five. For number 3, check whether it appears under the idempotency
      article's comments.
      With the sign-up moving to MailerLite, any real addresses left under
      `/miguel-site/subscribe` in Waline should be moved into MailerLite by hand, then
      deleted from Waline.
- [x] Create a fine-grained token scoped to `miguel-site` with Contents read and write, save
      it as the `SITE_DISPATCH_TOKEN` secret on UMWAYI, and add
      `.github/workflows/notify-site.yml`, so a push to `site/` rebuilds the site. Only
      Miguel can do this. (Raised 2026-09-23) Answered 2026-09-23: workflow added in commit
      `6a38a6f`, secret set, and the whole path verified end to end, a `workflow_dispatch`
      run on UMWAYI succeeded and the matching `repository_dispatch` (`umwayi-content`)
      deploy on `miguel-site` completed successfully. Not done as specified: the token used
      is Miguel's existing broad personal access token, not a fine-grained one scoped to
      `miguel-site`, chosen deliberately by him when the narrower scope was offered. The
      same token is also stored in cleartext in `miguel-site`'s `.git/config` remote URL.
- [ ] Decide whether to replace `SITE_DISPATCH_TOKEN` with a fine-grained token scoped to
      `miguel-site` with Contents read and write only, as originally intended, and whether
      to get the same token out of `miguel-site`'s `.git/config` remote URL, where it sits
      in cleartext. (Raised 2026-09-23)
- [ ] Read the drafted "What I took from it" lists on all six articles and four project
      pages and correct any item that isn't what he actually took from it. (Raised
      2026-09-23)
- [ ] Study Java application-level concurrency mechanisms taken to failure (thread pools,
      locks, `CompletableFuture`, virtual threads, where each one saturates or deadlocks),
      then what the OS does once application-level handling is exhausted, also taken to
      failure, and write an article on it. (Raised 2026-09-24)
- [ ] Read the two articles drafted 2026-10-09 (`philosophy/more-copies-is-not-a-better-life.md`,
      `tech/what-the-reconciler-cant-see.md`) and their takeaway lists, and correct anything
      that isn't what he actually took from it. Pushing them triggers cross-posting to dev.to,
      and to LinkedIn for the tech one. The tech article leaves the correction-path question
      undecided on purpose, update it once that is decided. (Raised 2026-10-09)
- [ ] Open the two sources the philosophy article cites for skeletal health after farming
      (a 2011 paper on stature and robusticity across the agricultural transition, and the
      review "Foraging to Farming Transition: Global Health Impacts, Trends, and Variation"),
      and tighten that paragraph to what they actually say. Both pages refused to load on
      2026-10-09, so only their existence was confirmed. (Raised 2026-10-09)

### Settlement engine
- [x] Choose which subsystem to study first, in depth, cold: idempotency/state machine,
      reconciliation engine, or the concurrency fixes from Phase 1/9. (Raised 2026-09-20)
      Answered 2026-09-21: idempotency, chosen and studied first.
- [x] Fix the crash-recovery gap in settlement finalization: a hard crash between
      `createPendingSettlement` and `finalizeSettlement` leaves a `PENDING` settlement with no
      `externalRef`, invisible to reconciliation, and its idempotency key permanently
      `IN_PROGRESS`. (Raised 2026-09-21) Answered 2026-09-21: fixed same day, commit
      `950bf86`, `StalePendingSettlementSweepService`, a scheduled sweep finalizing stale
      `PENDING` settlements as `UNKNOWN` past a grace period, with unit and integration
      tests.
- [x] Ledger entries are written but never read back anywhere in the codebase, so nothing
      checks `LedgerAccount.balance` against the sum of its own entries. Found 2026-09-25
      while restudying the ledger. Fix designed and handed to Claude Code: an `OPENING` entry
      per account (accounts currently start with a nonzero balance and zero entries, seeded
      directly), `ledger_entries.settlement_id` made nullable for `OPENING` rows only, a
      `sumNetByAccountId` query, a consistency check on every `GET /accounts/{id}` that still
      raises a 500 on mismatch, and a durable, reviewable record of the mismatch itself: a new
      `ledger_mismatches` table, sibling to `reconciliation_mismatches` rather than a forced
      generalization of it, with the same audited, manual-only resolve workflow. The general
      policy this follows (detect internally, record it, require an explicit audited
      resolution, never auto-correct) gets written into `docs/reconciliation.md` as a named
      rule, not left implicit in what the existing mismatch handling happens to do. Answered
      2026-09-27: built, merged to `dev` (`b3d3b33`), and checked line by line against the
      spec (migrations, service, controller, docs) since this sandbox can't reach Maven
      Central to run the real suite itself. Everything matched, plus two things not asked
      for: a zero-opening-amount account correctly gets no row, and an honest note that the
      check only fires on `GET /accounts/{id}`, so an account nobody reads stays unchecked.
      Claude Code's own decisions log records a real end-to-end run against local dev data
      (46 confirmed settlements, one hand-edited balance caught and resolved). Running the
      actual Maven test suite is still worth doing once, but not blocking on it given the
      code-level agreement. (Raised 2026-09-25)
- [x] Restudy the reconciliation engine cold. (Raised 2026-09-27) Answered 2026-10-02 and
      recorded 2026-10-09: explained from memory, then checked against the code. UNKNOWN with
      an external reference is auto-resolved by `autoResolveUnknown`, only contradictions go
      to a person, nothing alerts that person, and resolving a mismatch records a decision
      without changing data. Found beyond what was asked: settlements stuck UNKNOWN with no
      reference are invisible to reconciliation. All four are tracked as open questions above.
- [x] Run `claude-code-prompt-lab-ui.md` in Claude Code on a branch off `dev` and check the
      result against a real build and real screenshots, the way the ledger work was checked.
      It is a full UI rewrite with a public sandbox that runs the real engine, so the safety
      rules in the prompt (separate stack, rate limits, a startup guard) need testing, not
      just reading. (Raised 2026-10-09) Answered 2026-10-13: built and merged to `dev` on
      2026-10-09 (PR #1). `docs/lab.md` records the Java suite, a full `docker compose` run,
      a Playwright pass at 375px and 1280px, and one real load run at the caps. It lists two
      things not verified: streaming through a real Ingress and a from-scratch image build.
      Not independently re-run here. An Apple-style restyle merged on 2026-10-13.
- [ ] Look at the Lab and the MCP server's evals with fresh eyes, as a user would: open the
      Lab, read `docs/mcp.md`, and check the 7 of 7 first scored run (results file under
      `mcp-server/evals/results/`) against what the cases actually test. (Raised 2026-10-13)
- [ ] Decide where the public Lab sandbox is hosted. Not the shared staging server:
      `docs/testing.md` already rules out load there. The prompt writes compose and
      Kubernetes files but applies nothing. (Raised 2026-10-09)
- [ ] Restudy next: the Phase 1 and Phase 9 concurrency fixes. (Raised 2026-09-27)

### Routine machine
- [ ] Design and build email reminders for anything time-related (deadlines, scheduled
      decision points) once Routine Machine can support it. (Raised 2026-09-20)
- [ ] Fix `PROJECT.md`'s "Current phase" line, currently just reads "five" with no
      description, unlike every earlier phase. Cosmetic, low priority. (Raised 2026-09-20)
- [ ] Fix `docs/testing.md`'s stale "Open questions: None currently open for Phase 1"
      wording, now that Phase 3 is done. Cosmetic, low priority. (Raised 2026-09-19)

### Open source
- [ ] On 2026-10-21, check #457 for a maintainer reply. If none, one follow-up with new
      evidence only. (Raised 2026-10-14)
- [ ] Test supabase/mcp #459 against the real PostgreSQL parser and comment only if it finds
      something. (Raised 2026-10-14)
- [x] Build a minimal embedded-Tomcat reproduction for java-sdk #859 and post the result on the
      issue. (Raised 2026-10-14) Done 2026-10-14: comment posted, hang not reproduced, thread
      blocking and queueing confirmed.
- [x] Read java-sdk #882 and decide if it is worth a reproduction. (Raised 2026-10-14) Done
      2026-10-14: reproduced the exact timeout message, comment posted.
- [ ] Follow up once on java-sdk #859 and #882 if there is no reply by 2026-10-21, only with new
      information. (Raised 2026-10-14)
- [ ] Follow up once on supabase-kt #415 if there is no reply by 2026-10-22, only with new
      information. No code until the maintainer answers. (Raised 2026-10-15)
- [ ] Follow up once on posthog-android #577 if there is no reply by 2026-10-22, only with new
      information. No code until a maintainer agrees on the API shape. (Raised 2026-10-15)
- [ ] Follow up once on spring-ai PR #6932 if there is no reply by 2026-10-22, only with new
      information. Watch whether it merges and whether a backport to 2.0.x or 1.1.x is discussed.
      (Raised 2026-10-15)
- [ ] Write one article per merged pull request. First candidate, only after something is
      merged or substantively reviewed: why splitting SQL on `;` fails and how to make a safety
      check fail closed. Check the published articles first. (Raised 2026-10-14)
- [ ] Check `projects/career-prep.md`, which mentions a tailored CV and cover letter for a
      Supabase support role, against Miguel's current applications before any article names
      that company. (Raised 2026-10-14)

## How this file gets used

New open questions or pending items get added here as they come up in any project or
journal entry, not left living only in that project's own file. When one is resolved, its
line gets a strikethrough-free update: change `[ ]` to `[x]` and append "Answered
YYYY-MM-DD: <resolution>" so the reasoning stays visible, the same standard the rest of this
hub already holds decisions to.