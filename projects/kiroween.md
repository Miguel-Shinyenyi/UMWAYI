# Kiroween 2026: the Umwayi hub as an AI operating system (umwayi-os)

Status date: 2026-11-09. Category: Skeleton Crew. Platform: Devpost. Sponsor: AWS. Plan: submit on Dec 3; whatever works by then is what gets submitted.
Repo (public): Miguel-Shinyenyi/umwayi-os. Python, core uses only the standard library. Command line: `umwayi`.

## What it is

An operating layer for AI agents. It sits in front of the agents he already uses (Claude Code, Kiro, later others), asks the rules before each action, keeps a queue and a logbook, and refuses to start an agent it cannot gate. He is the first user; others can use it to run their own agents.

## Where it stands (main 5910c01, 22 pull requests merged)

| part | state | tests on main |
| --- | --- | --- |
| Layers 1 to 8: memory, rules, queue, archive, logbook, automation, helpers, workflows | done | 532 |
| Hardening and whole-system test | done | 556 (Python 3.10 to 3.13) |
| Layer 9: adapters for Claude Code, Kiro and generic, kill switch | done except 9.10 and 9.11 | 619 |
| Layer 10: own command line and chat (`umwayi agent run`, `chat`, `check`) | parts 1 to 7b merged; Claude Code over the Zed ACP adapter built (7a, 7b) | 854 after PR 21 |
| Layer 10 part 7c: subscription first, login and billing check | spec merged (PR 22); build started Nov 9 | |
| Layer 11: Linux-like features | not started, needs its own spec approved | |
| Whole-system test and security scan | planned | |
| Budget governor | planned, decided yes | |

## Decisions since Nov 5

- 2026-11-08: the AI OS adopts other AI platforms' command lines (Kiro first), then its own chat. Adapter packages may use pinned third-party packages; the core stays standard library only.
- 2026-11-08: Claude Code chat runs through the Zed ACP adapter (pinned version 0.101.0). The chat is refused unless a hook gate is confirmed in the session.
- 2026-11-09: subscription first on every platform (free, Pro, Max or any plan). Pay as you go only as a later option through the budget governor. Claude Code is refused unless the login is the claude.ai subscription; `umwayi agent login` added as an explicit command.
- 2026-11-09: OpenCode and Meta Muse Spark Open (as a model behind OpenCode) are spec only now; build after Dec 3.

## Schedule to Dec 3 (Schedule A, one day moved on Nov 9)

Part 7 and 7c Nov 9 to 12; layer 11 Nov 13 to 14 (needs spec approval first); whole-system test and security scan Nov 15 to 16; budget governor Nov 17 to 22; README, demo and Devpost text Nov 23 to 28; freeze Nov 29 to Dec 2; submit Dec 3.

## Open

- First real run of the Claude Code chat on a machine with Node 22 and a Claude Code login (task 10.31): whether the hook runs before the first prompt, and the real field names of the login status.
- KNOWN-LIMITS lists 68 known items; they are fixed later when more people are hired.
- Kiro hackathon credits: requested, grant not confirmed.
- Devpost write-up: eight Anthropic SDK packages carry a "SEE LICENSE IN LICENSE.md" licence; mention it.
- Go-live: ask before any project goes live, then run security scans.

## Process notes

Kiro builds from approved specs on feature branches; Claude reviews each pull request (tests on Python 3.11 to 3.13, scans, hand tests with fake agents) and Miguel approves the merge. Kiro's own "Running command" display is unreliable; the GitHub branch is the record.
