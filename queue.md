# Queue

The one list of work. It replaces `backlog.md` as the place open items live. `backlog.md` keeps the history: every line stays there, open lines are marked `[>]` with their queue id.

Created 2026-10-26, from your Routine Machine brief and the 70 open backlog items.

## How it works

- One core agent (this project) knows the whole queue and the hub files. It hands one task at a time to one agent, usually Claude Code in the right repository. The files only bring that agent up to date.
- Every task has a packet: goal, context (files and records), acceptance checks, and where the outcome is recorded. A task without all four is not ready.
- Order: design tasks first (design feeds code), then code, then the tasks that keep the investor pack current.
- A brief or a prompt is not a command. Each one is checked against the business goal and against the plan first, refined, then queued. Conflicts go to you as decisions (section D).
- Pace: a few tasks a day, inside your daily and weekly caps, using at most 60% of them because other projects share the same resource. You tell me the cap numbers; I count tasks, not tokens.
- Status values: queued, in progress, awaiting approval, held (waits on a gate or a decision), done, proposed close (evidence given, waits on your yes). I never close an item, drop one, or prune a file without your approval.
- Where outcomes go: a line here with the date, the evidence, and the file or commit. Research notes go in `routine-machine/investor-pack/` (local, git-ignored) until the app has its records screen.

## D. Decisions waiting for you

These block queued work. Each has my recommendation. They are yours to decide.

