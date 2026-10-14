I ran this against released artifacts to see what I could reproduce.

Setup: `io.modelcontextprotocol.sdk:mcp` 2.0.0 and 2.0.1, embedded Tomcat 11.0.27, `HttpServletStreamableServerTransportProvider`, an async server, and `McpSyncClient` as the caller. NIO and NIO2 connectors. Java 21.0.5. Each case ran 3 times.

What I could confirm:

- A `tools/call` holds a Tomcat worker thread for the full duration of the tool. A thread dump taken during a 2 second `Mono.delay` tool shows the worker in `WAITING` inside `Mono.block`, called from `HttpServletStreamableServerTransportProvider.doPost` (line 536 in 2.0.1, line 526 in 2.0.0).
- With `maxThreads=2` and six concurrent calls to that tool, the calls finish in pairs at about 2, 4 and 6 seconds. Requests queue behind the blocked workers. Same result on NIO and NIO2, on 2.0.0 and 2.0.1.

What I could not reproduce:

- The hang on NIO2. A tool that calls a local endpoint (100 ms) with `HttpClient.sendAsync` wrapped in `Mono.fromFuture` returned in about 150 ms on NIO and NIO2, on 2.0.0 and 2.0.1, in 3 of 3 runs. The `HttpClient.send` with `Mono.fromCallable` version also returned in about 150 ms.

So this setup does not show the hang. Could the reporter share how the failing tool is wired? These details would help: what the async call targets (an external host, or the same Tomcat), the `maxThreads` value, how many calls were in flight, the Tomcat version, and a thread dump taken while it hangs.

Not tested: the stateless and legacy SSE servlet transports, Jetty, Undertow, TLS.

Reproduction (Java 17+, Maven, released artifacts only): https://github.com/Miguel-Shinyenyi/UMWAYI/tree/main/open-source/java-sdk/859/reproduction. `./run-matrix.sh 2.0.1` prints one result line per run and saves the thread dumps.
