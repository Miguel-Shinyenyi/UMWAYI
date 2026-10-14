Title: fix(mcp): ignore semicolons inside quoted text in the destructive SQL check

Fixes #457

Problem
isUpdateWithoutWhere and checkDestructiveQuery split SQL on every ";" before looking at quotes. An UPDATE with a text value like 'done; ok' was flagged as an UPDATE without WHERE. A value like 'done; delete later' was flagged as destructive. Clients that cannot answer the confirmation prompt wait until the tool times out.

Change
- Add splitOutsideQuotes in destructive-sql.ts. It splits on ";" only outside single-quoted strings and double-quoted identifiers. It handles doubled quotes and backslash escapes in E'...' strings.
- Dollar-quoted bodies are still split, so a destructive statement inside a function body is still seen.
- candidateStatements uses that split. A statement containing EXECUTE is also checked as plain fragments, so dynamic SQL with a semicolon in its string still warns.
- An unterminated quote falls back to the old plain split, so the check fails closed.
- Both checkDestructiveQuery and isUpdateWithoutWhere use candidateStatements.

Tests
19 new cases in destructive-sql.test.ts. 7 fail on main and pass with this change. They cover the reporter's inputs, doubled quotes, E-strings, a quoted semicolon followed by a real DROP, DELETE or UPDATE without WHERE, unterminated quotes, and EXECUTE strings containing a semicolon.

Verification
Run on a clean clone of main with this patch applied:
- pnpm build, then pnpm --filter @supabase/mcp-server-supabase test:unit --run: 435 of 436 pass. The one failure is src/index.test.ts ("index.ts exports a working server", fetch failed). It fails the same way on main in my environment, which has no network access, so I could not confirm it passes elsewhere.
- pnpm typecheck: clean.
- biome check on src/tools: clean.

I also compared the old and new functions over 200,000 randomly generated statements (mixes of UPDATE, DELETE, DROP, TRUNCATE, EXECUTE, quotes, E-strings, dollar quotes and comments):
- 211 inputs were flagged before and are not now. For each one, blanking the quoted text and running the old function returns false, so the only destructive words were inside quotes.
- 422 inputs are newly flagged. All involve EXECUTE with quoted text, so they warn more, not less.

Not verified
I did not run this against a live Supabase project or a client with elicitation.

Notes
AI-assisted: Claude helped write and test this change. I reviewed every line and ran the checks above.