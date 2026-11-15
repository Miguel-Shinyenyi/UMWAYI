# Prompt for Claude Code: the owner items, done and reported

Written 2026-11-15, Africa/Nairobi. Paste everything under the line into Claude Code on Miguel's Mac. Run it in a real terminal. Claude Code does the steps it can, asks before each change that is hard to undo, and reports at the end.

---

You are helping Miguel Shinyenyi (GitHub: Miguel-Shinyenyi) finish a list of repository chores. Work one item at a time. Before each item that changes GitHub (create, delete, settings), say what you will do in one line and wait for his "yes". Never print, store or ask for a password, token or key. If `gh auth status` shows you are not signed in, stop and tell him to run `gh auth login` himself, then continue.

Style for all text you write: short sentences, active voice, no em dashes, no markdown headers.

ITEM 1. Create the private repo for Project A (the M-Pesa statement analyzer, task W31).
- Name: mpesa-statement-analyzer. Owner: Miguel-Shinyenyi. Private. Empty: no README, no licence, no .gitignore, no first commit.
- Command: gh repo create Miguel-Shinyenyi/mpesa-statement-analyzer --private --description "Local M-Pesa statement analyzer. Built through umwayi-os as a test project."
- Report the URL and confirm with gh repo view that it is private and has no commits.

ITEM 2. Branch ruleset on umwayi-os main.
- Goal: nothing merges into main unless the single check "tests / result" is green. No force pushes. No deletion of main.
- First find the exact check name. Run: gh pr list --repo Miguel-Shinyenyi/umwayi-os --state merged --limit 1 --json number, then gh pr checks <number> --repo Miguel-Shinyenyi/umwayi-os. Use the name of the one summary check (it reads "tests / result"). Do not guess it.
- Create a repository ruleset (not the old branch protection) targeting the default branch with these rules: require status checks to pass (the one check above), block force pushes, restrict deletions. Do not require reviews (Miguel is the only owner). Do not add a bypass list.
- Create it first with enforcement "evaluate" (dry run). Show him the rule. After he says yes, set enforcement to "active".
- Then prove it works without risk: open the settings page for rulesets, or run gh api repos/Miguel-Shinyenyi/umwayi-os/rulesets and show the active rule. Do not push to main to test it.
- Warning to repeat to him: if the check name is wrong, no pull request can merge. Say how to switch the ruleset back to "evaluate" or disable it.

ITEM 3. Delete the branch fix/test-harness-followup.
- First check it holds nothing new: git fetch origin; git log origin/main..origin/fix/test-harness-followup --oneline. If the list is empty, or every commit shows in a merged pull request, say so.
- If it holds commits that are not in main, stop and show them. Do not delete.
- If it is safe, ask him, then run: git push origin --delete fix/test-harness-followup.
- Confirm with git ls-remote --heads origin fix/test-harness-followup (empty output means it is gone).

ITEM 4. After pull request 111 (W45) is merged into umwayi-os main, rerun the real Claude Code run.
- Pull newest main in his umwayi-os clone. Run the Claude Code walkthrough script from the video pack: /Users/miguelshinyenyi/Downloads/umwayi-video-pack-v2/demo-agent-claude.sh. Use his usual cap.
- Expected after W45: exit code 0 and a measured cost (not a full 20 UU settle at exit 2).
- Report the exit code, the UU settled, and whether the logbook chain verifies (umwayi logbook verify, or the command his docs name).
- Do not publish or share the recording. Do not read it aloud: it shows a home path.

ITEM 5. Apply the hub zip.
- The hub repo is Miguel-Shinyenyi/UMWAYI (private). The zip is umwayi-hub-update-2026-11-15-v6.zip. Read its APPLY.txt first.
- Unzip to a new empty folder. Copy each file to the same path in the hub clone. Do not copy APPLY.txt. Do not touch anything under journal/ except the two entries named in APPLY.txt.
- Run the miguel-site build with the articles in place. Report pass or fail.
- Make one commit on a new branch (not main) and show him the diff stat. Ask before pushing.
- Never print the journal key. Never open secrets/ files.

ITEM 6. Report.
- Write one short message: for each item, done, not done, or stopped, with the proof line you ran. List anything you could not do and why. Do not add anything he did not ask for.

Not for you (he does these himself): Devpost form answers and submit, the High tier device test, the browser pass of the UI, the credit request form, any password or key.
