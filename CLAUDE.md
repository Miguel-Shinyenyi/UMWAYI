# Working in the UMWAYI hub

Claude Code reads this file at the start of every task. Practices that apply to every project are in `~/.claude/CLAUDE.md`. This file adds what is specific here.

## Read in this order

1. `MASTER_CONTEXT.md`. The method, the standing principles, and the rules from caught mistakes. Read it before you change anything.
2. `docs/agent-practices.md` if the task is a Claude Code prompt or a working-practice change.
3. `site/README.md` if the task touches `site/`.
4. Only the project file for the project you are touching, under `projects/`.
5. `docs/understanding-first.md` and `docs/engineering-concerns.md` when you design, review or write code.
6. `docs/agent-principles.md` when you design or run an agent. Every rule there carries a source line in the notes.
7. `docs/core-rules.md` on every task: use each tool's strengths and do not rebuild it, consult the council, ask whether we are going live (then `docs/pre-launch-security.md`).
7. `archive/INDEX.md` only when a task needs history that was moved out of a working file. Do not read the archive otherwise.

## Rules that already apply

- This repo is public. Never restate a private item in a public file. Private material goes in `journal/entries/` (encrypted).
- Journal files are encrypted with git-crypt. Do not commit a key. Do not copy an entry whole into `site/`.
- `site/` files are built by the `miguel-site` repo. Before you finish a change under `site/`, run that build with your file in place. A content file with missing or wrong front matter fails the build and keeps every article from going live.
- Do not push unless the task says so.
- Clean up after an update. Once a handed-over folder, file or zip is applied, merged to `main` and `main` is pulled, move exactly those items out of `~/Downloads` into the Trash. Never delete permanently. Touch only what this task applied. Before moving, copy anything Miguel still has to use himself (for example a `CMU/` upload file) to `~/Documents` and say where. If the PR did not merge, keep the items. End the report with the list of what moved.
- Also in `MASTER_CONTEXT.md` and still binding: no em dashes, replace from the live file, no company names on the site, solve the stated problem, and label every handed-over file with repo, path and new or replacement. Detail archived as A-007.
