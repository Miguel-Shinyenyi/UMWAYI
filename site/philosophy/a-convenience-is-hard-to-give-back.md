---
title: A Convenience Is Hard to Give Back
date: 2026-10-14
summary: >-
  Sapiens on the luxury trap, and a retry in code that shows the same shape: a
  small step that helps, then work you cannot stop doing.
draft: false
tags:
  - Sapiens
  - Systems thinking
  - Idempotency
illustration: a-convenience-is-hard-to-give-back.svg
illustrationAlt: >-
  The shepherd stands at a one-way sign with an arrow. Past it, a stack of
  crates labelled callers stands beside a sheep. The shepherd asks if he can
  take the retry back.
---

## The claim, as I understand it

This is my understanding of the "luxury trap" passage in Sapiens. It is not a checked account
of the text.

As I read it, farming was not given up because each change was small. A bit more grain, a bit
more settling, spread over many generations. By the time the cost showed, nobody remembered
another way to live. The extra food had already become the number people lived on.

My own observation, not the book's: the same thing happens now. A convenience arrives, it
becomes normal, and then it brings work of its own. Email saved time. It also made people
answer faster, and many of us now feel behind on it all day.

## Three parts, as I see them

1. Each step is small and it helps. Nobody argues against it.
2. The step becomes normal, and other things get built on it.
3. Going back now costs more than staying, so it does not happen.

My earlier piece on the farming chapter asked what a measure counts and what it leaves out. This one
asks something else: why nobody steps back once the cost is visible.

## The same shape in code

A payment call sometimes times out. Adding a retry is one small step. Callers stop handling
timeouts and the code gets shorter. This is a toy, run on one machine, with the reply lost
exactly once:

```java
static String withRetry(Supplier<String> call, int attempts) {
    for (int i = 1; ; i++) {
        try {
            return call.get();
        } catch (TimeoutException e) {
            if (i == attempts) throw e;
        }
    }
}

Gateway plain = new Gateway();
String r1 = withRetry(() -> plain.charge(null, 5000), 3);
// Retry, no key:   receipt=R2 charges=2
```

The first call moved the money and lost the reply. The retry moved it again. The customer was
charged twice, and the convenience caused it.

The fix is a key made once and sent on every attempt. The server remembers it:

```java
Gateway keyed = new Gateway();
String key = UUID.randomUUID().toString();   // made once, reused on every retry
String r2 = withRetry(() -> keyed.charge(key, 5000), 3);
// Retry, with key: receipt=R1 charges=1
```

That fixes it, and it adds work. The server needs a place to store keys. Something has to
decide how long a key lives. A second request can arrive while the first is still running, so
a key needs a state. In the settlement engine I built, the design has those pieces: keys with
an in-progress and a completed state, and a scheduled sweep for the case where a process
crashed before it finished, which would leave a key stuck in progress. I am describing the design as it stands, not the order I built
it in.

Now take the retry out. Every caller has stopped handling timeouts. Every server is built to
expect repeats. Removing one line is not a one-line change anymore. That is the third part
above, in a place I can read.

## Where the comparison stops

The first farmers could not see where it led. I can see this one. I can read the cost in code
before I add the step, and I can choose.

That does not make the step reversible. It only lets me price it first. A habit I want to try
before adding any convenience: write down the work I will have to keep doing because of it,
and who will start depending on it.

## What I do not know

I do not know whether AI tools save me hours, or raise what I expect of myself in the same
hours. That is the luxury trap question, asked of my own week. I have a feeling about it, and
a feeling is not a measure. A test I have not run: log hours and output for two weeks, with
and without the tool, and compare.

Other limits. I have not checked the chapter's evidence. The email point is my observation.
The retry example is a toy with one lost reply. The link to the settlement engine describes
its design, not a history of how I got there.

## What I took from it

1. A convenience that helps today can add work you cannot stop doing tomorrow. Look for that
   work before you add it.
2. Small steps hide the cost. The first one is the cheapest time to price it.
3. Seeing the trap does not undo it. Reversing gets harder as other things depend on the step.
4. A feeling that a tool saves time is not a measure. Count the hours.