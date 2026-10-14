# posthog-android #577: remote config payload in the Java server SDK

Research notes, read on 2026-10-15. Source repo: PostHog/posthog-android, default branch `main`, read at commit `d9004788`.
Fork cloned to `~/src/posthog-android`. Nothing was posted to GitHub. No code was written in Stage 1.

## Acceptance checks (written first)

Stage 1
- A1 How the Node.js and Python SDKs implement `getRemoteConfigPayload`: name, signature, endpoint, authentication, return type, errors. From source, with links and paths.
- A2 Whether a published sdk-spec or SDK guidelines page defines this method.
- A3 How `posthog-server` calls the PostHog API for feature flags today: classes, HTTP client, config, errors, how local evaluation authenticates. Paths and line numbers.
- A4 Three recently merged external pull requests that touched `posthog-server` or a feature: time to merge, what reviewers asked for.
- A5 Open questions for the maintainers, one sentence each.

Stage 2 (only after Miguel says go): B1 `make compile` exits 0. B2 prototype on a branch; posthog-server tests and `make checkFormat` pass. B3 tests for success, no payload, 404, 401 or 403, network failure, malformed JSON, all against a mock HTTP server. B4 `make api` output committed and the public API additions listed line by line. B5 the diff holds only files the design needs.

Stage 3: C1 no em dashes in the new hub files. C2 UMWAYI main equals origin/main after the push.

## Summary

- Issue #577 (opened 2026-06-15 by phillram, labels `enhancement`, `feature/feature-flags`, `server`, no assignee, no linked PR). Its only comment
  is from the maintainer marandaneto (2026-06-16): "this is about the `getRemoteConfigPayload` method and not the /$token/config endpoint".
  Nobody has proposed an API shape.
- The method does not exist in `posthog-server` or in the core module. The code search found only a deprecated no-op `remoteConfig` option
  and an unrelated internal `PostHogApi.remoteConfig()` that calls the client `/array/<token>/config` endpoint.
- No published spec defines the method. So CONTRIBUTING requires an agreed API shape in the issue before any implementation.
  AGENTS.md says the same: for an external contributor with no agreed issue and no spec, stop and draft the issue text.
- The issue author, phillram, also authored the merged `posthog-server` fix #795. The issue has no assignee and no linked PR as of 2026-10-15.
  Check #577 again before starting any code.

## A1: Node.js and Python implementations

Node.js: `PostHog/posthog-js`, `packages/node/src/client.ts`, read at commit `e6598be4`.
- Public method (line 1936): `async getRemoteConfigPayload(flagKey: string): Promise<JsonType | undefined>`.
- Disabled client: logs "The client is disabled", returns `undefined`.
- No personal API key: **throws** `Error('Personal API key is required for remote config payload decryption')`.
- Request (private `_requestRemoteConfigPayload`, line 2930): `GET {host}/api/projects/@current/feature_flags/{flagKey}/remote_config?token={encodeURIComponent(projectApiKey)}`
  with headers `Authorization: Bearer {personalApiKey}`, `Content-Type: application/json`, plus custom headers. A timeout from `requestTimeout`
  aborts the request.
- Network error: emitted on the client's `error` event, returns `undefined`.
- Response handling: `response.json()`. The source comment says the endpoint stores the payload as a JSON-encoded string, so the value is
  effectively double encoded; if the parsed value is a string it is parsed again, and if that fails the string is returned as is.
- Public docs on the method are only a KDoc comment with an example.

Python: `PostHog/posthog-python`, `posthog/client.py` line 4280 and `posthog/request.py` line 355, read at commit `6f658988`.
- Public method: `get_remote_config_payload(self, key: str)`. Docstring: returns the payload "or `None` if the client is disabled, no personal API key
  is configured, or the request fails. Encrypted payloads are decrypted by PostHog before being returned." Note: "Requires `secret_key`".
- Disabled client: returns `None`. No personal API key: logs a warning, returns `None` (it does not raise).
- Request (`request.py` `_remote_config`): `GET {host}/api/projects/@current/feature_flags/{key}/remote_config?token={project_api_key}` with
  `Authorization: Bearer {personal_api_key}`, via the shared `_get` helper. Timeout from `feature_flags_request_timeout_seconds`.
- Any exception in the call is logged and the method returns `None` (the `except` branch has no return, so `None`).
- Return value: `response.data` as decoded by the shared response helper, with no second decode.

