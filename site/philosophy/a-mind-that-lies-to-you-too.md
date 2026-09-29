---
title: A Mind That Lies to You Too
date: 2026-09-24T00:00:00.000Z
summary: >-
  Sapiens on the trade that let us out-think evolution, and why the same tool
  needs checking on yourself, not just on the world.
draft: false
tags:
  - Sapiens
  - Cognitive bias
  - Self-observation
illustration: a-mind-that-lies-to-you-too.svg
illustrationAlt: >-
  The shepherd studies a mirror. The reflection holds a second staff and points
  back.
crossposted:
  devto: 'https://dev.to/miguel_shinyenyi_e2291c8c/a-mind-that-lies-to-you-too-1h69'
---

## What sapiens traded time for

Every other species that reached a new environment got there the slow way: fins, blubber, a
nose built as a snorkel, millions of years of the body itself changing to fit the place. When
sapiens reached Australia, the body that arrived was the same one that had walked out of
Africa. No gills, no fur suited to a new climate. What made the crossing possible was a mind
good enough to understand the sea and build something that could cross it, in one lifetime,
not a species-length of them.

That's a real trade, not a free upgrade. Every other animal is capped by what its body allows
it to take from an environment. A mind with a plan has no such cap, and it showed almost
immediately. Sapiens gives the number: 23 of 24 Australian animal species over 50kg were gone
within a few thousand years of that crossing. The local megafauna had never seen anything
like this arrival and had no instinct to fear it. In Africa, animals evolved alongside early
humans for close to two million years and learned caution the slow way. Everywhere sapiens
reached quickly instead, that warning never had time to happen.

The same trade explains something closer to us than a wombat the size of a hippo. Before
sapiens spread, several other human species were alive at the same time, Neanderthals,
Homo erectus, others. Sapiens is the only one left. Whatever let a mind out-hunt giant
kangaroos also let it outcompete or eliminate every other kind of human. The mind that solved
the sea didn't stop at animals.

## The same tool turns on you

Here's the part that doesn't stay in the past. A mind capable of outthinking millions of
years of evolution is not automatically trustworthy about itself. The same faculty that plans
a boat also generates a justification for whatever you've already decided, and does it just
as fluently. It doesn't announce which mode it's in. A conclusion produced by looking at
evidence and a conclusion produced by protecting a belief you're attached to feel identical
from the inside.

That's not a flaw sapiens escaped by getting smarter. It's the same trade, still running. A
mind good enough to reshape a continent is also good enough to reshape your own account of
yourself, and it will do that for free, without being asked, unless something is actually
checking it.

## A short list for checking it

I've been trying to internalize a set of tools for exactly that, and grouping them, not as
ten separate items but as four jobs:

Catching a thought as it forms, and catching the pattern behind thoughts that keep repeating.
One is metacognition, the other is naming your own bias, and they're the same muscle aimed at
two grain sizes.

A test to apply once something's been caught: what evidence would actually prove this wrong?
If the honest answer is nothing, it's stopped being a belief and become something being
protected instead.

The same discipline aimed at feelings instead of thoughts: a feeling is real, but it isn't
automatically information about the world. "This feels like it will fail" is a fact about
right now, not a fact about the plan.

And a decision-making set for anything aimed outward: every choice costs the other choices
you didn't make, small repeated choices compound into large outcomes over time, and a good
decision can still produce a bad outcome, so judge the decision, not just how it turned out.

I don't know yet whether these four groupings hold up as anything more than a convenient way
to remember ten words. That's not settled here on purpose. It's a framework being tried, not
a conclusion being reported.

## One place it got tested this week

The clearest test so far wasn't abstract. I explained the ledger in this system's settlement
engine cold, described it as checked double-entry bookkeeping, the kind where a balance is
provable, not just trusted. Then I looked:

```java
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {
}
```

Nothing in the actual code ever read those entries back. The check I'd described as already
existing didn't exist. That's falsifiability doing its job in real time, not as a concept I
was reading about but as a belief about my own work that had a real, checkable answer, and
the answer was no. The honest move afterward wasn't to feel bad about being wrong. It was to
notice that the explanation had felt just as confident either way, right or wrong, which is
exactly the warning the concept is supposed to be. Confidence was never the signal. Whether
there was a way to be proven wrong was.

## What I took from it

1. A mind good enough to outthink evolution isn't automatically trustworthy about itself.
   That's the same trade, not a different one.
2. Confidence in an explanation isn't evidence for it. Whether it could be proven wrong is.
3. The four groupings are a framework being tested, not a conclusion. One real test this week
   went the way the framework predicts; that's one data point, not a pattern yet.
