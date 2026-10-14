Use case: a JVM backend reads the payload of a remote config flag (settings, or encrypted values that PostHog decrypts) without a user context. Node.js and Python have `getRemoteConfigPayload`. `posthog-server` has nothing equivalent. `evaluateFlags()` and `getFeatureFlagPayload()` both need a distinct id.

Proposal, matching Node.js and Python:

```kotlin
// PostHogInterface
public fun getRemoteConfigPayload(key: String): Any?
```

- Request: `GET /api/projects/@current/feature_flags/{key}/remote_config?token={projectToken}` with `Authorization: Bearer {personalApiKey}`. Node.js and Python send the same request.
- Key: the existing `personalApiKey` in `PostHogConfig`, the one local evaluation uses. No new option.
- Return: the decoded JSON payload, or `null`.
- Errors: logged through the config logger and returned as `null`, like the flag code.
- Where: a new method on the internal `PostHogApi`, next to `localEvaluation`.

No existing option covers this. `remoteConfig` in `PostHogConfig` is a deprecated no-op, and `PostHogApi.remoteConfig()` calls the client `/config` endpoint.

Questions:

1. Are the name and signature right?
2. With no personal API key, should it log and return `null` (Python) or throw (Node.js)?
3. Should API errors reach the caller? `null` also means "no payload".
4. Do you want an sdk-specs entry first?

I can implement this once you agree on the shape.
