# Kiroween submission checklist, the licence checks and Vercel

Written 2026-11-15, Africa/Nairobi. Read from the official rules (kiroween.devpost.com/rules) and the Devpost draft form (project id 1297770) on 2026-11-15. Nothing was submitted.

## Dates (Nairobi time)

- Credit request form closes Tue Dec 1, 12:00 Pacific, which is Dec 1, 23:00 Nairobi. One time grant of 4,000 Kiro credits per person. Allow 48 business hours for review. Codes must be redeemed by Dec 4. Redeemed credits expire Dec 31. Ask no later than Nov 24.
- Submission closes Dec 4, 14:00 Pacific, which is Dec 5, 01:00 Nairobi. No extensions. Our plan is to submit Dec 3.
- Judging Dec 16 to Jan 29. Winners about Feb 3.

## What the form needs, and where we stand

1. Public GitHub repo URL with an open source licence visible in the About section: done (MIT, repo Miguel-Shinyenyi/umwayi-os). Check the About box still shows MIT on Dec 2.
2. The /.kiro folder at the root and not in .gitignore: present (specs and steering). .gitignore has no .kiro line (checked on main ea574e3). There are no hooks, custom agents, powers or MCP in the folder. Say so plainly in the write up.
3. Working demo URL: required. The library runs locally, so the demo URL must point to something a judge can open. Options: the GitHub repo with a quickstart, or the Vercel site. Decide by Nov 23. Recommendation: the repo README with a two minute quickstart, plus the public site once it exists.
4. Testing instructions for judges: say how to install, run one safe goal, and see the kill switch. No credentials are needed. Write that no credentials are needed.
5. Demo video: under 3 minutes, public on YouTube, shows the project working on the device it was built for, no third party trademarks or copyrighted music. The Kiro logo, the Claude logo and the OpenCode logo count as trademarks: show names in plain text only. The tests recording shows failures and a home path, so do not use it. The Claude agent recording shows the telemetry stop, so do not film it as clean until W45 is merged and the run is repeated.
6. Technology requirement answer: name each Kiro product used and what it did. Be honest about what is not built (hooks, custom agents, powers, MCP).
7. Pre-existing work: the first commit of umwayi-os is 2026-11-07, after the submission period opened on Oct 30. Say that nothing was carried over from earlier projects. If the repo reuses any code from umwayi-rm (the Meta hackathon project), name it.
8. Category: Frankenstein. Bonus prizes are optional: Social Blitz (a public post that starts with #KiroweenHackathon26, posted during the period, favourite thing about Kiro and how it changed your approach), Blog (public post on a third party platform, says it is part of Kiroween 2026, published in the period). Startup, Student, Crew and Ghost of Kiroween Past do not apply unless you say they do. Ghost needs a yes on being registered in 2025.
9. Your own answers: country of residence, age of majority, eligible jurisdiction (Kenya is not on the excluded list), submitter type Individual, not an AWS employee, skills gained, will you use Kiro again. Only you answer these.

## The two licence checks

A. Claude Agent SDK. Nine Anthropic packages carry the licence text "SEE LICENSE IN LICENSE.md". Facts read on 2026-11-15 from Anthropic's legal page for Claude Code: use is subject to Anthropic's Commercial Terms (API, Team, Enterprise) or Consumer Terms (Free, Pro, Max). Developers who build products on the Agent SDK should use API key authentication. Do not offer Claude.ai login in your own app, do not route requests through a subscription on behalf of other people, and do not collect or store Claude.ai credentials. Do not modify the Claude Code binary. Do not use the Claude or Anthropic names or logos in your product name or logo, or imply Anthropic backs it. Plain text mentions that it works with Claude Code are allowed. What this means for umwayi-os: it runs Claude Code as published and never handles keys, so it stays inside these terms. Never add a feature that stores a key or a login token. Keep Claude's logo out of our pages and video; mention it in text only. You still read the LICENSE.md in the package yourself (open node_modules/@anthropic-ai/claude-agent-sdk/LICENSE.md after install) because the full text is the only authority. This note is a reading of public pages, not legal advice.

B. Muse Spark Open (the model that may run behind OpenCode). Facts from a third party summary, not from the licence itself: the grant is close to MIT; the weights are gated and Meta approves requests; credit line "Built with Muse Spark Open" must be shown prominently in the UI or docs of a product that uses the model or its derivatives; a usage policy bans unlicensed finance, law and medicine practice, malicious code, and passing off outputs as human made; a separate agreement is needed only when you offer the model as a service to third parties above 20 million USD revenue over 12 months. What this means for umwayi-os: it does not ship the model and does not host it, so the threshold does not apply. If the demo or docs show a run with Muse Spark Open behind OpenCode, add the credit line there. Read the real LICENSE.md in the model repository when you request access, because the summary may be wrong. Until you do, the plan in D-31 stays: spec only, build after Dec 3.

## Vercel (read in the signed in dashboard on 2026-11-15)

- Plan: Hobby (free). Hobby is for personal, non commercial use. A hackathon demo and a personal site fit.
- One project exists: umwayi-rm (umwayi-rm.vercel.app), from the Meta hackathon, last deployed Nov 5. There is no project for umwayi-os or for the hub site.
- Usage is far under every limit (389 of 1M requests, 2.65 MB of 10 GB transfer).
- Two factor authentication is not on. The dashboard prompts for it. Turn it on yourself; it is the single most useful setting.
- For the public site (decision D-36: Next.js in site/, Vercel free tier, no analytics): create one new project from the hub repo, root directory site/, framework Next.js, production branch main. Keep Web Analytics and Speed Insights off unless you reverse D-36. Keep the repo private; Vercel can build a private repo on Hobby. Turn on deployment protection only if you want the preview URLs private. Add no environment variables unless the site needs one. Do not paste keys into chat.
- Do not create it before the site builds locally (the miguel-site build from the zip).
