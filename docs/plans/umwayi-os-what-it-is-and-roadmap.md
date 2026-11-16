UMWAYI-OS: WHAT IT IS, WHAT IT IS NOT, AND THE ROAD TO AN AI-OS
Drafted 2026-11-14 from the owner's question "is umwayi-os an AI-OS or just a library?". Owner approved: put disclaimers in the repo, work toward the five missing things, keep the Kiroween plan (freeze Nov 29 to Dec 2, submit Dec 3).

CORRECTION 2026-11-16 (owner, 13:41). Earlier versions of this page and of the hub were written from the build-time view: an outside guide (Claude) reviewing and merging, Kiro web tabs building. That is how umwayi-os is being BUILT. It is not how it RUNS. Read every line below as: the runtime is the owner plus umwayi's own internal supervisor (a Claude session in the goal guide role). Where an old line says Claude, the guide or a Kiro tab, it means build-time only.

PART 1. TEXT FOR THE REPO (README section "What this is and is not", full page docs/what-it-is.md)

What it is
- A governing layer for AI coding agents. It sits between you and the agents you run.
- A Python library with no outside dependencies, and a command line (umwayi).
- It decides what an agent may do (Yes, No, Ask me first), records every decision in a tamper-evident logbook, caps spend with a budget, runs a goal as supervised tasks in separate git worktrees, and gives you a kill switch.
- Local first. It runs on your machine and writes files in your project.

What it is not
- Not a full operating system. No kernel, no scheduler for hardware, no window system.
- Not a model, and not an agent. It does not think. It governs agents that do.
- Not a sandbox. It does not stop a process that never asks it (see "Limits").
- Not a security product, and not a substitute for review of what agents write.
- Not a hosted service. There is no account, no cloud part and no telemetry.
- Not affiliated with or endorsed by Anthropic, Amazon, Kiro, OpenCode or any agent it can run. Names belong to their owners.

What it does
- Rules gate: answers Yes, No or Ask me first for an action. It fails closed. When it cannot decide, the answer is not Yes. Exit codes: 0 yes, 2 no or crash, 3 ask me first, 64 usage error. Never 1.
- Logbook: append-only, hash-chained. A hand edit or a date that goes backwards is detected.
- Budget governor: counts spend in UU (an internal unit, not money) and refuses past the cap.
- Goal supervisor: splits a goal into tasks, runs each in its own worktree, one task per branch, and stops when the owner is needed.
- Kill switch: one file (.umwayi/KILL) stops everything.
- Local backend and pages: a read-only view on 127.0.0.1 behind a token. No page or endpoint starts a process or writes a file.
- Feedback export: a summary of the logbook with no paths, no commands and no file contents.

What it does not do
- It does not enforce limits on a process that skips the hooks. Enforcement is cooperative today.
- It does not keep shared memory between agents or runs, beyond the logbook and the budget.
- It does not install or manage agents as packages yet.
- It does not send anything off your machine without a typed yes (feedback send, when built). Nothing is sent now.
- It does not handle your passwords, keys or tokens. It never passes KIRO_API_KEY.
- It does not give legal, financial or security advice.
- It does not make agent output correct. Agents can be wrong. You review.

Where it has been proven, and where it has not
- Proven in tests: the rules gate, logbook, budget, supervisor and goal commands, against fakes and fixtures, on Python 3.10 and 3.13 in CI.
- Proven by hand on a tester's Mac: the walkthrough tests (state the date, the Python version and the result in the release notes).
- Not yet proven: runs with real Claude Code, Kiro and OpenCode, and a real goal run end to end (tracked as W40).
- Windows: state "untested" unless a run proves otherwise.
- The High tier of the interface is untested on real devices.

Status
- Early and experimental. Built for a hackathon and still changing. Interfaces and file formats can change between versions. Use it on a project you can restore from git.
- No warranty. Read LICENSE.

Pointers
- docs/KNOWN-LIMITS.md is the full list of limits. This page must never claim more than that file allows.

PART 2. THE FIVE THINGS STILL MISSING, AS TASKS
Rules for all: one task, one PR, new worktree from newest origin/main, python -m tools.merge_main only before pushes (exit 3 means the helper stops and the supervisor or the owner is told with the printed paths), limits part unnumbered, no hand edit of generated docs, add the entry to .kiro/specs/umwayi-os/tasks.md, no em dashes, tests use today's UTC date, register tests in tools/ci_map.json and the shards file, report when CI is green and no conflicts, say what could not be verified. Owner-decision review where marked.

W39 (docs only, do first, small): write README section and docs/what-it-is.md from PART 1 above. Every claim must match docs/KNOWN-LIMITS.md. Add a test that the README links the page and that the page names each heading (What it is, What it is not, What it does, What it does not do, Where it has been proven, Status). Review: the merge-ready check, then the supervisor or the owner. No owner decision.

W40 (proof on real agents): owner and tester task, with a small builder part. Builder part: a record format for a real run (agent name, version, date, goal id, result, logbook chain status, budget spent, what broke), a command or doc step that exports it with umwayi feedback export, and a section in docs/what-it-is.md that is only updated from these records. Owner part: W9.11 tiny real goal run, a real Claude Code run, a real Kiro run, a real OpenCode run, each by hand on his machine, results recorded. Nothing in the README may say "runs with X" until its record exists.

