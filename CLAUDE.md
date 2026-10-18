# Working in the UMWAYI hub

Claude Code reads this file at the start of every task. Practices that apply to every project are in `~/.claude/CLAUDE.md`. This file adds what is specific here.

## Read in this order

1. `MASTER_CONTEXT.md`. The method, the standing principles, and the rules from caught mistakes. Read it before you change anything.
2. `docs/agent-practices.md` if the task is a Claude Code prompt or a working-practice change.
3. `site/README.md` if the task touches `site/`.
4. Only the project file for the project you are touching, under `projects/`.
5. `docs/understanding-first.md` and `docs/engineering-concerns.md` when you design, review or write code.

## Rules that already apply

- This repo is public. Never restate a private item in a public file. Private material goes in `journal/entries/` (encrypted).
- Nothing under `site/` names a company Miguel applied to or interviewed with. His current employer may be named.
- Journal files are encrypted with git-crypt. Do not commit a key. Do not copy an entry whole into `site/`.
- `site/` files are built by the `miguel-site` repo. Before you finish a change under `site/`, run that build with your file in place. A content file with missing or wrong front matter fails the build and keeps every article from going live.
- When you replace a file that already exists, start from the live file. Keep its front matter. Hand back the whole file.
- No em dashes in anything written here.
- Do not push unless the task says so.
- Solve the problem as the person states it. Do not draft, follow up or audit before you are asked.

## Every file you hand over

State, for each file: the repo, the exact path, and whether it is new or a full replacement. If text must be added to an existing file, say which file and where.