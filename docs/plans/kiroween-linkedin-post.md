# docs/plans/kiroween-linkedin-post.md: LinkedIn post for the Kiroween article

Written 2026-11-12, Africa/Nairobi. A draft. Nothing is posted. You post it yourself.

## Rules that decide the post (read from kiroween.devpost.com/rules on 2026-11-12)

- Social Blitz bonus prize: the post must start with #KiroweenHackathon26, before any other text. It must share your favorite part of Kiro and how it changed your development approach. It must be published before Dec 4, 2:00 PM Pacific (Dec 5, 1:00 AM Nairobi). Put the post link in the Devpost form. Images or video help the judging.
- Blog bonus prize: the article must be on a third-party blog platform and say it is part of the Kiroween 2026 hackathon. The article has that line. Cross-post it (for example to dev.to) and put that URL in the form.
- Tags: the workflow posts through the API, which tags companies only. Typed text alone does not tag a person. See the tag check below.

## The post

#KiroweenHackathon26

I am building umwayi-os for Kiroween, in the Frankenstein category. It puts one set of rules in front of Claude Code, Kiro and OpenCode. Every action gets one of three answers: Yes, No or Ask me first.

My favorite part of Kiro is specs. They changed how I build:

- I write the requirements, design and task list first, in a pull request, before any code.
- Kiro builds one slice per pull request from that task list.
- A second AI reviews each diff on its own and reruns the checks by hand. Kiro's report is a claim. The files are the evidence.
- So far: 59 pull requests, and 1,899 tests on each Python version from 3.10 to 3.13.
- I read the result and merge. Kiro never merges.

Review caught two real mistakes that Kiro's own summary did not show. The article lists both.

Article: [article link]
Code: https://github.com/Miguel-Shinyenyi/umwayi-os

#KiroweenHackathon26 @Amazon Web Services this is my entry. Brian Beach and Darlyze Calixte, what is one thing your AI helper should always ask you before it acts?

## Before you post

- Check that specs really are your favorite part of Kiro. I wrote this from how the project was built, not from something you told me.
- Update the pull request and test numbers to the latest CI run.
- Add the article link once it is live (set `draft: false` in `site/tech/stitching-a-chimera-with-kiro.md`).
- Add one image: a screenshot of the hillside scene from the High tier, or the CI run with all four Python versions green.
- Tag check, done in LinkedIn on 2026-11-12 with Claude in Chrome:
  - Amazon Web Services: company page `amazon-web-services`, organization ID 2382910, read from its "See all employees" link. Tagged as a company mention.
  - Kiro: its page is a showcase page under AWS (`/showcase/kirodotdev/`, 32K followers). I could not read its own ID, so it is not tagged. The post uses the full #KiroweenHackathon26 and not #Kiro.
  - Brian Beach: `/in/brianjbeach/` shows "Principal Tech Lead at AWS - AI Developer Experience | Kiro". The spelling is Brian, not Bryan. The API cannot tag a person, so the name is plain text. To tag him, post by hand and pick him from the dropdown.
  - Darlyze Calixte: `/in/darveloper/` shows "Developer Marketing Manager @ Devpost". Plain text for the same reason.
  - Hashtags found in use on LinkedIn: #KiroweenHackathon26 (16 posts in one search), #Kiroween, #AgenticEngineering.
- Bryan or Brian: you wrote Bryan, the profile says Brian. I used Brian.
- I have not stated anyone's job title in the post, because I could not confirm them.
