---
title: "Stitching a Chimera: Building umwayi-os With Kiro"
date: 2026-11-12
summary: "umwayi-os puts one set of written rules in front of Claude Code, Kiro and OpenCode. Kiro builds it one spec at a time. Here is what exists, what broke, and where it goes next."
draft: true
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
- OpenCode has a plugin and six gate checks. Its chat is not built yet.
- The view is a Three.js hillside with eleven stations, one per part of the system, and a public Next.js site that draws it.
- The core stays standard library Python. Everything else sits outside it.

Four different tools, two languages and a 3D scene, under one set of rules. That is why I entered the Frankenstein category of Kiroween.

## How Kiro builds it

Kiro writes the code. I do not. The work goes in this order.

1. A spec pull request comes first: requirements, a design, and a task list. They live in `.kiro/specs/umwayi-os`, next to a steering file, `.kiro/steering/product.md`.
2. Kiro builds one slice per pull request, in the same session as the slice before it, so slices stack without merge conflicts.
3. A second AI reviews the diff on its own. It does not trust Kiro's report. It reruns checks by hand on a fresh folder.
4. GitHub CI is the record. It runs the whole suite on Python 3.10 to 3.13. The last run counted 1,899 tests on each version.
5. I read the result and merge. Kiro never merges.

The repository started on 2026-11-07. It has had 59 pull requests since.

## What broke

Review caught real mistakes. Two of them:

- A pull request and the task file said the OpenCode starter rules numbered 16. They number 13. I found it by counting the rules in the file, and the fix is recorded in the next pull request.
- Kiro pushed a progress commit with merge conflict markers inside the status log. It had chained the commit after a command that could fail. Kiro found it before the pull request opened, fixed it in a new commit, and wrote the mistake into the pull request description.

Neither would have shown up if I had only read the summary Kiro wrote. Both showed up because something else checked the files.

## Where it goes next

These are plans. None is built.

- A local backend, so the page can send the same request the command line would. It goes through the same rules, logbook and kill switch, so the page can never do more than the terminal.
- One chat for Claude Code, Kiro and OpenCode, and a queue where an intake step asks questions until the intent is clear before it adds a task.
- Goals that a main agent holds and tests. A goal splits into loosely coupled pieces for helper agents, down to tasks small enough for a model to finish without guessing. A different agent tests each piece before it moves up.
- Progress dashboards, so a person can see they are getting better at agentic engineering.

I also want the system to track the practices Kiro lists for frontier engineering, such as giving agents fast feedback and enforcing limits at the boundaries, and show which ones are in place.

## What I took from it

1. Put the check outside the agent. A report from the builder is a claim. A second tool that looks at the files is evidence.
2. Make unclear mean no. A gate that guesses toward yes fails in the cases that matter.
3. Write the spec first and keep slices small. Kiro stays accurate when each slice is one pull request with a clear list of tests.
4. Keep CI as the record. My hand checks find what CI does not, and CI finds what I cannot rerun.
5. Say what is not built. Every pull request lists what was not verified, and this article does the same.
