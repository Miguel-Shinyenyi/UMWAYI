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
suggestion and pattern logic. Mirrors the settlement-engine pattern deliberately. Next.js
frontend, Postgres, Docker Compose.

## Phases

Checked against the repo (`main` at da5640f, 2026-10-26). Detail is in the repo's `PROJECT.md`.

1. Logging plus rule-based topic suggestion, weighted toward the most neglected goal. Done.
2. Pattern detection over accumulated logs. Done.
3. Fixed weekly schedule, tasks, a reading log, and a Next.js frontend. Done.
4. Active reprioritization. Gated on weeks of real usage data. Not started.
5. The shepherd frontend (Today, Path, Flock, Tally). Done.
6. Watering holes: WakaTime, ActivityWatch, GitHub, RescueTime, a health-data endpoint, hub-sync. Done.
7. Reader's notes assessed by an AI model. Done.
8. Accounts, password login and the hillside. Done, OAuth sign-in deferred.
9. Hillside v2 and the evidence-to-credit ledger. Done.
10. Profile and analogies. Done.
11. The granary: savings, the pause, M-Pesa statement import. Done.
12. Organisations and cohorts. Done.

Phases 9 to 12 are on `main` (pull request #9, 2026-10-26). After Phase 12, work moved to the
hardening items below, run as staged Claude Code prompts.

## Direction under review (2026-10-26)

A strategy update dated 2026-10-20 moves the commercial aim from learner consistency toward an organisation
tool for skills-to-employment programmes: candidate pipeline, follow-ups, intervention log, placement status
and outcome reports, with AI only as a drafting aid under human review. The operating plan, the brief and
the update disagree in places. The decisions are in `queue.md` (D-1 to D-7). The business figures and
prospects are in the encrypted journal and the local investor pack, not here.

## Hardening since 2026-10-19

- Per-user scoping and access control: every user-scoped route takes the user from the signed token,
  with an owner role and cross-user isolation tests. Done 2026-10-21.
- Observability: request ids, JSON logs, metrics, Prometheus, Alertmanager, Loki, Jaeger, Grafana,
  exemplars, and an owner-only `/watchtower` page. Done 2026-10-21 to 2026-10-25.
- API docs for both services, owner only, with the documentation check. Done 2026-10-25.
- Product analytics, consent first (parts 1 to 3 of 6 visible in commits): identify by internal id,
  replay off, a privacy page, named events, a build-failing field-name test.
- Repository standard: README with a real screenshot, MIT license, CI (green on GitHub), demo profile
  off by default, fresh-clone run. Done 2026-10-26.
- Understanding first (staged Prompt 7): the two hub documents, a daily reminder, a stronger reminder
  after missed days, a weekly failure-mode card, a choice of start day, the 111-row concerns record.
  Done 2026-10-26.
- Not started: cloud hosting and file storage, CI/CD deploys, Kubernetes, caching (each needs a
  concerns-record answer first).

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

Updated 2026-10-26. Phases 1 to 12 are on `main`. CI is green on GitHub. The commit history shows the
staged prompts of 2026-10-19 run through Prompt 7, except that Prompt 5 (product analytics) shows only
parts 1 to 3 of 6 in commits. Whether parts 4 to 6 were done is unknown.

Open: whether Phase 4 stays gated; whether the app moves from tracking work toward producing it (an
artifact with checks and approval); the routine-machine README and `PROJECT.md` name a target employer.

Earlier note, still worth watching: fixes from one phase were applied ahead of time in the next (the
`JOIN FETCH` pattern). Two data points so far. A new one on 2026-10-26: a test that passed only on
macOS (it looked for the word "mum") failed in CI and was fixed to look for whole phrases.

## Daily inventory it tracks

Sleep, showering, movement and exercise (walks, weight lifting, skating), cleaning the house,
cooking, personal time (currently reading Sapiens), checking on mum, paid work, finances.