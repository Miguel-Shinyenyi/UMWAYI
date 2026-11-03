# docs/plans/ai-operating-system.md: AI operating system plan

Status: plan, 2026-11-02. Nothing here is built. Source instructions: [L3, L28, L33, L34, L53, L58-63, L68, L72] in `docs/agent-principles.md`.

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
