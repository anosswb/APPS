# 03 — No-guess mines
**Game · for people who loved the classic hidden-mines game · first-guess score 32/40 · about 3 weeks**

## What it is
The classic grid: numbers tell you how many hidden things touch each cell. Our version makes one promise: every board can be solved by thinking. You never have to guess and lose by bad luck.

## The special thing
"Never a guess." And when you lose, it shows you the cell you could have proven safe, so you get better.

## What to put in version 1
- Boards in four sizes. The first tap is always safe and opens an area.
- **A daily board,** the same for everyone.
- **Thumb-friendly input:** a clear switch between "open" and "mark", long-press as a shortcut, zoom on big boards.
- **"Show me the next step":** highlights the cells that prove it.
- **After a loss:** "This one was provable. Here is how."
- Simple stats: boards won, win rate. Timer optional, off at first.

## What NOT to put
Boards that need luck, a timer by default, a war or bomb theme.

## The world (first direction)
Two candidates to show Anass as pictures: **a technical drawing** (blue grid lines on drafting paper, an engineer's stamp on a solved board) or **a meadow** (find the beehives, soft daylight). **Signature:** the chain of cells opening like a ripple, with a sound that climbs as it spreads.

## Why people come back
The daily board. A win streak that forgives one loss a week. Bigger boards unlock as skill grows. A session is short, so people play several.

## How it earns
- **Android:** after a loss, a video to undo the last tap (the fail moment). A full-screen ad between boards, at most one every four minutes.
- **iPhone:** one-time unlock ($2.99–3.99): the biggest boards, unlimited undo, extra looks.
- **Protected moment:** an open board.

## Build order
1. Board maker with a solver: make a board, solve it from the first tap by logic only, throw it away if a guess is needed. Tests prove it on thousands of boards.
2. Check it is fast enough on a cheap phone for the biggest size.
3. Grey-box input. Then daily seed, next-step hint, loss explainer.
4. World, then `/slop-check`.

## Check first
Existing "no guess" versions and their reviews · that our name is our own (the famous name belongs to someone else) · how small a cell can be and still be tapped (44 pt rule).

## What Anass does
Plays the grey box and says if tapping feels right on his phone. Picks the world.

## Biggest risk
It is an old, well-known game. **Answer:** the promise in the name and the first screenshot, plus the teaching. Cheap and fast to build, so the risk is small.
