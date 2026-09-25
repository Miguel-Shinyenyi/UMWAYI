# Settlement Engine

## What it is

An Idempotent Settlement and Reconciliation Engine, invoice financing as the first
application on top of it. Built by Miguel with Claude Code. The core guarantees exactly-once
money movement on top of a network that only guarantees at-least-once delivery: every
settlement request is idempotent, every settlement has an explicit state (`PENDING`,
`CONFIRMED`, `FAILED`, `UNKNOWN`, `REVERSED`), and a reconciliation process catches drift
between the ledger and external reality rather than assuming success.

## Stack

Monorepo. Spring Boot (Java) backend, PostgreSQL, Redis, Kafka, Python/FastAPI fraud
detection service, Next.js frontend, Docker and Kubernetes, GitHub Actions CI/CD,
Prometheus/Grafana/OpenTelemetry observability. Deployed on a self-hosted bare-metal server
(k3s), not AWS, despite AWS being in the original planned stack.

## Status

All nine build phases done, deployed, and verified end to end on staging. Not a design, a
working system: every merge to `dev` deploys automatically to staging
(`107.155.122.29`, no public DNS yet). A public `/app/about` page, no login required, walks
through the real build history, phase by phase, including the actual bugs hit and fixed,
sourced directly from `PROJECT.md`'s status log and every `docs/*.md` decisions log, not a
separate writeup.

Phase 9 (load and chaos testing) found and fixed two real production-shaped gaps:
`SettlementService`'s handling of gateway failures and deadlock-retry exhaustion, plus a CI
rollout-timeout false negative. Two concurrency bugs were also found and fixed back in Phase
1, caught by Testcontainers tests before they ever reached a real environment.

A third gap, separate from all of the above, was found on 2026-09-21 while restudying
idempotency for explainability, not while building: a hard process crash between
`createPendingSettlement` committing and `finalizeSettlement` ever running left a settlement
permanently invisible to reconciliation and its idempotency key stuck `IN_PROGRESS` forever.
Verified against the actual repository before being treated as real. Fixed the same day,
commit `950bf86`, `StalePendingSettlementSweepService`, a scheduled sweep that finds stale
`PENDING` settlements past a grace period and finalizes them as `UNKNOWN`, reusing the
existing state-machine path rather than adding a new one. Covered by its own unit and
integration tests.

## Why it exists

A learning and portfolio project targeting exactly what fintech companies test for:
idempotency, state machines for uncertain outcomes, reconciliation against external systems,
distributed consistency, access control, observability, and CI/CD for a real production
system, not a toy one.

## What's actually being restudied

Miguel built this himself. The current work isn't learning it for the first time, it's
verifying he can explain each subsystem on demand, in passing or in detail, the same gap
named in the 2026-09-16 journal entry, now being tested against real, complex material
instead of a single interview-style topic.

Idempotency was chosen first (2026-09-21) and has had two full explain-back passes so far.
The first attempt named the mechanism but missed that the guarantee covers a completed
retry, not just an in-flight one. The second, closer attempt correctly covered the atomic
write, the storage-consistency trade-off, and the insert race, but got the finalize race's
actual cause wrong (described as a slow rollback blocking a waiting transaction, when the
real mechanism is a genuine cross-table deadlock between an UPDATE and an INSERT during FK
validation) and asserted an in-progress retry reads a cached snapshot, when the code
actually throws `SettlementInProgressException` in that case, snapshots only exist once a
key is `COMPLETED`. Both corrections were made against the real code, not asserted from
memory. Two comparative questions were also answered this way: whether JPA `@Version`
optimistic locking (already used on `LedgerAccount`, confirmed absent from `IdempotencyKey`)
could substitute for the current approach (no, it solves lost updates on an existing row,
neither race here is a lost-update problem), and how Go and Postgres handle concurrency
generally (Postgres's MVCC and deadlock detector are what actually drive both races; Go's
goroutine/channel model governs in-process coordination and has no bearing on how Postgres
locks rows, so a Go rewrite would keep both races unchanged).

The site's idempotency article (`src/content/tech/idempotency-keys.md` in `miguel-site`) was
written from this material and kept current as the fix landed.

## Outbox and double-entry ledger restudy (2026-09-25)

Explained cold, then checked against the real code on `dev`.

The outbox explanation named the retry mechanism but framed the problem backward: not "sure
you sent it, keep proof," but the opposite, without it you can never be sure whether you sent
it, since a DB commit and a broker publish can't be one atomic operation across two systems.
Checked against the code and it holds as designed: `createPendingSettlement` is one
`@Transactional` method that saves the settlement and the `OutboxEvent` together, so they
commit or roll back as one unit, and `OutboxPublisher` only marks a row published after
blocking on the broker's ack.

The ledger explanation named the right shape (debit and credit, must balance) but the check
it described as the reason double-entry exists doesn't exist in the code. `LedgerEntry` rows
are written correctly, one `DEBIT` and one `CREDIT` per settlement, same amount, but
`LedgerEntryRepository` has no query beyond what `JpaRepository` gives for free, and
`finalizeSettlement` is its only caller. `LedgerAccount.balance` is a stored column, mutated
directly, and nothing anywhere sums the entries back and compares. A genuine gap, verified,
not assumed: `LedgerEntryRepository` really is write-only, confirmed by reading every call
site.

A fix was designed rather than left abstract: an `OPENING` entry per account (closing a
second gap the design surfaced, accounts start with a nonzero balance and zero entries,
seeded directly in `load/seed-accounts.sql` with no account-creation path in `src/main`),
`ledger_entries.settlement_id` made nullable for `OPENING` rows only (it's `NOT NULL
REFERENCES settlements` today, and an opening entry has no settlement behind it), a
`sumNetByAccountId` query, and a check on every `GET /accounts/{id}`.

What happens on a mismatch was its own discussion. A raw 500 detects the problem but doesn't
handle it, the discovery is lost once the request ends. `docs/reconciliation.md` already
states the actual policy for this class of problem, just not written as a general rule:
mismatches get manual review, never silent auto-resolution, enforced today only for
external-gateway mismatches (`reconciliation_mismatches`, one row per settlement, found
during a scheduled run). A ledger mismatch is found live and belongs to one account, not one
settlement, so it gets a sibling table, `ledger_mismatches`, and the same audited resolve
workflow (`ReconciliationController`, extended, not duplicated), rather than forcing it into
a table shaped for a different case. `GET /accounts/{id}` still throws on a live mismatch, a
caller must never be handed an untrusted balance, but it also opens a durable, reviewable
record first. This also settles an open question already sitting in
`docs/reconciliation.md`, about invoice-mismatches needing either a nullable FK on the
existing table or a dedicated one: dedicated table, applied here first.

Three forks in that design were put to Miguel rather than decided silently: opening entries
versus a separate `openingBalance` column (he chose opening entries), a nullable
`settlement_id` versus a synthetic settlement per account (he chose nullable), and a sibling
mismatch table versus generalizing `reconciliation_mismatches` (he chose sibling table).
Claude Code was also asked to write the general policy (detect-record-audit, never
auto-resolve) into `docs/reconciliation.md` itself, not just apply it, so it reads as a
standing rule the next mismatch case follows without re-deriving it. Handed to Claude Code as
`claude-code-prompt-ledger-consistency-v2.md`. Not yet built or verified; see `backlog.md`.

Reconciliation engine and the Phase 1/9 concurrency fixes remain as later candidates, in
roughly the order they'd come up in an interview.