package repro;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.client.transport.HttpClientStreamableHttpTransport;
import io.modelcontextprotocol.spec.McpSchema;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;

/**
 * MCP Java SDK client. Calls tools and prints one line per call, starting with "CALL".
 * Usage: Client http://localhost:8089 [tool ...]   (no tool names: list tools, then call all)
 */
public class Client {

	public static void main(String[] args) throws Exception {
		String base = args.length > 0 ? args[0] : "http://localhost:8089";
		McpSyncClient client = McpClient.sync(HttpClientStreamableHttpTransport.builder(base).endpoint("/mcp").build())
			.requestTimeout(Duration.ofSeconds(60))
			.initializationTimeout(Duration.ofSeconds(60))
			.build();
		client.initialize();

		List<String> registered = client.listTools().tools().stream().map(McpSchema.Tool::name).sorted().toList();
		System.out.println("TOOLS " + registered);

		List<String> wanted = args.length > 1 ? List.of(args).subList(1, args.length) : registered;
		for (String name : wanted) {
			if (!registered.contains(name)) {
				System.out.println("CALL tool=" + name + " result=NOT-REGISTERED");
				continue;
			}
			long t0 = System.nanoTime();
			try {
				CallToolResult r = client.callTool(new McpSchema.CallToolRequest(name, Map.of()));
				long ms = (System.nanoTime() - t0) / 1_000_000;
				System.out.println(describe(name, r, ms));
			}
			catch (Exception e) {
				long ms = (System.nanoTime() - t0) / 1_000_000;
				System.out.println("CALL tool=" + name + " result=EXCEPTION elapsedMs=" + ms + " error="
						+ e.getClass().getSimpleName() + ": " + String.valueOf(e.getMessage()).replace('\n', ' '));
			}
		}
		client.closeGracefully();
		System.exit(0);
	}

	static String describe(String name, CallToolResult r, long ms) {
		StringBuilder items = new StringBuilder();
		int shown = 0;
		for (McpSchema.Content c : r.content()) {
			if (shown++ >= 4) {
				items.append(", ...");
				break;
			}
			String text = c instanceof McpSchema.TextContent t ? t.text() : c.getClass().getSimpleName();
			if (text.length() > 80) {
				text = text.substring(0, 80) + "...(" + text.length() + " chars)";
			}
			items.append(shown > 1 ? ", " : "").append('"').append(text.replace("\n", "\\n")).append('"');
		}
		return "CALL tool=" + name + " result=OK elapsedMs=" + ms + " isError=" + r.isError() + " contentItems="
				+ r.content().size() + " structuredContent=" + (r.structuredContent() != null ? r.structuredContent() : "null")
				+ " content=[" + items + "]";
	}

}
