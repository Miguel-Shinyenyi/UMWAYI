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
| supabase-community/supabase-kt | Kotlin Multiplatform | Official Kotlin client for Supabase. Auth, JWT and Ktor on the JVM match the backend work. Maintainer replies and merges small pull requests in days. | One issue in progress (#415). Contribution rules include an AI policy: do not rely on AI for logic code. Default branch is `master`. |
| PostHog/posthog-android | Kotlin (JVM and Android) | The Java server SDK now lives in `posthog-server` here. Feature flags, HTTP and tests match backend work. Outside contributors merge `posthog-server` PRs in 3 to 8 days. | One issue in progress (#577). Has an `AI_POLICY.md` and an `AGENTS.md`: disclose AI help in the PR, prove the change works, do not paste AI output into issues. Public API needs an agreed issue first. |
| spring-projects/spring-ai | Java (Spring) | The MCP annotation support moved into `mcp/mcp-annotations`. Reactive tool methods and the MCP Java SDK match backend work. Contribution rules accept AI-assisted work with human accountability and require a DCO sign-off. | One item in progress (#4542, verification of PR #6932). Crowded: four PRs for one issue. |
| mclenhard/mcp-evals | TypeScript | Eval runner for MCP tools. | Dormant. Last commit June 2025. Dropped. |
| crystaldba/postgres-mcp | Python | Postgres MCP server. Weaker language match. | Low priority. |
| modelcontextprotocol/servers | TypeScript | Reference servers only. | Skip |

## Pipeline board

One row per issue, no cap on the number. Update the state and the dates every time something changes. Dates here are the
evidence for how long the process takes.

| Slot | Repository and issue | Kind | State | Next action | Waiting on | Since |
|---|---|---|---|---|---|---|
| 1 | supabase/mcp #457 (second half) | Fix, after #459 | Waiting. Comment posted 2026-10-14 asking which direction the maintainers want. | If no reply by 2026-10-21, one follow-up with new evidence only. On 2026-10-14 hexproof-dev suggested in the thread that a dollar-quoted body after `=`, `||`, `(`, `,` or `VALUES` is a value and one after `DO`, `AS` or `EXECUTE` is code. Test that rule first, including single-quoted code strings after `DO` and `AS`, which my fix missed. Test #459 against the real PostgreSQL parser and comment only if it finds something. | Maintainers | 2026-10-14 |
| 2 | modelcontextprotocol/java-sdk #859 | Reproduction | Comment posted 2026-10-14: confirmed that a `tools/call` blocks a Tomcat worker and that requests queue (maxThreads 2, six calls finish in pairs), on 2.0.0 and 2.0.1, NIO and NIO2. The reported NIO2 hang did not reproduce. Asked the reporter for how the tool is wired and a thread dump. Labelled `needs confirmation`, no pull request, no assignee. | Correction needed: the reporter had already written that the failing tool calls an API on the same Tomcat, over HTTPS, on the same NIO2 connector. The reproduction used a separate loopback stub with no TLS, and the comment asked for details the reporter had given. Next: a second reproduction with a tool that calls back into the same connector, on NIO2, with a small and the default `maxThreads`, plain and TLS. Then one short comment that says the setup was missed and gives the result. Do not open a pull request: a maintainer called it an architecture limit. | Reporter and maintainers | 2026-10-14 |
| 3 | modelcontextprotocol/java-sdk #882 | Reproduction | Comment posted 2026-10-14: reproduced the exact timeout message on 1.1.0, 1.1.4 and 2.0.1 against a stub server. Named the server replies that cause it (initialize answered with an empty body, or notifications/initialized answered with an SSE stream that sends no data event). Asked the reporter for `curl -i` output of both requests and whether a proxy sits between. Asked the maintainers whether a client fix would be welcome. Labelled `needs repro`, no pull request, no assignee. | If no reply by 2026-10-21, one follow-up only with new information. Open a pull request only if a maintainer says a client fix is wanted. Optional edit to the posted comment: it says the exact error reproduced on all three versions, but some rows hit the exact message in 5 to 8 of 9 runs and the rest gave the same 20 second timeout from another operator. | Reporter and maintainers | 2026-10-14 |
| 4 | supabase-community/supabase-kt #415 | Design proposal | Comment posted 2026-10-14 (https://github.com/supabase-community/supabase-kt/issues/415#issuecomment-6165902586). Research found that `Auth#getClaims()` (PR #1141, merged 2026-02-06) already covers the core. The comment lists what a backend still lacks and asks five design questions. Labelled `enhancement` and `help wanted`, no assignee, no pull request. | If no reply by 2026-10-21, one follow-up only with new information. No code until the maintainer answers. The maintainer discourages AI for logic code, so Miguel writes or fully understands every line. | Maintainer | 2026-10-14 |
| 5 | PostHog/posthog-android #577 | API proposal | Comment posted 2026-10-14 (https://github.com/PostHog/posthog-android/issues/577#issuecomment-6166156307). `getRemoteConfigPayload` exists in Node.js and Python but not in `posthog-server`, and no sdk-spec defines it, so CONTRIBUTING requires an agreed API shape first. The comment proposes `getRemoteConfigPayload(key: String): Any?` on `PostHogInterface` and asks four questions. Labelled `enhancement`, `feature/feature-flags`, `server`. No assignee, no pull request. | If no reply by 2026-10-21, one follow-up only with new information. No code until a maintainer agrees on the shape. A prototype may be built locally; it stays local until then. | Maintainers | 2026-10-14 |
| 6 | spring-projects/spring-ai #4542, PR #6932 | Verification of others' PRs | Comment posted 2026-10-14 on PR #6932 (https://github.com/spring-projects/spring-ai/pull/6932#issuecomment-6166871010), the open PR that passes style and all tests (no maintainer review yet; the page shows a maintainer mentioning the closed #6158 on it, which is not a choice). Tested both open fixes (#6932, #6830) against Spring AI 2.0.1. Both fix the report; #6932 passes style and all 1376 tests and #6830 does not. Both break `Flux` with `generateOutputSchema = true` and drop received elements on a mid-stream error. PR has no review, no assignee, label `status: waiting-for-triage`. | If no reply by 2026-10-21, one follow-up only with new information. Do not open a competing PR. Watch whether #6932 merges and whether a backport to 2.0.x or 1.1.x is discussed. | Maintainers | 2026-10-14 |

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

### modelcontextprotocol/java-sdk #859: servlet transports call `block()` on the request thread

- Status 2026-10-14: reproduction built and run, comment posted
  (https://github.com/modelcontextprotocol/java-sdk/issues/859#issuecomment-6165245669). No pull
  request.
- Files, in `open-source/java-sdk/859/`: `results.md` (tables and evidence), `issue-comment.md`
  (the posted text), `reproduction/` (a standalone Maven project, `./run-matrix.sh`, logs in `out/`).
- Setup: released artifacts `io.modelcontextprotocol.sdk:mcp` 2.0.0 and 2.0.1 (2.0.1 is the latest,
  published 2026-08-19), embedded Tomcat 11.0.27, NIO and NIO2 connectors, Java 21.0.5, 3 runs each.
- Confirmed: a `tools/call` holds a Tomcat worker in `Mono.block` for the whole tool call
  (`HttpServletStreamableServerTransportProvider.doPost`, line 536 in 2.0.1, 526 in 2.0.0). With
  `maxThreads=2` and six concurrent 2 second calls, the calls finish in pairs at about 2, 4 and 6
  seconds.
- Not reproduced: the NIO2 hang with `HttpClient.sendAsync` and `Mono.fromFuture`. It returned in about
  150 ms on both connectors and versions. Not tested: stateless and SSE servlet transports, Jetty,
  Undertow, TLS, a slow external endpoint, a tool that calls back into the same Tomcat.

### modelcontextprotocol/java-sdk #882: HttpClientStreamableHttpTransport times out on initialize()

- Status 2026-10-14: reproduction built and run, comment posted
  (https://github.com/modelcontextprotocol/java-sdk/issues/882#issuecomment-6165246178). No pull
  request.
- Files, in `open-source/java-sdk/882/`: `results.md` (matrix and source notes), `issue-comment.md`,
  `reproduction/` (`./run-matrix.sh`, about 12 minutes).
- Setup: SDK 1.1.0 (the reporter's version), 1.1.4 and 2.0.1, a stub server answering `initialize` and
  `notifications/initialized` in 27 ways, 3 runs per version, 252 results.
- Reproduced: the exact message (`Client failed to initialize by explicit API call`, caused by
  `Did not observe any item or terminal signal within 20000ms in 'map'`) on all three versions when
  the server answers `initialize` with an empty body, an SSE event with empty data or nothing, or
  answers `notifications/initialized` with a `200 text/event-stream` that sends no data event or with
  nothing. `401`, `404`, `500`, `302` and `text/plain` fail within 40 ms. The query string is not the cause.
- Cause in the source: `LifecycleInitializer` puts a 20 s `.timeout` after `.map` (lines 284 to 285 in
  1.1.0). `HttpClientStreamableHttpTransport.sendMessage` completes only for an empty body or 202, an
  SSE event with data, or a JSON body. A 200 SSE response with no data event neither completes nor fails.
- Not known: which of these the reporter's server does. The comment asks for `curl -i` output.
  It also asks whether the maintainers would welcome a client fix (fail the send when the stream ends
  without a data event). No change is made before they answer.
- Lesson: the 20 s request timeout and the 20 s initialization timeout race, so the message names
  `'map'` in most runs and `'source(MonoDeferContextual)'` in some. Count the exact message only
  when the operator name matches.

### supabase-community/supabase-kt #415: modules for Supabase Auth in a custom backend

- Status 2026-10-14: research done, comment posted
  (https://github.com/supabase-community/supabase-kt/issues/415#issuecomment-6165902586). No code
  written, no fork branch, no pull request.
- Files, in `open-source/supabase-kt/415/`: `notes.md` (repo layout, existing JWT code, Supabase facts with
  cited pages, the Spring starter, three merged external pull requests, contribution rules, module table),
  `issue-comment.md` (the posted text, 229 words). The fork is at `~/src/supabase-kt` (default branch `master`).
- Finding that changed the plan: `Auth#getClaims()` already exists (PR #1141, opened 2026-01-15, merged
  2026-02-06). It verifies RS256 and ES256 against the project JWKS with a 10 minute cache, and HS256 through
  the Auth server. The issue is from January 2024 and its thread stopped on 2024-01-11.
- What a backend still lacks: verification needs a `SupabaseClient` with the Auth plugin; no `aud`, `iss` or
  `nbf` check; HS256 costs a network call per token; no Ktor or Spring Boot glue.
- Proposal in the comment: a client-free verifier, then a Ktor `Authentication` provider, then a Spring Boot
  starter. Five questions: where the verifier lives, which targets, JWKS in the core or pluggable, whether the
  glue goes in `supabase-kt-plugins` (the `plugins/` folder now holds only stubs that point there), and whether
  each step is its own pull request.
- Contribution rules: pull requests go to `master`, 4 spaces, no star imports, `detektAll` in CI, no pull
  request template. AI policy: "Please don't exclusively rely on AI to generate code. If using AI, double check
  your code. Generally I wouldn't recommend using AI for logic code."
- The docs do not name a default signing type for new projects. They call ES256 "recommended".
- Three merged external pull requests for reference: #1395 (13 days), #1405 (5 days), #1352 (4 days). All
  small bug fixes with a test.
- Not verified: nothing was built or run. The Gradle build, the behaviour of `getClaims`, and the claim that it
  skips `aud` and `iss` checks come from reading the source.
- Lesson: read the code on the main branch before proposing a feature from an old issue. Here the core was
  added two years after the issue.

### PostHog/posthog-android #577: remote config payload in the Java server SDK

- Status 2026-10-14: research done, comment posted
  (https://github.com/PostHog/posthog-android/issues/577#issuecomment-6166156307). No code written, no
  fork branch, no pull request.
- Files, in `open-source/posthog-android/577/`: `notes.md` (Node.js and Python implementations, spec check,
  how `posthog-server` calls the API, three merged external PRs, contribution rules, AI policy),
  `issue-comment.md` (the posted text, 193 words). The fork is at `~/src/posthog-android` (default branch `main`).
- The request: `getRemoteConfigPayload` exists in Node.js and Python and not in `posthog-server`. A maintainer
  clarified the issue is about that method, not the `/$token/config` endpoint.
- How Node.js and Python do it: `GET /api/projects/@current/feature_flags/{key}/remote_config?token={projectToken}`
  with the personal API key as bearer. They differ on a missing personal key: Node throws, Python logs and returns
  nothing. Node decodes a double-encoded string payload.
- No spec defines the method. The sdk-specs "Remote Config" spec is the client `/config` bootstrap, and the
  compliance audits call this method unrelated to it. So an agreed API shape is required before any
  implementation.
- Proposal in the comment: `getRemoteConfigPayload(key: String): Any?` on the sealed `PostHogInterface`, using the
  existing `personalApiKey`, a new method on the internal `PostHogApi` next to `localEvaluation`, errors logged and
  returned as `null`. Four questions: name and signature, missing key (log or throw), whether API errors should
  reach the caller, and whether an sdk-specs entry is wanted first.
- Rules found: public API changes need an issue and maintainer agreement; run `make api`; add a changeset with
  `pnpm changeset`; the PR template has an Agent context section. A maintainer required verified commit
  signatures on PR #834. `make testJava` runs only the core tests; server tests need
  `./gradlew :posthog-server:test`.
- Three merged external `posthog-server` PRs for reference: #834 (3 days), #805 (7 days, 13 reviews, flagged for
  public API without agreement), #795 (8 days, by the author of #577).
- Not verified: nothing was built or run. The real endpoint was never called, so the response shape comes from
  Node's source comment. The Go, Ruby and C# implementations and the SDK guidelines page were not read.
- Lesson: check the contribution rules before the code. Here the rules (agree the API shape in an issue first, and
  the AGENTS.md instruction to draft the issue text) set the whole sequence.

### spring-projects/spring-ai #4542: Flux return from async MCP tools returns only the first element

- Status 2026-10-14: verification done, comment posted on PR #6932
  (https://github.com/spring-projects/spring-ai/pull/6932#issuecomment-6166871010). No competing PR was
  written. Decided with Miguel to verify rather than add a fourth fix.
- Files, in `open-source/spring-ai/4542/`: `notes.md` (PR map, maintainer statements, design options, toolchain,
  rules), `results.md` (13-tool matrix per PR, module tests, limits), `review-comment.md` (the posted text, 263
  words), `reproduction/` (Spring AI 2.0.1 repro and saved outputs), `reproduction-1.1.8/`, `evidence/`.
- PR map: #6932 (jimantidote, open, 2026-09-07), #6830 (ssj2005, open, 2026-08-21), #6158 (closed 2026-09-14 in favour of
  #6932 by a maintainer), #4672 (closed 2025-10-20 with no explanation). The issue's own list missed #6830.
- Where the fix belongs: `spring-projects/spring-ai`, module `mcp/mcp-annotations`. The community repository
  says it graduated and is no longer maintained. The bug is on `main`, `2.0.x`, the `v2.0.1` tag and in
  community library 0.9.0 (1.1.x). The PRs target `main` only.
- Results: the bug reproduces on 2.0.1 and on 1.1.8. #6932 passes format, checkstyle and all 1376 module tests.
  #6830 fails format and checkstyle, and 5 existing tests fail because they were not updated. At runtime both give
  identical output on 13 cases, repeated twice.
- Findings in both PRs: `Flux<T>` with `generateOutputSchema = true` now returns `isError=true`; elements received
  before a mid-stream error are dropped; a slow Flux now waits for completion. Both fix the empty `Flux`, which
  got no response before. `Mono` and `Mono<List>` are unchanged.
- Open design question, put to the maintainers in the comment: one content item per element (both PRs) or one JSON
  array item like `Mono<List<T>>` (what #4672 did).
- Toolchain: the build needs JDK 17. `brew install --cask temurin@17` failed on a sudo prompt, so JDK 17 was
  installed with `brew install openjdk@17` (OpenJDK 17.0.20.1, left in place). The 460 MB of clones and worktrees
  were deleted after posting. Small repro and log folders remain in `~/src/spring-ai-4542-*`.
- Not verified: `isError` and `_meta` on single `Flux<CallToolResult>` elements, the sync server, the fix on `2.0.x`
  and `1.1.x`, and any machine other than this Mac.
- Lesson: read the whole PR list first, including the timeline. The issue named three attempts and missed an open
  one (#6830). A maintainer had already picked one PR, which settled where a contribution was useful.

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
| 2026-10-14 | Up to three issues in flight at once, one per slot on the board. Raised to six the same day by Miguel, then lifted entirely that evening (next row). | Waiting is long. Parallel slots keep work moving. The limit was raised after the first three slots all went to waiting. |
| 2026-10-14 | Contributions include reproductions, verification of other people's pull requests and docs, not only fixes. | The evidence shows fixes on popular issues are crowded and reproductions are not. |
| 2026-10-14 | No pull request until the thread is read in a browser, existing pull requests are searched and a maintainer has answered. | #470 was opened before the issue was accepted and duplicated #459. It was closed the same day. |
| 2026-10-14 | supabase-kt #415 started as the fourth issue. Miguel raised the limit to six. | Miguel chose to post the comment. All earlier slots were waiting on maintainers, so no build work was displaced. |
| 2026-10-14 | posthog-android #577 started as the fifth issue. | Miguel chose to post the comment. All earlier slots were waiting on maintainers, so no build work was displaced. |
| 2026-10-14 | spring-ai #4542 worked as verification of PR #6932, not as a fix, and fills the sixth slot. | Three PRs already existed for the issue and one passed style and tests. Evidence on an existing PR helps more than a fourth fix (see the verification kind in the process doc). |
| 2026-10-14 | No cap on the number of issues. | Miguel, evening: open source is a numbers game, and he will keep trying more places until a contribution lands. The six posted so far are enough for now. |

## Open questions

- Whether the maintainers accept a follow-up for the second half of #457, and which direction
  they prefer (a rule for when a quoted string is code, or a real parser). If no reply by
  2026-10-21, ask once more with new evidence, then leave it.
- Whether #859 can be reproduced outside the reporter's setup. Answered 2026-10-14: the thread-blocking
  and queueing reproduce; the reported NIO2 hang does not. Waiting on the reporter for details.
- Whether #882 is worth a reproduction. Answered 2026-10-14: yes, the exact timeout message reproduces on
  three versions. Waiting on the reporter for `curl -i` output.
- All six issues wait on maintainers. There is no cap. The practical limit is Miguel's review time: every line goes through him before it goes upstream. Claude's suggestion, not decided: start new build work only when nothing earlier is waiting on his review.
- Whether the maintainer of supabase-kt wants the verifier in `auth-kt` or a new module, and where the Ktor and
  Spring modules should live. Asked in the #415 comment. If no reply by 2026-10-21, ask once more.
- Whether the MCP server in Invoice-Financing should offer its read-only gate to
  supabase/mcp #361 as a design reference. #361 is not code in that repository, so this may
  need a different venue.
- How long a first maintainer reply takes in practice across these repositories. The board
  dates will answer it.
- Whether the posthog-android maintainers agree on the `getRemoteConfigPayload` shape, and how a missing personal API
  key and API errors should behave. Asked in the #577 comment. If no reply by 2026-10-21, ask once more.
- Whether the spring-ai maintainers want one content item per `Flux` element or one JSON array, and whether a fix is
  backported to 2.0.x and the 1.1.x line. Asked in the #6932 comment. If no reply by 2026-10-21, ask once more.