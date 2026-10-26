# Pruning candidates

Created 2026-10-26. Nothing here has been changed. Each item waits for your approval, one by one. Items are in the queue as P-01 to P-15 (`queue.md`).

Why this list exists: files that Claude Code reads at the start of every task cost reading time on every task. Text that duplicates another file, repeats history, or goes stale adds cost and risks two files disagreeing.

How to answer: for each ID say approve, keep, or change. I then hand over the replacement file in full, as usual. Nothing is deleted. Cut text moves to `archive/` (or to a history file inside the same repository) under the rules in `archive/README.md`: byte-for-byte, a pointer left behind, a row in `archive/INDEX.md` with a checksum and the commit that holds the original.

## Read at the start of every task (highest value)

| ID | File | What | Size | Evidence | Proposed action | Risk |
|---|---|---|---|---|---|---|
| P-01 | `routine-machine/PROJECT.md` | The status log (lines 190 to 328) | 27,486 of 31,067 words (88%) | `CLAUDE.md` in that repo says read `PROJECT.md` first, every task | Move the status log to `docs/status-log.md`. `PROJECT.md` keeps a pointer. Claude Code reads the log only when a task needs history | The log holds decisions; a task that needs one must be told to read the log |
| P-02 | `MASTER_CONTEXT.md` | "Current open threads" section (lines 209 to 246) | 504 words | Duplicates `backlog.md`, `queue.md` and the project files. It went stale before (see the rule on status claims) | Replace with a three-line pointer to `queue.md` | Loses the one-screen summary of every project |
| P-03 | `MASTER_CONTEXT.md` | The `(Caused: ...)` paragraphs inside 13 rules | 471 words | The rule line already states what to do; the story is history | Keep each rule plus one line of cause; move the full story to `docs/caught-mistakes.md` | You wanted the reason to stay visible. One line keeps it |
| P-04 | `MASTER_CONTEXT.md` | Site rules (lines 68 to 95): category, takeaway list, repetition, journal excerpts | 380 words | Same rules are in `site/README.md`, which is read when a task touches `site/` | Keep the rule about never naming companies. Replace the rest with a pointer. This is the open item H-028 | The rules then live in one place only, read only when touching `site/` |
| P-05 | `MASTER_CONTEXT.md` | Spokes table rows (lines 27 to 41), long status text for settlement engine, routine machine, site | 359 words | The status text duplicates `projects/*.md` and ages quickly | One line per spoke, with the file name | Less detail at a glance |
| P-06 | `MASTER_CONTEXT.md` | The open source rule (lines 62 to 67) | 101 words | Same content is in `docs/open-source-process.md` | One sentence and a pointer | None found |
| P-07 | `CLAUDE.md` (hub) | 5 of the 8 bullets under "Rules that already apply": no em dashes, replace-from-live, handover labels, no company names, solve the stated problem | about 130 words | Each is also in `MASTER_CONTEXT.md`, which is read first | Replace with "see `MASTER_CONTEXT.md`" | The CLAUDE.md copy is the first thing loaded; removing it relies on the next read |

## Read when touching a project or component

| ID | File | What | Evidence | Proposed action |
|---|---|---|---|---|
| P-08 | `projects/routine-machine.md` (hub) | "Reading tracker", "Hub integration", "Daily inventory it tracks", and the new "Hardening since 2026-10-19" list | The first two repeat `routine-machine/docs/hub-sync.md`; the last repeats `PROJECT.md` | Shorten to pointers; keep status and open questions |
| P-09 | `docs/agent-practices.md` | "Decisions log": 6 of 7 rows | The rows repeat rules in `MASTER_CONTEXT.md` | Keep dates, drop the repeated reasons, or archive |
| P-10 | Three repositories | `docs/understanding-first.md` and `docs/engineering-concerns.md` are byte-identical copies of the hub files (checked) | Two copies can drift | Recommend keep, with a one-line header "copy of the hub file; edit the hub first". Not a removal |
| P-11 | `Invoice-Financing`, `miguel-site`, `routine-machine` | The 10-line understanding-first section in each `CLAUDE.md` | Repeats the hub doc | Recommend keep. These repositories cannot see the hub files |
| P-12 | `routine-machine/frontend/AGENTS.md` | Next.js block | `next dev` rewrites it | Do not prune. It comes back |

## History files (not read at the start of a task)

| ID | File | What | Proposed action |
|---|---|---|---|
| P-13 | `backlog.md` | 50 answered lines, plus the 7 proposed closes if you approve them | Move answered lines to `backlog-archive.md`, so the file shows only open items marked `[>]` |
| P-14 | `SYNC_LOG.md` (531 lines) | Entries before 2026-10-01 | Move to `SYNC_LOG-archive.md`. New entries keep appending to the live file |
| P-15 | Backlog lines marked "proposed close" in `queue.md` (H-005, H-006, H-012, H-026, H-037, H-062, H-067) | Open lines whose evidence shows they are answered | Mark answered with a date and the evidence, one by one, on your yes |

## Not checked yet

`routine-machine/docs/backend.md` (19,987 words) and `docs/frontend.md` (17,021 words) are read per component. I did not inspect them for duplication with `PROJECT.md`. If you want them checked, it is a queued task, not part of this list.
`~/.claude/CLAUDE.md` (your user-level file) is not reachable from here.

## Conflicts with standing rules

P-13 and P-14 change the rule "never delete a line" to "never lose a line; archive it with a trace". You asked for that on 2026-10-26. MASTER_CONTEXT.md carries the new wording.

## Outcome (2026-10-26)

You approved the list. Every move is a row in `archive/INDEX.md`.

| Item | Result | Archive ID |
|---|---|---|
| P-01 | Moved to `docs/status-log.md` in routine-machine | A-001 |
| P-02 | Moved; pointer to `queue.md` | A-002 |
| P-03 | Each cause cut to one line; full text moved | A-003 |
| P-04 | Moved the two rules that `site/README.md` repeats (editing in `site/`, two articles per point). Kept the company-name, category, takeaways and journal-excerpt rules, because the README lacks parts of them. This differs from the list above. | A-004 |
| P-05 | Five spokes rows shortened; originals moved | A-005 |
| P-06 | Reduced to one sentence; full rule moved | A-006 |
| P-07 | Four bullets and the handover section moved; one summary line left | A-007 |
| P-08 | Four sections moved; pointers left | A-008 |
| P-09 | Five of seven rows moved; routing and pruning rows kept | A-009 |
| P-10, P-11, P-12 | Kept, as recommended | none |
| P-13 | 57 answered blocks moved | A-010 |
| P-14 | 396 lines of entries before 2026-10-01 moved | A-011 |
| P-15 | Seven items marked answered, then moved with P-13 | A-010 |
