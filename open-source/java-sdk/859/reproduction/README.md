# Reproduction for java-sdk #859

An embedded Tomcat serves an MCP server through `HttpServletStreamableServerTransportProvider`.
`Repro859` starts it, calls it with a real MCP client, and prints one `RESULT` line per run plus thread dumps.

Needs Java 17 or newer and Maven. Uses only released artifacts from Maven Central.

Run the whole matrix (2.0.0 and 2.0.1, NIO and NIO2, 5 scenarios, 3 runs each; a few minutes):

```
./run-matrix.sh
```

Run another version: `./run-matrix.sh 2.0.1`. Output goes to `out/`: one log per run, and `results.tsv`.

Files:

- `src/main/java/repro/Repro859.java`: the server, the tools, the scenarios and the thread dump helper.
- `run-matrix.sh`: builds for each SDK version and runs every scenario 3 times.
- `out/`: the logs from the run described in `../results.md`.
