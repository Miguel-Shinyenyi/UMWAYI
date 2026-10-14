# Open Source

Started 2026-10-14. Miguel finds open source issues that match his path (MCP servers,
Postgres, Java and TypeScript backends, evals), works them one at a time, records each here,
and writes an article when a pull request merges. The work is public evidence of the skills
named in `MASTER_CONTEXT.md`, built on real code that other people maintain.

## How contributions work

Contributing is communication over weeks, not a fix delivered once. The full loop, the
evidence behind it and the checks to run before building are in `docs/open-source-process.md`.
Short version: scout the live thread, check for existing pull requests, ask the maintainers,
wait while working a different issue, build and prove, open a small pull request, answer review
within a day, record every date. At most three issues run at once. Claude builds and verifies.
Miguel reads and understands every line and is the one who posts and opens pull requests.

## Project rules learned so far

- supabase/mcp: a pull request must address an accepted issue. Open an issue first for new
  behavior. AI-assisted work is welcome, but a human reviews it and the pull request
  description includes verification steps and evidence. Use pnpm, run `pnpm build` once before
  the server tests (they import a built workspace package), and create an empty
  `packages/mcp-server-supabase/.env.local` for unit tests. The pull request template asks
  for a "How to Review" reading path and a Verification section with evidence.
- modelcontextprotocol/java-sdk: agree scope in an issue first for anything non-trivial. Pull
  requests opened without that may be ignored or closed. Do not take an assigned issue. Add
  commits instead of force-pushing. A human stays accountable for AI-assisted work. Labels
  such as `ready for work`, `needs repro` and `needs confirmation` say what the maintainers
  want next.

## Targets

Checked 2026-10-14, from the repositories' own pages. Counts change.

| Repository | Language | Why it fits | Status |
|---|---|---|---|
| supabase/mcp | TypeScript | Official MCP server for a Postgres platform. SQL, tests, tool safety. 75 open issues, 64 open pull requests. | Crowded. One issue in progress (#457). Most easy-looking issues are taken or not code here. |
| modelcontextprotocol/java-sdk | Java 17+ | Java backend skills. Labels show what maintainers want. Tests need Docker and npx. | The `good first issue` items each have two to five pull requests. `needs repro` and `needs confirmation` issues have none. |
| mclenhard/mcp-evals | TypeScript | Eval runner for MCP tools. | Dormant. Last commit June 2025. Dropped. |
| crystaldba/postgres-mcp | Python | Postgres MCP server. Weaker language match. | Low priority. |
| modelcontextprotocol/servers | TypeScript | Reference servers only. | Skip |

## Pipeline board

Three slots. Update the state and the dates every time something changes. Dates here are the
evidence for how long the process takes.

| Slot | Repository and issue | Kind | State | Next action | Waiting on | Since |
|---|---|---|---|---|---|---|
| 1 | supabase/mcp #457 (second half) | Fix, after #459 | Waiting. Comment posted 2026-10-14 asking which direction the maintainers want. | If no reply by 2026-10-21, one follow-up with new evidence only. Meanwhile test #459 against the real PostgreSQL parser and comment only if it finds something. | Maintainers | 2026-10-14 |
| 2 | modelcontextprotocol/java-sdk #859 | Reproduction | Scouted 2026-10-14, not started. Labelled `needs confirmation`. No pull request, no assignee. A maintainer called it an architecture limit. A second user reports a hang on Tomcat NIO2. | Build a minimal embedded-Tomcat reproduction with an async tool. Post the result on the issue. | Nobody | 2026-10-14 |
| 3 | modelcontextprotocol/java-sdk #882 | Reproduction | Candidate. Labelled `needs repro`, no comments. Not read yet. | Read the issue and decide. | Nobody | 2026-10-14 |

Looked at and set aside on 2026-10-14:

| Issue | Why not |
|---|---|
| supabase/mcp #395 | Two pull requests already open (#396, #397). |
| supabase/mcp #381 | Pull request #382 already open. |
| supabase/mcp #392 | Pull request #393 already open. |
| supabase/mcp #311 | A maintainer explained the cause and plans a fix with structured output (#316). |
| supabase/mcp #361 | The plugin settings page, not code in this repository. |
| supabase/mcp #442 | The migration bootstrap runs server side in the Management API. The repository has no such SQL. |
| supabase/mcp #241 | Needs an API change. A maintainer forwarded it internally. |
| supabase/mcp #318 | Maintainers keep it open on purpose while they ship elicitation. |
| java-sdk #1067, #303, #293, #257 | Between one and five pull requests each. |

## Issue log

### supabase/mcp #457: destructive-SQL check splits on semicolons inside string literals

- Status 2026-10-14: Miguel opened pull request #470 (https://github.com/supabase/mcp/pull/470)
  from the fork branch `fix/destructive-sql-quoted-semicolons`, before a maintainer accepted
  the issue. It is open with no reviews or comments. See the correction below before it is
  reviewed.
- Correction 2026-10-14, found after reading the issue thread: pull request #459 (by another
  contributor, reviewer-approved, not yet merged) already fixes the `UPDATE ... WHERE` half and
  leaves `checkDestructiveQuery` open on purpose. #470 overlaps it and is weaker on that half:
  it misses `UPDATE t SET note = E'it\'s done; see where it failed'` and the nested-comment
  cases that #459 now catches. Its `checkDestructiveQuery` half is unsafe: `DO 'begin perform
  1; drop table films; end'` and `CREATE FUNCTION f() ... AS 'begin; delete from films; end'`
  are flagged on main and pass silently on #470, because only `EXECUTE` was special-cased. The
  200,000-statement run below did not generate those shapes. #470 should not merge as it
  stands.
