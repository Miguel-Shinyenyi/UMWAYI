Entries before 2026-10-01 are in `archive/SYNC_LOG/2026-09.md` (A-011 in `archive/INDEX.md`).

## 2026-10-01 (CV confirmed live, Hashnode dropped from the site)

- Source: Miguel confirming the CV push and deciding Hashnode isn't worth paying for.
- Updated: `backlog.md` (Hashnode-pipeline item closed), `site/links.md` (Hashnode entry
  removed), `journal/entries/2026-10-01.md` (new). `index.astro` in `miguel-site` needs
  its Hashnode-label lookup switched to `dev.to` to match.
- What moved: re-cloned both repos fresh and verified the CV addition end to end rather
  than trusting the push message, the file exists at `site/files/Miguel_Shinyenyi_CV.pdf`,
  the sync script copies it, a local build produces a valid 2-page PDF at
  `dist/files/Miguel_Shinyenyi_CV.pdf`, and a running `astro preview` serves it at a real
  200, with "Résumé (PDF)" showing first in the footer. Separately, Miguel decided Hashnode
  isn't worth its Pro plan just to stay in the cross-post pipeline (dev.to and LinkedIn
  already work for free, Medium was already out), so the homepage's "All articles on
  Hashnode" link moves to dev.to and Hashnode drops out of the footer's profile list. The
  Hashnode account itself is untouched.
- Confidence: the CV confirmation is a real build and a real HTTP 200, not a push message
  taken on faith. The Hashnode change is content-only on the UMWAYI side (done here); the
  matching `index.astro` edit in `miguel-site` is written up but not yet applied anywhere.

## 2026-10-02 (journal, weekly summary) and 2026-10-09 (reconciliation restudy, UI prompt, two articles)

- Source: the 2026-10-02 journal entry and the 2026-09-21 to 2026-09-27 weekly summary, both
  pushed without a log entry. Then Miguel's reconciliation explain-back (2026-10-02 evening),
  his answer on the correction path, and the 2026-10-09 requests: a full UI rewrite prompt, a
  journal entry, and two articles.
- Updated: `journal/entries/2026-10-09.md` (new), `backlog.md` (eleven new open items, one closed
  restudy item), `projects/settlement-engine.md` (new reconciliation restudy section, and the
  ledger-consistency line corrected from "not yet built or verified" to built and verified),
  `site/philosophy/more-copies-is-not-a-better-life.md` and
  `site/tech/what-the-reconciler-cant-see.md` (new), `site/tools/illustrations.py` and two new
  illustrations in `site/illustrations/`.
- What moved: reconciliation was explained cold, then checked against the code on `dev`. The
  check corrected the explanation in three places (UNKNOWN with a reference is auto-resolved,
  nobody is alerted, resolving does not change data) and found a fourth problem not asked
  about (settlements stuck UNKNOWN with no reference are invisible to reconciliation). A UI
  rewrite prompt was written for Claude Code, grounded in the real frontend, load test,
  observability and seed files, with six known gaps the UI must show and not fix. The Lab
  design came from three choices Miguel made: real engine in a sandbox, Lab public, staging
  data behind login. Both articles built against the real site code and looked at at phone and
  desktop width.
- Confidence: the reconciliation findings are from reading the code, not from running it. One
  is stated as read-only: that a resolved settlement mismatch reopens on the next run. The UI
  prompt has not been run. The philosophy article's two skeletal-health sources were not
  opened (one page errored, one rate-limited), so only their existence is confirmed. An earlier
  reply on 2026-10-02 said UNKNOWN gets auto-resolved without the condition that it needs an
  external reference, corrected on 2026-10-09.

## 2026-10-11 (push checked, one site build failure traced to a file I handed over)

- Source: Miguel asking to check the 2026-10-09 push, then confirming a fix and a hold.
- Updated: `journal/entries/2026-10-11.md` (new), `projects/settlement-engine.md` (hub copy, pushed as `410b28d`), `SYNC_LOG.md`.
- What moved: the hub was cloned fresh and every file from the 2026-10-09 delivery was compared with what landed. All matched apart from date formats, line wraps and trailing newlines. The site's project page for the settlement engine had been replaced by me without its front matter. The site build rejected it against the project collection schema, which explains why neither new article went live until the front matter was restored (`bd822f7`). Reproduced both ways with a real build. The hub's own project file was separately stale and is now updated. Journal excerpt publication was put on hold by Miguel.
- Confidence: the build failure and the fix are reproduced, not inferred. The live site state is Miguel's word, not checked from here.

