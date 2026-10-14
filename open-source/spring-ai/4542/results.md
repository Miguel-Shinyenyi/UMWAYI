# spring-ai #4542: what each open fix does

Run on 2026-10-14. Nothing was posted to GitHub. All outputs are in `reproduction/out/`.

## Setup

| Item | Value |
|---|---|
| Issue | spring-projects/spring-ai #4542 |
| Spring AI | 2.0.1 release (latest), Spring Boot 4.1.1, MCP Java SDK 2.0.0 |
| Server | `spring-ai-starter-mcp-server-webflux`, `type: ASYNC`, `protocol: STATELESS`, streamable HTTP at `/mcp` |
| Client | MCP Java SDK `McpSyncClient`, prints the full `tools/call` result (`reproduction/src/main/java/repro/Client.java`) |
| JDK, OS | OpenJDK 17.0.20.1 (Homebrew), macOS on Apple silicon; Maven 3.9.16 for the repro, the repo's `./mvnw` for the module tests |
| #6932 | PR head `59c444288`, created 2026-09-07, open |
| #6830 | PR head `62decdcaf`, created 2026-08-21, open |
| How a fix was applied | The PR's diff applied to the `v2.0.1` tag (commit `c9107fdac`); only `spring-ai-mcp-annotations-2.0.1.jar` was swapped on the repro's classpath. Both diffs apply cleanly. |
| Rounds | The whole matrix ran twice per variant. Outputs were identical in both rounds; only elapsed time varies, and both times are shown as `round 1 / round 2`. |

## Module tests and style (`mcp/mcp-annotations`, `./mvnw -pl mcp/mcp-annotations ...`)

| Variant | Tests | Format check (CI mode) | Checkstyle |
|---|---|---|---|
| Unfixed 2.0.1 | 1376 run, 0 failures, 2 skipped | not run | pass |
| #6932 on 2.0.1 | 1376 run, 0 failures, 2 skipped | pass | pass |
| #6932 on its own head | 1376 run, 0 failures, 2 skipped | pass | pass |
| #6830 on 2.0.1 | not reached | **fail** | **fail**, 15 errors "Line has leading space characters" |
| #6830 on its own head | not reached | **fail** | **fail**, same |
| #6830, checks disabled with `-Ddisable.checks=true` | 1376 run, **5 failures**, 2 skipped | n/a | n/a |

The 5 failing tests on #6830 are existing tests that still assert the first-element behavior (`testMultipleFluxTool` in two classes, `testGetToolSpecificationsWithFluxHandling` in two,
`testToolWithFluxReturnType`). #6932 changed the same tests to expect all elements. See `evidence/format-and-failing-tests.txt` and `evidence/module-tests-summary.txt`.

## Edge case matrix

Format: result (elapsed ms in round 1 / round 2).

### `flux-3`: Flux<String>, 3 elements

- Unfixed 2.0.1: 1 item, isError=false (8 ms / 12 ms)
- #6932: 3 items, isError=false (4 ms / 5 ms)
- #6830: 3 items, isError=false (7 ms / 4 ms)

### `flux-1`: Flux<String>, 1 element

- Unfixed 2.0.1: 1 item, isError=false (565 ms / 939 ms)
- #6932: 1 item, isError=false (11 ms / 17 ms)
- #6830: 1 item, isError=false (36 ms / 15 ms)

### `flux-0`: empty Flux<String>

- Unfixed 2.0.1: no response, client timed out (60245 ms / 60172 ms)
- #6932: 0 items, isError=false (23 ms / 30 ms)
- #6830: 0 items, isError=false (65 ms / 33 ms)

### `flux-error-after-2`: 2 elements, then an error

- Unfixed 2.0.1: 1 item, isError=false (6 ms / 5 ms)
- #6932: 1 item, isError=true ("Error invoking method: boom") (3 ms / 4 ms)
- #6830: 1 item, isError=true ("Error invoking method: boom") (4 ms / 4 ms)

### `flux-nulls`: list with a null element, via Flux.fromIterable

- Unfixed 2.0.1: 1 item, isError=false (5 ms / 9 ms)
- #6932: 1 item, isError=true ("Error invoking method: The iterator returned a null value") (3 ms / 5 ms)
- #6830: 1 item, isError=true ("Error invoking method: The iterator returned a null value") (6 ms / 4 ms)

### `flux-slow`: 3 elements, 500 ms apart

- Unfixed 2.0.1: 1 item, isError=false (533 ms / 559 ms)
- #6932: 3 items, isError=false (1514 ms / 1523 ms)
- #6830: 3 items, isError=false (1527 ms / 1530 ms)

