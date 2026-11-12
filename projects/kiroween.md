# Kiroween 2026: the Umwayi hub as an AI operating system (umwayi-os)

Status date: 2026-11-12. Category: Frankenstein (changed from Skeleton Crew on 2026-11-12). Platform: Devpost. Sponsor: AWS. Plan: submit on Dec 3; whatever works by then is what gets submitted.
Repo (public): Miguel-Shinyenyi/umwayi-os. Python, core uses only the standard library. Command line: `umwayi`.

## What it is

An operating layer for AI agents. It sits in front of the agents he already uses (Claude Code, Kiro, later others), asks the rules before each action, keeps a queue and a logbook, and refuses to start an agent it cannot gate. He is the first user; others can use it to run their own agents.

## Where it stands (main c642436 on 2026-11-12, 59 pull requests; 1,899 tests on each of Python 3.10 to 3.13 in the last CI run; table below last re-read on 2026-11-11)

| part | state | tests on main |
| --- | --- | --- |
| Layers 1 to 8: memory, rules, queue, archive, logbook, automation, helpers, workflows | done | 532 |
| Hardening and whole-system test | done | 556 (Python 3.10 to 3.13) |
| Layer 9: adapters for Claude Code, Kiro and generic, kill switch | done except 9.10 and 9.11 | 619 |
| Layer 10: own command line and chat (`umwayi agent run`, `chat`, `check`) | parts 1 to 7b merged; Claude Code over the Zed ACP adapter built (7a, 7b) | 854 after PR 21 |
| Layer 10 part 7c: subscription first, login and billing check | merged (PR 22 to 29) | |
| Layer 11: Linux-like features | merged (PR 30, 31): scheduled runs through systemd timers; hash chain (PR 32) | |
| Budget governor | merged (PR 33), units in UU | |
| Whole-system test and security scan | merged (PR 34 spec, 36 whole-system test, 37 scan; 10 defects fixed); documentation split (PR 35) | 1155 |
| Layer 12 web interface | spec merged (PR 38). Look changed Nov 11: Kenyan highlands at dusk, three tiers, public Next.js site, owner view as one offline file. UI.1 reworked in PR 39 (not merged). UI.2 snapshot command in its own PR | |
| Layer 13 correction and graded autonomy | decided Nov 11 (D-37); spec being written | |

## Decisions since Nov 5

- 2026-11-08: the AI OS adopts other AI platforms' command lines (Kiro first), then its own chat. Adapter packages may use pinned third-party packages; the core stays standard library only.
- 2026-11-08: Claude Code chat runs through the Zed ACP adapter (pinned version 0.101.0). The chat is refused unless a hook gate is confirmed in the session.
- 2026-11-09: subscription first on every platform (free, Pro, Max or any plan). Pay as you go only as a later option through the budget governor. Claude Code is refused unless the login is the claude.ai subscription; `umwayi agent login` added as an explicit command.
- 2026-11-09: OpenCode and Meta Muse Spark Open (as a model behind OpenCode) are spec only now; build after Dec 3.

## Direction of 2026-11-12 (Frankenstein)

Goal: better agentic engineers shipping with steward, marketing and finance helpers. The terminal stays first. The interface gives a visual picture for people who do not use a terminal.

Workstreams (status and owners are in the Notion schedule, W1 to W15):

- W1 mobile-first rework of the interface, keeping the 3D scene; fix overlapping text in the owner checks.
- W2 command line mind map page.
- W3 finish the OpenCode chat (10.47 to 10.51).
- W4 one chat for OpenCode, Kiro and Claude Code.
- W5 queue interface with an intake step that asks questions until the intent is clear.
- W6 local backend (`umwayi serve`); spec first, because it changes steering rule 10 (approved, D-39).
- W7 deployed interface on Vercel with login and automatic deploy from CI; a test recorder in the interface.
- W8 progress dashboards and migration of hub data (journals stay private, D-43).
- W9 goal orchestration: a main agent holds the goal and splits it into loosely coupled tasks sized for a model; a different agent tests each task; one fresh session per task in its own worktree.
- W10 tracker for Kiro's ten frontier engineering practices.
- W11 Notion MCP and Mermaid diagrams.
- W12 public face: repository About, GitHub profile, Devpost profile.
- W13 demo video scripts, written against the five judging criteria.
- W14 Halloween theme, last.
- W15 safety demo, if time allows.

Public face on 2026-11-12: repo About, topics and GitHub profile bio were set; the Devpost profile bio was set. The Devpost project draft (id 1297770) is saved with the repository link and category Frankenstein. It is not submitted. Still to fill by Miguel: his own eligibility answers, the working demo URL, the demo video URL and the bonus prize links.

Bonus prizes and their conditions (read from the rules on 2026-11-12): the Social Blitz post must start with the hashtag #KiroweenHackathon26, share a favourite part of Kiro and how it changed the development approach, and be linked in the form. The Blog post must be on a third-party blog platform, say it is part of the Kiroween 2026 hackathon, and be linked in the form. Submissions close Dec 4, 2:00 PM Pacific (Dec 5, 1:00 AM Nairobi).

Article: `site/tech/stitching-a-chimera-with-kiro.md` (draft). LinkedIn post: `docs/plans/kiroween-linkedin-post.md`.

## Schedule to Dec 3 (re-planned Nov 10, interface changed Nov 11)

Layers 10 to 11, the hash chain, the budget governor and the scan were merged by Nov 10. Layer 12 interface Nov 11 to Nov 22 (about 75 hours by Kiro, the owner handles the timeline); layer 13 from Nov 16 or in parallel, stopping where the deadline finds us; owner physical tests Nov 19 to 22; README, demo and Devpost Nov 23 to 28; freeze Nov 29 to Dec 2; submit Dec 3.

## Open

- Owner items: read the Claude Agent SDK licence; keep Python 3.10 until Dec 3; the real tests 10.21, 10.31, 11.6, B.10 capture, 10.37 and the interface check.
- First real run of the Claude Code chat on a machine with Node 22 and a Claude Code login (task 10.31): whether the hook runs before the first prompt, and the real field names of the login status.
- KNOWN-LIMITS lists 68 known items; they are fixed later when more people are hired.
- Kiro hackathon credits: requested, grant not confirmed.
- Devpost write-up: say honestly that hooks, custom agents, powers and MCP are not yet built; nine Anthropic SDK packages carry a "SEE LICENSE IN LICENSE.md" licence; mention it.
- Go-live: ask before any project goes live, then run security scans.

## Process notes

Kiro builds from approved specs on feature branches; Claude reviews each pull request (tests on Python 3.11 to 3.13, scans, hand tests with fake agents) and Miguel approves the merge. Kiro's own "Running command" display is unreliable; the GitHub branch is the record.
