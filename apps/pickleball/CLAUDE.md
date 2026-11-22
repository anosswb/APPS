# CLAUDE.md — Dinkline (working title), pickleball open play

One phone at the court runs pickleball open play: the line of waiting players, fair rotation onto 1–8 courts (doubles), and a big scorer (side-out and rally). US users, English. The repo-wide rules in the root `CLAUDE.md` apply here too. Branches start with `pickleball/`.

## One line
The person running open play can see who is next and keep score from one phone, without a whiteboard, a paddle rack argument or an account. **The special thing:** every game is drawn as a painted US hard court with the four names on it, and the line shows why each person is where they are.

## Read before working (only what the task needs)
1. `docs/brief.md` — the person, the pain, what v1 does and does not do
2. `docs/world.md` — look, voice, signature (Hard Court). Pictures of the 3 directions in `docs/world/`
3. `docs/retention.md`, `docs/money.md`, `docs/store.md`
4. `docs/builds.md` — how the test APK is built
5. `PROGRESS.md`, `DECISIONS.md`
Research: `research/2026-11-21-pickleball-reviews.md` at the repo root.

## Stack
Expo SDK 58 (React Native 0.88, React 19, TypeScript strict). No Expo Router: five tabs (floating glass tab bar) and the scorer, board and licences screens switch in `App.tsx`. Storage: AsyncStorage with `SCHEMA` (`src/state/storage.ts`). Add packages with `EXPO_OFFLINE=1 npx expo install <pkg>` in cloud sessions.

## Where the code is
| Folder | What |
|---|---|
| `src/logic/scoring.ts` | Side-out and rally scoring, the "4-2-1" call, game point. Pure, tested |
| `src/logic/session.ts` | Players, the line, courts, rotation (all four off / winners stay / winners split), fair partners. Pure, tested |
| `src/logic/history.ts` | Session records, game lengths, stats for today/week/all time. Pure, tested |
| `src/logic/achievements.ts` | The 20 awards (player + host). Pure, tested |
| `src/logic/goals.ts` | Goals and their progress. Pure, tested |
| `src/state/` | Saving (versioned), the session hook with 30-step Undo, the clock |
| `src/theme/tokens.ts` | Every colour, size, font. Nowhere else |
| `src/i18n/en.ts` | Every word. The name is `APP_NAME` there |
| `src/ui/` | Glass (drawn liquid glass), Ambient (background light), Bits (stat, ring, segments), Icon set, Button, CourtSurface (the signature), LineTag, ShareCard, badges |
| `src/screens/` | Courts (home), Scorer, Board, Players, History, Awards, Settings, Licences |
| `scripts/launch-test.sh` | Used by the emulator launch test workflow |
| `scripts/make-licences.js` | Makes `src/config/licences.json` for the Licenses page. Run it after adding or updating a package (command at the top of the file) |
| `store/listing.md` | Store listing draft |

## Hard rules for this app
- Rules live in `src/logic/` as pure functions with tests. Screens never decide who plays next.
- **No ad while a game is played or scored.** The only ad is one full-screen ad after Game over, when `adAfterGame` in `src/money/rules.ts` allows it (game of 3+ minutes, 10 minutes since the last ad). Anass, 22 Nov 2026. No banner, no other pop-ups.
- **A game waits for Start game.** Four put on a court are "ready"; the clock starts when the host taps Start game (or scores a point).
- The fairness test in `session.test.ts` (games played stay even, partners spread out) must stay green.
- Storage changes: bump `SCHEMA`, migrate, test. Never lose a running session.
- Dark and light mode follow the phone; there is no setting (Anass, 22 Nov 2026). Colours only from the palettes in `src/theme/tokens.ts`, styles through `themed()` in `src/theme/theme.tsx`. Targets 56 pt minimum.
- Awards are worked out again from the session records every time (`src/logic/achievements.ts`); never store "earned" flags that can get out of step. Only `seen` (banner already shown) is stored.

## Anass approves the look first (22 Nov 2026)
Before pushing any change he can see, send him screenshots of the changed screens and wait for his OK. Push only after he approves.

## Checks before saying "done"
`npx tsc --noEmit` · `npx jest` · `npx expo export --platform web`, then open it at 390×844 and look at the screen you changed.
