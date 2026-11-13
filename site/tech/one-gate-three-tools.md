---
title: "One gate, three tools: putting the same rules in front of Claude Code, Kiro and OpenCode"
date: 2026-11-13
summary: "Each AI tool has its own hook and its own idea of allow and deny. umwayi-os translates one answer into what each tool understands, blocks on any error, and refuses to start an agent it cannot gate."
draft: true
illustration: one-gate-three-tools.svg
illustrationAlt: "One gate in the centre with three paths leading to it from the left, labelled Claude Code, Kiro and OpenCode. Past the gate a single path continues. A sheep waits at the gate. The shepherd says same rules, every tool."
tags:
  - Engineering
  - Agentic engineering
  - Integration
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, Python, BuildInPublic]
  post: docs/plans/one-gate-three-tools-linkedin-post.md
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## Three tools, three vocabularies

I use Claude Code, Kiro and OpenCode. Each can run a hook or a plugin before it calls a tool. Each speaks a different language back.

- Claude Code: a `PreToolUse` hook answers allow, deny or ask.
- Kiro: a Pre Tool Use hook answers with an exit code. Exit 0 lets the call run and exit 2 stops it. Kiro has no ask.
- OpenCode: a plugin runs before each tool call. A call can go on, be stopped, or go on to OpenCode's own permission request.

I do not want three sets of rules. I want one set, and the tools can differ only in how they receive the answer. This is the part of umwayi-os I call the chimera: one gate in front of agents that already exist. The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

## The adapter does one job: translate

Each adapter does the same steps. It takes the tool call, sends it through `umwayi check` as a separate process, and turns the answer into what its platform understands.

```
umwayi says   Claude Code   Kiro
-----------   -----------   --------
Yes           allow         exit 0
No            deny          exit 2
Ask me first  ask           exit 2,
                            queue item
```

Kiro cannot ask, so Ask me first is exit 2, a stop, and umwayi adds one item of kind decision to the queue. The stop is the safe part. The queue item is how the owner finds out why.

A generic adapter handles any tool that speaks JSON on stdin and stdout. It answers exit 0, 2 or 3, and the text allow, deny or ask. For a tool with no way to ask, `--no-ask` turns the third answer into a deny plus a queue item.

OpenCode's plugin is plain JavaScript that imports only Node built-ins. umwayi never runs npm, Bun or a plugin install for it. The plugin is loaded only by `umwayi agent chat` for an OpenCode agent, through the inline config umwayi passes. If OpenCode does not load it, no canary file is written, and the chat is refused.

## Rules that every adapter keeps

- Any error blocks. A hook that crashes must not mean allow.
- While the kill switch is on, or its state cannot be read, every adapter denies every tool call.
- The umwayi root comes from `--root`, never from the platform's input. A tool call cannot point the gate at a different set of rules.
- No adapter ever exits with 1, so a crash cannot look like a decision.
- This repository never creates or changes a `.claude` settings file or a `.kiro/hooks` file. Each README shows the snippet you add yourself.
- Each rule names its platform, so a rule for Kiro never answers for Claude Code.

## What the starter rules say

The repository's `rules.yaml` ends with starter rules for what the adapters send.

- Reads, lists and searches: Yes.
- Writes and edits, shell commands, web fetches: Ask me first.
- Wiping folders, pushing to main, forcing a push, naming a payment service: No.
- Touching `rules.yaml`, the logbook, `.umwayi`, `.git` or the hook settings: No. A helper cannot loosen its own gate.
- Touching `.env`, `.pem`, `id_rsa` or similar secret paths: No.
- Anything else, including every MCP tool: Ask me first, because no rule matches.

A test loads the file with the real parser and checks every rule id, a table of adapter actions and an unknown action.

## The front door refuses an agent it cannot gate

The adapters guard tool calls. A second piece, `umwayi agent`, guards the start.

```
umwayi agent check NAME   can NAME be gated?
umwayi agent run NAME     start once
umwayi agent chat NAME    chat on the terminal
                          or over ACP
```

Before `agent run` starts anything, it runs the gate checks, which include that the agent's hook is in place and that the login is the right kind. The rules and the budget are asked after those. For Claude Code, umwayi runs `claude auth status --json` first and starts the agent only when a subscription login is what pays. `agent run` never signs in on its own. If the login check fails, it says `Run umwayi agent login NAME to sign in.` and stops.

An agent that cannot be gated does not start. The reason is the same as for the rules: the safe answer to "I cannot tell" is to stop.

For Kiro with ACP, umwayi talks to `kiro-cli acp` with a small client of its own. It offers the agent no file and no terminal. Agent text is printed with control, bidirectional and zero width characters made visible, so a message cannot hide a command in text you read.

## What does not work yet

- OpenCode chat is built and tested with a fake. I have not done a real OpenCode run, and the same is true of the real Kiro and Claude Code runs on my own check list.
- Some Kiro field names, `input_command` and `input_path`, are not confirmed by Kiro's docs. If Kiro uses other names, a Kiro call is still Ask me first, except reads.
- Matching is plain text. A command can be written to avoid a match. Ask me first for every shell command is the real guard.

## What I took from it

1. Keep one set of rules and write one small translator for each tool.
2. Give each translator a table with a row for every answer, and test the table.
3. Take the location of the rules from your own command line, never from the thing you guard.
4. When a tool has no "ask", map ask to stop, and leave a record that tells the owner what was stopped.
5. Guard the start of an agent as well as its tool calls, and refuse an agent you cannot gate.
6. Tell the reader which parts ran against a real tool and which ran against a fake.
