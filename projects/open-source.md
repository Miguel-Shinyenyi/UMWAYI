# Open Source

Started 2026-10-14. Miguel finds open source issues that match his path (MCP servers,
Postgres, Java and TypeScript backends, evals), works them one at a time, records each here,
and writes an article when a pull request merges. The work is public evidence of the skills
named in `MASTER_CONTEXT.md`, built on real code that other people maintain.

## How an issue gets worked

1. Pick an issue. Read the project's `CONTRIBUTING.md` first and follow it.
2. Check the issue is real and open: no existing pull request, no one assigned.
3. Ask the maintainers on the issue before coding if the project requires an accepted issue.
4. Reproduce the bug against the real code. Write the failing test first.
5. Fix it. Run the project's own tests, type check and lint. Compare old and new behavior on
   many generated inputs when the change touches safety checks.
6. Verify on a clean clone with the patch applied.
7. Claude hands over a patch and the text for the issue comment and the pull request. Miguel
   pushes the pull request from his own fork. Miguel reviews and understands every line first.
8. Record the result here. After a merge, decide on an article.

## Project rules learned so far

- supabase/mcp: a pull request must address an accepted issue. Open an issue first for new
  behavior. AI-assisted work is welcome, but a human reviews it and the pull request
  description includes verification steps and evidence. Use pnpm, run `pnpm build` once before
  the server tests (they import a built workspace package), and create an empty
  `packages/mcp-server-supabase/.env.local` for unit tests.

## Targets

Checked 2026-10-14, from the repositories' own pages. Counts change.

| Repository | Language | Why it fits | Status |
|---|---|---|---|
| supabase/mcp | TypeScript | Official MCP server for a Postgres platform. SQL, tests, tool safety. 75 open issues. | Active, first issue in progress |
| modelcontextprotocol/java-sdk | Java 17+ | Java backend skills. 142 open issues. Tests need Docker and npx. | Issue list not read yet |
| mclenhard/mcp-evals | TypeScript | Eval runner for MCP tools. Matches the Invoice-Financing evals. 7 open issues, small. | Check the repo is still active first |
| crystaldba/postgres-mcp | Python | Postgres MCP server. Weaker language match. | Low priority |
| modelcontextprotocol/servers | TypeScript | Reference servers only. | Skip |

## Issue log

### supabase/mcp #457: destructive-SQL check splits on semicolons inside string literals

- Status 2026-10-14: fix and tests built and verified. Waiting for a maintainer to accept the
  issue before a pull request is opened.
- Files, in `open-source/supabase-mcp/457/`: `quote-aware-split.patch` (apply to a fork of
  supabase/mcp), `issue-comment.md` (posted on the issue first), `pull-request.md` (the title
  and description, used after acceptance).
- The bug: `execute_sql` asks the client to confirm statements it should not. An `UPDATE`
  whose text value contains `;` is flagged as an update with no `WHERE`, and a value
  containing `; delete` or `; drop` is flagged as destructive. Clients that cannot answer the
  prompt wait until the tool times out.
- Root cause: both `isUpdateWithoutWhere` and `checkDestructiveQuery` split the SQL on every
  `;` before looking at quotes.
- The fix: one quote-aware split. It ignores `;` inside single-quoted strings (including `''`
  and `E'...'` backslash escapes) and double-quoted identifiers. It keeps splitting dollar-quoted
  bodies, so a `delete` inside a function body is still seen. A statement that contains
  `EXECUTE` is also checked as plain fragments, so dynamic SQL such as
  `EXECUTE 'SELECT 1; DROP TABLE films'` is still flagged. An unterminated quote falls back to
  the old plain split, so the check fails closed.
- Verification, run here: 19 new tests in `destructive-sql.test.ts`, 7 failed before the fix
  and all pass after. Full unit suite on a clean clone with the patch: 435 of 436 pass. The one
  failure is `index.test.ts`, which also fails without the patch because it needs network
  access this environment lacks. Lint and type check clean. A differential run over 200,000
  generated statements found 211 inputs that were flagged before and are not now. All 211 only
  have destructive words inside quoted text. It found 422 inputs that are newly flagged, all
  involving `EXECUTE` and quotes, which is the safe direction.
- Not verified: behavior against a live Supabase project. The `index.test.ts` failure was not
  run with network access.
- Shortlist for the next issues in the same repo: #361 read-only mode, #395 `list_tables`
  default schema differs from its docs, #381 `list_tables` primary key ordering, #311
  `execute_sql` backslash escaping in PL/pgSQL, #392 Edge Function filenames on Windows.

## Articles

One article per merged pull request, written after the merge or a substantive review. No more
than two articles on the same point. Check `backlog.md` and the published articles first.
Before an article names a company or its repository, check the site's naming rule in
`site/README.md` against Miguel's current applications.

Candidate after #457 merges: why splitting SQL on `;` fails, how to make a safety check fail
closed, and how a differential test finds the cases a hand-written test misses.

## Decisions log

| Date | Decision | Why |
|---|---|---|
| 2026-10-14 | Claude builds and verifies each fix here and hands over a patch. Miguel opens the pull request. | Claude cannot push to Miguel's repositories. Verification happens before handoff. |
| 2026-10-14 | First issue: supabase/mcp #457. | Small, clear tests, matches SQL and safety-gate experience. |
| 2026-10-14 | Tracker lives in this file. | One place per project, like the others. |
| 2026-10-14 | One article per merged pull request. | Keeps articles tied to finished work. |

## Open questions

- Whether the maintainers accept #457. If there is no reply in about a week, ask once more, then
  move to the next issue.
- Which java-sdk issue to take. The issue list was blocked from the tools used here. Miguel
  opens the Issues tab and picks.
- Whether mcp-evals is still maintained.
- Whether the MCP server in Invoice-Financing should offer its read-only gate to
  supabase/mcp #361 as a design reference.