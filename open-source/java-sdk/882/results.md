# java-sdk #882: HttpClientStreamableHttpTransport times out on initialize()

Results of a reproduction run on 2026-10-14. All numbers come from the files in
`reproduction/out/`. Nothing here was posted to GitHub.

## Setup

| Item | Value |
|---|---|
| Issue | modelcontextprotocol/java-sdk #882 (reported on v1.1.0, Java 17) |
| SDK | `io.modelcontextprotocol.sdk:mcp` 1.1.0 (the reporter's version), 1.1.4 (latest 1.x) and 2.0.1 (latest release, published 2026-08-19) from Maven Central |
| Client | The code from the issue: `HttpClientStreamableHttpTransport.builder(base).endpoint(...).build()`, then `McpClient.sync(transport).clientInfo(...).build().initialize()`. Default timeouts (20 s request, 20 s initialization). |
| Server | A stub (JDK `HttpServer` on 127.0.0.1). It answers `initialize` and `notifications/initialized` in a configurable way. Answers `GET` with 405 and `DELETE` with 200. |
| Java, Maven, OS | Oracle Java 21.0.5, Apache Maven 3.9.16, macOS (Darwin 27.0.0) |
| Runs | 28 rows x 3 versions x 3 runs = 252 results. The three versions ran in parallel, one JVM per version and run. |

The reporter's server is not public and its reply to `initialize` is unknown, so every row is a guess about what it does.

## Results (B1 to B6)

"Exact issue message" counts runs where the error was `Client failed to initialize by explicit API call`
caused by `Did not observe any item or terminal signal within 20000ms in 'map'`.
The request timeout and the initialization timeout are both 20 s and race. In the runs that do not count, the
same 20 s timeout fired from the request side and named `'source(MonoDeferContextual)'` instead of `'map'`.
That varied between runs of the same row and was not tied to one version.

| Row | What the stub did | Outcome (9 runs: 3 versions x 3) | Time | Exact issue message | Failure seen |
|---|---|---|---|---|---|
| baseline-json | initialize: 200 JSON. Notification: 202. Endpoint /mcp (B1) | 9 ok | 682 to 788 ms | 0 of 9 |  |
| query-string | Same, endpoint /mcp?tk=abc (B2) | 9 ok | 10 to 33 ms | 0 of 9 |  |
| json-session-id | initialize: 200 JSON with Mcp-Session-Id | 9 ok | 9 to 36 ms | 0 of 9 |  |
| sse-reply | initialize: 200 text/event-stream with one data event, stream closes | 9 ok | 8 to 25 ms | 0 of 9 |  |
| sse-reply-session-id | Same, with Mcp-Session-Id | 9 ok | 6 to 18 ms | 0 of 9 |  |
| sse-reply-held-open | initialize: SSE with one data event, stream stays open | 9 ok | 5 to 13 ms | 0 of 9 |  |
| init-sse-primer-only | initialize: SSE with one empty-data event, stream closes | 0 ok, 9 fail | 20007 to 20021 ms | 9 of 9 | TimeoutException: Did not observe any item or terminal signal within 20000ms in 'map' |
| init-empty-200 | initialize: 200, no content type, no body | 0 ok, 9 fail | 20005 to 20021 ms | 7 of 9 | TimeoutException: Did not observe any item or terminal signal within 20000ms in 'map' |
| init-empty-json-200 | initialize: 200 application/json, empty body | 0 ok, 9 fail | 20004 to 20015 ms | 8 of 9 | TimeoutException: Did not observe any item or terminal signal within 20000ms in 'map' |
| init-text-plain | initialize: 200 text/plain | 0 ok, 9 fail | 11 to 37 ms | 0 of 9 | RuntimeException: Unknown media type returned: text/plain |
| init-wrong-id | initialize: valid JSON result whose id does not match the request | 0 ok, 9 fail | 20003 to 20014 ms | 5 of 9 | TimeoutException: Did not observe any item or terminal signal within 20000ms in 'source(MonoDeferContextual)' |
| init-401 | initialize: 401 | 0 ok, 9 fail | 18 to 29 ms | 0 of 9 | McpHttpClientTransportAuthorizationException: Authorization error when sending message |
| init-404 | initialize: 404 | 0 ok, 9 fail | 9 to 16 ms | 0 of 9 | McpTransportException: Server Not Found. Status code:404, response-event:... |
| init-500 | initialize: 500 | 0 ok, 9 fail | 5 to 13 ms | 0 of 9 | RuntimeException: Failed to send message: DummyEvent[...] |
| init-redirect-302 | initialize: 302 redirect | 0 ok, 9 fail | 5 to 14 ms | 0 of 9 | RuntimeException: Failed to send message: DummyEvent[...] |
| init-never-answers | initialize: no reply | 0 ok, 9 fail | 20005 to 20013 ms | 8 of 9 | TimeoutException: Did not observe any item or terminal signal within 20000ms in 'map' |
| notif-200-empty | notifications/initialized: 200, no body, no content type | 9 ok | 19 to 39 ms | 0 of 9 |  |
| notif-200-json-body | notifications/initialized: 200 application/json, body {} | 9 ok | 9 to 26 ms | 0 of 9 |  |
| notif-200-json-empty | notifications/initialized: 200 application/json, empty body | 9 ok | 7 to 17 ms | 0 of 9 |  |
| notif-200-sse-data | notifications/initialized: 200 SSE with one data event | 9 ok | 9 to 17 ms | 0 of 9 |  |
| notif-200-sse-held-open | notifications/initialized: 200 text/event-stream, no event, stream stays open | 0 ok, 9 fail | 20002 to 20013 ms | 9 of 9 | TimeoutException: Did not observe any item or terminal signal within 20000ms in 'map' |
| notif-200-sse-primer-only | notifications/initialized: 200 SSE with one empty-data event, stream closes | 0 ok, 9 fail | 20006 to 20023 ms | 9 of 9 | TimeoutException: Did not observe any item or terminal signal within 20000ms in 'map' |
| notif-200-text-plain | notifications/initialized: 200 text/plain | 0 ok, 9 fail | 11 to 29 ms | 0 of 9 | RuntimeException: Unknown media type returned: text/plain |
| notif-never-answers | notifications/initialized: no reply | 0 ok, 9 fail | 20006 to 20012 ms | 9 of 9 | TimeoutException: Did not observe any item or terminal signal within 20000ms in 'map' |
| notif-401 | notifications/initialized: 401 | 0 ok, 9 fail | 16 to 27 ms | 0 of 9 | McpHttpClientTransportAuthorizationException: Authorization error when sending message |
| notif-404 | notifications/initialized: 404 | 0 ok, 9 fail | 7 to 19 ms | 0 of 9 | McpTransportException: Server Not Found. Status code:404, response-event:... |
| notif-500 | notifications/initialized: 500 | 0 ok, 9 fail | 7 to 19 ms | 0 of 9 | RuntimeException: Failed to send message: DummyEvent[...] |
| sse-transport-comparison | Legacy SSE client transport against a stub that speaks the legacy SSE protocol (B5) | 9 ok | 12 to 22 ms | n/a |  |

Per row, all three versions behaved the same. The full per-run lines, including the requests the stub saw, are in
`reproduction/out/results.tsv`.

Checks:

- B1: `baseline-json` succeeds on 1.1.0, 1.1.4 and 2.0.1 (9 of 9).
- B2: `query-string` succeeds (9 of 9). The stub saw `POST /mcp?tk=abc`, `GET /mcp?tk=abc` and `POST /mcp?tk=abc`,
  so the query string reaches the server on every request.
- B3: the matrix above. Rows with 20000 ms and a count in the "exact" column reproduce the issue.
- B5: the SSE transport works against a stub that speaks the legacy SSE protocol. This only shows the transport
  itself is fine. It says nothing about the reporter's server.
- B6: the three runs of every row gave the same outcome. Only the timeout operator name varied, as noted above.

## B4: where the Mono never signals (source notes)

Line numbers are for the sources jars of the tagged releases. 1.1.0 first, then 2.0.1 in brackets.

1. `LifecycleInitializer.withInitialization`: `initializationJob.map(...)` at line 284 [283], then
   `.timeout(this.initializationTimeout)` at line 285 [284]. That `.timeout` placed after `.map` is the
   `in 'map'` in the error. The default is 20 s (`McpClient.java` line 168 [169]).
2. `LifecycleInitializer.doInitialize`: the job is `sendRequest(initialize)`, then
   `sendNotification(notifications/initialized)` at line 323 [323], then `thenReturn(initializeResult)`.
   Nothing reaches `.map` until both finish.
3. `HttpClientStreamableHttpTransport.sendMessage` (line 460 [512]) returns a `Mono` that the code completes by
   hand through `deliveredSink`. It signals in only these places:
   - `deliveredSink.success()` for an empty body, `Content-Length: 0`, status 202 or a blank content type: line 540 [606].
   - `deliveredSink.success()` when an SSE event with non-blank data arrives: line 571 [637]. An SSE event with
     blank data is skipped (line 552 [618]) and calls neither `success()` nor `error()`.
   - `deliveredSink.success()` for `application/json`: line 582 [648].
   - `deliveredSink.error(...)` for transport errors, 401, 403, 404, 400, an unknown media type (lines 598 to 602
     [664 to 668]), any other status (line 634 [704]) and exceptions (line 643 [724]).
4. So there are two ways to end up with no item and no terminal signal:
   - **For `notifications/initialized`:** the POST gets `200 text/event-stream` and no event with data ever
     arrives (the stream stays open, or closes after an empty-data event), or the server never answers. Rows
     `notif-200-sse-held-open`, `notif-200-sse-primer-only`, `notif-never-answers`.
   - **For `initialize`:** `sendMessage` may finish, but the JSON-RPC response must still arrive as a JSON body
     or an SSE data event. A `200` with no body (or an empty JSON body), an SSE reply with only an empty-data
     event, or no reply leaves the request waiting. A response with a different id is logged by
     `McpClientSession` ("Unexpected response for unknown id", line 139) and ignored. Rows `init-empty-200`,
     `init-empty-json-200`, `init-sse-primer-only`, `init-never-answers`, `init-wrong-id`.

The other statuses fail within 40 ms with a specific error, so they would not produce a 20 s wait.

## What is not proven

- Which of these the reporter's server does. Only its raw replies can tell.
- Whether a proxy or gateway between the client and the server changes the reply (for example turns an empty
  `202` into an SSE stream).
- Behaviour with HTTP/2, TLS, or a body that arrives in chunks. The stub speaks HTTP/1.1 over loopback.
- Whether the SSE-without-data case is a client bug or a server bug. The spec text was not checked in this run.

## How to run it

```
cd reproduction
./run-matrix.sh            # about 12 minutes, because hanging rows wait for the 20 s timeout
```

One row by hand (after `mvn -q compile -Dsdk.version=1.1.0` and
`mvn -q dependency:build-classpath -Dsdk.version=1.1.0 -Dmdep.outputFile=cp.txt`):

```
java -Dsdk.version=1.1.0 -cp target/classes:$(cat cp.txt) repro.Repro882 notif-200-sse-held-open
```
