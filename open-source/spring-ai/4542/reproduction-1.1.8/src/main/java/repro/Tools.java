package repro;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import org.springaicommunity.mcp.annotation.McpTool;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.stereotype.Component;

/**
 * Tools used by the issue 4542 reproduction. The name says what the method returns.
 */
@Component
public class Tools {

	public record Person(String name, int age) {
	}

	@McpTool(name = "flux-3", description = "Flux<String> with 3 elements")
	public Flux<String> flux3() {
		return Flux.just("item-1", "item-2", "item-3");
	}

	@McpTool(name = "flux-0", description = "Empty Flux<String>")
	public Flux<String> flux0() {
		return Flux.empty();
	}

	@McpTool(name = "flux-1", description = "Flux<String> with 1 element")
	public Flux<String> flux1() {
		return Flux.just("only");
	}

	@McpTool(name = "flux-error-after-2", description = "Flux<String> that emits 2 elements, then errors")
	public Flux<String> fluxErrorAfterTwo() {
		return Flux.concat(Flux.just("item-1", "item-2"), Flux.error(new IllegalStateException("boom")));
	}

	@McpTool(name = "flux-nulls", description = "Flux<String> from a list that holds a null element")
	public Flux<String> fluxNulls() {
		// Reactor does not allow null elements. fromIterable raises NullPointerException when it meets one.
		return Flux.fromIterable(Arrays.asList("item-1", null, "item-3"));
	}

	@McpTool(name = "flux-slow", description = "Flux<String> with 3 elements, 500 ms apart")
	public Flux<String> fluxSlow() {
		return Flux.interval(Duration.ofMillis(500)).take(3).map(i -> "tick-" + (i + 1));
	}

	@McpTool(name = "flux-large", description = "Flux<String> with 10000 elements")
	public Flux<String> fluxLarge() {
		return Flux.range(1, 10_000).map(i -> "item-" + i);
	}

	@McpTool(name = "flux-calltoolresult", description = "Flux<CallToolResult> with 3 elements")
	public Flux<CallToolResult> fluxCallToolResult() {
		return Flux.just("r1", "r2", "r3").map(t -> CallToolResult.builder().addTextContent(t).build());
	}

	@McpTool(name = "mono-string", description = "Mono<String>")
	public Mono<String> monoString() {
		return Mono.just("single");
	}

	@McpTool(name = "mono-list", description = "Mono<List<String>> with 3 elements")
	public Mono<List<String>> monoList() {
		return Mono.just(List.of("item-1", "item-2", "item-3"));
	}

	@McpTool(name = "list-plain", description = "Plain List<String>. Documented as filtered out on async servers.")
	public List<String> listPlain() {
		return List.of("item-1", "item-2", "item-3");
	}

	@McpTool(name = "flux-structured", description = "Flux<Person> with 3 elements, structured output",
			generateOutputSchema = true)
	public Flux<Person> fluxStructured() {
		return Flux.just(new Person("Ada", 36), new Person("Alan", 41), new Person("Grace", 85));
	}

	@McpTool(name = "mono-structured", description = "Mono<Person>, structured output", generateOutputSchema = true)
	public Mono<Person> monoStructured() {
		return Mono.just(new Person("Ada", 36));
	}

}
