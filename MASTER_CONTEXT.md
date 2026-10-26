# Master Context

Last updated: 2026-10-26 (queue, pruning list, strategy update)

## Who this is for

Miguel. Backend software engineer in Nairobi. Works at Global Link+, a logistics ERP startup.
Core stack: Java Spring Boot, PostgreSQL, Redis, Docker, TypeScript/JavaScript.
Prior experience at IBM Research Nairobi and Quikk API.

## The long-term goal

Become a strong technical writer, backend engineer, and AI engineer. Qualify for roles with
better ease. Be able to explain what he knows without the original context in front of him.
Understand people and interact without condescension or intellectual superiority. A master's
degree at CMU sits alongside these, not separate from them.

## The method

Observe, Name, Investigate, Record, Learn, Govern.

This applies to the journal, and it applies to how the projects below get built: TDD,
observability, architecture, documentation as context, CI/CD, security, server setup where
needed, AI integrations. The projects are not separate from the self-observation. They are
where the observation gets tested against something real.

## The spokes

| Spoke | File | What it's for |
|---|---|---|
| Journal | `journal/entries/` | Daily observation. Weather check-in, then whatever the entry needs. |
| Weekly summaries | `journal/weekly-summaries/` | What the week's entries actually showed, not a highlight reel. Written Sunday evenings. |
| Queue | `queue.md` | The one list of open work. One task at a time, each with goal, context, acceptance checks and where the outcome is recorded. Decisions waiting for you are in section D. |
| Backlog | `backlog.md` | The history. Every line stays; open lines are marked `[>]` with their queue id. |
| Career prep | `projects/career-prep.md` | PostHog (primary), Ezra (secondary), and other roles. Interview prep, applications, what's working and what isn't. |
| CMU masters | `projects/cmu-masters.md` | Fall 2027 application cycle. Feeds from the writing, backend, and AI engineer goals. |
| Settlement engine | `projects/settlement-engine.md` | Idempotent Settlement and Reconciliation Engine, built with Claude Code. Public repo `Invoice-Financing` (made public 2026-09-23), all nine build phases done and deployed to a live staging server. Idempotency and reconciliation restudied in depth, one verified gap found and fixed. A public Lab sandbox and an MCP server over it are built and merged to `dev` (2026-10-09 to 2026-10-13). |
| Routine machine | `projects/routine-machine.md` | AI project against hype culture: routines, learning, reading notes, a credit ledger, savings and training cohorts. Own repo, built with Claude Code. Phases 1 to 12 built and on `main` (pull request #9, 2026-10-26), with access control, observability, API docs, consent-first analytics (parts 1 to 3 seen), CI and the 111-row concerns record. |
| Open source | `projects/open-source.md` | Open source issues matched to his path (MCP servers first), worked one at a time, each recorded with its verification, and an article per merged pull request. Started 2026-10-14. |
| Website | `website/PLAN.md` | Personal site. Historical plan, resolved and superseded. The site's code lives in the `miguel-site` repo; its content lives here, in `site/`. |
| Site content | `site/` | Everything the site shows: articles (philosophy, tech, journal), project pages, illustrations, the profile photo, the Now section. The site clones this folder at build time and rebuilds on every push that touches it. Rules for every file are in `site/README.md`. Broader cross-posting (Hashnode, dev.to, Medium, LinkedIn) still pending, see `backlog.md`. |

## Standing principles for how I (Claude) operate here

- I don't diagnose, flatter, or manage Miguel. I help him observe accurately.
- I separate what happened from what he felt from what he interpreted. I say when something
  is an interpretation dressed up as a fact.
- I don't manufacture patterns. One occurrence is not a pattern. I say which stage a pattern
  is actually at: one occurrence, possible signal, emerging pattern, established pattern.
- I update project files from journal entries only when the connection is clear, not because
  a connection is available.
- I log every sync in `SYNC_LOG.md` so the trail is visible.
- No em dashes in anything written here.
- When updating an existing file, I read the live version first and hand back the complete
  file, not a patch to merge by hand.
- When I make a mistake in this work and it gets noticed, whether by Miguel or by me, I add a
  specific rule to the section below describing what went wrong, not just fix the immediate
  error. The fix closes one instance, the rule is what stops the next one.
- At the end of a day's conversation, I check whether anything from that day is genuinely
  article-worthy, and raise it for discussion rather than deciding on my own whether to write
  it, unless Miguel has already flagged and asked for it himself, the way the claim-versus-
  argument piece came about on 2026-09-20.
- Open source work follows each project's own CONTRIBUTING file and the process in
  `docs/open-source-process.md`. I build and verify the fix here, then hand over a patch and
  the text for the issue and the pull request. Miguel reads every line, understands it, and
  posts and opens pull requests himself. I do not claim a fix works beyond what was run, and I
  say which checks could not run. Contributions include reproductions and reviews, not only
  fixes. Waiting is part of the work, and open source is a numbers game, so there is no cap on issues in flight (Miguel, 2026-10-14).
- After writing any article, I state which site category it belongs under, philosophy, tech,
  journal, or projects, and why, rather than leaving that decision for Miguel to raise
  separately afterward.
- Site content is edited here, in `site/`, never in the `miguel-site` repo. Every new article
  or project page follows `site/README.md`: the body starts with a `##` section, the last
  section is `## What I took from it` as a numbered list, and it gets one illustration made
  with `site/tools/illustrations.py` in the same delivery, not left for later.
- When I draft a "What I took from it" list, every item comes from what the piece itself
  already says. I don't add a lesson Miguel hasn't stated, and I tell him the list is a draft
  for him to correct.
- Nothing on the site names a company Miguel applied to or interviewed with (PostHog, Ezra,
  JUMO, and any that come later). On the site they're described in general terms, "a job
  interview", "a lending company", never by name. His current employer, Global Link+, may be
  named; he confirmed that on 2026-09-23. The names stay in the hub's own files, which the
  site never publishes. The homepage's open threads read straight from `projects/` files,
  so a bullet under "Open questions" or "Open decisions" there counts as site content.
- No more than two articles on the site relay the same general point, concept, or principle.
  Before adding a new one, I check what's already published for the point it makes, not just
  its topic, and say which existing articles I checked against. Same rule in
  `site/README.md`.
- Journal excerpts for the site are drawn from `journal/entries/`, never copied whole.
  Anything private is left out: health beyond what an article has already made public, other
  people, money, and personal patterns still under investigation. When I'm not sure whether
  something is private, I ask before it goes into `site/`. Anything he decides to keep private
  is recorded in the relevant entry in `journal/entries/` (encrypted), never restated in this
  file or any other public one, including as a note about what was withheld. Naming the
  withheld item here would publish the thing the decision was meant to protect.
- Weekly summaries are written Sunday evenings, starting 2026-09-20, the day this rule was
  introduced.
- `backlog.md` holds every open question and pending decision or action across every
  project. I add to it as new ones come up in any conversation, not just at the end of a
  session, and I mark an item answered with the date and a one-line resolution when it's
  resolved, I never delete a line or leave it silently unmarked.
  (From 2026-10-26 open items live in `queue.md`. `backlog.md` is the history, and the rule about never dropping a line still holds.)
- Anything time-sensitive, a deadline, a scheduled decision point, gets flagged as a
  candidate for an eventual email reminder once Routine Machine supports it. Until that
  exists, it stays visible in `backlog.md` so it isn't missed in the meantime.
- Every file I hand over is labelled with its repo, its exact path, and whether it is new or a
  full replacement of an existing file. Text to be appended says which file and where. A file
  with no stated destination is not delivered. (Asked for by Miguel on 2026-10-13, after the
  replacement below.)
- Two rule files apply to every current and future project: `docs/understanding-first.md` (how to
  work: stay close behind AI output, check output against the goal, the eight failure modes, slow
  down during hype, solve the other person's stated problem, do not act before being asked) and
  `docs/engineering-concerns.md` (the 111 backend concepts, each answered applies, not applicable
  or deferred, with a reason). Miguel's decision, 2026-10-16. A project is audited only when he asks.
- The working practices in `docs/agent-practices.md` (trigger, structure, steering, pruning,
  verification first) apply to every project, not one. Each repo has its own `CLAUDE.md`, and
  a shared one sits at user level.
- Prompts for Claude Code follow the template in `docs/agent-practices.md`: acceptance checks
  first, only the files the task needs in "read first", and staged phases with a gate after
  each once a prompt has more than three parts. Before a prompt is handed over, I check it
  against what the finished thing must cover, not only against what was asked.
- When studying a project's codebase surfaces a genuine correction opportunity, not a style
  preference, a real gap or bug, I don't let "this project is well-built" talk me out of
  flagging it. I verify it against the actual code first, then provide a ready-to-use prompt
  for Claude Code to fix it, rather than describing the issue only in the abstract.

- `queue.md` is the list of open work (from 2026-10-26). Before I queue a brief or a prompt I check it against the business goal and against the plan, refine it, and put conflicts to Miguel as decisions in section D. I do not treat a prompt as a command. Tasks go one at a time, design first, then code, then the tasks that keep the investor pack current. I plan at most 60% of the daily and weekly cap Miguel gives me, because other projects share it.
- I never prune, archive, close or drop anything without Miguel's approval. Candidate text in context files is listed in `docs/pruning-candidates.md` with evidence and waits for a yes, item by item.
- Business figures, prospect names and details about team members go only in the encrypted journal, never in public hub files. (Miguel's brief of 2026-10-26 and the strategy update were summarised in `journal/entries/2026-10-26.md`.)

## Rules from caught mistakes

Each of these exists because something specific already went wrong once. They're kept
separate from the general principles above so the reason each one exists stays visible.

- Before dating any journal entry, sync log entry, or decisions/status log row, I confirm the
  actual current date explicitly. I never infer today's date from the most recent entry's
  date or from how the conversation has been running. (Caused: a session's work got dated
  09-19 when it was actually 09-20, then compounded into a duplicated entry when corrected
  without checking the actual copy that had been made.)
- When Miguel relays or summarizes an idea from something he's reading, I record it and treat
  it as his own current understanding, not as a confirmed statement of what the source
  actually says, unless he says otherwise. A summary can be a misreading, and treating it as
  settled fact about the source would bury that possibility instead of leaving room to check
  it. (Caused: a paraphrase of Sapiens got flatly attributed to Harari in the journal, before
  Miguel pointed out he might have misunderstood the material, which is itself part of what
  this whole practice is meant to catch.)
- The distinction between a claim and an argument, and between an understanding and a
  verified source, carries forward into how future reading gets taken in and how projects get
  handled, not just noted once in the entry where it came up and dropped. This applies to
  reading material and to project documentation alike, a decisions log entry or a status
  claim is also a claim, and gets the same scrutiny a book's argument does.
- Settlement-engine is a system Miguel built himself, with Claude Code, not one he merely
  found or inherited. Restudying it is about verifying his own ability to explain it on
  demand, not about learning someone else's work for the first time. (Caused: an article
  draft described settlement-engine as something studied but not built, misstating actual
  authorship.)
- After finishing an article, I state its category before moving on, rather than waiting to
  be asked. (Caused: the claim-versus-argument piece was written and Miguel had to ask
  separately which section it belonged in.)
- I check project-status claims in the hub against reality periodically, not just when
  something is actively being worked on. (Caused: `website/PLAN.md` and
  `projects/settlement-engine.md` both sat stale for days after the underlying work had moved
  well past what they described, discovered only when pointed out directly.)
- When I print a file's full content for Miguel to copy, I treat that as delivered only once
  the tool call has actually confirmed returning that complete content, not because I
  intended it to or because a similar call worked earlier in the same session. A tool call
  can fail to run, run empty, or error out silently, and proceeding as though it succeeded
  anyway would hand Miguel content that was never actually produced. (Caused: after a context
  compaction, two verification Bash calls in a row failed to run, and Miguel had to ask
  directly for a standing rule making sure every print is confirmed before being treated as
  available.)
- When a document is large or a session has been running long, I write it to an actual file
  and send it, rather than printing it into the chat and assuming it arrived intact. A long
  print can get truncated in a way that isn't visible to me from the tool result. (Caused:
  multiple full-file replacements printed into chat on 2026-09-22 came through truncated,
  three hours into the session, and weren't safely copyable, discovered only when Miguel
  said so directly.)

- Before handing over a file that goes into a build (anything under `site/`), I run the build
  with that file in place, and I keep the live file's front matter. A file's shape is part of
  its content. (Caused: on 2026-10-09 I handed back a replacement for
  `site/projects/settlement-engine.md` with no front matter. The site build rejected it and
  neither new article went live until Miguel restored the front matter, `bd822f7`. Found on
  2026-10-11 by checking the push.)
- Before building a fix for an open source issue, I read the live thread in a browser, search
  the open pull requests by issue number, and check labels, assignees and whether the reporter
  offered a fix. A summary tool saying "no linked pull requests" is not that check. I also
  build verification inputs from the grammar the code defends against, and use a real parser as
  the oracle where one exists. (Caused: on 2026-10-14 I built a fix for supabase/mcp #457 while
  pull request #459 already fixed half of it, and tested it on 200,000 generated statements
  that never included `DO` or `CREATE FUNCTION` code strings, which that fix silently stopped
  warning about. Miguel's Claude Code found both. A follow-up shortlist built from issue titles
  was also all taken or not code in that repository. Pull request #470 was opened and closed
  the same day.)
- Before asking a reporter for details, I reread their post, and I check my reproduction against
  the setup they described. (Caused: on 2026-10-14 the java-sdk #859 comment asked for details the
  reporter had written, and the reproduction used a separate stub instead of a tool calling back
  into the same Tomcat connector. A summary of what I verified also said "a maintainer chose" a
  pull request on evidence that only showed a maintainer mentioning another one.)
- When a prompt names a library option or behaviour, I say it is unverified and tell the agent to check it
  against the current docs. (Caused: on 2026-10-15 the PostHog prompt asked for cookieless counting before
  consent. The agent checked the docs and found that PostHog's cookieless mode captures nothing until a
  visitor accepts or declines, so the plan could not work as I wrote it.)

- I solve the problem the other person states, in their words, and I do not act ahead of what was
  asked. No follow-up drafts, extra reproductions or audits until Miguel asks or a thread raises
  something already solved. (Caused: on java-sdk #882 the comment led with my method, the reporter
  closed the issue with an answer to their own problem, and Miguel told me the aim was to solve his
  problem, not the one I thought he had. He asked for this as a general rule on 2026-10-16.)
- After each handover I name the destination again in the file name or the note, and on the next sync I check where it
  landed. (Caused: on 2026-10-19 the hub file `projects/routine-machine.md` was applied to `site/projects/routine-machine.md`,
  commit `1282a25`. The public page then held hub-only text until found on 2026-10-26.)

## Current open threads

See `backlog.md` for the full, itemized list. Summary by project:

- Journaling practice: active. First entry tested the knowing-versus-explaining hypothesis
  against a real technical topic. Result: the hypothesis didn't hold for that topic. See
  `journal/entries/2026-09-16.md` and `projects/career-prep.md` for the full shift.
- Career prep: PostHog is now the primary target. Rejection feedback recorded but still not
  worked through. Ezra kept as secondary.
- CMU masters: Fall 2027 cycle open, final deadline 2026-12-09. Program and test timeline
  both undecided.
- Settlement engine: built by Miguel, all nine phases done and verified on staging.
  Idempotency chosen as the first subsystem restudied, two explain-back passes done, one
  verified crash-recovery gap found and fixed same day (commit `950bf86`). Outbox and
  ledger, then reconciliation, restudied and checked against the code. A public Lab sandbox
  and an MCP server over it are merged to `dev`. Open: where the Lab is hosted, and who
  carries out a correction after a mismatch is resolved. From 2026-10-15 the restudy tilts toward MCP and
  agents, anchored in the engine's own MCP server; the Phase 1 and Phase 9 concurrency fixes stay on the
  list after a first cold test with no recall.
- Open source: started 2026-10-14. Board of issues, no cap, in `projects/open-source.md`,
  process and evidence in `docs/open-source-process.md`. supabase/mcp #457 is waiting on the
  maintainers after pull request #470 was closed (another contributor's #459 covers half).
  Six issues are posted; java-sdk #882 is closed by the reporter, supabase-kt #415 has Miguel's follow-up and no reply yet, the rest wait. No follow-ups are drafted ahead of a reply. Next: a second #859 reproduction (tool
  calling back into the same connector) and a test of the #457 dollar-quote rule.
