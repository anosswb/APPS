# PROGRESS.md — Paper Pines

Path: `CHEATSHEET.md` at the repo root. Anass said "choose the best app and start", so steps 1–9 were done in one go on 13 Nov 2026 and his stop points are collected under "Waiting for Anass".

## Done (13 Nov 2026)
- **Step 2, proof:** market report and 565 real reviews read by helper agents (`research/ideas/daily-paper-puzzles-*.md` at the repo root). Limits: store pages could not be opened directly; numbers are rough.
- **Step 4, name:** working title "Paper Pines" (web search only; stores and trademarks not checked).
- **Steps 5–8, docs:** `docs/brief.md`, `world.md`, `retention.md`, `money.md`, `store.md`.
- **Step 7, engine:** generator, logic solver with 11 techniques in 3 tiers, hints, daily puzzle, the Book with difficulty waves and relief, save system with migration. 25 tests green, including a brute-force proof of one answer on 170 puzzles. A puzzle is made in under 40 ms on this machine.
- **Step 9, first screens:** front page, puzzle screen (tap, drag, undo, hints, mistakes shown, SOLVED stamp), rules page. Light and dark. Seen working in a phone-sized browser (web build), including solving a puzzle with hints and real taps.
- App text proofread for American English by a helper agent; fixes applied.

## Done (14 Nov 2026)
- **Past puzzles:** a month calendar. Solved days are inked red, a started day has a red dot, future days are greyed out. Any day back to 1 Nov 2026 can be played.
- **Settings:** look (Auto / Day / Night), sound, vibration, how to play, privacy line, credits, version.
- **Sound:** pencil tick (grass), a firmer tap (tent), a stamp thud (solved). Made by our own script (`scripts/gen-sounds.py`), measured for level and length. They stay quiet when the phone is on silent and do not stop the player's music.
- **Puzzle screen:** Undo and Hint moved to a bar at the bottom (thumb zone); a "Tents 3 of 13" counter.
- Save format version 2 (adds the sound switch), with a test that an old save keeps everything.
- 31 tests green. Seen working in a phone-sized browser: solve, calendar, a past day, settings, and everything still there after a reload.

## Done (14 Nov 2026, later)
- **Icon and opening screen** in the newspaper look, drawn by `scripts/make-icons.js`. App IDs set.
- **Test build on GitHub** (`docs/builds.md`) and automatic checks on pull requests. The Android project generates cleanly; the full build has not run yet.
- **Money:** tested rules (`src/money/rules.ts`), Android ads with consent and test ads, the full-edition page, locked older days with a video (Android) or the full edition (iPhone). Buying is switched off, so nothing is locked on iPhone yet. Seen working in three web previews. Save format version 3.

- **Anonymous numbers:** a closed, tested event list and a tiny sender. Off until a PostHog key exists (`docs/numbers.md`). Save format version 4.
- **Store page drafts** in `store/`: listing text, privacy policy, terms.

- **Two modes, made obvious** (Anass, 14 Nov): the front page shows "Today's puzzle" (one per day, same for everyone) and "The puzzle book · level by level" with a strip of five level boxes: solved ones in red, the current one outlined, the big fifth one with a heavy border. After the daily puzzle, a button leads straight to the next level ("Keep going: Puzzle No. 13"), so nobody hits a dead end.
- **New icon** (Anass asked for something about paper): a corner of the puzzle page with a masthead rule, a small grid, one tree and one tent. Picked from three options.

- **Daily reminder** ("you can wait a whole day but you come back"): one note a day, only if the player says yes. Asked once, under a solved daily puzzle. 8 AM, Noon or 7 PM, or Off, in Settings. No note for a solved day; the notes stop after a week of silence; a tap on the note opens today's puzzle. Made on the phone, no server. Save format version 5. 65 tests green. Seen working in a browser with pretend notes (`EXPO_PUBLIC_REMINDER_PREVIEW=1`).
- **Screen readers:** with VoiceOver or TalkBack on, every square is read aloud ("Row 2, column 3, grass") and changed with a double tap; the row and column numbers say how many tents are wanted and placed. Tested in a browser with a pretend screen reader (`EXPO_PUBLIC_READER_PREVIEW=1`), not with a real one.
- **Small phones:** home, calendar, a 10 × 10 Sunday puzzle with a hint open, and Settings all fit at 360 wide with nothing cut off. On that size the squares of a 10 × 10 are 30 points, under the 44-point comfort size; 6 × 6 to 8 × 8 are fine.
- **Open-source licenses page** in Settings: 57 shipped packages with copyright lines and the licence texts, made by `scripts/make-licences.js` and guarded by a test. 69 tests green.
- The Android and iPhone JavaScript bundles both build (seen while making the licence list). The native Android build has still not run.