W41 (enforcement beyond cooperative, owner-decision review, design first): step 1, a design page docs/enforcement.md comparing options with their limits: (a) launcher that starts the agent with a scrubbed environment, the worktree as working directory and the kill switch checked, (b) OS confinement where available (Linux bubblewrap or Landlock, macOS sandbox-exec) as an optional layer that is off when the tool is missing, with a plain message, (c) detect-after (compare the worktree and logbook for actions that were never asked). Recommend one for a first build. Step 2 (only after the owner picks): build umwayi run, which starts an agent under the chosen confinement. Honest rule: never claim more than the tests prove; say which platforms.

W42 (shared memory for agents, design first): docs/memory.md and a small store: append-only notes an agent may write and a later run may read, labelled by task and date, size-capped, no secrets (reuse the logbook secret refusal), readable and deletable by the owner with one command, every write goes through the rules gate and the logbook. Not a vector database. Not automatic: a run reads only what the goal names.

W43 (agents as installable apps): a manifest format for an agent (name, version, what it may ask for, budget default, entry command), a folder agents/, commands umwayi agent list, show, run (run goes through the supervisor and the rules gate, never around them). Package the Steward as the first real agent. The manifest cannot grant itself permissions: the owner approves what it may ask for, once, in a real terminal. Owner-decision review.

W44 (single front door): umwayi up starts the local backend, opens the goal map page and prints the token location, after W28 (login wizard), W37 (goal map endpoint) and W38 (goal map page) are merged. One page in the README that gets a new user from clone to a running goal in under ten minutes, checked by the tester on a clean machine.

ORDER
Now, queued behind W37, W38, W9.10, W35: W39 first (small, docs). Then W40 (owner by hand), W44 (after W28, W37, W38), W41 step 1, W42 design, W43. (Replaced on 2026-11-16: dates are guidelines, all of W39 to W44 and everything after is planned work. Kiroween on Dec 3 shows what works then and names the rest in the limits.)

PART 3. SCOPE MAP AS AN AI OPERATING SYSTEM FOR AI AGENTS (2026-11-16, main b247b66)
Like an operating system, umwayi-os runs processes (helpers and goals), controls their access to resources and keeps an audit trail. It is not a kernel and not a sandbox (see Part 1). Counts from the spec checkboxes: 231 ticked, 45 open (some are owner checks or options). Merged since Nov 15 17:15: PR 112 to 134.

1 PROCESSES (scheduler). Built: the goal supervisor, one task per worktree, stall and loop checks, goal commands. Remaining: W65 work ledger and the probe (design running), W9.14 retry run by the owner with a new budget (building), W9.12 several tasks in review, W9.16 scope enforced during a run (owner).
2 PERMISSIONS (system call gate). Built: rules gate (Yes, No, Ask me first, fails closed), adapters for Claude Code, Kiro, OpenCode, W56 blocked builder names the rule. Remaining: enforcement beyond cooperative. W41 design merged, build not started (launcher with scrubbed environment, optional OS confinement), W64 hides the SSH agent from helpers (building).
3 RESOURCES. Built: budget governor in UU, W54 design (the system proposes, the owner approves). Remaining: W54 build, W48 routing build (design merged).
4 AUDIT AND SIGNALS. Built: hash-chained logbook, kill switch. Remaining: W49 and W50 provenance and verify (design merged, build after the owner picks), a dedicated umwayi signing key for the unattended supervisor (owner approved, design note E5, key generation is the owner's step).
5 SHARED MEMORY. Design on a branch (W42), not merged, not built.
6 APPS. Design on a branch (W43, agents as installable apps, Steward first), not merged, not built.
7 DRIVERS. Built: Claude Code and Kiro through agent run; OpenCode wired over ACP but agent run refuses it. Remaining: W9.13 non interactive ACP run; per helper CLI table for listing, resuming, interrupting and probing sessions (E9, all commands untried until a real run).
8 FRONT DOOR AND SELF SUPERVISION. Built: umwayi CLI, local read only pages, umwayi up (W44), live goal map (W38b), umwayi schedule. Remaining: the supervisor running by itself on a timer (W65, E4), audit fixes E1 to E9 (wording that assumed the outside guide, merge ready check as a deterministic command, advise entries bound to machine checks).
PROOF. No real Claude Code, Kiro or OpenCode goal run is recorded end to end (W40, owner on the Mac). The README may not say runs with X until a record exists. Windows and the High tier are untested.
DATES (guidelines): testers Nov 21 to 24, demo URL by Nov 23, freeze Nov 29 to Dec 2, submit Dec 3. The owner submits Devpost.
9 CONNECTORS (free tier, 2026-11-16). Vercel Hobby for the pages (live), Neon (free serverless Postgres, the owner's choice) as an optional store later, compute for a read only demo backend on a free host, email and a free push service for needs owner stops, GitHub free features (Actions, Dependabot, secret scanning, CodeQL, gh CLI read only connector), OSV and npm audit on a schedule, local models. Each is opt in, one gate entry, credential given by the owner and never stored by umwayi. The core stays at zero network. Plan: project doc claude/umwayi-os-task-queue-2026-11-16.txt, F7 and F7a.
10 MULTI USER (later, off by default). umwayi serve stays local. A shared mode for several people on one account needs identity, roles, per person and group budgets, a shared append only logbook with the hash chain and an outside anchor (Neon is a candidate store, the local file stays the default), per scope kill switches, and a network attacker model. Design W74 in the queue doc, F11.
