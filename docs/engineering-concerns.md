# Engineering concerns

Added 2026-10-16. A list of 59 backend concepts, taken from a handwritten list Miguel shared. It is a hard rule for every current and future coding project: each concept is considered, and the answer is written down.

## The rule

1. Every project keeps a concerns record, in its design doc or `PROJECT.md`. The record has one row per number below.
2. Each row gets one of three answers, and a reason in one sentence:
   - Applies: the project handles it. Name the file or doc that shows how.
   - Not applicable: the project does not have this problem. Say why.
   - Deferred: it will matter later. Say what event makes it matter.
3. Considered does not mean built. Most projects will build a small part of the list. The rule is that nothing on the list is skipped by accident.
4. A new project starts its record before the first feature. An existing project adds the record when someone asks for an audit. Nobody audits a project unprompted.
5. When a concept causes a real fault, the fault is recorded against its number, with the date and the fix.
6. An answer of "applies" must point at evidence: a test, a doc or a config. A claim without evidence stays "deferred".

## The 59 concepts, each as a question

### Traffic and edges

1. Rate limiting: what stops one caller from using all the capacity?
2. Caching: what is cached, for how long, and who can read a stale value?
3. Load balancing: how does a request choose an instance?
4. Reverse proxies: what sits in front of the app, and what does it change on the request?
5. API gateways: where do authentication, routing and quotas live?
48. CDN: which responses can be served from a node near the user?
49. Edge caching: what is cached at the edge, and who can clear it?
50. Cache invalidation: what event removes a cached value, and what if that event is lost?

### Delivery and operations

6. CI/CD: what must pass before code reaches each environment?
7. Docker: does the image build from a clean checkout, and is it small and pinned?
8. Kubernetes: if this runs there, what are the resource limits, probes and rollout rules?
51. Feature flags: which changes can be turned off without a deploy?
52. Blue-green deployment: can the old version keep running until the new one is proven?
53. Canary releases: can a small share of traffic try a change first?
54. Rolling deployments: what happens to requests in flight while instances restart?
55. Rollbacks: how do we return to the last good version, and does the data allow it?
56. Health checks: what does "healthy" mean, and who reads it?
57. Liveness and readiness probes: when is an instance alive, and when is it ready for traffic?
58. Monitoring: which numbers tell us the system is wrong before a user does?
59. Logging: can one request be followed across every log line, without secrets in them?

### Service calls and failure

9. Service discovery: how does one service find another?
10. Circuit breakers: when a dependency fails, what stops us from calling it again at once?
11. Timeouts: does every outside call have a limit?
12. Retries: which failures are safe to retry, and how many times?
13. Exponential backoff: do retries wait longer each time, with jitter?
14. Idempotency: can the same request run twice without a second effect?
44. Backpressure: when input outruns processing, what slows or sheds it?

### Messaging and workflows

15. Message queues: what happens to a message if the consumer is down?
16. Pub/sub: who receives an event, and who may not?
17. Event-driven architecture: can we replay events, and in what order do they arrive?
18. Distributed transactions: if two systems must change together, what guarantees they do?
19. Saga pattern: if step three fails, what undoes steps one and two?
20. Dead letter queues: where does a message go after it keeps failing, and who looks?
21. Cron jobs: what if a job runs twice, or overlaps itself, or does not run?

### Real-time connections

22. WebSockets: how are connections counted, authenticated and closed?
23. Long polling: how long does a request wait, and what holds a thread while it waits?
24. Server-sent events: how does a client resume after a dropped stream?

### Data access and storage

25. Database indexing: which queries have an index, and what does each index cost on write?
26. Query optimization: have the slowest queries been read with their plans?
27. N+1 queries: does a list endpoint run one query or one per row?
28. Connection pooling: what is the pool size, and what happens when it runs out?
29. Read replicas: which reads can accept lag?
30. Sharding: what is the shard key, and what breaks when one shard grows?
31. Partitioning: how is a large table split, and how is old data removed?
32. Replication: what is copied, how far behind can the copy be, and what happens at failover?
33. Leader election: who decides which instance leads, and what if two think they lead?
34. CAP theorem: when the network splits, do we choose consistency or availability, and is that written down?
35. Eventual consistency: where can a reader see old data, and does the user know?

### Concurrency

36. Optimistic locking: how is a lost update detected?
37. Pessimistic locking: which rows are locked, for how long, in what order?
38. Distributed locks: what expires the lock, and what if the holder is slow, not dead?
39. Race conditions: which two actions can interleave, and what test forces them to?
40. Deadlocks: do all paths take locks in the same order, and is a deadlock retried?
41. Memory leaks: what grows over days, and what alert shows it?
42. Garbage collection: what do pauses and heap size look like under load?
43. Thread safety: which objects are shared between threads, and are they safe to share?

### Scale

45. Autoscaling: what number triggers a new instance, and what limits the growth?
46. Horizontal scaling: can a second instance run without breaking the first?
47. Vertical scaling: what is the largest single machine we would accept, and what is the limit after it?

## Record format

Put this table in each project's design doc.

```
| # | Concept | Answer | Reason and evidence | Date |
|---|---------|--------|---------------------|------|
| 14 | Idempotency | Applies | Key plus request hash, see docs/backend.md | 2026-10-16 |
```

## Link to the other rules

- `docs/understanding-first.md` says how to work: stay close to the code, check the output against the goal.
- This file says what to consider: the 59 concepts.
- A concept that was considered and recorded counts as understood. A concept that was skipped counts as a risk.