## 2026-10-13 (MCP server merged, practices recorded, journal caught up)

- Source: Miguel's report of the day, plus a check of the Invoice-Financing `dev` branch.
- Updated: `journal/entries/2026-10-13.md` (new), `docs/agent-practices.md` (new), `MASTER_CONTEXT.md` (new rules, stale status lines corrected), `backlog.md`, `projects/settlement-engine.md`, `SYNC_LOG.md`. New `CLAUDE.md` files handed over, not yet in any repo: this hub, Invoice-Financing, Routine Machine, miguel-site, and a user-level one for Miguel's machine, so the practices apply to every project.
- What moved: the Lab UI and an MCP server over it are merged to `dev` (`badc0d4` on 2026-10-09, `e4ffadf` on 2026-10-13). The backlog items for running the Lab prompt and for the mismatch reopen loop are closed, the second on the strength of an observation recorded in the repo's own `docs/mcp.md`. A set of working practices (trigger, structure, steering, pruning, verification first) was mapped against what already exists and added where missing. One new rule was added to `MASTER_CONTEXT.md` from a caught mistake. Stale lines in `MASTER_CONTEXT.md` about cross-posting and the settlement engine were corrected.
- Confidence: the MCP and Lab numbers (13 tools, 110 unit tests, 34 integration tests, 7 of 7 evals, the load run) are read from the repo's docs and results file, not rerun here. The practices are Miguel's notes from videos, recorded as his understanding. Whether they improve outcomes is not measured. A way to measure it is in `backlog.md`.

## 2026-10-14 (open source workstream started, first fix built)

- Source: Miguel asking for open source work on MCP servers tied to his path, to be listed, worked one by one, documented and written up. Earlier the same day: Supabase job postings read in a browser, and the Routine Machine decryption prompt written.
- Updated: `projects/open-source.md` (new), `MASTER_CONTEXT.md`, `backlog.md`, `journal/entries/2026-10-14.md` (new), `SYNC_LOG.md`. Added under `open-source/supabase-mcp/457/`: the patch for supabase/mcp #457, the text for the issue comment, and the pull request description.
- What moved: five repositories were checked as targets. supabase/mcp is first. Issue #457 was read in full and reproduced against a clone: 7 new tests failed before the fix. A quote-aware statement split fixes it and keeps the old warnings for dynamic SQL. Tested on a clean clone, and compared with the old code over 200,000 generated statements. Miguel chose: Claude builds and verifies, one article per merged pull request, tracker in `projects/open-source.md`, first issue #457.
- Confidence: unit tests, lint and type check ran here. One existing test (`index.test.ts`) fails with and without the patch because it needs network access. The fix was not run against a live Supabase project. The maintainers have not accepted the issue. CONTRIBUTING requires that before a pull request.

## 2026-10-14 (open source: process learned, board set up, one flaw owned)

- Source: Miguel's two corrections to the open source plan: contributing is communication and waiting, so check how past issues were handled; and several issues can run while waiting. Also his Claude Code's findings on supabase/mcp #457 earlier the same day.
- Updated: `docs/open-source-process.md` (new), `projects/open-source.md` (process section, targets, pipeline board, decisions, open questions), `MASTER_CONTEXT.md` (principle updated, new rule from a caught mistake, open thread), `backlog.md` (open source items), `journal/entries/2026-10-14.md`, `SYNC_LOG.md`.
- What moved: pull requests and issues in supabase/mcp and modelcontextprotocol/java-sdk were read in a browser. Findings are in `docs/open-source-process.md`: outside pull requests often wait with no review, one outside fix merged after a design change was requested, #459 took eight days to approval and was not merged, and the java-sdk `good first issue` items each have two to five pull requests. mcp-evals is dormant. The first shortlist of follow-up issues was wrong: all five were taken or not code in that repository. My fix for #457 missed `DO` and `CREATE FUNCTION` code strings, which Miguel's Claude Code found; pull request #470 was closed. A three-slot board was started: #457 waiting, java-sdk #859 and #882 as reproductions.
- Confidence: the page contents are from reading the pages on 2026-10-14. Dates of merges and reviews come from those pages and the git history, not from the GitHub API, which this environment could not reach. Nothing in the board has been run yet except #457. Two repositories are a small sample for how long waits are.

