---
title: "Settlement Engine"
date: 2026-09-20
updated: 2026-09-23
summary: "A live, deployed idempotent settlement and reconciliation engine, all nine build phases complete."
draft: false
status: "Deployed to staging"
statusVariant: success
category: "Fintech backend"
stack: ["Spring Boot", "PostgreSQL", "Kafka", "FastAPI", "Next.js", "Kubernetes", "OpenTelemetry"]
link: "/projects/settlement-engine"
linkLabel: "Read the case study"
links:
  - label: "View on GitHub"
    url: "https://github.com/Miguel-Shinyenyi/Invoice-Financing"
  - label: "Idempotency keys, under load"
    url: "/tech/idempotency-keys"
illustration: settlement-engine.svg
illustrationAlt: "Sheep pass one at a time through a narrow gate marked exactly once, beside a ledger listing the five settlement states."
---

## What it is

A monorepo project: Java Spring Boot for the core services, PostgreSQL for storage, Kafka for
event flow, Python/FastAPI for fraud detection, Next.js for the front end, Docker and
Kubernetes for deployment, and Prometheus, Grafana, and OpenTelemetry for observability.

## What it's really about

The application layer is invoice financing, but the actual subject is correctness under
failure: guaranteeing a settlement executes exactly once on top of a network that only
guarantees at-least-once delivery, with every settlement carrying an explicit state
(`PENDING`, `CONFIRMED`, `FAILED`, `UNKNOWN`, `REVERSED`) and a reconciliation process that
catches drift against external reality instead of assuming success.

## Where it stands

All nine planned build phases are done, deployed, and verified end to end on a live staging
server. Load and chaos testing in the final phase found and fixed two real gaps in gateway
failure handling and deadlock-retry exhaustion, alongside earlier concurrency bugs caught by
integration tests before they ever reached a real environment.

## What I'm doing with it now

Not building further, restudying. Having built it doesn't guarantee being able to explain it
cold, under interview pressure, and that gap is worth closing deliberately rather than
assuming it isn't there. The first subsystem studied, idempotency, surfaced a real
crash-recovery gap, fixed the same day. Outbox is next.

## What I took from it

1. Explicit states beat assumed success. `UNKNOWN` is a real answer.
2. Load and chaos tests find bugs design review doesn't.
3. Building something and being able to explain it cold are two different achievements.