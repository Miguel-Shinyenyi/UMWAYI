---
title: A flaky test showed me a real bug in my AI helper hub
date: 2026-11-09T00:00:00.000Z
summary: >-
  A test that failed now and then turned out to be a real bug in the logbook of
  my AI helper hub. What I found, how I fixed it, and how I checked the fix.
draft: true
illustration: a-flaky-test-showed-a-real-bug.svg
illustrationAlt: >-
  A clipboard shows a test that is sometimes green and sometimes red, with a
  small bug beside it. An open logbook shows an intent line and a gap where the
  record should be. The shepherd says it is not a test problem.
tags:
  - Engineering
  - Testing
  - AI
  - Building in public
---

On Sep 16 I started a notebook. It held a journal, a list of projects and one master context file. Seven weeks later it holds rules, a queue of decisions, an archive, and a logbook of every change. I call it the Umwayi hub. It is pre-release, and one backend engineer in Nairobi builds it.

This week I turned it into code. The repository is public: umwayi-os. This post covers what exists, what broke, and what comes next.

## What the hub does

You write a rule once. Before an AI helper acts, the hub checks the action against your rules. Every action gets one of three answers:

- Yes: the helper goes ahead.
- No: the helper stops.
- Ask me first: the helper waits for you.

Any error counts as No. If the hub cannot read its own rules, nothing runs. I call this failing closed.

## What is built today

- Layers 1 to 8: memory, rules, queue, archive, logbook, scheduled scripts, helpers and workflows.
- Layer 9: adapters, so the hub works with Claude Code, Kiro and a generic command line tool.
- Layer 10: the hub's own command line and chat, plus a login check for each AI tool.
- Over 900 tests, run on Python 3.10, 3.11, 3.12 and 3.13.
- The core uses only the Python standard library. Adapters may use pinned outside packages.

## How I build it

Kiro writes the code in the cloud. I do not merge on its word. For each pull request I run the full test suite on three Python versions in a clean copy, scan the added lines, and test by hand. Then I merge. Every merge needs my yes.

## The flaky test

Two days ago one test failed now and then. It checked that Ctrl-C stops an AI helper cleanly. It passed on most runs and failed on a few.

The easy fix was a longer wait. I asked Kiro to find the cause first. It reproduced the failure in 3 of 3 runs by adding a 0.15 second pause at one point.

The cause was a real bug, not a test problem. The hub appends each change to the logbook, then records a hash of the file. When the hub stopped a helper, a check could die between those two steps. That left the logbook changed, the hash out of date, and a lock that never cleared. The hub then could not log its own stop, and it refused the next start.

Fixing a test would have hidden that.

## The fix

Pull request 27 changed how the logbook writes:

- The hub writes its intent to a small file before it touches the logbook.
- It records the new hash only if the file is exactly what it intended to write.
- After a crash, it recovers only two exact states, and writes one recovery entry. Any other mismatch still counts as tampering and stops everything.
- The lock is a kernel lock, so it frees itself when the process dies, even after a kill -9.
- Stop signals wait until the write ends.

My review of that pull request:

- 906 tests passed on Python 3.11, 3.12 and 3.13.
- The two stop tests passed 20 of 20 runs with the processor under load.
- I wrote my own check: three writers append to one logbook and I kill them at a random moment. The next write succeeded, and the logbook verified clean, in 40 of 40 trials.

## What I do not know yet

- The hub has not run against a real Claude Code login or a real Kiro login in a full run. I plan that test for Nov 12 and 13.
- Cost readings from Claude Code are estimates at list price. On a subscription they are not a bill.
- Known limits are listed in a file in the repository, and I keep adding to it.

## What comes next

- Nov 10 to 13: login checks, so each AI tool signs in with its own plan.
- Nov 16: a hash chain on the logbook, so an edited entry is named.
- Nov 17 to 22: one spending limit across all tools.
- Nov 23 to 26: a full check of the whole system and a security scan.
- Dec 3: the Kiroween submission.

Try the page I built for the Founding.dev design hackathon: https://umwayi-hub.foundingdev.com/
The code: https://github.com/Miguel-Shinyenyi/umwayi-os

If one of your AI helpers acted without asking, what should it have asked you first? Reply and tell me.