- Routine machine: direction under review (strategy update of 2026-10-20 points to an organisation tool for skills-to-work programmes; decision D-1 in `queue.md`). Phases 1 to 12 are on `main` (2026-10-26, `da5640f`). Staged prompts of 2026-10-19 run through
  Prompt 7 (access control, observability with an owner-only `/watchtower`, API docs, repository standard, CI green,
  understanding-first reminders, the 111-row concerns record). Open: Prompt 5 parts 4 to 6 not seen in commits; whether
  Phase 4 stays gated; whether the app moves from tracking toward producing work. Email reminders remain a future
  addition.
- Website and publishing: site live, redesigned around the illustrated shepherd (2026-09-23).
  Content lives in this hub's `site/` folder, so the site is updated by editing markdown here.
  Hashnode, dev.to, Medium, and LinkedIn profiles now exist and are linked from the footer;
  cross-posting is live to dev.to and LinkedIn (technical pieces only on LinkedIn). Hashnode
  (needs a paid plan) and Medium (issues no tokens) are not in use. Journal excerpt publication is on hold.
  Published 2026-10-26: the articles "Stay Close Behind the Code" (philosophy) and "My First Agentic System Is a Folder of Files" (tech). Built 2026-10-15: PostHog analytics on the site, live without a consent banner (the banner and a privacy
  page are still to build), and a local script that published all 10 philosophy and tech articles to
  Substack with no email to subscribers.
  The footer email sign-up runs on MailerLite (account 2655737); Waline handles comments and
  "This helped" only.