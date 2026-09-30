---
title: 'The Outbox Held, the Ledger Didn''t'
date: 2026-09-25T00:00:00.000Z
summary: >-
  What actually breaks without a transactional outbox, why a ledger nobody reads
  back isn't really double-entry, and what happens once you decide never to
  auto-correct money.
draft: false
tags:
  - Spring Boot
  - PostgreSQL
  - Kafka
  - Concurrency
illustration: outbox-and-ledger.svg
illustrationAlt: >-
  The shepherd checks a sealed letter against a ledger with two columns, one
  much shorter than the other.
crossposted:
  devto: >-
    https://dev.to/miguel_shinyenyi_e2291c8c/the-outbox-held-the-ledger-didnt-k7g
  linkedin: 'urn:li:share:7510957161519448065'
---

## Explain it cold, then check

Same method as idempotency: explain the mechanism from memory, then check it against the
actual code, not the other way around. The point isn't to be right on the first try. It's
that a claim about your own system should be falsifiable. If I can't say what I'd expect to
find in the code that would prove my explanation wrong, I'm not really explaining it, I'm
just repeating a shape that sounds right.

Two subsystems, two different results. The outbox explanation held up once checked. The
ledger explanation didn't, not because the mechanism I described was wrong, but because the
part of it I assumed existed simply wasn't built yet.

## What the outbox is actually for

The instinct is to describe it as a receipt: proof you sent something, so you can resend it
if it doesn't land. That's close, but backward. The real problem is that a database commit
and a message published to Kafka are two separate systems, and you can't make them one atomic
operation. Publish first, then save to the database, and a crash in between means you told
the world something happened that your own database never recorded. Save first, then
publish, and a crash in between means your database says it happened but nobody downstream
ever hears about it. Either order leaves a gap where the two systems can disagree.

The fix is to make the event write local, so it can share a transaction with the fact it's
describing:

```java
@Transactional
public SettlementExecutionRequest createPendingSettlement(...) {
    ...
    settlementRepository.save(settlement);

    outboxWriter.write(AGGREGATE_TYPE_SETTLEMENT, settlementId, KafkaTopics.SETTLEMENT_REQUESTED,
            new SettlementRequestedEvent(settlementId, source.getId(), destination.getId(),
                    command.amount(), command.currency(), Instant.now()));
    ...
}
```

Same transaction, same database. The settlement and the event to announce it commit together
or not at all. A separate process then polls for unpublished rows and sends them on, only
marking a row done once the broker actually confirms it:

```java
kafkaTemplate.send(event.getTopic(), event.getAggregateId().toString(), event.getPayload()).get();
event.markPublished();
```

If that send fails, the row just sits there, unpublished, and gets tried again next poll.
What this buys isn't proof after the fact. It's a guarantee that the event and the thing it
describes can never come apart: if the settlement never happened, no event exists to send. If
it did happen, the event goes out eventually, whatever crashes in between.

## What double-entry is supposed to guarantee, and what wasn't there

Double-entry means every transaction writes two sides, a debit somewhere and a credit
somewhere else, and across any transaction the two must net to zero. The point of doing it
this way is that a balance stops being something you just trust. It becomes something you can
prove, by summing the entries that produced it.

The code writes both sides correctly:

```java
source.debit(settlement.getAmount());
destination.credit(settlement.getAmount());
ledgerEntryRepository.save(new LedgerEntry(UUID.randomUUID(), settlementId, source.getId(),
        EntryType.DEBIT, settlement.getAmount()));
ledgerEntryRepository.save(new LedgerEntry(UUID.randomUUID(), settlementId, destination.getId(),
        EntryType.CREDIT, settlement.getAmount()));
```

But `balance` is also a stored column, mutated directly by `debit()`/`credit()` in that same
method. And this is the whole repository interface for the entries just written:

```java
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {
}
```

No query beyond what comes free. Nothing anywhere sums those entries back and checks them
against the balance. The entries were being written correctly and never read. A ledger that
nobody checks isn't really double-entry, it's an audit trail sitting next to a number
everyone just trusts.

## Deciding what happens when it's wrong

Finding the gap is the easy part. The harder question is what a mismatch should actually do
once the system can see one.

The tempting answer is to auto-correct: recompute the balance from the entries and overwrite
it. That's the wrong incentive to build into the system. A mismatch means you don't yet know
which number is wrong, the stored balance or an entry. Auto-fixing assumes an answer you
don't have, and it means a real bug gets silently absorbed instead of surfaced, which is
exactly how a system keeps producing the same kind of failure: nothing about the mismatch
ever reaches whoever could actually fix the cause. `docs/reconciliation.md` already states
this as policy for a different case, mismatches with an external gateway: manual review by
default, no silent auto-resolution. That's not a rule specific to talking to a bank. It's the
right rule for any internal disagreement a system can detect but can't safely resolve on its
own, so it's now written that way, a general rule with two implementations rather than one
rule that only happens to apply once.

The fix: every account gets an opening entry so its balance always equals the sum of its own
history, and a check runs on every read. On a disagreement, it records the mismatch, once,
durably, and still refuses to hand back a number it doesn't trust:

```java
public void verify(LedgerAccount account) {
    BigDecimal computed = ledgerEntryRepository.sumNetByAccountId(account.getId());
    BigDecimal stored = account.getBalance();
    if (stored.compareTo(computed) == 0) {
        return;
    }
    if (ledgerMismatchRepository.findByAccountIdAndResolutionStatus(account.getId(), OPEN).isEmpty()) {
        ledgerMismatchRepository.save(new LedgerMismatch(...));
    }
    throw new LedgerInconsistencyException(account.getId(), stored, computed);
}
```

Resolving that record later never touches the balance either. It records that a human looked
at it and made a decision, the same as the existing gateway-mismatch workflow. Verified
against real data before calling it done: forty-six settlements moved through the actual API,
every untouched account's backfilled history matched its original balance exactly, and one
account whose balance was hand-edited to disagree with its own history was caught,
flagged, and resolved without its balance being touched by the fix itself.

## What I took from it

1. A claim about your own system should be falsifiable. If nothing in the code could prove
   it wrong, it isn't really an explanation.
2. The outbox isn't proof you sent something. It's a guarantee that an event and the fact it
   describes can never come apart.
3. Entries that are only ever written and never read aren't a checked ledger, whatever they're
   called.
4. When a system finds its own mistake, the honest move is to record it and ask, not to
   quietly fix it and move on.
