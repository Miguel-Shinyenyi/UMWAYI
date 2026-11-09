---
title: >-
  Building the Umwayi hub landing page on Founding.dev: what happened and how we
  responded
date: 2026-11-09T00:00:00.000Z
summary: >-
  I built the Umwayi hub landing page on Founding.dev, an AI page builder, for
  its design hackathon. This is what happened over four days, what went wrong on
  screen, and how we responded.
illustration: building-a-landing-page-on-founding-dev.svg
illustrationAlt: >-
  A browser window shows a small hill scene with three gate lamps labelled Yes,
  No and Ask me first. Beside it a note card lists what was not checked: phone
  at night and tablet width. A shepherd says to look at it yourself.
draft: false
tags:
  - Founding.dev
  - Design
  - Umwayi
  - Build in public
linkedin:
  hashtags:
    - BuildWithFoundingDev
    - BuildInPublic
  mentions:
    - name: Founding Dev
      urn: 'urn:li:organization:107829355'
  links:
    - label: Design Hackathon
      url: 'https://founding.dev/hackathon/design'
    - label: Landing page
      url: 'https://umwayi-hub.foundingdev.com/'
crossposted:
  devto: >-
    https://dev.to/miguel_shinyenyi_e2291c8c/building-the-umwayi-hub-landing-page-on-foundingdev-what-happened-and-how-we-responded-307c
  linkedin: 'urn:li:share:7525639441814761473'
---

I build the Umwayi hub in public. It is an AI operating system that grew out of my personal notebook. One backend engineer in Nairobi builds it, and it is pre-release. The code has no front door, so for the Founding.dev design hackathon I designed one.

Live page: https://umwayi-hub.foundingdev.com/

## What the page is for

A stranger should understand the hub in one minute. The headline is "Every AI helper needs a shepherd." The hub gives every AI helper one of three answers before it acts: Yes, No, or Ask me first.

I did not want a mock-up. The demo on the page shows the real hub as it exists: its rules, its queue, its archive and its logbook, taken from the public repository. The build window ran from Nov 6 to Nov 10, about three hours a day.

## How the build went

I planned the page with Claude before I touched the builder. We wrote the prompts in advance, one at a time, so each one could stand alone.

- Prompt 1 built the page: hero, timeline, four parts, roadmap, FAQ.
- Prompt 2 built the demo from real hub content.
- Prompt 3 added the dark theme, Nightwatch.
- Prompt 4 finished the roadmap and FAQ.
- Prompt 5 audited the page.
- Prompt 6 turned the four parts into one hill scene you can walk into.

The first paste went wrong. The builder sent only the first line, because a line break submits the message. From then on we pasted every prompt as one line.

## What went wrong on screen, and what we did

The builder reports what it saw, and it often saw one view. So after each prompt I looked at the page myself and wrote down what was wrong. The next prompt fixed exactly that.

- Robot shepherd, gate lamps and a logbook printer went in on Nov 7. The lamp labels were about 6.5 pixels tall and unreadable, and a lamp plate overlapped the robot's arm. When the lantern became the robot's head, the night lantern disappeared.
- The next pass added a conveyor belt and a vault barn. The lamp sign came out far too large, nearly as tall as the fence. The robot, barn and fence were different scales. The barn door overlapped its shelves.
- Prompt D set one scale for every object and added scroll motion. The Parts scene was still about 60 percent empty sky, with small objects in a strip at the bottom.
- Prompt E cropped the sky and scaled objects up by about 1.5. Two sheep were left floating above the fence.
- Prompt F put everything on one ground line. Three hero sheep still merged into one shape, and the robot overlapped the end of the pen fence.
- Prompt G fixed the hero crop and the sheep spacing, and made the Parts scene fit at 375 pixels.

Six passes, and each one fixed what the one before it left. The builder's own report did not catch most of these.

## How we kept it safe to change

After every prompt I wrote down the commit and what it changed, so I could go back. Every pass has a restore point. If a prompt made the page worse, I could revert to the commit before it.

I also set a credit rule. The hackathon gave $10 of builder credits, plus extra I added. I set a $3 reserve. Each machine-imagery prompt cost about $0.40. When a text pass needed more, I approved going below the reserve myself, so the decision stayed with me.

## Keeping the page honest

The page started with a rule: it may not claim more than the hub does. Helpers are marked as coming, not built. Roadmap dates carry the label "Plan, dates may change." Nothing on it is marked live.

The hub moved while I designed. On Nov 7 I found wording that said the hub was one check. It was code in layers. We rewrote the text. On Nov 8 we replaced the roadmap with six cards that match the real timeline. On Nov 9 we updated the text to the current phase of the hub.

## Where it is weak

The builder reported one view at a time, and I checked the night view at desktop width after each pass. The light theme on a phone works; I have confirmed that. I have not confirmed the page at night on a phone, or at tablet width, after the last changes. Look at it yourself in both themes and at three sizes.

I also left the Helpers heading as it was written on Nov 7. The roadmap has moved since, and the two no longer say the same thing.

## What I took from it

1. Write the prompts first, and send them one at a time.
2. Look at every result yourself. The builder reports the view it saw.
3. Keep a restore point after each change, and a credit limit you decide.
4. Keep the page text in step with the real work.

The page is published. The hackathon closes Tue Nov 10, 10:59 AM Nairobi. The build story of the hub itself comes with my Kiroween submission on Dec 3.

The code: https://github.com/Miguel-Shinyenyi/umwayi-os

If you have used an AI page builder, what did you have to fix after its first pass?
