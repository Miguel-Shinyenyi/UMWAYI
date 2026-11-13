---
title: "A logbook that shows when it was edited: crash safety and a hash chain"
date: 2026-11-13
summary: "umwayi-os writes every change into an append only logbook. It cannot stop you from editing that file, but it can tell you that someone did, and it survives a power cut half way through a write. Here is how."
draft: true
illustration: a-logbook-that-shows-when-it-was-edited.svg
illustrationAlt: "An open logbook with a row of linked blocks along the bottom, each block holding the fingerprint of the one before it. One block is cracked and a sheep stands on it. The shepherd says an edit breaks the chain."
tags:
  - Engineering
  - Security
  - Reliability
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, Python, SoftwareTesting, BuildInPublic]
  post: docs/plans/a-logbook-that-shows-when-it-was-edited-linkedin-post.md
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## What a logbook is for

umwayi-os keeps a file called `LOGBOOK.md`. Every command that changes something adds one entry: the source command, what was added, what was checked and what was not done. The rules gate writes one entry for every check. The budget governor writes its ledger into it. A reopened decision is a new entry that points at the old one.

If an AI helper can run commands on your machine, the logbook is how you find out what happened. That raises two questions. What if the file is edited? And what if the machine loses power while umwayi is writing to it?

The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

## Detect, not prevent

I cannot stop a user or a helper with write access from editing a text file. So the goal is smaller: an edit must be visible, and umwayi must stop writing until the owner has looked.

There are two mechanisms. The first is a whole file fingerprint. The second is a hash chain.

## Step 1: a fingerprint of the whole file

After every write, umwayi records the SHA-256 of the whole file in `.umwayi/logbook.sha256`. Before every write, it computes the hash again and compares.

```
before a write
   |
   v
hash LOGBOOK.md
   |
   v
same as .umwayi/logbook.sha256?
   |
   +-- no: refuse every write
   |       (a check answers Ask me
   |        first, exit 3)
   v
yes: append, record the new hash
```

If you edit, delete or add a line by hand, every write is refused until you look at the file and run `umwayi logbook seal`. Sealing is a decision by a person. Nothing seals automatically, and a logbook that has no record at all is refused the same way.

The fingerprint catches an edit. It does not say which entry changed, and whoever edits the logbook can also edit the fingerprint file. That is why there is a second mechanism.

## Step 2: each entry carries the hash of the one before

From a chosen point, every entry gets a fifth line: `- Chain: HEX`. The value is the SHA-256 of the previous value, a newline, and the entry's own lines.

```
entry 1  -> chain = H(seed, entry 1)
entry 2  -> chain = H(chain 1, entry 2)
entry 3  -> chain = H(chain 2, entry 3)
```

To change entry 2 without being noticed, you must also recompute the chain for entry 2, 3 and every later entry. `umwayi logbook verify` recomputes the chain from the top. It names the first broken entry by number and line. It catches an edit, a deleted entry and two entries swapped.

A broken chain is serious. It refuses every write and every job, workflow and helper start, and it cannot be sealed away. You restore the logbook from a copy you trust, for example git.

## Step 3: a copy outside the machine

Someone with write access could rewrite the whole chain from the first changed entry to the end. The chain would then verify. To catch that, `umwayi logbook anchor` prints two values: the number of chained entries and the newest chain value, for example `42:9f2c...`. You keep that line somewhere the machine cannot reach, such as a note in a different repository. Later, `verify --anchor 42:9f2c...` finds a rewritten history and a cut tail.

The docs say to do this weekly and before each submission. The anchor protects only as much as the place you keep it.

## A power cut in the middle of a write

The other danger is accidental. A write can stop half way.

Before it appends, umwayi writes its intent into `.umwayi/logbook.pending`: the hash and length before, the hash and length after, and the exact bytes. Then it appends.

- A SIGTERM, SIGHUP, Ctrl-C or SIGQUIT waits until the write is done.
- After a SIGKILL or a crash, the next write reads the intent. It finishes or drops the interrupted write, but only when the files are exactly in one of the two states the intent names. Any other state is refused.
- A power cut can leave the start of an entry at the end of the file. This is a torn tail. umwayi refuses it and never repairs it by itself. `umwayi logbook recover --torn-tail --by NAME` cuts it back, only when the extra bytes are exactly the start of the entry that was being written, and it logs the cut.

A lock, `.umwayi/logbook.lock`, stops two commands from writing at the same time. It is a kernel lock, so a command that is killed lets go of it and nothing is left behind.

## Saying that something exists without saying what it is

Two small rules run through this layer, and the memory layer uses the same one.

- `verify` prints a line number for each problem. It never prints the line.
- The rules gate never writes the action JSON into the log. It writes the rule id and the answer.
- The memory bundle for a helper leaves out the paths you marked private and prints only how many it left out, never the names.

A log that copies sensitive text becomes a second place to protect.

## What this does not do

- The chain proves that history changed. It does not prove that the entries were true when written.
- Without an anchor kept elsewhere, a full rewrite of the chain verifies.
- The full list of limits is in KNOWN-LIMITS of the repo, items 3 and 104 to 109.

## What I took from it

1. When you cannot prevent an edit, make it detectable and stop writing until a person looks.
2. A hash of each entry plus the hash before it makes order and content checkable, and one edit forces every later entry to change.
3. Keep the newest chain value outside the system it protects.
4. Write the intent before the action, so a crash leaves a state you can name.
5. Refuse a torn file and repair it only by a command a person runs, and log the repair.
6. A record should say that something happened without copying the sensitive text of what happened.
