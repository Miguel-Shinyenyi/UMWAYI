# Agent practices

## Purpose

How context, prompts and checks are set up so an agent (Claude here, Claude Code in the project repos) does the right work with the least context. Five practices: trigger, structure, steering, pruning, and verification first. They apply to every project, not one. The shared version lives in a user-level `~/.claude/CLAUDE.md` on Miguel's machine. Each repo adds its own `CLAUDE.md` with the routing and rules for that repo. They are Miguel's own notes from watching engineers who work with AI, recorded as his understanding, not as checked statements of what those engineers said. This file records where each one already exists, where it does not, and the rules added on 2026-10-13.

## Current state

### The five practices, and where they already exist

Trigger: decide what to load, weighing the cost of context against the cost of confusion.
- Exists: `docs/DOCS_MAINTENANCE.md` in Invoice-Financing has a table of "when to update which file". The "read first" lists in each Claude Code prompt name only the docs for that task.
- Gap: no root `CLAUDE.md` in Invoice-Financing, so nothing makes Claude Code read the maintenance rules or limits what it loads. Added in this change.
- Gap: `MASTER_CONTEXT.md` loads about 170 lines of rules every session, and most of the site rules also sit in `site/README.md`. Duplicated context.

Structure: keep material for one branch out of the main context.
- Exists: the hub and its spokes, one doc per component with a fixed four-section format (Purpose, Current state, Decisions log, Open questions), site rules in `site/README.md`, project detail in `projects/`.
- Gap: the site rules are repeated in two places. Pointing to one source would cut the always-loaded part.

Steering: guide the model through groundwork first, in small steps, and do not show it later phases it will rush toward.
- Exists: Claude Code prompts open with "decisions already made", a "read first" list and hard safety rules. The explain-back method itself is steering: answer cold before looking.
- Gap: the long prompts (the Lab UI prompt had eight parts, shown all at once) hand over every phase on the first turn. The Lab prompt later needed a patch (Part 4B) after a completeness question.
- Rule added: prompts with more than three parts are run in stages with a gate after each, and later parts are held back until the earlier one passes its checks.

Pruning: remove what is stale so it stops costing context.
- Exists: in Invoice-Financing, "docs describe the current state; old approaches get deleted" is a written rule.
- Gap: the hub does the opposite on purpose. `backlog.md` (about 400 lines) and `SYNC_LOG.md` (about 440 lines) only grow, because the rule is never to delete a line. Every session that reads them pays for the closed items.
- Not changed: this conflicts with a standing rule, so it is an open decision (see Open questions and `backlog.md`).

Verification first: decide how to check the work before doing it, like test-driven development.
- Exists: TDD and Testcontainers in the settlement engine, "verify against real code, builds and running pages" as a standing rule, a report-back section in every prompt that separates verified from unverified.
- Gap: in the prompts, the verification section comes last, after the work. A completeness check on the spec itself was missing, which is how the Lab prompt missed traces, alerts and health views until asked.
- Rule added: every Claude Code prompt starts with its acceptance checks, and each stage may not start until the previous stage's checks have run. Before a spec is handed over, check it against a list of what the finished thing must expose or cover.

### Where the practices live, by project

| Project | Where | State on 2026-10-13 |
|---|---|---|
| All projects | `~/.claude/CLAUDE.md` (user level, on Miguel's machine) | New. Read by Claude Code in every repo. |
| Invoice-Financing | `CLAUDE.md` at the repo root, on `dev` | New. Routes to the right doc, adds stage gates and checks first. |
| Routine Machine | `CLAUDE.md` at the repo root, on `main` | New. The repo already had TDD-first and "build only the current phase" in `PROJECT.md`, which are verification first and steering. Adds routing and a known risk. |
| miguel-site | `CLAUDE.md` at the repo root, on `main` | New. Adds routing, the content-lives-in-UMWAYI rule, and build checks before a page counts as done. |
| UMWAYI (this hub) | `CLAUDE.md` at the repo root, and `MASTER_CONTEXT.md` | New file. `MASTER_CONTEXT.md` already held the standing principles. |

The user-level file works only for Claude Code on Miguel's own machine. For work done in this assistant, the same rules sit in `MASTER_CONTEXT.md`.

### The prompt template

A Claude Code prompt contains, in this order:
1. Goal and the reason for it, in two or three sentences.
2. Decisions already made, so the agent does not reopen them.
3. Read first: only the files for this task.
4. Acceptance checks: the commands and observable results that prove each stage is done, written before the work.
5. Stage 1 only. Later stages are named in one line each and described when they are reached.
6. Safety rules, each with the test that proves it.
7. Report back: what was built, real outputs of the checks, what could not be done, what changed from the prompt.

### Rules for this hub

- Before handing over a prompt, check it against what the finished thing must cover, not only against what was asked.
- Before handing over a file that goes into a build (anything under `site/`), run the build with the file in place. A file's shape, such as front matter, is part of its content.
- Every file handed over states its repo, its exact path, and whether it is new or a full replacement. Text to append says which file and where.

## Decisions log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-10-13 | Add a root `CLAUDE.md` to Invoice-Financing that routes Claude Code to the maintenance rules and to only the docs for the component it touches | Trigger and structure: the repo had maintenance rules but nothing that made an agent read them |
| 2026-10-13 | Staged prompts with gates once a prompt has more than three parts | Steering: an agent that sees every phase tends to rush toward the end, and the Lab prompt needed a late patch |
| 2026-10-13 | Acceptance checks come first in every prompt | Verification first: the checks define done before any code exists |
| 2026-10-13 | Pruning is raised as an open decision, not applied | It conflicts with the rule to never delete a backlog line |
| 2026-10-13 | The practices apply to every project, with a shared user-level file and one `CLAUDE.md` per repo | Miguel asked for it. Rules written once at user level stop each repo drifting, and each repo keeps its own routing |
| 2026-10-13 | Every handed-over file states repo, path and new or replacement | A replacement without front matter broke a site build on 2026-10-09 

## Open questions

- Pruning the hub. Options: move closed backlog items and old sync log entries to an archive file in the same repo (nothing deleted, less always-read text), or keep everything in place. Needs Miguel's decision because it changes a standing rule.
- Do the practices improve outcomes? A test: count the corrections needed after each Claude Code run (patches, missed requirements, claims that turn out unverified). Compare the Lab prompt (one late patch) with the next prompts. Not yet measured.
- Should the site rules in `MASTER_CONTEXT.md` become a pointer to `site/README.md`? It would shrink the always-loaded context, and it moves a rule, so it needs a decision.