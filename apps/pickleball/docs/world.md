# World — Dinkline (working title)

## The person and the moment (from research/2026-11-21-pickleball-reviews.md)
Linda, 58, runs Tuesday-morning open play at a city park in Arizona. 14 people, 3 courts, full sun at 9 a.m., a paddle in one hand, the phone in the other. People ask her "am I next?" every two minutes. She has 3 seconds to look at the phone between rallies.

## Three words
**Bright, painted, quick.** (Not quiet/papery like Paper Pines, not calm/glass like the Shift app, not cozy like Gobblo.)

## The three directions (pictures in docs/world/)
| | Direction | Why |
|---|---|---|
| **A (picked)** | **Hard Court**: chalky concrete ground, black ink, US hard-court blue with the green surround and white painted lines, optic-yellow ball colour for the main action | Light ground + black ink is the most readable in full sun. Every colour comes from a real court. |
| B | Night Board: black with amber LED digits | Beautiful at night, but a dark screen disappears in sun glare, which is when most open play happens. |
| C | Park Paint: court green everywhere, white paint, orange action | Readable, but white-on-green text is weaker than black-on-light outdoors, and it looks like a generic sports app. |
Picked by Claude on 21 Nov 2026 while Anass slept, by the rule "readable in bright sun at arm's length". To switch: change `src/theme/tokens.ts` only.

## Decisions per axis
- **Colour:** ground `#F3F2EC`, ink `#111214`, court blue `#2147C9`, surround green `#3F7D55`, ball yellow `#D8F23A` (fills only, always with black text on it, never as text on light), stop red `#B42318`.
- **Mode:** light only in v1 (outdoor use). The scorer is dark around the courts so the giant white numbers pop.
- **Type:** Barlow Condensed ExtraBold for names and numbers (scoreboard feel, fits long names, SIL OFL). Archivo for body and buttons (SIL OFL). No rounded fonts.
- **Shape:** 6 px corners on boxes; the place-in-line tag is round on the left (like the ball) and square on the right. 2 px ink outlines on buttons.
- **Depth:** flat. No shadows, no glass, no gradients.
- **Icons:** one set, drawn for this app in `src/ui/Icon.tsx` (square-cut 2.25 px strokes). No emoji.
- **Motion:** quick, under 200 ms, no bounce.
- **Sound:** none in v1. Haptics on each point and at game end (switch in Settings).
- **Targets:** 56 pt minimum, 64 for the main buttons. Scorer halves are the whole screen.

## The signature
**Every game is a painted court.** The four names stand on a top-down US hard court (blue inside, green outside, white lines, kitchen lines, centre line between partners). The line of waiting players are numbered yellow balls. No other app of ours has it, and it comes from the real thing players look at all day.

## Voice (5 lines)
- The friendly regular who runs the paddle rack: short, plain, a bit of court talk ("on deck", "next on court", "game to 11").
- Says what happens: "Joe is #3 in line", "On court now: Sam, Ana, Joe, Dana".
- Never blames: no "you forgot", no "error".
- No exclamation marks, no emoji.
- American English, 12-hour clock.
