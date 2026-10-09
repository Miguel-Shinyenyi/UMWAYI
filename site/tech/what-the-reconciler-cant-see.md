---
title: What the Reconciler Can't See
date: 2026-10-09
summary: >-
  Reconciliation fills gaps with evidence and hands conflicts to a person. But it
  only checks what its query returns, nobody is told when it finds a problem, and
  resolving a mismatch fixes nothing.
draft: false
tags:
  - Spring Boot
  - PostgreSQL
  - Reconciliation
  - Kafka
illustration: what-the-reconciler-cant-see.svg
illustrationAlt: >-
  The shepherd holds a lantern. Its light covers three sheep wearing REF tags.
  Two sheep stand outside the light, tagged with question marks.
---

## Explain it cold, then check

Same method as before: explain the subsystem from memory, then check it against the code.

My cold answer was this. Reconciliation is the last resort. When the system cannot settle a
payment on its own, it marks the payment UNKNOWN and pushes it to a place where someone is
alerted. That person looks, finds what went wrong, and either records an answer or edits the
data.

The code disagreed with that in three places. It also showed me a fourth problem I had not
thought to ask about.

## Unknown and conflicting are different problems

`ReconciliationService.runOnce` loads every settlement that has an external reference and
compares each one to the external system's own record. This is what it does with one:

```
look up the external record
  none, under 5 min   -> wait
  none, over 5 min    -> mismatch
  amount or currency
    differs           -> mismatch
  settlement UNKNOWN  -> adopt external
  both CONFIRMED or
    both FAILED       -> nothing
  anything else       -> mismatch
```

I had filed UNKNOWN under "needs a person". It does not. If the settlement is UNKNOWN and the
external record agrees on amount and currency, the engine settles it by itself, using the same
method the original request would have used:

```java
SettlementOutcome resolvedOutcome = externalRecord.status() == ExternalStatus.CONFIRMED
        ? SettlementOutcome.CONFIRMED : SettlementOutcome.FAILED;
settlementTransactions.finalizeSettlement(settlement.getId(),
        new GatewayResult(resolvedOutcome, settlement.getExternalRef()));
```

A person is needed only when the two sides contradict each other. The project's own doc gives
the reason: if a settlement is already CONFIRMED and the external system now disputes it, money
may have moved, and only a person can judge what to do. So the rule is: evidence that fills a
gap gets applied automatically. Evidence that conflicts waits for a person.

## It runs on a timer, not on failure

A scheduler calls `runOnce` every 60 seconds by default, whether or not anything went wrong.
Each pass loads every settlement that has ever had a reference, with no date window and no
paging, and asks the external side about each one. That is fine at this size. At real volume,
the same query is also the cost.

## The query decides what it can see

The candidate query is `findByExternalRefIsNotNull()`. A settlement only gets a reference
inside `finalizeSettlement`, and only when the gateway returns one:

```java
if (gatewayResult.externalRef() != null) {
    settlement.setExternalRef(gatewayResult.externalRef());
}
```

Three paths end in UNKNOWN with no reference:

1. The gateway call throws. `SettlementService` builds `new GatewayResult(UNKNOWN, null)`.
2. The finalize retry budget runs out. The fallback uses the same null.
3. The stale-pending sweep finalizes an orphaned PENDING settlement as UNKNOWN, also with
   null.

None of these can reach the auto-resolve step, because reconciliation never loads them. They
do not open a mismatch either. They stay UNKNOWN.

The case that worries me most is the second failure type from the project's design doc: the
external system processed the payment, and the response was lost. The money moved. The engine
never learned the reference. The project's own open-questions list names this and two fixes:
ask the external system what it received for this settlement, or match on amount, date and
account. Neither is built. I checked the code instead of trusting the doc, and the doc was
right.

## Nobody is told

I said the person gets alerted. In the code, a new mismatch is published as the event
`reconciliation.mismatch_found`. Nothing consumes it. The Kafka doc says "No consumer yet". The
Prometheus rules cover three things: the backend being down, the ML service being down, and a
spike in failed settlements. None covers mismatches.

So a mismatch waits until someone opens the reconciliation page. A record in a table
guarantees a person can find the problem. It does not guarantee a person will.

## Recording a decision is not making it happen

The resolve endpoint takes a reason, marks the mismatch resolved, and writes an audit row and
an event. Its own description says it does not change the settlement or the ledger.

For ledger mismatches the docs say what follows: if the data still disagrees, the next read of
that account opens a new mismatch. Reading `flagMismatch`, the same should hold for settlement
mismatches, since it only skips a settlement that already has an open row. I read that. I have
not run it.

No endpoint corrects data. `REVERSED` exists in the state machine and is reachable from
CONFIRMED, but nothing in the code ever moves a settlement there. Today the correction is a
person editing the database by hand. That edit skips the state machine, the ledger entries and
the outbox event, because all three live in application code.

My first answer was "a person edits it". Keeping the decision with a person is right. The
open question is who carries it out. Either the person edits rows directly, or the person
decides and the engine executes it through the same paths as every other money movement. I
have not decided between them.

## What I took from it

1. Evidence that fills a gap can be applied automatically. Evidence that conflicts needs a
   person.
2. A checker sees only what its query returns. Ask what the query cannot return.
3. A record in a table is not an alert. Someone has to be told.
4. Recording a decision does not carry it out. Decide who does.