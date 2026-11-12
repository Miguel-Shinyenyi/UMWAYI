# docs/plans/guide-executor-system.md: our own system, guide and executor

Written 2026-11-12, Africa/Nairobi. Decision (owner, 2026-11-12): do not trial Kiro Crew now. Run our own system: Claude is the guide, Miguel is the executor, Kiro sessions build. The same system is then built inside umwayi-os (workstream W9), with the pitfalls found in `docs/plans/kiro-crew-lessons.md` designed out.

This is a proposal until Miguel approves it. Items marked (new) are changes from how we work today.

## Roles

- Executor (Miguel): approves, merges, runs the owner checks, answers decisions. Nothing merges without his word.
- Guide (Claude): holds the goal, writes task packets, starts and watches builder sessions, reviews each pull request on its own against the files, keeps the records. Never merges. Never builds code in the product.
- Builders (Kiro sessions): one task each, one pull request each. They never merge and never review their own work.

## The task packet

A task without all of these is not ready.

1. Goal, in one sentence.
2. Context: files to read first and decisions already made.
3. Acceptance checks, each one something a second party can run or look at.
4. Where the outcome is recorded.
5. Size: small enough for one session to finish without guessing. (new) If it needs more than about 60 builder minutes, split it.
6. Model and effort, chosen by Miguel from options the guide gives.
7. Files the task may touch. (new) Anything else is off limits.

## States

queued, running, in review, needs owner, merged, failed, stopped. Every task is in exactly one. The guide shows the list on request.

## Rules that fix Crew's pitfalls (new)

1. Approvals are never silent. A builder that needs the owner sets the task to needs owner and says what it needs. The guide raises it in the next reply. No answer in a set time means No, never continue.
2. Stall and loop limits. No push or message from a running builder for 30 minutes: the guide looks at the session and reports. The same error twice in a row: the builder stops and reports; it does not retry a third time.
3. Status shows the last real event with its time, never just "connected" or "running".
4. One file per task for status and limits: `docs/tasks/<id>/status.md` and `docs/tasks/<id>/limits.md`. A script builds `docs/status-log.md` and `docs/KNOWN-LIMITS.md` from them, numbers assigned at merge. Builders in parallel never edit the same lines. Until the script exists, builders merge `origin/main` before every push, as now.
5. Review is separate. The reviewer is not the builder and reads the diff and reruns checks by hand. CI is the record.
6. Cost is recorded. Each task's report gives the builder's credits used and elapsed time; the guide totals them.
7. Failures are recorded as lessons. A caught mistake goes into the pull request and `MASTER_CONTEXT.md` rules, as now.
8. A failed write to the logbook fails closed.
9. Fresh session per task, in its own worktree, branched from the newest main.

## Task packet for W9: the same system inside umwayi-os (spec only)

Goal: specify `umwayi goal`, where a main agent holds a goal, splits it into task packets, runs each in its own worktree and fresh session, has a different agent test each one, and merges nothing without the owner.

Context: this file; `docs/plans/kiro-crew-lessons.md`; the layers for rules, queue, logbook, budget governor and kill switch; the W6 backend spec when it exists.

Acceptance checks:
- The spec states the roles, task packet, states and rules above as requirements, each with a test.
- Every task start and every state change is checked by the rules gate and written to the logbook.
- The builder and the tester must be different agents or different sessions; the spec says how that is checked.
- A table of timeouts and loop limits with an owner for each.
- Worktree handling: create, branch, push, remove, and what happens when two tasks need the same file.
- Property based tests listed for the state machine and the one file per task merge.
- Budget: per task spend in UU and a stop when a limit is reached.
- Open questions for the owner listed in the pull request.
- Nothing is built. KNOWN-LIMITS says so.

Record: a spec pull request in `.kiro/specs/umwayi-os`, as for earlier layers.

Files it may touch: `.kiro/specs/umwayi-os/**`, `docs/tasks/**`, and the usual status rows.
Model: Sonnet 5.5 at medium effort (recommended). Owner confirms.

## Status on 2026-11-12 evening

- Approved: the owner answered W9-Q1 to W9-Q14 as recommended and the spec merged (PR 63). The worktree per task (one task, one worktree, a fresh session per task) is a core rule of umwayi-os, not an option.
- Standing rules the system now follows: one browser tab per Kiro session; keep the guide's Chrome tab group; every question comes with a recommendation; do it yourself before asking the owner; every rule the owner gives the guide also applies to umwayi-os; every session merges the newest origin/main into its branch before every push so a PR never opens with conflicts; the Kiro issues log is kept as we go.
- Coded in the library next (W19): the hub's rules and engineering guidance and Kiro's ten frontier practices as a checked `guidance.yaml`, enforced at the gates where checkable, injected into prompts and checked by the tester otherwise.
- Built so far from this plan: W6.1 to W6.6 (`umwayi serve`, PR 64). W9.9 (the shared docs builder, also W17) is building; the rest of W9 comes after Dec 3. W20 (faster CI) waits for PRs 65, 10.48 and W9.9.
- Measured in use: five pull requests reviewed alone by the guide and merged by the owner in one day; the conflicts that came up (PRs 57, 58, 59, 62, 63, 64, 65) all came from parallel edits of the shared docs, which W9.9 removes.

## Not done

- No script, no `umwayi goal` (the spec is merged; the build after Dec 3 apart from W9.9).
- The 30 minute stall limit and the 60 minute size are guesses to adjust after real use.
