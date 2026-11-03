# docs/plans/README.md: plans from the notes of 27 Oct to 2 Nov 2026

Written 2026-11-02, Africa/Nairobi. Plans only. No agent here is built. Principles: `docs/agent-principles.md`. Line map: `docs/agent-principles-map.md`.

| Plan | File | One line |
|---|---|---|
| AI operating system | `ai-operating-system.md` | Deterministic services every agent runs on, built in gated stages |
| Steward | `steward-agent.md` | UMWAYI upgraded into the manager agent, and the everything agent, as one agent with two scopes |
| Social media agent | `social-agent.md` | Articles to scripts to videos and posts, drafts only, token cost measured first |

## 1. What the repositories show for 27 Oct to 2 Nov

Read on 2026-11-02 from GitHub (main branches) and, for Global Link+, from the organisation's repository list in your signed-in browser. Names and counts only.

| Repo | Commits in the window | What happened |
|---|---|---|
| umwayi-rm | 127 (16 on 27 Oct, 55 on 28 Oct, 50 on 29 Oct, 5 on 30 Oct, 1 on 31 Oct, none on 1 or 2 Nov) | Created 27 Oct. Plan v3 docs the first day. By 29 Oct: ledger, Today, agent loop and MCP server, voice and photo intake, proposals and edit, console and Lab, H1 and H2 runs saved, verification trails, 122 tests passing locally, 18 Postgres tests in CI. 18 PRs merged. Last merge 31 Oct 16:35 (council fix batch). Open: video, interviews, Discord question, submit |
| UMWAYI | 4 (28 Oct, 2 PRs merged) | Hackathon project file, "A Folder Is Not a Brain" draft, journal of 27 Oct, chama decision |
| routine-machine | 0 | Nothing since PR #12 on 26 Oct. The landing page task of 29 Oct has no branch or commit |
| miguel-site | 0 | Nothing since 26 Oct |
| Invoice-Financing | 0 | Nothing since 26 Oct |
| Global Link+ (17 repos, 15 private) | commit lists read 2026-11-03 with permission | 4 repos had commits in the week; none authored by `Miguel-Shinyenyi`. Detail in the private file `journal/weekly-summaries/work-repos-inventory-2026-11-02.md`. Code not opened |

Journals for 28 Oct to 2 Nov did not exist in the hub. Drafts are in `journal/entries/`, built from your notes and the table above.

Also noticed: the routine-machine folder on your Mac is on the branch `move-status-log-to-docs`, which was merged on 26 Oct. Its local `main` is behind origin.

## 2. What changes in each project

| Project | Change |
|---|---|
| UMWAYI | New: principles, map, plans, journal drafts, raw notes (encrypted). Edited: `CLAUDE.md`, `MASTER_CONTEXT.md`, `queue.md`, `SYNC_LOG.md`, `projects/hackathon.md`. The upgrade to the Steward follows `steward-agent.md` |
| routine-machine | A block for `CLAUDE.md` (branch and PR rule, principles pointer). Task L-02: landing page on GitHub Pages. Later: the verification service and model gateway for the intelligence service, per the Shepherd report of 31 Oct |
| miguel-site | A block for `CLAUDE.md`. No content change |
| umwayi-rm | Do not change code except what you choose from `final-48h-packets.md`. Everything else waits until after submission |
| Global Link+ repos | Read-only scope in the Steward plan. Miguel stated on 2026-11-03 that he holds permission. A written record naming the model vendor and data class is still missing |

## 3. Counter arguments, risks and the council

You asked me to challenge the plan [L55]. Three lenses reviewed the plans: scope, security, agent design. Scores and opinions are model output, not data.

Three counter arguments against doing this bundle:
1. Duplication. Claude Code hooks, permissions, skills and MCP, and your own umwayi-rm code, already cover much of the kernel, tool gateway, verification and audit layers. Building them again may produce infrastructure with no new capability.
2. Weak link to your goals. A personal operating system serves one user and publishes no measured result until late. A CMU application and AI engineering roles reward public, measured work. The social agent's value and cost are unmeasured.
3. Capacity. About 21 hours a week beside a day job covers two or three stages in two weeks. Many facts are still unverified (Rust libraries, mutation tools, the AIOS code licence, platform terms, the Remotion licence). The calibration needs weeks of use.

