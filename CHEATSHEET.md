# CHEATSHEET — when Anass says "make me an app"

Follow these steps in order. Do not skip one. Do not start a step before the gate of the one before is passed. Each step ends with something Anass can **see**. `/make-app <idea>` runs this page.

**Before step 1 (every session, 2 minutes):** read `playbook/00-anass.md`, `PROGRESS.md` and the newest file in `research/`. Nothing else until a step asks for it.

| # | Step | What you do | Anass sees | Gate to pass |
|---|---|---|---|---|
| 1 | **Say it back** | If the idea has a brief in `briefs/`, read it first (it is a first draft, not proof). One line: who it is for, what it does, the special thing, how it earns on Android and on iPhone. If he gave no idea, take the top of `IDEAS.md` and say why in 3 lines. If it cannot earn with our rails (playbook/07), say so now. | 4 lines | He says "yes, that one" ⏸ |
| 2 | **Prove it** (`/score-idea`) | Real search phrases, 3 competitors that earn, the gap, the 3 best reasons it fails. Verdict: build, twist or park. | Score card, 5 lines | Score 28+, Gap or Edge 3+, and his yes ⏸ |
| 3 | **Read the reviews** (`/mine-reviews`) | 3–5 competitors. What users hate, miss, love. Five rules for our app. | 6 lines | The gap sentence is clear |
| 4 | **Name and repo** (`/new-app`) | Name check (stores, trademark, domain, handles). Create the app's folder under `apps/` and copy the starter. | The name and what was checked | He accepts the working name ⏸ |
| 5 | **Brief** | `docs/brief.md`: the person, the 3 things version 1 does, what it does NOT do, the one number that says it works. | Half a page | He agrees with "does not do" |
| 6 | **World** (`/app-world`) | 3 looks, each as a picture of the main screen. Own material, colours, type, sound, voice and signature. Nothing from our other apps (`WORLDS.md`). | 3 pictures | He picks or mixes ⏸ |
| 7 | **Grey-box core** | The main loop only, no art: rules as pure functions with tests, one playable round or the one main action. One day. | A test build or preview to try for 5 minutes | He says it is fun, or useful. If not: change the mechanic or stop here ⏸ |
| 8 | **Retention and money** (`/retention-plan`, `/money-plan`) | Loops, difficulty, reasons to return, where ads and the paywall go, `tools/roi.py` lines, costs. | 6 lines each | No ad at the protected moment; nothing from "the line we do not cross" |
| 9 | **First real screen** | Tokens file, then the MAIN screen fully finished: all states, light and dark, sound, haptics. Then `/slop-check`. | Screenshot before and after | Passes the slop checks and he likes it on his phone ⏸ |
| 10 | **Build the rest** | In this order: first 60 seconds (teach by doing) → other screens → settings, privacy, FAQ → ads and purchases with TEST IDs → analytics → translations ready. One screen finished before the next. After each block: checks, screenshot, 3–5 lines. | A short note and something to try, each block | All checks green |
| 11 | **Android test early** | As soon as the app runs (during step 10): closed test with the tester group, 12 people for 14 days. iPhone: TestFlight. Ship 2–3 updates from their feedback. | Day counter | Day 14 reached, feedback handled |
| 12 | **Listing** (playbook/11) | Search words per language, icon, first 3 screenshots, short video, description, privacy and terms pages. | The listing as pictures | He approves name, icon, screenshots ⏸ |
| 13 | **Release check** (`/release-check`) | Quality, privacy and store gates. Read the two official rule pages for changes. | Pass/fail list, max 8 lines | Zero fails, then his yes to submit ⏸ |
| 14 | **Soft launch** | 1–3 small markets for 1–2 weeks. Watch day-1 return, crashes, reviews. Fix the first session. Then worldwide with the translated listing. | Weekly numbers, 5 lines | Day 1 return is not falling |
| 15 | **Day 30 verdict** (playbook/07) | Real numbers into `tools/roi.py`. Grow, fix once, or park. Write the lessons in `playbook/13`, the world in `WORLDS.md`. | Verdict, 5 lines | His decision ⏸ |

⏸ = stop and wait for Anass. Everything else you do without asking.

## Rough size
Steps 1–6: two or three short sessions. Step 7: one day. Steps 8–9: two or three days. Step 10: two to four weeks. Steps 11–13 run beside step 10. A small game or tool should reach the stores in 4–6 weeks. If it is taking longer, version 1 is too big: cut.

## Rules that hold in every step
- **Look before deciding.** Real reviews, real store pages, real screens. Label each fact: seen / a source says / guess.
- **One recommendation.** Not a menu.
- **Show, don't describe.** A picture, a build or a number.
- **Short.** 3–6 lines to Anass. Numbered steps with button names for anything he does by hand.
- **Own world.** If a screen could belong to another of our apps, redo it.
- **Never copy.** Mechanics are free; names, art, levels and text are not. Check every licence in its file.
- **No spending, no push, no submission without his yes.** Do not ask him to pay early.
- **Say what you could not check** (sound, haptics, gestures) and give the 30-second phone test.
- **Save tokens:** one job per session; search and long reading go to a cheaper agent; facts are saved once in `research/`; end with `/wrap-up`.

## If something goes wrong
| Problem | Do this |
|---|---|
| The idea has no proof | Park it in `IDEAS.md` with the reason. Offer the next one. |
| The grey box is not fun | Change one rule and test again, twice at most. Then stop and say so. |
| It looks generic or like our last app | `/app-world` again from the references, not from the code. |
| Anass changes direction after seeing it | Normal. Change the tokens and the world file; log it in `DECISIONS.md`. |
| A store rejects it | Read the exact rule number, fix only that, reply politely, write the cause in `playbook/13`. |
| You are unsure of a fact about money or a store rule | Check the official page today. If you cannot, say "not checked" and give him the 2-minute way to check. |
| The session is long and slow | `/wrap-up`, then `/clear`, then continue from `PROGRESS.md`. |
