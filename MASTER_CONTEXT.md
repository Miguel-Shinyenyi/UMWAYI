# Master Context

Last updated: 2026-09-23

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
| Weekly summaries | `journal/weekly-summaries/` | What the week's entries actually showed, not a highlight reel. Written Sunday evenings. |
| Backlog | `backlog.md` | Every open question and pending decision or action across all projects, marked answered when resolved, never silently dropped. |
| Career prep | `projects/career-prep.md` | PostHog (primary), Ezra (secondary), and other roles. Interview prep, applications, what's working and what isn't. |
| CMU masters | `projects/cmu-masters.md` | Fall 2027 application cycle. Feeds from the writing, backend, and AI engineer goals. |
| Settlement engine | `projects/settlement-engine.md` | Idempotent Settlement and Reconciliation Engine, built with Claude Code. Public repo `Invoice-Financing` (made public 2026-09-23), all nine build phases done and deployed to a live staging server. Idempotency restudied in depth, one verified gap found and fixed. |
| Routine machine | `projects/routine-machine.md` | AI project: logs routines, learning, and a reading tracker. Own repo, built with Claude Code. All three phases done and verified. Reads this hub's journal and articles directly. Email reminders for time-related items planned. |
| Website | `website/PLAN.md` | Personal site. Historical plan, resolved and superseded. The site's code lives in the `miguel-site` repo; its content lives here, in `site/`. |
| Site content | `site/` | Everything the site shows: articles (philosophy, tech, journal), project pages, illustrations, the profile photo, the Now section. The site clones this folder at build time and rebuilds on every push that touches it. Rules for every file are in `site/README.md`. Broader cross-posting (Hashnode, dev.to, Medium, LinkedIn) still pending, see `backlog.md`. |

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
- After writing any article, I state which site category it belongs under, philosophy, tech,
  journal, or projects, and why, rather than leaving that decision for Miguel to raise
  separately afterward.
- Site content is edited here, in `site/`, never in the `miguel-site` repo. Every new article
  or project page follows `site/README.md`: the body starts with a `##` section, the last
  section is `## What I took from it` as a numbered list, and it gets one illustration made
  with `site/tools/illustrations.py` in the same delivery, not left for later.
- When I draft a "What I took from it" list, every item comes from what the piece itself
  already says. I don't add a lesson Miguel hasn't stated, and I tell him the list is a draft
  for him to correct.
- Nothing on the site names a company Miguel applied to or interviewed with (PostHog, Ezra,
  JUMO, and any that come later). On the site they're described in general terms, "a job
  interview", "a lending company", never by name. His current employer, Global Link+, may be
  named; he confirmed that on 2026-09-23. The names stay in the hub's own files, which the
  site never publishes. The homepage's open threads read straight from `projects/` files,
  so a bullet under "Open questions" or "Open decisions" there counts as site content.
- Journal excerpts for the site are drawn from `journal/entries/`, never copied whole.
  Anything private is left out: health beyond what an article has already made public, other
  people, money, and personal patterns still under investigation. When I'm not sure whether
  something is private, I ask before it goes into `site/`. Left private by his decision on
  2026-09-23: the 09-20 river walk and pool game.
- Weekly summaries are written Sunday evenings, starting 2026-09-20, the day this rule was
  introduced.
- `backlog.md` holds every open question and pending decision or action across every
  project. I add to it as new ones come up in any conversation, not just at the end of a
  session, and I mark an item answered with the date and a one-line resolution when it's
  resolved, I never delete a line or leave it silently unmarked.
- Anything time-sensitive, a deadline, a scheduled decision point, gets flagged as a
  candidate for an eventual email reminder once Routine Machine supports it. Until that
  exists, it stays visible in `backlog.md` so it isn't missed in the meantime.
- When studying a project's codebase surfaces a genuine correction opportunity, not a style
  preference, a real gap or bug, I don't let "this project is well-built" talk me out of
  flagging it. I verify it against the actual code first, then provide a ready-to-use prompt
  for Claude Code to fix it, rather than describing the issue only in the abstract.

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
- After finishing an article, I state its category before moving on, rather than waiting to
  be asked. (Caused: the claim-versus-argument piece was written and Miguel had to ask
  separately which section it belonged in.)
- I check project-status claims in the hub against reality periodically, not just when
  something is actively being worked on. (Caused: `website/PLAN.md` and
  `projects/settlement-engine.md` both sat stale for days after the underlying work had moved
  well past what they described, discovered only when pointed out directly.)
- When I print a file's full content for Miguel to copy, I treat that as delivered only once
  the tool call has actually confirmed returning that complete content, not because I
  intended it to or because a similar call worked earlier in the same session. A tool call
  can fail to run, run empty, or error out silently, and proceeding as though it succeeded
  anyway would hand Miguel content that was never actually produced. (Caused: after a context
  compaction, two verification Bash calls in a row failed to run, and Miguel had to ask
  directly for a standing rule making sure every print is confirmed before being treated as
  available.)
- When a document is large or a session has been running long, I write it to an actual file
  and send it, rather than printing it into the chat and assuming it arrived intact. A long
  print can get truncated in a way that isn't visible to me from the tool result. (Caused:
  multiple full-file replacements printed into chat on 2026-09-22 came through truncated,
  three hours into the session, and weren't safely copyable, discovered only when Miguel
  said so directly.)

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
  verified crash-recovery gap found and fixed same day (commit `950bf86`). Next: outbox.
- Routine machine: all three phases built, tested, and verified. Email reminders for
  time-related items now planned as a future addition.
- Website and publishing: site live, redesigned around the illustrated shepherd (2026-09-23).
  Content lives in this hub's `site/` folder, so the site is updated by editing markdown here.
  Hashnode, dev.to, Medium, and LinkedIn profiles now exist and are linked from the footer;
  whether articles get cross-posted to them is still undecided.