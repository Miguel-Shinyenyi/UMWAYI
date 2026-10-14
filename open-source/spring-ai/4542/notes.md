# spring-ai #4542: Flux return from async MCP tools returns only the first element

Research notes, read on 2026-10-15 from GitHub pages and the API. Nothing was posted to GitHub. No code was run in Stage 1.

## Acceptance checks (written first)

Stage 1
- A1 Every pull request and branch that references #4542: number, author, repo, state, target branch, files, last activity. Include `spring-ai-community/mcp-annotations`.
- A2 What maintainers said on the issue and on each PR about the intended behaviour, with a link per statement.
- A3 The design question with evidence: what should an `@McpTool` method returning `Flux<T>` produce in a `CallToolResult`? MCP specification, how `Mono<List<T>>` and `List<T>` are treated today, what the docs promise. Options listed, and which option each open PR chooses.
- A4 Toolchain: supported JDK, build tool, the module that holds the callback, the test command.

Stage 2 (after Miguel picks the PRs): B1 a minimal repro app in `~/src/spring-ai-4542-repro` on a released version. B2 the unfixed release returns only the first element, output saved. B3 each open fix in its own clean build, repro and module tests run, results recorded. B4 edge case matrix per fix (empty, one, three elements, error after two, null elements, slow, 10,000 elements, `Mono`, plain `List`). B5 whether each fix changes existing `Mono` and `List` returns, with the existing tests run. B6 each row names versions, PR head commit and the output file; matrix repeated once.

Stage 3: C1 no em dashes in the new hub files. C2 UMWAYI main equals origin/main after the push.

## Summary

1. The bug is real and is still in every current source tree: `AbstractAsyncMcpToolMethodCallback` calls `.next()` on a `Flux`.
   Confirmed by reading the file on `main` (2.1.0-SNAPSHOT, lines 108 and 119), on the `2.0.x` branch, on the `v2.0.1` tag (the latest release), and
   in the community library `spring-ai-community/mcp-annotations` default branch (lines 88 and 98), which Spring AI 1.1.x still depends on.
2. Two pull requests are **open**, not one: #6932 and #6830. Both make the same design choice. Two earlier ones, #6158 and #4672, are closed.
3. A maintainer already said which one to use: on 2026-09-14 sobychacko closed #6158 with "We're going to move forward with #6932 to close this out".
   #6932 has no review or comment yet, shows `MERGEABLE` and `CLEAN`, and carries the label `status: waiting-for-triage`.
4. The fix belongs in `spring-projects/spring-ai` (`mcp/mcp-annotations`). The community repository says it "graduated" into Spring AI 2.x and "is no
   longer actively maintained" (last push 2026-05-06). None of the PRs targets 2.0.x or 1.1.x, so released users on 1.1.x (community library 0.9.0)
   and 2.0.x would not get a fix from a `main` merge alone.
5. I found a likely defect in both open PRs, not yet run: they merge only `CallToolResult.content()`. In `STRUCTURED` return mode a result has
   `structuredContent` and no `content`, so the merged result would be empty. Stage 2 tests this.

## A1: pull request map

| PR | Author | Repo | State | Base | Files (+/-) | Created | Last activity | Head |
|---|---|---|---|---|---|---|---|---|
| #6932 | jimantidote | spring-projects/spring-ai | **open**, not draft | main | 5 files, +61/-28 | 2026-09-07 | 2026-09-07 | `59c44428` |
| #6830 | ssj2005 | spring-projects/spring-ai | **open**, not draft | main | 1 file, +20/-2 | 2026-08-21 | 2026-08-24 | `62decdca` |
| #6158 | suryateja-g13 | spring-projects/spring-ai | closed 2026-09-14, not merged | main | 7 files, +64/-30 | 2026-05-26 | 2026-09-14 | `bbdcb427` |
| #4672 | liugddx | spring-projects/spring-ai | closed 2025-10-20, not merged | main | 3 files, +507/-2 | 2025-10-19 | 2026-04-23 (a comment) | `a547a646` |

