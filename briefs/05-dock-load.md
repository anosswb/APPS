# 05 — Dock load
**Game · for casual puzzle players, and anyone who ever loaded a truck · first-guess score 32/40 · about 5 weeks**

## What it is
A packing puzzle. Each level gives you a truck trailer seen from above and a set of freight: pallets, crates, drums, long pipes. Fit everything in. Later, heavy things must go low and some freight must come out first.

## The special thing
A puzzle from real work. It is not a falling-block game: nothing falls and there is no timer. You think like a loader.

## What to put in version 1
- **Drag, turn and place** freight on a grid. Everything must fit.
- **Levels made by code,** each proven solvable.
- **Six chapters,** each adding one rule: turning allowed or not, fragile on top, heavy on the bottom, "first off, last on", two stops, odd shapes.
- Hints that place one piece. Undo. No timer.
- **A daily load,** the same for everyone.
- A route map across the US that fills as you deliver.

## What NOT to put
Falling pieces, a countdown, lives, driving.

## The world (first direction)
A loading dock: corrugated cardboard, stencil lettering, yellow floor tape. **Signature:** when the load is complete, the trailer door rolls down and a shipping label prints with the level number.

## Why people come back
The next rule, the route map, the daily load. Difficulty in waves with a hard "full trailer" level every fifth one (`playbook/06`).

## How it earns
- **Android:** a video for a hint; a full-screen ad every third level, not in the first ten minutes.
- **iPhone:** chapters 1–2 free, one-time unlock for the rest ($3.99).
- **Protected moment:** while packing.

## Build order
1. Level maker and solver: cut a full trailer into pieces, shuffle them, and prove it can be packed. Add rules one by one, with tests.
2. Grey box: is dragging and turning a pallet pleasant with one thumb?
3. Chapters, hints, daily, map.
4. World and sound (tape, cardboard, the door), then `/slop-check`.

## Check first
Packing and block-fitting puzzles in the US store, so ours is clearly different in rules and look (Apple's "indistinguishable" rule) · reviews of those games.

## What Anass does
Plays the grey box. Gives real loading details for the rules and the art.

## Biggest risk
It can look like a block puzzle at first sight. **Answer:** the real-work rules (weight, order, stops) and the dock world, shown in the first screenshot.
