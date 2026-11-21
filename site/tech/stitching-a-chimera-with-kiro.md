---
title: "Stitching a Chimera: Building umwayi-os With Kiro"
date: 2026-11-12
summary: "umwayi-os puts one set of written rules in front of Claude Code, Kiro and OpenCode. Kiro builds it one spec at a time. Here is what exists, what broke, and where it goes next."
draft: false
tags:
  - AI
  - Kiro
  - Agentic engineering
  - Hackathon
linkedin:
  post: docs/plans/kiroween-linkedin-post.md
  hashtags: [Kiroween, AgenticEngineering]
  mentions:
    - name: Amazon Web Services
      urn: 'urn:li:organization:2382910'
      url: 'https://www.linkedin.com/company/amazon-web-services/'
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## What I am building

umwayi-os is an operating system for one person and their AI helpers. It is a command line, `umwayi`, and a folder of plain files. It is written in Python with the standard library only, and the code is public on GitHub.

I am writing this post as part of the Kiroween 2026 hackathon.

Its job is small to say. Before any AI helper acts, umwayi checks the action against rules the owner wrote. Every check ends in one of three answers: Yes (exit code 0), No (2) or Ask me first (3). If anything is unclear, the answer is Ask me first or No. It never guesses toward Yes.

Every decision is written to a logbook. Each entry carries the hash of the one before it, so an edited entry breaks the chain and the check says so. A kill switch stops every helper and job. A budget governor counts spend in one unit across tools.

## Why it is a chimera

I did not build a new agent. I put one gate in front of agents that already exist.

- Claude Code and Kiro start through `umwayi agent`, with a hook in front of every tool call. Both can chat through it over ACP.
- OpenCode has a plugin and six gate checks, and its chat is built. A first real chat ran on Nov 15 on its free route.
- The view is a Three.js hillside with eleven stations, one per part of the system, and a public Next.js site that draws it.
- The core stays standard library Python. Everything else sits outside it.

Four different tools, two languages and a 3D scene, under one set of rules. That is why I entered the Frankenstein category of Kiroween.

## How Kiro builds it

Kiro writes the code. I do not. The work goes in this order.

1. A spec pull request comes first: requirements, a design, and a task list. They live in `.kiro/specs/umwayi-os`, next to a steering file, `.kiro/steering/product.md`.
2. Kiro builds one task per pull request. Each task gets its own session and its own browser tab, and the session merges the newest main into its branch before every push.
3. A second AI, which I call the guide, reviews the diff on its own. It does not trust Kiro's report. It reads the code, scans the diff, and for risky code runs a live check by hand. It does not rerun the whole suite.
4. GitHub CI is the record. A pull request runs the suite on Python 3.10 and 3.13, and every push to main runs it on 3.10 to 3.13. On Nov 15 the count is 3,763 Python tests.
5. Kiro never merges. Until Nov 13 I made every merge myself. Since then the guide merges a pull request that passes its own review with green CI and no conflicts. I still give the word for any change to a safety rule, to what an existing test means, or to anything that raises a question for me.

So the roles are fixed: the guide holds the plan and reviews, I decide, and Kiro sessions build. The repository started on 2026-11-07. Its pull request numbers have reached 108.

## What broke

Review caught real mistakes. Two of them:

- A pull request and the task file said the OpenCode starter rules numbered 16. They number 13. I found it by counting the rules in the file, and the fix is recorded in the next pull request.
- Kiro pushed a progress commit with merge conflict markers inside the status log. It had chained the commit after a command that could fail. Kiro found it before the pull request opened, fixed it in a new commit, and wrote the mistake into the pull request description.

Neither would have shown up if I had only read the summary Kiro wrote. Both showed up because something else checked the files.

Running several sessions at once broke other things, and I keep a log of them:

- Parallel sessions all edited the same status and limits files, so almost every pull request opened with a merge conflict. One pull request opened conflicting because another merged while it was open. The fixes are a rule that every session merges main before it pushes, and a task that splits those files into one part per task and builds them by script.
- Messages to a Kiro session can vanish if the sandbox is waking or if the page layout shifts under the send button. I confirm each message with a screenshot.
- Opening a session in a tab reloads its sandbox, so each session keeps its own tab. Closing one tab once dropped my whole browser tab group.
- CI took about 24 minutes on every pull request, even for a change that could not affect most tests. CI now maps tests to paths, runs only what a change can affect, shards the rest, and adds a final check that every test still ran. A typical full run takes about 12 minutes.
- Some tests used a fixed date. The logbook refuses a date earlier than its last entry, so main went red at midnight UTC on Nov 14. The tests now use the date of the day they run.
- The working rules lived in my messages, so a new session did not know them. They are moving into a steering file in the repository, which Kiro reads in every session. A steering file is advice, so the checks that matter stay in code.

## Where it goes next

Some of this is built and some is a plan. I say which.

- A local backend, so the page can send the same request the command line would. It is built and merged: it binds only to the local machine, needs a token, and goes through the same rules, logbook and kill switch. The page cannot turn the kill switch off. The page client is merged too.
- One chat for Claude Code, Kiro and OpenCode, and a queue where an intake step asks questions until the intent is clear before it adds a task.
- Goals that a main agent holds and tests. This is built and merged as of Nov 15: the `umwayi goal` commands, a supervisor, and one git worktree per task with a fresh session. A different agent tests each task before it moves up. It is tested with fake agents in 16 whole-system scenarios. A real goal run from start to end is still on my own list.
- A goal map page that draws one goal as a mind map, with a small Halloween theme for Kiroween. It is merged and reads a file for now. The live read from the local backend is being built.
- Progress dashboards, so a person can see they are getting better at agentic engineering. A first read-only progress page is merged.

I also want the system to carry the working rules and the practices Kiro lists for frontier engineering, such as giving agents fast feedback and enforcing limits at the boundaries. The first part is built: a checked guidance file with 31 entries, each pinned to its source line by a hash. Rules that code can check, such as a question without a recommendation or a branch behind main, are to be enforced at the gates. The rest are put into the prompts and checked by the tester. How much of the file the goal flow loads is something I still have to check.

I also say what this is not. It is a governing layer for AI agents, not a full operating system. It is not a sandbox: it does not stop a process that never asks it. Real runs with Claude Code, OpenCode and Kiro happened once each on Nov 15, on one machine.

## What I took from it

1. Put the check outside the agent. A report from the builder is a claim. A second tool that looks at the files is evidence.
2. Make unclear mean no. A gate that guesses toward yes fails in the cases that matter.
3. Write the spec first and keep slices small. Kiro stays accurate when each slice is one pull request with a clear list of tests.
4. Keep CI as the record. My hand checks find what CI does not, and CI finds what I cannot rerun.
5. Say what is not built. Every pull request lists what was not verified, and this article does the same.
6. Put the rules where the builder reads them, and the enforcement where the builder cannot skip it. A rule in a chat message reaches one session. A rule in the repository reaches every session, and a rule in code cannot be ignored.
