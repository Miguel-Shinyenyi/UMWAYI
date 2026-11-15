# docs/plans/umwayi-os-what-it-is-and-roadmap.md: what umwayi-os is, what it is not, and the road to an AI-OS

Written 2026-11-14 and updated 2026-11-15, Africa/Nairobi. It starts from the owner's question of 2026-11-14: is umwayi-os an AI-OS or just a library? Decision (owner, D-59): put a plain statement in the repo, keep the Kiroween plan, and work toward the five missing things.

## The short answer

Today it is a library with a command line. The idea is an AI-OS. For Kiroween it is called a governing layer for AI agents, and the first line of the page says what that means.

## Text for the repo (task W39: a README section and docs/what-it-is.md)

Every claim must match docs/KNOWN-LIMITS.md in umwayi-os. The page may never say more than that file allows.

### What it is

- A governing layer for AI coding agents. It sits between the owner and the agents he runs.
- A Python library with no outside dependencies, and a command line (`umwayi`).
- It decides what an agent may do (Yes, No, Ask me first), records each decision in a tamper-evident logbook, caps spend with a budget, runs a goal as supervised tasks in separate git worktrees, and has a kill switch.
- Local first. It runs on the owner's machine and writes files in his project.

### What it is not

- Not a full operating system. No kernel, no hardware scheduler, no window system.
- Not a model and not an agent. It governs agents.
- Not a sandbox. It does not stop a process that never asks it.
- Not a security product, and not a substitute for review of what agents write.
- Not a hosted service. No account, no cloud part, no telemetry.
- Not affiliated with or endorsed by the makers of any agent it can run.

### What it does

- Rules gate: Yes, No or Ask me first, and it fails closed. Exit codes 0, 2, 3 and 64. Never 1.
- Logbook: append only and hash chained. A hand edit or a date that goes backwards is detected.
- Budget governor: counts spend in UU, an internal unit that is not money, and refuses past the cap.
- Goal supervisor: one task per worktree and branch, and it stops when the owner is needed.
- Kill switch: one file, `.umwayi/KILL`.
- Local backend and pages: 127.0.0.1 only, behind a token, read only.
- Feedback export: a logbook summary with no paths, commands or file contents.

### What it does not do

- It does not enforce limits on a process that skips the hooks. Enforcement is cooperative today.
- It keeps no shared memory between agents or runs, beyond the logbook and the budget.
- It does not install or manage agents as packages.
- It sends nothing off the machine.
- It handles no passwords, keys or tokens of the owner's accounts.
- It gives no legal, financial or security advice.
- It does not make agent output correct. The owner reviews.

### Where it has been proven, and where not

- In tests, against fake agents and fixtures: the whole suite, on Python 3.10 and 3.13 for each pull request and on 3.10 to 3.13 for main.
- Real runs, 2026-11-15, one Mac, one run each: Claude Code 2.1.322, OpenCode 2.3.0 on its free route, Kiro CLI 3.3.0. The kill switch and missing rules stopped each start. With the switch off each agent ran and answered.
- Found by those runs: a good Claude Code run ends with exit 2 and settles the full reservation, because its token counts arrive under `asDouble` and umwayi requires `asInt` (task W45). OpenCode and Kiro send no cost report, so their runs settle as unknown at the worst case.
- Not yet proven: a real goal run from start to end (W9.11), the chat over ACP with a real Claude Code, Windows, and the High tier of the interface on real devices.

### Status

Early and experimental. Built for a hackathon and still changing. Interfaces and file formats can change. Use it on a project you can restore from git. No warranty.

## The five things missing for the AI-OS claim

| Task | What | First step | Owner decision |
| --- | --- | --- | --- |
| W40 | Proof on real agents | A record format for a real run; the owner's by-hand runs with each agent and the tiny real goal run. The README may not say "runs with X" until that record exists | No |
| W41 | Enforcement beyond cooperative | A design page that compares a launcher with a scrubbed environment, optional OS confinement, and detect-after | Yes: the owner picks before any build |
| W42 | Shared memory for agents | Design first: append-only notes, size capped, no secrets, through the rules gate and the logbook; the owner can read and delete | Yes |
| W43 | Agents as installable apps | A manifest, `umwayi agent list`, `show` and `run` through the supervisor; the Steward first | Yes: the owner approves what an agent may ask for |
| W44 | One front door | `umwayi up`, after the login wizard (W28), the goal map data (W37) and the live read (W38b); from clone to a running goal in under ten minutes | No |

Smaller tasks from the real runs: W45 (accept a whole-number `asDouble` token count; owner said yes, D-63) and W46 (docs: the Kiro hook file must use the resolved path, because on macOS `/var` is `/private/var`).

## Order

W39 first (docs only). Then W45, W40 and W44. For Kiroween (submit Dec 3) only W39, W40, W44 and a Steward demo are needed. W41 to W43 are shown as the roadmap and named in the limits.

## Not checked

- The text above is the brief for W39. The builder checks each line against the code, and may drop a line that is not true.
- One real run for each agent on one machine is a first proof, not a test.
