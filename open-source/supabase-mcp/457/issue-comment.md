Adding evidence on the second half of this issue, the `checkDestructiveQuery` false positive on `'done; delete later'`. #459 covers the UPDATE half only.

I prototyped a quote-aware split for `checkDestructiveQuery` locally (not a PR) and compared it with main by calling `isDestructiveSql` directly. It fixes these, which main flags:

```sql
insert into t (k, v) values ('r3', 'done; delete later');
select f('ok; delete later');
```

But once single-quoted strings are treated as opaque, these pass silently, and main flags all of them:

```sql
DO 'begin perform 1; drop table films; end'
CREATE FUNCTION f() RETURNS void AS 'begin; delete from films; end' LANGUAGE plpgsql
```

I special-cased `EXECUTE '...; DROP TABLE films'` so it stays flagged, but that was not enough. `DO` and `CREATE FUNCTION ... AS` take a code string in the same way. So a fix needs a rule for when a string is code (after `DO`, `EXECUTE`, `AS`, possibly others) and when it is data, or a real parser, and the choice changes what gets confirmed. Which direction would the maintainers prefer?

Once this is accepted and #459 has merged, I can send a follow-up PR for this half that builds on #459's lexer instead of adding a second one.

Verification: direct calls to the exported functions with vitest on Node. Nothing was run against a database or the hosted server.
