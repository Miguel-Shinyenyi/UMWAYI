---
title: "I cut my CI wait from 25 minutes to about 12 and checked that no test was dropped"
date: 2026-11-13
summary: "Every pull request on umwayi-os waited about 25 minutes for the same test suite. Here is how I cut that to about 12 by running fewer jobs and splitting the suite, and the check that proves every test still runs."
draft: false
illustration: the-ci-wait-halved.svg
illustrationAlt: "Two rows of bars. The top row is one long bar, one job, 25 minutes. The bottom row is three shorter bars side by side, three shards, feeding one check that asks whether all tests ran. The shepherd says same tests, half the wait."
tags:
  - Engineering
  - Testing
  - CI
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, ContinuousIntegration, SoftwareTesting, Python, BuildInPublic]
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## The wait

umwayi-os is a Python command line with a large test suite. It has more than 2,000 tests. They run on every pull request, on Python 3.10, 3.11, 3.12 and 3.13. The core uses only the standard library, so the tests start real child processes in temporary folders. That makes them thorough and slow. The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

On Nov 12 I measured one job on one pull request: 24.9 minutes. Each job ran the whole suite, and one push could start two runs of four jobs each. The tests alone took about 1,810 seconds on Python 3.11.

I build this project with several AI builders working in parallel. Each pull request is reviewed and then merged. A 25 minute wait on each push slows every round of review.

```
Before: one push
-------------------------
push
 +- run 1: 4 jobs
 +- run 2: 4 jobs
each job: all tests
each job: about 25 min
-------------------------
```

## Step 1: stop running the same thing twice

The first change was small (pull request 59). CI ran on pull requests only, and a newer push cancelled the older run. One push now means one run of four jobs. I also cached the npm download. That saved little: the whole Node step was 0.4 minutes of a 24.9 minute job. I cached it anyway, and I wrote the number in the pull request.

This change cut the number of runs. It did not shorten one run.

## Step 2: do not run what a change cannot affect

Most pull requests do not touch most of the code. A change to a documentation page cannot break a test that never reads that page. But "cannot" has to be proven, not assumed.

I wrote a map. For every test file, the map lists which paths outside its own area the test reads. A script scans the test files and fails when a test reads a path the map does not list. The map is data in `tools/ci_map.json`, and `tests/test_ci_map.py` keeps it true.

The scan corrected my own guesses. I had estimated that 27 test files touch the adapters folder. The scan found 43. I had estimated 10 touch the `.kiro` folder. Only 4 read it. The rest only mention it in a path inside a temporary folder. Only 23 of 115 test files read anything outside `tests/` and `umwayi/`.

A second script, the plan, reads the changed paths of a pull request and decides which jobs run. Its rules are strict:

```
changed path
   |
   v
anything unusual?
   unknown path
   odd path
   change under .github/ or tools/
   push to main
   |
   +-- yes: run everything
   |
   v
no: use the longest matching
route in the map
   |
   v
whole suite, some test files,
or none
```

The default is to run everything. The filter only narrows the run when it can prove the narrowing is safe. A push to main always runs all four Python versions, so a wrong filter is caught within one merge.

## Step 3: split the rest into three shards

Each test job still ran the whole suite. I split the test files into three shards per Python version. I measured the seconds of every test file and balanced the three lists by those seconds. The lists live in `tools/ci_shards.json`, and one command rewrites them from the measurements.

```
one job   ##############################
shard 1   ##########
shard 2   ##########
shard 3   ##########
          each # is about 60 seconds
```

One job took 1,810 seconds of test time. Each shard takes about 603 seconds. The three shards run at the same time.

## Step 4: prove that nothing was dropped

Splitting creates a new way to fail. A shard can skip a test file and still report green. If a plan leaves out a job, a skipped job looks like a pass. I wanted neither.

So I added one check that always runs, last, named `result`. It is the only check a branch rule needs to require. It fails when any of these is true:

```
the plan job failed
a planned job was skipped
a planned job was cancelled
a shard wrote no report
a shard reports a test that did
  not start
two shards disagree about which
  tests exist
a test file is in no shard
the tests that ran are not all the
  tests found in the selected files
```

I tested the check with planted faults. One test makes a shard drop a test that never starts. Another adds a test file to no shard. Both must turn `result` red, and both do. The summary of a green run also lists what it did not run, with the reason. What the plan left out runs on main after the merge.

I did not trust the check until I saw it fail on purpose.

```
final result
   |
   v
every planned job passed?
every shard reported?
every test found also ran?
   |
   +-- no to any: red
   |
   v
yes to all: green, with a list of
anything not run and why
```

## Step 5: the same filter on a laptop

The builders did not need CI to tell them what to run. `tools/affected_tests.py` reads what differs from main and asks the same function as the CI plan, with the same map. A test proves it prints the same plan as CI for the same changed files. While building, a builder runs only the affected tests. The whole suite runs only when the tool prints `FULL SUITE`. GitHub CI stays the record.

## What I measured after

I read the run times from the Actions page for pull requests 73 to 89.

- A documentation only pull request: 1 minute 30 seconds for its first run.
- Pull requests that run the whole Python suite: 11 minutes 22 seconds to 12 minutes 4 seconds in the typical case.
- Heavier runs: 13 to 22 minutes, on pull requests 73, 80, 83, 84, 85 and 88. I checked these on GitHub. The extra time is waiting: when several runs overlap, their jobs wait for a free runner before they start.

Before, one job took 24.9 minutes. A typical full run now takes about 12. That is the 25 to 12 in the title.

## What I do not know yet

- I did not measure total runner minutes. Three shards per version repeat setup work, so the total may be the same or higher. The wait fell. The cost may not have.
- I cannot run the workflow file on my machine. A test pins its text, and the real run on GitHub is the record.
- The affected-only run can miss a test that reads a path built from data, or a path a child process reads from its working directory. The scanner cannot see those. A change inside `umwayi/` runs the whole Python suite for that reason.
- The four old check names no longer exist. A branch rule that requires them waits forever. I have to change that rule by hand, and I have not yet.

## What I took from it

1. Measure before you guess. My counts of which tests touch which folders were wrong by a wide margin, and the scan fixed them.
2. A filter that cannot prove it is safe should run everything.
3. Splitting a suite adds a failure you cannot see: a shard that drops a test and still reports green. Add a check that compares the tests found with the tests run.
4. A skipped job is not a pass. Say what was skipped and why.
5. Test your check by breaking things on purpose, and watch it go red.
6. Time spent waiting for a runner is not time spent running. With several builders pushing at once, runs overlap and queue, so a typical run time understates the wait.
