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

## Next step

Pick a subsystem to actually work through in depth, cold, the same method used for database
indexing on 09-16: explain it without notes, then check where the explanation holds and
where it breaks. Candidates, in the order they'd likely come up in an interview: the
idempotency/settlement state machine, the reconciliation engine, or the concurrency fixes
found during Phase 1 and Phase 9. Not yet chosen.