- `spring-ai-community/mcp-annotations`: no pull request references #4542 (search returned none). Discussion #75 there ("Why Flux method callback only returns
  the first element?", opened by Damore) has one comment, "Hit the same issue! Please help." from mirceade on 2026-04-23. No maintainer reply.
- #6932 files: `AbstractAsyncMcpToolMethodCallback.java` (+31/-6) and four test files (`AsyncMcpToolMethodCallbackTests`, `AsyncStatelessMcpToolMethodCallbackTests`,
  `AsyncMcpToolProviderTests`, `AsyncStatelessMcpToolProviderTests`). Status checks: DCO success. Mergeable, clean. No assignee, no reviewer requested.
- #6830 files: `AbstractAsyncMcpToolMethodCallback.java` only, no test changes. DCO success. No comments or reviews. Mergeability was `UNKNOWN` when read.
- #6158 also changed `DeepSeekApi.java` and `MiniMaxApi.java` (an unrelated `ToolChoiceBuilder.REQUIRED` addition), which is one reason it was closed.
- #4672 added a `FluxToolSpecificationPostProcessor` (244 lines) and an integration test in `auto-configurations/mcp/spring-ai-autoconfigure-mcp-server-common`,
  for stateless servers only. Closed 2025-10-20 (who closed it was not checked) with no explanation in the thread; mirceade asked on 2026-04-23 "So this equates
  to a rejection of the PR? Why was the solution rejected?" and nobody answered.
- The issue's timeline also links a commit by ssj2005 (`62decdca`), which is the head of #6830.
- Related issue #4648 "Reactive tool support" (open, label `mcp`, no comments): asks to pass the Reactor context to tool methods. It does not overlap with
  the Flux result problem.

## A2: what maintainers said

- sobychacko on #6158, 2026-09-14: "We're going to move forward with #6932 to close this out, for a few practical reasons: It's scoped solely to the
  mcp/mcp-annotations module, whereas this PR also bundles an unrelated `ToolChoiceBuilder.REQUIRED` change in DeepSeekApi/MiniMaxApi. This PR predates a
  refactor of the error-handling path in `AbstractAsyncMcpToolMethodCallback`, so it no longer applies cleanly to main, while #6932 is rebased on the current
  code." He closed #6158 in its favour and suggested a separate small PR for the `ToolChoiceBuilder.REQUIRED` change. https://github.com/spring-projects/spring-ai/pull/6158
- jimantidote on #6932 (its own description) says #6158 "has been stale since June with no maintainer engagement", which sobychacko's comment shows is no
  longer the case. https://github.com/spring-projects/spring-ai/pull/6932
- No maintainer has stated the intended output shape for `Flux<T>` on the issue, on #6932 or on #6830. The docs say `Flux<T>` is "for streaming results"
  and say no more (A3).
- No maintainer replied on #4672, on #6830, on the issue, or on community discussion #75.
- The issue has 4 comments, all from users hitting the same problem, none from a maintainer. The first (anver-trip, 2025-10-03) traced it to the
  community library at tag v0.5.1 and asked tzolov for details. https://github.com/spring-projects/spring-ai/issues/4542

## A3: the design question

What should an `@McpTool` method returning `Flux<T>` put in a `CallToolResult`?

