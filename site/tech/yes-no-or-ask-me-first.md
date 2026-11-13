---
title: "Yes, No or Ask me first: a rules gate that fails closed"
date: 2026-11-13
summary: "Before an AI helper acts, umwayi-os checks the action against rules you wrote and answers Yes, No or Ask me first. Here is why every unclear case answers Ask me first, and how the kill switch and the run lock follow the same idea."
draft: true
illustration: yes-no-or-ask-me-first.svg
illustrationAlt: "Three doors in a row. The left door is green and says yes, the middle door is red and says no, the right door is ochre and says ask me first. A sheep stands at the right door. The shepherd says if unsure, ask."
tags:
  - Engineering
  - Agentic engineering
  - Safety
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, Python, BuildInPublic]
  post: docs/plans/yes-no-or-ask-me-first-linkedin-post.md
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## The problem with a gate that guesses

An AI helper can read files, run shell commands, edit code and call the web. Each of those is an action. Before it acts, something has to decide whether it may.

Most gates have two answers: allow or deny. That leaves a question open. What does the gate do when it cannot tell? A missing rule, a broken config file and a crash all produce the same state: no answer. If the gate treats no answer as allow, every bug becomes a hole. If it treats no answer as deny, every bug blocks work, but nothing unsafe happens.

This is called failing closed. The design question is what "closed" means when a third answer exists.

umwayi-os is a command line, `umwayi`, in Python with the standard library only. Its first layer is a rules gate. The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

## Three answers, three exit codes

You write rules in `rules.yaml`. Each rule has an id, a verdict, and matchers. A check takes an action as JSON and prints one answer.

```
umwayi check '{"type": "payment"}'

No
Rule: no-money
```

The answers map to exit codes, so any script can read them.

```
answer         exit code
-------------  ---------
Yes            0
No             2
Ask me first   3
bad usage      64
```

Exit code 1 is never used by a check. A crash in Python exits with 1 by default. If 1 could mean "refused" in one place and "crashed" in another, a script could not tell them apart. So the gate keeps 1 out of its own vocabulary, and a crash is treated like No.

## Ask me first is the default

The third answer is the important one. It means: stop and put a question to the owner.

These cases all give Ask me first:

- no rule matches the action
- `rules.yaml` is missing or has a syntax error
- the action JSON is malformed
- the rules file is not a regular file of at most 1 MB (a `/dev/zero` link is one example)

Yes is the only answer that needs a rule that says so. Silence never produces it.

## When rules disagree

Several rules can match one action. The gate picks the strictest.

```
No beats Ask me first
Ask me first beats Yes
```

So a broad Yes rule, such as "reading files is fine", cannot override a narrow No rule, such as "never read a path with `.env` in it". The owner can add a No later without checking every Yes rule.

## The log has a say

Every check writes one logbook entry. What if the logbook cannot be written, for example because someone edited it by hand?

```
No  stays No           (exit 2)
Yes becomes Ask me first (exit 3)
```

A refusal needs no record to be safe, so it stands. A Yes needs a record to be accountable, so without one it drops to a question. The reason line says why.

## Yes that expires

A Yes rule can carry a `review_by` date. The rule is in force through that day. From the next day it counts as an Ask me first rule, in every caller, and the file is not edited. The check uses the latest of the system date, the `--date` flag and the newest date in the logbook, so setting the clock back does not revive a rule. The entry says which rules lapsed.

A Yes you wrote in a hurry will turn into a question by itself.

## The kill switch and the run lock

Two more pieces use the same logic.

The kill switch is a file, `.umwayi/KILL`. While it exists, every helper, job and workflow stops before it does anything, with exit 3 and one logbook entry. If umwayi cannot tell whether the file exists, for example because `.umwayi` is not a normal folder, it stops too. `kill on` works even when the logbook is broken. `kill off` keeps the switch on if the logbook cannot record the change.

The run lock, `.umwayi/run.lock`, lets one helper, job or workflow run at a time. A second one does not wait. It answers Ask me first, writes one entry and changes nothing. A waiting process can pile up behind a stuck one. A refusal costs nothing. If locking is not available on the machine, every run answers Ask me first.

## What the gate does not do

I listed these limits in the repo, and I repeat them here.

- Matching is plain text, not a shell parser. A command can be written to slip past a text match. The real guard is that every shell command is Ask me first. Keep hard limits in the platform's own deny rules too.
- The kill switch file can be removed by anyone with write access.
- Some Kiro hook field names are not confirmed by Kiro's docs. If they differ, a Kiro call is still Ask me first, except reads.

## What I took from it

1. Decide the answer for "I cannot tell" before you write any rule. Make it the safe one, and make Yes the only answer that needs a rule.
2. Three answers beat two. "Stop and ask" is a different outcome from "no", and the owner needs both.
3. When rules disagree, the strictest wins, so adding a restriction never needs a review of the permissions.
4. A permission without a record becomes a question. A refusal stays a refusal.
5. Approvals should expire. A date on a Yes rule does that without anyone remembering to remove it.
6. Keep one exit code out of the vocabulary, so a crash cannot look like a decision.
