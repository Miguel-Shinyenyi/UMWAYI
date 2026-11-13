---
title: "Trust you can take back: reopening decisions, petitions and graded autonomy"
date: 2026-11-13
summary: "A system that asks you the same question for the hundredth time gets ignored. A system that stops asking without limits gets dangerous. umwayi-os lets trust grow from your own record, and lets you take it back without rewriting history."
draft: true
illustration: trust-you-can-take-back.svg
illustrationAlt: "A dial with three marks labelled ask, yes and no, with the pointer on ask. Beside it, a short list of gates with check marks, and a lock icon on the no mark. A sheep sits at the base of the dial. The shepherd says only up from ask, never from no."
tags:
  - Engineering
  - Agentic engineering
  - Safety
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, Python, BuildInPublic]
  post: docs/plans/trust-you-can-take-back-linkedin-post.md
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## Two ways a gate fails

A rules gate that answers Ask me first for every action has one failure: you stop reading the questions. By the hundredth identical question, you approve without looking.

A gate that learns to say Yes on its own has a different failure. It can keep saying Yes after the situation changed.

umwayi-os has a layer for this, built in five slices. It lets trust build from the owner's own record, it puts an expiry on every approval, and it never removes anything from the record. The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

## What never changes

Four rules hold across the whole layer. The docs state them for every slice.

- A No is never changed by anything in the layer.
- Every part moves only toward Ask me first. The one exception is graded autonomy, and it can move only from Ask me first to Yes.
- Any input that is missing, malformed or unreadable gives Ask me first, or a refusal with nothing changed.
- Every change is one logbook entry. No part edits, deletes or marks an existing entry.

## Reopening a decision

An answered decision can turn out wrong. The tempting fix is to edit the old answer. That erases the evidence of what you believed then.

```
umwayi decision reopen Q-0007 \
  --reason TEXT --by NAME
```

The command appends one new entry that says it is a reopen and names the old entry by its full hash. The old entry and the old row stay as they were. A new open decision, "Reopen decision Q-0007", appears in the queue in the same commit as the entry, both or neither.

When you answer a decision you must also say what would change your mind: `--revisit-if TEXT` or `--revisit-if none`. The text is stored in the logbook entry of the answer, not in `queue.md`, so it cannot be edited later. A reopen shows it again. Nothing watches for that condition. It is a note for the person who reopens.

Each closing entry can be reopened at most once, so a chain of reopens can be followed by hash from the newest back to the first.

## Petitions: an AI helper can object but not decide

A helper may think a No is wrong. `umwayi petition RULE_ID` lets it say so.

- The petition becomes one open decision in the queue. The title holds only the rule id and the helper name, both checked, so it holds no free text.
- It never changes the verdict. `rules.yaml` is not written, before or after any number of petitions, and not after the owner answers them. Only the owner editing the rules changes a rule.
- Only a rule with the verdict No can be petitioned.
- The reason is untrusted text. It is shown in the queue under a label that says so. It is not copied into the logbook, which holds only its length, and no code reads it.
- Spam limits come from the queue and the logbook, not from the command line: one open petition per helper and rule, 3 open per helper, 10 open in all, 5 accepted a day per helper and 10 a day in all.

Every rules change is logged before it is used, as an entry with the hash, the counts and the changed ids, verdicts and dates. It never holds rule text. If that entry cannot be written, every Yes from the new rules becomes Ask me first and a No stays a No. A weakened rule takes effect at once and is visible in the logbook.

## Graded autonomy

This part is off by default. Without an `autonomy.yaml`, or with `enabled: false`, nothing changes and a check gives the bytes it gave before the layer existed.

When it is on, a check that would give Ask me first may give Yes. Only that. A No stays a No, a Yes stays a Yes, and no matching rule stays Ask me first.

A rule must opt in. An Ask rule carries an `autonomy` field with a class, whether the action is reversible, and its cost in UU. Rules about payment, transfers, publishing, posting, sending, scheduling and starting an agent can never opt in. They are on a fixed never list.

The owner builds the record. `umwayi autonomy record` writes one chained entry with an outcome: approved as proposed, edited, rejected or reverted. Only chained entries of that command are read. One malformed entry makes the whole record invalid, and no class moves anywhere until the owner restores the logbook.

The score is the lower bound of the Wilson interval, in per mille, over a window of recent days. The Wilson interval is a way to estimate a rate from few samples without overstating it. With 3 approvals in 3 tries the plain rate is 100 percent, and the lower bound of the interval is much lower. The score only climbs as the record grows.

- Approved as proposed counts as a success.
- Edited, rejected and reverted count as failures. A revert counts several times, by a weight the owner sets.
- Few records give a low score.
- Its own moves never feed it. Only an outcome the owner records counts.

The score never reads text. It reads the class word, the outcome word and the date. A queue title, an answer, a reason or a rule title cannot change it.

Then 13 gates run in order, and the first one that fails leaves the answer at Ask me first. Its word is written at the end of the check's entry. Some of the gates: settings invalid, kill switch on, chain broken, inputs invalid, a lapsed election, no opt in, a class mismatch, irreversible action, cost above the limit, a cooldown after a failure, too little data, a low score, and a daily cap on moves.

Every move is logged with its inputs: the class, the four counts, the weight, the score and thresholds, the declared reversibility and cost, and the moves of the day. If that entry cannot be written, the answer stays Ask me first. Turning it off takes effect at the next check. A move already made is not undone. If it was wrong, the owner records `reverted`.

## What I have not tested

- It is off by default, and every threshold is a setting you choose. I have not tuned them on real use.
- The whole layer depends on the hash chain. Without it, graded autonomy cannot move anything.

## What I took from it

1. Let trust come from your own recorded outcomes, and let it move in one direction only, from asking to allowing.
2. Put every refusal out of reach of the learning part. A No should not be negotiable by a score.
3. Never edit history. A correction is a new entry that points at the old one.
4. Ask for the condition that would change your mind when you decide, and store it where it cannot be edited.
5. Use an interval that is wide when the data is thin, so a short run of approvals does not look like trust.
6. Log the first gate that stopped a move, so you can see why trust did not grow.
