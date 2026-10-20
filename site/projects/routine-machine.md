---
title: "Routine Machine"
date: 2026-09-20
updated: 2026-10-19
summary: "An AI project that logs daily routines and learning, detects patterns, and runs a fixed schedule through its own tracking frontend."
draft: false
status: "Phases 1 to 12 built"
statusVariant: primary
category: "AI project"
stack: ["Spring Boot", "FastAPI", "Python", "Next.js"]
link: "/projects/routine-machine"
linkLabel: "Follow the build"
links:
  - label: "View on GitHub"
    url: "https://github.com/Miguel-Shinyenyi/routine-machine"
illustration: routine-machine.svg
illustrationAlt: "A week board with a column per day and today highlighted. Three sheep walk in a line beneath it while the shepherd watches."
---

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

Checked against the repo on 2026-10-19. Detail and status log are in the repo's `PROJECT.md`.

1. Logging plus rule-based topic suggestion, weighted toward the most neglected goal. Done.
2. Pattern detection over accumulated logs. Done.
3. Fixed weekly schedule, tasks, a reading log, and a Next.js frontend. Done.
4. Active reprioritization. Gated on weeks of real usage data. Not started.
5. The shepherd frontend (Today, Path, Flock, Tally). Done.
6. Watering holes: WakaTime, ActivityWatch, GitHub, RescueTime, a health-data endpoint, hub-sync. Done.
7. Reader's notes assessed by an AI model. Done.
8. Accounts, password login and the hillside. Done, OAuth sign-in deferred.
9. Hillside v2 and the evidence-to-credit ledger. Done, merged to `main`.
10. Profile and analogies. Done, on branch `phase-10-profile-analogies`.
11. The granary: savings, the pause, M-Pesa statement import. Done, on branch `phase-11-the-granary`.
12. Organisations and cohorts. Done, on branch `phase-12-organisations-cohorts`.

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
`journal/entries/`, `site/philosophy/` or `site/tech/` marks that day's journaling or writing as done, read from
this repo's public GitHub API, no manual re-logging required. The `Current book:` line feeds
the reading tracker the same way. Detail in the routine-machine repo's `docs/hub-sync.md`.

## Status

Updated 2026-10-19. Phases 1 to 12 are built (see above). Before any hosted use, every user-scoped API
route needs to take the user from the signed session, not from the request. The next prompt covers
that, an owner-only operations page, API docs, product analytics, the repository standard, and the
understanding-first rules.

Earlier note, still worth watching: fixes from one phase were applied ahead of time in the next (the
`JOIN FETCH` pattern). Two data points so far.

## Daily inventory it tracks

Sleep, showering, movement and exercise (walks, weight lifting, skating), cleaning the house,
cooking, personal time (currently reading Sapiens), checking on mum, paid work, finances.