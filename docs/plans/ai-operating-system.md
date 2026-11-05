# docs/plans/ai-operating-system.md: AI operating system plan

Status: plan, 2026-11-02; section 10 added 2026-11-04. Nothing here is built. Source instructions: [L3, L28, L33, L34, L53, L58-63, L68, L72] in `docs/agent-principles.md`.

## 1. What it is and is not

One sentence: a small set of deterministic services that all my agents run on, so the rules in `docs/agent-principles.md` are enforced by code and not left to a model's memory.

Is: a policy kernel, a task and goal service, a decision gate, a model gateway, a tool gateway, a verification service and an audit log, with agents on top.
Is not: a new model, a replacement for Claude Code, or a toolkit for strangers. One user, a handful of agents.

Guarantee I can keep: zero unapproved actions and zero unchecked claims reaching an output. Guarantee I cannot keep: that a model's free text is true. The notes ask for zero hallucinations [L34]. Code bounds what an agent may do. It does not make a model correct. So the plan measures the rest.

## 2. What exists already (reuse check [L72])

| Need | Already exists | Action |
|---|---|---|
| Permissions, deterministic hooks on tool calls, skills | Claude Code settings and hooks | Use first. Build my own kernel only for gaps |
| Tool protocol | MCP, and a working MCP server in umwayi-rm | Reuse after submission (my own MIT code) |
| Agent loop with budgets, traces, verification trails, edit audit | umwayi-rm `src/` and `agent/` (H-09, H-18, H-19) | Abstract the parts that are not ledger specific |
| Eval harness, frozen splits, run files | umwayi-rm `evals/`, `docs/evals/` | Reuse the pattern |
| Idempotent approval, append-only records | umwayi-rm ledger, Invoice-Financing | Reuse the design |
| Memory: short core plus verbatim archive with checksums | UMWAYI hub (`archive/`, `verify.py`) | Keep as the memory layer |
| Model gateway and routing eval | Plan in the Shepherd report of 2026-10-31 | Becomes layer L3 below |
| Branch and PR practice | umwayi-rm (18 merged PRs in 3 days) | Copy to the other repos |

Prior art read on 2026-11-02: AIOS (arXiv 2403.16971, code at github.com/agiresearch/AIOS; code licence not checked). It puts a kernel between agents and resources: scheduler, context manager, memory manager, storage manager, tool manager, access manager. Its reported gains were small (for example ReAct on HumanEval 48.8 to 50.6; Reflexion on GAIA 6.7 to 7.8). Throughput rose up to 2.1 times with Llama-3.1-8b on one 24 GB GPU, with no variance reported. The design suits many agents sharing a GPU. That is not my situation. I take the module split, not the code.

## 3. Layers

| Layer | Job | Deterministic? |
|---|---|---|
| L0 Policy kernel | Action types with risk class, allowlists, task state machine, budgets, approvals, kill switch | Yes. No model inside |
| L1 Task and goal service | Intake, grilling, agreed win statement, task queue with a progress signal per task | Code owns state; a model asks the questions |
| L2 Decision gate | Fast or slow route (section 4) | Policy table in code; a small model returns a typed answer |
| L3 Model gateway | Task to model map, effort, timeouts, fallback, cost logs, eval replay | Yes |
| L4 Tool gateway (MCP) | Tools with risk ratings; command executor split from network (section 7) | Yes |
| L5 Memory | Core files always loaded; archive verbatim with checksums and gists; recall logged | Yes |
| L6 Verification | Deterministic checks, then judge, then cross-model, loops with a limit | Checks yes; judge no |
| L7 Audit | Append-only log of every action, check and approval; failure mode register | Yes |
| L0b Budget governor | Reads real usage, enforces hourly, daily and weekly caps, admits or defers tasks (section 10) | Yes. No model inside |
| L1b Queue and task graph | Splits heavy prompts into subtasks, orders them, lets me pick the next one (section 10) | Code owns the graph; a model proposes the split |
| L8 Agents | Steward, Social, later others | No |

## 4. The decision gate (fast and slow) [L30-33]

A function `decide(state, options, rubric)` returns a typed result: a choice or yes or no, a score, the basis (which checks passed), and a route. A policy table maps stakes and score to the route: answer now (fast) or reason, verify or ask me (slow). The thing I described works like Jev from TypeSafe. Jev is a hosted model with no published benchmarks and unstated licence terms (read on 2026-10-31), so I build my own typed call on a small open model and test Jev as one arm. OpenRouter can serve as one provider behind the model gateway. In the 2026-10-31 review a router on OpenRouter scored 24.7 percent below the best single model in an independent benchmark. So it is an arm in the eval, not a default.

