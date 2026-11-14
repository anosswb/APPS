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

## Next (in order)
0. **Rewrite "Version 1 does" in the brief from his requirements, then step 6, the look:** three directions as pictures of the main screen (`/app-world`). Alive, modern, nothing like Paper Pines. He picks. Then the first real screen.
0b. Engine work his requirements need: a mode with no rotation (days marked one by one, rest days first), and overtime rules with the user's own percentages (`src/core/pay.ts` has only the fixed federal rule today).
1. His answers → fix the brief.
2. Name: 5 candidates, check stores, trademark, domain (needs a session that can open the stores).
3. Step 6, the look: three directions as pictures (`/app-world`). Nothing from Paper Pines.
4. Read blue-collar forum threads (needs reddit.com allowed) or ask 10 US workers, before building differential and attendance points.
5. Check the federal overtime rule and the differential rule on the US Department of Labor's own pages before any pay maths beyond the simple estimate.
6. Widget: read how the current Expo version does home-screen widgets.

## Not checked
A real phone · Android and iPhone builds · the 13 ready rotations against real workers' rosters (the tests only prove they are self-consistent) · time zones while travelling.

## Blocked
- Store pages and Reddit cannot be opened from cloud sessions (network rules).
- Expo's online service is blocked in cloud sessions: use `EXPO_OFFLINE=1 npx expo install`.
