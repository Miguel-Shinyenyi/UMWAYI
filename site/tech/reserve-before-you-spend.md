---
title: "Reserve before you spend: a budget governor for AI agents"
date: 2026-11-13
summary: "umwayi-os reserves a cost cap before an AI agent starts, counts unknown cost at the worst case, and settles every run in the logbook. Here is how one unit works across tools that report cost in different ways."
draft: true
illustration: reserve-before-you-spend.svg
illustrationAlt: "A bar for the day's limit. A block labelled reserved sits at the start of the bar before a run begins, and a smaller block labelled spent replaces it after the run. A sheep stands by an empty block labelled unknown, which is drawn at full size. The shepherd says unknown counts as the worst case."
tags:
  - Engineering
  - Cost control
  - Agentic engineering
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, Python, BuildInPublic]
  post: docs/plans/reserve-before-you-spend-linkedin-post.md
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## The problem

An AI agent that runs without you can spend money without you. A loop that retries, a long task, or a large context can use more than you planned before you look at a dashboard.

Two things make this hard to control.

- Tools report cost in different ways. Claude Code can report cost as it runs. Kiro sends nothing to umwayi. A subscription bills per month and not per token.
- A limit that only checks after a run has ended does not stop the run.

umwayi-os has a budget governor. It is built around three ideas: one unit, a reservation before the start, and a worst case for anything unknown. The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

## One unit: UU

The unit is UU. One UU is one US cent of estimated list price. On a subscription nothing is billed per token. UU then says what the same use would cost at list price. A limit therefore means the same on every platform. It is an estimate and not a bill, and the docs say so.

The limits are in `units.yaml`, in whole numbers:

```
per_run                 100
per_day                 500
per_agent_per_day       300
per_platform_per_day    400
unknown_worst_case      100
```

These are placeholders until you calibrate. A day is the logbook date.

## Reserve first

Before an agent starts, after its gate checks pass, umwayi works through these steps in order.

```
validate units.yaml          (bad: 64)
log any change to it first   (cannot: 2)
does per_run fit all three
day limits?                  (no: 3)
ask the rules: budget_check  (No: 2,
                              Ask: 3)
write a reserve entry
start the agent
```

The reservation is the full `per_run` cap, or a lower one you give with `--cap-uu N`. If the reservation does not fit what is left of the day, nothing starts. Exit 3 puts one item in the queue: "Spend up to N UU on agent NAME?" The kill switch and a broken logbook are checked before all of this and still win.

While the run goes on, umwayi checks it against the cap. When the run ends, a settle entry replaces the reservation with what the run used. A run that is killed with SIGKILL leaves its reservation in the ledger at full size. `umwayi budget settle-lost --by NAME` settles it as unknown. The money stays counted until a person looks.

## Three kinds of reading

Every settled cost carries a tag.

- measured: Claude Code reported it.
- declared: you wrote a rate in `units.yaml`, with a date and a source.
- unknown: nobody reported anything.

Unknown never counts as zero. It counts at `unknown_worst_case`. Kiro is the clear example: it sends umwayi nothing, so a Kiro run is whatever `units.yaml` declares, for example a price per run, and if nothing is declared it counts as unknown.

An agent that hides its cost gets charged the most. That keeps the incentive pointed the right way.

## Measuring a run without reading its words

For Claude Code, umwayi starts a small receiver for that run only, on 127.0.0.1 and a free port. It points Claude Code's own telemetry at it with a fresh secret header. Before that, it removes every `OTEL_*` variable you had set, so no export goes anywhere else, and it keeps prompts, responses and tool details switched off.

The receiver keeps counts only: cost, tokens by type, requests and model names. It drops every body. The security scan added limits for a local client that misbehaves:

- every request is cut at 10 seconds, however slowly it arrives
- at most 16 requests at once, and the next one gets a 503 at once
- the run header and the content length each appear exactly once
- a negative cost is invalid on every path, so no report can subtract from a run

A trickling client held a thread without end before the fix, and 200 connections made 202 threads. Both showed up in the scan and not in normal use.

## Limits from data, never from a guess

You can ask umwayi to propose limits with `umwayi budget calibrate`. It needs at least 20 measured runs over at least 7 days. It proposes `per_run` as 1.5 times the 95th percentile of one run, and `per_day` as 2 times the median day. It shows the data and changes nothing. You edit `units.yaml`, and that edit is logged before it is used.

## What is not checked

- I have not compared the receiver with a real Claude Code export. The JSON shape comes from the documentation. The capture is an item on my own list.
- UU is an estimate. A price change at the vendor makes a rate stale until you edit its date and value.
- umwayi cannot read what a Kiro run uses. You declare a price per run, or your own credits per run, and umwayi trusts that number.

## What I took from it

1. Reserve the cap before the work starts. A check after the run reports a loss; a reservation prevents it.
2. Use one unit across tools, so one limit means one thing.
3. Count the unknown at the worst case. A missing number then costs the owner nothing.
4. Settle every run in a record the owner already trusts. Here that record is the logbook, so there is no second ledger.
5. Limits that come from measured runs beat limits that come from a guess, and the tool that proposes them should change nothing.
6. A listener on your own machine needs its own limits: a deadline, a connection cap and a header check.
