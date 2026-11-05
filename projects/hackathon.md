# Meta Global AI Developer Hackathon: Umwayi-RM

Started 2026-10-26. Miguel joined the Meta Global AI Developer Hackathon (Cerebral Valley), Indie Developer track, problem statement "Build for Your World". The build lives in its own public repository, `umwayi-rm`, created for the event. This file is the hub's summary. The plan is in that repository's `HACKATHON.md`.

## Rules that shape it

Read on 2026-10-26 from the signed-in Participant Guide and Official Rules.

- New work only. The demo may show only what is built from Oct 27. No code from Routine Machine is reused.
- The repository must be public. A three minute video is a primary judging artifact.
- Submissions are due Nov 4, 9:00 PM ET (Nov 5, 05:00 in Nairobi). Late entries are not considered.
- Judging: Impact 30%, Meta tooling 25%, Technical depth 20%, Demo 25%.
- The sample anti-project list includes a job application screener, personality analyzers, simple AI for Education chatbots and basic RAG applications.
- Models must be Meta models. Baseten requires the id `meta-models/muse-spark-open-1026`.

## The pivot (2026-10-26)

The first plan (Oct 24) sold a retention-risk signal on candidates to employers and used AI for one sentence per item. It sat next to two anti-projects and scored low on Meta tooling. Plan v2: an open-source follow-through agent for community training programmes. Code computes state. An agent reads records through tools and proposes events, commitments and follow-up drafts. Staff approve everything. No risk scores on people. Superseded by plan v3 on 2026-10-27 (below).

## How it connects to the other projects

- Routine Machine: same follow-through idea, moved to programme staff. Design token values and ideas are borrowed. Code is not. Decision D-1 on the Routine Machine direction is not settled by this.
- Hub method: the queue, short context and archive with an index are reused in the new repository.
- Open source: the repository is public and licensed (MIT, decided 2026-10-28, D-10).

## Direction chosen (2026-10-27): savings-group secretary agent, plan v3

Miguel picked option 1 of D-14. The product is an open-source secretary for savings groups (chamas). A treasurer speaks a note or photographs a paper ledger page. The agent proposes ledger entries and asks when a note is ambiguous. Code owns the ledger, balances and reconciliation. The treasurer approves everything. Nothing is sent, no money moves, no member is scored.

His restraint and archive ideas are tested inside it, with a protocol committed before any run (`umwayi-rm/docs/experiments.md`): H1 curated rules against a generic "ask when unsure" block and a placebo; H2 core plus traceable archive against truncation and plain retrieval; H3 rules after compaction as a stretch. Small samples; null results get reported. Findings behind this are in `site/tech/a-folder-is-not-a-brain-until-you-measure-it.md` (draft).

How the other projects feed it: Routine Machine's granary (statement import, month targets) supplies the concepts of evidence tiers and statement matching, rebuilt from scratch with synthetic statements. If the evidence tiers and restraint rules measure well, they are candidates to go back into the granary later. Invoice-Financing supplies idempotent approval and reconciliation as concepts.

Facts to hold lightly: existing chama apps exist (Chamasoft, M-Chama, Fundi Chama, a Postbank app); the Sh300 billion figure is a news report of a ministry statement. Notes in `umwayi-rm/docs/research/chama-landscape.md`.

Things to verify: the "Built with Muse Spark Open" display requirement (press coverage only; the primary licence text was not read, see the 2026-10-28 H-04 entry in the repository log), and Swahili drafting quality (one reader judged it, not a metric).

## Open decisions

- Answered: stack is one TypeScript service (D-9, 2026-10-28); licence is MIT (D-10, 2026-10-28); no interviews will be done, so the problem stays a hypothesis (D-11, 2026-11-03); 3 to 4 hours a day from Nov 1 (D-12, 2026-11-03).
- Pilot: one savings group for a month is the ask. No group is lined up.

## Open questions

- Is a savings-group ledger agent clear of "basic RAG" and "simple image analyzers"? To be asked on the hackathon Discord (H-03 in the repository queue, not recorded as answered).
- Does Muse Voice handle Kenyan names? Observed on 2026-11-04: it heard Kiptoo as "crypto" and "dipto". The agent asks instead of guessing; the transcription is not fixed.

## Status (2026-11-05, from the repository and the conversation)

Built, public and deployed: `umwayi-rm` (TypeScript, Express, Postgres, MCP server, Baseten adapter, Muse Voice Transcribe, console, Lab page). Live demo with synthetic data: https://umwayi-rm.vercel.app (Vercel plus Neon, demo mode, per-visitor reset, rate limits). Demo deck in `docs/` (umwayi-rm-demo-v2.pdf and .pptx). The README links the demo video.

Counted results (synthetic data, frozen test split, run files in `docs/evals/`):

- H1, three seeds (7, 8, 9), 40 scenarios each. Wrong proposals on ambiguous notes: curated 0 of 48, generic 0 of 48, placebo 0 of 48, bare 7 of 48. Clear notes passed, out of 72: curated 67, placebo 55, generic 24, bare 23. Primary metric (curated against generic on wrong proposals) is a 0-point gap, so H1 is not supported. About three quarters of the gain comes from prompt length, not content.
- H2, seed 7 only, 20 questions. Rescored: truncation 13, plain retrieval 20, archive 19, full context 20. Archive used 6.2 times the retrieval prompt tokens. H2 is not supported. The rescored figures are in `docs/evals/h2-seed7-analysis.json`; the Lab page charts the raw run files (archive 17, full context 19, plain retrieval 19), so the pitch and the Lab differ by design, and the Lab has not been updated.
- Interviews: none, by decision. Every document says the problem is a hypothesis.

Built between Nov 3 and Nov 5 (pull requests in `umwayi-rm`): #20 both spellings of the Baseten key; #21 Vercel deploy, guards and roster names; #22 findings and ledger entries shown in words, empty reply warning, tunable `MODEL_MAX_TOKENS`; #23 default cap raised from 600 to 2000, server error logging, migration 007 so demo purges can cascade to the append-only entries table, live URL and deck in the README; #24 claim check uses the shared cap and tolerates fenced JSON; #25 claim prompt accepts first names and month names that match the roster; #26 demo video link in the README; #27 first-visit walkthrough tour in the console.

Why #23 to #25 happened: on the live site, Reset returned "internal error" because the append-only trigger blocked the purge cascade. Model replies came back empty because reasoning tokens count toward `max_tokens` and the caps were 600 and 200. The claim check then rejected first-name quotes. Each was found by testing the live site, not by the test suite.

Demo video: 2:43, uploaded to YouTube by Miguel (https://www.youtube.com/watch?v=ohYcxH72vBA), re-rendered once at higher resolution with the group id and token blurred.

Submission: form answers were drafted on 2026-11-05. Whether the form was submitted before the deadline: [fill in]. Survey answers on Muse Code and model comparison are Miguel's own.

Known issues, not fixed: unsupported or oversized audio returns a 500 on the intake endpoint instead of a 4xx; Muse Voice mishears Kenyan names; the video says about 22 percent of Kenyans save through groups where FinAccess 2024 says 19.7 percent; the Lab page shows raw H2 numbers; Baseten and Meta spend caps are not confirmed.

Next: find one pilot group for a month and ask treasurers for feedback; patch the 500 on bad audio; update the Lab page to the rescored H2 figures; read the primary model licence for the display requirement.
