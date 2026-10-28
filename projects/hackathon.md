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

The first plan (Oct 24) sold a retention-risk signal on candidates to employers and used AI for one sentence per item. It sat next to two anti-projects and scored low on Meta tooling. Plan v2: an open-source follow-through agent for community training programmes. Code computes state. An agent reads records through tools and proposes events, commitments and follow-up drafts. Staff approve everything. No risk scores on people.

## How it connects to the other projects

- Routine Machine: same follow-through idea, moved to programme staff. Design token values and ideas are borrowed. Code is not. Decision D-1 on the Routine Machine direction is not settled by this.
- Hub method: the queue, short context and archive with an index are reused in the new repository.
- Open source: the repository is public and licensed (MIT proposed).

## Direction under review (2026-10-27)

Before the build window opened, Miguel went back to the aim behind the hub: a model curated to his perspective, with identity, rules from mistakes and restraint against eager execution, and an archive for memory growth. We researched it and ran a council review. The findings, with sources, are in `site/tech/a-folder-is-not-a-brain-until-you-measure-it.md` (draft). Short version:

- Eager execution and persona drift are measured. Human-written, short rules help a little. Model-written files can hurt. All cost tokens.
- Core memory plus archive already exists (Letta, Anthropic memory tool). It is not novel. A measured result on one open model can be.
- The human memory comparison motivates a design. It does not support one.
- Project options and their weaknesses are in queue decision D-14. Plan v2 stays in force until D-14 is answered.
- Licence note to verify: press coverage of Muse Spark Open says products using it must display "Built with Muse Spark Open". Check the model terms before the video.
- Capability note to verify: the plan and Baseten's docs say audio and image input work. One news report does not mention multimodal. Day 1 check.

## Open decisions

- Direction (queue D-14).
- Stack: TypeScript service or Java and Spring Boot (queue D-9).
- Licence (D-10). Whether the problem is first-hand and who to interview (D-11). Hours available from Nov 1 (D-12). Photo intake (D-13).

## Open questions

- Does a staff-facing agent for training programmes read as "AI for Education"? To be asked on the hackathon Discord.
- Can Muse Spark Open take audio and images, call tools and write Swahili at usable quality? To be checked on Oct 27.

## Status

Planning only. Plan v2, rules sheet, agent design, API contract, demo script and submission text written on 2026-10-26. No code. Credits not yet requested (queue H-01).
