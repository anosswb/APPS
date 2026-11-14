# Retention — Paper Pines

Built means it is in the code today; planned means not yet.

## Loops
- **Core (2–10 minutes):** one puzzle. Mark grass, pitch tents, the last tent brings the stamp. *(built)*
- **Session (5–15 minutes):** the daily puzzle, then "Keep going" into the puzzle book, then "Next puzzle" after each level. There is always a next thing to play. *(built)*
- **Return (days):** a new shared puzzle every morning; the week strip fills with red boxes; Sunday is the big one. *(built)* A calendar of past days with red stamps. *(built)*

## Difficulty (no player can "fail", so we tune size and the kind of thinking needed)
- Three grades, measured by the solver, never guessed: **Gentle** (simple rules only), **Steady** (needs line-fitting or tree bookkeeping), **Tricky** (needs "picture a tent here: then…" reasoning).
- **Daily:** Mon 6×6 gentle, Tue 7×7 gentle, Wed 7×7 steady, Thu 8×8 steady, Fri 8×8 tricky, Sat 9×9 steady, Sun 10×10 tricky. *(built, `src/game/daily.ts`)*
- **The Book:** puzzles 1–3 are 5×5, 4–10 are 6×6, all gentle. Then waves of five: gentle, gentle, steady, gentle, then a bigger tricky one, then a breath. Sizes grow slowly to 9×9 (10×10 for the big ones). *(built, `src/game/book.ts`)*
- **Relief:** three or more hints on a puzzle lowers the next ones a step (grade first, then size). A puzzle solved with no hints resets it. Help is always in the player's favour. *(built)*

## The stuck moment (our version of the fail moment)
A hint is always free. It first checks for a mistake ("these tents touch"), then explains the next forced step and highlights the squares; "Mark it for me" applies it. *(built)* After several hints on one puzzle the next puzzles get kinder. No ad is ever shown here.

## Reasons to come back
1. The daily puzzle and the week strip. *(built)*
2. The puzzle book: the next level number and the strip of five boxes on the front page, with the big fifth puzzle in sight. *(built)*
3. The archive calendar with a stamp on each solved day. *(built)*
4. One optional note a day: "The Sunday puzzle is out · 10 × 10 · Tricky." *(built, not yet tried on a phone)*
   - **Asked once**, on the page, right after a solved daily puzzle (the moment the player is happiest). The phone's own permission prompt comes only after a yes.
   - **Time:** 8 AM by default; Noon or 7 PM in Settings; Off is one tap.
   - **No note for a day already solved**, and none while the app is open.
   - **Stops by itself:** notes are planned one week ahead each time the app is opened. A player who stays away for a week hears nothing more. A puzzle page that keeps knocking gets deleted.
   - **A tap on the note opens today's puzzle** directly.
   - Rules in `src/reminder/plan.ts` (tested); phone code in `src/reminder/reminders.native.ts`.
No streak counter that can be "lost".

## Numbers and events (planned; needs analytics, see PROGRESS)
The one number: puzzles finished on day 1 (target 4+). Also: tutorial puzzles finished, day-1/7/30 return, hints per puzzle by grade, puzzles abandoned by Book number (to find bad puzzles), daily started and finished.

## The line we do not cross (checked)
No lives, no timers on screen, no paid random rewards, no guilt texts, no ad over a puzzle, no difficulty raised to sell anything.
