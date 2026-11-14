# CLAUDE.md — Paper Pines (working title)

A calm daily logic-puzzle game for iOS + Android, for adults in the United States. First puzzle type: **Tents** (one tent beside every tree, tents never touch, numbers on rows and columns). The repo-wide rules in the root `CLAUDE.md` apply here too.

## One line
A quiet puzzle page on your phone: one puzzle a day that everyone shares, plus an endless book of puzzles, each with one answer and never a guess. **The special thing:** it feels like the Sunday paper (paper, serif, a red SOLVED stamp), nothing ever interrupts a move, and hints explain the thinking.

## Read before working (only what the task needs)
1. `docs/brief.md` — users, what they hate in other apps (565 real reviews), what v1 does and does not do
2. `docs/world.md` — the look, voice and signature. Nothing borrowed from our other apps
3. `docs/retention.md` — daily puzzle, the Book, difficulty waves, the one number
4. `docs/money.md` — Android ads, iPhone unlock, what is free forever
5. `docs/store.md` — store facts for this app
6. `PROGRESS.md` — done / next / blocked. `DECISIONS.md` — why

## Stack
Expo SDK 58 (React Native 0.88, React 19, TypeScript 6 strict). Read `AGENTS.md` first: Expo changes every release, so read the versioned docs before using any Expo API.
- Add packages with `EXPO_OFFLINE=1 npx expo install <pkg>` in cloud sessions (Expo's online service is blocked there; the offline flag uses the version list shipped inside Expo). On Anass's own machine plain `npx expo install` is fine.
- Test builds come from the GitHub workflow in `docs/builds.md`. A generated `android/` or `ios/` folder is never committed (it is in `.gitignore`).
- No Expo Router yet: five screens switch in `App.tsx` with a small route object. It is enough for now; move to Expo Router when deep links or tabs are needed.

## Where the code is
| Folder | What |
|---|---|
| `src/game/` | The engine, pure TypeScript, no UI: `generator`, `solver` (logic only, also finds hint steps), `hints`, `daily`, `book`, `bruteforce` (tests only) |
| `src/theme/tokens.ts` | Every colour, size and font name. Nowhere else |
| `src/i18n/en.ts` | Every word the app shows |
| `src/store/` | What is saved on the phone, with `migrate` for old saves |
| `src/ui/` | Board, glyphs, stamp, buttons, text |
| `src/screens/` | Home (front page), Game, Rules, Archive (past puzzles), Settings |
| `scripts/gen-sounds.py` | Makes the three sounds in `assets/sounds/` |
| `scripts/make-icons.js` | Draws the icon and opening-screen art in `assets/` |
| `docs/builds.md` | How Anass gets a test app on his phone (GitHub builds it) |

## Hard rules for this app
- **Every puzzle has exactly one answer and can be finished by logic.** A puzzle is kept only if `solveLogic` finishes it. `engine.test.ts` proves it by brute force. Never weaken these tests.
- **Nothing interrupts a move.** No ad, pop-up or animation over the board while a puzzle is open. No lives, no countdown, no "game over".
- **Hints are free and explain the step.** A hint first points at a mistake, then names the next deduction. New solver techniques need a sentence in `en.ts` and a soundness test.
- Solver deductions must be forced by the rules. The test "every single step agrees with the solution" must stay green.
- Colours, sizes, fonts only from `tokens.ts`. Text only from `en.ts`. `start`/`end`, never `left`/`right`.
- Storage changes: bump `SCHEMA`, extend `migrate`, add a test. Never drop a player's progress.
- Daily and Book seeds (`daily-YYYY-MM-DD`, `book-<level>-<relief>`) must not change after launch, or everyone's puzzles change.
- The name is in `src/config/app.ts` only.
- `FIRST_EDITION` in `src/game/archive.ts` (the first day with a daily puzzle) must not change after launch.

## Checks before saying "done"
```bash
npx tsc --noEmit
```
```bash
npx jest
```
```bash
npx expo export --platform web
```
Then open the web build at phone size, light and dark, and look at the screen you changed.
