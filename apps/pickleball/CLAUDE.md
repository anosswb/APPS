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
Expo SDK 58 (React Native 0.88, React 19, TypeScript strict). No Expo Router: three tabs and the scorer switch in `App.tsx`. Storage: AsyncStorage with `SCHEMA` (`src/state/storage.ts`). Add packages with `EXPO_OFFLINE=1 npx expo install <pkg>` in cloud sessions.

## Where the code is
| Folder | What |
|---|---|
| `src/logic/scoring.ts` | Side-out and rally scoring, the "4-2-1" call, game point. Pure, tested |
| `src/logic/session.ts` | Players, the line, courts, rotation (all four off / winners stay), fair partners. Pure, tested |
| `src/state/` | Saving (versioned), the session hook with 30-step Undo, the clock |
| `src/theme/tokens.ts` | Every colour, size, font. Nowhere else |
| `src/i18n/en.ts` | Every word. The name is `APP_NAME` there |
| `src/ui/` | Icon set, Button, CourtSurface (the signature), LineTag |
| `src/screens/` | Courts (home), Scorer, Players, Settings |
| `scripts/launch-test.sh` | Used by the emulator launch test workflow |
| `scripts/make-licences.js` | Makes `src/config/licences.json` for the Licenses page. Run it after adding or updating a package (command at the top of the file) |
| `store/listing.md` | Store listing draft |

## Hard rules for this app
- Rules live in `src/logic/` as pure functions with tests. Screens never decide who plays next.
- **Never an ad or pop-up on the Courts screen or the Scorer.** Those are the moments people look at the phone at the court.
- The fairness test in `session.test.ts` (games played stay even, partners spread out) must stay green.
- Storage changes: bump `SCHEMA`, migrate, test. Never lose a running session.
- Light mode only (outdoor sun). Targets 56 pt minimum.

## Checks before saying "done"
`npx tsc --noEmit` · `npx jest` · `npx expo export --platform web`, then open it at 390×844 and look at the screen you changed.
