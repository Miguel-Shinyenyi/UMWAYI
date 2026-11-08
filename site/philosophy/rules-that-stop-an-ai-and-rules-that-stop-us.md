---
title: "Do the rules that stop an AI also stop us?"
date: 2026-11-08
summary: "I compared how an AI model is trained with how a person is raised. The comparison breaks in places that matter, and those places show what a rule file can do that a social rule cannot."
draft: false
illustration: rules-that-stop-an-ai-and-rules-that-stop-us.svg
illustrationAlt: "A kite on a string tied to a fence post flies above sheep inside a fence. A sign with three lamps stands to the right, and one sheep outside the fence looks at it."
tags: ["AI", "Reasoning", "Reading"]
---

## What this is

These are my notes from November 8, written after reading parts of Sapiens by Yuval Noah Harari and while building a rules layer for AI helpers. I am not a neuroscientist or a machine learning researcher. The claims about brains and models are my understanding, and I mark where I am unsure. I have not checked the Sapiens points against the book page by page.

## The comparison I started with

An AI model is trained on a large amount of text. Training sets numbers called weights, and the weights shape what the model says next. A person is raised among people. Family, school and culture shape what the person believes and what the person does next.

Both end up with something that works like a settled view. Neither can fully predict what it will output in a new situation.

## Where the comparison holds

- Both are shaped by what they were exposed to. A model trained on poor text gives poor answers. A person raised on poor information holds poor beliefs.
- Both can be wrong with confidence.
- Both can produce something their history does not predict. A person can drop the beliefs of their upbringing. A model can produce text that no reliable source supports. These are different events, and I do not treat them as the same.

## Where it breaks

1. As far as I know, a model does not visibly weigh an earlier belief against new evidence. When it hallucinates, it produces fluent text that is not grounded in a reliable source. Some models carry internal signals about their own uncertainty, so I will not say there is nothing behind the text. A person who changes a belief usually felt the conflict first. I do not know whether a model has anything like that feeling. As far as I know, nobody has shown that it does, so I will not claim it.
2. A person keeps learning after childhood, from one experience at a time. A deployed model has fixed weights. Inside one conversation it can adapt to what you tell it, but that is not learning, and it is gone when the conversation ends.
3. Determinism is not the same on both sides. A model run with fixed settings can give the same output twice, but it is not guaranteed in practice, because of rounding in floating point math and how requests are batched together. For brains, whether they are deterministic is still an open argument. I will not settle it here.

So I would say the model resembles a person in how it was shaped. It does not resemble a person in how it changes its mind.

## What the rules do

When I build checks around an AI helper, I write down what it may do, what it may not do, and what it must ask me first. The check runs as code. If the action is not listed, the answer is Ask me first.

Harari describes imagined orders: money, empires, religions. They work because many people believe in them. I recorded his argument like this: cultures that were once separate and isolated were drawn together by universal orders, the monetary order, the imperial order and religion, and money succeeded where gods and kings failed. The line I added myself is that money feeds the body while religion and politics mostly comfort the mind. I do not know whether that last part is his.

Here is the difference I keep coming back to. An imagined order needs belief. It also needs people to enforce it, and people sometimes do not. A rule file in my system needs neither. The model does not have to agree with it. The check runs outside the model. The model cannot talk its way past it, as long as it cannot edit the rules file and cannot act without going through the check. Both of those conditions are things I have to build and test.

The two are alike in one place. Someone wrote the rules. Someone decided what was allowed. The check is exact, but the choices behind it are human, can be wrong, and can be changed. That is also true of laws.

## What a rule gives back

I wrote down another note this week. A kite flies when it is tied to a string, and it falls when the string is let go. Something I take as holding me back may be what lifts me. I try to notice which of my limits work that way.

A rule that stops an AI from moving money lets me give it other work without watching every step. The limit is what makes the trust possible. In my own life, a fixed schedule has done the same.

Harari also says tension and unresolved dilemmas drive creativity in a culture. I think a system needs some of that too. My rule file answers every case, but the cases I did not list go to me. That keeps a human decision in the places that are new.

## What I still do not know

- Whether a model can hold two conflicting views in a way that matters, or whether that is only how its output looks.
- Whether a checker outside the model could ever be complete. Mine is not. It fails safe, and that is a weaker claim.
- Whether the rules I write for helpers say more about the helpers or about me.
