# PROGRESS.md

## Where things stand (14 Nov 2026, evening) — read this first
- **Paper Pines** (`apps/paper-puzzles/`): runs on Anass's phone and he likes it ("a good game, I love it"). It has: the daily puzzle, the puzzle book with difficulty that adapts both ways, two challenge modes that can be lost (clock, limited ink), personal bests, compliments, a daily reminder, soft sounds, test ads that work. Test builds come from GitHub (`apps/paper-puzzles/docs/builds.md`). Next: his feedback on the latest build, then the store work. Details: its `PROGRESS.md`.
- **Shift app** (`apps/shift-app/`): research, brief and a grey box with tested rules. Anass saw the grey box and gave the real requirements (irregular work and rest days, his own overtime percentages, wake-up alarm, day and food planning, a lively modern look). They are in `apps/shift-app/docs/brief.md`. Next: the look (three directions as pictures), then the real first screen. Details: its `PROGRESS.md`.
- **Dock load:** checked and parked (the block-puzzle store is full). The two reports stay in `research/ideas/`.
- **How Anass works:** one session per app. Short, simple English. Show pictures. He decides fast and wants things built, not discussed.

## Pickleball open play (21 Nov 2026, night) — newest
- **Dinkline** (`apps/pickleball/`, working title): queue, fair rotation onto 1–8 courts, big scorer, full-screen board. Built overnight with Anass's yes. Blue court look, made more stylish after his message ("I prefer the blue one, make it more stylish"). Android test APK (v3.1): https://github.com/anosswb/APPS/actions/runs/45012552976 (Artifacts → dinkline-test-apk); emulator launch test passed. Details and next steps: `apps/pickleball/PROGRESS.md`.
- Firecrawl credits used this night: about 36 of the 1,000 Anass allowed (32 by the review helper, 4 name searches).

## Done
- 2026-11-13: repo created. Playbook (14 pages), research file, roadmap, tools, starter template, skills and agents.
- 2026-11-13: `CHEATSHEET.md` (15 steps from "make me an app" to the stores, with `/make-app`) and `IDEAS.md` with 20 apps (scores are guesses).
- 2026-11-13: `briefs/` with a full first-draft brief for each of the 20 apps.
- 2026-11-13: market rule from Anass: US first, English only, no Arabic, no Darija. Eight ideas removed, eight US ideas added, list renumbered; `playbook/09` rewritten for the US.

- 2026-11-13: everything moved into the APPS repo: playbook at the root, idea briefs in `briefs/`, real apps in `apps/`.
- 2026-11-13: **first app started: `apps/paper-puzzles/` (Paper Pines).** Research by helper agents, engine with 25 passing tests, three screens seen working. Its own `PROGRESS.md` has the details and what is next.

- 2026-11-14: **second app started: `apps/shift-app/` (shift calendar for blue-collar shift workers).** Research, brief and a tested grey box. Dock load was checked and parked. Details in `apps/shift-app/PROGRESS.md`.
- 2026-11-14: Paper Pines got past puzzles (calendar), settings, sound and a bottom tool bar. Details in `apps/paper-puzzles/PROGRESS.md`.

## Next
1. Paper Pines: Anass's feedback on the latest test build; then name check, AdMob IDs, store listing (`apps/paper-puzzles/PROGRESS.md`).
2. Shift app: the look, then the first real screen (`apps/shift-app/PROGRESS.md`).
3. Anass starts the Android tester group (15–20 people).
4. `/score-idea` on the next two ideas Anass picks from `IDEAS.md`.

## Blocked / waiting
- Paid accounts (about 1 Dec, Anass decides).
- Not checked yet: which Moroccan banks Apple pays to; whether any web checkout pays sellers in Morocco.
- Cloud sessions cannot open the App Store, Google Play or Expo's online service (blocked hosts). Research used search snippets and a scraper tool.

## Notes for the next session
- Idea scores in IDEAS.md are guesses until `/score-idea` runs. Idea #2 now has real research in `research/ideas/`.
- Gobblo lives in its own repo and keeps its own plan.
