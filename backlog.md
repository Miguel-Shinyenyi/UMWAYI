# Backlog

Every open question and pending decision or action across all projects, in one place, so
nothing gets silently dropped between sessions. When something here gets resolved, it's
marked answered with the date and a one-line resolution, never just deleted or left
ambiguous. New items get added here as they come up, not left to live only inside a single
project file.

Since 2026-10-26 the open items live in `queue.md`. This file is the history. Every line stays here.
An open line is marked `[>]` and carries its queue id, for example `(H-012)`. A new item goes
into `queue.md` first. When an item is resolved, mark it `[x]` here with "Answered YYYY-MM-DD:" and the
evidence, as before.

Answered lines were moved to `archive/backlog/answered-2026-10-26.md` on 2026-10-26 (A-010 in `archive/INDEX.md`). Search that file for an old id or phrase.

## Open questions

### Career prep
- [>] (H-001) Whether the register-calibration/self-prediction pattern from 2026-09-16 extends
      beyond technical explanations, connecting to the PostHog rejection feedback, or stays
      separate. (Raised 2026-09-16)

### CMU masters
- [>] (H-002) Which program: MSCS, MSAII, or MSE. Changes the statement of purpose entirely.
      (Raised 2026-09-18) Update 2026-10-13: Miguel named MSIT as an application he will
      make. Not yet confirmed whether it replaces the programs listed or is one of several.

### Routine machine
- [>] (H-003) Exact target durations per schedule block, no duration was specified when the
      schedule was designed. (Raised 2026-09-18)
- [>] (H-004) Whether the weekly schedule layout needs adjusting once actually lived with. Expected
      to need tuning, not a sign anything was wrong. (Raised 2026-09-18)
- [>] (H-007) Whether the Board view talks to the backend directly or through the intelligence
      service for materializing today's tasks. (Raised 2026-09-19)
- [>] (H-008) Exact chart types for the Reports view, deliberately deferred until real data exists
      to look at. (Raised 2026-09-19)

### Personal site
- [>] (H-009) Postgres or MongoDB for Waline's free-tier database, whichever Vercel's marketplace
      makes simplest. (Raised 2026-09-20)
- [>] (H-010) What happens if the free-tier database goes inactive and gets suspended, whether that
      needs a keepalive or is an accepted risk. (Raised 2026-09-20)
- [>] (H-011) Whether replacing the UMWAYI method's six stages with four pillars and a four-step loop
      on the homepage loses something real, or is a fair simplification. (Raised 2026-09-23)
- [>] (H-013) Read the seven new journal excerpts in `site/journals/` (09-18 to 09-23) and correct
      anything that isn't how he'd put it, or that he'd rather keep private. (Raised
      2026-09-23)
- [>] (H-014) "This helped" stops a second click per browser, not per device. Clearing site data or
      switching browsers resets it. Accept that, or change the Waline server to enforce it.
      (Raised 2026-09-23)

### Settlement engine
- [>] (H-015) Who carries out a correction after a mismatch is resolved: a person editing the
      database directly, which is the only path today (no endpoint corrects data, and nothing
      moves a settlement to `REVERSED`), or a person deciding and the engine executing it
      through an audited adjustment entry and a reverse transition. A direct edit skips the
      state machine, the ledger entries and the outbox event. Recommendation given
      2026-10-09: the person decides, the engine executes. Not yet decided by Miguel.
      (Raised 2026-10-02)
