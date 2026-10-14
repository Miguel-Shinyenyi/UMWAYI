package repro;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.client.transport.HttpClientSseClientTransport;
import io.modelcontextprotocol.client.transport.HttpClientStreamableHttpTransport;
import io.modelcontextprotocol.spec.McpSchema;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Reproduction for modelcontextprotocol/java-sdk issue 882: HttpClientStreamableHttpTransport
 * times out on initialize().
 *
 * A stub server (JDK HttpServer) answers "initialize" and "notifications/initialized" in
 * configurable ways. The client is the one from the issue. Each row prints one line that
 * starts with "ROW".
 *
 * Usage: Repro882 [rowName ...]   (no arguments runs every row)
 */
public class Repro882 {

	static final String SDK = System.getProperty("sdk.version", "unknown");

	/** How the stub answers the initialize request. */
	enum Init {
		JSON, JSON_SESSION, SSE, SSE_SESSION, SSE_THEN_HOLD, SSE_PRIMER_ONLY, EMPTY_200, EMPTY_JSON_200, TEXT_PLAIN,
		JSON_WRONG_ID, S401, S404, S500, REDIRECT, NEVER
	}

	/** How the stub answers the notifications/initialized notification. */
	enum Notif {
		ACCEPTED_202, EMPTY_200, JSON_200_BODY, SSE_200_HOLD, SSE_200_PRIMER_ONLY, SSE_200_DATA, TEXT_200, JSON_EMPTY_200,
		NEVER, S401, S404, S500
	}

	record Row(String name, Init init, Notif notif, String endpoint) {
	}

