---
title: "Idempotency keys, under load"
date: 2026-09-21
updated: 2026-09-23
summary: "What an idempotency key actually guarantees in a real settlement system, the two concurrency races that show up under load, and a gap that studying it surfaced, then closed."
draft: false
tags: ["Spring Boot", "PostgreSQL", "Concurrency"]
illustration: idempotency-keys.svg
illustrationAlt: "A shepherd stops a second sheep tagged 42 at the gate."
---

## The textbook version

An idempotency key is a client-generated identifier attached to a request, so that if the
same request arrives twice, the server recognizes it and returns the original result instead
of processing it again. That's the textbook version. The real version, the one that shows up
once you put a system under actual concurrent load, has two more layers to it.

## The guarantee is "answer it correctly"

The guarantee isn't "block the duplicate," it's "answer it correctly." A retry of an
in-flight request gets told the process is underway. A retry of a *finished* request gets
back the exact same result the first one got, replayed from a stored snapshot, not a fresh
answer. That second case is the actual point. A caller retrying after a timeout isn't told
"processing," they're told what genuinely happened.

Here's the check, in the real code:

```java
Optional<IdempotencyKey> existing = settlementTransactions.findExisting(idempotencyKey);
if (existing.isPresent()) {
    return handleExisting(existing.get(), requestHash);
}
try {
    executionRequest = settlementTransactions.createPendingSettlement(idempotencyKey, requestHash, command);
} catch (DataAccessException raceLost) {
    IdempotencyKey winner = settlementTransactions.findExisting(idempotencyKey)
            .orElseThrow(() -> raceLost);
    return handleExisting(winner, requestHash);
}
```

## Race one: same key, same instant

Check-then-write always
has a gap. Two requests can both see nothing during `findExisting`, before either has
written anything. Rather than closing that gap with an upfront lock, the code lets both
proceed, and leans on a database-level unique constraint to guarantee only one insert
survives. The other throws, and gets recovered by re-reading whoever won.

What's not obvious from reading the code: that failure doesn't always look the same. Under
Postgres, the identical race sometimes surfaces as a clean unique-constraint violation, and
sometimes as an outright deadlock between the two competing index insertions, depending on
timing. That's not something you'd predict from the schema. It's something you'd only find
by actually running concurrent load against it and watching what comes back.

```
t1  A      findExisting(key) -> empty
t1  B      findExisting(key) -> empty
t2  A      INSERT idempotency_keys
t2  B      INSERT idempotency_keys
t3  DB     unique constraint on key:
           only one INSERT wins
t3  loser  fails as EITHER
           - a unique-violation, or
           - a deadlock
             (CannotAcquireLock)
           depending on index timing
t4  loser  catch(DataAccessException)
           -> findExisting(key)
           -> return winner's result
```

## Race two: the winner deadlocks

Race two is a different race, on the winner. The losing threads above, in their own
doomed transactions, are inserting into `settlements`, which has a foreign key back to
`idempotency_keys`. Validating that foreign key takes a shared lock on the referenced row.
If those losing transactions haven't rolled back yet when the winner tries to `UPDATE` that
same row to mark it complete, the update deadlocks against locks held for an unrelated
reason.

```
1  Winner  createPendingSettlement()
           commits
2  Loser   INSERT INTO settlements
           (FK -> idempotency_keys)
           takes a shared lock on
           that row
3  Loser   rolling back, lock still
           held
4  Winner  finalizeSettlement():
           UPDATE idempotency_keys
           SET status = COMPLETED
           -> blocked on that lock
5  DB      detects deadlock,
           aborts the UPDATE
6  Winner  catches
           TransientDataAccessException
           retries finalizeSettlement
           only (already PENDING;
           rerunning the whole flow
           would see its own key as
           a conflict)
7  Loser   rollback completes,
           lock released
8  Winner  retry succeeds
```

Five bounded retries, short backoff. If all five are exhausted, still under heavy
contention, the system doesn't leave the settlement stuck. It falls back to a second,
independent retry budget that finalizes the settlement as `UNKNOWN`, the same "we genuinely
don't know, let reconciliation resolve it later" state used when the external call itself
fails outright. Both concurrency behaviors were found by actually running load and chaos
tests against the system, not by design review.

## A third failure mode: the crash

This one was found by studying the first two closely enough to explain them. Neither race above covers what happens if the process hard-crashes between the two
transactions entirely, after the settlement is written as `PENDING` but before it's ever
finalized. No thread survives to catch anything in that case, and the settlement has no
external reference yet, since that's only set during finalization, which made it invisible
to reconciliation's own query. The idempotency key would stay `IN_PROGRESS` indefinitely,
409-ing every retry, forever. That was a real, verified gap, confirmed against the actual
repository before writing it down here, not assumed.

It's fixed now. A scheduled sweep, `StalePendingSettlementSweepService`, runs the same way
reconciliation already does: it finds settlements stuck `PENDING` with no external reference
past a grace period (300 seconds by default), and finalizes each one as `UNKNOWN`, reusing
the exact same "we don't know, reconciliation resolves it later" path the two races above
already fall back to. No new state-machine logic, just the same escape hatch applied to a
case that previously had no path to it at all. Covered by its own unit and integration
tests, the way everything else in this system is.

The interesting part was never the key itself. It's every place where "the same request
happening twice" turns out to have more than one way of actually happening, and every place
"finished" turns out to have more than one way of actually finishing.

## What I took from it

1. An idempotency key's job is to answer a retry correctly, not just to block it.
2. Let the database's unique constraint decide the race instead of locking upfront.
3. The same race can fail two different ways. Only real concurrent load showed that.
4. Every path needs an exit to `UNKNOWN`, including a crash nobody survives to catch.