# Progress tracking

This folder records what got committed and merged, week by week. It reads git history only. No model is involved, so the same inputs give the same output.

## Files

- repos.txt: the public personal repositories, one per line as name|clone-url.
- YYYY-MM-DD-to-YYYY-MM-DD.md: one digest per week (Monday to Sunday, Africa/Nairobi dates).
- ../scripts/progress.py: builds a digest.
- ../.github/workflows/progress.yml: builds last week's digest every Monday and opens a pull request.

## Run it by hand

python3 scripts/progress.py --since 2026-11-02 --until 2026-11-08 --repos progress/repos.txt --clones .clones --clone > progress/2026-11-02-to-2026-11-08.md

Add --clone the first time. Later runs reuse the clones in .clones.

## What it counts

- Commits: all non-merge commits on any branch in the window, counted once.
- Merged PRs: numbers found in commit messages as "Merge pull request #N" or "(#N)".
- Not counted: open pull requests, closed pull requests that were never merged, issues, reviews. Git history does not hold them.

## Only your own commits

Add --author 'login|email' (a regex on git author name and email). Use it for repositories where other people commit too.

## Work repositories

Keep the list for work repositories in a private file outside this repository, in the same name|url format, and run the script against it. Send the output to a private place. Do not commit work repository names or digests here.

## Limits

A commit count measures activity, not value. Read it next to the journal and the project pages.