- [>] (H-016) How an UNKNOWN settlement with no external reference gets recovered. Reconciliation
      only loads settlements where `externalRef` is not null, so a gateway exception, an
      exhausted finalize retry budget and the stale-pending sweep all leave settlements that
      reconciliation can never see, with no mismatch opened for them. Two fixes are already
      named in `docs/reconciliation.md`: ask the external system what it received for this
      settlement, or match on amount, date and account. Neither is built. Re-confirmed
      against the code 2026-10-02. (Raised in the project's own docs; added here 2026-10-02)
- [>] (H-017) Whether a reconciliation mismatch should alert a person. `reconciliation.mismatch_found`
      has no consumer and no Prometheus rule covers mismatches, so one is seen only if
      someone opens the reconciliation page. Options: a consumer on the topic, or an alert
      rule on the open-mismatch count. (Raised 2026-10-02)
- [>] (H-018) Whether the reconciliation candidate query needs a time window or paging. Each run
      loads every settlement that has ever had a reference and checks each one against the
      external side, every 60 seconds. Fine at the current size, worth revisiting before
      real volume. (Raised 2026-10-09)

### Open source
- [>] (H-019) Whether the maintainers want a follow-up for the second half of supabase/mcp #457, and
      which direction (a rule for code strings, or a real parser). Comment posted
      2026-10-14. (Raised 2026-10-14)
- [>] (H-020) How long a first maintainer reply and a review take across these repositories. The board
      dates will show it. (Raised 2026-10-14)

### Self-observation
- [>] (H-021) Whether the minimal-banter pattern shows up even with people already known and trusted,
      or only with strangers. The specific occasions it was noticed on are in the 2026-09-20
      entry in `journal/entries/` (encrypted), not repeated here, since this file is public.
      Not manufactured as a test, noticed when it naturally comes up. (Raised 2026-09-20)
- [>] (H-022) Whether this morning's structured exercise genuinely satisfies the ancestral-movement
      drive Sapiens describes, or is itself another modern substitute. (Raised 2026-09-20)
- [>] (H-023) How much broader the "Routine Machine as an intuitive pre-answer" insight gets as
      reading and building continue together. (Raised 2026-09-20)
- [>] (H-024) Whether "my anxiety comes from an addiction to control everything" actually holds up
      against a real instance, or is just the label that was closest at hand. Raised as a
      question by Miguel himself, not concluded either way. (Raised 2026-09-22)

## Pending decisions and actions

### Hub infrastructure

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
- [>] (H-025) Weekly summaries are written on request, not on a schedule, and one went missing once
      already. `2026-09-21-to-2026-09-27` and `2026-09-28-to-2026-10-04` exist (the second
      pushed 2026-10-09). `2026-10-05-to-2026-10-11` does not yet. Decide whether to schedule
      them. (Raised 2026-10-09)

- [>] (H-027) Measure whether the practices help: count corrections needed after each Claude Code run
      (late patches, missed requirements, claims that turn out unverified) and compare with
      the Lab prompt, which needed one late patch. Not measured yet. (Raised 2026-10-13)
- [>] (H-028) Decide on pruning the hub. `backlog.md` (about 400 lines) and `SYNC_LOG.md` (about 440)
      only grow, because the rule is to never delete a line. Option: move closed items and old
      entries to an archive file in the same repo, so nothing is deleted and less is read each
      session. Also whether the site rules in `MASTER_CONTEXT.md` should become a pointer to
      `site/README.md`, since both hold them. Both change a standing rule, so neither is
      applied. (Raised 2026-10-13)

- [>] (H-029) Journal gaps: no commits in any repo on 2026-10-20, 10-22, 10-23, 10-24, so no entries. Entries for 10-17, 10-18,
      10-21, 10-25 and 10-26 were rebuilt from commits. Add notes for any of those days if you want them filled in.
      (Raised 2026-10-26)
- [>] (H-030) Weekly summaries for 10-05 to 10-11 and 10-12 to 10-18 are not written. Only on request. (Raised 2026-10-26)
- [>] (H-031) Find the sentence in Sapiens on Sumerian writing, the human brain and DNA, and check it against Miguel's note of
      2026-10-20. (Raised 2026-10-26)
- [>] (H-032) Review the takeaways in `site/tech/my-first-agentic-system-is-a-folder.md`; they are a draft for Miguel to
      correct. Then run `npm run substack` from `scripts/` for it and for "Stay Close Behind the Code". (Raised 2026-10-26)

### Career prep
- [>] (H-033) Actually work through the PostHog rejection feedback properly, what was said, what
      was felt, what's genuinely open versus already being decided about it. Deferred
      multiple times, still not started. (Raised 2026-09-16)

### Website and publishing
- [>] (H-034) Add the consent banner and a privacy page. Until then the live site sets cookies, keeps a localStorage
      identifier and records sessions with no notice to visitors. Miguel chose full analytics first and consent
      later on 2026-10-15. Note from the build: PostHog's `cookieless_mode: 'on_reject'` captures nothing until
      a visitor accepts or declines, so counting without cookies before a choice is not possible as first
      planned. Still open: whether the privacy text names the vendor. (Raised 2026-10-15)
- [>] (H-035) Confirm one pageview and one custom event in PostHog Live events from a real browser (a scripted
      browser cannot show it, because PostHog filters out bots), and that the deployed site sends events.
      (Raised 2026-10-15)
- [>] (H-036) `npm run check:mobile` fails on article and project pages, 378px against 375px. It fails the same way
      with analytics off, so it predates the analytics work. Needs its own pass. (Raised 2026-10-15)
- [>] (H-038) Journal excerpt publication is on hold, by Miguel's decision on 2026-10-11. None
      written. If it resumes, the 2026-10-01 entry was the only one that made a point no
      published piece already covers. (Raised 2026-10-11)
- [>] (H-039) Possible next article, raise only: the AI hype and fundamentals thread (software as a side effect
      of learning). Check the published pieces first, and note that the video's claims are Miguel's
      reading, not checked against the video. Not written. (Raised 2026-10-14)
- [>] (H-040) Next book: "Algorithms Are Not Enough" by Herbert L. Roitblat. Not started. Update `site/now.md`
      `reading` only when he starts it. (Raised 2026-10-14)
- [>] (H-041) Optional: run the two-week test of whether AI tools save hours or raise expectations: log hours and
      output per day with and without the tool. Named in the new article as untested. (Raised 2026-10-13,
      repeated in the 2026-10-14 article)

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

- [>] (H-042) On MailerLite's free plan, each new-article email is sent by hand as a campaign.
      Sending automatically from the site's RSS feed needs a paid plan (Comfort or Power).
      Decide which, once there are subscribers to write to. (Raised 2026-09-23)
- [>] (H-043) With double opt-in on, "You're on the list" is true of the list, but nobody gets an
      email until they click the confirmation link. Decide whether the success message
      should say "Check your inbox to confirm." (Raised 2026-09-23)
- [>] (H-044) One test address went into the live MailerLite list twice during testing (JavaScript
      on and off). Remove it, or keep it as a real subscriber. (Raised 2026-09-23)
- [>] (H-045) Delete any test comments Claude Code posted to live Waline threads while checking
      "This helped" and the sign-up form, from the Waline admin page. (Raised 2026-09-23)
      Claude Code listed six in `docs/design.md`: objectId 3 ("This helped" on
      `/miguel-site/tech/idempotency-keys`), 4, 6, 7, 8 (`/miguel-site/subscribe`), and 5
      (`/miguel-site/rate-limit-probe`). It says none shows on the live site. That holds
      for the last five. For number 3, check whether it appears under the idempotency
      article's comments.
      With the sign-up moving to MailerLite, any real addresses left under
      `/miguel-site/subscribe` in Waline should be moved into MailerLite by hand, then
      deleted from Waline.
- [>] (H-046) Decide whether to replace `SITE_DISPATCH_TOKEN` with a fine-grained token scoped to
      `miguel-site` with Contents read and write only, as originally intended, and whether
      to get the same token out of `miguel-site`'s `.git/config` remote URL, where it sits
      in cleartext. (Raised 2026-09-23)
- [>] (H-047) Read the drafted "What I took from it" lists on all six articles and four project
      pages and correct any item that isn't what he actually took from it. (Raised
      2026-09-23)
