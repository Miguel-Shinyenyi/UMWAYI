# Routine Machine

## What it is

An AI project, not just a tracker. Logs daily routines and learning, and over phases learns
to suggest and eventually reprioritize. Full documentation and architecture live in the
routine-machine repo, this file is the pointer and status, not the detail.

Repo: https://github.com/Miguel-Shinyenyi/routine-machine

## Why it exists

Directly from the person building it: feeling like there's too much leads to doing nothing.
This counters that by leading with a little a day, tracked honestly.

## The three goals it feeds

CMU masters, PostHog and other target roles, becoming a working AI engineer.

## Architecture, one line

Two services: Java Spring Boot core owns the data, Python FastAPI intelligence service owns
suggestion and pattern logic. Mirrors the settlement-engine pattern deliberately.

## Phases

1. Logging plus rule-based topic suggestion, weighted toward the most neglected goal. Done.
2. Pattern detection over accumulated logs: completion rates, streaks, skip-heavy days, a
   topic/completion correlation. Done.
3. Fixed weekly schedule, tasks, a reading log, and a full Next.js frontend (backlog,
   roadmap, board, reports views). Done.

Studying an existing system (settlement-engine) for understanding is a learning activity,
not a building one, and belongs under Phase 1's goal-tagged `learning_topics`, not under
deep-work alongside building Routine Machine itself. This was caught and corrected after
first being mislabeled.

## Reading tracker

A `current_reading_log`, append-only, updatable manually or detected automatically from a
`Current book:` line written directly into a UMWAYI journal entry (see
`journal/TEMPLATE.md`). Standing rule, held in both repos: the template's `Current book:`
line and the exact string hub-sync checks for must be changed together, since one changing
without the other would silently stop the sync with nothing to reveal it.

## Hub integration

Journaling and article writing in this repo feed Routine Machine directly. A new file in
`journal/entries/` or `articles/` marks that day's journaling or writing as done, read from
this repo's public GitHub API, no manual re-logging required. The `Current book:` line feeds
the reading tracker the same way. Detail in the routine-machine repo's `docs/hub-sync.md`.

## Status

All three phases built, tested, and pushed. Independently verified from this side: the
frontend's test suite passes (5 tests), the intelligence service's passes unchanged (18
tests). The backend's 56 tests couldn't be independently run here, Maven Central isn't
reachable from this side, but the reasoning behind them held up under the same scrutiny as
everything else.

Worth watching, not yet established: this is the second phase in a row where a fix from an
earlier phase (the `JOIN FETCH` lazy-loading pattern) was applied proactively before hitting
the same bug again, rather than after. Two data points so far.

## Daily inventory it tracks

Sleep, showering, movement and exercise (walks, weight lifting, skating), cleaning the house,
cooking, personal time (currently reading Sapiens), checking on mum, paid work, finances.