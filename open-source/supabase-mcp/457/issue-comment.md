Thanks for the detailed report. I reproduced both false positives against main: isUpdateWithoutWhere and checkDestructiveQuery split on every ";" before quotes are considered.

CONTRIBUTING asks for an accepted issue before a PR, so I have not opened one. Could a maintainer confirm this is accepted and that you are happy for me to send a fix?

What I would change, in destructive-sql.ts only:
- One shared split that ignores ";" inside single-quoted strings (including '' and E'...' backslash escapes) and double-quoted identifiers.
- Dollar-quoted bodies keep splitting as today, so a DELETE inside a function body is still seen.
- A statement that contains EXECUTE is also checked as plain fragments, so EXECUTE 'SELECT 1; DROP TABLE films' still warns.
- An unterminated quote falls back to the current plain split, so the check fails closed.

New tests go in destructive-sql.test.ts. They cover the reporter's cases, doubled quotes, E-strings, real statements after a quoted semicolon, unterminated quotes and the EXECUTE case.