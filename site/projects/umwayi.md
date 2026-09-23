---
title: "UMWAYI"
date: 2026-09-18
updated: 2026-09-23
summary: "The hub behind this site. One master file holds my context. Journal entries update the projects they touch, and every sync is logged."
draft: false
status: "Live"
statusVariant: success
category: "Knowledge system"
stack: ["Markdown", "Git"]
link: "/projects/umwayi"
linkLabel: "Read about the hub"
links:
  - label: "View on GitHub"
    url: "https://github.com/Miguel-Shinyenyi/UMWAYI"
illustration: umwayi.svg
illustrationAlt: "An open journal in the middle of a field, with four paths running out to signposts for philosophy, tech, people and projects."
---

## What it is

UMWAYI means shepherd. It's the journal and hub this whole site is built around: a
plain-markdown knowledge system, not an app. One master file holds the current context across
every project (career prep, CMU, Routine Machine, the settlement engine), and daily journal
entries update whichever project they touch.

## How it feeds this site

It's the thing that makes "the journal is the hub" a literal, checkable claim rather than a
metaphor. This site's homepage pulls its open questions and open decisions straight from
UMWAYI at build time, and every article, project page, illustration, and the Now section are
markdown files in UMWAYI's `site/` folder. The site's own repo holds only the code that
renders them.

## What I took from it

1. One source of truth beats context scattered across tools.
2. A journal entry is only useful if it updates the thing it's about.
3. Log every sync, so the trail can be checked later.