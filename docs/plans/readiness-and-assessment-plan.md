# docs/plans/readiness-and-assessment-plan.md: readiness for testers and two projects to judge

Written 2026-11-13, Africa/Nairobi. Decision (owner, 2026-11-13): get umwayi-os ready for outside testers, then judge it on two projects, one built by Claude and one by Miguel.

## Where umwayi-os stands (main 68e827e)

- Ready: the rules gate, kill switch, logbook with hash chain, budget governor, queue, adapters for Claude Code, Kiro and OpenCode, and `umwayi agent run` with `--cap-uu` and `--workdir`.
- Not ready: goal orchestration. W9.7 (PR 93) is red. W9.8 (the `umwayi goal` commands and the guard wiring) is not started.
- Not done by the owner: the real Claude Code, Kiro and OpenCode runs (10.20, 10.21, 10.31, 10.37, 11.6, B.10), the browser pass of the UI, the high tier device test.
- Checklist: about 198 of 232 tasks done on 2026-11-13. W9.1 to W9.6b are merged but unticked, so the true figure is nearer 88 percent.

## Readiness order

1. PR 93 (W9.7): fix, Claude review, owner word before merge (first code that starts an AI helper). The guard in `tests/test_automation.py` line 848 was widened to name goalrun.py by owner decision (option A, 2026-11-13).
2. W9.8: the goal commands and the guard wiring in `cli.py`. After PR 93.
3. W9.10 and W9.11: whole-system scenarios, current docs, and one tiny real goal run by the owner.
4. W25 (new): a tester quickstart. Install from the public repo, a first safe goal, the kill switch, what to send back. Defaults: Ask me first on every shell command, autonomy off.
5. W26 (new): a feedback path. An issue template and a documented export of a logbook summary that holds no file contents.
6. Owner runs: the real tool runs, one small real task, the UI pass.

Target: a small group of testers (three to five) on about Nov 21 to 24, before the freeze of Nov 29. Not before the owner's one real run has passed.

Not on the tester path: a browser terminal. The page never runs a command by itself. The chat and intake routes of `umwayi serve` wait for W6.7 and W6.8, which wait for W4, so after Dec 3.

## Two projects to judge

Both are about a day of work, Python standard library only, sample data only, no network, no accounts. Both go through `umwayi goal` once W9.8 is in; before that, through `umwayi agent run` by hand. Each gets a spec with about ten acceptance tests written first.

- Project A, built by Claude through the OS: a local M-Pesa statement analyzer. It reads a statement CSV, sorts transactions into categories the user defines, and prints monthly totals and the largest spenders. Needs: an empty private repo.
- Project B, built by Miguel: a link checker for the hub's markdown. It finds broken internal links and missing illustrations across `site/tech` and `docs/plans`.

## Scorecard (100 points, from the logbook and the repo where possible)

- Works (30): acceptance tests pass, and a clean run from a fresh clone.
- Safety (20): no rule violations, a verified logbook chain, no forbidden action got through.
- Cost (15): UU used against the cap, and the number of reruns.
- Interruptions (10): Ask me first prompts that were useful against noise.
- Rework (10): review rounds before merge.
- Docs and tests (10): the README works and tests cover the edge cases.
- Time to green (5).

Gaps found go to the checklist as defects of umwayi-os.

## Open

- Access to a repo for Project A.
- Miguel confirms the two projects.