What the council advised (scope lens, confidence about 75 percent):
- Do the minimum slice: stage 0 of the OS plan, the two small umwayi-rm fixes, stage 1 as hooks and permissions, Steward S1 and S2, and S3 only if S1 and S2 prove useful. Publish one article with real numbers.
- Postpone the social agent, the decision gate, the model gateway, the Rust port and the work scope.
- First 14 days after Nov 4: submit and rest; stage 0 and the fixes; the policy file and hooks, testing whether hooks alone cover the kernel; the digest tested against the counts in section 1; the journal draft; then decide from evidence.
- Ask Global Link+ the AI-policy question now, because the answer takes time.

What the council advised (security lens, confidence high on the first three risks):
1. Prompt injection into an agent that can open pull requests. Add a rule: fetched content is data. Never put decrypted journal text and fetched content in one session. PRs only to allowlisted repos and branch prefixes, with a diff size cap. Run a planted-instruction test before S6.
2. Work scope rests on a promise. Settle written employer permission naming the vendor and data class, and the rule that nothing derived from work repos enters the hub. Keep work tools out of the default MCP configuration.
3. Journal leak paths. Add a CI scan that fails if decrypted journal text appears in a public path, and a test that every journal path is marked encrypted.
4. The split of command and network is weakened by fetch and PR tools that take model-chosen arguments. Add an egress allowlist, size limits and a secret scan on outbound content.
5. The social agent: read platform terms and AI-labelling rules before posting; add an "AI-assisted" field to the post log; check proper nouns against a blocklist.

Your project doc `secrets/umwayi-journal-key.md` holds the journal key in the claude.ai Project. Anything attached to that Project can read it. Move the key to a password manager or the system keychain, and do not give agents the Project.

What the council advised (agent design lens):
- "Zero hallucinations by deterministic code" is unsupported. Zero unapproved actions is supported. Zero unchecked claims is only as strong as the checker, so test it with 20 seeded answers that have real citations and false conclusions.
- The fast and slow gate is plain routing and is fine. The confidence weights and thresholds are guesses, and 30 decisions are too few to set them. Compare the score with a yes or no on whether all checks passed, and keep whichever predicts defects better.
- Deterministic checks first is supported. The different-family judge and cross-model audit are plausible. Keep only the arms that add catches on seeded defects.
- The layered design is over-built for one user. Run four weeks on hooks and an audit log first.
- Strict TypeScript first is sound. Port to Rust only if seeded illegal-state bugs escape.
- Three failure modes remain: approval fatigue, cited but wrong answers with correlated judges, and injection through permitted reads. Changes are in sections 4, 5, 7, 8 and 9 of `ai-operating-system.md`.

## 4. Recommended order (replaces the build orders inside the plans where they differ)

| When | Work |
|---|---|
| Now to Nov 4 | Hackathon only. Optional: H-21, H-23 from `final-48h-packets.md`. Send the employer question |
| Nov 5 to 7 | OS stage 0 (branch protection, rules in each CLAUDE.md). umwayi-rm port and key fixes if not done. Landing page task if you still want it first |
| Nov 8 to 12 | OS stage 1 (policy file and hooks). Test whether hooks cover stage 2 |
| Nov 13 to 17 | Steward S1 and S2 |
| After | Decide S3, stages 2 to 6 and the social agent from evidence. Run the video cost measurement (V1) when there is a free hour |

## 5. Open decisions

D-15 where the reading list lives; D-16 employer permission for work code; D-17 where the journal key lives; D-18 confirm the ambiguities in `agent-principles.md` section 15. They are in `queue.md`.

Shepherd answers (2026-11-03): D-19 app for other users, D-20 Qloo as a separate feature, D-21 Baseten first with Modal and Fireworks as alternates. D-11 and D-12 are deferred by Miguel to later.
