---
title: Stay Close Behind the Code
date: 2026-10-26T00:00:00.000Z
summary: >-
  AI can write the code. You still have to understand it as it appears. Hype
  makes that feel optional, and the feelings it brings are fear and desperation.
draft: false
tags:
  - Philosophy
  - AI
  - Engineering
  - Java
illustration: stay-close-behind-the-code.svg
illustrationAlt: >-
  A sheep tagged code waits at a gate. The shepherd holds up a hand beside a
  board that reads stored 120.00, ledger 120.00 and a tick. A speech bubble says
  check first.
crossposted:
  devto: 'https://dev.to/miguel_shinyenyi_e2291c8c/stay-close-behind-the-code-1940'
---

## What I notice

AI writes more code in an hour than I can read in a day. When I watch the volume grow, I feel pressure. Other people seem to ship more. I feel I should add more tools, more agents and more lines.

I wrote this from my own notes. I have not checked them against a study or a talk. They describe what I see in my own work.

## Three feelings behind the hype

Code carries the feelings of the person who wrote it. Three feelings sit behind the hype.

Code written in a hype cycle carries desperation and fear of missing out. I wrote it fast because I thought I would fall behind. I cannot tell you why it works, so I do not trust it. Nobody else trusts it either.

The third feeling is overwhelm. There is so much to do, so many tools to learn and so much new code to read, that I end up doing nothing. I think this feeling is one cause of the hype, not only a result of it. It pushes people to chase the next thing because finishing a small thing feels pointless next to the pile. I have not checked that. It is what I see in myself.

Code I understand carries a calm kind of feeling. I know what it does and where it stops. That feeling takes time to earn. It does not come from volume.

For code to be worth something to another person, it needs my time and my feelings in it. I cannot add either by prompting faster.

## Let AI write it, and stay close behind

I do not say you should write every line by hand. Let AI write the code. Stay one step behind it and understand each part as it appears.

My order is this.

1. Understand the people. Problems come from patterns where people struggled.
2. Write the code, preferably with AI.
3. Stop and check that the output matches what I meant.

The third step is the hard one, because I cannot measure "what I meant" until I have said it in one sentence. Patterns, constants and outliers also take time to see. If I rush, I miss all three.

If I only write code, I should ask who I am helping.

## The cycle I follow

Every step I take goes round the same cycle.

1. Understand things as they are, not as I want them to be.
2. Let AI write the code for what I understood is needed.
3. Check that the output matches what I meant.
4. Weigh the consequences before I act. Every action has some. I want the change to do more good than harm, and I want to know how to undo it.

Then I start again with the next step. The first step is the hard one. When I want something to be true, I read the code as if it already were. The ledger check below exists because a system cannot afford that wish.

## A check that stops the work

My settlement engine has a check that makes the work stop. Each account stores a balance, and each account has ledger entries. The two must agree. This is the service that compares them:

```java
public void verify(LedgerAccount account) {
    BigDecimal computed = ledgerEntryRepository.sumNetByAccountId(account.getId());
    BigDecimal stored = account.getBalance();
    if (stored.compareTo(computed) == 0) {
        return;
    }

    if (ledgerMismatchRepository.findByAccountIdAndResolutionStatus(account.getId(),
            MismatchResolutionStatus.OPEN).isEmpty()) {
        ledgerMismatchRepository.save(new LedgerMismatch(UUID.randomUUID(), account.getId(), stored, computed,
                "Stored balance " + stored + " does not match net of ledger entries " + computed));
    }
    throw new LedgerInconsistencyException(account.getId(), stored, computed);
}
```

When the numbers differ, it records the mismatch for a person to review, and then it always throws. The caller never receives a balance the ledger does not back. The account endpoint runs this check before it does anything else with the account.

This code does not help me ship faster. It makes me stop and ascertain. It is the same habit I want in my own work: before the next step, check that this one matches what I meant.

I verified the code above against the repository on 2026-10-16. I did not run it for this article.

## A step I skipped

On 2026-07-11 I committed a file called `mvnw`. It looked like the Maven Wrapper. It was four lines that pointed at one folder on my own machine, because I had no system-wide Maven on that machine.

```sh
# shortened
MVN_HOME="$HOME/.m2/wrapper/dists/apache-maven-3.9.9-bin/.../apache-maven-3.9.9"
exec "$MVN_HOME/bin/mvn" "$@"
```

It worked for me. It failed on the first CI run, because that folder does not exist on any other machine. I fixed it on 2026-07-17, six days and 23 commits later, by regenerating the real wrapper. The notes in the project say what went wrong: I replaced the wrapper when I only needed to fix my path.

I see two of the failure modes below in that story. I skipped a step, and I put a patch on a problem I had not understood.

## Eight ways I get lost

These are the names I use. Each has a sign and a remedy.

1. Forming. The right question, the wrong answer. I ask more questions until I know the goal and how to approach it.
2. Dislodging. I am stuck in a rut. I accept that the approach is not working and restart.
3. Assumption. The wrong question, the right answer. I go back and understand the goal.
4. Location. So close, so far. I skipped an important step. I slow down and take every step.
5. Achievement. A band aid on a broken bone. If the whole codebase is poor, I rewrite it.
6. Progression. I fall behind without noticing, because AI took over code I do not understand. I stop and read.
7. Interruption. Someone breaks the train of thought that was finding the goal. I know the goal best, and I deal with the humans.
8. Mislead. A suggestion leads me away from the goal. I check each suggestion against the goal first.

## What I took from it

This list is a draft for me to correct.

1. Understand things as they are before I change them. Then let AI write what I understood is needed.
2. Every action has consequences. I weigh them and know how to undo the change before I ship it.
3. The little work I do each day is what matters. Hype does not change that.
4. Protect my energy. Do not chase the volume.
5. When there is so much to do that I do nothing, I pick the smallest next piece and finish it.
6. Hyped code carries fear and desperation. Code I understand carries good feelings, and those take time.
7. Let AI write the code, and stay close behind it.
8. Understand the people first. Then write. Then stop and check the output against what I meant.
9. Build checks that make the work stop and ascertain, like the ledger check.
10. Name the failure mode when I notice it, and apply its remedy.
