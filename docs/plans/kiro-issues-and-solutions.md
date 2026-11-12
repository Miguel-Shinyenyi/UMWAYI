# docs/plans/kiro-issues-and-solutions.md: issues met while building with Kiro, and what we do about each

Started 2026-11-12, Africa/Nairobi. Owner: Miguel (executor). Guide: Claude. Builders: Kiro web sessions. This is a living log. Add a row whenever a new issue appears or a fix changes. Rows marked "noticed by guide" are ones the owner did not report but the guide saw while working.

Setup in one line: Kiro sessions build one task each and open one pull request. Claude reviews each pull request on its own. Miguel merges in the GitHub UI. GitHub CI is the record. The control board is in Notion ("Worktree system and context recovery") and the system proposal is in docs/plans/guide-executor-system.md.

## Issues with the Kiro web app

| # | Issue | Effect | What we do now | Status |
| --- | --- | --- | --- | --- |
| 1 | Opening a session in a browser tab reloads its sandbox | Minutes lost on every switch; the page reloads again if a tab is reused | Rule 2026-11-12: each running session keeps its own browser tab for as long as it runs. Never navigate a session tab to another page. Tab titles identify the session; tab numbers change when Chrome restarts | In use |
| 2 | A message sent while the sandbox is waking can vanish | The builder never sees the instruction | After sending, take a screenshot and confirm the message shows in the thread. If not, resend one combined message with all answers | In use |
| 3 | Using the session tab for another page (noticed by guide, 2026-11-12) | The guide opened "New session" inside the W6 tab and replaced that session view with a new one | The finished W6 tab became the W9 tab on purpose. Rule 1 stays: only reuse a tab when its session is finished | Noted |
| 4 | A message sent to a busy builder queues ("Looking into it") | It is read only after the current step | Say "finish the step you are on, then ..." in the message so the order is clear | In use |
| 5 | No signal of a stall | A running builder can look alive and do nothing | Judge by git commit timestamps in UTC, not the page. If no push or message for 30 minutes, look and report. Same error twice, stop | In use, limits are guesses |
| 6 | Choosing a model is easy to forget and costs money | A heavy model is used for a light task | The guide gives model options with a recommendation first. Miguel picks. Spec work: Sonnet 5.5 medium | In use (D-38) |

## Issues with the way sessions work together

| # | Issue | Effect | What we do now | Status |
| --- | --- | --- | --- | --- |
| 7 | Parallel sessions edit the same shared files (docs/status-log.md, tasks.md, docs/KNOWN-LIMITS.md) | Merge conflicts on PRs 57, 58, 59, then on PR 58 and 62 after PR 61 merged (2026-11-12) | Each session merges the newest main before every push and keeps both sides of every row. After any merge to main, the guide checks the other open PRs for conflicts and asks the owning session to fix them | In use |
| 8 | The same files are the root cause | Conflicts will keep coming | W9 spec: one status file and one limits file per task, built into the shared files by a script | Planned (W9) |
| 9 | Too many sessions at once | Review load and conflicts grow | Max 3 builder sessions, one per area (ui and site; agents and adapters; specs, steering and gate) | In use |
| 10 | A builder reviews its own work | Errors pass | A separate reviewer checks every PR: diff, em dash scan, hand checks, counts. The owner merges only after the review | In use |
| 11 | Small facts go wrong in builder text (noticed by guide): the PR number written as 61 when it was 62; a count stated before the final run | Wrong records in docs | The guide checks numbers against GitHub. The builder corrects in the next commit | In use |
| 12 | Local tests ran on one Python version (3.11.15) | A failure on 3.10 or 3.13 shows only in CI | GitHub CI (3.10 to 3.13) is the record. CI takes about 24 minutes, so merge waits for it | In use |
| 13 | Dashes in files | The owner bans em dashes | Scan every diff. Builders also run the check | In use |
| 14 | Builder questions arrive without advice | Slow decisions | Owner rule 2026-11-12: every question gets a recommendation. The guide adds one before relaying Kiro's questions | In use |
| 15 | Spec text can conflict with steering rules | A build would break a rule | Changing a rule needs the owner's approval first (D-39 for steering rule 10 and 12.R17.6), then the rule is reworded in the same PR | In use |
| 16 | Hour estimates leave things out (noticed by guide) | W6 first said 53 hours and left out W6.10 (8 hours); the true total is 61 | Check every estimate against the task list before sending | In use |

## Issues with the guide (Claude)

| # | Issue | Effect | What we do now | Status |
| --- | --- | --- | --- | --- |
| 17 | Context runs out in a long session | The guide forgets the plan | Control board in Notion and hub files hold the plan, backlog, rules and running sessions. A recovery note at the top of the board lists what to read | In use |
| 18 | The first control board did not know the plan (noticed by guide) | Wrong claim that the worktree page held the plan | Added the overall plan, backlog W1 to W15, area map, next-up list and capacity check to the board | Fixed |
| 19 | Browser tools cannot read cookies or cross-domain data | Some checks fail | Use screenshots and git branches instead | In use |
| 20 | The Notion running-now table goes stale | Wrong state shown | Guide updates it after each merge and each report | In use |

## Decisions that came from these issues

- 2026-11-12: do not trial Kiro Crew now. Run our own guide and executor system. Specify the same system inside umwayi-os as W9 with Crew's downfalls designed out (docs/plans/kiro-crew-lessons.md).
- 2026-11-12: W9 spec waited until W6 spec merged. It started the same day.

## Not solved yet: recommendation and task (added 2026-11-12)

Each unsolved item becomes a backlog task on the Notion control board.

| Unsolved | Recommendation | Task |
| --- | --- | --- |
| Stall detection is manual | Interim: the guide checks the last push time of every open branch each cycle. Build a small standard library status script that lists open PRs, last push, CI state and a conflict flag (the repo is public, so no token). The real fix is the stall watcher in the W9 goal spec | W16, then W9 |
| Conflicts on shared docs | Do not wait for the W9 build. Split status and limits into one file per task, built into docs/status-log.md and docs/KNOWN-LIMITS.md by a script, in one small PR at a quiet moment after UI.7 and PR 62 merge (about 3 hours). Until then merge the smallest PRs first | W17 |
| Local tests do not match CI | Ask sessions to run Python 3.10 and 3.13 before pushing if they can install them. If not, shard CI (CI.1.D) to cut the 24 minute wait | W18 |

Rule (owner, 2026-11-12): this log is updated as the project goes. A new issue gets a row. An unsolved item gets a task.