| ID | Decision | Why it matters | My recommendation |
|---|---|---|---|
| D-1 | Which direction does the app take? The 2026-10-20 strategy update points at an organisation tool: candidate pipeline, follow-ups, intervention log, placement status, outcome reports. The built app (Phases 1 to 12) is a learner tool. | R-04, R-05, R-06, R-07, R-08 depend on it. The update says it changes the app design entirely. | Keep the built app as the learner side. Decide before any redesign whether the organisation tool is the same product, a second front end on the same backend, or a rebuild. Hold design work that depends on it. |
| D-2 | Which plan wins where the two PDFs differ? The operating plan (8-week pilot, 2 programmes, habit and return-after-interruption measures, AI coach out of scope) and the strategy update (10 to 12 weeks, one lead partner, placement and retention measures, AI drafting allowed with human review). | Pilot length, measures and scope conflict. | The strategy update is dated 2026-10-20 and is the narrower one. Treat it as current and the operating plan as background unless you say otherwise. |
| D-3 | The brief puts account deletion and the privacy centre in the backlog until there are paying customers. The operating plan lists privacy controls, export and deletion as P0. The strategy update requires role-based access, a correction path for records and a privacy notice. | The profile page has no export or deletion today. A Kenyan pilot with learner data will need them. | Ship export, deletion and a privacy notice before any real learner data. Put the rest of the account menu in the backlog. |
| D-4 | The developer chat with a model that reads and writes system data (brief section 3). Neither PDF includes a developer chat. The strategy update defers autonomous outreach and bans silent status changes by AI. | A model with write access to records is the largest new risk surface. | Hold until after the discovery gate. When built, writes need an explicit approval step and schema-checked output, as the strategy update requires. |
| D-5 | Adopt DaisyUI for the redesign? It is not installed in routine-machine (Tailwind 4 only). The app was brought to the hand-built design reference in six fidelity passes on 2026-10-17 and 10-18. | A component library replaces styling that was checked against the reference. | Keep the current styles. Fix feedback and motion in place. Revisit DaisyUI only if D-1 means a new front end. |
| D-6 | Name for the records screen (the brief's "lab UI"). | Fits the shepherd words in `docs/design.md`. | The Hut: where the shepherd keeps notes and tools. Four tabs: Notes (research), Tasks, Tickets, Outcomes. |
| D-7 | Your daily and weekly cap numbers. | I cannot see usage. | Tell me both numbers; I will plan at 60%. |
| D-8 | The first hire's terms: pay, hours, start date, contract type, and whether her cost sits on top of the planning envelope or comes out of contingency. | The financials workbook is built with the pay field empty. | Stipend or part-time in Tranche 1, full engagement only after the discovery gate. Written IP assignment and confidentiality before the first payment. |

## R. Routine Machine, from the brief

Order inside each group follows the brief's table. "Packet" says what makes the task ready.

### Design (first)

| ID | Task | Status | Notes and gate |
|---|---|---|---|
| R-01 | Does the workflow already use one core agent delegating to a single agent? | done 2026-10-26 | No `.claude/agents` folder in any of the four repositories. The pattern runs by hand: this project hands a prompt to Claude Code. The queue adds the missing packet fields. The photo's 34-file agent tree is more than this needs. |
| R-02 | Check design status, update the reference design, regenerate PDF and slide counterparts | in progress | Prompt 8 stage 1 done: `docs/fixes/design-status.md`. The reports were merged into the branch `access-control-per-user-scope`, not `main` (PR #10); a pull request to `main` is needed. `compare.mjs` does not run as documented and never signs in. Reference updates wait on D-1. |
| R-03 | Fix pointer and interaction defects, sweep for similar ones, write fixes as `.md` | in progress | Report written (`docs/fixes/interaction-defects.md`). Fixes are stage 2, after your approval. Prompt 8. Likely cause: Tailwind 4 gives buttons the default cursor, and the only custom pointer rule is `.pick label`. Verify, do not assume. |
| R-04 | Component-by-component redesign so actions are seen and felt | held | D-1 and D-5. |
| R-05 | Profile menu: username plus essential items only | held | D-1 and D-3. |
| R-06 | Role clarity: cohort admins see only the cohort page, learners see both | queued | Prompt 8, stage 1 maps today's roles (the backend has USER and OWNER only; organisation admins are a table, not a role). Changes wait on D-1. |
| R-07 | Developer chat platform (brief section 3) | held | D-4. Spec kept in the brief. |
| R-08 | Research records, investor pack and design reference viewer in the app, with real numbers | held | D-1, D-6. Every number carries its source and a label: assumption or validated. Both PDFs say figures are planning assumptions until validated. |
| R-09 | Screen that explains how the system works | held | Later. |

### Code and engineering

| ID | Task | Status | Notes and gate |
|---|---|---|---|
| R-16 | Confirm multi-tenancy; implement if missing | queued | Prompt 8, stage 1 reports only. Seen so far: Organisation, OrganisationAdmin and Cohort tables exist. The strategy update requires a test that one organisation cannot read another's records; none is confirmed. |
| R-17 | Observability to chat notification to ticket to fix loop, and a ticketing system | held | Later. Needs R-07. |
| R-18 | Delegated authorisation instead of pasted keys in `.env` | held | Before deployment. |
| R-19 | Bare-metal deployment with MinIO, like the settlement engine | held | Before deployment. Concerns-record answer first (H-059). |
| R-20 | Which model for which job | held | After deployment. |
| R-21 | In-house, low-bandwidth integrations | held | Later. The strategy update asks for low-bandwidth workflows in the pilot. |
| R-25 | Fetch book covers from the internet | queued | Needs a source and a low-bandwidth rule: cache the cover, never fetch on every page view. |

### Business and research (investor pack stays current)

| ID | Task | Status | Notes and gate |
|---|---|---|---|
| R-10 | Update the investor pack locally, regenerate PDFs and slides | in progress | First pass done 2026-10-26 in `routine-machine/investor-pack/`: facts updated (all twelve phases on `main`, access control, operations, CI), banners on the files that wait on D-1 and D-2, first hire added, new `13-strategy-update-2026-10-20.md`. PDFs and slides not regenerated. The positioning rewrite waits on D-1 and D-2. |
| R-11 | Read the strategy update, queue the pivot tasks | done 2026-10-26 | Read. Pivot tasks are R-31 to R-38. |
| R-12 | Pricing from cost, time, margin and value | queued | The strategy update says the budget is unvalidated and prices come after scoping. Start with the unit-economics list in its section 8. |
| R-13 | Check the legality of redirecting roadmap.sh and similar repositories | queued | Read each repository's licence text. Facts and sources only; not legal advice. |
| R-14 | Prospective client outreach approaches | queued | Names are in the journal entry for 2026-10-26. Treat each as a prospect to qualify. |
| R-15 | Register a business in Kenya, later the US | queued | I give sourced facts and questions for a lawyer. I am not a lawyer. |
| R-22 | Learning path documenting the whole process | held | Later. |
| R-23 | Outcome improvement study of how you use AI, with records | queued | Ongoing. Pilot measures in the strategy update: report denominators, not only percentages. |
| R-24 | Keep the IPO and private AI guide on file | queued | Local copy in `investor-pack/reference/`, not committed. Its GPU prices and model names are unverified; check before any use. |
| R-26 | Creative director: research the unproven items the hands-on research builds on | queued | Details in the journal. |
| R-27 | Add the first hire (creative director) to the plan and the financials | done 2026-10-26 | Built: an insert for the plan and a workbook with a new budget line. Both are local files for the investor pack, not for the repository. Pay terms wait on D-8. |

### Pivot tasks from the 2026-10-20 strategy update

| ID | Task | Status |
|---|---|---|
| R-31 | Verified prospect list of 15 to 20 organisations; qualify before treating as prospects | queued |
| R-32 | Interview guide and workflow map (strategy update, sections 9 and 13) | queued |
| R-33 | Competitor evidence log: verify each named competitor's current product and target segment | queued |
| R-34 | Inspect the open-source bootcamp-risk repository the update names: activity, licence, architecture | queued |
| R-35 | Kenya data-protection check: DPIA need, controller and processor roles, regulator registration; list questions for local counsel | queued |
| R-36 | Funder eligibility check for each call considered (geography, stage, target group, co-funding) | queued |
| R-37 | Estimate the reachable market from the verified list, not from youth population | queued |
| R-38 | Pilot definitions: metrics, baseline, cohort, data owner, follow-up windows, missing-data rules | queued |

Rule from the update: if the first five interviews show no repeated problem, no reliable data path and no budget owner, revise the customer segment before expanding the build. Build tasks R-04 to R-08 stay held until then, apart from small fixes.

## P. Pruning, awaiting your approval

You approved the list on 2026-10-26 ("lets go with your recommendation"). Done: P-01 to P-09, P-13, P-14, P-15, each recorded in `archive/INDEX.md` (A-001 to A-011). Kept by decision: P-10, P-11, P-12. The list, with evidence, is in `docs/pruning-candidates.md`. Run `python3 archive/verify.py` to recheck the checksums.

## H. Hub items, converted from `backlog.md`

IDs match the `(H-nnn)` mark on the line in `backlog.md`. "Yours" means only you can do or decide it.

| ID | Item | Area | Status |
|---|---|---|---|
| H-001 | Does the register-calibration pattern extend past technical explanations | Self | yours |
| H-002 | Which CMU program: MSCS, MSAII, MSE or MSIT | CMU | yours |
| H-003 | Target durations per schedule block | Routine Machine | queued |
| H-004 | Does the weekly schedule layout need tuning once lived with | Routine Machine | queued |
| H-005 | Poll hub-sync on a schedule or trigger by hand | Routine Machine | closed 2026-10-26 |
| H-006 | Could a moved or renamed file be double-counted by hub-sync | Routine Machine | closed 2026-10-26 |
| H-007 | Does the Board view call the backend or the intelligence service | Routine Machine | queued |
| H-008 | Chart types for the Reports view, once real data exists | Routine Machine | held |
| H-009 | Waline free-tier database: Postgres or MongoDB | Site | queued |
| H-010 | Waline database suspension: keepalive or accepted risk | Site | queued |
| H-011 | Four pillars and a four-step loop on the homepage: loss or fair simplification | Site | yours |
| H-012 | Public repo names companies the site keeps private | Site | closed 2026-10-26 |
| H-013 | Read the seven journal excerpts in site/journals | Site | yours |
| H-014 | "This helped" limits one click per browser, not per device | Site | queued |
| H-015 | Who carries out a correction after a mismatch is resolved | Settlement engine | yours |
| H-016 | Recover an UNKNOWN settlement with no external reference | Settlement engine | queued |
| H-017 | Alert a person on a reconciliation mismatch | Settlement engine | queued |
| H-018 | Reconciliation candidate query: time window or paging | Settlement engine | queued |
| H-019 | Follow-up on the second half of supabase/mcp #457 | Open source | held |
| H-020 | Measure maintainer reply and review times | Open source | queued |
| H-021 | Does minimal banter show up with trusted people too | Self | yours |
| H-022 | Does structured exercise satisfy the ancestral movement drive | Self | yours |
| H-023 | How far the "Routine Machine as an intuitive pre-answer" insight reaches | Self | yours |
| H-024 | Does "anxiety comes from addiction to control" hold against a real instance | Self | yours |
| H-025 | Weekly summaries: on request only, one went missing before | Hub | queued |
| H-026 | Review and push the 2026-10-13 agent-practice changes | Hub | closed 2026-10-26 |
| H-027 | Measure whether the agent practices help (corrections per run) | Hub | queued |
| H-028 | Decide on pruning the hub (archive closed items and old log entries) | Hub | awaiting approval |
| H-029 | Journal gaps 10-20, 10-22, 10-23, 10-24 | Hub | yours |
| H-030 | Weekly summaries 10-05 to 10-11 and 10-12 to 10-18 | Hub | held |
| H-031 | Find the Sapiens sentence on Sumerian writing, brain and DNA | Hub | yours |
| H-032 | Review takeaways in the agentic-system article, then run npm run substack | Hub | yours |
| H-033 | Work through the career rejection feedback | Career | yours |
| H-034 | Consent banner and privacy page on the site | Site | queued |
| H-035 | Confirm one pageview and one event in PostHog Live from a real browser | Site | queued |
| H-036 | check:mobile fails 378px against 375px | Site | queued |
| H-037 | After each article run npm run substack and commit the record | Site | closed 2026-10-26 |
| H-038 | Journal excerpt publication on hold | Site | held |
| H-039 | Possible next article: AI hype and fundamentals | Site | held |
| H-040 | Next book: Algorithms Are Not Enough | Reading | held |
| H-041 | Optional two-week test: do AI tools save hours or raise expectations | Hub | held |
| H-042 | MailerLite: manual campaigns or paid plan for RSS sends | Site | held |
| H-043 | Double opt-in success message wording | Site | queued |
| H-044 | Remove or keep the test address on the MailerLite list | Site | yours |
| H-045 | Delete test comments in Waline | Site | yours |
| H-046 | Replace SITE_DISPATCH_TOKEN with a fine-grained token | Site | queued |
| H-047 | Read the takeaways on six articles and four project pages | Site | yours |
| H-048 | Study Java concurrency mechanisms to failure, then the OS | Study | held |
| H-049 | Read the two 2026-10-09 articles and their takeaways | Site | yours |
| H-050 | Open the two skeletal-health sources the philosophy article cites | Site | yours |
| H-051 | Look at the Lab and the MCP evals with fresh eyes | Settlement engine | yours |
| H-052 | Decide where the public Lab sandbox is hosted | Settlement engine | yours |
| H-053 | Restudy the Phase 1 and Phase 9 concurrency fixes | Settlement engine | yours |
| H-054 | MCP and agents study, six modules | Study | yours |
| H-055 | Prompt 5 parts 4 to 6 not visible in commits | Routine Machine | queued |
| H-056 | Confirm PostHog Live events after consent | Routine Machine | queued |
| H-057 | README and PROJECT.md name a target employer | Routine Machine | yours |
| H-058 | Check other tests for machine-specific assumptions | Routine Machine | queued |
| H-059 | Cloud hosting, storage, CI/CD, Kubernetes, caching: concerns answer first | Routine Machine | held |
| H-060 | Does Routine Machine move from tracking toward producing work | Routine Machine | yours |
| H-061 | Email reminders for time-related items | Routine Machine | held |
| H-062 | PROJECT.md "Current phase" line reads only "five" | Routine Machine | closed 2026-10-26 |
| H-063 | docs/testing.md stale "Open questions" wording | Routine Machine | queued |
| H-064 | Test supabase/mcp #459 against the real PostgreSQL parser | Open source | held |
| H-065 | Test the dollar-quote rule on #457 | Open source | held |
| H-066 | Second java-sdk #859 reproduction | Open source | held |
| H-067 | Board wording on spring-ai PR #6932 | Open source | closed 2026-10-26 |
| H-068 | Concerns record and understanding-first in every project | Hub | queued |
| H-069 | One article per merged pull request | Open source | held |
| H-070 | Check career-prep against current applications before any article names a company | Open source | yours |

### Closes and the evidence

Closed 2026-10-26 with your approval. The lines are in `archive/backlog/answered-2026-10-26.md`.

- H-005: `docs/hub-sync.md` says it polls every 15 minutes (`hub-sync.poll-interval-ms`).
- H-006: `docs/hub-sync.md` decisions log, 2026-10-17: dedupe by content sha, so a renamed file is not counted twice.
- H-012: Your decision of 2026-10-26: PostHog and Ezra stay named in the public hub files.
- H-026: The `CLAUDE.md` files are pushed (2026-10-26). The user-level `~/.claude/CLAUDE.md` is not checked from here.
- H-037: Duplicate of H-032. The Substack record commit for both new articles exists on `main` (64fd271).
- H-062: `PROJECT.md` was rewritten on 2026-10-26 (commit 744db5d); the stale paragraph is gone.
- H-067: The item says it was done in the 2026-10-14 replacement of `projects/open-source.md`.
