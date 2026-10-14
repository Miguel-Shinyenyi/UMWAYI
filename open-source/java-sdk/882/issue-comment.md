I tried to reproduce this with a local stub server and the client code from the issue.

Setup: `io.modelcontextprotocol.sdk:mcp` 1.1.0 (the reporter's version), 1.1.4 and 2.0.1. Java 21.0.5. The stub is a JDK `HttpServer` on 127.0.0.1 that answers `initialize` and `notifications/initialized` in different ways. Each case ran 3 times per version.

What works: a normal JSON reply to `initialize` and a 202 for the notification. Endpoint `/mcp?tk=abc` works too, and the stub receives the query string on every request. So the query string is not the cause.

I can reproduce the exact error (`Client failed to initialize by explicit API call`, caused by `Did not observe any item or terminal signal within 20000ms in 'map'`) on all three versions when the server answers in one of these ways:

- `initialize` gets a 200 with an empty body (with or without `Content-Type: application/json`), an SSE reply with only an empty-data event, no reply, or a result whose id does not match the request.
- `notifications/initialized` gets a `200 text/event-stream` that sends no data event (the stream stays open, or closes after an empty event), or no reply.

Replies of 401, 404, 500, a 302 redirect or `text/plain` fail within 40 ms with a different error. A 200 with JSON, or an SSE data event, works.

Why, from reading the v1.1.0 source: `LifecycleInitializer` applies a 20 s `.timeout` after `.map` (lines 284 to 285). It waits for the `initialize` result and for `sendNotification(initialized)` (line 323). In `HttpClientStreamableHttpTransport.sendMessage` (line 460), the send completes only for an empty body, a 202 or no content type (line 540), an SSE event with non-blank data (line 571), or a JSON body (line 582). A 200 SSE response with no data event neither completes nor fails. For `initialize`, the JSON-RPC response must also arrive as a JSON body or an SSE data event.

What I cannot say: which of these the reporter's server does. Could the reporter run these against the server and paste the full output (status, headers, body)? Adding `-i` shows the headers.

```
curl -i -X POST 'http://HOST/PATH/mcp?tk=...' -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"curl","version":"0"}}}'
```

Then the same URL with `-d '{"jsonrpc":"2.0","method":"notifications/initialized"}'`, plus `-H 'Mcp-Session-Id: ...'` if the first reply returned one. It also matters whether a proxy or gateway sits between the client and the server.

If it turns out to be the SSE case, the client could fail the send when the response stream ends without a data event, instead of waiting for the timeout. Would the maintainers see that as a bug worth a PR? I would wait for an answer before changing anything.

Reproduction (Java 17+, Maven, released artifacts only): https://github.com/Miguel-Shinyenyi/UMWAYI/tree/main/open-source/java-sdk/882/reproduction. `./run-matrix.sh 1.1.0` runs every row for one version, 3 times, and takes about 12 minutes (the rows that hang wait for the 20 s timeout).
