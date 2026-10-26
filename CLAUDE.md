# Working in the UMWAYI hub

Claude Code reads this file at the start of every task. Practices that apply to every project are in `~/.claude/CLAUDE.md`. This file adds what is specific here.

## Read in this order

1. `MASTER_CONTEXT.md`. The method, the standing principles, and the rules from caught mistakes. Read it before you change anything.
2. `docs/agent-practices.md` if the task is a Claude Code prompt or a working-practice change.
3. `site/README.md` if the task touches `site/`.
4. Only the project file for the project you are touching, under `projects/`.
5. `docs/understanding-first.md` and `docs/engineering-concerns.md` when you design, review or write code.
6. `archive/INDEX.md` only when a task needs history that was moved out of a working file. Do not read the archive otherwise.

## Rules that already apply

- This repo is public. Never restate a private item in a public file. Private material goes in `journal/entries/` (encrypted).
- Journal files are encrypted with git-crypt. Do not commit a key. Do not copy an entry whole into `site/`.
- `site/` files are built by the `miguel-site` repo. Before you finish a change under `site/`, run that build with your file in place. A content file with missing or wrong front matter fails the build and keeps every article from going live.
- Do not push unless the task says so.
- Also in `MASTER_CONTEXT.md` and still binding: no em dashes, replace from the live file, no company names on the site, solve the stated problem, and label every handed-over file with repo, path and new or replacement. Detail archived as A-007.
