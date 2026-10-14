# java-sdk #859: servlet transports block the request thread

Results of a reproduction run on 2026-10-14. All numbers come from the files in
`reproduction/out/`. Nothing here was posted to GitHub.

## Setup

| Item | Value |
|---|---|
| Issue | modelcontextprotocol/java-sdk #859 |
| SDK | `io.modelcontextprotocol.sdk:mcp` 2.0.0 and 2.0.1 from Maven Central. 2.0.1 is the latest release (published 2026-08-19). It pulls in `mcp-core` and `mcp-json-jackson3` of the same version. |
| Server | Embedded Tomcat 11.0.27 (`tomcat-embed-core`), one servlet on `/mcp`, `HttpServletStreamableServerTransportProvider`, async server (`McpServer.async`) |
| Connectors | NIO (`Http11NioProtocol`) and NIO2 (`Http11Nio2Protocol`) |
| Client | `McpSyncClient` over `HttpClientStreamableHttpTransport`, same SDK version as the server |
| Java, Maven, OS | Oracle Java 21.0.5, Apache Maven 3.9.16, macOS (Darwin 27.0.0) |
| Runs | Each row was run 3 times in a fresh JVM. No run differed in outcome. |

Tools on the server:

- `fast` returns a text result at once.
- `slow` returns after `Mono.delay(2 s)`.
- `async-http` calls a local stub (100 ms) with `HttpClient.sendAsync` wrapped in `Mono.fromFuture`.
- `sync-http` calls the same stub with `HttpClient.send` wrapped in `Mono.fromCallable`.

## Results

| SDK | Connector | Tool | maxThreads | Outcome (3 runs) | Tool call time | Per-call completion times (run 1, ms) |
|---|---|---|---|---|---|---|
| 2.0.0 | nio | fast, returns at once | 200 | 3 pass | 26 to 32 ms |  |
| 2.0.0 | nio | Mono.delay 2 s | 200 | 3 pass | 2038 to 2059 ms |  |
| 2.0.0 | nio | Mono.delay 2 s, 6 concurrent calls | 2 | 3 pass | total 6256 to 6263 ms | 2057, 2057, 4049, 4052, 6059, 6059 |
| 2.0.0 | nio | HttpClient.sendAsync + Mono.fromFuture | 200 | 3 pass | 155 to 157 ms |  |
| 2.0.0 | nio | HttpClient.send + Mono.fromCallable | 200 | 3 pass | 146 to 159 ms |  |
| 2.0.0 | nio2 | fast, returns at once | 200 | 3 pass | 23 to 29 ms |  |
| 2.0.0 | nio2 | Mono.delay 2 s | 200 | 3 pass | 2047 to 2051 ms |  |
| 2.0.0 | nio2 | Mono.delay 2 s, 6 concurrent calls | 2 | 3 pass | total 6247 to 6326 ms | 2044, 2044, 4042, 4042, 6050, 6050 |
| 2.0.0 | nio2 | HttpClient.sendAsync + Mono.fromFuture | 200 | 3 pass | 151 to 160 ms |  |
| 2.0.0 | nio2 | HttpClient.send + Mono.fromCallable | 200 | 3 pass | 148 to 218 ms |  |
| 2.0.1 | nio | fast, returns at once | 200 | 3 pass | 24 to 28 ms |  |
| 2.0.1 | nio | Mono.delay 2 s | 200 | 3 pass | 2047 to 2056 ms |  |
| 2.0.1 | nio | Mono.delay 2 s, 6 concurrent calls | 2 | 3 pass | total 6263 to 6280 ms | 2066, 2066, 4060, 4061, 6070, 6070 |
| 2.0.1 | nio | HttpClient.sendAsync + Mono.fromFuture | 200 | 3 pass | 144 to 152 ms |  |
| 2.0.1 | nio | HttpClient.send + Mono.fromCallable | 200 | 3 pass | 154 to 159 ms |  |
| 2.0.1 | nio2 | fast, returns at once | 200 | 3 pass | 23 to 30 ms |  |
| 2.0.1 | nio2 | Mono.delay 2 s | 200 | 3 pass | 2037 to 2061 ms |  |
| 2.0.1 | nio2 | Mono.delay 2 s, 6 concurrent calls | 2 | 3 pass | total 6250 to 6269 ms | 2029, 2029, 4032, 4032, 6039, 6041 |
| 2.0.1 | nio2 | HttpClient.sendAsync + Mono.fromFuture | 200 | 3 pass | 150 to 195 ms |  |
| 2.0.1 | nio2 | HttpClient.send + Mono.fromCallable | 200 | 3 pass | 147 to 157 ms |  |