## 2026-10-14 (java-sdk #859 and #882 reproduced, comments posted)

- Source: Miguel's request to reproduce two open java-sdk issues and write up evidence, then to post the comments.
- Updated: `open-source/java-sdk/859/` and `open-source/java-sdk/882/` (new: `results.md`, `issue-comment.md`, `reproduction/`), `projects/open-source.md` (board slots 2 and 3, issue log), `backlog.md`, `SYNC_LOG.md`.
- What moved: #859 confirmed that a servlet `tools/call` blocks a Tomcat worker and that requests queue, on SDK 2.0.0 and 2.0.1, NIO and NIO2. The reported NIO2 hang did not reproduce. #882 reproduced the exact timeout message on 1.1.0, 1.1.4 and 2.0.1 against a stub server and named the server replies that cause it. Both comments were posted by Miguel's account on 2026-10-14. No pull request was opened.
- Confidence: results come from 60 runs (859) and 252 results (882), all saved under `reproduction/out/`, on one machine over loopback. The reporters' own servers were not available, so the cause of the 859 hang and the server behind 882 are unknown. The comments ask for those details.

## 2026-10-14 (supabase-kt #415 researched, comment posted)

- Source: Miguel's request to work supabase-community/supabase-kt issue #415 (Supabase Auth in a custom backend), then to post the comment and record it.
- Updated: `open-source/supabase-kt/415/` (new: `notes.md`, `issue-comment.md`), `projects/open-source.md` (board slot 4, targets, issue log, decisions, open questions), `backlog.md`, `SYNC_LOG.md`.
- What moved: the research found that `Auth#getClaims()` (PR #1141, merged 2026-02-06) already provides signature and expiry verification, so the comment proposes a narrower plan and asks five design questions. The comment was posted by Miguel's account on 2026-10-14. No code was written and no pull request was opened. The contribution rules include an AI policy that discourages AI for logic code.
- Confidence: the findings come from reading the repository, the issue and pull request threads, the Supabase documentation (three pages cited in `notes.md`) and the Spring starter source. Nothing was built or run. The documentation does not name a default signing type for new projects.

## 2026-10-14 (posthog-android #577 researched, comment posted)

- Source: Miguel's request to work PostHog/posthog-android issue #577 (remote config payload in the Java server SDK), then to post the comment and record it.
- Updated: `open-source/posthog-android/577/` (new: `notes.md`, `issue-comment.md`), `projects/open-source.md` (board slot 5, targets, issue log, decisions, open questions), `backlog.md`, `SYNC_LOG.md`.
- What moved: the research found that `getRemoteConfigPayload` exists in Node.js and Python but not in `posthog-server`, that no published spec defines it, and that CONTRIBUTING and AGENTS.md require an agreed API shape in the issue before any code. The comment proposes the signature and asks four questions. It was posted by Miguel's account on 2026-10-14. No code was written and no pull request was opened. The repo has an AI policy that asks for disclosure in the PR and for the contributor to own and test the change.
- Confidence: the findings come from reading both SDKs' source, the sdk-specs repo, the posthog-server code, three merged pull requests and the contribution files. Nothing was built or run, and the real endpoint was not called, so the response shape is taken from Node's source comment.

## 2026-10-14 (spring-ai #4542 fixes verified, comment posted, clones removed)

- Source: Miguel's request to verify the open fixes for spring-ai #4542 instead of adding a fourth, then to post the comment on PR #6932, clean up the clones and record it.
- Updated: `open-source/spring-ai/4542/` (new: `notes.md`, `results.md`, `review-comment.md`, `reproduction/`, `reproduction-1.1.8/`, `evidence/`), `projects/open-source.md` (board slot 6, targets, issue log, decisions, open questions), `backlog.md`, `SYNC_LOG.md`.
- What moved: the bug reproduces on Spring AI 2.0.1 and 1.1.8. PR #6932 passes style checks and all 1376 module tests; PR #6830 fails style and leaves 5 tests failing. Both PRs behave identically at runtime, fix the empty Flux, and break structured output and partial results on errors. The comment on #6932 was posted by Miguel's account on 2026-10-14. No pull request was opened. JDK 17 was installed with Homebrew; 460 MB of clones and worktrees were deleted.
- Confidence: each result comes from a saved run, repeated twice, on one machine over loopback, with the PR diffs applied to the 2.0.1 tag. Single `Flux<CallToolResult>` element flags, the sync server and the fix on older branches were not tested.

## 2026-10-14 (evening: no cap on open source, luxury trap article, restudy questions)

- Source: Miguel's evening message: open source is a numbers game with no cap, his Sapiens reading (numbers over comfort, surplus food and politics, wars, art and philosophy), a video on the AI hype and fundamentals, the next book (Roitblat), and two laws (requisite variety, resonance), then the article logged on 2026-10-13 and the next restudy step. Before that, the live check of all six posted comments.
- Updated: `projects/open-source.md`, `docs/open-source-process.md`, `MASTER_CONTEXT.md`, `backlog.md`, `SYNC_LOG.md`, `journal/entries/2026-10-14.md`. New: `site/philosophy/a-convenience-is-hard-to-give-back.md`, `site/illustrations/a-convenience-is-hard-to-give-back.svg`. Changed: `site/tools/illustrations.py` (one new scene).
- What moved: the cap on issues in flight is gone. The live check found that the java-sdk #859 comment asked for details the reporter had already given (same Tomcat, HTTPS, NIO2), so a second reproduction is queued. The board no longer says a maintainer chose spring-ai PR #6932. The luxury trap article is written, with a Java example I ran (retry without a key charged twice, with a key once), and the site build passed.
- Confidence: all six comments were read live in a browser and match the drafts. The article's Sapiens points are Miguel's understanding, marked as unchecked in the text. The code example is a toy run on one machine. The video, the book and the two laws were discussed from Miguel's notes and my own recollection, not checked against the sources.

## 2026-10-15 (reflection piece, cold recall test, MCP study, PostHog, Substack, supabase-kt reply)

- Source: Miguel's early morning reflection on thoughts he cannot switch off and on dimming his own light; his evening message with the cold answers to the four restudy questions, a shift of the restudy toward MCP and agents, PostHog analytics and Substack publishing for the site, and his Sapiens notes on the imagined order; then the maintainer's reply on supabase-kt #415 and a check of what was pushed.
- Updated: `projects/open-source.md`, `backlog.md`, `MASTER_CONTEXT.md`, `SYNC_LOG.md`, `journal/entries/2026-10-15.md` (new). Already pushed on 2026-10-15: `site/philosophy/you-cannot-stop-what-arrives.md`, `site/illustrations/you-cannot-stop-what-arrives.svg`, one new scene in `site/tools/illustrations.py` (6428752); the Substack script, converter, tests, `docs/substack-setup.md` and `scripts/substack-posted.json` (9ed95a9, d3a8c67, 9a9671c). In `miguel-site`: PostHog analytics (pull request #2, a1f7bed).
- What moved: the article was written with code from `SettlementService`, credited to the Marvel series VisionQuest, and published. The cold test on the concurrency fixes found no recall; the one answered question had the right idea (something resolves the uncertainty) and the wrong mechanism (a crash leaves the settlement PENDING, and the stale-pending sweep finalizes it as UNKNOWN, not reconciliation). All 10 philosophy and tech articles are on Substack, posted with no email. PostHog is live on the site without a consent banner, a choice Miguel made after reading the design stage; the banner and a privacy page are still to build. The supabase-kt maintainer answered all five design questions; the answers leave the core's targets, the module name and path, and the start time open, and a follow-up is drafted.
- Confidence: the engine facts come from `SettlementService`, `docs/backend.md`, `docs/reconciliation.md` and `PROJECT.md` on `dev` at 38a92c9. The Substack and PostHog results come from `docs/substack-setup.md` and the text of `miguel-site` pull request #2, read on GitHub; I did not run either. A confirmation of events in PostHog Live events from a real browser is still pending. The maintainer's reply was read on the issue page. The Sapiens points are Miguel's reading, and the discussion of them is Claude's, unchecked against the book.

## 2026-10-16 (repo check, java-sdk #882 outcome, rule files, draft article)

- Source: Miguel's afternoon message with photos of a handwritten list of 59 backend concepts, his notes on slowing down during hype, the eight failure modes and the feeling of having so much to do that you do nothing, and the java-sdk #882 close. Then his correction: the aim of a comment is to solve the reporter's problem, and no follow-up drafts are written ahead of a thread.
- Updated: `docs/open-source-process.md`, `docs/agent-practices.md`, `projects/open-source.md`, `backlog.md`, `MASTER_CONTEXT.md`, `SYNC_LOG.md`, `CLAUDE.md`. New: `docs/understanding-first.md`, `docs/engineering-concerns.md`, `site/philosophy/stay-close-behind-the-code.md` (draft: true), `site/illustrations/stay-close-behind-the-code.svg`, `journal/entries/2026-10-16.md`. Changed: `site/tools/illustrations.py` (one new scene).
- What moved: all four repos checked by browser: UMWAYI main 2c66bc0, miguel-site main a1f7bed, Invoice-Financing dev 38a92c9, routine-machine main 7033d01. supabase-kt #415 has no reply to Miguel's 2026-10-15 follow-up. java-sdk #882 closed by the reporter. Dated follow-ups for all six issues are cancelled. The draft article uses real code (`LedgerConsistencyService.verify`, the `mvnw` script from commit efa8177 and its fix fefbc31). A prompt for the routine machine was handed over separately.
- Confidence: repo heads were read on GitHub pages, not by git. The site build passed with the draft in place. The article's claims about hype are Miguel's notes, not checked against a source. The #882 comparison is from the issue page and my own results table; the `text/plain` difference is unexplained and untested. I did not run the ledger check code for the article.
## 2026-10-19 (concepts 60 to 111, the cycle, routine-machine check, RSS page)

- Source: Miguel's morning message: photos of concepts 60 to 111, the cycle (understand things as they are, then let AI code what is needed, weigh consequences), a request to recheck routine-machine before updating its prompt, observability, API docs, product analytics, the repository standard, the investor blueprint PDF and his investor pack, and the RSS link on the site.
- Updated: `docs/engineering-concerns.md`, `docs/understanding-first.md`, `docs/agent-practices.md`, `site/philosophy/stay-close-behind-the-code.md`, `projects/routine-machine.md`, `MASTER_CONTEXT.md`, `backlog.md`, `SYNC_LOG.md`. New: `journal/entries/2026-10-19.md`.
- What moved: the concerns list now has 111 entries. The understanding-first rules and the draft article carry the cycle. Routine-machine was read on Miguel's machine: Phases 10 to 12 exist on branches, Phase 9 is on `main`. One security gap found and verified: most user-scoped routes take the user id from the request, not the session. The routine-machine prompt was rewritten to start from that state. A plain `/rss/` page was built for `miguel-site` and checked in Chromium.
- Confidence: repo state read with git on Miguel's machine and in a fresh clone. The security gap is read from `SecurityConfig`, `GranaryController` and `OrganisationController`; I did not call the endpoints. The RSS fix was built and checked in Chromium against a local server, not on GitHub Pages. The Chrome XSLT dates come from Chrome's own developer page.
## 2026-10-26 (confirm pushes, journal gaps, Sapiens notes, two articles)

- Source: Miguel's messages of 2026-10-26 12:13 and 13:44: confirm pushes and update the hub; journal the work using commit dates; publish the draft article; CLAUDE.md sections now pushed; keep PostHog and Ezra in the public hub files; leave `site/projects/routine-machine.md` as deployed; journal his Sapiens notes of 10-17 and 10-20/21; write an article on the hub as his first agentic system.
- Updated: `projects/routine-machine.md`, `site/philosophy/stay-close-behind-the-code.md` (`draft: false`, date 2026-10-26), `MASTER_CONTEXT.md`, `backlog.md`, `SYNC_LOG.md`, `site/tools/illustrations.py` (one new scene), `site/tech/my-first-agentic-system-is-a-folder.md`, `site/illustrations/my-first-agentic-system-is-a-folder.svg`, journal entries for 2026-10-17, 10-18, 10-20, 10-21, 10-25 and 10-26 (10-17, 10-20 and 10-21 carry the Sapiens notes).
- What moved: heads checked by clone: UMWAYI main 1282a25, miguel-site main 394230b, routine-machine main da5640f, Invoice-Financing dev 38a92c9. Phases 9 to 12 and the hardening work are on routine-machine `main`. The 2026-10-19 hub file for Routine Machine had landed in `site/projects/`; the hub file is corrected, the site page is left as deployed by decision. Days 10-22, 10-23 and 10-24 have no commits and no notes, so no entries.
- Confidence: repo state read from fresh clones. Journal entries for 10-17, 10-18, 10-21, 10-25 and 10-26 are rebuilt from commits plus Miguel's own notes; feelings are not known except where he stated them. The article's facts come from the repository files (dates, counts, the 15-minute poll from `docs/hub-sync.md`); I did not run hub-sync. The DNA figure is general knowledge, not checked against the book. The site build passed with both articles (31 pages). The Substack posts are not made.
## 2026-10-26 (afternoon: Routine Machine brief, strategy update, queue, pruning list, first hire)

- Source: Miguel's messages of 15:20 to 15:25: the consolidated brief, the operating plan, the IPO and private AI guide, the strategy update of 2026-10-20 (attached after a missing-file notice), a photo of an agents folder, and the instruction to include the creative director in the plan and financials.
- Updated: `MASTER_CONTEXT.md` (queue and approval rules, spokes), `backlog.md` (70 open lines marked `[>]` with queue ids, header note), `projects/routine-machine.md` (direction under review), `journal/entries/2026-10-26.md`, `SYNC_LOG.md`. New: `queue.md`, `docs/pruning-candidates.md`.
- Handed over outside the repo: a Claude Code prompt (stage 1 reads and reports), a plan insert on the first hire, and a financials workbook. The last two hold private figures and stay local.
- What moved: the open backlog is now a queue with decisions D-1 to D-8, 23 brief tasks and 8 pivot tasks. A pruning list of 15 candidates waits for approval. Seven backlog lines are proposed to close, each with evidence; none is closed.
- Confidence: the PDFs were read in full. The code facts (no `.claude` folders, UserRole values, Tailwind 4.3.3, 31,067-word PROJECT.md, identical doc copies) were read from clones of 2026-10-26, not run. The Tailwind cursor cause is unverified. The workbook recalculates with no errors and was tested with sample inputs; the sample inputs are not saved in it.
## 2026-10-26 (evening: confirm pushes, investor pack updated on the device)

- Source: Miguel's message of 16:54 and 16:57: confirm the pushes; update the investor pack in `routine-machine/investor-pack` directly; the same for the design reference later.
- Updated: `queue.md`, `SYNC_LOG.md`, `journal/entries/2026-10-26.md`. Updated on Miguel's machine, not in any repository (the folder is git-ignored): `00`, `01`, `02`, `03`, `05`, `06`, `09`, `11` and `12` in `investor-pack/`. New there: `13-strategy-update-2026-10-20.md`, `14-team-update-first-hire.docx`, `06-first-hire-financials.xlsx`.
- What moved: UMWAYI `main` at 7f78b0f holds the queue update, identical to what was handed over. routine-machine `main` is still da5640f. PR #10 (Prompt 8 stage 1 reports) merged into `access-control-per-user-scope`, so `docs/fixes/` is not on `main`. The pack now says all twelve phases are on `main`, every personal route reads the user from the signed token, and the stage 1 tenancy findings are open. Files that depend on the direction decision carry a banner and are not rewritten.
- Confidence: pack facts come from the repository files and the stage 1 reports as merged on the branch. The reports' test run (70 tests) is theirs; I did not run it. The direction rewrite is not done because D-1 and D-2 are open. PDFs and slides are not regenerated. `04`, `07`, `08` and `10` were read for headings only and not changed.

## 2026-10-26 (pruning executed, nothing deleted)

- Source: Miguel's approval ("lets go with your recommendation") of the pruning list.
- Updated: `MASTER_CONTEXT.md`, `CLAUDE.md`, `projects/routine-machine.md`, `docs/agent-practices.md`, `backlog.md`, `SYNC_LOG.md`, `queue.md`, `docs/pruning-candidates.md`; new `archive/` with `README.md`, `INDEX.md`, `verify.py` and the moved text. In routine-machine: `PROJECT.md`, `docs/status-log.md` (new) and the files that pointed at the status log.
- What moved: 11 archive entries, A-001 to A-011, about 38,000 words, each with a checksum that `archive/verify.py` rechecks. MASTER_CONTEXT.md went from 3,464 to about 2,450 words.
- Not moved: P-10, P-11, P-12. P-04 moved fewer rules than listed because the README lacks parts of the others.
