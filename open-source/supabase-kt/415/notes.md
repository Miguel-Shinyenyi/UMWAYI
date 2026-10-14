# supabase-kt #415: Supabase Auth in a custom backend

Research notes, read on 2026-10-14 and 2026-10-15. Source repo: supabase-community/supabase-kt, default branch
`master`, read at commit `752d8999` (2026-10-08). Fork cloned to `~/src/supabase-kt`. Nothing was posted to GitHub.

## Acceptance checks (written first)

Stage 1
- A1 Repo layout: modules, where the auth module lives, what is under `plugins/`, how modules are published,
  Kotlin and Gradle versions, targets. Paths cited.
- A2 Whether JWT parsing or verification exists in the auth module, and its JSON and crypto dependencies.
- A3 Current Supabase JWT facts with cited documentation: signing options, JWKS endpoint, claims, rotation.
- A4 What htmx-supabase-spring-boot-starter verifies and how, in under ten lines. No code copied.
- A5 Three recently merged external pull requests: time to merge, what the reviewer asked for.
- A6 What CONTRIBUTING.md and the PR template require.
- A7 A module split table, with core versus Spring Boot or Ktor glue marked.

Stage 2 (only after Miguel says go): B1 fork builds with the documented command. B2 prototype implements the core only
and says what it does not support. B3 tests use fixed test keys and tokens built in the test. B4 repo checks pass.
B5 the diff holds only files the design needs.

Stage 3: C1 no em dashes in the new hub files. C2 UMWAYI main equals origin/main after the push.

## Summary of the finding that changes the plan

**The core already exists.** `Auth#getClaims()` was added by the maintainer in PR #1141 (opened 2026-01-15, merged
2026-02-06), two years after #415 was opened (2024-01-05). The thread stopped on 2024-01-11, so it predates that work.
What is still missing for a custom backend is narrower than the issue asks for. See A2 and A7.

## A1: repo layout

- Gradle Kotlin Multiplatform build. Kotlin 2.4.0, Ktor 3.5.1, kotlinx.serialization 1.11.0, coroutines 1.11.0,
  AGP 8.11.1 (`gradle/libs.versions.toml`). Gradle wrapper 9.5.1 (`gradle/wrapper/gradle-wrapper.properties`).
  Library version `3.9.0-beta-1` (`gradle.properties`). Local Java is 21.0.5; CI uses JDK 17 (`.github/workflows/build.yml`).
- Library modules in `settings.gradle.kts`: `Auth`, `Postgrest`, `Storage`, `Realtime`, `Functions`, `Supabase`
  (renamed `auth-kt`, `postgrest-kt`, `storage-kt`, `realtime-kt`, `functions-kt`, `supabase-kt`), plus
  `serializers/Moshi`, `serializers/Jackson`, `test-common`, `integration-test`, samples. The module list is the
  `SupabaseModule` enum in `buildSrc/src/main/kotlin/Modules.kt`.
- The old `GoTrue/` folder is only a README. The issue says "gotrue-kt"; the module is now `Auth` / `auth-kt`.
- `plugins/` holds `ApolloGraphQL` and `ImageLoaderIntegration` sources. `ComposeAuth`, `ComposeAuthUI`, `CoilIntegration`
  and `Coil3Integration` contain only a README saying "Moved to a new repository":
  `supabase-community/supabase-kt-plugins` (the plugins in that repo: ApolloGraphQL, Coil, Coil3, ComposeAuth,
  ComposeAuthUI, Sketch). The maintainer's 2024 idea of Spring Boot and Ktor modules "inside /plugins" now maps to that
  other repository, or to a new place. **This is a question for the maintainer.** `plugins` is excluded from the library
  filter in the root `build.gradle.kts`.
- Targets: `allTargets()` in `buildSrc/src/main/kotlin/KotlinTargets.kt`: JVM (bytecode target 1.8) and Android, JS,
  Wasm JS, iOS, macOS, Linux (x64), Windows (mingwX64), and others in that file. Auth groups them as `desktop` (JVM, macOS,
  Linux, mingw) and `nonDesktop` (iOS, tvOS, watchOS, JS, WasmJS) (`Auth/build.gradle.kts`).
- Publishing: Maven Central through the vanniktech plugin (`buildSrc/.../Publishing.kt`), group
  `io.github.jan-tennert.supabase`. Local try-out: `./gradlew -DLibrariesOnly=true -DDisableSigning=true
  -DSupabaseVersion="x" publishToMavenLocal` (CONTRIBUTING.md).
- Notable for this issue: `Auth/build.gradle.kts` `desktopMain` already has `api(libs.ktor.server.core)` and
  `api(libs.ktor.server.cio)` (used for the OAuth callback server on desktop). So a Ktor server dependency has a precedent in
  this module. It also means `auth-kt` carries Android, browser and desktop dependencies a backend does not need.

## A2: JWT code in the auth module today

Package `io.github.jan.supabase.auth.jwt` (`Auth/src/commonMain/kotlin/.../auth/jwt/`):

