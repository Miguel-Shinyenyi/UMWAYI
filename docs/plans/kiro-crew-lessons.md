# docs/plans/kiro-crew-lessons.md: Kiro Crew as a tool, its downfalls, and what umwayi-os takes from them

Written 2026-11-12, Africa/Nairobi. Decision (owner, 2026-11-12): use Kiro Crew as a tool only, to speed up automated development. Do not build the "Best Kiro Crew App" entry.

Status: read from Kiro's public docs, changelog, blog and two third party posts. Crew was not installed or run. Nothing below is a measured result.

## What Crew is

An open source personal agent (version 0.1.2 on 2026-08-04). It drives kiro-cli over ACP. `kirocrew run TASK.md` plans, executes, tests, retries and checkpoints a spec. It also has sub-agents, schedules, webhooks, memory, workflows written in Python, apps, and other agent backends (Claude Code, OpenCode and more). Its docs do not cover worktrees or git.

## Downfalls found

Documented by Kiro:

1. Long runs are a goal, not a promise. The 10 hour target is described as a design aim.
2. A step is marked FAILED after three retries with the same error. A watchdog warns at 60 minutes and resets at 2 hours. Test runs time out at 90 minutes. A sub-agent shows stalled after 120 seconds and is force-reaped at 3 hours.
3. A sub-agent can stall because it waits for an approval nobody sees.
4. The OS sandbox is opt-in and covers Linux and macOS only. Computer Use is off by default and macOS only in 0.1.2.
5. Memory search silently falls back to keyword matching until a 610 MB model downloads. Memory writes can fail silently on a full disk. Incognito mode never writes memory.
6. The core runtime is kiro-cli at launch, so a missing login gives a timeout error.
7. Worktrees, git handling and approvals have thin or no documentation.
8. Security is stated as design intent. No independent audit is cited.

Reported by others (treat as data, not proof):

9. Community comment: Crew can use tokens much faster than Kiro CLI.
10. Windows rough edges in one user's report: the PATH not seen by a running gateway, a cron job stuck on Running, and Slack messages with no reply while the badge said Connected (issue 1770 on KiroCrew, unconfirmed cause).
11. Another author rebuilt it and listed lessons: string rules can be evaded by obfuscated commands; a gate cannot sign its own audit log; one malformed line stalled a whole audit spool; headless approval needs a real wait that denies on timeout; path traversal in an approval workflow needed separate review.
12. Large surface area; the same author could not picture how the parts fit from the docs.

## Lessons for umwayi-os

Each one becomes a check or a task. None is built yet.

| # | Lesson | What umwayi-os does about it |
| --- | --- | --- |
| 1 | An agent that waits on an approval nobody sees looks like a hang | Ask me first must wait with a visible state and a timeout that denies. Check it in the W6 spec and the queue interface (W5). |
| 2 | A status badge that shows only the first handshake lies | Every status in the interface shows the time of the last real event, not the connection state. Add to the W1 and W5 acceptance checks. |
| 3 | One bad line must not stall the log | Add a property based test: malformed logbook lines and malformed requests never stop later entries, and are reported. |
| 4 | A log the gate can rewrite is weak | The hash chain exposes edits but cannot stop a writer with file access. Confirm this is in KNOWN-LIMITS; consider a signing step outside the gate process. |
| 5 | Silent failure on a full disk | A failed logbook write must fail closed (answer No), never continue. Add a test. |
| 6 | String rules can be evaded | Test the gate with obfuscated commands. State plainly that the core has no OS sandbox. |
| 7 | Retry loops burn tokens | The budget governor stops a task after a set count of identical failures, as Crew does after three, and counts the spend. |
| 8 | Timeouts need owners | Write one table of timeouts (step, test, stall, reaper) in the W9 goal orchestration spec. |
| 9 | Parallel sessions collide on shared files | We hit this on `docs/status-log.md`, `tasks.md` and `KNOWN-LIMITS.md` in PRs 57, 58 and 59. W9: one file per task for status and limits, merged by a script, so worktrees never edit the same lines. |
| 10 | Worktrees and git are undocumented in Crew | W9 specifies them itself: one task, one fresh session, one worktree, a different agent tests, the main agent merges. |
| 11 | Large surface area is hard to hold | Keep slices small, as now. |
| 12 | Cost grows faster with autonomy | Report spend per task in UU in the progress dashboards (W8). |

## How to use Crew

- As a tool on one small, well specified task first, in a scratch worktree of umwayi-os, not on main work. Measure time, tokens and failures. Record them here.
- Put umwayi in front of Crew's agent so each tool call is checked. Note what breaks.
- Keep the review by a second agent and the owner merge as they are.

## Not done

- Crew was not installed. Kiro login, a machine to run it on, and the cost are unknown.
- The GitHub repository and its open issues were not read, only one issue number from a third party post.
- No lesson above was tested against umwayi-os code. Items 4 and 5 need a look at the code first.

## Sources

kiro.dev/docs/crew, /docs/crew/features, /docs/crew/apps, /docs/crew/troubleshooting, /blog/introducing-kiro-crew, /changelog/crew/0-1; InfoQ news 2026-08 on Kiro Crew; two AWS Builder Center posts (a Windows install report and a Claude Code rebuild).
