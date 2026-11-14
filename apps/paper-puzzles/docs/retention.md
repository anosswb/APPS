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
- **The path bends to the player, both ways** *(built, `nextPace` in `src/game/book.ts`, tested)*. One number, `relief`, from −2 to +2:
  - **Kinder (+1, +2):** three or more hints on a puzzle lowers the next ones a step (grade first, then one size smaller). A puzzle solved with no hints ends the kinder stretch.
  - **Harder (−1, −2):** two fast, clean solves in a row (no hint, under 60% of the usual time) raise the next ones a step (grade first, then one size bigger, never above 10 × 10). A hint or a slow solve brings it one step back.
  - The first ten puzzles are the same for everyone.
  - "Usual time" is a **guess** today: 2, 3 and 4.5 seconds per square for gentle, steady and tricky. Tune it from the real numbers (`puzzle_solved` now carries `relief`).
  - **Inside a puzzle** *(built)*: after 45 seconds with no mark, the Hint button lights up and reads "Stuck? Hint". Any mark puts it out. This is the "falling behind → make it easier" step of the Candy Crush system (`playbook/06`, A3b), done the only way a one-answer puzzle allows: the board never changes, the help comes forward. Counted as `stuck_nudge`.
  - This is our version of the Candy Crush idea. There, the game tunes how often you fail. Here nobody can fail, so we tune how hard the thinking is, to keep each player near the edge of their own skill. It never changes to sell anything.

## The two challenge modes (Anass, 14 Nov 2026) *(built, `src/game/challenge.ts`, tested)*
The daily puzzle and the book stay calm: no clock, nobody loses. The challenges are a separate part of the front page, and they **can be lost**.
- **Beat the clock:** solve the puzzle before the time runs out. Time = usual time × a factor that belongs to the player (starts at 3, between 1 and 4).
- **One pot of ink:** each tent pitched uses one drop. The puzzle needs T tents; the pot holds T + N drops (N starts at 4, between 1 and 6). A wrong tent wastes a drop; grass is free. This is the "limit of clicks": think before you pitch.
- **The algorithm:** a win tightens the room a little (time × 0.92, N − 1); a loss loosens it more (time × 1.2, N + 2). A test shows this settles at about two wins in three for any player. It changes only between attempts; inside an attempt the clock and the pot are what the page says.
- **The lose screen** says how close it was ("3 of 5 tents were in the right place") and offers: one video for more time or 3 more drops (Android, at most twice per puzzle), try again (free, with the extra room the loss just earned), or the front page.
- A win after a video moves the player on but does not tighten the room.
- No hints in challenges. Each mode has its own row of puzzles, growing like the book.
- Not built yet: steering inside an attempt, and a smaller reward when the player was close (both from the Candy Crush notes in `playbook/06`, A3b). First see the real numbers: `challenge_start`, `challenge_end` (with closeness).

## Personal bests (Anass, 14 Nov 2026) *(built, `src/game/records.ts`, tested)*
The player against themselves. Nothing is compared with other people and nothing leaves the phone.
- **Best time per grid size,** counted only for a solve with no hints (daily, book and races). The solved screen says "A new best for a 6 × 6: 1:12. It was 1:40.", or the time to beat.
- **Wins in a row** in each challenge, now and best ever. A win with a video keeps the run but does not add to it; a loss ends the run, never the best.
- A "Your bests" block on the front page, shown once there is something in it.
- There is still no daily streak that can be lost in the calm modes.

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