- [>] (H-048) Study Java application-level concurrency mechanisms taken to failure (thread pools,
      locks, `CompletableFuture`, virtual threads, where each one saturates or deadlocks),
      then what the OS does once application-level handling is exhausted, also taken to
      failure, and write an article on it. (Raised 2026-09-24)
- [>] (H-049) Read the two articles drafted 2026-10-09 (`philosophy/more-copies-is-not-a-better-life.md`,
      `tech/what-the-reconciler-cant-see.md`) and their takeaway lists, and correct anything
      that isn't what he actually took from it. Pushing them triggers cross-posting to dev.to,
      and to LinkedIn for the tech one. The tech article leaves the correction-path question
      undecided on purpose, update it once that is decided. (Raised 2026-10-09)
- [>] (H-050) Open the two sources the philosophy article cites for skeletal health after farming
      (a 2011 paper on stature and robusticity across the agricultural transition, and the
      review "Foraging to Farming Transition: Global Health Impacts, Trends, and Variation"),
      and tighten that paragraph to what they actually say. Both pages refused to load on
      2026-10-09, so only their existence was confirmed. (Raised 2026-10-09)

### Settlement engine
- [>] (H-051) Look at the Lab and the MCP server's evals with fresh eyes, as a user would: open the
      Lab, read `docs/mcp.md`, and check the 7 of 7 first scored run (results file under
      `mcp-server/evals/results/`) against what the cases actually test. (Raised 2026-10-13)
- [>] (H-052) Decide where the public Lab sandbox is hosted. Not the shared staging server:
      `docs/testing.md` already rules out load there. The prompt writes compose and
      Kubernetes files but applies nothing. (Raised 2026-10-09)
