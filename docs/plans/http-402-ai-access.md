# HTTP 402 for AI crawlers and agents: backlog design note

Status: backlog, written 2026-11-20. Owner decides if and when to build. Nothing here is built.

## What the owner asked
1. Return HTTP 402 Payment Required to AI browsers and scrapers that read the owner's sites.
2. Do the same for AI that scans umwayi-os code and files.

## What exists (checked 2026-11-20)
- x402 (Coinbase): the client asks for a resource, the server answers 402 with the price and accepted tokens, the client sends a signed payment in an X-PAYMENT header, a facilitator verifies and settles it onchain, the server answers 200 with an X-PAYMENT-RESPONSE header. USDC on Base is the named example. Coinbase runs a managed facilitator. Source: coinbase.com/developer-platform/discover/launches/x402.
- Cloudflare pay per crawl: the site owner sets a price per zone; a crawler either sends payment intent in headers and gets 200, or gets 402 with the price. Cloudflare is merchant of record. It is in closed beta (request access). A WAF or bot rule that blocks a crawler overrides the charge. Source: developers.cloudflare.com/ai-crawl-control/features/pay-per-crawl/.

## Facts that limit the plan
- Both options need a payout account the owner controls (a wallet for x402, a Cloudflare zone and access for pay per crawl). Setting those up is the owner's step. Claude does not create accounts or move money.
- x402 means receiving stablecoin. Check Kenyan rules and tax for receiving it before turning it on. Not legal or financial advice.
- Pay per crawl only works for sites behind Cloudflare and only after access is granted.
- The umwayi-os repo is public on GitHub. GitHub serves it, so a 402 cannot be put in front of it. Anyone can read or clone it, and the licence is what limits use. For the code, the realistic levers are the licence terms and a robots or ai.txt notice, and paid access applies only to what the owner serves himself (the sites, a docs mirror, an API).

## Options, smallest first
A. Notice only: robots.txt and a short AI access note on the sites. Costs nothing. Honest bots obey it.
B. Block unknown AI user agents at the edge, return 402 with a plain text price page. No payment path yet, so it works as a signal only.
C. Pay per crawl on the sites if the owner already uses Cloudflare. Least code, closed beta.
D. x402 on one small endpoint (for example a paid read API for the docs). Needs a wallet and a facilitator; most code and the most risk.

## Recommendation
Do A now, decide on C when Cloudflare access is granted, and treat D as an experiment later. Keep the umwayi-os repo public and rely on the licence.

## Open questions for the owner
1. Are the sites behind Cloudflare today?
2. Is the goal income, or only a signal that scraping is not free?
3. Should AI that identifies itself get a free allowance (for example search engines and assistants that cite the owner)?

## Task if approved
One Kiro task for the site (miguel-site): add robots.txt rules and a short AI access page, one branch, docs and static files only. No payment code in that task.