Evidence:
- MCP specification 2025-11-25, "Tools" page (https://modelcontextprotocol.io/specification/2025-11-25/server/tools): a tool result carries unstructured
  `content`, which "can contain multiple content items of different types", and/or `structuredContent` "as a JSON object". "For backwards compatibility, a tool that
  returns structured content SHOULD also return the serialized JSON in a TextContent block." The page says nothing about a tool streaming partial results. `tools/call`
  returns one result.
- Spring AI reference docs, "MCP Annotations: Server" (https://docs.spring.io/spring-ai/reference/api/mcp/mcp-annotations-server.html): async servers accept
  `Mono<T>` "(for single results)", `Flux<T>` "(for streaming results)" and `Publisher<T>`, and filter out plain `List` and other non-reactive returns. The page does
  not say how Flux elements are collected or returned.
- Code on `main` (`AbstractMcpToolMethodCallback.convertValueToCallToolResult`, lines 171 to 202): in text mode a `String` becomes one text item; any other
  value becomes **one** text item holding `jsonHelper.toJson(value)`, so a `List<T>` or a `Mono<List<T>>` yields one text item with a JSON array. In `STRUCTURED`
  mode the value becomes `structuredContent` and the result has no `content`. `VOID` returns "Done".
- Today for a `Flux`, `AbstractAsyncMcpToolMethodCallback.convertToCallToolResult` (lines 80 to 150) calls `.next()`, so only the first element survives.

Options:
1. **One content item per element** (merge each element's content into one `CallToolResult`). Chosen by #6932, #6830 and #6158. Fits the spec's "multiple content items".
   A client that reads only `content[0]` still sees one element. In structured mode there is no content to merge (see summary point 5).
2. **One JSON array in one text item** (collect to a list, then convert the list as a single value). This equals what `Mono<List<T>>` already produces. #4672 chose this
   (its post-processor "collects all elements into a list"). Keeps a single-item result shape that clients of `List<T>` returns already know.
3. **Stop at the first element** (today). Documented nowhere; the docs call `Flux<T>` "for streaming results".
4. **Not decided by any PR:** what happens to `isError`, `_meta` and `structuredContent` of each element, and to a `Flux<CallToolResult>` whose elements carry different `isError` values.

Not answered by any source I read: which shape the Spring AI maintainers want. This is the question to put to them.

## A4: toolchain

- Build: Maven wrapper `./mvnw` (AGENTS.md, CONTRIBUTING.md). `main` is `2.1.0-SNAPSHOT`, `<java.version>17`, MCP Java SDK 2.0.0 (`pom.xml` lines 8, 246, 262).
- JDK: AGENTS.md says "JDK 17 with `-XDaddTypeAnnotationsToSymbol` support (see `.sdkmanrc`, e.g. `17.0.19-librca`)". This Mac has Oracle JDK 21.0.5 only. Whether the
  build works on 21 is untested; installing a JDK 17 needs Miguel's yes.
- Module: `mcp/mcp-annotations` (package `org.springframework.ai.mcp.annotation.method.tool`). Stateless async callback: `AsyncStatelessMcpToolMethodCallback`,
  stateful: `AsyncMcpToolMethodCallback`, both extending `AbstractAsyncMcpToolMethodCallback`.
- Test command (from the PR test plans): `./mvnw -pl mcp/mcp-annotations -am test`; #6932 reports 1376 tests, 0 failures. Format and checkstyle: `./mvnw process-sources`
  and the CI flag `-P'!format-apply,format-check'`.
- Releases: Spring AI 2.0.1 is the latest (2026-08-21); 2.1.0-M1 is a pre-release (2026-09-25); 1.1.8 is the latest 1.1.x (2026-06-12). Branches: `main`, `2.0.x`, `1.1.x`, `1.0.x`.
  The `1.1.x` branch uses the community library `mcp-annotations` 0.9.0 with MCP SDK 0.18.3.
- The issue does not name the Spring AI version the reporter used. The first comment points at community library tag v0.5.1.
- Extra tools: Maven 3.9.16 sits in `~/src/java-sdk-repro/apache-maven-3.9.16` if needed; the wrapper downloads its own.

## Contribution rules and AI policy (spring-projects/spring-ai)

- `CONTRIBUTING.md`: "We accept contributions created with the help of AI coding agents, but they must be carefully reviewed by a human who remains accountable for the
  quality of the contribution." Accounts run by autonomous AI bots are forbidden and lead to permanent bans. "Any code needs to be carefully reviewed by a human, especially
  when generated by a coding agent." No disclosure section or PR-template field for AI help was found.
- No issue is required before a pull request ("No, just create the pull request"). Do not submit PRs for already assigned issues (#4542 is unassigned) or for
  "straightforward or polish-style changes".
- DCO: every commit needs a `Signed-off-by` trailer (`git commit -s`). Commit title: imperative, capitalized verb, under 50 characters, no `fix:` prefix and no issue number.
  `Fixes #123` goes in the body. Tabs, not spaces. Run `./mvnw clean package` before submitting; add tests.
- PR titles feed the changelog; reference the issue in the description, not the title.
- `AGENTS.md` repeats the build and style rules and adds: license header on each file, `@since` tags on new public types, one sentence per line in `.adoc` and `.md`.
- Branch rules: PRs target `main`. Whether maintainers backport to `2.0.x` and `1.1.x` was not found in the documents; the maintainers decide.
- Noticed on the open PRs: #6830's diff mixes space indentation into tab-indented code and puts an import out of order; that likely fails the formatter and checkstyle.
  Not run yet.

## Questions for Miguel before Stage 2 (answered 2026-10-14)

Answers: test both open PRs; baseline 2.0.1 plus one run on 1.1.8; install the JDK; review scope as suggested (no competing change).

1. Which PRs to test. Default: both open ones, #6932 and #6830. I suggest adding closed #6158 only as a reference if it still builds; it adds little.
2. Baseline release. The issue names none. I suggest Spring AI 2.0.1 (latest, same code as `main`) and one run on 1.1.8 with community library 0.9.0, to show the older
   line is affected.
3. JDK. May I install a JDK 17 (for example `brew install --cask temurin@17`), or try the build on the installed JDK 21 first?
4. Scope of the review. The evidence already shows both open PRs make the same choice. The useful new information is how they differ (tests, formatting, structured
   mode, errors, null elements, large Flux) and the backport gap. I would not propose a competing change.

## Stage 2 outcome (2026-10-14)

Full tables are in `results.md`; saved outputs are in `reproduction/out/` and `evidence/`.

- Toolchain: JDK 17 works for the build. It was installed with `brew install openjdk@17` (OpenJDK 17.0.20.1), because the `temurin@17` cask needs a sudo password.
  The 2.0.1 module builds and passes 1376 tests with 0 failures.
- B2: the bug reproduces on the unfixed 2.0.1 release (`flux-3` returns 1 item) and on Spring AI 1.1.8 with community library 0.9.0.
- The tested diffs apply cleanly to the `v2.0.1` tag (commit `c9107fdac`). #6932 head `59c444288`, #6830 head `62decdcaf`.
- #6932 passes the format check, checkstyle and all 1376 module tests, on 2.0.1 and on its own head.
- #6830 fails the format check and checkstyle (15 "leading space" errors) and, with checks disabled, 5 existing tests fail because it did not update them.
- At runtime the two PRs give identical results on all 13 cells, and the results are identical across two rounds.
- Verified (earlier only read from code): both PRs break `Flux<T>` with `generateOutputSchema = true` (`isError=true`); both drop already received elements when the
  Flux errors; both fix the empty `Flux`, which got no response before; `Mono` and `Mono<List>` results are unchanged.
- The review comment is drafted for PR #6932 (`review-comment.md`), per Miguel's choice.

## Not verified (Stage 1 list, partly superseded by Stage 2)

- Nothing was built or run. The structured-mode defect, the formatting failure on #6830 and the `Mono<List<T>>` behaviour are readings of the code.
- The claim that `2.0.x` and the `v2.0.1` tag still have `.next()` comes from reading those files, not running them.
- I did not read the MCP Java SDK client side or the stateless transport code.
- Who the PR authors are and whether sobychacko is a committer: the API reports his association as `CONTRIBUTOR`, but he acts as a maintainer on the PR.
