# PROGRESS.md — Shift app (working title)

Path: `CHEATSHEET.md` at the repo root. Second app of the factory, picked by Anass on 14 Nov 2026.

## Done (14 Nov 2026)
- **Step 1–2, picked and checked:** score 31/40 (`research/ideas/shift-app.md`). Limits: the store pages and Reddit were blocked, so prices, ratings and blue-collar forum needs are not confirmed.
- **Step 3, reviews:** 546 reviews of three shift apps read by a helper (`research/ideas/shift-app-reviews.md`).
- **Step 4, folder:** `apps/shift-app/` created from the starter. **No name yet** (working title only; no name check done).
- **Step 5, brief:** `docs/brief.md` (draft; three open questions for Anass).
- **Step 7, grey box:** the rules (`src/core/`: dates, rotation, 13 ready rotations, pay period, simple overtime) with 15 passing tests, and one plain screen (`App.tsx`): pick a rotation, say where you are today, see today, the pay period, payday, a month; tap a day to change it; saved on the phone. Seen working in a phone-sized browser. No design on purpose.

## Anass's answer (14 Nov 2026)
He saw the grey box. The plain look shocked him until he understood it was a test with no design. His real requirements are in `docs/brief.md` ("What Anass said"): irregular work and rest days with no pattern, his own overtime percentages, daily reminder and motivation, a wake-up alarm button, day and food planning, help with what blue-collar workers suffer from, and a lively modern look.

## Done (14 Nov 2026, second session)
- **"Version 1 does / does NOT do" rewritten** in `docs/brief.md` from his requirements: the rest-day calendar with no pattern, pay with his own overtime rules, the morning of a shift (alarm button, day line, one evening note).
- **Step 6, three looks drawn:** `docs/looks/three-looks.png` (A Daybreak, B The Board, C The Dial), details in `docs/looks/README.md`. Recommendation was B.
- **His answer:** he loves A and C, but too much on one tab; wants each thing in its place and a special font. **Round 2 drawn:** `docs/looks/r2-calmer.png` (sky look for Today, the ring on a My day tab, four tabs) and `docs/looks/r2-fonts.png` (four fonts). **Waiting for his yes on the mix and a font number.** ⏸

## Done (14 Nov 2026, third block: the rules his requirements need, no screen yet)
- **The calendar with no pattern** (`src/core/days.ts`): mark a day Work (start, end, break), Rest, or leave it "not known yet". Works out: the next rest day, how many rest days in a row, days worked in a row, days since the last rest. When a day in between is not known, the answer says it is **not sure** (the screen must show that, not hide it). A ready rotation only fills days he has not marked.
- **Pay with his own rules** (`src/core/payrules.ts`): the hourly rate and any number of rules, each with a name, an extra percentage and one condition (hours over N in a day · over N in a week · a weekday · a day he marks by hand). One day can be set by hand. Shows hours by percentage, the estimate, and how many days of the period are still open. The fixed federal rule in `pay.ts` (`periodPay`) is now only the old grey box's; `periodOf` and `nextPayday` stay in use.
- **The day around a shift** (`src/core/dayline.ts`): sleep by, wake, leave, eat, clock out, home, from three numbers.
- 30 tests pass (15 new). **The grey-box screen still uses the old rotation setup; these rules get their screen after the look is picked.**
- **Guesses in the pay rules, to check with US workers:** two rules on the same hour → the higher percentage wins (adding is an option) · every worked hour counts toward the daily and weekly limits · a shift belongs to the day it starts on.

## Done (14 Nov 2026, evening)
- **His pick:** screens 1 + 2 together (sky for Today, ring on My day), font 1. Written in `docs/world.md`; tokens in `src/theme/tokens.ts`; contrast passes; row added to `WORLDS.md`.
- **Real screens built** (the grey box is gone from `App.tsx`): Today (rest count, week strip, alarm button that opens the Android clock), Calendar (month, tap to mark), My day (ring, day line, "My numbers"), Pay (a note only). Saved on the phone with a schema version (`src/store.ts`). Seen working in a phone-sized browser (`npx expo export --platform web`). 30 tests pass.
- **Android test build workflow:** `.github/workflows/shift-app-test-build.yml`, how to use it in `docs/builds.md`.

## Done (15 Nov 2026) — after he tried the first APK
He said: write the tap rule; My numbers did not change the app; "just a calendar that looks like shit"; add real help from what blue-collar workers suffer from; premium, manly look with light and dark mode.
- Tap rule on Today and Calendar. Shift-change bug fixed (`MyDay.tsx`).
- Look pass two: themes `dark` and `light` in `src/theme/tokens.ts`, `useTheme`, follows the phone or his choice (My day → Look). Solid day blocks, panels, small capital labels.
- Today got a "now" line (clock in / time left with a bar / shift done, sleep by). Pay is a real tab (rate, three overtime numbers, week and month estimate, "estimate" label).
- Pains research saved: `research/ideas/shift-app-pains.md` (thin: Reddit blocked).
- Seen working in a phone-sized browser in both modes (`docs/looks/real-screens.png`). 30 tests pass. Second APK built from `main`.

## Not done on these screens yet (be honest in the next session)
`/slop-check` not run · night shifts: the "now" line does not follow a shift that started yesterday · pay period and payday not on the Pay tab (week and month only) · "days I mark" pay rule has no screen · no change note on a day · no share-the-month picture · the sun and sky do not animate · no first-time teaching beyond one hint line · largest font size and small phones not checked · shift times cannot be set per day (only the usual shift) · night shifts over midnight not looked at on screen · iPhone alarm path is only a help message · no tests for `src/store.ts`.

## Next (in order)
0. After his pick: write `docs/world.md`, the token file, `tools/contrast.py`, the row in `WORLDS.md`, the decision in `DECISIONS.md`. Then the real first screen.
0b. Done (see above). Left: the saved-data shape with a schema version and a migration from the grey box's `shift-app/grey-box-v1`.
1. His answers → fix the brief.
2. Name: 5 candidates, check stores, trademark, domain (needs a session that can open the stores).
4. Read blue-collar forum threads (needs reddit.com allowed) or ask 10 US workers, before building differential and attendance points.
5. Check the federal overtime rule and the differential rule on the US Department of Labor's own pages before any pay maths beyond the simple estimate.
6. Widget: read how the current Expo version does home-screen widgets.

## Not checked
A real phone · Android and iPhone builds · the 13 ready rotations against real workers' rosters (the tests only prove they are self-consistent) · time zones while travelling.

## Blocked
- Store pages and Reddit cannot be opened from cloud sessions (network rules).
- Expo's online service is blocked in cloud sessions: use `EXPO_OFFLINE=1 npx expo install`.
