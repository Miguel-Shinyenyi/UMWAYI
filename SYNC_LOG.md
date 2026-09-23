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

## 2026-09-22 (personal site: mobile-first redesign and mascot reversal)

- Source: `journal/entries/2026-09-22.md` ("Continued, personal site" sections)
- Updated: `docs/design.md` in `miguel-site` (revised twice, each revision dated and reasoned
  in its decisions log rather than silently overwritten), `backlog.md` (mobile-typeface item
  and mobile-redesign item marked answered, the visual-review item closed out and a new
  accessible-label question opened).
- What moved: three reported mobile bugs (nav overflow, code/headline overflow on article
  pages) confirmed real and root-caused to one line by rendering the live site at 375px and
  measuring, not guessed from CSS. A Hydra-inspired playfulness request was checked directly
  against the site's own documented design rules and named as a real conflict, not worked
  around quietly. A borrowed mascot was declined; once Miguel gave UMWAYI's actual meaning
  (shepherd), the personal mark was rebuilt from that and from the site's own existing
  cursor-blink glyph rather than generic pastoral iconography. Claude Code built and pushed
  a first, cautious version, commit `726e635`, independently reverified against the live
  repo (fresh production build, separate mobile-viewport measurement). That version was then
  screenshotted and looked at directly, found flat (barely visible mark, no real presence),
  matching what Miguel said after seeing it himself. Reversed at his explicit request into a
  full mascot and hero design; Claude Code built and pushed that too, commit `9e5210f`,
  again independently reverified: fresh production build, a repeated mobile-overflow check
  confirming the new illustration hadn't reintroduced the earlier bug class, and real
  screenshots in light mode, dark mode, and with reduced motion set, checking claims from
  Claude Code's own decisions log (a fixed hero-band color chosen after two documented
  color-collision failures; the gather/blink animation respecting reduced motion) rather
  than accepting them unverified.
- Confidence: the mobile bugs, the build success, and the color/motion claims are all
  directly verified against rendered output, not taken from commit messages or documentation
  alone. Whether the flock marks are legible to someone seeing them with no context is
  explicitly left open in `backlog.md`, not claimed as settled.

## 2026-09-23 (site content moves into the hub)

- Source: Miguel's request after the full redesign was pushed (`miguel-site` commits
  `3b884cc`, `7f4ac16`).
- Updated: new `site/` folder (six articles, four project pages including the new
  `personal-website.md`, `now.md`, ten illustrations, the profile photo, `README.md`,
  `tools/illustrations.py`), `.github/workflows/notify-site.yml`, `MASTER_CONTEXT.md`
  (spokes table, two new principles, open threads), `backlog.md`, `website/PLAN.md`.
  `articles/` removed; its two files were identical copies of what the site already had,
  now kept once in `site/philosophy/`.
- What moved: every article and project page was split into `##` sections so the site's
  "On this page" list has something to show. Wording kept except where a bold lead-in became
  a heading; project pages also had their status brought current. Each ends
  with a drafted "What I took from it" list taken only from what the piece already says. The
  three text diagrams (two in the idempotency piece, one in the both-stay piece) were
  rewritten to one column, 40 characters or less, so they fit a phone screen. The redesign was checked against a fresh production build before any of this: no
  page overflow at 390px, but eight gaps against the reference, confirmed by computed styles
  and zoomed screenshots (headings in the wrong font, code panel corners, an always-on
  underline, hovers missing on two buttons, a 2px card lift, the old favicon, a slim project
  template, an empty duplicate comments heading). All eight went into the Claude Code prompt.
- Confidence: the gaps are measured, not guessed. The takeaway lists are drafts in Miguel's
  voice and are marked for his review in `backlog.md`, not treated as his words yet.

## 2026-09-23 (site fixes after the content move)

- Source: Miguel's review of the live site after `miguel-site` commit `8066b2b`.
- Updated: `site/links.md` (new), `site/projects/settlement-engine.md`, `site/README.md`,
  `site/tools/illustrations.py`, all ten `site/illustrations/*.svg`, `MASTER_CONTEXT.md`,
  `backlog.md`.
- What moved: two layout bugs reproduced and root-caused before anything was written for
  Claude Code. The article illustration stayed pinned left on screens wider than 1440px
  because an unlayered `figure { margin: 0 }` reset overrides the `mx-auto` utility. The
  takeaway list broke around inline code because each list item is a flex row, which
  turns every text run into its own column. Both fixes were tested in the live page
  first. The illustrations lost their own outer border, which was drawing a second frame
  inside the site's. `Invoice-Financing` is public now and linked. The four profile
  accounts exist now, so their URLs moved into `site/links.md` for the footer to read. The
  footer sign-up is specified to save each address to Waline's private `mail` field only,
  with a check that the address never comes back from the public API.
- Confidence: both bugs measured at 1440, 1920, and 2560 wide. The Waline privacy claim is
  unconfirmed until Claude Code's test post shows the address stays out of the public
  response; the prompt says to stop if it doesn't.