## Done (14 Nov 2026, after Anass's first phone test)
- **The app runs on his phone.** The first build closed at opening (code shrinking removed a part the ads library needs); shrinking is off, and GitHub now opens every changed build on an emulator ("launch test").
- **His verdict:** "it's good honestly". Sounds: too loud, cheap, noisy. No ad seen by puzzle 8.
- **New sounds** (second set): four soft notes for marks, two notes for a tent, a five-second winning tune. All quieter. Made by `scripts/gen-sounds.py`. Waiting for his ears.
- **Ads:** a status block at the bottom of Settings in test builds (consent, library started, ad loaded or the error, minutes since first opening). A failed load is retried. The cause of "no ad at puzzle 8" is not known yet: it is either the 10-minute quiet start or a load problem; the status block will say.
- **Difficulty adapts both ways** in the puzzle book: kinder after many hints, harder after two fast clean solves, back toward normal after a hint or a slow solve. Save format version 6. 74 tests green. The time thresholds are a guess; nobody has played with it yet.
- **Second phone test (Anass):** "a good game, I love it", the new sounds are good, ads are working, the app never closed.
- **Stuck help:** the Hint button lights up after 45 seconds with no mark. Seen working in the browser. The Candy Crush system from Anass's video is written up in `playbook/06` (A3b).
- **Two challenge modes** on the front page: "Beat the clock" and "One pot of ink". Both can be lost; the algorithm sets each player's time and ink. Lose screen with a video for more (Android), try again, closeness line. Save format version 7. 84 tests green. Played in the browser with pretend ads: lose, video, second video, try again with more room, win, next level. Not yet played on a phone, and the starting numbers (time × 3, N = 4) are guesses.
- **Personal bests:** best time per grid size with no hints, and win runs in the two challenges. Shown on the solved screen and in a "Your bests" block on the front page. Save format version 8. 88 tests green. Seen working in the browser.
- **Praise:** one headline after each solve that names what the player did, in a puzzle editor's voice (ten kinds, two to four wordings each). 97 tests green. Seen in the browser.
- **Latest test build (14 Nov 2026, evening):** GitHub run 43624193586 on `main`, with everything above. Anass has not reported on this one yet. Not yet tried on his phone: the two challenge modes, personal bests, compliments, the stuck help, the reminder.

## Done (15 Nov 2026, Anass's feedback on run 43624193586: "all good")
- **Ink is the main game:** the front page leads with "One pot of ink" (big headline, ink pot drawing, the pot as drops, win run). "Beat the clock" second, with a stopwatch drawing. Then today's puzzle. The book is now **Free play** (no clock, no ink limit).
- **In a challenge:** the pot is a row of drops that empty, the last two in red; the clock is a bar that empties. Seen in the browser, light and dark.
- **Ads** come after a won ink or clock puzzle too (they only came in the book before). 98 tests green.
- **Real ads:** waiting for Anass's AdMob IDs (steps in `docs/money.md`).

## Done (16 Nov 2026)
- **Ads only at a good moment** (Anass got an ad on his first win after opening): a full-screen ad needs 3 games since opening or since the last ad, and the last 2 won. Never after a loss. Tested (101 tests); not yet seen on a phone. The Settings status block shows the count.
- Test build run 43775764360 (ink as the main game) built fine.

## Not checked (needs a real phone)
**The reminder has never run on a phone.** The rules are tested and the code compiles against the real library, but no real note has been seen. Steps to try it: `docs/builds.md`. · 
**The ads code has never run on a phone.** It compiles against the real library; the first test build will show if ads load and close properly. · 
**The sounds: nobody has heard them yet.** Listen for: the pencil tick 20 times in a row (annoying?), the tent tap (hollow?), the stamp (does it sound like a stamp on a phone speaker?). · 
Touch feel and drag on a real screen · haptics · the stamp animation on device · font loading speed · Android back button · small phones (360 dp) and very large text.

## Decided by Anass
- 13 Nov 2026: the newspaper look is approved (from screenshots).

## Waiting for Anass
1. Get the test app on your phone (steps in `docs/builds.md`). Say what feels wrong: touch, sounds, ads, the reminder.
2. Is the name "Paper Pines" OK as a working title?

## Next (in order)
1. Fixes from Anass's phone test (look, feel, sounds).
2. Try TalkBack on the test phone; try the phone's largest font size (the app caps text growth at 1.4×, never tried).
3. Decide if a 10 × 10 Sunday is too small on a small phone (30-point squares at 360 wide). If yes: make Sunday 9 × 9 on narrow screens.
4. Turn the numbers on (PostHog key, steps in `docs/numbers.md`).
5. Real AdMob IDs (steps in `docs/money.md`), after the test build shows test ads working.
6. The iPhone purchase adapter (steps in `docs/money.md`), after the Apple account exists.
7. Name check in the stores and trademark databases; privacy and terms pages; store listing.
8. Android closed test (12 testers, 14 days) as soon as the Play account exists.

## Blocked
- Paid store accounts (Anass decides when).
- Expo's online service is blocked in cloud sessions: use `EXPO_OFFLINE=1 npx expo install`.
