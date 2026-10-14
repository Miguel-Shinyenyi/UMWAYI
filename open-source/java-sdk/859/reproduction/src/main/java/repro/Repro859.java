package repro;

import com.sun.net.httpserver.HttpServer;
import io.modelcontextprotocol.client.McpClient;
import io.modelcontextprotocol.client.McpSyncClient;
import io.modelcontextprotocol.client.transport.HttpClientStreamableHttpTransport;
import io.modelcontextprotocol.server.McpServer;
import io.modelcontextprotocol.server.transport.HttpServletStreamableServerTransportProvider;
import io.modelcontextprotocol.spec.McpSchema;
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.apache.catalina.Context;
import org.apache.catalina.Wrapper;
import org.apache.catalina.connector.Connector;
import org.apache.catalina.startup.Tomcat;
import org.apache.coyote.AbstractProtocol;
import reactor.core.publisher.Mono;

/**
 * Reproduction for modelcontextprotocol/java-sdk issue 859: servlet transports call
 * block() on the Tomcat request thread.
 *
 * Usage: Repro859 --connector nio|nio2 --scenario control|slow|saturate|async-http|sync-http
 * [--max-threads N] [--cap-seconds N]
 *
 * Every result line starts with "RESULT". Thread dumps are printed between DUMP-BEGIN and
 * DUMP-END.
 */
public class Repro859 {

	static final Duration SLOW = Duration.ofSeconds(2);

	public static void main(String[] args) throws Exception {
		Map<String, String> opt = parse(args);
		String connector = opt.getOrDefault("connector", "nio");
		String scenario = opt.getOrDefault("scenario", "control");
		int maxThreads = Integer.parseInt(opt.getOrDefault("max-threads", "200"));
		int cap = Integer.parseInt(opt.getOrDefault("cap-seconds", "60"));
		String sdk = System.getProperty("sdk.version", "unknown");

		HttpServer stub = startStub();
		int stubPort = stub.getAddress().getPort();
		Tomcat tomcat = startTomcat(connector, maxThreads, stubPort);
		int port = tomcat.getConnector().getLocalPort();
		String base = "http://127.0.0.1:" + port;

		long start = System.nanoTime();
		String outcome;
		String detail = "";
		ExecutorService ex = Executors.newCachedThreadPool(r -> {
			Thread t = new Thread(r, "scenario");
			t.setDaemon(true);
			return t;
		});
		Future<String> f = ex.submit(() -> run(scenario, base));
		try {
			detail = f.get(cap, TimeUnit.SECONDS);
			outcome = "pass";
		}
		catch (TimeoutException e) {
			outcome = "HANG";
			detail = "no result within " + cap + " s";
			dump("hang-final", "");
		}
		catch (Exception e) {
			outcome = "error";
			Throwable c = e.getCause() != null ? e.getCause() : e;
			detail = c.getClass().getSimpleName() + ": " + c.getMessage();
		}
		long ms = (System.nanoTime() - start) / 1_000_000;
		System.out.printf("RESULT sdk=%s connector=%s scenario=%s maxThreads=%d outcome=%s elapsedMs=%d detail=%s%n", sdk,
				connector, scenario, maxThreads, outcome, ms, detail.replace('\n', ' '));
		System.out.flush();
		System.exit(0);
	}

	// ---- scenarios -----------------------------------------------------------------

	static String run(String scenario, String base) throws Exception {
		switch (scenario) {
			case "control":
				return callOnce(base, "fast");
			case "slow":
				return callOnceWithDump(base, "slow");
			case "async-http":
				return callOnce(base, "async-http");
			case "sync-http":
				return callOnce(base, "sync-http");
			case "saturate":
				return saturate(base, 6);
			default:
				throw new IllegalArgumentException(scenario);
		}
	}

	static McpSyncClient client(String base) {
		McpSyncClient c = McpClient.sync(HttpClientStreamableHttpTransport.builder(base).endpoint("/mcp").build())
			.requestTimeout(Duration.ofSeconds(90))
			.initializationTimeout(Duration.ofSeconds(90))
			.build();
		c.initialize();
		return c;
	}

	static String call(McpSyncClient c, String tool) {
		McpSchema.CallToolResult r = c.callTool(new McpSchema.CallToolRequest(tool, Map.of()));
		return ((McpSchema.TextContent) r.content().get(0)).text();
	}

	static String callOnce(String base, String tool) {
		McpSyncClient c = client(base);
		long t0 = System.nanoTime();
		String text = call(c, tool);
		return "tool=" + tool + " text=" + text + " callMs=" + (System.nanoTime() - t0) / 1_000_000;
	}

	/** Calls the slow tool and takes a thread dump one second into the wait. */
	static String callOnceWithDump(String base, String tool) throws Exception {
		McpSyncClient c = client(base);
		long t0 = System.nanoTime();
		CompletableFuture<String> pending = CompletableFuture.supplyAsync(() -> call(c, tool));
		Thread.sleep(1000);
		dump("during-slow-call", "exec");
		String text = pending.get();
		return "tool=" + tool + " text=" + text + " callMs=" + (System.nanoTime() - t0) / 1_000_000;
	}

