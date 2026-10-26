# A-008: Four sections of projects/routine-machine.md

Moved from `projects/routine-machine.md` on 2026-10-26 with Miguel's approval. The text between the markers is unchanged. Do not read this file at the start of a task.

<!-- A-008 begin -->
[A-008 segment 1: projects/routine-machine.md lines 54 to 74]
## Hardening since 2026-10-19

- Per-user scoping and access control: every user-scoped route takes the user from the signed token,
  with an owner role and cross-user isolation tests. Done 2026-10-21.
- Observability: request ids, JSON logs, metrics, Prometheus, Alertmanager, Loki, Jaeger, Grafana,
  exemplars, and an owner-only `/watchtower` page. Done 2026-10-21 to 2026-10-25.
- API docs for both services, owner only, with the documentation check. Done 2026-10-25.
- Product analytics, consent first (parts 1 to 3 of 6 visible in commits): identify by internal id,
  replay off, a privacy page, named events, a build-failing field-name test.
- Repository standard: README with a real screenshot, MIT license, CI (green on GitHub), demo profile
  off by default, fresh-clone run. Done 2026-10-26.
- Understanding first (staged Prompt 7): the two hub documents, a daily reminder, a stronger reminder
  after missed days, a weekly failure-mode card, a choice of start day, the 111-row concerns record.
  Done 2026-10-26.
- Not started: cloud hosting and file storage, CI/CD deploys, Kubernetes, caching (each needs a
  concerns-record answer first).

Studying an existing system (settlement-engine) for understanding is a learning activity,
not a building one, and belongs under Phase 1's goal-tagged `learning_topics`, not under
deep-work alongside building Routine Machine itself. This was caught and corrected after
first being mislabeled.

[A-008 segment 2: projects/routine-machine.md lines 76 to 82]
## Reading tracker

A `current_reading_log`, append-only, updatable manually or detected automatically from a
`Current book:` line written directly into a UMWAYI journal entry (see
`journal/TEMPLATE.md`). Standing rule, held in both repos: the template's `Current book:`
line and the exact string hub-sync checks for must be changed together, since one changing
without the other would silently stop the sync with nothing to reveal it.

[A-008 segment 3: projects/routine-machine.md lines 84 to 89]
## Hub integration

Journaling and article writing in this repo feed Routine Machine directly. A new file in
`journal/entries/` or `articles/` marks that day's journaling or writing as done, read from
this repo's public GitHub API, no manual re-logging required. The `Current book:` line feeds
the reading tracker the same way. Detail in the routine-machine repo's `docs/hub-sync.md`.

[A-008 segment 4: projects/routine-machine.md lines 104 to 107]
## Daily inventory it tracks

Sleep, showering, movement and exercise (walks, weight lifting, skating), cleaning the house,
cooking, personal time (currently reading Sapiens), checking on mum, paid work, finances.
<!-- A-008 end -->