	static List<Row> rows() {
		List<Row> r = new ArrayList<>();
		r.add(new Row("baseline-json", Init.JSON, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("query-string", Init.JSON, Notif.ACCEPTED_202, "/mcp?tk=abc"));
		r.add(new Row("json-session-id", Init.JSON_SESSION, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("sse-reply", Init.SSE, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("sse-reply-session-id", Init.SSE_SESSION, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("sse-reply-held-open", Init.SSE_THEN_HOLD, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-sse-primer-only", Init.SSE_PRIMER_ONLY, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-empty-200", Init.EMPTY_200, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-empty-json-200", Init.EMPTY_JSON_200, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-text-plain", Init.TEXT_PLAIN, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-wrong-id", Init.JSON_WRONG_ID, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-401", Init.S401, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-404", Init.S404, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-500", Init.S500, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-redirect-302", Init.REDIRECT, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("init-never-answers", Init.NEVER, Notif.ACCEPTED_202, "/mcp"));
		r.add(new Row("notif-200-empty", Init.JSON, Notif.EMPTY_200, "/mcp"));
		r.add(new Row("notif-200-json-body", Init.JSON, Notif.JSON_200_BODY, "/mcp"));
		r.add(new Row("notif-200-json-empty", Init.JSON, Notif.JSON_EMPTY_200, "/mcp"));
		r.add(new Row("notif-200-sse-data", Init.JSON, Notif.SSE_200_DATA, "/mcp"));
		r.add(new Row("notif-200-sse-held-open", Init.JSON, Notif.SSE_200_HOLD, "/mcp"));
		r.add(new Row("notif-200-sse-primer-only", Init.JSON, Notif.SSE_200_PRIMER_ONLY, "/mcp"));
		r.add(new Row("notif-200-text-plain", Init.JSON, Notif.TEXT_200, "/mcp"));
		r.add(new Row("notif-never-answers", Init.JSON, Notif.NEVER, "/mcp"));
		r.add(new Row("notif-401", Init.JSON, Notif.S401, "/mcp"));
		r.add(new Row("notif-404", Init.JSON, Notif.S404, "/mcp"));
		r.add(new Row("notif-500", Init.JSON, Notif.S500, "/mcp"));
		return r;
	}

	public static void main(String[] args) throws Exception {
		List<String> only = List.of(args);
		for (Row row : rows()) {
			if (!only.isEmpty() && !only.contains(row.name())) {
				continue;
			}
			runRow(row);
		}
		if (only.isEmpty() || only.contains("sse-transport-comparison")) {
			runSseComparison();
		}
		System.exit(0);
	}

	// ---- one row ---------------------------------------------------------------------

	static void runRow(Row row) throws Exception {
		Stub stub = new Stub(row.init(), row.notif());
		String base = "http://127.0.0.1:" + stub.port();
		long t0 = System.nanoTime();
		String outcome;
		String message = "";
		try {
			HttpClientStreamableHttpTransport transport = HttpClientStreamableHttpTransport.builder(base)
				.endpoint(row.endpoint())
				.build();
			McpSyncClient client = McpClient.sync(transport)
				.clientInfo(new McpSchema.Implementation("Sample client", "0.0.0"))
				.build();
			client.initialize();
			outcome = "ok";
			client.closeGracefully();
		}
		catch (Exception e) {
			outcome = "FAIL";
			Throwable root = e;
			StringBuilder sb = new StringBuilder(e.getClass().getSimpleName() + ": " + e.getMessage());
			while (root.getCause() != null) {
				root = root.getCause();
				sb.append(" <- ").append(root.getClass().getSimpleName()).append(": ").append(root.getMessage());
			}
			message = sb.toString();
		}
		long ms = (System.nanoTime() - t0) / 1_000_000;
		boolean exact = message.contains("Client failed to initialize by explicit API call")
				&& message.contains("Did not observe any item or terminal signal within 20000ms in 'map'");
		System.out.println(String.format("ROW sdk=%s row=%s outcome=%s elapsedMs=%d exactIssueMessage=%s requests=%s uris=%s msg=%s", SDK,
				row.name(), outcome, ms, exact, stub.methods, stub.uris, message.replace('\n', ' ')));
		System.out.flush();
		stub.stop();
	}

	/** B5: the legacy SSE client transport against a stub that speaks the legacy SSE protocol. */
	static void runSseComparison() {
		try {
			SseStub s = new SseStub();
			long t0 = System.nanoTime();
			String outcome = "ok";
			String msg = "";
			try {
				McpSyncClient c = McpClient
					.sync(HttpClientSseClientTransport.builder("http://127.0.0.1:" + s.port()).sseEndpoint("/sse").build())
					.clientInfo(new McpSchema.Implementation("Sample client", "0.0.0"))
					.build();
				c.initialize();
				c.closeGracefully();
			}
			catch (Exception e) {
				outcome = "FAIL";
				msg = e.getClass().getSimpleName() + ": " + e.getMessage();
			}
			System.out.println(String.format("ROW sdk=%s row=sse-transport-comparison outcome=%s elapsedMs=%d msg=%s", SDK, outcome,
					(System.nanoTime() - t0) / 1_000_000, msg));
			s.stop();
		}
		catch (Exception e) {
			System.out.println("ROW row=sse-transport-comparison outcome=SETUP-ERROR msg=" + e);
		}
	}

	// ---- stub servers ---------------------------------------------------------------

	static String initResult(String id, String protocolVersion) {
		return "{\"jsonrpc\":\"2.0\",\"id\":" + id + ",\"result\":{\"protocolVersion\":" + protocolVersion
				+ ",\"capabilities\":{},\"serverInfo\":{\"name\":\"stub\",\"version\":\"1\"}}}";
	}

	static String find(String s, String regex) {
		Matcher m = Pattern.compile(regex).matcher(s);
		return m.find() ? m.group(1) : "null";
	}

	static void sleepQuietly(long ms) {
		try {
			Thread.sleep(ms);
		}
		catch (InterruptedException ignored) {
		}
	}

	static class Stub {

		final HttpServer server;

		final List<String> uris = new CopyOnWriteArrayList<>();

		final List<String> methods = new CopyOnWriteArrayList<>();

		Stub(Init init, Notif notif) throws IOException {
			server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
			server.setExecutor(Executors.newCachedThreadPool(r -> {
				Thread t = new Thread(r, "stub");
				t.setDaemon(true);
				return t;
			}));
			server.createContext("/", ex -> handle(ex, init, notif));
			server.start();
		}

		int port() {
			return server.getAddress().getPort();
		}

		void stop() {
			server.stop(0);
		}

		void handle(HttpExchange ex, Init init, Notif notif) throws IOException {
			String m = ex.getRequestMethod();
			String body = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
			uris.add(m + " " + ex.getRequestURI());
			if (!m.equals("POST")) {
				methods.add(m);
				// GET (server-to-client stream) is not offered. DELETE is accepted.
				send(ex, m.equals("GET") ? 405 : 200, null, "");
				return;
			}
			String rpcMethod = find(body, "\"method\"\\s*:\\s*\"([^\"]+)\"");
			methods.add(rpcMethod);
			if ("initialize".equals(rpcMethod)) {
				String id = find(body, "\"id\"\\s*:\\s*(\"[^\"]*\"|\\d+)");
				String pv = find(body, "\"protocolVersion\"\\s*:\\s*(\"[^\"]+\")");
				answerInit(ex, init, id, pv);
			}
			else if ("notifications/initialized".equals(rpcMethod)) {
				answerNotif(ex, notif);
			}
			else {
				send(ex, 202, null, "");
			}
		}

		void answerInit(HttpExchange ex, Init init, String id, String pv) throws IOException {
			String ok = initResult(id, pv);
			switch (init) {
				case JSON -> send(ex, 200, "application/json", ok);
				case JSON_SESSION -> {
					ex.getResponseHeaders().add("Mcp-Session-Id", "stub-session-1");
					send(ex, 200, "application/json", ok);
				}
				case SSE -> send(ex, 200, "text/event-stream", "event: message\ndata: " + ok + "\n\n");
				case SSE_SESSION -> {
					ex.getResponseHeaders().add("Mcp-Session-Id", "stub-session-1");
					send(ex, 200, "text/event-stream", "event: message\ndata: " + ok + "\n\n");
				}
				case SSE_THEN_HOLD -> hold(ex, "text/event-stream", "event: message\ndata: " + ok + "\n\n");
				case SSE_PRIMER_ONLY -> send(ex, 200, "text/event-stream", "id: 0\ndata:\n\n");
				case EMPTY_200 -> send(ex, 200, null, "");
				case EMPTY_JSON_200 -> send(ex, 200, "application/json", "");
				case TEXT_PLAIN -> send(ex, 200, "text/plain", "hello");
				case JSON_WRONG_ID -> send(ex, 200, "application/json", initResult("\"not-the-request-id\"", pv));
				case S401 -> send(ex, 401, "application/json", "{\"error\":\"unauthorized\"}");
				case S404 -> send(ex, 404, "text/plain", "not found");
				case S500 -> send(ex, 500, "text/plain", "boom");
				case REDIRECT -> {
					ex.getResponseHeaders().add("Location", "/elsewhere");
					send(ex, 302, null, "");
				}
				case NEVER -> sleepQuietly(60_000);
			}
		}

		void answerNotif(HttpExchange ex, Notif notif) throws IOException {
			switch (notif) {
				case ACCEPTED_202 -> send(ex, 202, null, "");
				case EMPTY_200 -> send(ex, 200, null, "");
				case JSON_200_BODY -> send(ex, 200, "application/json", "{}");
				case JSON_EMPTY_200 -> send(ex, 200, "application/json", "");
				case SSE_200_HOLD -> hold(ex, "text/event-stream", "");
				case SSE_200_PRIMER_ONLY -> send(ex, 200, "text/event-stream", "id: 0\ndata:\n\n");
				case SSE_200_DATA -> send(ex, 200, "text/event-stream",
						"event: message\ndata: {\"jsonrpc\":\"2.0\",\"method\":\"notifications/message\",\"params\":{}}\n\n");
				case TEXT_200 -> send(ex, 200, "text/plain", "ok");
				case NEVER -> sleepQuietly(60_000);
				case S401 -> send(ex, 401, "application/json", "{\"error\":\"unauthorized\"}");
				case S404 -> send(ex, 404, "text/plain", "not found");
				case S500 -> send(ex, 500, "text/plain", "boom");
			}
		}

		/** Sends a complete response. An empty body is sent with Content-Length 0. */
		static void send(HttpExchange ex, int status, String contentType, String body) throws IOException {
			byte[] b = body.getBytes(StandardCharsets.UTF_8);
			if (contentType != null) {
				ex.getResponseHeaders().add("Content-Type", contentType);
			}
			if (b.length == 0) {
				ex.sendResponseHeaders(status, -1);
			}
			else {
				ex.sendResponseHeaders(status, b.length);
				ex.getResponseBody().write(b);
			}
			ex.close();
		}

		/** Sends headers and an optional first chunk, then keeps the stream open. */
		static void hold(HttpExchange ex, String contentType, String firstChunk) throws IOException {
			ex.getResponseHeaders().add("Content-Type", contentType);
			ex.sendResponseHeaders(200, 0);
			if (!firstChunk.isEmpty()) {
				ex.getResponseBody().write(firstChunk.getBytes(StandardCharsets.UTF_8));
			}
			ex.getResponseBody().flush();
			sleepQuietly(60_000);
		}

	}

	/** Legacy SSE transport stub: GET /sse announces /message, POST /message answers on the stream. */
	static class SseStub {

		final HttpServer server;

		volatile java.io.OutputStream stream;

		SseStub() throws IOException {
			server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
			server.setExecutor(Executors.newCachedThreadPool(r -> {
				Thread t = new Thread(r, "sse-stub");
				t.setDaemon(true);
				return t;
			}));
			server.createContext("/sse", ex -> {
				ex.getResponseHeaders().add("Content-Type", "text/event-stream");
				ex.sendResponseHeaders(200, 0);
				stream = ex.getResponseBody();
				stream.write("event: endpoint\ndata: /message\n\n".getBytes(StandardCharsets.UTF_8));
				stream.flush();
				sleepQuietly(60_000);
			});
			server.createContext("/message", ex -> {
				String body = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
				ex.sendResponseHeaders(202, -1);
				ex.close();
				if (body.contains("\"initialize\"")) {
					String id = find(body, "\"id\"\\s*:\\s*(\"[^\"]*\"|\\d+)");
					String pv = find(body, "\"protocolVersion\"\\s*:\\s*(\"[^\"]+\")");
					stream.write(("event: message\ndata: " + initResult(id, pv) + "\n\n").getBytes(StandardCharsets.UTF_8));
					stream.flush();
				}
			});
			server.start();
		}

		int port() {
			return server.getAddress().getPort();
		}

		void stop() {
			server.stop(0);
		}

	}

}
