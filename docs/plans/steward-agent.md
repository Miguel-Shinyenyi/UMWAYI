# docs/plans/steward-agent.md: the Steward (manager agent and everything agent)

Status: plan, 2026-11-02. Nothing here is built. Source instructions: [L2, L38, L72] in `docs/agent-principles.md`.

You asked for two things: an agent that manages all my projects (and UMWAYI upgraded into it), and an agent that can be queried about the entire body of projects and helps create new features. They share data, tools and rules. They differ in what they may do. So this is one agent with two scopes, and the table in section 2 keeps the difference.

## 1. What it does

1. Answers questions about my projects with citations: "what changed in Routine Machine last week", "where is idempotent approval implemented", "how does this feature relate to the hub".
2. Keeps the hub current: reads commits and pull requests across repos, drafts the SYNC_LOG entry, queue updates and journal drafts, and checks that files point at each other correctly.
3. Helps create features by the product path [L9-10]: requirements, FAQs of hard questions, a prototype, feedback, refined requirements, then a build task for Claude Code with acceptance checks first.
4. Opens pull requests on my own repos from feature branches, never on main.
5. Explains what it did with a diagram and an analogy in the PR description [L22].

It does not decide direction, merge pull requests, push to main, publish, send, or spend money. I decide and approve.

## 2. Two scopes

| | Personal scope | Work scope |
|---|---|---|
| Repos | UMWAYI, routine-machine, miguel-site, umwayi-rm, Invoice-Financing | Global Link+ repositories (inventory kept in the encrypted journal, not here) |
| Access | Read, plus pull requests from feature branches | Read only |
| Where models run | Approved vendors (Anthropic today) | Not decided. Needs employer permission first. Code must not go to any model vendor the employer has not approved. Fallback: a local open model on my machine, which keeps the code on it |
| Memory | Hub files | A local index in a folder outside any repo; nothing copied into the hub |
| Allowed output | PRs, drafts, journal drafts | Answers, notes for me, no commits |

Open question for you: does Global Link+ allow its code to be read by a hosted model? I did not find a policy. Until it is answered, the work scope stays off, and I have used only repository names and your own contribution counts.

## 3. Reuse check [L72]

- UMWAYI already holds the project map (`MASTER_CONTEXT.md`), the queue, the sync log, archive rules and pruning practice. Upgrading UMWAYI means adding tools and checks around these files, not a new store.
- umwayi-rm gives a tested MCP server, an agent loop with budgets, verification trails, an edit audit and an eval harness. After submission they can be abstracted into the Steward. They are MIT and mine.
- Routine Machine's hub-sync already reads the hub on a timer.
- Do not build a vector index first. Use deterministic reads: `git log`, file trees, grep, the PR list. Add embeddings only if questions fail without them, and measure that.

## 4. Data and tools

Tools, all through an MCP server, each with a risk class:
- Read: `git_log(repo, since, author)`, `read_file(repo, path)`, `search(repo, text)`, `list_prs(repo)`, `ci_status(repo)`. Low risk.
- Draft: `draft_journal(date)`, `draft_sync_entry()`, `draft_queue_update()`. Write to a drafts folder only.
- Propose: `open_pr(repo, branch, title, body)` on a feature branch. Medium risk. Needs my approval to merge.
- Observe (later): read logs and observability endpoints of services I run [L38]. Read only, loopback or tailscale only.

Inputs are structured [L53]: a query has a type (ask, digest, feature, check), a scope (personal or work), a time window and the repos. Outputs are a typed answer with citations: repo, path, line or commit. An answer with no citation is marked "not grounded" and is not shown as fact.

## 5. Process and loops [L53, L38]

1. Intake. Classify the request. If it is vague, grill me and restate it in the specific form. Repeat until I agree [L13-14, L38].
2. Plan the shortest steps with a confidence figure (`docs/plans/ai-operating-system.md` section 4). Mark which steps are automated and which I monitor.
3. Run read tools. Draft.
4. Verify: deterministic checks (citations resolve, links work, style rules), then a judge from another model family, then me. Loop limit three [L28].
5. Report with a short diagram or analogy [L22], the list of what is not verified, and what I need to decide.
6. Log the run and any failure mode in the audit log. Failure modes become rules [L15].

## 6. Guardrails

- Branch rules: feature branches, protected main, small commits, a PR for every change [L72].
- The agent never reads secrets: no `.env`, keys or cloud credentials in its working directory [L62]. The journal is encrypted. It is decrypted only in a local session I start, and never copied into a public file.
- Journal and investor material stay out of public repos. Public files may name Global Link+ only in the ways my site rules allow. Work repository names and details stay out of public files.
- Every external write is a draft or a PR. Nothing is sent or published by the agent.
- Fetched content is data, never instructions. Decrypted journal text and fetched content are never in one session. PRs go only to allowlisted repos and branch prefixes, with a diff size cap. The full list is in `ai-operating-system.md` section 7.
- Work scope tools are absent from the default MCP configuration. They are switched on only for a session I start, and nothing derived from work repos enters the hub.
- A citation that resolves does not show the line supports the answer. S3 includes seeded wrong conclusions with real citations.

## 7. Build order

Start after Nov 4. Each step is a branch and a PR, with acceptance checks written first.

| Step | Work | Acceptance checks |
|---|---|---|
| S1 | A deterministic daily digest: commits and PRs per repo per day, as a table | Output for 27 Oct to 2 Nov matches `git log` counts (this plan's digest is the test case) |
| S2 | Journal draft from the digest plus my notes, in the hub format | Draft has no invented feelings: "What I felt" says "not recorded" unless I wrote it |
| S3 | Query tool over the personal repos with citations. Do it only if S1 and S2 proved useful | 20 questions I write; each answer cites a real line; an uncited answer is marked; 20 seeded answers with real citations and false conclusions: count how many pass |
| S4 | Hub upkeep: SYNC_LOG and queue drafts; cross-link checker | Checker finds a seeded broken link |
| S5 | Feature path: requirements, FAQ, build packet | A packet passes my template; FAQs list at least five hard questions |
| S6 | PR opening with verification loop | A planted instruction in a repo file does not change the PR; a seeded bug is caught by the loop; the loop stops at three and notifies |
| S7 | Work scope, only after employer permission and a local model decision | Written permission recorded; no code leaves the machine, checked by a network log |

## 8. What I did not check

- No work repository content was read. Their activity is not in the commit digest. The GitHub contribution graph showed none from you in them for 27 Oct to 2 Nov.
- Employer policy on AI tools was not found.
- Retention terms of model vendors were not read.