"Tool call time" is the time the client waited for `tools/call`. For the saturation rows it is the whole scenario,
and the last column lists the completion time of each of the 6 calls in run 1. The other runs are in the same files.

## What the evidence shows

1. **A request thread is blocked for the whole tool call.** While the 2 second `slow` tool runs, one Tomcat worker
   is in `WAITING` inside `reactor.core.publisher.Mono.block`, called from
   `HttpServletStreamableServerTransportProvider.doPost` (line 536 in 2.0.1, line 526 in 2.0.0).
   See `reproduction/out/2.0.1_nio_slow_run1.log` lines 65 to 66,
   `reproduction/out/2.0.1_nio2_slow_run1.log` lines 97 to 98 and
   `reproduction/out/2.0.0_nio_slow_run1.log` lines 65 to 66. The source line is
   `session.responseStream(jsonrpcRequest, sessionTransport).contextWrite(...).block()`.
2. **Requests queue behind blocked workers.** With `maxThreads=2` and 6 simultaneous calls to the 2 second tool,
   the calls finish in pairs: about 2.0, 2.0, 4.0, 4.0, 6.0 and 6.0 seconds. A dump 0.5 seconds into the run shows both
   workers in `Mono.block` (`reproduction/out/2.0.1_nio_saturate_run1.log` lines 17 to 18 and 46 to 47;
   `reproduction/out/2.0.1_nio2_saturate_run1.log` lines 17 to 18 and 52 to 53). This held on NIO and NIO2,
   on 2.0.0 and 2.0.1, in all 3 runs of each.
3. **The reported hang did not reproduce.** The tool that calls a local server with `HttpClient.sendAsync` and
   `Mono.fromFuture` returned in about 150 ms on NIO and on NIO2, on 2.0.0 and 2.0.1, in all 3 runs. The
   `HttpClient.send` and `Mono.fromCallable` version also returned in about 150 ms. No run reached the 60 second cap.

## What is not proven

- The cause of the hang reported on NIO2. This setup does not show it. The stub answers in 100 ms from the same
  machine. Things that differ in a real service and that were not tried: a slow or external endpoint, many
  concurrent calls with the default `maxThreads` of 200, a custom `HttpClient` executor, a tool that calls back into
  the same Tomcat, TLS or HTTP/2, a different Tomcat version, or a servlet filter in front of the transport.
- Whether the blocking is a defect or a design limit. That is for the maintainers to say. This run only measures
  the effect.
- Behaviour of the stateless and the legacy SSE servlet transports. Only the streamable transport was run.
- Behaviour under Jetty or Undertow.
- The numbers come from one machine, a loopback network, and a single JVM per run.

## How to run it

```
cd reproduction
./run-matrix.sh            # builds, runs the matrix, rewrites out/
```

One scenario by hand (after `mvn -q compile` and `mvn -q dependency:build-classpath -Dmdep.outputFile=cp.txt`):

```
java -Dsdk.version=2.0.1 -cp target/classes:$(cat cp.txt) repro.Repro859 --connector nio2 --scenario saturate --max-threads 2
```

Scenarios: `control`, `slow`, `saturate`, `async-http`, `sync-http`.