- `JWTUtils.kt`: splits and base64url-decodes a JWT into header, payload and signature (`@SupabaseInternal`).
- `ClaimsResponse.kt`: `ClaimsResponse(claims: JwtPayload, header: JwtHeader, signature)`. `JwtHeader.alg` is
  RS256, ES256 or HS256. `JwtPayload` has typed `iss`, `sub`, `aud`, `exp`, `iat`, `role`, `aal`, `sessionId`, `email`,
  `phone`, `isAnonymous`, `jti`, `nbf`, `appMetadata`, `userMetadata`, `amr`, `ref`, and `getClaim<T>(key)`.
- `JWK.kt`, `JwkCache.kt` (interface plus `SharedJwkCache`, a process-wide cache), `DerUtils.kt` (JWK to DER for RSA and
  EC, ECDSA raw to DER), `ClaimsRequestBuilder.kt` (`allowExpired`, extra `jwks`), `exception/InvalidJwtException.kt`.
- `Auth#getClaims(jwt, options)` (`AuthImpl.kt` lines 440 to 481): decodes the token, rejects an expired one unless
  `allowExpired`, then: for RS256 or ES256 with a `kid`, fetches the key from `<auth>/.well-known/jwks.json` (10 minute
  in-memory TTL, `AuthImpl.kt` lines 101 and 483 to 500) and verifies the signature; for HS256 or a token with no `kid`, it calls
  the Auth server (`retrieveUser`, `GET /user`) instead of checking locally.
- Dependencies: kotlinx.serialization JSON, kotlinx-io, and `dev.whyoleg.cryptography` 0.6.0 (`cryptography-core` and
  `cryptography-provider-optimal`), added in PR #1141. Common code, so it builds for all targets.
- Tests: `Auth/src/commonTest/kotlin/JWTUtilsTest.kt`, `DerUtilsTest.kt`, `AuthApiTest.kt`.

What `getClaims` does **not** do (read from the code, not run):
- It does not check `aud`, `iss` or `nbf`.
- It cannot verify HS256 offline with a shared secret. It needs a network call per token.
- It needs an `Auth` instance, so a `SupabaseClient` with the Auth plugin and a project URL and key, not just a token and
  a JWKS URL.
- No EdDSA. The Supabase docs list EdDSA as "Coming soon" (A3).
- No Ktor or Spring Boot integration.

## A3: Supabase facts (documentation read 2026-10-15)

Sources: https://supabase.com/docs/guides/auth/jwts, https://supabase.com/docs/guides/auth/signing-keys,
https://supabase.com/docs/guides/auth/jwt-fields.

- Signing: a legacy shared secret (HS256, "No longer recommended") or JWT signing keys. Asymmetric signing keys: ES256
  (NIST P-256) is "the recommended option", RS256 (RSA 2048) is also supported, EdDSA is "Coming soon". A shared-secret
  signing key is "Not recommended for production applications" (signing-keys page).
- **The pages do not state which type is the default for new projects.** So I cannot say "the documented default". What
  the docs say is "recommended": ES256. This matters for the prototype spec (B2). See the open question below.
- JWKS: `GET https://<project>.supabase.co/auth/v1/.well-known/jwks.json`. Edge cache 10 minutes; "Make sure that you do not
  cache this data for longer in your application" (jwts page). The endpoint "does not return any keys if you are not using
  asymmetric JWT signing keys." The signing-keys page adds that client libraries may cache keys for 10 more minutes and
  that backends should have a way to purge the cache after a rotation.
- Verification: with asymmetric keys, match the token `kid` and `alg` to the JWKS and verify the signature. With a shared
  secret the docs "recommend always verifying a user access token directly with the Auth server" (`GET /auth/v1/user`, 200
  means valid) and "strongly recommend against" checking locally with the secret. They name `getClaims()` for local checks of
  tokens issued by Supabase Auth. Note the existing supabase-kt `getClaims` follows this for HS256.
- Rotation: wait at least 20 minutes after creating a standby key or revoking a key; non-expired tokens signed with a
  previous key stay accepted until that key is revoked; with a 1 hour token expiry wait at least 1 hour 15 minutes before
  revoking the old key.
- Claims (jwt-fields page). Always present: `iss`, `aud` ("authenticated" for users, "anon" for anonymous), `exp`, `iat`,
  `sub` (user UUID), `role` ("anon", "authenticated", "service_role"), `aal` ("aal1", "aal2"), `session_id`, `is_anonymous`,
  `email`, `phone`. Optional: `app_metadata`, `user_metadata`, `amr`, `jti`, `nbf`. `ref` only in anon and service-role
  tokens. The page's own anon and service-role examples omit some "required" claims, unexplained.

## A4: htmx-supabase-spring-boot-starter (tschuehly), read 2026-10-15

