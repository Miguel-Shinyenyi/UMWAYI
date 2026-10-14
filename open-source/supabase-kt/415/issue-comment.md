Hi @jan-tennert. I run Spring Boot services behind Supabase Auth and would like to work on this.

I read the current code first. `Auth#getClaims()` (#1141) already verifies RS256 and ES256 tokens against the project JWKS, and HS256 tokens through the Auth server. So the core exists. What a custom backend still lacks:

- Verification needs a `SupabaseClient` with the Auth plugin installed, which brings session handling and extra dependencies.
- `getClaims()` checks the signature and `exp`, not `aud`, `iss` or `nbf`.
- HS256 projects make one network call per token.
- There is no Ktor or Spring Boot glue.

Proposal, in order:

1. A small client-free verifier (token and key source in, typed claims out), reusing the `jwt` package.
2. A Ktor server `Authentication` provider on top of it.
3. A Spring Boot starter (Spring Security filter and `AuthenticationProvider`) on top of it.

Questions:

1. Should the verifier live in `auth-kt`, or in a new small module that backends can depend on?
2. Which targets must it support? I would keep the Ktor and Spring parts JVM only.
3. Should JWKS fetching stay in the core, or take a pluggable key source?
4. `plugins` now points to `supabase-kt-plugins`. Should the Ktor and Spring modules go there?
5. Should each step be its own pull request?

If you agree, I will start with step 1 and the Spring Boot module.
