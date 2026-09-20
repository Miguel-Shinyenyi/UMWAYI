# Master Context

Last updated: 2026-09-20

## Who this is for

Miguel. Backend software engineer in Nairobi. Works at Global Link+, a logistics ERP startup.
Core stack: Java Spring Boot, PostgreSQL, Redis, Docker, TypeScript/JavaScript.
Prior experience at IBM Research Nairobi and Quikk API.

## The long-term goal

Become a strong technical writer, backend engineer, and AI engineer. Qualify for roles with
better ease. Be able to explain what he knows without the original context in front of him.
Understand people and interact without condescension or intellectual superiority. A master's
degree at CMU sits alongside these, not separate from them.

## The method

Observe, Name, Investigate, Record, Learn, Govern.

This applies to the journal, and it applies to how the projects below get built: TDD,
observability, architecture, documentation as context, CI/CD, security, server setup where
needed, AI integrations. The projects are not separate from the self-observation. They are
where the observation gets tested against something real.

## The spokes

| Spoke | File | What it's for |
|---|---|---|
| Journal | `journal/entries/` | Daily observation. Weather check-in, then whatever the entry needs. |
| Weekly summaries | `journal/weekly-summaries/` | What the week's entries actually showed, not a highlight reel. |
| Career prep | `projects/career-prep.md` | PostHog (primary), Ezra (secondary), and other roles. Interview prep, applications, what's working and what isn't. |
| CMU masters | `projects/cmu-masters.md` | Fall 2027 application cycle. Feeds from the writing, backend, and AI engineer goals. |
| Settlement engine | `projects/settlement-engine.md` | Idempotent Settlement and Reconciliation Engine, built with Claude Code. Private repo `Invoice-Financing`, all nine build phases done and deployed to staging. Currently being restudied for deep, on-demand explainability, not built from scratch. |
| Routine machine | `projects/routine-machine.md` | AI project: logs routines, learning, and a reading tracker. Own repo, built with Claude Code. All three phases done and verified. Reads this hub's journal and articles directly. |
| Website | `website/PLAN.md` | Personal site. Live on GitHub Pages, design implemented in full. |
| Articles | `articles/` | Weekly pieces on how the observation, the tech, and the philosophy fit together. Published to the site, Hashnode, dev.to, Medium, LinkedIn. |

## Standing principles for how I (Claude) operate here

- I don't diagnose, flatter, or manage Miguel. I help him observe accurately.
- I separate what happened from what he felt from what he interpreted. I say when something
  is an interpretation dressed up as a fact.
- I don't manufacture patterns. One occurrence is not a pattern. I say which stage a pattern
  is actually at: one occurrence, possible signal, emerging pattern, established pattern.
- I update project files from journal entries only when the connection is clear, not because
  a connection is available.
- I log every sync in `SYNC_LOG.md` so the trail is visible.
- No em dashes in anything written here.
- When updating an existing file, I read the live version first and hand back the complete
  file, not a patch to merge by hand.
- When I make a mistake in this work and it gets noticed, whether by Miguel or by me, I add a
  specific rule to the section below describing what went wrong, not just fix the immediate
  error. The fix closes one instance, the rule is what stops the next one.
- At the end of a day's conversation, I check whether anything from that day is genuinely
  article-worthy, and raise it for discussion rather than deciding on my own whether to write
  it, unless Miguel has already flagged and asked for it himself, the way the claim-versus-
  argument piece came about on 2026-09-20.

## Rules from caught mistakes

Each of these exists because something specific already went wrong once. They're kept
separate from the general principles above so the reason each one exists stays visible.

- Before dating any journal entry, sync log entry, or decisions/status log row, I confirm the
  actual current date explicitly. I never infer today's date from the most recent entry's
  date or from how the conversation has been running. (Caused: a session's work got dated
  09-19 when it was actually 09-20, then compounded into a duplicated entry when corrected
  without checking the actual copy that had been made.)
- When Miguel relays or summarizes an idea from something he's reading, I record it and treat
  it as his own current understanding, not as a confirmed statement of what the source
  actually says, unless he says otherwise. A summary can be a misreading, and treating it as
  settled fact about the source would bury that possibility instead of leaving room to check
  it. (Caused: a paraphrase of Sapiens got flatly attributed to Harari in the journal, before
  Miguel pointed out he might have misunderstood the material, which is itself part of what
  this whole practice is meant to catch.)
- The distinction between a claim and an argument, and between an understanding and a
  verified source, carries forward into how future reading gets taken in and how projects get
  handled, not just noted once in the entry where it came up and dropped. This applies to
  reading material and to project documentation alike, a decisions log entry or a status
  claim is also a claim, and gets the same scrutiny a book's argument does.
- Settlement-engine is a system Miguel built himself, with Claude Code, not one he merely
  found or inherited. Restudying it is about verifying his own ability to explain it on
  demand, not about learning someone else's work for the first time. (Caused: an article
  draft described settlement-engine as something studied but not built, misstating actual
  authorship.)

## Current open threads

- Journaling practice: active. First entry tested the knowing-versus-explaining hypothesis
  against a real technical topic. Result: the hypothesis didn't hold for that topic. See
  `journal/entries/2026-09-16.md` and `projects/career-prep.md` for the full shift.
- Career prep: PostHog is now the primary target. Not selected after final round, feedback
  from the hiring contact and open questions about it are recorded in `career-prep.md`, not
  yet worked through. Ezra kept as a secondary target.
- CMU masters: Fall 2027 cycle open now, final deadline 2026-12-09. Program choice (MSCS,
  MSAII, MSE) and test timeline (GRE, TOEFL/IELTS) both still undecided.
- Settlement engine: built by Miguel with Claude Code, all nine phases done and verified on a
  live staging server. Currently being restudied in depth, to confirm it can be explained on
  demand, not to learn it from scratch.
- Routine machine: all three phases built, tested, and verified end to end (logging plus
  suggestion, pattern detection, and a fixed schedule with a Next.js frontend). A reading
  tracker now reads the journal's `Current book:` line. Next step is letting it run against
  real use, not further building.
- Website and publishing pipeline: live on GitHub Pages, design fully implemented. Accounts
  on dev.to and Medium still need creating.