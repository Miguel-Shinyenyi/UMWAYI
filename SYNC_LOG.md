## 2026-09-21 (idempotency studied, crash gap found)

- Source: `journal/entries/2026-09-21.md` ("Continued, settlement engine: idempotency")
- Updated: `articles/idempotency-keys.md` is not a hub file, the real target was the site
  repo directly: `src/content/tech/idempotency-keys.md` in `miguel-site`. Also
  `backlog.md`, a Claude Code fix prompt logged there rather than fixed in passing.
- What moved: two cold-explanation attempts and the gap between what was remembered as said
  and what was actually said, verified against the real `SettlementService` and
  `SettlementTransactions` code, the two concurrency races (insert race, finalize deadlock),
  and a third, previously undocumented failure mode found while studying the first two
  closely enough to explain them: a hard crash between `createPendingSettlement` and
  `finalizeSettlement` leaves a settlement permanently invisible to reconciliation.
  Confirmed against the actual repository (`SettlementRepository`'s only query) before being
  treated as real, not assumed.
- Confidence: the two races are established, already in the codebase and its decisions log,
  found empirically under load per `docs/reconciliation.md`. The crash gap is a new, verified
  finding, confirmed against real code, not yet a "pattern" in the self-observation sense,
  this is a project finding, not a claim about Miguel.

## 2026-09-21 (explain-back verified, gap fixed same day)

- Source: `journal/entries/2026-09-21.md` ("Continued, settlement engine: idempotency,
  explain-back and versioning question")
- Updated: `projects/settlement-engine.md`, `backlog.md`, `src/content/tech/idempotency-keys.md`
  in `miguel-site`, `MASTER_CONTEXT.md` ("Current open threads").
- What moved: a second explain-back pass, checked against the real code and found two
  specific inaccuracies (a claimed in-progress snapshot read that the code doesn't do; the
  finalize race's cause described as a slow rollback rather than the real cross-table
  deadlock), plus two comparative questions answered against the actual domain code
  (`@Version` present on `LedgerAccount`, absent from `IdempotencyKey`; Postgres MVCC and
  deadlock detection versus Go's in-process concurrency model). Also recorded: the crash gap
  found the day before was fixed the same day, commit `950bf86`,
  `StalePendingSettlementSweepService`, verified directly against the real diff and source,
  not assumed from the commit message alone. `backlog.md` marked both the subsystem-choice
  and the crash-gap items answered.
- Confidence: the two corrections are factual, checked against real code. Noting "an
  existing pattern in a codebase is evidence about whether it applies elsewhere" is a
  reasoning method used once, not yet claimed as an established habit of Miguel's.

## 2026-09-22 (reading discussion, control-anxiety question, article)

- Source: `journal/entries/2026-09-22.md`
- Updated: `backlog.md` (new open question added under Self-observation), `articles/`
  (new piece, `philosophy/what-becomes-true-when-both-stay.md` in `miguel-site`),
  `MASTER_CONTEXT.md` (new rule added to "Rules from caught mistakes" about confirming
  large printed documents actually reached Miguel intact, plus the date bump).
- What moved: the Sapiens Rorschach-test framing (its "Curtain of Silence" section heading
  checked and confirmed against the actual text) and the "dialectical thinking turned
  inward" reframe (corrected from a mishearing, "trilectical," to the real, existing term),
  both offered by Miguel for discussion, connected to the same epistemic
  caution first applied to a self-theory on 2026-09-20, now applied a second time. The
  "anxiety from a need for control" statement was treated as a hypothesis with no instance
  yet attached, not accepted or rejected, added to `backlog.md` as an open question rather
  than resolved in the entry. Both threads fed the new philosophy article at Miguel's
  request, using the settlement engine's `UNKNOWN` state and this week's concurrency races
  as concrete parallels for holding something unresolved rather than forcing a premature
  answer.
- Confidence: the reframe and the control-anxiety statement are both explicitly left open,
  named as hypotheses, not conclusions. Two applications of the same evidentiary caution
  (self-confidence on 09-20, this entry on 09-22) is named as a possible signal, not an
  established pattern.