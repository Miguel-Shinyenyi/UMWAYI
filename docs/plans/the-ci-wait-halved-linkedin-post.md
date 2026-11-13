# docs/plans/the-ci-wait-halved-linkedin-post.md: LinkedIn post for the CI article

Written 2026-11-13, Africa/Nairobi. A draft. Nothing is posted. The article stays `draft: true` until you set it live.

## The post

#KiroweenHackathon26

My CI wait on umwayi-os fell from 25 minutes to about 12. No test was dropped.

- One job ran 2,000+ tests on one Python version for 24.9 minutes.
- I split the test files into three shards by measured seconds.
- A map of which test reads which path lets a docs-only change skip the Python tests.
- One check named result fails if a shard skips a file or a test never starts.
- I tested that check by breaking things on purpose. It went red both times.
- Heavier runs still take 13 to 22 minutes, because overlapping runs wait for a free runner.

Article: [article link]
Code: https://github.com/Miguel-Shinyenyi/umwayi-os

What check do you run to prove a split test suite still runs every test?

#Kiroween #Kiro #AgenticEngineering #ContinuousIntegration #SoftwareTesting #Python #BuildInPublic

## Before you post

- Check each number and claim against the article. Both were written from the repo docs, not from a new run.
- Post one article a day at most. Eleven in one day reads as spam.
- Add the article link once it is live.
