# Archive

Text that left a working file because it is history, not instruction. Nothing here was deleted. Every move is recorded in `INDEX.md`, so any block can be found, checked and put back.

## Rules

1. Nothing moves without Miguel's approval of that item (see `docs/pruning-candidates.md`).
2. A move is a cut and paste, never a rewrite. The moved text is byte for byte the original.
3. The source file keeps a one-line pointer where the text was: `Moved to <path> (A-nnn, YYYY-MM-DD). See archive/INDEX.md.`
4. Every move gets a row in `INDEX.md` with: the id, the date, where it came from (repository, path, lines or heading), where it went, a SHA-256 of the moved text, the commit that holds the full original, why it moved, who approved it and when, and how to put it back.
5. Archived files are not read at the start of a task. A task reads one only when it needs history, and finds it through `INDEX.md`.
6. Archive files are plain markdown in git, so `git log`, `git blame` and `grep` all work on them. Search all of them with `grep -rn "term" archive/`.

## Check a move

The recorded SHA-256 is of the moved text. To verify: extract the block from the archive file between its `<!-- A-nnn begin -->` and `<!-- A-nnn end -->` markers and run `sha256sum`. It must match the row. To restore: paste the block back at the pointer, delete the pointer, and mark the row `restored` with the date.

## Where things live

- `archive/INDEX.md`: the register of every move, from any repository.
- `archive/<source-name>/<file>`: the moved text, one folder per source file, for text that came from this repository.
- For another repository, the text goes to a file inside that repository (for example `docs/status-log.md`) so that its own tools find it. The row in this index points there.

Check every move with `python3 archive/verify.py` from the hub root. It recomputes each checksum and prints ok or MISMATCH.
