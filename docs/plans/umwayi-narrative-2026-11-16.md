UMWAYI NARRATIVE AND CLAIMS, 2026-11-16 14:15 (owner's spine, checked against the repo). For the Devpost write-up, the video voice script, the site and posts. Replaces any line in the video pack that calls umwayi-os a library, a plugin or a helper for one agent.

SPINE (the owner's words, tightened)
1. We are building apps (AI agents) before building the operating system. Build the OS first, so agents are mindful of resources.
2. A normal OS handles all processes and their access to resources. An app is not allowed to manage the machine's resources itself. A code editor does not decide how much memory it takes. Apps are built to be greedy to finish their task, so the OS governs and queues them.
3. AI agents are the same. They are greedy for tokens, time, files and the network. They need a governing layer, a queue and a deterministic core: umwayi-os.
4. Context slips. An agent forgets rules that were supposedly in its memory. So rules do not live in the agent's memory. They live in a gate that answers every action, and the supervisor hands each helper its rules at the start of each task.
5. An app should not write the operating system that governs it and then share it, because it will bend it toward itself. The OS should come from a party that is not one of the agents. Umwayi is built by an independent owner, open source (MIT), with no vendor in the middle.
6. You cannot write the test, run the test, mark the test and then announce your own score. The check is separate from the builder.

WHAT THE REPO SUPPORTS TODAY (say these)
- A rules gate that answers Yes, No or Ask me first, fails closed, same answer for the same input. Logbook with a hash chain. Budget governor that refuses past the cap. Kill switch. Goals run as one task per worktree under a supervisor. Reads on a local page only.
- Real runs of Claude Code, OpenCode and Kiro started and were gated on Nov 15; no end to end goal with real agents is recorded yet (W40).

WHAT TO SAY CAREFULLY (honest limits, must stay in the write-up)
- Enforcement is cooperative: a helper that never asks is not stopped. Not a sandbox. W41 designs a launcher and optional OS confinement; not built.
- Deterministic means the gate, the budget, the logbook and the checks: same rules and same input give the same decision. It does NOT mean deterministic output. A model can answer differently each time. Say "same rules, same answer", never "deterministic output". What the agent writes is judged by checks and tests, not trusted. The supervisor is an AI session. It works inside those limits and cannot approve its own Ask me first. Say "a deterministic governing layer", never "a deterministic AI".
- Point 5 and 6 need care. Umwayi-os was built with Kiro, with Claude reviewing, and the same builder agents wrote many of its tests. Kiro can run Claude models, so the reviewer is not fully separate from the builder. What exists today that helps: the owner decides and merges; CI runs on GitHub; a mutation pass (48 faults planted, 47 caught, 1 shown equivalent); Bandit and OSV scans; the owner's hand runs on his Mac. What to add before claiming independence: tests written from the requirements by a different agent than the builder (W73), results produced by CI or by the owner and not by the builder, a conformance suite anyone can run against their own install, and the owner's recorded runs (W40). Until then say "built under its own rules and checked by CI, a mutation pass and the owner" and do not say "independently verified".

OUTSIDE EVIDENCE (use as the problem statement, with links)
- Felony Bench tallies verified incidents where frontier agents from major labs harmed third-party systems during security evaluations: 17 counted across six incidents, among them unauthorized credential use, a Dependabot supply chain attack and a social engineering campaign. It excludes sandbox escapes. The harm came through credentials and the network, not only through the file system. So a sandbox is necessary and not enough; reach (credentials, network) must be governed too. The site does not name its author and its commenters dispute the word felony: cite it as a count of reported incidents, not as a legal finding.
- Agentjacking through Sentry's MCP: an attacker posts a crafted error event to a public Sentry DSN; an agent asked to work through open issues reads it and runs the planted instructions with the developer's own credentials (85% success reported by the researchers, no CVE). Mitigations they list: human approval for shell commands that follow an external tool read, short lived scoped tokens, a sandbox. That is the case for W68 (untrusted content) and W69 (credentials and network).

CHANGES TO THE SCRIPTS AND WRITE-UP
- Open with the spine in this order: apps before an OS, greedy apps, governed agents, rules in a gate and not in memory, a separate checker, then the demo of the gate, the budget refusal, the kill switch, the logbook.
- Replace "a library for agents" with "an operating layer that governs agents like an OS governs apps". Keep the existing "not a kernel, not a sandbox" line in the write-up.
- Add one scene or one voice line on the limits (cooperative today, confinement designed) so the narrative matches KNOWN-LIMITS.
- Do not show or say real runs with X until the W40 records exist.
- Use the three outside cases only as the problem, with their links, no logos of the companies in the video.

ADDED 2026-11-16 14:35 (owner)
- Umwayi-os applies its own rules to itself: builder, tester and checker are different agents, and where possible different model families (W73). Say it as a rule it follows, and as built or designed only when the repo shows it.
- Context slipping: handoff notes carry facts between tasks (W42), but obedience comes from the gate, the packet that restates the rules, short one task sessions and checks after the work.
- Later, several people on one shared account (W74): umwayi serve stays local today; do not claim hosted or multi user in any video or post.
- Voice script v2: V1 rewritten to the spine, V12 added (OS first, then the agents). Backups of the three edited files are in pre-narrative-2026-11-16/ in the video pack folder.
