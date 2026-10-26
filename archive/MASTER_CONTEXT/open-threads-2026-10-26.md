# A-002: Current open threads section

Moved from `MASTER_CONTEXT.md` on 2026-10-26 with Miguel's approval. The text between the markers is unchanged. Do not read this file at the start of a task.

<!-- A-002 begin -->
[A-002 segment 1: MASTER_CONTEXT.md lines 184 to 222]
## Current open threads

See `backlog.md` for the full, itemized list. Summary by project:

- Journaling practice: active. First entry tested the knowing-versus-explaining hypothesis
  against a real technical topic. Result: the hypothesis didn't hold for that topic. See
  `journal/entries/2026-09-16.md` and `projects/career-prep.md` for the full shift.
- Career prep: PostHog is now the primary target. Rejection feedback recorded but still not
  worked through. Ezra kept as secondary.
- CMU masters: Fall 2027 cycle open, final deadline 2026-12-09. Program and test timeline
  both undecided.
- Settlement engine: built by Miguel, all nine phases done and verified on staging.
  Idempotency chosen as the first subsystem restudied, two explain-back passes done, one
  verified crash-recovery gap found and fixed same day (commit `950bf86`). Outbox and
  ledger, then reconciliation, restudied and checked against the code. A public Lab sandbox
  and an MCP server over it are merged to `dev`. Open: where the Lab is hosted, and who
  carries out a correction after a mismatch is resolved. From 2026-10-15 the restudy tilts toward MCP and
  agents, anchored in the engine's own MCP server; the Phase 1 and Phase 9 concurrency fixes stay on the
  list after a first cold test with no recall.
- Open source: started 2026-10-14. Board of issues, no cap, in `projects/open-source.md`,
  process and evidence in `docs/open-source-process.md`. supabase/mcp #457 is waiting on the
  maintainers after pull request #470 was closed (another contributor's #459 covers half).
  Six issues are posted; java-sdk #882 is closed by the reporter, supabase-kt #415 has Miguel's follow-up and no reply yet, the rest wait. No follow-ups are drafted ahead of a reply. Next: a second #859 reproduction (tool
  calling back into the same connector) and a test of the #457 dollar-quote rule.
- Routine machine: direction under review (strategy update of 2026-10-20 points to an organisation tool for skills-to-work programmes; decision D-1 in `queue.md`). Phases 1 to 12 are on `main` (2026-10-26, `da5640f`). Staged prompts of 2026-10-19 run through
  Prompt 7 (access control, observability with an owner-only `/watchtower`, API docs, repository standard, CI green,
  understanding-first reminders, the 111-row concerns record). Open: Prompt 5 parts 4 to 6 not seen in commits; whether
  Phase 4 stays gated; whether the app moves from tracking toward producing work. Email reminders remain a future
  addition.
- Website and publishing: site live, redesigned around the illustrated shepherd (2026-09-23).
  Content lives in this hub's `site/` folder, so the site is updated by editing markdown here.
  Hashnode, dev.to, Medium, and LinkedIn profiles now exist and are linked from the footer;
  cross-posting is live to dev.to and LinkedIn (technical pieces only on LinkedIn). Hashnode
  (needs a paid plan) and Medium (issues no tokens) are not in use. Journal excerpt publication is on hold.
  Published 2026-10-26: the articles "Stay Close Behind the Code" (philosophy) and "My First Agentic System Is a Folder of Files" (tech). Built 2026-10-15: PostHog analytics on the site, live without a consent banner (the banner and a privacy
  page are still to build), and a local script that published all 10 philosophy and tech articles to
  Substack with no email to subscribers.
  The footer email sign-up runs on MailerLite (account 2655737); Waline handles comments and
  "This helped" only.
<!-- A-002 end -->
