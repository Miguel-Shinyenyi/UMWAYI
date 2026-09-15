# Context Hub

This repo is the single source of truth for Miguel's journaling practice and the projects it feeds.

## Structure

```
context-hub/
├── MASTER_CONTEXT.md        <- the hub. Start here every time.
├── SYNC_LOG.md              <- record of what moved from journal to which project, and when.
├── journal/
│   ├── TEMPLATE.md          <- the daily entry template.
│   ├── entries/             <- one file per entry, named YYYY-MM-DD.md.
│   └── weekly-summaries/    <- one file per week, written from that week's entries.
├── projects/
│   ├── career-prep.md       <- Ezra application, interviews, other target roles.
│   └── settlement-engine.md <- the portfolio fintech project.
├── website/
│   └── PLAN.md              <- design and content plan for the personal site.
└── articles/                <- weekly published pieces, drafted here before going to Hashnode, dev.to, Medium, LinkedIn.
```

## How the sync works

Miguel journals in `journal/entries/`. When an entry contains something that clearly
belongs in a project (a decision, a technical insight, a pattern about how he works,
a step taken), that project's file gets updated and the move gets logged in
`SYNC_LOG.md`. Nothing gets pushed to a project on a maybe. It has to be a clear match.

## What MASTER_CONTEXT.md is for

It is not a summary of everything. It is the index and the principles.
It says what each spoke is, why it exists, and points to the right file.
When it goes stale, that is a signal something in this structure needs fixing.
