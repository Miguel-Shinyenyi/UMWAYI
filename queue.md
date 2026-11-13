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
| D-5 | Adopt DaisyUI for the redesign? | ANSWERED 2026-11-05: no for now; keep the current styles. Revisit after the Founding.dev hackathon, which may bring design changes. | n/a | n/a |
| D-6 | Name for the records screen (the brief's "lab UI"). | ANSWERED 2026-11-05: yes, The Hut. Four tabs: Notes (research), Tasks, Tickets, Outcomes. | n/a | n/a |
| D-7 | Your daily and weekly cap numbers. | PARTLY ANSWERED 2026-11-05: Miguel agreed to planning at 60% of the caps. The two numbers themselves are not recorded yet. | The two numbers | When planning the governor |
| D-8 | The first hire's terms: pay, hours, start date, contract type, and whether her cost sits on top of the planning envelope or comes out of contingency. | The financials workbook is built with the pay field empty. | Stipend or part-time in Tranche 1, full engagement only after the discovery gate. Written IP assignment and confidentiality before the first payment. |
| D-9 | Hackathon stack: one TypeScript service (API and MCP server), or Java and Spring Boot with a separate MCP process. | Fresh build, nine days, schema checks and the agent loop are TypeScript-native. | TypeScript. |
| D-10 | Hackathon licence. | The repo must be public. | MIT. |
| D-11 | Is the problem first-hand, and which two treasurers or group members can you interview by Nov 1? | ANSWERED 2026-11-03: no interviews will be done; the problem stays a hypothesis and every document says so. | n/a | n/a |
| D-12 | Daily hours you can give Nov 1 to Nov 4. | ANSWERED 2026-11-03: 3 to 4 hours per day. | n/a | n/a |
| D-13 | Photo of a paper ledger as a second intake. | ANSWERED by D-14: included after voice and approval work. | n/a |
| D-14 | Which hackathon direction | ANSWERED 2026-10-27: option 1, a savings-group secretary agent, with the restraint and archive ideas as a pre-registered test inside it. Plan v3 is in `umwayi-rm/HACKATHON.md`. | n/a | n/a |
| D-15 | Reading list location | ANSWERED 2026-11-03: create `reading-list.md` in the hub (done). Title still assumed as Think Again. | n/a | n/a |
| D-16 | Employer permission to read Global Link+ repositories | ANSWERED 2026-11-03: Miguel says permission is held. Read only; no writes, no pushes. Still open: a written record naming which model vendor may see work code. | n/a | n/a |
| D-17 | Journal key location | Miguel will handle it later. The key file may be read from his computer by a tool without its contents entering a chat. | n/a | n/a |
| D-18 | Readings in `docs/agent-principles.md` section 15 | ANSWERED 2026-11-03: TypeSafe confirmed; studios means LM Studio. Musk quotes stay unverified. | n/a | n/a |
| D-19 | Shepherd: app or own use | ANSWERED 2026-11-03: an app for other users, not only for you. That adds accounts, per user cost caps and support to the Shepherd Lite scope in the validation PDF. | n/a | n/a |
| D-20 | Shepherd: Qloo | ANSWERED 2026-11-03: Qloo is its own feature, separate from the pipeline. It does not route. | n/a | n/a |
| D-21 | Shepherd: hosted open model provider | ANSWERED 2026-11-03: Baseten for now. Modal and Fireworks accounts also exist, so the gateway must treat the provider as a config value. Keys never go in any hub file. | n/a | n/a |
| D-18a | Musk quotes in `docs/agent-principles.md` section 15 | PARTLY VERIFIED 2026-11-04: reports of the Nov 2025 Kamath interview support the appearance-of-goodness line, "can't pursue happiness directly" and value-before-money. The gym detail is in no source I read. The article marks it as yours. | n/a | n/a |
| D-27 | Kiroween entry versus the Claude Code budget governor (plan section 10) | ANSWERED 2026-11-05: the budget governor will be built, with the aim of completing it. It is no longer deferred to after 4 Dec. Open: where it sits in the build order next to the Kiroween slice (see D-29), and written clearance on Anthropic terms before any unattended run. | n/a | n/a |
| D-28 | Founding.dev landing page choices | ANSWERED 2026-11-05: hero headline "Every AI helper needs a shepherd"; 3 hours a day is fine; the mascot is builder generated, and Miguel wants to see what he can come up with on the platform; the page names the product, which is Umwayi hub. | n/a | n/a |
| D-29 | Kiroween trajectory: Skeleton Crew with a kill switch on 11 Nov, or Frankenstein from the start (plan section 11) | ANSWERED 2026-11-05: Skeleton for now, with the hope of finishing the entire product. Order of the governor against the skeleton: open. Suggested: skeleton first, governor second, kill rule on 11 Nov. | n/a | n/a |
| D-30 | Subscription first on every platform | ANSWERED 2026-11-09: use the normal subscription first (free, Pro, Max or any plan); pay as you go only later through the budget governor. Claude Code: both ways in (already signed in, or `umwayi agent login`); chat refused unless the login is the claude.ai subscription. All ten billing answers approved as proposed (umwayi-os PR 22). | n/a | n/a |
| D-31 | OpenCode and Meta Muse Spark Open | ANSWERED 2026-11-09: spec only now (umwayi-os tasks 10.40, 10.41), build after Dec 3. Muse Spark Open runs as a model behind OpenCode, local first. | n/a | n/a |
| D-32 | Schedule A moved one day | ANSWERED 2026-11-09: part 7c adds the login work Nov 9 to 12; layer 11 Nov 13 to 14; scan Nov 15 to 16. Layer 11 still needs its own spec approved before it is built. | n/a | n/a |
| D-33 | Python 3.10 and the Claude Agent SDK licence | ANSWERED 2026-11-10: keep Python 3.10 until Dec 3 and remove it later. Miguel reads the Claude Agent SDK licence himself (9 packages, all rights reserved). | n/a | n/a |
| D-34 | Web interface (layer 12) in scope | ANSWERED 2026-11-10: in scope before Dec 3 (it was a non goal). UI-Q1 to UI-Q5 approved as proposed: ui/ folder outside the package, three.js 0.187.0 and esbuild 0.28.2 pinned, built page with no network request, `umwayi view snapshot` counts only, calm by default, an owner checks panel. | n/a | n/a |
| D-35 | Interface look (UI-Q12 to UI-Q16) | ANSWERED 2026-11-11: Kenyan highlands at dusk, real life look, natural features, scattered stations, distance follows need, streams and trails of light, staff lantern, silhouette shepherd, home page content with the scene. PR 39 not merged, reworked on the same branch. | n/a | n/a |
| D-36 | Interface tiers and public site (UI-Q17 to UI-Q22) | ANSWERED 2026-11-11: three tiers chosen from the device with a visible override (list view, standard, near photoreal); a public Next.js site in site/ on Vercel free tier with no analytics; the owner view stays one offline file; Maasai silhouette, real looking sheep, goats and dog, dense forest, water over rocks; all four plan cuts accepted, owner handles the timelines. | n/a | n/a |
| D-37 | Layer 13 scope | ANSWERED 2026-11-11: build all four correction ideas (review dates, reopen, petitions, honest tension) and graded autonomy with behaviour, off by default and fail closed; a reopen is a new logbook entry linked to the old one; stop where Dec 3 finds us. | n/a | n/a |
| D-38 | Kiro model choice | ANSWERED 2026-11-11: Opus 5.5 for realistic environment work, Sonnet 5.5 for the rest, both at medium effort. Claude asks before picking a model and gives the options so Miguel picks. | n/a | n/a |
| D-39 | Interface rule change: the page may send requests | ANSWERED 2026-11-12: approved. Steering rule 10 and 12.R17.6 change from "the interface only looks" to: the page may send the same request the command line would, to a local backend (`umwayi serve` on 127.0.0.1, with a token), through the same rules, logbook and kill switch. Spec first (W6). | n/a | n/a |
| D-40 | Plan cuts and deployed UI | ANSWERED 2026-11-12: plan cuts acceptable. Deploy on Vercel as soon as the frontend and the backend with login exist, with a CI that deploys automatically on updates. | n/a | n/a |
| D-41 | Timelines and parallel work | ANSWERED 2026-11-12: timelines are not strict. Several Kiro sessions run at once, later using the task worktree system planned in umwayi-os. | n/a | n/a |
| D-42 | Direction question 4 | ANSWERED 2026-11-12: done later; added to the task list. | n/a | n/a |
| D-43 | Migration of hub data | ANSWERED 2026-11-12: only the journals are private and stay private. Everything else public in the repository is free to access and use. | n/a | n/a |
| D-44 | Article and hub deployment | ANSWERED 2026-11-12: write both. The article is created (draft, `site/tech/stitching-a-chimera-with-kiro.md`). The hub deploys to every site already listed. | n/a | n/a |
| D-45 | Kiroween category and UI.7 answers | ANSWERED 2026-11-12: category is Frankenstein, not Skeleton Crew. UI.7 (PR 58): allow one timer in the faults test; accept Standard's extra 4.4 KB and one request; keep the Poly Haven photos as they are; make the antelope larger; automatic fall back to Standard after slow frames is a follow-up task, not built. | n/a | n/a |
| D-46 | W6 spec question W6-Q28 (approval in a web chat) | ANSWERED 2026-11-12: the approval for an Ask me first request is given at the console of `umwayi serve` with `Allow once? [y/N]`; with no terminal attached the request is rejected. Recorded in the W6 build (PR 64). | n/a | n/a |
| D-47 | Goal orchestration W9-Q1 to W9-Q14, and the worktree rule | ANSWERED 2026-11-12: all fourteen approved as recommended. New owner rule the same day, superseding the answer to Q3: the worktree per task (one task, one worktree, a fresh session per task) is a core rule of umwayi-os, not an option (W9.6b). Only W9.9, the shared docs builder (also W17), may go before the Nov 29 freeze; the rest comes after Dec 3. | n/a | n/a |
| D-48 | Rules and engineering guidance coded in the library (W19) | ANSWERED 2026-11-12: the hub's rules and engineering guidance (core rules, understanding-first, agent practices, engineering concerns, pre-launch security, owner standing rules) and Kiro's ten frontier engineering practices are coded in umwayi-os as a guided flow, a checked `guidance.yaml`: checkable rules enforced by code at the gates, the rest injected into prompts and checked by the tester. W10 becomes the coverage view. Every rule the owner gives the guide also applies to umwayi-os. | n/a | n/a |
| D-49 | Working rules for the guide and the Kiro sessions | ANSWERED 2026-11-12: one browser tab per Kiro session, never reused, close the finished tab only after the new one is open; keep the guide's Chrome tab group and a GitHub anchor tab; every question comes with a recommendation; do it yourself first before asking the owner; keep the Kiro issues log updated and turn unsolved items into tasks; update Notion alongside the work; every session merges the newest origin/main into its branch before every push so a PR never opens with conflicts. | n/a | n/a |
| D-50 | PR 58 High tier real-device test | HELD 2026-11-12 by the owner: PR 58 merged on the guide's review (CI 4 of 4, 311 UI tests); the owner's own test on a real device waits for later. | n/a | n/a |
| D-51 | New tasks W16, W17, W18, W19, W20 | ADDED 2026-11-12: W16 board status script; W17 is W9.9 (one status part and one limits part per task, a script builds the two shared docs; started 2026-11-12 20:25); W18 match CI Python versions locally; W19 the guided flow in the library; W20 faster CI (path filters, sharding, a final check that every test ran). W20 waits for PRs 65, 10.48 and W9.9 to merge because it changes check names and the branch rule. | n/a | n/a |
| D-52 | Next work after the W19 and W10 merges | ANSWERED 2026-11-13: guard wiring, then the W9 build (W9.6b, W9.7, W9.8, W9.10, W9.11), each one task per pull request. This changes the plan of W9-Q14 (the rest of W9 after Dec 3). W9.6b and a read-only progress page (W8 slice) started 2026-11-13 14:20. | n/a | n/a |
| D-53 | Hands-off merge flow and stacked branches | ANSWERED 2026-11-13: the guide merges a pull request that passes its own review with green CI and no conflicts, except steering or safety rule changes, changes to what an existing test means, anything that raises a question for the owner, Kiro signed out or low credits, and the owner's own by-hand checks. "merge N" from the owner is still the merge word. Parallel sessions merge their branches into each other; after any merge to main every running session is told to merge origin/main. New Kiro sessions use Kiro Auto because credits are low. | n/a | n/a |
| D-54 | Base rules, user toggles, user rules and promotion (later, after Dec 3) | ANSWERED 2026-11-13: the owner's rules are the base library, on by default for every user. Users can only toggle them. Tiers 1 and 2 (safety, owner decisions) are locked on; tiers 3 to 6 can be toggled. Users may add their own rules in a separate per-user file in their own control. The AI may prompt the owner about a good user rule: text only, only if the user agrees, with how often it fired; the owner decides and edits the library, then the source line is re-hashed. An exporter that reads the logbook (rules that blocked often) comes after W9.8 and proposes nothing on its own. Recorded on the W19 mind map page in Notion. Not built. | n/a | n/a |
| D-55 | Third builder session | ANSWERED 2026-11-13: W9.7 (the supervisor, `goalrun.py` and its tests), stacked on the W9.6b branch, no edit to `cli.py` or `agents.py`; the first code that starts an AI helper, so it waits for the owner's word before merge. | n/a | n/a |

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
| H-002 | Which CMU program: MSCS, MSAII, MSE or MSIT | CMU | ANSWERED 2026-11-05: MS in Engineering Artificial Intelligence (MS EAI) at CMU-Africa |
| H-003 | Target durations per schedule block | Routine Machine | queued |
| H-004 | Does the weekly schedule layout need tuning once lived with | Routine Machine | queued |
| H-005 | Poll hub-sync on a schedule or trigger by hand | Routine Machine | closed 2026-10-26 |
| H-006 | Could a moved or renamed file be double-counted by hub-sync | Routine Machine | closed 2026-10-26 |
| H-007 | Does the Board view call the backend or the intelligence service | Routine Machine | queued |
| H-008 | Chart types for the Reports view, once real data exists | Routine Machine | held |
| H-009 | Waline free-tier database: Postgres or MongoDB | Site | closed 2026-11-05: Postgres (Miguel says it is already decided and implemented; not checked here) |
| H-010 | Waline database suspension: keepalive or accepted risk | Site | closed 2026-11-05: accepted risk |
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
| H-042 | MailerLite: manual campaigns or paid plan for RSS sends | Site | closed 2026-11-05: manual campaigns |
| H-043 | Double opt-in success message wording | Site | queued |
| H-044 | Remove or keep the test address on the MailerLite list | Site | decided 2026-11-05: remove. The removal itself is not done |
| H-045 | Delete test comments in Waline | Site | decided 2026-11-05: delete. The deletion itself is not done |
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
| H-057 | README and PROJECT.md name a target employer | Routine Machine | closed 2026-11-05: keep naming it (Miguel: yes) |
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
| H-071 | CMU CV: the site CV was rebuilt on 2026-11-08 with umwayi-os as the main project and Substack in place of Hashnode. File: CMU/Miguel_Shinyenyi_CV.pdf. Replace the site copies, then upload it to CMU yourself. See docs/plans/cv-update-2026-11-08.md | CMU | CV ready; replace site copies and upload |
| H-072 | Export the git-crypt journal key and keep a second copy off the machine (for example encrypted, on Google Drive) | Hub | yours |
| H-073 | Article: do the rules that stop an AI also stop us. Set to published on 2026-11-08 (draft: false). Goes live when the pull request merges | Site | released on merge |
| H-074 | AI OS layer 9 and later: adapters for other AI CLIs (Claude Code, Kiro), own CLI and chat, reuse existing Linux features. Decided 2026-11-08: adapter packages may use packages. See docs/plans/ai-os-layer-9-adapters.md | Hub | held until layer 8 is merged |
| H-075 | Remove the journal key from every shared or cloud document once a safe copy exists | Hub | proposed |
| H-076 | Article: come with a question, not a verdict. Set to published on 2026-11-08 (draft: false). Goes live when the pull request merges | Site | released on merge |
| H-077 | Three articles are still drafts: appearance-versus-reality, who-the-standards-serve, one-mind-or-many. Decide which to release next | Site | yours |
| H-078 | Budget governor: built before Dec 3 (Nov 15 to 21). Answered yes on Nov 8 | AI OS | answered |
| H-079 | Layer 10 may use packages, in adapter packages only, pinned and listed in their README. Core stays standard library only. Answered yes on Nov 8 | AI OS | answered |
| H-080 | Run the first real Claude Code chat on a machine with Node 22 and a Claude Code login; record whether the hook ran before the first prompt | umwayi-os task 10.31 | yours |
| H-081 | Check the Founding.dev preview ("Taking a break") before Tue Nov 10, 10:59 Nairobi; do not publish until told | Founding.dev | yours |

### Closes and the evidence

Closed 2026-10-26 with your approval. The lines are in `archive/backlog/answered-2026-10-26.md`.

- H-005: `docs/hub-sync.md` says it polls every 15 minutes (`hub-sync.poll-interval-ms`).
- H-006: `docs/hub-sync.md` decisions log, 2026-10-17: dedupe by content sha, so a renamed file is not counted twice.
- H-012: Your decision of 2026-10-26: PostHog and Ezra stay named in the public hub files.
- H-026: The `CLAUDE.md` files are pushed (2026-10-26). The user-level `~/.claude/CLAUDE.md` is not checked from here.
- H-037: Duplicate of H-032. The Substack record commit for both new articles exists on `main` (64fd271).
- H-062: `PROJECT.md` was rewritten on 2026-10-26 (commit 744db5d); the stale paragraph is gone.
- H-067: The item says it was done in the 2026-10-14 replacement of `projects/open-source.md`.

## K. Hackathon (umwayi-rm repository)

Day by day tasks, with acceptance checks, live in the repository's `queue.md` (H-01 to H-14). This hub tracks the four that need you today.

| ID | Task | Status | Acceptance checks | Outcome goes in |
|---|---|---|---|---|
| K-01 | Request the Baseten $100 credit and submit the Meta $150 form. Each needs your own account and a card on file | queued, now | Confirmation saved, no card data in any file | `umwayi-rm/docs/hackathon-log.md` |
| K-02 | Create the public repo `umwayi-rm` from the delivered zip, docs only, with a LICENSE | done 2026-10-28 | Public when logged out; no code; first code commit Oct 27 or later | repo log (H-02) |
| K-03 | Decide D-9 to D-13 | done 2026-11-03 | Answers recorded here | this file |
| K-04 | Ask on the hackathon Discord whether a savings-group ledger agent is clear of "basic RAG" and "simple image analyzers", and whether "Built with Muse Spark Open" is required | not asked (Miguel, 2026-11-05). He assumes yes; that is an assumption, not an answer | Answer recorded | repo log |
| K-05 | Two ten minute interviews with treasurers or members (D-11); read the Day 1 model checks | done 2026-11-03, none held by decision (D-11); Day 1 model checks done 2026-10-28 | Real rows in `umwayi-rm/docs/research/interviews.md`, or it says none | repo |

## L. Practices and plans (from the notes of 27 Oct to 2 Nov)

Plans are in `docs/plans/`. Rules are in `docs/agent-principles.md`. Order and counter arguments are in `docs/plans/README.md`.

| ID | Task | Status | Acceptance checks | Outcome goes in |
|---|---|---|---|---|
| L-01 | Protect `main` on all four personal repositories and require a pull request. | queued | A direct push to `main` is refused on each repository; one test pull request merges. | repo settings, then `SYNC_LOG.md` |
| L-02 | Routine Machine landing page on GitHub Pages. | queued | The page loads logged out; it states who it is for and what it solves; no private data on it. | `routine-machine` |
| L-03 | Append the branch and pull request rule and a pointer to the principles into `CLAUDE.md` of `routine-machine` and `miguel-site`. | queued | Both files carry the block; nothing else in them changed. | each repo |
| L-04 | Fix the `BASENTEN_API_KEY` risk in `umwayi-rm` (accept both spellings). | done 2026-11-03, PR #20 (the deploy batch in PR #21 kept one key helper) | A run with each spelling reaches the model adapter. | `umwayi-rm/docs/hackathon-log.md`, H-21 |
| L-05 | Run Steward steps S1 to S3 only, then stop and review. | queued, after Nov 4 | Acceptance checks in `docs/plans/steward-agent.md`. | `docs/plans/steward-agent.md` |
| L-06 | Measure real token use of one video script and one render, and compare with your Pro limits. | queued, after Nov 4 | A number from Settings, Usage, before and after. | `docs/plans/social-agent.md` |
