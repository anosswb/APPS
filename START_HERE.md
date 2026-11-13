# START HERE (for Anass)

This repo is the brain of your app business. It tells Claude (Opus) how to work with you: how to find ideas, design without AI slop, keep users, earn money, pass the stores, and save tokens.

## How to use it — 5 steps
1. **Put this repo on your GitHub** (name: `app-factory`, private). See "First time" below.
2. **Start a Claude Code session on this repo** when the job is ideas, research, design direction or planning.
3. **Each new app is a folder in `apps/`** in this same repo (Gobblo stays in its own repo). When you start a new app, Claude runs `/new-app` and copies the starter into the new folder.
4. **Give Claude one job per session.** Copy a prompt from `PROMPTS.md`.
5. **At the end, type `/wrap-up`.** Claude saves what it did in the files. Next time it reads them and continues.

## What is inside
| File | What it is |
|---|---|
| `CLAUDE.md` | Claude reads this every session. Short on purpose. |
| `playbook/` | 14 pages: you, the method, ideas, open source, design, worlds, retention, money, stores, countries, security, launch, tokens, Gobblo lessons. |
| `CHEATSHEET.md` | The 15 steps Claude follows when you ask for an app, and where it stops to wait for you. |
| `IDEAS.md` | 20 apps to choose from, with scores. |
| `briefs/` | One page per app: what it is, what to put in it, how it earns, how to build it, what you do. |
| `ROADMAP.md` | The plan, your weekly rhythm, the money milestones. |
| `PROMPTS.md` | Sentences to copy and paste. |
| `research/` | Facts with links and dates, so Claude does not search twice. |
| `tools/` | Three small calculators: money (`roi.py`), difficulty (`dda_sim.py`), colours (`contrast.py`). |
| `templates/` | The starter for a new app and the idea card. |
| `.claude/` | The skills (`/find-ideas`…), the helper agents, the safety settings. |

## Your first three sessions
1. **Read `ROADMAP.md` and `IDEAS.md`.** Tell Claude what you disagree with. It will change the files.
2. **Pick 3 numbers from `IDEAS.md`** and say: "Run /score-idea on 2, 1 and 4." You get proof or a "no" for each.
3. **Pick the next app** and say: "/make-app <name>". Claude follows `CHEATSHEET.md` and stops when it needs you.

## What only you can do
- Choose (ideas, the look, the name).
- Pay (Apple $99 a year, Google $25 once) when you decide.
- Test on your phone and say what feels wrong.
- Build the tester group: 15–20 people with Android phones. Start now; it is free and every Android app needs it.
- Make art in Flow and short videos.

## Things to tell Opus if it drifts
- "Too long. 5 lines."
- "Show me, don't describe."
- "One recommendation."
- "This looks like every AI app. Run /slop-check."
- "This looks like Gobblo. Each app has its own world. Read playbook/05."
- "Did you check that or guess it?"
- "US users only. English. No Arabic, no Darija."
- "Read PROGRESS.md and continue."

## Try the first app (Paper Pines) on your phone
On a computer that has the repo and Node installed:
1. Open a terminal in the folder `apps/paper-puzzles`.
2. Run `npm install` (first time only).
3. Run `npx expo start`. A QR code appears.
4. On your phone, install the app **Expo Go** from the store, open it and scan the QR code. Phone and computer must be on the same Wi-Fi.
No computer? Ask Claude in a cloud session: "Run Paper Pines and show me the preview."
