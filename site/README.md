# site/

Everything the personal site shows lives here, as plain files. The site's own repo
(`miguel-site`) holds only the code that renders it. At build time the site clones this folder
and copies it in, so changing the site means changing a file here and pushing.

A push that touches `site/**` (or the three project files the homepage reads open threads from)
triggers a rebuild through `.github/workflows/notify-site.yml`.

## Layout

| Path | What it is | Where it shows |
|------|------------|----------------|
| `philosophy/*.md` | Philosophy articles | Writing tab, `/philosophy/<slug>` |
| `tech/*.md` | Tech articles | Writing tab, `/tech/<slug>` |
| `journals/*.md` | Edited journal excerpts (not the raw entries in `journal/entries/`) | Writing tab, `/journal/<slug>` |
| `projects/*.md` | Project pages | Projects grid, `/projects/<slug>` |
| `now.md` | The Now section | Homepage |
| `links.md` | Profile links, in display order | Footer, "All articles" link |
| `illustrations/*.svg` | One scene per article or project | Above the article body |
| `images/profile.jpg` | Profile photo | Author line, author box, anywhere a portrait appears |
| `tools/illustrations.py` | Generates the illustrations | Not published |

The file name is the URL slug. Keep it lowercase with hyphens.

## Article front matter

```yaml
---
title: "Idempotency keys, under load"
date: 2026-09-21
updated: 2026-09-23          # optional, set when content changes
summary: "One or two sentences. Used on cards and under the title."
draft: false                 # true keeps it out of the build
tags: ["Spring Boot", "PostgreSQL"]
illustration: idempotency-keys.svg
illustrationAlt: "What the picture shows, in one sentence."
---
```

Read time is computed from word count at build time. Don't add it.

## Project front matter

Everything above, plus:

```yaml
status: "Deployed to staging"
statusVariant: success       # success | primary
category: "Fintech backend"
stack: ["Spring Boot", "PostgreSQL"]
link: "/projects/settlement-engine"   # where the homepage card goes
linkLabel: "Read the case study"
links:                       # shown on the project page; add as they come up
  - label: "View on GitHub"
    url: "https://github.com/Miguel-Shinyenyi/routine-machine"
```

A `url` that starts with `/` is a page on this site; the build adds the base path.

## Body rules

- Every article and project is split into `##` sections. The "On this page" contents list is
  built from them, so the first line of the body is a `##` heading, not a paragraph.
- Use `##` only. No `#` (the title is already the page's heading) and no `###` unless a
  section is long enough to need it.
- The last section is always `## What I took from it`, followed by a numbered list. The site
  renders that list as the numbered takeaway badges.
- Diagrams in code blocks stay at 40 characters wide or less so they read on a phone
  without scrolling sideways: one column, steps in order, no side-by-side threads. Real
  code can be wider; it scrolls inside its own panel.

## Illustrations

One scene per article, drawn from the article's own idea, in the reference design's style.
Add a scene to `tools/illustrations.py` and run it:

```bash
python3 site/tools/illustrations.py
```

It rewrites every file in `illustrations/`. The shepherd and sheep are the homepage SVG's own
shapes, reused, not redrawn. The SVGs have no border of their own; the site draws the frame,
rounded corners, and offset shadow around them.

## Links

`links.md` is front matter only: a `links` list of `label` and `url`, in the order the footer
shows them. The entry with `label: "Hashnode"` is also where the homepage's "All articles on
Hashnode" link points. Add, remove, or reorder here; the site needs no change.

## Now

`now.md` is front matter only: `working`, `reading`, `building`, `basedIn`, `updated`. Update
it when any of them change, at least monthly.