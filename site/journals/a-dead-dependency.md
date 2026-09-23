---
title: "A dependency that was already dead"
date: 2026-09-20
summary: "Building guest comments on a service that turned out to be shut down, and what checking instead of trusting looked like."
draft: false
tags: ["Dependencies", "This website"]
illustration: a-dead-dependency.svg
illustrationAlt: "Two signposts at a fork. One is grey and crossed out; the sheep follow the other, freshly painted one."
---

## What happened

I built guest comments for this site on Cusdis and wired it into every article template.
Then it came up that Cusdis had been shut down: its repository archived, its hosted backend
offline since July. I checked that myself, against the project's own notice and several
outside sources, before undoing anything.

## The replacement, and its cost

I moved to Waline. Unlike the other comment tool on the site, Waline needs its own server
and database. That broke the site's no-backend rule, so I named it as an exception instead of
pretending it fit. I chose free hosting over sturdier paid options, on purpose, and wrote
that tradeoff down.

## One more check

The first deployment URL I got looked fine and wasn't: it redirected through a login page
instead of reaching the server. I only wired in the second URL after confirming it answered.

## What I took from it

1. Check that a dependency is alive before building on it.
2. When a choice breaks my own rule, name the exception.
3. Confirm an endpoint answers before wiring it in.