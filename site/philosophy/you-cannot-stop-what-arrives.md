---
title: You Cannot Stop What Arrives
date: 2026-10-15T00:00:00.000Z
summary: >-
  I cannot choose which thoughts show up, only what I do with them. My
  settlement engine has the same limit, and its worst bug came from refusing to
  decide.
draft: false
tags:
  - Philosophy
  - Systems thinking
  - Java
  - VisionQuest
illustration: you-cannot-stop-what-arrives.svg
illustrationAlt: >-
  A status board lists confirmed, failed and unknown. Only unknown is filled in
  and ticked, while a sheep tagged with a question mark waits and the shepherd
  looks on.
crossposted:
  devto: 'https://dev.to/miguel_shinyenyi_e2291c8c/you-cannot-stop-what-arrives-co8'
---

## What I notice

I cannot stop my thoughts. Try it yourself. Set a timer for thirty seconds and think of nothing. A thought will arrive before you pick it. This is my own observation. I have not checked the research on it.

Some thoughts arrive with weight. One kind is a standard I did not choose. It asks me to be someone before I have done anything. I cannot meet that kind by working, because it never says what finished looks like.

This piece started from a line in the Marvel series VisionQuest, about holding someone's memories without their feelings. I have not tried to explain the show. I took the line as a place to start thinking.

## Three answers to an arrival

I see three ways to answer a thought that weighs too much.

1. Act on it at once, as if it were an order.
2. Shrink so the test never comes. If I never try, I cannot fall short.
3. Record what is true, decide what I can, and leave the rest marked as unknown.

The second answer is the one I want to look at. It feels like relief. It also removes the one thing that would tell me whether the weight was real.

## The same shape in a settlement engine

My settlement engine cannot choose what arrives either. A payment gateway times out. Postgres deadlocks two transactions against each other. Neither event waits for permission. What I control is the state the engine writes next.

Here is the first decision, trimmed from `SettlementService.createSettlement`:

```java
try {
    gatewayResult = externalSettlementGateway.execute(executionRequest);
} catch (Exception gatewayFailure) {
    gatewayResult = new GatewayResult(SettlementOutcome.UNKNOWN, null);
}
return finalizeWithRetry(executionRequest.settlementId(), gatewayResult);
```

A timeout means the engine does not know whether the gateway processed the payment. The code says so. It writes UNKNOWN, not CONFIRMED and not FAILED. The comment in the file gives the reason: leaving the settlement PENDING would leave its idempotency key IN_PROGRESS, and every retry with that key would get a 409 with no way to resolve it.

Here is the second decision, trimmed from `finalizeWithRetry`:

```java
for (int attempt = 1; attempt <= MAX_FINALIZE_ATTEMPTS; attempt++) {
    try {
        return settlementTransactions.finalizeSettlement(settlementId, gatewayResult);
    } catch (TransientDataAccessException transientFailure) {
        if (attempt == MAX_FINALIZE_ATTEMPTS) {
            return finalizeAsUnknownAfterExhaustingRetries(settlementId, transientFailure);
        }
        meterRegistry.counter("settlement.finalize.retries").increment();
        sleepBriefly(attempt);
    }
}
```

The last branch is the part that matters. A comment above it says the Phase 9 load test found a bug. When the five attempts ran out with no fallback, the settlement stayed PENDING and its key stayed IN_PROGRESS forever. The failure was not the deadlock. Deadlocks were expected and retried. The failure was that the engine reached a point where it made no decision, and a state with no decision never ends.

The fix gave the engine a second budget of five attempts that writes UNKNOWN. UNKNOWN is a smaller claim than CONFIRMED. It is also true, and a later reconciliation can resolve it.

## What I take from the comparison

I do not need to claim greatness, and I do not need to claim failure. Both are large claims, and the evidence for either does not exist yet. The smaller true claim is available: here is what I made today. For anything bigger I can write unknown, and let the record settle it later. My journal does the job that reconciliation does for the engine.

The stall is the bug. Shrinking so the test never comes is the PENDING state with the key stuck. It looks like safety. It blocks every later attempt.

## Where the comparison stops

A person is not a service. Three differences matter.

The engine stops after ten attempts. A person should not cap attempts at ten.

The engine's UNKNOWN resolves against an outside system that holds the answer. A record of my own work does not hold the answer to my worth. It only holds what I did.

The engine decides in milliseconds. This decision takes years, and I may get it wrong in both directions. The feeling that I could do great things is a feeling, not evidence. It may be potential. It may be the weight of an expectation. I cannot tell which from inside.

## What I do not know

I do not know how common the shrinking answer is. I am drawing on my own experience, not on data.

I read only `createSettlement` and `finalizeWithRetry` for this piece. I am still restudying the rest of the retry path, so I make no claim about how it behaves under load beyond what the code comments say.

## What I took from it

1. I cannot stop what arrives. I can choose the state I write next.
2. A state that never ends is worse than an honest "unknown".
3. Make the next claim small enough to be true: what I made today.
4. Keep the record. It settles questions that a feeling at 4 in the morning cannot.
