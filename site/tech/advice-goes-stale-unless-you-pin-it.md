---
title: "Advice goes stale unless you pin it to its source: a hash-checked rules library"
date: 2026-11-13
summary: "umwayi-os keeps its guidance for AI builders in one file. Each entry is marked enforce, advise or owner, has a priority tier, and carries the hash of the line it came from. If that line changes, the loader stops. Here is why, and where the design goes next."
draft: true
illustration: advice-goes-stale-unless-you-pin-it.svg
illustrationAlt: "A rule card pinned to a page with a small hash tag. The page has one line edited, the tag no longer matches, and a stop sign sits beside it. A sheep reads the card. The shepherd says if the source changes, stop and ask."
tags:
  - Engineering
  - Process
  - Agentic engineering
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, Python, BuildInPublic]
  post: docs/plans/advice-goes-stale-unless-you-pin-it-linkedin-post.md
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## Rules are copied, and copies drift

I have rules for how AI builders work on my projects. They live in documents: a steering file that Kiro reads, notes about how to verify work, a list of my own standing decisions. When I build a tool that runs a goal through builders, the tool needs those rules too.

The easy way is to copy the rules into the tool. Then there are two versions. I edit the document, and the tool keeps enforcing the old sentence. Nobody sees the difference until a builder does something the new rule forbids, or is blocked by a rule I deleted.

umwayi-os has one file for this, `guidance.yaml`. It does three things: it sorts each rule into a kind, ranks it by tier, and pins it to its source with a hash. The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

## Three kinds of entry

- `enforce`: umwayi checks the rule in code, with a registered check function, and refuses a task that breaks it.
- `advise`: one line that goes into a helper's prompt. Nothing is checked.
- `owner`: for the owner only. Nothing is checked and nothing goes into a prompt.

The file today has 31 entries: 4 enforce, 26 advise and 1 owner.

The split is honest about what code can do. "A task states its goal in one sentence" is a rule a program can check: the sentence is there or it is not. "Before you change anything, write down what is true now" is advice. A program cannot tell whether a builder did it. Calling it enforce would claim a check that does not exist.

The code checks that a record exists and is well formed. It never claims that the content is true.

## Six tiers, lower number wins

Every entry has a tier from 1 to 6.

```
1  safety: the gate, the kill
   switch, fail closed
2  owner decisions, standing rules
3  hard rules of my notes
4  builder rules
5  practices
6  advisory prompt lines
```

When two entries disagree, the lower number wins. An entry can list `overrides`, the ids of other entries it replaces. A lower tier may never relax a higher one. An entry whose `overrides` names a higher tier, an unknown id, itself or the same id twice is refused when the file loads.

## The pin: a hash of the source line

Here is one entry.

```yaml
- id: one-open-pr-per-task
  source_repo: umwayi-os
  source: ".kiro/steering/builder-workflow.md#1"
  text: "A task has at most one open pull request."
  kind: enforce
  check: one_open_pr
  applies_to: pr
  tier: 4
  source_hash: "4acf14..."
```

`source` names a file and a numbered rule. `source_hash` is the SHA-256 of that one line, with trailing spaces removed. The loader reads the file, finds the numbered line and hashes it.

```
load guidance.yaml
   |
   v
find the source line
   |
   +-- not found, or on two lines
   +-- hash differs
   |      -> Ask me first (exit 3)
   v
all match: use the file
```

If someone edits the line, moves it to another number or deletes it, the hash does not match and the loader stops with exit 3. Ask me first. Nobody has to re-hash by hand without reading the change. A helper function prints the new value, and the instruction in the file is plain: read the change in the source first, then ask the owner.

The failure messages are fixed words. They never carry text from `guidance.yaml` or from the source file, so a source that someone poisoned cannot put its own words into a helper's output.

Two kinds of failure are separate. A file that is missing, a source that changed or a source that cannot be found is exit 3: stop and ask. A file that is malformed, for example an unknown kind or an `enforce` entry with no registered check, is exit 64, a config error.

## Sources I do not copy

Some of my rules live in a second, private repository. The loader never reads it. For those entries, `source_hash` is the hash of the whole file as I recorded it. A separate command, `umwayi guidance verify --hub PATH`, compares the hash with the real file and gives Ask me first on a mismatch. Until it has run in the same session, `umwayi guidance list` shows those entries as unverified. The public repository holds the pointer and the fingerprint, and not the private text.

## Where this goes next

This part is not built yet, and I record it as a design. The library should work in two layers.

- My rules are the base library. Everyone who uses umwayi-os gets them, on by default. A user can only switch an entry off or on.
- Tiers 1 and 2 are locked on, because they are safety and standing decisions. Tiers 3 to 6 can be toggled.
- A user's own rules live in a separate per-user file under the user's control.
- If an AI notices that a user's rule works well, it can tell me, as text, with the user's consent and with how often the rule fired. I decide whether it enters the base library, and I edit the library and re-hash it myself.

The data for that decision will come from the logbook, through an exporter that reads only the logbook. That exporter waits for the goal commands to exist.

## What I took from it

1. A copy of a rule is a second rule. Point at the source, and make the pointer fail when the source changes.
2. Hash one line, not a whole document, so a change elsewhere does not stop the work and a change to the rule always does.
3. Label each rule by what a program can do with it: check, show or only record. Do not call advice a check.
4. Never refresh a hash automatically. A person reads the change first.
5. Rank rules, and forbid a lower tier from relaxing a higher one.
6. Error messages should never repeat text from the files they check.
