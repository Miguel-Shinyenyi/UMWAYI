# docs/core-rules.md: questions to ask on every project

Added 2026-11-04. These apply to every project and every agent. Ask them out loud before building.

## 1. Are we using each tool's strengths, or rebuilding it?

Before implementing any feature, answer in one line each:

- What already does this? (Claude Code plan mode, hooks, permissions, subagents, plugins, MCP servers, GitHub features, a library, a hosted service.)
- What does that tool do well, and are we using that part?
- What is the gap it leaves? Build only the gap.
- Example: Claude Code plan mode already plans before it acts. Our queue sits on top of it. The queue decides order and budget; plan mode does the planning inside each task.

If the answer is "we rebuild it", write why in the decisions log before writing code.

## 2. Did the council see it?

Use the Claude council for decisions and to review my own answers. Vary the models (Opus, Sonnet, Haiku, and Fable when credits allow). Record which models ran. A council of Claude models reads the same brief, so it is not independent evidence. Say so each time.

## 3. Are we going live?

Ask before any project goes live: "Are we actually going live?" If yes, run the security gate in `docs/pre-launch-security.md` first. Security comes before launch polish.