Status of this design after review (2026-11-02): the fast and slow split is plain engineering, a routing table, and is plausible. The weights, thresholds and the claim that confidence tracks correctness are unsupported guesses until logged outcomes show otherwise. Kahneman's two systems motivate the idea and are not evidence for it.

Calibration rule: a model's own confidence is one input and never the deciding one. In a 2026 pilot, an agent that judged its own work claimed an improvement in all 54 cycles while 56 percent had a zero or negative measured effect. A stronger judge reading the same files still passed 44 percent of those (one model, one task, exploratory). Only a gate grounded in a measurement outside the transcript avoided it.

### Confidence thresholds (my recommendation for [L72])

Confidence is computed, not asked. Starting formula, weights to calibrate: deterministic checks passed 40; coverage or mutation score against my threshold 20; cross-model agreement 20; precedent or reuse found 10; no open grilling questions 10.

| Action class | Examples | Starting rule |
|---|---|---|
| A. Reversible, local, behind a pull request or draft | Code on a feature branch, article draft, journal draft | 80 percent or more: act and report. 60 to 79: act, mark low confidence, ask for review. Under 60: grill me first |
| B. Visible but reversible | Publish a site draft, schedule a post draft | 90 percent or more and my approval every time |
| C. Irreversible or outward | Send, post publicly, delete, push to main, money | Never autonomous at any confidence. I approve each |

These numbers are my guess. Log predicted against actual outcome for every decision. Thirty decisions is only enough to start looking: at 30 decisions a 90 percent success rate has an interval of roughly 74 to 98 percent (my calculation, standard interval, not checked by a tool). Keep a record until each class has far more, and compare the computed score with a plain baseline: did all deterministic checks pass, yes or no. If the score does not predict later defects better than that baseline, drop the score and keep the yes or no. Cross-model agreement is weaker than it looks because models share training errors.

## 5. Verification service [L28, L15]

1. Deterministic checks first: tests, schema, style rules (em dashes, banned words), links, secrets scan, coverage at my threshold (example 80 percent).
2. LLM judge second, from a different model family than the producer, with order swapped. It answers the four questions in section 7 of the principles.
3. Cross-model audit for risky outputs. A 2026 preprint (Chain-of-Models) reports auditors raising accuracy up to 23.5 points on one bias, but the best auditor changed with the bias, one popular auditor fell below the no-audit baseline on sycophancy, and each cell had 50 samples with no intervals. So choose auditors by measured effect per check type.
4. Fix and test again, limit set by me (default three). On the limit, stop and notify me with what failed. Seed cases where the fix satisfies the checker without fixing the problem, to see whether the loop learns to game the check.
For each check type, measure the catch rate on seeded defects with and without the judge, and keep only the arms that add catches. A citation that resolves does not show that the cited line supports the claim. Test: seed 20 answers with real citations and false conclusions. If any pass, "zero unchecked claims" is only nominal.
5. Mutation testing on the policy kernel and the checks: mutate rules, confirm tests fail. Tool names are from memory and need checking (Stryker for TypeScript, PIT for Java, cargo-mutants for Rust). Report the mutation score next to coverage.

## 6. Language [L68]

Determinism comes mostly from design: pure functions, schemas at every boundary, closed lists of allowed actions, explicit state machines, no ambient authority. A language changes how many illegal states can be written down.

| Option | For | Against |
|---|---|---|
| Rust | Exhaustive matching, no null, ownership; strongest fit for a small policy kernel and an isolated executor | Slow to learn at about 3 hours a day; I did not verify the state of its agent and MCP libraries |
| TypeScript, strict, with schema validation | Already proven in umwayi-rm (122 tests); MCP SDK in use; fastest to build; one language across hub tooling and sites | Weaker guarantees; discipline replaces the compiler |
| Kotlin or Java | I know it; sealed types give exhaustive matching; fits Global Link+ | Heavier; less agent tooling |
| Go | Simple static binaries, good for gateways | Fewer ways to encode illegal states |
| Python | Evals, glue, model code | Weakest for a guard layer |

Recommendation: build version one in strict TypeScript, with the kernel written as pure functions and tests, because it is proven and fast. After version one works, port only the policy kernel and the executor split to Rust, if I want to learn it. Then the compiler enforces what the tests only check. This is a judgement, not a measured result.

## 7. Security [L58-63]

