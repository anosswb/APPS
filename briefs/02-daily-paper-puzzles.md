# 02 — Daily paper puzzles
**Game · for adults 30+ who like a quiet puzzle · first-guess score 32/40 · about 5 weeks**

## What it is
Logic puzzles like the ones on a newspaper page: one hand-picked puzzle a day, the same for everyone, plus endless puzzles made by code. Every puzzle has exactly one answer and never needs a guess.

## The special thing
It feels like paper, not like a phone game. No timers, no lives, no pressure. Hints explain the thinking; they do not just show the answer.

## What to put in version 1
- **One puzzle type, done perfectly.** Build three types in grey boxes and let Anass pick the one that feels best. More types come later as "new pages".
- **Today's puzzle,** made from the date so everyone gets the same one.
- **A calendar** of past days with an ink stamp on each solved day.
- **Endless puzzles** in five sizes, from 2 minutes to 20.
- **Hints that teach:** "Look at this row: only one cell can hold it, because…"
- Undo, pencil notes, optional error check (off at first), optional timer (off at first).
- **A tutorial of four tiny puzzles** that teaches by playing.

## What NOT to put
Lives, energy, countdowns, leaderboards, daily login rewards, more than one puzzle type at launch.

## The world (first direction)
The Sunday puzzle page: warm paper, a serif typeface for numbers and titles, pencil for notes and ink for answers. **Signature:** when a row or the whole puzzle is right, a rubber stamp lands with a soft thud.

## Why people come back
The daily puzzle and its calendar of stamps. A bigger "Sunday puzzle" once a week. Difficulty follows the sawtooth in `playbook/06`: size and the solving tricks needed go up in waves.

## How it earns
- **Android:** one free hint a day, then a video for a hint. A full-screen ad after an endless puzzle is finished, at most one every four minutes, never after the daily puzzle.
- **iPhone:** free = the daily puzzle and small sizes. One-time unlock ($3.99–5.99 to test): all sizes, the full archive, unlimited hints.
- **Protected moment:** solving. Nothing ever appears over the board.

## Build order
1. Generator + solver + a test that proves one answer only + a difficulty rating (which tricks are needed).
2. Grey-box board: is tapping and marking pleasant with one thumb? This is the game.
3. Daily seed and calendar. Hint engine.
4. World, sound (paper, pencil, stamp), then `/slop-check`.

## Check first
The licence file of any puzzle generator we learn from (`playbook/03`) · that the puzzle's name is ours, not a brand's · the top logic-puzzle apps and what their reviews hate (ads in the middle, forced guesses, tiny cells are likely).

## What Anass does
Plays the three grey-box types for ten minutes each and picks one. Picks the world from three pictures.

## Biggest risk
Many puzzle apps exist. **Answer:** the paper feel, the teaching hints and the promise of no pressure, shown in the first screenshot.