Both use the same endpoint and the same two credentials: the public project token in the query string and the **personal API key** as the bearer.
They differ on a missing personal key (Node throws, Python warns and returns nothing). Whether the Go, Ruby and C# SDKs match was not read.

## A2: spec

- sdk-specs (`PostHog/sdk-specs`, read at commit `513d94cf`, 2026-10-10) has a "Remote Config" spec (`openspec/specs/remote-config/spec.md`). It is
  about the **client-side project config bootstrap**: `GET {assetBase}/array/{projectKey}/config`, public token only, "SHALL NOT require a personal
  API key". It is not about `getRemoteConfigPayload`.
- The compliance audits say so directly. `compliance/posthog-node.md` row 56 calls Node's `getRemoteConfigPayload()` "a narrow, personal-API-key-gated,
  per-flag encrypted/JSON payload fetch, structurally unrelated to" that spec. `compliance/posthog-python.md` row 65 says the same of Python's.
  `compliance/posthog-java.md` row 40 marks Remote Config as not applicable and calls the `remoteConfig` option a deprecated no-op.
- I found no spec for the method itself. The README capability table has "Get Feature Flag Payload" (an evaluated payload for a user), which is a
  different capability.
- So the "already specified" exemption in CONTRIBUTING does not apply. The SDK guidelines page
  (https://posthog.com/handbook/engineering/sdks/guidelines) is linked from CONTRIBUTING; I did not fetch it.
- On PR #805 a maintainer asked the contributor to document a new public API in sdk-specs. A new capability like this may need a spec entry.

## A3: how posthog-server calls the API today

- `posthog-server` is a thin layer over the core module. Public entry: `posthog-server/src/main/java/com/posthog/server/PostHog.kt`, implementing the
  **sealed** interface `PostHogInterface` (`PostHogInterface.kt` line 9). Adding an abstract method there is source compatible for users because the
  interface is sealed (PR #834 did exactly this for `identify`).
- HTTP lives in the core module: `posthog/src/main/java/com/posthog/internal/PostHogApi.kt`, an OkHttp wrapper (`@PostHogInternal public class PostHogApi`,
  line 35). `PostHogFeatureFlags` (`posthog-server/.../internal/PostHogFeatureFlags.kt`) receives it as `api`.
- Closest existing call: `PostHogApi.localEvaluation(personalApiKey, etag)` (`PostHogApi.kt` lines 407 to 456). It builds
  `"$theHost/api/feature_flag/local_evaluation/?token=${config.projectToken}&send_cohorts"`, sets `User-Agent`, `Content-Type` and
  `Authorization: Bearer $personalApiKey`, calls `client.newCall(request).execute().use { ... }`, throws `PostHogApiError(code, message, body)` on a
  non-2xx response, and deserializes the body with `config.serializer`.
- The other existing call named "remote config", `PostHogApi.remoteConfig()` (lines 355 to 394), fetches `"$host/array/${config.projectToken}/config"`
  with no key. The name is easy to confuse with the requested method.
- Config: `PostHogConfig.personalApiKey` (`posthog-server/.../PostHogConfig.kt` line 191), trimmed, blank becomes null, documented as "Required when
  localEvaluation is true". `localEvaluation: Boolean = false` (line 132). `remoteConfig: Boolean` is marked `@Deprecated` ("Remote config is now always
  enabled. This option is a no-op", line 62).
- Error handling in the flag code (`PostHogFeatureFlags.loadFeatureFlagDefinitions`, lines 575 to 640): catches `PostHogApiError`, `IOException` and
  `Throwable`, logs through `config.logger.log(...)`, and does not rethrow. A missing personal API key is logged by `logMissingPersonalApiKey()`
  (line 955) and the call returns.
- The existing `getFeatureFlagPayload(distinctId, key, defaultValue, ...)` returns `Any?` and is deprecated in favour of
  `evaluateFlags(distinctId).getFlagPayload(key)`. It needs a distinct id, so it does not cover this request.
- Tests: JUnit with MockWebServer, files under `posthog-server/src/test/java/com/posthog/server/` (for example `PostHogTest.kt`,
  `PostHogEvaluateFlagsTest.kt`); AGENTS.md also requires closing the SDK and shutting down mock servers in cleanup.

## A4: three merged external pull requests in posthog-server

The GitHub `author_association` for these authors is `CONTRIBUTOR` (not `MEMBER` or `OWNER`).

| PR | What | Opened | Merged | Time | Reviewers asked for |
|---|---|---|---|---|---|
| #834 (santimillang) | `feat(server)`: timestamp override on `identify`. New public overload. Closes issue #303. 7 files, +69/-1 (API files, changeset, test) | 2026-10-02 | 2026-10-05 | 3 days | One maintainer approval ("no qualifying findings"). A maintainer wrote "Commits must have verified signatures" and asked the author to sign the commits and force-push. |
| #805 (gustavohstrassburger) | `feat(server)`: filter the `evaluateFlags` snapshot by evaluation runtime. New public API, no linked issue. 12 files, +412/-26 | 2026-09-21 | 2026-09-28 | 7 days | A reviewer (haacked) left a blocking comment plus suggestions. A review bot flagged "Public API lacks agreement". A maintainer asked the author to document the new API in sdk-specs. 13 reviews in total. |
| #795 (phillram, the author of #577) | `fix(server)`: keep the local evaluation ETag in step with the flag definition cache. 4 files, +165/-7 | 2026-09-16 | 2026-09-24 | 8 days | One maintainer approval. |

Pattern: PRs with a changeset file (`.changeset/*.md`) and tests; public API changes also include the regenerated `api/*.api` files. The one
that added public API with no agreed issue (#805) drew the most review.

## A5: open questions for the maintainers

1. Is `getRemoteConfigPayload(key: String): Any?` on `PostHogInterface` the right name and signature?
2. With no personal API key, should the method log and return `null` (Python, and the existing flag code) or throw (Node)?
3. Should API and network errors surface to the caller, since a `null` result can mean either "no payload" or "the request failed"?
4. Should the call live as a new method on the internal `PostHogApi` in the core module, next to `localEvaluation`?
5. Do you want an sdk-specs entry before or with the implementation?

## Contribution rules found

- CONTRIBUTING.md, "Public API changes": external contributors open an issue and wait for a maintainer to agree on the API shape; a published
  sdk-spec counts as that agreement; run `make api` and expect a diff in `api/*.api` for public changes.
- AGENTS.md: external contributor with no agreed issue and no spec: stop and draft the issue text for the user to post.
- Before opening a PR: `pnpm changeset` and commit the generated `.changeset/*.md`. The PR template asks for tests, an Agent context section if an
  agent helped, and human review.
- Build commands (`Makefile`): `make compile`, `make test`, `make testJava` (this runs only `./gradlew :posthog:test`, the core tests, so the
  `posthog-server` tests need `./gradlew :posthog-server:test`), `make checkFormat`, `make format`, `make api`.
- Toolchain here: Gradle 9.8.0 (wrapper), Kotlin 2.4.10, Java 21.0.5 (Oracle), macOS on Apple silicon.
- Commit signing: on #834 a maintainer required verified signatures. I found no written rule in CONTRIBUTING.md or the workflows. This clone has no
  commit signing configured, so a branch pushed from it would likely need signing set up first. Miguel decides.

## AI contribution policy (AI_POLICY.md, in the repo root)

- "You own what you submit." Understand the code, test it, be ready to explain it without re-prompting an LLM.
- "Prove it works": verify end to end, add tests, describe the test strategy and edge cases in the PR. PRs that clearly were not run are closed.
- "Disclose AI usage": the PR template has an "Agent context" section. If an agent co-authored the PR, say so and name the tools.
- "Prefer PRs over AI-generated issues": do not paste AI output into an issue. Unreviewed AI-generated bug reports are closed without response.
- Consequences: first closure comes with a link to the policy; two or more closures lead to an account block.
- Implications here: the issue comment must be text Miguel has read and can stand behind line by line. A PR must carry the Agent context section.
  The task prompt asks the issue comment not to mention AI; the policy's disclosure rule applies to PRs, and "prefer PRs over AI-generated issues"
  applies to bug reports, but Miguel should decide how to word his own comment.

## Not verified

- Nothing was built or run in Stage 1. Behaviour of the Node and Python methods is from reading the source, not running it.
- I could not call the real endpoint (no personal API key), so the response shape (double-encoded JSON string or not) is taken from Node's source
  comment and Python's return handling.
- I did not read the Go, Ruby and C# implementations, or the SDK guidelines page.
- `author_association` of the three PR authors is from the GitHub API; whether any of them is PostHog staff was not checked.
