---
title: "This website"
date: 2026-09-18
updated: 2026-09-23
summary: "The site you're reading: a static Astro site with a shepherd theme, its content kept as markdown in UMWAYI and rebuilt on every change."
draft: false
status: "Live"
statusVariant: success
category: "Personal site"
stack: ["Astro", "Tailwind CSS", "daisyUI", "GitHub Pages", "Waline"]
link: "/projects/personal-website"
linkLabel: "How it's built"
links:
  - label: "View on GitHub"
    url: "https://github.com/Miguel-Shinyenyi/miguel-site"
  - label: "Visit the site"
    url: "https://miguel-shinyenyi.github.io/miguel-site/"
illustration: personal-website.svg
illustrationAlt: "A browser window over the field. Inside it, the shepherd and a sheep from the homepage, drawn smaller, with a thought bubble that reads: in public."
---

## What it is

A place to understand things in public: philosophy, technology, and the daily work of paying
attention to how I think and work. Umwayi means shepherd, so the whole site is drawn around
one: a shepherd leaning on his crook, thinking, with his sheep nearby.

## How it's built

A static Astro site on GitHub Pages, styled with Tailwind CSS and daisyUI, with guest
comments through Waline. The content doesn't live in the site's repo. Articles, project pages,
illustrations, and the Now section are markdown files in UMWAYI, pulled in at build time, so
updating the site means editing one markdown file in the hub.

## How it got here

The design changed three times in its first week: a quiet, literary first version, a bolder
revision with a mascot, then a full redesign around the illustrated shepherd. Every round was
checked the same way: build it, render it at phone and desktop width, measure it, and look at
the screenshots, not the code. That's how the real mobile bugs were found, and how the first
mascot was caught looking flat before anyone said so.

## What I took from it

1. Check a design by rendering it and looking, not by reading the CSS.
2. Record every design reversal with its reason instead of overwriting the old decision.
3. Keeping content in plain markdown, apart from the code, makes it easy to change.