	/** n concurrent slow calls. Clients initialise first, then all call at the same instant. */
	static String saturate(String base, int n) throws Exception {
		List<McpSyncClient> clients = new ArrayList<>();
		for (int i = 0; i < n; i++) {
			clients.add(client(base));
		}
		CountDownLatch go = new CountDownLatch(1);
		ExecutorService pool = Executors.newFixedThreadPool(n);
		List<Future<Long>> results = new ArrayList<>();
		for (McpSyncClient c : clients) {
			results.add(pool.submit(() -> {
				go.await();
				long t0 = System.nanoTime();
				call(c, "slow");
				return (System.nanoTime() - t0) / 1_000_000;
			}));
		}
		go.countDown();
		Thread.sleep(500);
		dump("saturation-0.5s", "exec");
		List<Long> times = new ArrayList<>();
		for (Future<Long> r : results) {
			times.add(r.get());
		}
		times.sort(Long::compare);
		return "slowToolMs=" + SLOW.toMillis() + " completionMsSorted=" + times;
	}

	// ---- server --------------------------------------------------------------------

	static Tomcat startTomcat(String connector, int maxThreads, int stubPort) throws Exception {
		Tomcat tomcat = new Tomcat();
		tomcat.setBaseDir(java.nio.file.Files.createTempDirectory("tomcat-repro").toString());
		Connector c = new Connector(
				connector.equals("nio2") ? "org.apache.coyote.http11.Http11Nio2Protocol" : "org.apache.coyote.http11.Http11NioProtocol");
		c.setPort(0);
		((AbstractProtocol<?>) c.getProtocolHandler()).setMaxThreads(maxThreads);
		tomcat.setConnector(c);

		HttpServletStreamableServerTransportProvider provider = HttpServletStreamableServerTransportProvider.builder()
			.mcpEndpoint("/mcp")
			.build();

		HttpClient http = HttpClient.newHttpClient();
		URI stubUri = URI.create("http://127.0.0.1:" + stubPort + "/ok");
		HttpRequest req = HttpRequest.newBuilder(stubUri).build();

		Map<String, Object> schema = Map.of("type", "object", "properties", Map.of());
		McpServer.async(provider)
			.serverInfo("repro-859", "1")
			.capabilities(McpSchema.ServerCapabilities.builder().tools(false).build())
			.toolCall(McpSchema.Tool.builder("fast", schema).build(),
					(exchange, request) -> Mono.just(text("fast-ok")))
			.toolCall(McpSchema.Tool.builder("slow", schema).build(),
					(exchange, request) -> Mono.delay(SLOW).map(i -> text("slow-ok")))
			.toolCall(McpSchema.Tool.builder("async-http", schema).build(),
					(exchange, request) -> Mono.fromFuture(http.sendAsync(req, HttpResponse.BodyHandlers.ofString()))
						.map(r -> text("async-http-ok:" + r.body())))
			.toolCall(McpSchema.Tool.builder("sync-http", schema).build(),
					(exchange, request) -> Mono.fromCallable(() -> http.send(req, HttpResponse.BodyHandlers.ofString()))
						.map(r -> text("sync-http-ok:" + r.body())))
			.build();

		Context ctx = tomcat.addContext("", null);
		Wrapper w = Tomcat.addServlet(ctx, "mcp", provider);
		w.setAsyncSupported(true);
		ctx.addServletMappingDecoded("/mcp", "mcp");
		tomcat.start();
		return tomcat;
	}

	static McpSchema.CallToolResult text(String s) {
		return McpSchema.CallToolResult.builder().addTextContent(s).build();
	}

	static HttpServer startStub() throws Exception {
		HttpServer s = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
		s.createContext("/ok", h -> {
			try {
				Thread.sleep(100);
			}
			catch (InterruptedException ignored) {
			}
			byte[] b = "stub".getBytes();
			h.sendResponseHeaders(200, b.length);
			h.getResponseBody().write(b);
			h.close();
		});
		s.setExecutor(Executors.newCachedThreadPool(r -> {
			Thread t = new Thread(r, "stub");
			t.setDaemon(true);
			return t;
		}));
		s.start();
		return s;
	}

	// ---- helpers -------------------------------------------------------------------

	/** Prints stacks of threads whose name contains the filter (all threads if empty). */
	static void dump(String label, String nameFilter) {
		System.out.println("DUMP-BEGIN " + label);
		for (ThreadInfo ti : ManagementFactory.getThreadMXBean().dumpAllThreads(false, false, 40)) {
			if (!ti.getThreadName().contains(nameFilter)) {
				continue;
			}
			System.out.println("THREAD " + ti.getThreadName() + " state=" + ti.getThreadState());
			for (StackTraceElement el : ti.getStackTrace()) {
				System.out.println("    at " + el);
			}
		}
		System.out.println("DUMP-END " + label);
	}

	static Map<String, String> parse(String[] args) {
		Map<String, String> m = new java.util.HashMap<>();
		for (int i = 0; i + 1 < args.length; i += 2) {
			m.put(args[i].replaceFirst("^--", ""), args[i + 1]);
		}
		return m;
	}

}
