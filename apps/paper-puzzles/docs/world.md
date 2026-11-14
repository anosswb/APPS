# World — Paper Pines

Chosen on 13 Nov 2026 so that building could start, and **approved by Anass the same day** after he saw the screenshots. It can still change: it all lives in `src/theme/tokens.ts` and `src/ui/`, and a different look costs a day, not a rewrite. Listed in `WORLDS.md` at the repo root.

| | |
|---|---|
| Person and moment | An adult with a coffee or in bed, 10 quiet minutes, one hand, wants to think without being poked |
| Three words | Quiet, papery, exact |
| Material | Newsprint and two inks |
| Colour | Paper `#F6F1E7` and black ink `#22201C`; red ink `#B3261E` for tents, the stamp and problems; pine-green ink `#2F4A3A` for trees; a highlighter yellow only inside hints. Dark mode is its own design (night paper `#181613`, cream ink). Checked with `tools/contrast.py` values from the sunday-paper example |
| Type | Newsreader (serif) for reading and numbers; Libre Franklin (sans) only for small capital labels. Both under the SIL Open Font License |
| Shape and depth | Square corners (radius 2). Hairline rules in place of cards. No shadows, no gradients, no blur |
| Icons | None from a set. The three puzzle marks and one chevron are our own drawings; tools are words ("Undo", "Hint") |
| Motion | Almost none. The stamp drops in 220 ms. Reduce Motion: it simply appears |
| Sound | Three sounds made by our own script: a pencil tick, a firmer tap for a tent, a stamp thud. Quiet by design. Not yet judged by ear on a phone |
| Voice | A friendly puzzle editor. Short, plain, warm. Never says "Oops", "Great job!!", "You failed", never uses an exclamation mark |
| **Signature** | The red rubber stamp, SOLVED, slightly crooked, landing on the grid. It also marks solved days on the front page |

## What the first screens look like
- **Front page:** date line, masthead, double rule, today's puzzle as the lead story with a small picture of the grid, the week as seven boxes, then the puzzle book with a strip of five level boxes.
- **Icon:** a corner of the puzzle page: masthead rule, a two-by-two grid, one tree, one tent, a folded corner.
- **Puzzle:** numbers on the edges like a printed grid, two word-buttons under it, the hint as an italic editor's note between two rules.

## Slop check (done by Claude on the first screens)
Passes: no gradient, no glow, no cards, no emoji, one main action per screen, two type families, all colours from tokens, light and dark designed apart. Open points: the lower half of the puzzle screen is empty on small grids; the week boxes are plain; no sound yet.

## Rejected directions
- A camping look (green, wood, cute tents): it would look like the three new Tents apps of 2026 and like a kids' game.
- A dark "night studio" look: closer to our other ideas, and wrong for a paper puzzle.
