# Master Context

Last updated: 2026-09-18

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
| Settlement engine | `projects/settlement-engine.md` | Idempotent Settlement and Reconciliation Engine. Private repo `Invoice-Financing`, all nine build phases done and deployed to staging. |
| Routine machine | `projects/routine-machine.md` | AI project: logs routines and learning, phases toward active reprioritization. Own repo, built with Claude Code. Phases 1 and 2 done and verified. Reads this hub's journal and articles directly. |
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

## Current open threads

- Journaling practice: active. First entry tested the knowing-versus-explaining hypothesis
  against a real technical topic. Result: the hypothesis didn't hold for that topic. See
  `journal/entries/2026-09-16.md` and `projects/career-prep.md` for the full shift.
- Career prep: PostHog is now the primary target. Not selected after final round, feedback
  from the hiring contact and open questions about it are recorded in `career-prep.md`, not
  yet worked through. Ezra kept as a secondary target.
- CMU masters: Fall 2027 cycle open now, final deadline 2026-12-09. Program choice (MSCS,
  MSAII, MSE) and test timeline (GRE, TOEFL/IELTS) both still undecided.
- Settlement engine: found to be fully built, not just designed, all nine phases done and
  verified on a live staging server. Next step is a real read-through, not further planning.
- Routine machine: Phases 1 (logging, rule-based suggestion) and 2 (pattern detection) both
  built, tested, and verified end to end. Phase 3 (active reprioritization) is gated on real
  usage data accumulating first, not started.
- Website and publishing pipeline: live on GitHub Pages, design fully implemented. Accounts
  on dev.to and Medium still need creating.