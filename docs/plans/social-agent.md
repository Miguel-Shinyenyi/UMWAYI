# docs/plans/social-agent.md: social media agent

Status: plan, 2026-11-02. Nothing here is built. Source instructions: [L2, L22, L68, L70] in `docs/agent-principles.md`.

## 1. What it does

Assisted content creation and content management:
1. Reads my site articles and journal-derived notes that I have cleared for publishing.
2. Proposes posts and short videos, each with a script, imagery and analogies [L22, L68, L70].
3. Keeps a content calendar and a record of what was posted, from which article, and what each said.
4. Drafts only. I approve every post. At first nothing posts without me pressing the button.

Content rules already in force from the hub, enforced by code where possible:
- No company names I applied to or interviewed with. Global Link+ may be named. This article series may name Muse Spark Open and the hackathon.
- No em dashes. The banned word list from my writing preferences.
- Article takeaways stay `draft: true` until I review them.
- At most two articles relay the same point.
- Journal excerpt publication is on hold, so no journal text is used.
- A claim needs a source or a stated measurement.

## 2. The pipeline

1. Pick: an article I have published. Deterministic check that it is public and approved.
2. Grill: the agent restates what the video should achieve and who it is for, and asks me until I agree [L38]. A win looks like: one idea a viewer can state back after 90 seconds.
3. Script: about 150 words per minute spoken. Scenes with one picture each, one analogy, real examples from the project.
4. Check: deterministic (rules above, word count, links, claims have sources), then judge, then me.
5. Render: scenes drawn by code to full-size frames, rendered with ffmpeg on my machine or in this cloud workspace (ffmpeg is installed here). Narration comes from a text-to-speech tool or my own voice. I have not chosen one and did not verify any.
6. Review: I watch it. Fix by scene, not by a full re-render.
7. Post: manual at first. A later step may use platform APIs. Their terms and posting limits were not checked.
8. Log: record the post, the date, the source article, and the measured reach if I choose to look.

## 3. Token use and the Pro plan [L22, L70]: how to find out

What I know and what I do not:
- A video is not made by a language model alone. Language model tokens go to the script and the scene-drawing code. Rendering with ffmpeg runs on a computer and uses no model tokens. Images drawn by code cost tokens as code. Images from an image model, and speech from a speech model, are separate services with their own costs. I chose none of them.
- My estimate, not measured: a three minute video needs about 450 spoken words, roughly 600 to 700 tokens for the narration. Scene code and revisions are the larger part: I would guess 15 to 40 thousand output tokens for a first video, more if the scenes are re-drawn. Treat this as a guess to be replaced by a measurement.
- Pro plan: Claude Pro has a five hour session limit and a weekly limit shared with Claude Code. Anthropic does not publish a fixed message count. What a task uses depends on message length, attachments, conversation length, the model and the effort level. This is from a third-party guide updated 2026-10-18. I could not open Anthropic's own help page, so verify in Settings, Usage.
- So I cannot say whether it fits your plan. The measurement: note Settings, Usage; make one 60 second video from one short article with the agent; read Settings, Usage again. Repeat with a three minute video. That gives the real cost in your own limits, and tells you how many videos a week fit.

Open: whether to use the open-source tool Remotion for scenes. Its licence has conditions for companies. I could not open the licence page, so check before use. Plain ffmpeg with scenes drawn by a script has no such question.

## 4. Safeguards

- Class C actions (publish, post) are never autonomous [`docs/plans/ai-operating-system.md` section 4].
- The agent holds no social media credentials. If an API is used later, a scoped token sits in the keychain, not in the working directory.
- Private material is excluded by a deterministic allowlist: only files under `site/` with `draft: false` can be used.
- Comments and replies are not handled by the agent in version one.
- The post log has an "AI-assisted" field, filled per platform rules once I have read them. Proper nouns in every script are checked against a blocklist, because a published article can still carry details that do not belong in a video.
- Posting is the last thing built. The council advised postponing this agent until the Steward's first steps prove useful.

## 5. Build order

After Nov 4 and after the Steward's steps S1 to S2.

| Step | Work | Acceptance checks |
|---|---|---|
| V1 | Measure token cost of one 60 second video by hand, as above | Numbers written in the log with the Usage screens described |
| V2 | Rule checker for posts and scripts | Seeded violations (an em dash, a company name, a missing source) are all caught |
| V3 | Script generator with the grilling step | I agree the restatement before a script exists |
| V4 | Scene renderer: script to ffmpeg video | A 60 second video renders from a script file; one scene change renders one file |
| V5 | Content calendar and post log | Every post links to its source article |
| V6 | Optional posting through an API, with approval each time | Terms read first; a dry run posts nothing |

## 6. Risks

- Reach and value are unknown. I have not looked at who reads the site. PostHog consent work is still open.
- Video quality from code-drawn scenes may look plain. Test one before building more.
- Reposting articles as video repeats the same point. The two-articles rule covers this, but check it in code.
- Platform terms, automation limits and any labelling rules for AI-assisted content were not checked.
