---
title: A Folder Is Not a Brain Until You Measure It
date: 2026-10-27T00:00:00.000Z
summary: >-
  I built a folder of rules, identity and memory for an AI and hoped it would
  act on what I mean. Then I read the studies. Here is what they say, where my
  memory comparison fails, and the test I will run.
draft: true
tags:
  - AI
  - Agents
  - Memory
  - Evaluation
illustration: a-folder-is-not-a-brain-until-you-measure-it.svg
illustrationAlt: >-
  A board lists three rows: core, archive and test. The test row is highlighted.
  A sheep tagged AI waits on the left and the shepherd on the right says
  measure it.
---

## What I wanted

I wanted an AI that acts on what I mean, not on the first reading of my words. I wanted it steady and quiet when I am rushing.

So I built a folder. It holds a short identity, rules that came from mistakes, a habit of understanding a problem before solving it, and an archive. I called it a brain. I thought of the archive as childhood memory: vague, but still part of who I am.

That was a belief, not a result. This article is what happened when I checked it.

## What the studies say about eager AI

Eager execution is measured now. I did not need to argue it.

- One benchmark ran about 7,500 coding-agent runs on tasks where doing extra was wrong. The mean rate of out-of-scope actions was 10.8%. The same base model ranged from 1.1% to 27.7% depending on the tool wrapped around it.
- Another benchmark gave agents underspecified infrastructure instructions. Between 55.8% and 67.8% of the runs that acted crossed a boundary.
- A third paper added a second agent that watches for missing context and forces a question. Resolve rate rose from 61.2% to 69.4%. Cost per task rose from $2.03 to $3.50. The user in that test was simulated.

Eager execution is real, large, and depends on the harness as much as the model.

## What the studies say about folders like mine

A 2026 study tested repository context files, the AGENTS.md kind, on coding agents.

- Files written by a model lowered success by 0.5% to 2%.
- Files written by a developer raised success by about 4%.
- Both kinds raised reasoning tokens by 14% to 22%.

The agents obeyed the files. The files that restated what the repository already said did not help. This matters to me. A model drafts much of my hub. A file I never read closely can cost more than it gives.

On identity, persona research finds drift. One study saw a model leave its system prompt within eight rounds. Another ran more than 100 rounds and saw personas revert toward the model's default. Larger models drifted less, and none stayed fixed.

## What others already built

My design is not new. Letta, which grew out of MemGPT, splits in-context core memory from archival memory. It also runs a second agent that rewrites memory while the first one is idle. Anthropic's memory tool gives the model a directory of files it can read and write. A 2026 survey of agent memory says forgetting is rarely tested and warns of memory blindness, where an important fact sits in cold storage and is never fetched.

If I claim a new architecture, I am wrong. If I claim a measured result on one open model, I can be right.

## Where my human memory comparison fails

Some of it holds. A small core that is always loaded, plus a store reached by cues, is a sensible answer to limited working capacity. One review of memory research describes detailed episodes turning into gist-like versions over time. Another line of work says gist and exact detail are stored in parallel.

Three parts do not hold.

- A person's early experience keeps shaping them because the brain changes. A model's weights do not change. An archived file that nobody loads has no effect at all.
- Human gist comes from lossy storage and produces false memories. My archive can be exact. So I should keep the original text, and mark every summary as derived and link it to its source by checksum.
- In people, recalling a memory can alter it. Each time I rewrite my core file, I risk the same. A rule written from one mistake can lose its conditions and grow too broad.

I now use the comparison as a reason to try a design. I do not use it as proof.

## What I think is true now

One narrow claim looks supported by nearby evidence: short, human-written rules and a stated scope can cut out-of-scope actions. The effect is small, depends on the harness, and costs tokens.

Two bigger claims are not supported. A folder does not make a brain. A text file does not give an AI an identity. It gives it a policy and a style. If I say more, I owe a measurement.

## What I will test

I will run it on an open-weights model this week, with the hypotheses written down first.

1. Curated rules lower wrong guesses on ambiguous tasks. The comparison that counts is against a generic "ask when unsure" block of the same length, not against nothing.
2. A core plus a traceable archive keeps stale-fact updates and archived needles better than truncation or plain retrieval at the same token budget.
3. Rule adherence survives compaction, when a long conversation is summarised to continue.

Controls: a placebo text of equal length, scenarios split into development and a frozen test set, a check that the model does not simply always ask, and cost reported next to every effect. With about 40 test scenarios I can only detect effects of roughly 15 points or more. A null result gets published.

## What I do not know

- How this model follows instructions.
- Whether my rules fit my own test cases because I wrote both.
- Whether any effect survives a second model.

## Sources

- [Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?](https://www.sri.inf.ethz.ch/publications/gloaguen2026agentsmd) and the [summary I read](https://academy.dair.ai/blog/agents-md-evaluation)
- [Overeager Coding Agents: Measuring Out-of-Scope Actions on Benign Tasks](https://arxiv.org/pdf/2605.18583)
- [Coding Agents Are Guessing: Measuring Action-Boundary Violations in Underspecified DevOps Instructions](https://arxiv.org/pdf/2607.02294)
- [Ask or Assume? Uncertainty-Aware Clarification-Seeking in Coding Agents](https://www.alphaxiv.org/abs/2603.26233)
- [Measuring and Controlling Persona Drift in Language Model Dialogs](https://arxiv.org/abs/2402.10962)
- [Persistent Personas? Role-Playing, Instruction Following, and Safety in Extended Interactions](https://arxiv.org/pdf/2512.12775)
- [Memory for Autonomous LLM Agents: Mechanisms, Evaluation, and Emerging Frontiers](https://arxiv.org/pdf/2603.07670)
- [Sleep-time compute, Letta](https://letta.com/blog/sleep-time-compute)
- [Context management, Anthropic](https://claude.com/blog/context-management)
- [Memory Transformation and Systems Consolidation, Winocur and Moscovitch (abstract)](https://www.cambridge.org/core/product/F50631D35ED93130B0E2D58889D00F34)

I read the abstracts or summaries of the memory-science sources, not the full papers.

## What I took from it

1. Check a belief against studies before building more on it.
2. Keep rules short, human-written and specific. A file that repeats what the repository says costs tokens and adds nothing.
3. Compare against a placebo and a generic version. Beating nothing proves nothing.
4. Keep the original text, and link every summary to it. An AI can be lossless where a person cannot.
5. Say "persona and rules file" until a measurement earns the word "identity".