- Update 2026-10-14: #470 closed by Miguel with a note. The refined comment from
  `issue-comment.md` is posted on #457 (https://github.com/supabase/mcp/issues/457#issuecomment-6163066401).
  It asks the maintainers which direction they want for the `checkDestructiveQuery` half and
  offers a follow-up pull request once #457 is accepted and #459 has merged. Waiting on a reply.
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
- What was learned, 2026-10-14: the issue page showed no linked pull requests, but #459 already
  fixed half of it. The 200,000-statement check never generated `DO '...'` or
  `CREATE FUNCTION ... AS '...'` bodies, so a flaw that silences warnings for them went
  unseen. The reviewer of #459 used the real PostgreSQL parser as the oracle. The first
  shortlist of follow-up issues was built from titles and every item turned out taken or not
  code here. See the checks in `docs/open-source-process.md`.
- Dates to fill in as they happen: first maintainer reply to the comment on #457: ___.
  Review of #459 merged: ___.

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
| 2026-10-14 | Up to three issues in flight at once, one per slot on the board. | Waiting is long. Parallel slots keep work moving without more than Miguel can review. |
| 2026-10-14 | Contributions include reproductions, verification of other people's pull requests and docs, not only fixes. | The evidence shows fixes on popular issues are crowded and reproductions are not. |
| 2026-10-14 | No pull request until the thread is read in a browser, existing pull requests are searched and a maintainer has answered. | #470 was opened before the issue was accepted and duplicated #459. It was closed the same day. |

## Open questions

- Whether the maintainers accept a follow-up for the second half of #457, and which direction
  they prefer (a rule for when a quoted string is code, or a real parser). If no reply by
  2026-10-21, ask once more with new evidence, then leave it.
- Whether #859 can be reproduced outside the reporter's setup.
- Whether #882 is worth a reproduction.
- Whether the MCP server in Invoice-Financing should offer its read-only gate to
  supabase/mcp #361 as a design reference. #361 is not code in that repository, so this may
  need a different venue.
- How long a first maintainer reply takes in practice across these repositories. The board
  dates will answer it.