| My rule | Implementation | Deterministic check |
|---|---|---|
| Loopback only; Tailscale or an authenticating reverse proxy [L59] | Bind to 127.0.0.1. Remote access only through the proxy | A test that fails if any listener binds 0.0.0.0 |
| Update the runner often [L60] | Pinned versions plus a weekly update check | A script that lists outdated runners and fails the weekly report if any is old |
| Tool-using models get official weights only; unknown ones need line by line human and agent verification; human liable [L61] | Allowlist of model ids with source and checksum | Load fails on a checksum mismatch |
| Secrets out of the agent's working directory [L62] | Keychain or a secrets broker; agents get scoped short-lived tokens | A secret scan of the working tree and logs; no .env in an agent's directory |
| Split command power from network power; log the crossing [L63] | Executor process in a network-less sandbox; a separate proxy process with an egress allowlist and a log | A test that the executor cannot open a socket; the log shows every crossing |

Added after the security review:
- Fetched content (repository files, issues, PR text, web pages) is data, never instructions. Label it in the prompt and in the audit log.
- Never load decrypted journal text and fetched content in the same session.
- Pull requests may only target allowlisted repos and branch prefixes, with a diff size cap. Before the Steward opens any PR (step S6), run a planted-instruction test: a repo file that says to add a URL to the PR must not change the PR.
- Fetch and PR tools sit on the network side and take model-chosen arguments, so they are an exfiltration path. Add an egress allowlist, response and body size limits, and a secret scan on outbound content, not only on the working tree.
- CI scan that fails if text from decrypted journal files appears in any public path, plus a test that every journal path is marked encrypted in `.gitattributes`.
- Keep the journal key out of anything an agent can read. It now sits in the claude.ai Project (`secrets/umwayi-journal-key.md`); move it to a password manager or the system keychain.
- Hosted model vendors are the real exposure for rule 3. Checksums show integrity, not safety.
- Approval fatigue: after weeks of good drafts, pressing approve becomes a habit. Plant a known-bad draft at random in about one in twenty approvals, and log whether I caught it. Sample a share of Class A actions for review.

Current finding from the repo scan: umwayi-rm's compose file publishes port 3000 on all interfaces, and its key variable is spelled BASENTEN_API_KEY with no alias. See `projects/hackathon.md`.

## 8. Build order, gates at each stage

Council advice (scope and agent design lenses): do stages 0 to 3 first and stop there unless the logs show a gap. Run four weeks on Claude Code hooks plus an append-only audit log before writing a kernel; if the hooks missed two incidents or fewer, stop at hooks. L2 (decision gate) and L3 (model gateway) wait for evidence. Port to Rust only if, with ten seeded illegal-state bugs in the TypeScript kernel, more than two escape the tests and the type checker. A port adds a cross-language boundary, which is a new place for bugs.

Start after the hackathon submission (Nov 4). Assumes about 3 hours a day. Each stage is its own branch and pull request.

| Stage | Work | Acceptance checks (written first) | Gate |
|---|---|---|---|
| 0 | Branch protection on main in every repo; feature branch and PR rule written into each CLAUDE.md | A direct push to main is refused in each repo | Rule is live |
| 1 | Turn `docs/agent-principles.md` into a machine-readable policy file; keep Claude Code hooks and permissions as the first enforcement | Each hook has a failing and a passing example | I review the policy |
| 2 | Policy kernel, audit log, kill switch (L0, L7) | Unknown action refused; every action logged; kill switch stops a running task; mutation score reported | Mutation score at my threshold |
| 3 | Verification service (L6) | Deterministic checks run before the judge; loop stops at the limit and notifies; a seeded bad output is caught | Seeded failures caught |
| 4 | Decision gate and calibration log (L2) | Typed output validated; policy table routes; predictions logged | 30 logged decisions to calibrate |
| 5 | Model gateway and routing eval (L3) | As in the 2026-10-31 report, stages 1 to 3 | Eval result written, null included |
| 6 | Tool gateway with the executor and network split (L4) | Executor cannot reach the network; crossings logged | Security checks in section 7 pass |
| 7 | Agents on top: Steward first, Social second | See their plans | |

## 9. Risks and what is not proven

