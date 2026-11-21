# PROGRESS.md — Dinkline (pickleball open play)

## Where it stands (21 Nov 2026, night)
Version 1 is built and runs: the line, fair rotation onto 1–8 courts, the big scorer, players, settings, saved on the phone. 37 tests pass. Screens checked in a phone-size browser (`docs/screens/`). Android test APK: see "Builds" below.

## Done (21 Nov 2026, one night session while Anass slept)
- Step 2–3: review research (`research/2026-11-21-pickleball-reviews.md`, one Sonnet helper, 32 Firecrawl calls; plus 4 name searches by me). No fatal problem.
- Step 4: folder from the starter, name check (light), brief, retention, money draft, store facts.
- Step 6: three directions as pictures (`docs/world/three-directions.png`), A · Hard Court picked by Claude (`docs/world.md`).
- Step 7/9/10: rules first with tests (`src/logic/`), then Courts, Scorer, Players, Settings. Slop-check by the design-critic agent; top fixes applied.
- Android: `pickleball-test-build.yml`, `pickleball-launch-test.yml`, `pickleball-checks.yml`.

## Done later the same night
- Full-screen board ("Show the board") with who is next and who plays, in huge type.
- Winners-split rotation rule, with tests (41 tests now).
- Style pass v2 after Anass's message: blue scoreboard header, painted kitchens and net, paddle-rack line, italic numbers, black tab bar, court lines in the scorer (`docs/world.md`).
- Store listing draft (`store/listing.md`).
- Emulator launch test passed for v1 (app alive after 45 s, Courts screen on screen).

## Next (needs Anass)
1. Try the APK at a real court (or with 8 names at home): add names, end games, score one game. Tell me what felt slow or wrong.
2. The look: he picked the blue one (A) and asked for more style; v2 is built. Next: his reaction on the phone. The name (Dinkline is a working title, not trademark-checked).
3. Say yes or no to the money plan (`docs/money.md`): iPhone unlock at $4.99 for 3+ courts / winners-stay / saved groups; Android banner only on Players and Settings.

## Next (Claude, after his feedback)
- Saved groups, skill-level courts, timed rotation, a "why you sat" line per player.
- Ads (test IDs) and the iPhone purchase, after his yes. Remember minify off with Google Mobile Ads.
- Licences page (fonts are SIL OFL; reuse `apps/paper-puzzles/scripts/make-licences.js`), privacy page; listing draft exists.

## Not checked
- Haptics, keep-awake and the keyboard on a real phone (web preview can't show them).
- Sunlight readability on a real screen outdoors.
- iPhone build (no Mac / no Apple account in the cloud).
