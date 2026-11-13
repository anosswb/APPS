# 03 — Using open-source games and code safely

Open source gives us two things: **proven mechanics** (we can see they are fun) and **working code** (generators, solvers, physics). It does not give us a finished product. A straight copy gets rejected by Apple, sued by the owner, or ignored by players.

## The rule in one line
**Mechanics are free. Expression is not.** Rules of play, grids, the idea of "match three" or "fill the row": free. Names, characters, art, music, level layouts, text, and the exact look of a specific game: not ours. We never rebuild a specific existing game, even renamed.

## Licence table (open the LICENSE file every time; a list or a README is not proof)
| Licence | Can we ship it in a paid or ad app? | What we must do |
|---|---|---|
| MIT, BSD, Apache-2.0, ISC, zlib | Yes | Keep the copyright notice in an "Open-source licences" page in Settings. Apache: keep the NOTICE file too. |
| CC0, Unlicense, public domain | Yes | Nothing. Still log the source. |
| MPL-2.0 | Yes | Changes to THEIR files must be published. Our own files stay ours. |
| LGPL | Risky on phones | Avoid unless you are sure about linking rules. |
| GPL-2/3, AGPL | Only if our WHOLE app becomes open source under the same licence | Do not use. Read it for ideas only, then write our own code without copying. |
| CC BY | Yes, for art and sound | Credit exactly as asked. |
| CC BY-SA | Avoid for art inside the app | It spreads to what we make from it. |
| CC BY-NC, "non-commercial", "personal use" | **No** | Never. Ads count as commercial. |
| No licence file | **No** | "Public on GitHub" does not mean free to use. |

Code and assets often have **different** licences in the same repo (MIT code, copyrighted sprites). Check both. Take the logic, make our own art.

## Names and trademarks (separate from code licences)
Some game names and looks are protected even when a clone's code is MIT: falling-block games with the famous name, the well-known five-letter daily word game, the yellow dot-eater, branded board games. Use the generic mechanic with our own name, rules twist and look. Run a name check before falling in love with a name (playbook/11).

## Where to look
The lists are in `research/` section 7. Good starting points, each to be verified at the source:
- **Simon Tatham's Portable Puzzle Collection**: about 40 logic puzzles with generators and solvers, known as MIT-licensed. A gold mine for endless generated levels with one unique solution.
- **2048** (the original web game): known as MIT. Shows how small a hit mechanic can be.
- **Godot demo projects and the Flame (Flutter) examples**: clean, permissive sample games to learn structure from.
- **Kenney.nl** (CC0 art and sound), **OpenGameArt** (mixed; filter by CC0), **Freesound** (filter by CC0), **Google Fonts** (open font licences; check each).
- GitHub search: `topic:puzzle-game license:mit stars:>100`, `topic:react-native game`, `language:TypeScript sudoku generator`.
"Known as" above means: from memory, not checked today. Open the LICENSE before using.

## How to mine a repo (give this to the `license-checker` and `scout` agents)
1. Licence of code. Licence of assets. Last commit date. Stars. Open issues about bugs in the core logic.
2. What is the fun? Play it for 10 minutes or read the rules. One sentence.
3. What can we take: the generator, the solver, the difficulty rating, the data format?
4. What must be ours: name, art, sound, levels, copy, progression, the twist.
5. Port the logic to plain TypeScript with tests (pure functions, no UI). Keep a `THIRD_PARTY.md` row: project, URL, licence, commit hash, which files came from it.

## From mechanic to product (what the open-source project never has)
| Missing piece | Where we add it |
|---|---|
| A reason to come back tomorrow | playbook/06 |
| First 60 seconds that teach by doing | playbook/06 |
| A world and a signature | playbook/05 |
| Difficulty that fits each player | playbook/06 |
| Money that does not ruin the play | playbook/07 |
| A listing people find | playbook/11 |

## Quick test before you commit to a mechanic
Build it in grey boxes in one day. Give it to three people without a word. If they play more than five minutes and one asks "can I keep it?", continue. If not, the mechanic is wrong for a phone, and no design will fix it.