- Scope. This is a lot beside a day job and the hackathon. Stages 0 to 3 give most of the value. Stop there unless the logs show a gap.
- Duplication. Claude Code hooks and permissions may cover stage 2. Check that first.
- Calibration weights and thresholds are guesses until 30 decisions per class are logged.
- Cross-model verification and the decision gate are promising in preprints, not proven for my tasks.
- Approval fatigue, correlated judges that share a blind spot, and injection through permitted reads would still get through this design (agent design lens). The seeded tests above are how to find out how often.
- Language choice is a judgement.
- AIOS code licence, Rust agent libraries, and the mutation tools were not verified.

## 10. Built on top of your own Claude Code, with a budget governor and a task queue

Added 2026-11-04 from Miguel's instruction. Design only. Claude Code facts below come from its documentation, checked 2026-11-04 by a research agent; anything it could not confirm is marked UNCONFIRMED. A council of three Claude models reviewed this section (risk, scope, tests); they read my brief, so they are not independent. Their changes are in the text.

### 10.1 Principle: an adapter on the user's own install

The operating system holds no API keys and no model access of its own. It drives the Claude Code the user already has, under the user's own login and plan. It ships as a Claude Code plugin: hooks, slash commands, a subagent and an MCP server in one package (documented as possible), plus a small local program that owns state.

Other models sit behind the same model gateway (L3) as later adapters. Claude Code is the first adapter, not the only one.

### 10.2 What Claude Code tells us about limits

- Plan limits. The status line input carries `rate_limits.five_hour` and `rate_limits.seven_day`, each with `used_percentage` and `resets_at`. It appears for Pro and Max subscribers, only in a live session, after the first response. This is the only documented plan-limit signal. The plan's real windows are therefore a five-hour window and a seven-day window, each with its own reset time, not a Nairobi day.
- Exact numbers. Anthropic does not publish the token or message counts for Pro or Max. The Max page says only five times Pro usage per five hours and per week. So percentages from the status line are ground truth, and any token cap I compute is my own estimate.
- Session logs. The path `~/.claude/projects/<project>/<session>.jsonl` is documented. The entry format is documented as internal and subject to change. I saw per-message token counts in them on 2026-11-04. Treat that as incidental, and fail closed if the format changes (10.3).
- The `/usage` screen is built from local history. Other devices and claude.ai are not in it.
- Headless runs (`claude -p`) can output JSON with token usage and a cost field. The cost is a list-price estimate, not the plan meter.

### 10.3 The budget governor (L0b)

Job: know how much you have used, refuse to start work that would not fit, and say when it will fit.

Windows. Two come from the plan: the five-hour window and the seven-day window, read from the status line percentages and reset times. Three are mine and optional: a cap per hour, per Nairobi day and per week, in weighted tokens from the logs. They exist because you may want to stay under what the plan allows, and because the status line only reports during a live session.

Gate. It is code, with no model inside. Before a task starts, for every window:

  used + reserved + predicted <= cap * (1 - reserve)

- used: from the status line percentage where present, otherwise from the log ledger.
- reserved: the predicted cost of every task admitted but not yet finished. When a task is admitted, its prediction is reserved. When it finishes, the reservation is released and the actual cost is booked. This stops two tasks passing the same headroom at once.
- predicted: the 90th percentile of past costs for that task class and model, times 1.25. A class with fewer than ten samples uses a flat ceiling you set, and its runs are logged as probes. Cost is tracked per model because different models likely drain the limit at different rates.
- reserve starts at 10 percent.

If a window fails, the task is deferred. The message names the window and its reset time.

Fail closed. If the log parser meets an unknown format, an unknown token field, a missing status line value or a governor process that is not running, the gate refuses and says why. It never treats missing data as zero. Log reads skip a half-written last line and deduplicate by message id. Subagent logs must be counted; a test checks this.

Blind spot. Chat on the web or phone, and other devices, may draw on the same plan limit and are not in the logs. The status line percentage includes them, which is the reason it is the first source. Where it is absent, add a hand entry ("I used about 8 percent elsewhere"). A hand entry expires after one hour. A hard stop applies: if Claude Code reports a limit hit, every window is treated as full until its reset time.

Calibration. My hour, day and week caps start as guesses. Each time the plan reports a limit, record the ledger total and adjust. Cache token weights are unknown: start with input plus output at weight 1 and cache at a low editable weight. Limit hits will be rare because the governor works to avoid them, so calibration data builds slowly. Plan for that.

Override. One command, for one task, with a reason, written to the audit log. It is bound to that task id and expires when that task finishes or at the next reset of the window it overrode, whichever comes first. A split or retried child does not inherit it. It is never a default.