### `flux-large`: 10,000 elements

- Unfixed 2.0.1: 1 item, isError=false (10 ms / 17 ms)
- #6932: 10000 items, isError=false (149 ms / 170 ms)
- #6830: 10000 items, isError=false (182 ms / 158 ms)

### `flux-calltoolresult`: Flux<CallToolResult>, 3 elements

- Unfixed 2.0.1: 1 item, isError=false (11 ms / 10 ms)
- #6932: 3 items, isError=false (4 ms / 6 ms)
- #6830: 3 items, isError=false (5 ms / 5 ms)

### `flux-structured`: Flux<Person>, generateOutputSchema = true

- Unfixed 2.0.1: 1 item, isError=false, structuredContent set (13 ms / 14 ms)
- #6932: 1 item, isError=true ("Response missing structured content which is..." ) (5 ms / 6 ms)
- #6830: 1 item, isError=true ("Response missing structured content which is..." ) (10 ms / 11 ms)

### `mono-string`: Mono<String>

- Unfixed 2.0.1: 1 item, isError=false (5 ms / 10 ms)
- #6932: 1 item, isError=false (3 ms / 5 ms)
- #6830: 1 item, isError=false (4 ms / 4 ms)

### `mono-list`: Mono<List<String>>, 3 elements

- Unfixed 2.0.1: 1 item, isError=false (7 ms / 8 ms)
- #6932: 1 item, isError=false (4 ms / 7 ms)
- #6830: 1 item, isError=false (5 ms / 10 ms)

### `mono-structured`: Mono<Person>, generateOutputSchema = true

- Unfixed 2.0.1: 1 item, isError=false, structuredContent set (4 ms / 5 ms)
- #6932: 1 item, isError=false, structuredContent set (4 ms / 6 ms)
- #6830: 1 item, isError=false, structuredContent set (6 ms / 6 ms)

### `list-plain`: plain List<String>

- Unfixed 2.0.1: not registered
- #6932: not registered
- #6830: not registered

## What stands out

- #6932 and #6830 give identical results on every cell of this matrix. They differ only in tests and formatting.
- Both fix the report: a 3 element `Flux` returns 3 content items.
- Both also fix an empty `Flux`, which got no response at all before (the client gave up after its 60 second timeout).
- `Mono` and `Mono<List>` results are unchanged. A plain `List` is not registered on async servers, as the docs say.
- Both change three behaviors that are not the reported bug:
  - A `Flux` that errors after 2 elements now returns only the error. The 2 received elements are dropped. Before, the error was ignored and the first element came back.
  - A `Flux<Person>` with `generateOutputSchema = true` now returns `isError=true` ("Response missing structured content..."). Before, `structuredContent` held the first element.
  - A `Flux` is no longer answered at the first element: the call waits for completion (1.5 s instead of 0.5 s for the slow case).
- The same `.next()` is in the `2.0.x` branch, in the `v2.0.1` tag and in community library 0.9.0 (`reproduction-1.1.8/out/baseline-1.1.8.txt`: on Spring AI 1.1.8, `flux-3` returns 1 item).

## What is not proven

- `isError`, `_meta` and `structuredContent` on individual `Flux<CallToolResult>` elements. The merge code copies only `content()`, but no cell here tests an element with `isError=true`.
- The sync server, other transports, and the stateful async callback (it shares the abstract class, and the PR's tests cover it, but the repro only ran the stateless server).
- A fix applied to the `2.0.x` or `1.1.x` branches. The PRs target `main`.
- The patches were run on the 2.0.1 tag, not on `main`'s current code. The module tests were also run on each PR's own head.
- One machine, one JDK, loopback network.
- The unfixed `flux-1` call took 565 ms and 939 ms against about 5 to 40 ms elsewhere. It ran right after the 60 second `flux-0` timeout. I did not investigate the cause.

## How to rerun

```
# 1. build the repro (JDK 17, Maven 3.9)
cd reproduction && mvn -q -DskipTests package && mvn -q dependency:build-classpath -Dmdep.outputFile=cp.txt
# 2. one variant against the unfixed release
./run-variant.sh baseline "" flux-3
# 3. a fix: build mcp/mcp-annotations from a spring-ai checkout of v2.0.1 with the PR applied, then
./run-variant.sh fixed /path/to/spring-ai-mcp-annotations-2.0.1.jar flux-3
```

`evidence/build-variants.sh` is the script used for the module tests and the format check.
