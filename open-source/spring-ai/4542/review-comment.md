I tested this PR against Spring AI 2.0.1 by applying its diff to the `v2.0.1` tag. Setup: stateless async server, streamable HTTP, MCP Java SDK 2.0.0 client, JDK 17. Each case ran twice with identical output.

Results:

- `Flux<String>` with 3 elements: 1 content item before, 3 with this PR.
- Empty `Flux`: before, no response (my client gave up after 60 s). With this PR, an empty result in about 25 ms.
- `Mono<String>`, `Mono<List<String>>` and `Mono<Person>`: unchanged.
- `mcp-annotations` module tests on 2.0.1 and on this PR's head (`59c4442`): 1376 run, 0 failures. The format check passes.

Two cases that behave differently from before:

1. `@McpTool(generateOutputSchema = true)` on a method returning `Flux<Person>`. Before, `structuredContent` held the first element. With this PR the call returns `isError=true` ("Response missing structured content..."). The merge copies only `content()`.
2. A `Flux` that emits 2 elements and then errors. Before, the result was the first element with `isError=false`. Now it is `isError=true` ("Error invoking method: boom"), and the 2 received elements are dropped.

Also: a `Flux` of 3 elements, 500 ms apart, now answers after 1.5 s instead of 0.5 s, because the call waits for completion.

Not tested: `isError` or `_meta` on individual `Flux<CallToolResult>` elements, the sync server, other transports.

Reach: the same `.next()` is on the `2.0.x` branch, the `v2.0.1` tag and in `mcp-annotations` 0.9.0, which 1.1.x uses (reproduced on 1.1.8). This PR targets `main` only.

Question for the maintainers: should a `Flux` give one content item per element, as here, or one JSON array item like `Mono<List<T>>`?

Reproduction and saved outputs: https://github.com/Miguel-Shinyenyi/UMWAYI/tree/main/open-source/spring-ai/4542
