# docs/pre-launch-security.md: security gate before anything goes live

Added 2026-11-04. Tool facts below come from web sources read on 2026-11-04. Prices and free tiers change, so check them on the day.

## Step 0: ask

Is this project actually going live? If it is only a local demo, say so and skip to the short list at the end. If it is going live (public URL, real users, real data, a judged submission), run every step below. Security comes first.

## Step 0b: threat model, one page

Before picking tools, list the assets (user data, keys, money paths), the entry points (routes, webhooks, agent inputs), the trust boundaries, and who would attack. Tools check what you thought of; this finds what you did not.

## Step 1: pick tools by layer

One tool does not cover everything. Cover each layer.

| Layer | What it finds | Candidate (check cost on the day) |
|---|---|---|
| Pull request review | Logic and security issues in a diff, with an AI reviewer | CodeRabbit. A source says its basic features are free on public repos, and that on its paid tier it runs Semgrep and Gitleaks among 40+ analyzers. Private repo terms were not stated. It is described as complementing dedicated scanning, not replacing it |
| Static analysis (SAST) | Injection, unsafe patterns in your code | Semgrep Community Edition (free, open source). GitHub CodeQL is free for public repos. For private repos it needs GitHub Code Security, a paid add-on (council reviewer's claim, confirm on GitHub's pricing page). Semgrep Community does not trace data across files, so a clean result does not mean the code is safe |
| Secrets | Keys and tokens in code and git history | Gitleaks (open source). Scan full history: GitHub's default checkout is shallow, so set fetch-depth 0. GitHub secret scanning catches known provider key formats only, so custom keys can slip through |
| Dependencies | Known vulnerable packages | GitHub Dependabot (not checked on 2026-11-04, confirm). OSV-Scanner and Trivy also exist (not checked) |
| Containers and config | Bad Dockerfile and compose settings | Trivy or similar (not checked). Review compose ports by hand |
| Running app | What an attacker sees from outside | Manual checks: headers, auth on every route, rate limits, error messages |

Council review of any tool choice before adopting it. Do not adopt a tool because of a ranking article; those articles are often written by vendors.

## Step 2: run, fix, rerun

1. Run each tool on the whole repo and on full git history, not only the latest diff. Scan history before making a private repo public.
2. Triage every finding as fix now, accept with a written reason, or false positive with a written reason.
3. Fix, rerun, and keep the clean report in `docs/` or the PR.
4. Add the scanners to CI so a new finding blocks the merge. Keep unfixed findings in a private place, not a public repo's docs, because they map the weak spots.
5. If a secret leaked: revoke and rotate first, then check the provider's usage logs. Rewriting git history does not help once a repo was public, since forks and caches keep copies.

## Step 2b: application checks

- Per-user authorization: can user A reach user B's records? Test it.
- Expired and forged tokens, CORS settings, and that Postgres and Redis are not reachable from outside.
- Postgres backups exist and one restore has been tested.
- GitHub 2FA on, branch protection with required checks, no secrets exposed to workflows run from forks.
- Pin dependencies with lockfiles, GitHub Actions to a commit SHA, and Docker base images by digest.
- Hackathon and demo keys get spend limits and are revoked after judging.

## Step 3: agent-specific checks

From `docs/agent-principles.md` section 15 (security notes of 2 Nov): loopback bind only, no 0.0.0.0; update the runner; official model weights only; no secrets in the working directory; split the process that runs commands from the process that has network access, and log what crosses, with secrets redacted and a retention period.

Prompt injection: issues, pull requests, web pages and files can steer an agent's tool calls. Use least-privilege scoped tokens, vet every MCP server, and require human approval before destructive actions or sending data out. For model weights, check a published checksum; "official weights" alone verifies nothing.

## Step 4: sign-off

A human reads the scan report and the diff of every security fix. An AI scan result is not sign-off.

## Known open finding

umwayi-rm's compose file published port 3000 on all interfaces and its key variable was spelled BASENTEN_API_KEY. Check `projects/hackathon.md` for current status before launch.

## Short list for a local demo

No secrets in the repo or history, bind to loopback, dependencies updated, no real user data. An agent with shell access is a risk even on a local machine, so keep its keys scoped and out of its working directory.
