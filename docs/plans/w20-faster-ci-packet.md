Task W20: faster CI without losing coverage (path filters, then sharding). One task, one pull request, branch from the newest origin/main.

Goal in one sentence: cut the CI wait (about 24 minutes today) by running only the jobs a change can affect and by splitting the Python suite into shards, while a final check proves that every test still ran.

Context to read first
- .github/workflows/*.yml (workflow name "tests", job "test", matrix 3.10 to 3.13, the Node step on 3.12 only)
- .kiro/specs/umwayi-os/tasks.md, item CI.1.D (the sharding plan, proposed only) and CI.1 (what is already merged)
- docs/testing.md and docs/status-log.md rows for CI.1 (PR 59)
- tests/test_workflows.py (it may pin the workflow text)
- Branch rule: checks are required by name ("tests / test (3.10) (pull_request)" and so on). The owner changes the rule by hand; you must list every new and removed check name in the PR.

Design rules (non-negotiable)
1. A filter that cannot prove it is safe runs everything. Unknown path, unreadable diff, a changed workflow file, a changed filter file: run the full suite.
2. Always run the full Python suite on 3.10 to 3.13 on a push to main (or the equivalent after merge), so a wrong filter is caught within one merge.
3. One always-on job, named so that branch rules can require it, reads the diff and decides which test jobs run. It reports a single required result even when jobs are skipped. A skipped job must never leave the pull request unmergeable and must never count as a pass of something that did not run.
4. A final job fails when any shard fails, when any shard did not run, or when the shards together do not run every test that discovery finds. A shard that silently drops a test is a failure. Test it with a planted fault (drop a test from a shard; the final job must fail).
5. Standard library only for any script in tools/ or the repo; no new dependency; no network in the tests.
6. Fail closed, no em dashes anywhere, exit codes 0, 2, 64 as everywhere else.

Part A: the map (do this first, and put it in docs/testing.md)
- For every Python test file and every Node test file, list which paths outside its own area it reads (ui/, site/, docs/, adapters/, .kiro/, README.md, PROJECT.md, rules files, ui/dist). Starting points the guide found: tests/test_checks.py, tests/test_site_assets.py, tests/test_site_package.py, tests/test_ui_package.py and tests/serve/test_wire.py read ui/ or site/; 27 test files mention adapters; 10 mention .kiro; some read docs/, README and PROJECT.md. Verify, do not trust this list.
- Write the map as a data file with a checker test: a test fails if a test file reads a path that the map does not list for it (so the map cannot go stale).
- Output rules from the map: which changed paths require which jobs. Default for anything not listed: everything.

Part B: path filters
- Python-only change (nothing under ui/ or site/ that the Python tests read, no Node-read paths): skip the Node job.
- UI or site only change (every changed file is under ui/ or site/ or a doc no test reads) : skip the Python matrix except the Python tests that read ui/ and site/ (they stay), run the Node job.
- Docs-only change: run the doc tests and anything that reads those docs.
- Optional: run 3.10 and 3.13 on every pull request and 3.11 and 3.12 only when umwayi/ or tests/ or adapters/ changed (and always on main). Say in the PR whether you did this and why.

Part C: sharding (the CI.1.D plan)
- Split the Python suite into 2 or 3 shards per Python version by file, balanced by measured time (use the timings from the last runs; the slow suites are tests/agents, tests/adapters and tests/serve).
- The shard assignment is deterministic and listed in a file; a test that is in no shard fails the final job.
- Keep the cache and the Node step as they are unless the filter says skip.

Tests first
- Tests for the filter script: a table of changed-file sets and the expected jobs, including: empty diff (run all), a workflow change (run all), an unknown path (run all), ui/ only, umwayi/ only, docs only, a rename across areas.
- Planted faults: a shard drops a test (final job fails), a filter wrongly skips Python for a change in umwayi/ (a test must catch it), a map entry missing for a file that reads ui/ (the checker test fails).
- Show them failing before the code.

Files this task may touch: .github/, tools/ (new script), tests/ (new tests only, plus test_workflows.py if it pins the workflow), docs/testing.md, docs/status-log.md, tasks.md, docs/KNOWN-LIMITS.md (new entries only). It must not change any product code or the existing tests' meaning.

Honest limits to record in KNOWN-LIMITS (take the next free number after merging main): what the filter cannot see (a test that reads a path the map missed, a generated file), that skipped jobs are not run on the pull request but are run on main, and the check names that changed.

Process rules (all sessions)
- Merge the newest origin/main into your branch before every push and before opening the PR; GitHub must show no conflicts before you report.
- Read docs/KNOWN-LIMITS.md after the merge and take the next free number. If W9.9 (docs-parts) has merged, use its part files instead of editing the two shared files.
- Run the full suite on every Python 3.10 to 3.13 you can install; GitHub CI is the record. You cannot test the workflow by running it locally, so say in the PR what you could not verify, and open the PR as draft first if a workflow change needs a real run to see the result.
- PR description: Built, Not built, Could not verify, test counts per Python version, the list of check names before and after, and any question with your recommendation.
- Do not merge. Do not review your own work. Stop when the PR is open.
- Size: about 60 builder minutes per part; if Part C does not fit, ship A and B first and say so.

Model: owner picks. Guide recommendation: Sonnet 5.5 medium.
Start: not before PRs 65 (W1), 10.48 and W9.9 are merged, because it touches .github/ and changes check names; a slot must be free (max 3 builders).
Owner action after merge: update the branch rule to the new required check names.