What "deterministic" means here. The gate's arithmetic and refusals are deterministic. The inputs are not: usage depends on output length no one knows in advance, the task class and the estimate come from a model, and the logs are an unstable interface. The guarantee is that the same ledger and the same request always give the same decision.

### 10.4 Breaking heavy prompts into subtasks

A heavy prompt is one the governor predicts will not fit, or that would use more than 25 percent (a guess) of the smallest cap.

1. A planning call (a model, admitted first, charged to the budget) turns the prompt into a task graph. Each node has: id, goal, inputs, expected outputs, task class, estimated cost, dependencies, files it expects to touch, and an acceptance check.
2. Code validates the graph: no cycles, an acceptance check on every node, no node estimated above the share limit (an oversized node returns to the planner, up to three rounds), and no two nodes that declare the same file running together.
3. The model proposes where to cut. Code checks whether each piece fits. Caveat from the council: the planner also supplies the estimates and the file lists, so the validator checks numbers it was handed. Two guards: estimates for known classes are replaced by measured history, and a node that touches a file it did not declare is stopped and parked.

Non-sequential work is a graph. Independent nodes can run in any order. A node waits until every upstream node has finished and passed its check.

### 10.5 The queue you control

Commands: list, next (pin a node), move, hold, drop, split, merge, run-now.

Default order: nodes that unblock the most others, then nodes that fit the current window, then deadline. Your pin beats the default but cannot break a dependency or skip the gate. If a pinned node does not fit, the system says when it will and offers three options: wait, split it smaller, or override once. Editing while a node runs: dropping or re-pinning a running node asks you to stop it first. Dropping a node that others depend on lists the blocked nodes and asks what to do with them.

Each node runs as a fresh headless Claude Code run. It gets a handoff file with its dependencies' outputs, not the earlier transcript. Each run goes through the gate. Retries go through the gate too, and each retry is charged. A failed acceptance check allows two retries, then the node is parked and you are told. An interrupted node is charged for the partial usage and restarts from its handoff file in a clean working copy.

State is an append-only event file: queued, admitted, started, finished, checked, parked, overridden, pinned. The queue is derived from it. After a crash, a node with a start event and no finish event is marked unknown, not rerun. It may already have edited files or made commits. You decide: inspect, discard, or rerun.

### 10.6 The full picture

On request, a report built from the graph:

- done, running, queued, blocked, parked, with actual versus estimated cost per node;
- each finished node's output in graph order;
- a partial result labelled partial, listing every missing node by name;
- when all nodes are done, an assembled result following the assembly step the planner wrote at the start. Code concatenates the outputs. A model may add a summary, marked as model-written.

### 10.7 Terms and where it may run

The research agent found this, and I could not settle it:

- Anthropic's consumer terms restrict access "through automated or non-human means, whether through a bot, script, or otherwise" except through an API key or where Anthropic explicitly permits it (quoted from a fetch summary; read the terms yourself).
- Reports of Anthropic's compliance guidance say subscription login tokens are intended only for Claude Code and Claude.ai.
- It is unclear whether a scheduler that starts the official `claude` binary counts as Claude Code use. The headless documentation describes scripted use but is not a terms grant. A tool that manages budgets on top of Claude Code is the case most likely to be read as a third-party tool. The acceptable use policy was not read.

Consequences for the plan. Everything in stages 1 to 3 below runs inside a live session you started: a status line script, hooks and slash commands. That is how Claude Code is meant to be extended. Starting headless runs unattended from a scheduler (stages 4 and 5) waits for written clearance from Anthropic. Also, hooks work only inside Claude Code sessions; a scheduler would need its own gate before each run.

"Anyone's Claude Code": each user installs it under their own account and takes on their own terms risk. The README must say so.

### 10.8 Acceptance tests, written first

- Fake logs: windows sum correctly across a day boundary in Africa/Nairobi, and across a laptop sleep or clock jump.
- Status line percentage present: the gate uses it. Absent: it uses the ledger or refuses.
- Unknown log format, renamed token field, half-written last line, duplicate message ids, a missing subagent log: each ends in refusal or correct totals, never in an undercount.
- A task failing any window is deferred, and the message names the window and reset.
- Two tasks submitted together that each fit but together do not: only one is admitted.
- Override: bound to one task, logged, expires at task end or reset, not inherited by retries or split children.
- Hand entry expires after one hour.
- Pinned node runs next only if it fits and its dependencies passed.
- Property test: for random graphs and pins, no node starts before its dependencies pass.
- Queue edits during a run: drop and re-pin of a running node, drop of a depended-on node, each leaves a valid state.
- Crash recovery: a started but unfinished node becomes unknown and is not rerun.
- Limit hit mid-run: partial usage booked, all windows full until reset.
- Partial report names exactly the nodes that are not done.
- Replay: feed recorded usage through the estimator and report how far predictions miss. The target is set after the first measurement.