- [>] (H-053) Restudy next: the Phase 1 and Phase 9 concurrency fixes. (Raised 2026-09-27) Cold test run
      2026-10-15: no recall of Phase 1, Phase 9 or what `finalizeWithRetry` retries. The crash question was
      answered UNKNOWN fixed by reconciliation; the code says PENDING, fixed by the stale-pending sweep
      (60 s schedule, 300 s grace), not by reconciliation. Answers explained in the 2026-10-15 reply.
      Next: ask the four questions again in a later session, with no notes.
- [>] (H-054) MCP and agents study, decided 2026-10-15 as the new tilt of the restudy, anchored in the engine's own
      `mcp-server/` (10 read tools, 3 write tools behind `MCP_ALLOW_WRITES`, evals). Six modules: client and
      server architecture and transports; tool discovery and schema design; context (resources, prompts,
      token cost); security (write gates, personas, prompt injection, remote auth); an agent loop
      orchestrating several servers (database, API, files, DevOps); deployment and evals. Same method:
      Miguel explains cold, Claude checks against the code. Spec details to be checked against the
      current MCP specification before teaching. Nothing built yet. (Raised 2026-10-15)

### Routine machine
- [>] (H-055) Routine machine: Prompt 5 (product analytics) shows parts 1 to 3 of 6 in commits. Check whether parts 4 to 6
      were done. (Raised 2026-10-26)
- [>] (H-056) Routine machine: confirm PostHog Live events from a real browser after consent. (Raised 2026-10-15, still open)
- [>] (H-057) Routine machine: `README` and `PROJECT.md` name a target employer. Decide whether to reword. (Raised 2026-10-26)
- [>] (H-058) Routine machine: 2026-10-26 commits fixed a test that passed only on macOS. Check the other tests for
      machine-specific assumptions. (Raised 2026-10-26)
- [>] (H-059) Later, not in the current prompt: cloud hosting and file storage, CI/CD, Kubernetes, caching. Each
      gets a concerns-record answer first. (Raised 2026-10-19)
- [>] (H-060) Decide whether Routine Machine moves from tracking work toward producing it (an artifact with checks
      and approval). Claude's assessment is in the 2026-10-19 reply; Miguel decides. (Raised 2026-10-19)
- [>] (H-061) Design and build email reminders for anything time-related (deadlines, scheduled
      decision points) once Routine Machine can support it. (Raised 2026-09-20)
- [>] (H-063) Fix `docs/testing.md`'s stale "Open questions: None currently open for Phase 1"
      wording, now that Phase 3 is done. Cosmetic, low priority. (Raised 2026-09-19)

### Open source
- [>] (H-064) Test supabase/mcp #459 against the real PostgreSQL parser and comment only if it finds
      something. (Raised 2026-10-14)
- [>] (H-065) Test hexproof-dev's rule on #457 (dollar-quoted body after `=`, `||`, `(`, `,`, `VALUES` is data,
      after `DO`, `AS`, `EXECUTE` is code), including single-quoted code strings. Comment only with
      new evidence. (Raised 2026-10-14)
- [>] (H-066) Second java-sdk #859 reproduction: a tool that calls back into the same Tomcat connector, NIO2,
      small and default `maxThreads`, plain and TLS. The reporter had already described this setup.
      A correcting comment only if the thread raises it. Do not start unprompted. (Raised 2026-10-14)
- [>] (H-068) Add `docs/engineering-concerns.md` and `docs/understanding-first.md` to every project: one concerns record
      per project (111 rows since 2026-10-19, answer and reason), and a link from each `CLAUDE.md` and `PROJECT.md`. A project
      is audited only when Miguel asks. (Raised 2026-10-16)
- [>] (H-069) Write one article per merged pull request. First candidate, only after something is
      merged or substantively reviewed: why splitting SQL on `;` fails and how to make a safety
      check fail closed. Check the published articles first. (Raised 2026-10-14)
- [>] (H-070) Check `projects/career-prep.md`, which mentions a tailored CV and cover letter for a
      Supabase support role, against Miguel's current applications before any article names
      that company. (Raised 2026-10-14)

## How this file gets used

New open questions or pending items get added here as they come up in any project or
journal entry, not left living only in that project's own file. When one is resolved, its
line gets a strikethrough-free update: change `[ ]` to `[x]` and append "Answered
YYYY-MM-DD: <resolution>" so the reasoning stays visible, the same standard the rest of this
hub already holds decisions to.

Since 2026-10-26: new items are added to `queue.md`, not here. `[>]` means the item moved to the queue and keeps
its id. Resolve it in both places: mark it `[x]` here and `done` in the queue.
