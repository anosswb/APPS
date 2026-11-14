# Idea: Shift app

**One line:** Americans on rotating and 12-hour shifts, blue collar first, can see every shift, their hours for the pay period and the days to payday in one look, without an app that loses their schedule.
**The special thing:** "The only shift calendar made by a 12-hour shift worker, for people who work with their hands."
**Date / by:** 14 Nov 2026 · Claude, with two helper reports (`shift-app-market.md`, `shift-app-reviews.md`). Anass picked this idea on 14 Nov 2026 and asked for blue-collar features.

## Proof (thinner than we want: store pages and Reddit were blocked)
- **Search phrases:** shift calendar, shift work calendar, shift planner, work schedule app, 12 hour shift schedule, 2 2 3 schedule, DuPont schedule, Pitman schedule, overtime calculator, attendance point system. From app titles; no volumes. One language (US rule).
- **Competitors that earn:** Shifter ("Plus" $7.99) · Shift Days ($2.99 a month or $24.99 a year) · Supershift (28K ratings on Google Play, purchases). All "a source says".
- **What their users hate:** broken sync (about 15 reviews), lost data on a new phone (about 8), dates that drift, hard setup of long rotations, widgets showing the wrong month, silent support.
- **The gap:** they all show when you work, and nobody keeps that data safe and turns it into pay-period hours with payday on screen. No app found is made for blue-collar workers. No consumer app found tracks attendance points.

## Scores (0–5, P = proof, G = guess)
| Demand | Money fit | Build cost | Gap | Edge | Reach | Risk | Habit | Total |
|---|---|---|---|---|---|---|---|---|
| 3 P (16% of US workers off daytime hours; no search volumes) | 3 P (unlock money from iPhone only; tool ads pay little) | 4 G | 3 P (data loss, payday, no blue-collar app) | 5 P (Anass works 12-hour shifts) | 4 G | 4 G (no content, no server) | 5 P (looked at every day; widget) | **31** |

## Money
iPhone: one-time unlock ($4.99–6.99 to test). Android: light ads, never on the calendar.
`python3 tools/roi.py --installs 50 --d1 0.5 --d30 0.25 --t1 0.9 --t2 0.05 --inter 0.2 --banner 1 --iap 0.01` → about 3,480 daily users and **about $1,200 a month**. Weak model: the purchase number (one cent per daily user per day) is a guess, and ads on a tool pay almost nothing ($0.0017 per daily user). **This app earns only if iPhone users buy the unlock.**

## Blue-collar features: what the research says
| Feature | Evidence | Decision |
|---|---|---|
| Hours per pay period, payday on screen and a countdown | asked for in reviews | version 1 |
| Rotation presets (2-2-3, 4 on 4 off, DuPont, Pitman, 3×12, 24/48, 48/96) with a 12-month preview | hard setup is a top complaint | version 1 |
| Free backup and restore; export to the phone calendar | lost data is a top complaint | version 1 |
| Widget: today's shift, next day off | loved, and broken in the leader | version 1 if the build allows it (needs native code; check first) |
| Overtime (time and a half after 40 h, double time), forced-overtime mark | no review asked; a rule page says the maths is not simple | test with real workers first; estimate only |
| Shift differential | same | test first |
| Attendance points with drop-off dates | no consumer app exists; people buy trackers on Etsy; no review asked | the most original idea; test first |
| Time-off balance, month as a picture, night look, glove-size buttons | not in the reviews; Anass's own knowledge | Anass decides |

## Three ways this fails, and the answer to each
1. **Free apps already do the calendar.** *Answer:* win on the three things they break: never lose data, set up in 20 seconds, payday and hours on the first screen.
2. **Nobody proved blue-collar workers want pay and points in a calendar.** *Answer:* Anass is one; and before building those parts, ask 10 US workers in their groups (or read their threads once Reddit can be reached).
3. **Money comes from iPhone only.** *Answer:* true. Build both, expect Android to bring users and reviews and iPhone to bring the money. It needs the Apple account before it can earn.

## Cheapest test before building
One or two days: the rotation engine and a plain month view with five presets, in the browser. Anass enters his own real roster. If it is not faster than his paper or photo, stop.

## Verdict (Claude): BUILD
Score 31, Edge 5. Start with the calendar that cannot lose data and the pay-period view; put overtime, differential and points behind a test with real workers.

## Decision (Anass): BUILD — 14 Nov 2026
"Shift app, and make some features related to blue collar."
