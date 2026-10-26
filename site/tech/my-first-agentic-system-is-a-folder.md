---
title: "My First Agentic System Is a Folder of Files"
date: 2026-10-26
summary: "The UMWAYI hub is plain markdown that an AI reads before it works. It holds the rules, the log and the backlog, and it changes how every other project of mine gets built."
draft: false
tags: ["AI", "Documentation", "Engineering", "Claude Code"]
illustration: my-first-agentic-system-is-a-folder.svg
illustrationAlt: "A board lists three files: master context, sync log and backlog. The first is highlighted. A sheep tagged AI waits on the left and the shepherd on the right says read first."
---

## What it is

The UMWAYI hub is a git repository. It started on 2026-09-16 and has 72 commits. It holds no application code. It holds markdown files: a master context, a journal, a backlog, one file per project, and the content of my website.

I call it my first agentic system. Here is what I mean. An AI agent reads these files before it does any work. It uses tools to read other repositories, run builds and write files. I read what it hands back and apply it. The files are its memory, its instructions and its record.

It is not autonomous. The agent cannot push to any of my repositories. I do that.

## What is in the files

`MASTER_CONTEXT.md` is about 3,100 words. It holds who I am, the method, and the standing principles for how the agent works with me. It also holds 13 rules that each exist because something went wrong once.

`SYNC_LOG.md` has 31 entries. Each one says what a session used as its source, which files it changed, what moved, and how confident the agent is in what it checked.

`backlog.md` holds every open question and pending action across all projects. An item gets marked answered with a date. It is never deleted.

Each project has its own file under `projects/`. Each repository has a `CLAUDE.md` that tells a coding agent which files to read first, in what order, and which rules already apply.

## A rule is added after a failure

I do not write rules in advance. I add one after something specific breaks. Four examples:

- On 2026-09-20 a session was dated 09-19 because the agent inferred the date from the last entry. The fix was a rule: confirm the actual date before dating anything.
- On 2026-09-22 long files printed into the chat came through cut off. The rule: write long documents to a file and send the file.
- On 2026-10-09 a replacement project page came back with no front matter. The site build rejected it, and two articles stayed offline until I restored it. The rule: run the build with the file in place, and keep the live front matter.
- On 2026-10-19 the file for the Routine Machine project went into the website's folder instead of the hub's. The public page then held text meant only for the hub. We found it five days later, on 2026-10-26. The rule: name the destination again with every handover, and check where it landed.

The fourth one shows the limit. The rule did not exist yet, so nothing stopped it. A written rule closes one kind of failure after the failure has happened.

## How it reaches the other projects

The hub does not stay in its own folder.

- The website reads from it. The `miguel-site` repository clones the hub's `site/` folder at build time. A push that touches `site/` rebuilds the site. Writing an article means editing a file here.
- Routine Machine reads from it. Its backend checks the hub every 15 minutes. A journal file with today's date counts as journaling done. A new file under `site/philosophy/` or `site/tech/` counts as writing done. A `Current book:` line feeds the reading tracker. Two repositories now depend on one line of text, so the rule says the template and the code that reads it change together.
- Each of my three code repositories carries a `CLAUDE.md`. Each one copies the same short section from two hub files: one on understanding AI output before you keep it, and one with 111 backend concerns, each answered applies, not applicable or deferred. A copy can drift from the hub, so the section links back to the files.
- Open source work follows a process written in the hub. It says I read the live thread first, check open pull requests, and post and open them myself.
- The settlement engine restudy, the career notes and the application plans each have a file. The agent reads only the file for the project it is touching.

Because of this, a rule written once in the hub can reach every repository. It gets there only when someone copies it into that repository's `CLAUDE.md`.

## Where it is weak

- A file works only if it is read. I cannot see the agent read it. I can only see what it produces.
- Status files go stale. The website plan and the settlement engine file both lagged the real work for days. I found out when I pointed at them.
- The hub is public. Anything private has to go in the encrypted journal, and I have to remember that each time.
- Rules multiply. Thirteen caught-mistake rules are readable. Fifty would not be.
- Nothing checks the rules automatically, except where a build or a test happens to cover one.

## What I took from it

1. Put the agent's memory in plain files you can read, edit and diff.
2. Add a rule after a failure, and write down what failed. The reason keeps the rule from being pruned later.
3. Tell the agent what to read first, in order, and keep the list short.
4. Check where every handover landed. A file in the wrong folder looks the same as a file in the right one.
5. A shared set of files links your projects. Say which parts of each project depend on them.
