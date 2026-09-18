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

1. Logging plus rule-based topic suggestion, weighted toward the most neglected goal.
2. Pattern detection over accumulated logs.
3. Active reprioritization, gated on Phase 2 producing real data first.

## Hub integration

Journaling and article writing in this repo feed Routine Machine directly. A new file in
`journal/entries/` or `articles/` marks that day's journaling or writing as done, read from
this repo's public GitHub API, no manual re-logging required. Detail in the routine-machine
repo's `docs/hub-sync.md`.

## Status

Documentation complete, reconciled against settlement-engine's actual PROJECT.md and docs/
pattern. No code written yet. Code is being built with Claude Code in VSCode/IntelliJ,
tracked here by checking the repo, not built in this conversation.

## Daily inventory it tracks

Sleep, showering, movement and exercise (walks, weight lifting, skating), cleaning the house,
cooking, personal time (currently reading Sapiens), checking on mum, paid work, finances.