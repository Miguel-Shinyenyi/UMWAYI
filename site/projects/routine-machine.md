---
title: "Routine Machine"
date: 2026-09-20
updated: 2026-09-23
summary: "An AI project that logs daily routines and learning, detects patterns, and runs a fixed schedule through its own tracking frontend."
draft: false
status: "Phase 3 of 4, built and verified"
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

## The problem it solves

Built to solve a specific, named problem: too much to do leads to doing nothing. Rather than
trying to be intelligent from day one with no data to be intelligent about, it's built in
phases, each one only as smart as the data actually justifies.

## How it's built, phase by phase

Phase one logs daily routine completion and learning topics, and suggests what to learn next
based on which goal has had the least recent attention. Phase two adds pattern detection,
completion rates, streaks, and a descriptive correlation between learning and completing the
rest of the day's routine, statistics on real data, not a model. Phase three adds a
deliberately fixed, non-adaptive weekly schedule and a full tracking frontend, shaped like a
project board: a backlog of recurring routine definitions, a roadmap view of the week, a
day-by-day board, and reports built on phase two's statistics.

## What's deliberately not built yet

A fourth phase, active reprioritization based on accumulated data, is intentionally not
started. It's gated on real usage data existing first, not on a target date, the same
discipline the rest of this system is built around: don't build the smart version before
there's anything real for it to be smart about.

## What I took from it

1. Name the problem precisely first. "Too much to do leads to doing nothing" shaped every
   phase.
2. A system should only be as smart as its data. Statistics before models.
3. Gate the next phase on real usage, not on a date.