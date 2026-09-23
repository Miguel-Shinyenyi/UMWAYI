---
title: "Three questions, cold"
date: 2026-09-21
summary: "Explaining idempotency from memory: what problem it solves, how it works, what breaks without it. The third one took longest."
draft: false
tags: ["Learning", "Idempotency"]
illustration: three-questions-cold.svg
illustrationAlt: "A board with three numbered boxes: problem and mechanism are filled in, the third, what breaks, holds only a question mark."
---

## The method

The same test I used on database indexing: before looking anything up, answer three
questions. What problem does it solve? How does it work? What breaks if you take it away?

## How it went

My first attempt summarized the whole system at once, idempotency, outbox, the ledger,
scheduled jobs, without connecting any of it to a problem. I narrowed to idempotency alone.
The second attempt got the problem right (retries and double submits create duplicates) and
the mechanism right (a unique key per request). It only described the in-progress case,
though. It missed the real guarantee: a retried request that already finished gets back the
same result it got the first time.

The third question went unanswered twice, until I was asked to connect it to something I'd
already said. Then it came: untrustworthy data, meaning wrong balances and overdrawn accounts.

## The smaller gap

I remembered my first answer as more complete than it was. That's the same gap as the whole
exercise, only smaller: knowing something, and being able to say it when asked, are different.

## What I took from it

1. Answer one concept at a time, not the whole system.
2. "What breaks without it" is the question that shows whether I understand it.
3. Check what I actually said, not what I remember saying.