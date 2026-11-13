---
title: "A timer and a web page use the same gate: scheduled runs and a local server"
date: 2026-11-13
summary: "umwayi-os runs jobs on a schedule through systemd and serves a page on 127.0.0.1. Neither has a rule set of its own. Both call the code a typed command calls, so the kill switch, the rules and the logbook apply every time."
draft: true
illustration: a-timer-and-a-web-page-use-the-same-gate.svg
illustrationAlt: "A clock and a browser window on the left, each with an arrow to the same gate on the right. Past the gate a single arrow leads to a logbook. A sheep stands by the clock. The shepherd says every way in meets the same gate."
tags:
  - Engineering
  - Security
  - Agentic engineering
  - Building in public
linkedin:
  hashtags: [KiroweenHackathon26, Kiroween, Kiro, AgenticEngineering, Python, BuildInPublic]
  post: docs/plans/a-timer-and-a-web-page-use-the-same-gate-linkedin-post.md
  links:
    - label: Event
      url: https://kiroween.devpost.com/
---

## Every new way in is a new way around

A rules gate protects only the doors that go through it. When I add a way to start work, such as a timer that fires at 07:30 or a button on a web page, I add a door. If that door has its own checks, there are two sets of rules, and they will differ.

umwayi-os adds both a scheduler and a local web server. The design rule for both is the same: the new door calls the same code a typed command calls. It has no copy of the rules. The code is public: https://github.com/Miguel-Shinyenyi/umwayi-os

## A schedule that Linux already has

I did not build a scheduler. Linux has one: systemd user timers.

```
umwayi schedule validate
umwayi schedule show
umwayi schedule check
umwayi schedule install NAME
umwayi schedule remove NAME
```

You write `schedule.yaml` with a name, a job or a workflow, and a time: daily, weekly or monthly, and the time of day. umwayi writes two unit files, a service and a timer, into `~/.config/systemd/user`. It prints the `systemctl --user` commands for you to run. It never runs `systemctl`, `crontab` or `loginctl` itself.

The service is a oneshot. It runs `python -m umwayi --root ROOT run JOBS --job JOB`, or a workflow, with no shell. It stops after 30 minutes and stops everything it started. The timer is persistent, so a run missed while the machine was off happens when it comes back.

Only jobs and workflows can be scheduled. An agent never can.

A scheduled run is the same command you would type. So it meets the kill switch, the run lock, the rules and the logbook every time. Installing a schedule is itself an action the rules gate: the starter rule is Ask me first, so you pass `--approved-by YOUR_NAME`. If the logbook entry for the install cannot be written, the files are removed.

`schedule check` compares the files on disk with what umwayi would write now. A file changed by hand is a difference. `remove` refuses a file changed by hand.

## A workflow cannot approve itself

A workflow is a list of steps from a closed set. There is no way to put a shell command, another program or an approval in one. Every step asks the rules (action type `workflow_step`) and writes one logbook entry. A workflow writes only under `drafts/`, plus the queue and the logbook.

The last step of the shipped content loop is `approve`. It never approves anything. It adds a queue item of kind decision that lists the drafts and stops the workflow with exit 3. The workflow will not run again until the owner answers or closes that item. Publishing a draft is a separate command, `umwayi publish-draft`, which is Ask me first.

A scheduled run can therefore collect, brief and draft while you sleep. It cannot publish.

## A page that can only ask

The other door is a web page. `umwayi serve` starts a small server on `127.0.0.1` so the page can show the queue and send the same request the command line would.

The rule for the page is: it may send what the command line would send, to a local backend and to nothing else. It never writes to the repository and never runs a command by itself. The server calls the same functions as the commands. Every request passes through the kill switch, the rules and the logbook.

The server is strict about who may ask. A request is refused with a fixed word and no detail when it:

```
uses a method not GET, POST, DELETE
does not come from 127.0.0.1
names a Host other than 127.0.0.1
carries a proxy or Upgrade header
has no valid token, or one expired
is a POST without the right Origin
has a body that is not exactly the
  route's fields
asks for a write while the kill
  switch is on or unknown
meets a rule that says No or Ask
```

Details behind those lines:

- It binds the literal address 127.0.0.1. No flag, setting or variable changes it, and the socket is read back after the bind.
- Only the exact Host `127.0.0.1:PORT` is accepted. `localhost` is refused. This stops a page on another site from reaching the server through DNS rebinding.
- The token has 48 characters and starts with `umt1_`. It is shown once on a terminal, never to a pipe or a file, and kept only as a SHA-256 in a file with mode 0600. It lives 30 days by default and 90 at most. Five failures a minute lock out the failures, and never a valid token.
- The page keeps the token in memory only. A reload forgets it and you paste it again.
- The server never sends a CORS header or a cookie, never turns the kill switch off, and never handles a token. Only the command line does.
- There is no polling. Nothing is sent without a token and nothing is asked by itself.

The server serves the built page only when its SHA-256 equals the hash in `ui/dist/build.json`. If they differ, it prints `(page not served)`.

## What is not done

- The browser pass is mine and I have not run it.
- The chat route and the intake route of the server are not built.
- A schedule runs only while you are logged in, unless you turn on lingering yourself.
- The kill switch is a file. Anyone with write access can remove it.

## What I took from it

1. A new entry point should call existing code. It should not copy the checks.
2. Use the scheduler the operating system already has. Write its files, show the commands and let the owner run them.
3. Keep the step that needs a person in the workflow as a stop with a question. A scheduled run can prepare work and cannot approve it.
4. Install and remove need the same gate as run, and a failed log entry should undo the install.
5. A local server needs checks for who may call it, and a refusal that says as little as possible.
6. Say which parts you have not run in a real browser.
