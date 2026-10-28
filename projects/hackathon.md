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
- Open source: the repository is public and licensed (MIT proposed).

## Direction chosen (2026-10-27): savings-group secretary agent, plan v3

Miguel picked option 1 of D-14. The product is an open-source secretary for savings groups (chamas). A treasurer speaks a note or photographs a paper ledger page. The agent proposes ledger entries and asks when a note is ambiguous. Code owns the ledger, balances and reconciliation. The treasurer approves everything. Nothing is sent, no money moves, no member is scored.

His restraint and archive ideas are tested inside it, with a protocol committed before any run (`umwayi-rm/docs/experiments.md`): H1 curated rules against a generic "ask when unsure" block and a placebo; H2 core plus traceable archive against truncation and plain retrieval; H3 rules after compaction as a stretch. Small samples; null results get reported. Findings behind this are in `site/tech/a-folder-is-not-a-brain-until-you-measure-it.md` (draft).

How the other projects feed it: Routine Machine's granary (statement import, month targets) supplies the concepts of evidence tiers and statement matching, rebuilt from scratch with synthetic statements. If the evidence tiers and restraint rules measure well, they are candidates to go back into the granary later. Invoice-Financing supplies idempotent approval and reconciliation as concepts.

Facts to hold lightly: existing chama apps exist (Chamasoft, M-Chama, Fundi Chama, a Postbank app); the Sh300 billion figure is a news report of a ministry statement. Notes in `umwayi-rm/docs/research/chama-landscape.md`.

Things to verify: the "Built with Muse Spark Open" display requirement (press coverage only), and audio, image, tool-calling and Swahili capability (Day 1).

## Open decisions

- Stack: TypeScript service or Java and Spring Boot (queue D-9).
- Licence (D-10). Whether the problem is first-hand and who to interview (D-11). Hours available from Nov 1 (D-12). 

## Open questions

- Is a savings-group ledger agent clear of "basic RAG" and "simple image analyzers"? To be asked on the hackathon Discord.
- Can Muse Spark Open take audio and images, call tools and write Swahili at usable quality? To be checked on Oct 27.

## Status

Planning only. Plan v3 (savings-group agent), rules sheet, agent design, experiment protocol, API contract, demo script and submission text written on 2026-10-27. Plan v2 is archived in the repo. No code. Credits not yet requested (queue H-01).
