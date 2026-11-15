# Kiroween 2026: the Umwayi hub as an AI operating system (umwayi-os)

Status date: 2026-11-15 (morning). Category: Frankenstein (changed from Skeleton Crew on 2026-11-12). Platform: Devpost. Sponsor: AWS. Plan: submit on Dec 3; whatever works by then is what gets submitted.
Repo (public): Miguel-Shinyenyi/umwayi-os. Python, core uses only the standard library. Command line: `umwayi`.

## What it is

A governing layer for AI agents. It sits in front of the agents he already uses (Claude Code, Kiro, OpenCode), asks the rules before each action, keeps a queue and a logbook, caps spend, and refuses to start an agent it cannot gate. He is the first user; others can use it to run their own agents.

What it is not (owner's question of 2026-11-14, D-59): not a full operating system, not a model or an agent, not a sandbox (it does not stop a process that never asks it), not a security product, not a hosted service. For Kiroween the page says AI-OS and says in its first line what that means. The full text and the five missing things (W40 to W44) are in `docs/plans/umwayi-os-what-it-is-and-roadmap.md`.

## Where it stands (main 8bf7777 on 2026-11-15, pull requests up to 108; 3,763 Python tests; the progress page reads 278 tasks done and 46 open; the table below was last re-read on 2026-11-11, and the progress sections further down are newer)

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

Progress on 2026-11-12 after the direction message (all merges by the owner in GitHub after the guide's own review):

- PR 58 (UI.7 High tier) merged; the owner's own High-tier test on a real device is held for later.
- PR 61 (W6 spec) merged; PR 62 (10.47 fake OpenCode over ACP) merged; PR 63 (W9 goal orchestration spec, with the worktree-per-task core rule and W9-Q1 to Q14 answered) merged.
- PR 64 (W6.1 to W6.6, `umwayi serve`: gate, token, server, pipeline, first routes) merged at 20:15 Nairobi. The guide's live smoke test: no token 401, wrong Host 403, no Origin 403, no CORS or cookie headers, loopback only, the kill switch can be turned on from the page and no route turns it off. KNOWN-LIMITS 200 to 236 used.
- Running: W1 mobile-first rework (PR 65, has a conflict; the session was told to merge main and renumber to 237 to 241), OpenCode 10.48 (entries from 242), W9.9 shared docs builder (also W17, started 20:25 on Sonnet 5.5 medium). Three builder sessions at once is the cap, one per area.
- New tasks: W16 board status script, W17 (= W9.9), W18 CI Python versions, W19 the guided flow in the library (hub rules and Kiro's ten frontier practices coded as a checked `guidance.yaml`), W20 faster CI (path filters, sharding, a final check that every test ran; waits for PRs 65, 10.48 and W9.9).
- The way of working is now written down: Claude is the guide, Miguel is the executor and merges, Kiro sessions build, one task per PR. Files: `docs/plans/guide-executor-system.md`, `docs/plans/kiro-issues-and-solutions.md` (24 issues), `docs/plans/kiro-crew-lessons.md`, `docs/plans/w20-faster-ci-packet.md`.

Article: `site/tech/stitching-a-chimera-with-kiro.md` (draft). LinkedIn post: `docs/plans/kiroween-linkedin-post.md`.

Progress on 2026-11-13 (merges after the guide's own review, KNOWN-LIMITS up to 264):

- Merged: W20 faster CI (PR 67), W9.9 docs builder (70), 10.48 to 10.51 OpenCode chat (66, 71, 74, 75), W1 mobile-first (65), W6.9 page client (72), CI.2 browser required (73), W6.10 whole-system scenarios (76), W16 board status (77), OpenCode examples (78), W19 concerns checker (79), backfill history (80), model routing table (81), guidance.yaml loader (82), stalls check (83), W2 command map page (85), concerns record draft (86), 22 advise entries (84), W10 frontier practices tracker (87), W9.6 run options (88), W9.1 to W9.5 pure core (89).
- CI: one job took 24.9 minutes before W20; a typical full run now takes about 12 minutes and a documentation only first run 1 minute 30 seconds. Article: `site/tech/the-ci-wait-halved.md` (draft).
- Running: W9.6b (worktree per task, `--workdir`, `goalgit.py`), a read-only progress page (`ui/` only) and W9.7 (the supervisor, stacked on W9.6b; waits for the owner's word before merge). Kiro Auto for all new sessions.
- Decided: base rules with user toggles, tiers 1 and 2 locked, user rules separate, promotion by the owner only (D-54, later).
- Still with the owner: the ten least sure rows of the concerns record, rows 1, 3 and 7 of the frontier practices, the High tier on a real device, the branch rule that requires `tests / result (pull_request)`.

Progress from the afternoon of 2026-11-13 to the morning of 2026-11-15 (KNOWN-LIMITS up to 279):

- Merged on Nov 13 after 15:30: the read-only progress page (PR 90), W9.6b the worktree per task (91), W21 `tools.merge_main` (92, steering change), W22 the progress page built at build time (94), W9.7 the supervisor (93, on the owner's word), W24 pull requests run Python 3.10 and 3.13 only (95), W25a task list (98), W23 the Kiro issues log and rule 9 (97, steering change), W9.8 the goal commands (96), W26 the tester feedback template (99).
- Merged on Nov 14: W25 the tester quickstart (100), W27 the progress page as a build artifact (102), W25b task list with W28 to W32 (104), W34 goal tests use the date of the day (106), UI.8 High steps down to Standard after slow frames (103), W33 `umwayi feedback export` (105).
- Merged on Nov 15: W38 the goal map page with a small Halloween theme (108, on the owner's word), W9.10 the whole-system scenarios of `umwayi goal` and a mutation pass (101: 16 scenarios; 48 mutants, 47 killed, 1 shown equivalent).
- Main was red from midnight UTC on Nov 14: a fixed test date met the logbook rule that dates never go backwards. W34 fixed it.
- Walkthrough test run on the owner's Mac (video pack v2, Nov 14): scenes 1 to 7 ran correctly; scene 8 did not pass (test_cli 41 tests with 1 failure and 1 error, test_goalrun 209 with 6 errors, test_whole_system 30 with 2 failures and 25 skipped). Two causes confirmed: the fixed dates (W34, merged) and the @ in a Homebrew Python path (W35, PR 107). Two failures have no cause yet (W36).
- First real agent runs (Nov 15, one Mac): Claude Code 2.1.322, OpenCode 2.3.0 on its free route, Kiro CLI 3.3.0. The kill switch stopped each start; with it off each agent ran and answered. OpenCode and Kiro ended with exit 0 and settled as unknown at 100 UU (no cost report). The Claude Code run answered and was then stopped with exit 2 and settled the full reservation, because its token counts arrive as `asDouble` and `umwayi/telemetry.py` requires `asInt`. Fix: W45 (D-63).
- Open on Nov 15: PR 107 (W35, owner said merge), W37 (`GET /v1/goal-map` and `umwayi goal map`, D-61), W39 (the what it is page), W45. Queued: W28 login wizard, W29 feedback send, W30, W36, W38b (live read of the goal map), W40 to W44, W46.
- Video pack v2 holds the prompts, the voice script, the walkthrough scripts and five recordings (the walkthrough, the tests, and one per agent). To correct before the voice is recorded: goal help lists 11 commands; a fresh logbook has 5 earlier entries; the budget screen says unknown and placeholders; kill status exit 3 is correct; a test run takes about 4.5 minutes; scene 8 needs the new real counts. The tests recording is not published as it is.

## Schedule to Dec 3 (re-planned Nov 10, interface changed Nov 11)

Layers 10 to 11, the hash chain, the budget governor and the scan were merged by Nov 10. Layer 12 interface Nov 11 to Nov 22 (about 75 hours by Kiro, the owner handles the timeline); layer 13 from Nov 16 or in parallel, stopping where the deadline finds us; owner physical tests Nov 19 to 22; README, demo and Devpost Nov 23 to 28; freeze Nov 29 to Dec 2; submit Dec 3.

## Open

- Owner items: read the Claude Agent SDK licence; keep Python 3.10 until Dec 3; the real tests 10.21, 10.31, 11.6, B.10 capture, 10.37 and the interface check.
- First real run of the Claude Code chat on a machine with Node 22 and a Claude Code login (task 10.31): whether the hook runs before the first prompt, and the real field names of the login status. The first real `agent run` happened on 2026-11-15 (see above); the chat over ACP and a real goal run (W9.11) are still open.
- KNOWN-LIMITS numbers reach 279 on 2026-11-15; they are fixed later when more people are hired.
- Kiro hackathon credits: requested, grant not confirmed.
- Devpost write-up: say honestly that hooks, custom agents, powers and MCP are not yet built; nine Anthropic SDK packages carry a "SEE LICENSE IN LICENSE.md" licence; mention it.
- Go-live: ask before any project goes live, then run security scans.

## Process notes

Kiro builds from approved specs on feature branches; Claude reviews each pull request (tests on Python 3.11 to 3.13, scans, hand tests with fake agents) and Miguel approves the merge. Kiro's own "Running command" display is unreliable; the GitHub branch is the record.


## Update 2026-11-15 (afternoon)

Rules read again from kiroween.devpost.com/rules: credit request form closes Dec 1, 12:00 Pacific (Dec 1, 23:00 Nairobi), 4,000 credits one time, redeem by Dec 4. The form needs a demo URL, testing instructions, a public YouTube video under 3 minutes with no third party trademarks, a public GitHub repo with an open source licence in About and a /.kiro folder at the root. The first umwayi-os commit is 2026-11-07, inside the submission period. Details, the two licence checks and the Vercel state: `docs/plans/kiroween-submission-checklist.md`. The owner chores for Claude Code: `docs/plans/claude-code-owner-tasks-2026-11-15.md`.
