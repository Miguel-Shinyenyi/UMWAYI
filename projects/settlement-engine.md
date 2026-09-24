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

## Next step

Outbox and double-entry ledger restudy opened 2026-09-24, same method: explain both cold
first, then verify against the real code (`OutboxEvent`, `OutboxWriter`, `OutboxPublisher`,
`LedgerAccount`, `LedgerEntry`, `SettlementTransactions`, all on the `dev` branch, pulled and
read ahead of the explain-back so nothing gets checked from memory). The explain-back itself
hadn't happened yet as of this entry. Reconciliation engine and the Phase 1/9 concurrency
fixes remain as later candidates, in roughly the order they'd come up in an interview.