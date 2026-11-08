# AI OS after layer 8: work with any AI CLI

Source: your note of 2026-11-08. The AI OS should not depend on one vendor. After layer 8 it should work with the CLI of any AI platform, including Kiro. Later it can run its own CLI and chat, and offer the Linux-like features it needs. Rule: use what already exists. Do not rebuild it.

Status: a hypothesis until the official hook docs are read. The match below comes from a third-party reference and one Kiro page that does not state exit codes.

Fail-open warning: on Claude Code, exit 1 blocks nothing. An adapter that crashes with an unhandled error would let the action through. Every adapter must catch all errors and exit 2 (or answer deny). Fix the exit codes in the core first (exit 64 for config errors).

## Why this fits what exists

The check command already behaves like a hook. It reads one action as JSON, answers Yes, No or Ask me first, and uses exit codes 0, 2 and 3.

- Claude Code hooks: a PreToolUse command hook receives JSON on stdin. Exit 2 blocks the call and sends stderr back to the model. Exit 0 with JSON `hookSpecificOutput.permissionDecision` of allow, deny or ask is read. Exit 1 blocks nothing. (Source: a third-party reference, to confirm on the official docs.)
- Kiro hooks: JSON files in `.kiro/hooks/` with a trigger such as PreToolUse, a matcher, and an action of type command. The command gets session context as JSON on stdin. The page I read does not say which exit code blocks a call. Confirm on the Kiro hook actions page before building.
- ACP (Agent Client Protocol): JSON-RPC over stdio between an editor and a coding agent. Candidate for the later chat layer.

## Layers

| Layer | What | Reuse | Not built |
|---|---|---|---|
| 9 | Adapters: a thin script per platform turns its hook JSON into `umwayi check` input and turns the verdict back into that platform's allow, deny or ask. Targets: Claude Code, Kiro, a generic stdin and stdout adapter. | Each platform's own hook system | A new agent loop |
| 10 | Own CLI and chat: one front door that starts any agent through its CLI or ACP and keeps the queue, rules and logbook in front of it. | ACP, the platforms' own CLIs, a terminal UI library if one is allowed | A new model client |
| 11 | Linux-like features: scheduling, file watching, process limits, a small database, terminal sessions. | cron or systemd timers, inotify, SQLite, tmux, Unix permissions, bubblewrap or containers | A new scheduler, a new file system, a new shell |

## Decisions for you

1. Decided 2026-11-08 (yes): adapter packages may break the standard-library-only rule. The core stays standard library only. Packages are allowed only in separate adapter packages, each pinned and listed in its own README.
2. Ask me first maps to ask on Claude Code. On a platform with no ask, should it map to deny with a queue item?
3. Do adapters run inside the repo or ship as separate small packages?

## Check before building

- Official Claude Code hook docs: exact input fields and output schema.
- Kiro hook actions and hook types pages: exit codes and blocking.
- Whether each platform lets a hook see the tool name, the arguments and the working directory.
- A test per adapter: No blocks, Ask me first asks or denies, Yes passes, a broken rules file blocks, a crash blocks.
