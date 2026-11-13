---
title: "A record that checks its form and never claims it is true: 111 concerns and four stall checks"
date: 2026-11-13
summary: "umwayi-os keeps a record of 111 engineering concerns and four checks for stuck builders. Each one proves that an honest answer exists and is well formed, and says plainly that it cannot prove the answer is right."
draft: true
illustration: a-record-that-checks-form-not-truth.svg
illustrationAlt: "A table with three stamped columns labelled applies, not applicable and deferred. One row has a small file icon pointing at a real file. A magnifier hovers over the table and a note says form checked, truth not checked. The shepherd says I check the form."
tags:
  - Engineering
  - Testing
  - Process
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, SoftwareTesting, Python, BuildInPublic]
  post: docs/plans/a-record-that-checks-form-not-truth-linkedin-post.md
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## Engineering concerns you skip without noticing

A project needs rate limits, timeouts, backups, caching rules, postmortems and about a hundred other things. Most of them are never decided. They are skipped because nobody looked at them, and the project finds out in an outage.

I keep a list of 111 engineering concepts. For each project the rule is: look at every one on purpose and write down the answer. umwayi-os has a command that checks the record, `umwayi concerns check PATH`. The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

## One row for every number

The record is a Markdown table with six columns: number, concept, answer, reason, evidence and date. There are exactly 111 rows, numbered 1 to 111, and each answer is one of three words.

- Applies: this concern is real for the project.
- Not applicable: it is not, and the reason says why.
- Deferred: it is real, and it is not done yet.

Every row needs a reason of at least one real sentence. An Applies row also needs evidence: a path to a regular file that exists inside the repository. The path is checked hard. A path with `..`, an absolute path, a backslash, a colon, a control character, or a link that leads out of the repository is refused.

The command fails on a missing or duplicate number, a concept name that is not the fixed name for that number, an answer in the wrong words, an empty reason, a bad date, and evidence that does not exist. It prints one line for each failure to standard error, exits 2 if there is any, and never changes a file.

For umwayi-os the first honest pass gave 18 rows Applies, 69 Not applicable and 24 Deferred. The Deferred rows are the point. They are the work I now know about.

## What the check cannot do

It cannot tell whether "Not applicable" is true. It cannot tell whether the evidence file really handles the concern. A file that exists can still be empty of the idea.

So I do two things. The code checks the form and says so in its first line. And I mark which rows I am least sure of, for the owner to read. The first pass left ten rows with the least confidence, and they are on my own review list.

This limit is stated in the code's own docstring: the code checks that a record exists and is well formed, and it never claims the content is true. A check that claims more than it can know teaches the reader to trust it too much.

## The same idea for ten practices

A second record lists ten frontier engineering practices against what the repository does. It is the builder's reading, for the owner to review. A test checks the form and that the evidence exists. It does not check that the practice is followed.

## Four checks for a stuck builder

Three failures cost me time when I ran builders in parallel.

- A builder waited for an approval nobody saw.
- A builder retried the same error without learning.
- A status said "connected" and told me nothing.

`umwayi stalls check EVENTS.json` turns these into four small checks over a list of builder events. It only reads a file and prints findings. It never stops a builder and never answers an approval.

```
STALL  running, no push and no real
       event for 30 minutes or more
STOP   the same error twice in a row
       (same signature)
NO     an approval with no answer by
       its deadline counts as No
REFUSED a status with no last event time
```

Details that matter:

- Output, polling, waiting, and a fingerprint that did not change do not count as progress. Only a push, a state change or a real event resets the timer.
- An error is recorded by a signature, a 16 character hex value, and never by its text. The check never repeats file text.
- An answer that arrives after the deadline is still No. Silence and late answers are never Yes.
- Any finding gives exit 3, Ask me first. A malformed file gives exit 2. The command never exits with 1.
- The command reads the system clock once. The functions take the time as an argument, so the tests can inject it.

It runs when I run it. It is on no schedule, because a check that only reports should be read by a person.

## What I took from it

1. A list of concerns you look at on purpose finds more than a list you remember.
2. Three honest answers beat two. "Deferred" is the answer that shows the work left.
3. Ask for evidence the machine can find, such as a file path, and refuse any path that can lead outside the repository.
4. Say in the tool what it does not prove. A checker that claims truth teaches people to stop reading.
5. Mark the answers you are least sure of, and put them in front of the owner.
6. Put a time on every status, and count as progress only what changed the work.
