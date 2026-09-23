---
title: "The bugs the tests didn't catch"
date: 2026-09-18
summary: "Two real bugs in Routine Machine, both found by running the system by hand, not by the test suite."
draft: false
tags: ["Testing", "Routine Machine"]
illustration: bugs-found-by-running-it.svg
illustrationAlt: "A test clipboard shows every box ticked while a small bug crawls out of the running machine beside it."
---

## The first one

Phase one of Routine Machine shipped with passing tests on both services. Then I ran the
whole thing through Docker Compose and a list endpoint returned a 500, a lazy-loading
exception. No test caught it, because only the create path checked the response body. I
added a regression test, and the testing doc now says every list endpoint gets a body
assertion, not just create.

## The second one

Phase two added streaks and completion rates. The same manual run caught a second bug: the
two numbers disagreed about how to treat a log backdated before its routine existed. Both
were computed from the same data. Neither was wrong on its own terms. Together they told two
stories.

## Twice is not yet a pattern

Two bugs in a row surfaced by running the system rather than by the suite. That's worth
watching. It isn't a rule yet.

## What I took from it

1. A green test suite says the tests pass, not that the system works.
2. Assert on the response body of every endpoint, not only the one you wrote first.
3. Run the whole thing by hand before calling a phase done.