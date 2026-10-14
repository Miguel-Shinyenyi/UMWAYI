# Open Source Process

Written 2026-10-14. Contributing is communication that runs for weeks. The code is the
smaller part. This file records what the evidence from real projects shows, and the loop
Miguel and Claude follow because of it. It applies to every repository in
`projects/open-source.md`.

## What the evidence shows

Read on 2026-10-14 from the repositories' own pages. Counts change.

### supabase/mcp

- 64 open pull requests. Page 3 of the open list shows "Review required" on every item, the
  oldest from early 2025 (#33). Merges since June are almost all by a small group of
  maintainers.
- One outside fix merged since June that I could identify: #317 (composite foreign keys in `list_tables`). The
  contributor opened the pull request, then asked the maintainer whether it was a real bug.
  The maintainer reproduced it, asked for a different output shape, the contributor agreed,
  pushed the change, added the extra edge-case tests the maintainer asked for, and noted that
  the remaining CI failures were unrelated. About ten comments, then merge.
- #459 (outside contributor, fixes half of issue #457): opened 2026-10-04. Changes requested
  on 2026-10-05, twice. Approved 2026-10-12. Not merged on 2026-10-14. The reviewer tested it
  against the real PostgreSQL parser (libpg-query) and found inputs the author's tests missed.
  A third person asked on 2026-10-11 for the review and release to be finished.
- Issue #457: no maintainer comment after 11 days. Issue #442: no reply after three weeks.
  Issue #241: the maintainer's reply apologises for a long delay. Issue #318:
  stays open on purpose, with a status note, until the fix reaches production.
- Many issues that look easy are not code in this repository (hosted OAuth, the plugin
  settings page, the Management API that runs server side).

### modelcontextprotocol/java-sdk

- Its CONTRIBUTING says: for non-trivial changes, agree on scope in an issue first. Pull
  requests opened without that discussion may be ignored or closed without a reason. Do not
  take an issue that is assigned. Add commits instead of force-pushing. A human stays
  accountable for anything an AI agent helped write. Accounts run by autonomous bots are
  forbidden.
- Labels carry meaning: `good first issue`, `help wanted`, `ready for work` (the goal is clear),
  `needs repro`, `needs confirmation`, and priority P0 to P3.
- The `good first issue` items are crowded. #1067 has five pull requests and more people
  asking to add a sixth. #303 has four, one of them waiting since March, two closed by their
  authors in deference to it. #293 has two. #257 (`help wanted`) has one.
- `needs repro` and `needs confirmation` issues have no pull requests. A tested reproduction
  is a real contribution there.

### Small repositories

- mclenhard/mcp-evals: last commit June 2025, issues unanswered since 2025. Dormant. Not a
  target.

## The loop

Every issue moves through these states. Record the state and the date in the board in
`projects/open-source.md`.

1. Scout. Read the issue and every comment in a browser. A summary tool can miss comments and
   linked pull requests.
2. Check. Search the open pull requests for the issue number and for the file names. Read the
   labels, the assignee and whether the reporter offered a fix. Read the project's
   CONTRIBUTING. Read two recently merged pull requests for style.
3. Ask. If the project requires an accepted issue, or the change is not trivial, comment on
   the issue first. State the problem, what you found, what you would change, and ask which
   direction the maintainers prefer. Do not open a pull request yet.
4. Wait. Work another issue. Follow up once after about seven days, and only with new
   information. Do not ping repeatedly.
5. Build. Reproduce first. Write the failing test. Fix. Run the project's own tests, type
   check and lint.
6. Prove. Verify on a clean clone. Where a real parser or reference implementation exists,
   use it as the oracle. Say what was not verified.
7. Open the pull request. Follow the template and fill every section, including how to
   review and the verification evidence. Keep it small.
8. Review rounds. Reply within a day when possible. Accept the maintainers' design. Add
   commits instead of rewriting history unless asked. Say plainly when a CI failure is
   unrelated, with evidence.
9. Close. After a merge, record it and decide on an article. After a close without merge,
   record why and what was learned.

## Kinds of contribution

A fix is one kind. Others count and often meet less competition:

- A reproduction of a bug marked `needs repro` or `needs confirmation`.
- Independent verification of someone else's pull request, with evidence the author did not
  have (for example, a real parser as the oracle).
- A documentation fix.
- A test that closes a gap.

## Checks before building

These come from mistakes already made in this project.

- Read the live thread in a browser. On 2026-10-14 a page summary said issue #457 had no
  linked pull requests. A pull request (#459) already fixed half of it.
- Search for pull requests by issue number. Five of the first shortlist were already taken,
  assigned to a maintainer, or not code in the repository.
- Build the test inputs from the grammar the code defends against. The first fix for #457 was
  tested on 200,000 generated statements, none of which were code strings after `DO` or
  `CREATE FUNCTION ... AS`. Those pass silently with that fix. A reviewer found them.
- A pull request opened before the issue is accepted can duplicate or conflict with existing
  work. Hold it until the thread is read and a maintainer has answered.

## Limits

- At most six issues in flight (raised from three by Miguel on 2026-10-14). Most of them wait
  for a maintainer at any time. Build work happens on one or two at once.
- Miguel reads and understands every line before anything goes upstream.

## What to record per issue

Dates of: first comment, first maintainer reply, review requested, review received, merge or
close. After a few issues these dates show how long this process takes in practice.