Last push 2025-12-16, 52 stars, not archived. Verification is `security/SupabaseJwtVerifier.kt`, built in
`SupabaseAutoConfiguration.kt` line 80 as `JWT.require(Algorithm.HMAC256(jwtSecret)).build()` with `com.auth0:java-jwt`
4.5.0. In short:
- It verifies HS256 locally with the shared secret from the `supabase.jwtSecret` property. No JWKS, no asymmetric keys.
- java-jwt's default checks apply (signature, `exp`, `nbf`). No explicit `aud` or `iss` check was found.
- A `OncePerRequestFilter` reads the token from a cookie named `JWT` or from the `HX-Current-URL` header, then hands it to
  a Spring Security `AuthenticationProvider` that builds a `SupabaseUser` from the claims.
- It depends on `auth-kt` 3.1.4 for other user operations, not for verification.
- So it works for legacy shared-secret projects and not for projects that sign with asymmetric keys.

## A5: three recently merged external pull requests

All three are small bug fixes with tests, merged by the maintainer (jan-tennert). None is a feature or a new module.

| PR | Area | Opened | Merged | Time | Reviewer asked for |
|---|---|---|---|---|---|
| #1395 (alperen-kaplan) | Realtime, heartbeat race with `disconnect()`, +84/-1, 2 files | 2026-09-10 | 2026-09-23 | 13 days | Drop two inline comments and shorten the test KDoc to one line. Author then asked for a release; the maintainer started a publish job and said the changelog would wait. |
| #1405 (AndroidPoet) | Storage, resumable upload cache, +76/-13, 4 files | 2026-09-21 | 2026-09-26 | 5 days | One review, no inline requests found. |
| #1352 (Merkost) | Auth, refreshed token and error bodies, +52/-7, 4 files | 2026-07-12 | 2026-07-16 | 4 days | One review, no inline requests found. |

Pattern: each PR touched few files, included a test, and described one bug. A new module is a different scale, which is
why the proposal asks first. The maintainer's own large change (#1141) took 22 days from open to merge.

## A6: contribution requirements (CONTRIBUTING.md; no PR template exists)

- Fork, branch, PR to `master`. Kotlin coding conventions, 4 spaces, no `*` imports.
- No PR template, no required changelog entry (the maintainer updates `CHANGELOG.md`), and I found no API dump task
  (no binary-compatibility validator in the build files).
- CI: `./gradlew -DLibrariesOnly=true assemble` (`build.yml`, on pushes to `master`) and `detektAll` (`detekt.yml`). Tests:
  `./gradlew jvmTest` and per-module tasks; browser and Apple targets need extra tools.
- **AI policy (CONTRIBUTING.md, section "AI"):** "Please don't exclusively rely on AI to generate code. If using AI, double
  check your code. Generally I wouldn't recommend using AI for logic code." JWT verification is logic code. See below.
- The repo has no `AGENTS.md`, `CLAUDE.md` or Copilot instructions.
- Issue #415 has the label `help wanted` and no assignee. The maintainer wrote on 2024-01-09 that he would answer
  questions about integrating with supabase-kt.

## A7: proposed module split

| Part | Name (proposal) | Contains | Targets | Dependencies | Kind |
|---|---|---|---|---|---|
| 1 | in `auth-kt`, or a new small module (question) | Client-free verifier: token, key source and options in; typed claims out. Reuses `jwt/` package. Adds `aud`, `iss`, `nbf` checks, offline HS256 with a supplied secret. | common (all targets), or JVM only | cryptography-kotlin, kotlinx.serialization, a Ktor client for JWKS (or a pluggable key source) | **Core** |
| 2 | `ktor-server-auth` (name open) | Ktor `Authentication` provider: read bearer token, call part 1, expose claims as a `Principal` | JVM | part 1, `ktor-server-auth` | Glue |
| 3 | `spring-boot-starter` (name open) | Spring Security `OncePerRequestFilter` and `AuthenticationProvider`, auto-configuration, properties for project URL | JVM | part 1, Spring Boot, Spring Security | Glue |

Where parts 2 and 3 live (this repo, or `supabase-kt-plugins`) is a question for the maintainer.

## Open questions for Miguel and the maintainer

1. Prototype scope. The existing `getClaims` already does the signature and `exp` core. A prototype of "core verification" would
   duplicate it. The honest remaining core work is the client-free verifier with `aud`/`iss`/`nbf` and offline HS256. Does Miguel
   want to build that, or ask first and wait for the maintainer?
2. The prompt asked for the "current default for new projects". The docs do not name one. Which type should the prototype
   target first: ES256, since the docs call it recommended? (Not chosen for Miguel.)
3. AI policy. The maintainer discourages AI for logic code. Anything pushed upstream needs Miguel to have written or
   fully understood each line. Stage 2 would be Claude writing logic code; Miguel decides how much of it goes upstream.

## Not verified

- No code was executed in Stage 1. The Gradle build has not been run (no Gradle installed globally; the wrapper will
  download 9.5.1 in Stage 2).
- Behaviour claims about `getClaims` come from reading the source, not from running it.
- "No `aud` check" and "no API dump task" are absences found by search, not proof.
