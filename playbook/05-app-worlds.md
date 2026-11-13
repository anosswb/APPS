# 05 — One world per app

Anass's rule (13 Nov 2026): **each app has its own special thing.** No shared template, no "Gobblo look" on the next app. What we share between apps is the method and the quality bar. Use `/app-world` to run this page.

## What a "world" is
Seven decisions and one signature, written in the app's `docs/world.md` before any screen is built:

| Decision | Question to answer |
|---|---|
| **Person and moment** | Who opens it, where, for how long, in what mood? |
| **Three words** | How should it feel? (Words that would be wrong for our other apps.) |
| **Material** | If the app were a physical object, what is it made of? Paper, tile, steel, felt, glass, chalk, rubber? |
| **Colour** | 2 neutrals, 1 action colour, at most 1 reward colour. Light and dark designed separately. |
| **Type** | 1 reading family. At most 1 display or number family. Must support every language we plan. |
| **Motion and sound** | Fast or heavy? Which sound material? What does a success feel like? |
| **Voice** | Who is talking? Three things they would never say. |
| **Signature** | The one thing a person would describe to a friend. On every key screen. In none of our other apps. |

## How the audience decides the world
| If the users are… | Then… |
|---|---|
| Outdoors, in gloves, in a hurry | High contrast, very big targets, few words, works in sunlight, one action per screen |
| 55 and older | 18 pt text minimum, no timers by default, no tiny gestures, calm colours, clear words, never "tap anywhere" |
| 16–25 | Bold, fast, funny is allowed, strong motion, share moments. Never childish |
| Tired, at night | Dark first, warm light, slow fades, no red badges |
| Paying professionals | Dense, precise, quiet. Numbers in tabular figures. No mascots |
| American tradespeople | Feet, inches and fractions, 12-hour clock, dollars, plain shop-floor words, nothing that looks like office software |
| Everyone in the US | Icons and pictures carry meaning, text is short and in everyday American English |
| Stressed or ashamed about the topic (money, health, focus) | No judgement words, private by default, soft entry, user in control |

## How the job decides the world
- **A game:** the board IS the design. Spend the character on pieces, feedback and the win moment. Menus stay simple.
- **A tool:** speed is the design. The signature is how fast and pleasant the main action is.
- **A daily habit:** the return moment is the design. What is different today from yesterday?
- **A calculator or tracker:** the number is the hero. Big, exact, trusted.

## Seven example worlds (to show the distance between apps)
They are in `templates/worlds.json`, with checked colours. They are examples of **how different** two of our apps should be. Do not ship one as it is, and never use one twice.

| World | Users | Signature |
|---|---|---|
| site-ready | shift and site workers | one hi-vis amber action per screen, 56 pt controls, condensed numbers |
| sunday-paper | calm logic puzzles, 35+ | newsprint, a serif, an ink stamp when a row is solved |
| loading-dock | packing and sorting puzzles | corrugated cardboard, stencil lettering, a shipping label printed when a level is solved |
| big-and-clear | brain games for 55+ | one task per screen, large type, a chime in place of confetti |
| arcade-ink | fast one-thumb games, 16–28 | black outlines, two flat colours, squash and shake on every hit |
| ledger | pay and overtime calculators | monospace numbers, hairlines in place of cards, a receipt that prints |
| night-shift | sleep and wind-down | dark only, amber and no blue, only fades |

## Making a new world (the steps)
1. Fill "person and moment" from the review research and from Anass. Real quotes, not imagination.
2. Collect references: 6 apps in the category and 6 or more things from the American user's real life (a US road sign, a time card, a shipping label, a diner menu, a seed packet). Save them in the app repo under `research/refs/` with one line each on what to take.
3. Write three candidate worlds, one paragraph each, clearly different from each other and from every world in `WORLDS.md` (the list of worlds we already shipped).
4. Make each one visible: one key screen per world as an image or a quick real screen. Anass picks by looking. Expect a mix ("A's colours with C's board").
5. Write `docs/world.md`. Build the token file from it (one file; no colours or sizes anywhere else in the code).
6. Run `python3 tools/contrast.py` on the palette. Run `/slop-check` on the first real screen.
7. Add a line to `WORLDS.md` in this repo: app, three words, material, signature. The next app must not repeat any of them.

## Things that stay the same in every app (quality, not look)
Tokens in one file · light and dark designed apart (or one mode only, chosen on purpose) · every state designed · 44 pt targets or more · system font scaling works · Reduce Motion works · colour contrast passes · real icons from one set · no hard-coded text (ready for translation) · right-to-left safe (`start`/`end`, never `left`/`right`).