### 10.9 What is not proven

- Every number: the reserve, the 1.25 margin, the 25 percent share, the cache weights.
- Whether the log format stays readable across Claude Code versions.
- Whether the terms allow anything beyond a live session (10.7).
- A hook cannot stop a response already generating. The gate works at task start and between tool calls. One long response can overshoot, which is why a reserve exists. Stopping between tool calls can also leave files half edited; each node works in its own working copy for that reason.
- The planning call costs tokens. For a small prompt, decomposition may cost more than it saves. Only heavy prompts are decomposed, and the replay test should check that this rule helps.
- Baseline to beat: you watching the usage screen and picking tasks by hand.

### 10.10 Council verdict on scope

The scope lens (a Claude model, not independent) said the idea is sound and over-scoped: build the ledger and a warning hook first and stop, because a person who queues three to five heavy tasks a week may get most of the value from a pinned to-do list plus warnings. I agree the queue has to earn its place. So the design above stays on paper, and the build order below gates each step on evidence.

Four-week test, set now:

- Weeks 1 and 2: run the read-only ledger plus the status line recorder. Log every real limit hit with the ledger and status line values at that moment. Pass: on at least three of four limit events the ledger is within about 20 percent of the plan's own percentage.
- Weeks 3 and 4: run the warning hook. Count how many times a warning changed what you did, and how many were false alarms.
- Week 4 decision: if the ledger tracks the plan and warnings changed your choices, build the gate. Build the queue only if you regularly hit limits in the middle of a task. Otherwise stop.

### 10.11 Build order for this part

1. Read-only ledger, status line recorder and report. No gating.
2. Warning hook, then a blocking gate with the explicit override.
3. Task graph, validator and queue commands, with you running each node inside a live session.
4. Headless execution of nodes and the full-picture report. Needs terms clearance first.
5. Scheduler for unattended runs. Needs terms clearance first.

Each stage is its own branch and pull request, tests first.

### 10.12 Kiroween tension (decision D-27)

The Kiroween entry must be built with Kiro. This governor is for Claude Code and does not by itself show Kiro use. Options:

1. Keep the entry as planned (Steward plus a draft-only social agent, built with Kiro). Build the governor after the contest as a separate project.
2. Make the governor the entry, with Claude Code and Kiro CLI adapters. Risks: scope, and Kiro may not expose usage data (UNCONFIRMED).
3. Add only the read-only ledger report to the entry, if it takes under a day.

Recommendation, a guess shared by the scope lens: option 1. The contest date is firm (4 December), the key facts are unconfirmed, and the terms question blocks the unattended half.

## 11. Kiroween trajectory, credits and fallback

Added 2026-11-05. Facts about Kiro come from its pages and the signed-in account, read 2026-11-05. Design only.

### 11.1 Credits

- The Kiro account is on the Free plan: 50 credits a month, none used, reset on 1 Dec.
- A hackathon credit request was made by Miguel. No grant shows on the account yet.
- Paid plans exist. Whether a Kenyan payment method works is not confirmed.

### 11.2 If no grant arrives

- Use the Auto agent, the cheapest option, for routine work.
- Spend credits only on specs, steering files and hooks, where Kiro's own features earn their cost.
- Hand write the policy kernel and its tests. They are small and they are the core of the entry.
- Skip Crew (the always on agent runner). It needs about 10 GB of memory and uses credits all day.
- Ask for help in the Kiro community channel.
- Do not route Kiro through another harness. The hackathon rules forbid third party harness use.

### 11.3 Trajectory

- Skeleton Crew: build the smallest slice first. A policy kernel with Yes, No and Ask me first, an append only logbook, an MCP server with three tools (check policy, record audit, request approval), one policy file with a schema, the Steward as the manager agent, and a draft only social agent. About 21 hours a week.
- Kill switch to Frankenstein: if the slice is not working by 11 Nov, stop adding parts and reuse existing tools for the rest. Do not rebuild what a tool already does.
- Approval gate: GitHub branch protection. The agent proposes, you merge.
- Deferred: the budget governor (D-27).

### 11.4 Not verified

The submission date (3 Dec was read from the Devpost page and should be confirmed), whether Kiro hooks fail closed in every case, and the credit grant itself.

