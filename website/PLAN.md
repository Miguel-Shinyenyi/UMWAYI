# Personal Website

## Status

Live. This file was the original plan, written before any of it existed. Everything it once
asked as an open question has since been decided and built. The code and its design
documentation live in the site's own repo (`miguel-site`), `PROJECT.md` and `docs/`. The
content the site shows lives in this hub, in `site/` (see `site/README.md`), as of
2026-09-23. This file stays as a record of the starting point, not as the active plan.

## What was originally asked, and how it was actually resolved

- Visual design direction: resolved, then redesigned. First a deliberate tension between
  literary/essay writing and engineering documentation, then, on 2026-09-23, a full redesign
  around an illustrated shepherd (Umwayi means shepherd) from Miguel's own spec. See the site
  repo's `docs/design.md` for every revision and its reason.
- Site structure: resolved, sectioned by theme (philosophy, tech, journal, projects), not a
  single stream.
- Tech stack: resolved, Astro, static site generator, content-collection driven, deployed to
  GitHub Pages. Tailwind CSS 4 and daisyUI 5 since the redesign. Content is pulled from this
  hub's `site/` folder at build time.
- Publishing pipeline: resolved differently than originally planned. GitHub Pages only for
  the site itself. Hashnode, dev.to, and Medium cross-posting was part of the original
  intent but hasn't been built or set up; those accounts still don't exist. Carrd and
  Hashnode were explicitly dropped from the *site's own* deployment scope (see the site
  repo's `docs/publishing.md`), which is a narrower decision than dropping cross-posting from
  the hub's broader plan entirely, that broader question is still genuinely open, see
  `backlog.md`.

## Purpose, unchanged from the original

Not a portfolio in the generic sense. The site shows how self-understanding, philosophy,
current technology, and people/world understanding connect, and how that connection gets
used day to day.