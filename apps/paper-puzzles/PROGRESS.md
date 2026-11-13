# PROGRESS.md — Paper Pines

Path: `CHEATSHEET.md` at the repo root. Anass said "choose the best app and start", so steps 1–9 were done in one go on 13 Nov 2026 and his stop points are collected under "Waiting for Anass".

## Done (13 Nov 2026)
- **Step 2, proof:** market report and 565 real reviews read by helper agents (`research/ideas/daily-paper-puzzles-*.md` at the repo root). Limits: store pages could not be opened directly; numbers are rough.
- **Step 4, name:** working title "Paper Pines" (web search only; stores and trademarks not checked).
- **Steps 5–8, docs:** `docs/brief.md`, `world.md`, `retention.md`, `money.md`, `store.md`.
- **Step 7, engine:** generator, logic solver with 11 techniques in 3 tiers, hints, daily puzzle, the Book with difficulty waves and relief, save system with migration. 25 tests green, including a brute-force proof of one answer on 170 puzzles. A puzzle is made in under 40 ms on this machine.
- **Step 9, first screens:** front page, puzzle screen (tap, drag, undo, hints, mistakes shown, SOLVED stamp), rules page. Light and dark. Seen working in a phone-sized browser (web build), including solving a puzzle with hints and real taps.
- App text proofread for American English by a helper agent; fixes applied.

## Not checked (needs a real phone)
Touch feel and drag on a real screen · haptics · the stamp animation on device · font loading speed · Android back button · small phones (360 dp) and very large text.

## Waiting for Anass
1. Try it on your phone with Expo Go (steps in the last message of the session, or `START_HERE.md`). Say what feels wrong.
2. Is the newspaper look right, or do you want to see two other looks?
3. Is the name "Paper Pines" OK as a working title?

## Next (in order)
1. Fixes from Anass's phone test.
2. Fill the empty lower half of the puzzle screen on small grids; a calendar of past days with stamps (the archive).
3. Settings page: theme, haptics, licences, "not affiliated" and privacy text.
4. Sound: pencil, paper, stamp (recorded or CC0), with a switch.
5. Screen-reader labels for each square; largest-font check; 360 dp check.
6. Anonymous analytics with a closed event list (playbook/10) and the one number (puzzles finished on day 1).
7. Money: Android ads between Book puzzles, iPhone one-time unlock (needs a development build; the app stops working in Expo Go from then on).
8. Our own icon and splash (the template's placeholders are still in `assets/`).
9. Name check in the stores and trademark databases; privacy and terms pages; store listing.
10. Android closed test (12 testers, 14 days) as soon as the Play account exists.

## Blocked
- Paid store accounts (Anass decides when).
- Expo's online service is blocked in cloud sessions: use `EXPO_OFFLINE=1 npx expo install`.
