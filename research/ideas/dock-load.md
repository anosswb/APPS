# Idea: Dock load

**One line:** people who like a calm block puzzle can load trucks on a freight dock without rigged pieces or ads forced on them.
**The special thing:** "The only block puzzle that promises fair freight: there is always a piece that fits."
**Date / by:** 14 Nov 2026 · Claude, with two helper reports (`dock-load-market.md`, `dock-load-reviews.md`).

**Change from the brief (`briefs/05-dock-load.md`):** the brief is a quiet packing puzzle where all freight is known and nobody loses. Anass wants the Candy Crush kind of algorithm (`playbook/06`, A3b), which needs luck and a way to lose. So: freight arrives a few pieces at a time, each level has a goal (ship N loads with a limited number of pieces), and a level can be lost.

## Proof
- **Search phrases:** block puzzle, block blast, wood block puzzle, woodoku, blockudoku, offline puzzle games, puzzle game for adults (from leaders' titles; no volume data). Nothing found for freight or truck-loading searches. One language only (US rule).
- **Competitors that earn:** Woodoku (est. $1M+ a month on Android, about 70% from ads) · Block Blast! (368M installs in 2025, earns from ads) · Wood Blast (est. $100K+ a month). All "a source says".
- **What their users hate:** too many ads; ads mid-move; an ad after saying no; pieces that feel rigged near a best score, followed by an ad; no working "remove ads"; needs internet.
- **The gap:** they all push ads and are accused of rigging the pieces, and nobody promises fair pieces and ads you can refuse. No freight-dock block puzzle was found on mobile.

## Scores (0–5, P = proof, G = guess)
| Demand | Money fit | Build cost | Gap | Edge | Reach | Risk | Habit | Total |
|---|---|---|---|---|---|---|---|---|
| 5 P (biggest puzzle genre) | 5 P (leaders earn from ads, our only Android rail) | 4 G (grid, pieces, levels by code; no solver proof needed) | 3 P (fairness and ad complaints are loud; theme is free) | 4 G (Anass knows loading work) | 5 G | 2 P (most crowded genre; Apple 4.3; no search demand for the theme) | 4 G | **32** |

## Money
Android: optional video for more pieces after a close loss, one full-screen ad at the end of some levels. iPhone: one-time "no ads".
`python3 tools/roi.py --installs 100 --d1 0.35 --d30 0.06 --t1 0.8 --t2 0.1 --rew 2 --inter 3` → about 1,290 daily players and **about $1,440 a month** (the tool's ad prices; a model, not a promise). About 70 installs a day for $1,000 a month. **Getting those installs is the hard part:** this genre's search results belong to games with hundreds of millions of installs.

## Three ways this fails, and the answer to each
1. **Nobody finds it.** No search demand for the theme, giants on every generic phrase. *Answer:* aim the listing at the complaints ("fair block puzzle", "no forced ads", "offline") and at the niche (truck, warehouse, loading), and test the listing text before building much. Not proven to work.
2. **Apple rejects it as one more block puzzle (4.3).** *Answer:* the loop must differ, not only the skin: trailers that fill and drive off, loading rules (heavy low, long pipes), level goals. Show that in the first screenshot.
3. **The "decide if they win or lose" algorithm backfires.** The reviews show players notice hard pieces near a win followed by an ad, and say so in public. *Answer:* steer only toward help (kinder freight when behind), keep the promise "always one piece that fits", and earn from the optional video after an honest close loss.

## Cheapest test before building
One day: a grey-box round in the browser (grid, three pieces at a time, a trailer that ships when full, a goal, a lose screen). Anass plays it for five minutes. If it is not fun without art, stop.

## Verdict (Claude): TWIST, then build
Build it as the honest block puzzle with a dock world, with the algorithm helping only. If Anass wants the full two-way version (harder when ahead), that is his call; the review quotes above are the cost.

## Decision (Anass): build / twist / park — date, reason
*(waiting)*
