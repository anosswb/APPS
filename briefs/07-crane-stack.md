# 07 — Crane stack
**Game · for one-thumb arcade players, 16–30 · first-guess score 30/40 · about 3 weeks**

## What it is
A crane carries a load that swings like a pendulum. Hold to lower it, release to drop it, and build the tower as high as you can. Wind and odd-shaped loads make it harder.

## The special thing
Real weight. The swing, the thud and the dust feel like a real site, drawn by someone who has stood on one.

## What to put in version 1
- **One-thumb play:** the crane moves by itself, you choose the moment.
- **Loads:** beams, pallets, pipe bundles, each with its own size and swing.
- **Wind** that changes, shown by a flag.
- **Endless tower** with your best height.
- **A daily challenge:** the same loads and wind for everyone.
- Things to unlock by height: crane colours, skylines, a night shift with floodlights.

## What NOT to put
Many menus, a story, energy systems, online rooms.

## The world (first direction)
A site at dusk: black outlines, a hi-vis yellow crane, two flat sky colours. **Signature:** the hook's swing and the landing: a low thud, a puff of dust, a small shake of the screen.

## Why people come back
"One more try" to beat the best height, the daily challenge, the next unlock. The wind and load sizes follow the player's skill (`playbook/06`), so beginners are not crushed and good players are not bored.

## How it earns
- **Android:** a video to continue once after the tower falls; a full-screen ad every third or fourth run, never in the first session.
- **iPhone:** one-time unlock of all looks and the daily archive. Honest note: arcade games earn mostly from Android ads.
- **Protected moment:** while a load is in the air.

## Build order
1. The physics in a grey box: pendulum, drop, stacking, falling. One full day only on how it feels.
2. Scoring, wind, load types. The skill-following difficulty.
3. Daily challenge and unlocks.
4. World and sound, then `/slop-check`.

## Check first
Tower-stacking games in the stores and why people stop playing them · a small physics library with a licence we can use, or simple physics of our own.

## What Anass does
Plays the grey box and says if the swing feels right. Tells Claude real site details for the art and sounds.

## Biggest risk
Arcade games are played for a few days. **Answer:** keep it small (three weeks), make the first ten seconds feel great, and treat it as a quick earner and a lesson in ads.
