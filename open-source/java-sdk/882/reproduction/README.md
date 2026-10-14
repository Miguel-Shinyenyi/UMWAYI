# Reproduction for java-sdk #882

`Repro882` starts a stub MCP server (JDK `HttpServer`) that answers `initialize` and
`notifications/initialized` in 27 different ways, and runs the client code from the issue against each.
It prints one `ROW` line per case. It also runs the legacy SSE transport once for comparison.

Needs Java 17 or newer and Maven. Uses only released artifacts from Maven Central.

Run everything (1.1.0, 1.1.4 and 2.0.1, 3 runs each, about 12 minutes):

```
./run-matrix.sh
```

Run one version: `./run-matrix.sh 1.1.0`. Output goes to `out/`: one log per version and run, and `results.tsv`.

Run chosen rows only: pass their names to `Repro882`, for example `init-empty-200 notif-200-sse-held-open`.
The row names are in `Repro882.rows()`.

Files:

- `src/main/java/repro/Repro882.java`: the stub servers, the rows and the client.
- `run-matrix.sh`: builds for each SDK version and runs every row.
- `out/`: the logs from the run described in `../results.md`.
