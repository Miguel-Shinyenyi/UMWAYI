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
      (Raised 2026-09-18)

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
- [ ] Whether the shepherd-based personal mark (the cursor-glyph favicon, the six-dot
      "flock" mark on the homepage) and the bolder accent chrome actually read well once
      seen directly, not assumed from the plan or the code alone. (Raised 2026-09-22)

### Settlement engine
- [ ] Whether outbox and double-ledger will surface similarly real, correctable gaps once
      studied this closely, or whether idempotency's crash gap was specific to its own
      complexity. Not assumed either way. (Raised 2026-09-21)

### Self-observation
- [ ] Whether the minimal-banter pattern (river walk, pool game) shows up even with people
      already known and trusted, or only with strangers. Not manufactured as a test, noticed
      when it naturally comes up. (Raised 2026-09-20)
- [ ] Whether this morning's structured exercise genuinely satisfies the ancestral-movement
      drive Sapiens describes, or is itself another modern substitute. (Raised 2026-09-20)
- [ ] How much broader the "Routine Machine as an intuitive pre-answer" insight gets as
      reading and building continue together. (Raised 2026-09-20)
- [ ] Whether "my anxiety comes from an addiction to control everything" actually holds up
      against a real instance, or is just the label that was closest at hand. Raised as a
      question by Miguel himself, not concluded either way. (Raised 2026-09-22)

## Pending decisions and actions

### Career prep
- [ ] Actually work through the PostHog rejection feedback properly, what was said, what
      was felt, what's genuinely open versus already being decided about it. Deferred
      multiple times, still not started. (Raised 2026-09-16)

### Website and publishing
- [ ] Create dev.to and Medium accounts, still don't exist. (Raised in the original site
      plan, 2026-09-16, carried forward)
- [ ] Decide whether the broader hub cross-posting plan (Hashnode, dev.to, Medium, LinkedIn)
      is still intended, separate from the narrower decision already made to keep the site
      itself GitHub-Pages-only. (Raised 2026-09-20)
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
      Visual review of the result is a separate, still-open item above.

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

### Routine machine
- [ ] Design and build email reminders for anything time-related (deadlines, scheduled
      decision points) once Routine Machine can support it. (Raised 2026-09-20)
- [ ] Fix `PROJECT.md`'s "Current phase" line, currently just reads "five" with no
      description, unlike every earlier phase. Cosmetic, low priority. (Raised 2026-09-20)
- [ ] Fix `docs/testing.md`'s stale "Open questions: None currently open for Phase 1"
      wording, now that Phase 3 is done. Cosmetic, low priority. (Raised 2026-09-19)

## How this file gets used

New open questions or pending items get added here as they come up in any project or
journal entry, not left living only in that project's own file. When one is resolved, its
line gets a strikethrough-free update: change `[ ]` to `[x]` and append "Answered
YYYY-MM-DD: <resolution>" so the reasoning stays visible, the same standard the rest of this
hub already holds decisions to.