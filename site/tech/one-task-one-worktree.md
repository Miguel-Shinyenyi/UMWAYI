---
title: "One task, one worktree: how umwayi-os keeps parallel AI builders apart"
date: 2026-11-13
summary: "Several AI builders in one checkout overwrite each other. umwayi-os gives each task its own git worktree, accepts only a path it made, and runs git from a fixed list of argument lists. Here is the design, and what is built so far."
draft: true
illustration: one-task-one-worktree.svg
illustrationAlt: "Three separate folders side by side, each with its own branch label, and a sheep standing in each. A fourth folder, drawn with a dashed line and labelled the owner's copy, stands apart with no sheep. The shepherd says each task gets its own folder."
tags:
  - Engineering
  - Git
  - Agentic engineering
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, Python, BuildInPublic]
  post: docs/plans/one-task-one-worktree-linkedin-post.md
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## The problem with one checkout

I build umwayi-os with several AI builders at the same time. Each builder works on one task. If two of them work in the same folder, they share one set of files and one git index. One builder's half finished edit shows up in the other's test run. One builder switches branches while the other is writing.

The fix is old and plain: give each task its own copy of the repository. Git has a command for it, `git worktree add`. A worktree is a second folder with its own branch, checked out from the same repository. It shares the history and the `.git` data, and it has its own files and its own index.

I run my own builders this way by hand. The goal orchestration part of umwayi-os, `umwayi goal`, does the same thing in code. The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

## The design

`umwayi goal` takes one goal in plain words. It splits the goal into small task packets. It runs each packet through its own gate with a builder and a different tester, and it reports. The owner approves the plan and merges the result. The system never merges.

```
owner   gives the goal, approves,
        merges
guide   splits the goal, checks each
        result, writes nothing
builder does one task on its own branch
tester  checks the acceptance checks,
        never the builder, changes
        nothing
umwayi  every check a program can do
```

For each task, umwayi makes a worktree and a branch such as `umwayi/g-0007-t-02`, from the local main as it is at that moment. The folder sits next to the repository, for example `umwayi-os-worktrees/g-0007-t-02`. The builder runs there, then the tester, then the guide's check, each as a fresh session.

Rules that follow from this:

- The owner's own working copy is never touched.
- A start is stopped by a leftover or a dirty worktree, and by a local main that is behind `origin/main`.
- A worktree is removed only after the owner has merged. It is never removed with force, and its branch is kept.
- A failed or stopped task keeps its worktree until the owner removes it.
- At most eight worktrees exist under the root.

## A path is only accepted if umwayi made it

The new option is `--workdir PATH` on `umwayi agent run` and `umwayi agent check`. It would be easy to accept any folder. That would let a helper be pointed at any place on the disk.

So the check proves where the folder came from, by looking at the folder, not by trusting a record.

```
path
  |
  v
exactly <root>-worktrees/g-0007-t-02 ?
a real folder, not a link?
root folder mode 0700, owned by you?
toplevel of that folder is itself?
git common dir is the root repo's?
  |
  +-- any no: usage error, exit 64
  |
  v
accepted, and the agent's working
folder rule still applies
```

A bad path gets a fixed sentence that does not echo the path back. With no option the run behaves as before, and a test pins that with output recorded from the old code.

I wrote one limit in the repo. "Made by umwayi" is proven by place and not by a record. A person who makes a worktree by hand under that exact name would pass. The check also looks at the folder at one moment, so a folder swapped between the check and the start is not seen.

## Git from a fixed list, never a shell

One module, `goalgit.py`, is the only place where git starts for a goal. It holds the whole list of 18 argument lists. Every list begins with the same words:

```
git -c core.hooksPath=/dev/null
    -c core.fsmonitor=false
    -C DIR  ...
```

and runs with a clean environment, 20 seconds and 1 MB of output.

- No shell. Arguments are a list, so there is nothing to quote wrong.
- No hooks and no filesystem monitor can run, because both are switched off in the list itself.
- Three writes exist: `worktree add -b`, `worktree add --detach` and `worktree remove`. Each appears once.
- No list contains push, merge, rebase, pull, fetch, reset, clean, checkout, switch, branch, tag, stash, commit, prune, lock, move, repair, `--force` or `-f`.
- A name that enters a list must match a fixed pattern first. Nothing reads a name from text.

A test reads the source and fails if a forbidden word appears in the list. An existing test in the repo used to say that only two modules may start a program. I changed it to three, and I put the reason in the pull request.

## What is built

I merged the part that matters first.

- Built: the worktree functions, the path check and the two `--workdir` options. The tests use real git in temporary folders.
- Not built yet: the supervisor that starts a builder inside a worktree, and the `umwayi goal` commands that run a whole goal. These come after the Kiroween freeze.

## What I do not know yet

- The 20 second git limit may be too short for a very large repository. If it runs out, a half made folder or branch can be left, and the next start of that task stops as a leftover until I remove it by hand.
- `--workdir` sets the working folder. It does not confine the helper. A helper's tools can still read and write wherever its rules allow, and the `.git` data is shared.
- I tested with the system git on Linux only. Windows paths, a case insensitive file system and a git older than 2.17 were not tried.

## What I took from it

1. Give every parallel worker its own copy of the files and its own branch. Shared files are where parallel work breaks.
2. Accept a path only after you check where it came from. Do not accept a path because someone passed it.
3. Run git as a list of fixed argument lists, with hooks off. Put the list in one module and test the source for words that must not appear.
4. Never remove work automatically. Remove a worktree only after a person has merged, and keep the branch.
5. Say what a limit does not cover. A working folder is not a sandbox.
6. Build the part that carries the risk first, and merge it alone.
