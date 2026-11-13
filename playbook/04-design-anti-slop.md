# 04 — Killing AI slop

"AI slop" is what a model makes when nobody decides anything: the average of everything it has seen. It is not ugly. It is **nobody's**. Anass's words for it: "a 5-minute vibe-coded app". The cure is decisions that come from this app's users and nowhere else.

## The tells (if you see three of these, start again)
**Colour**
- Purple-to-blue or pink-to-purple gradients. Gradient text. Glow blobs behind cards.
- Five accent colours. Every card a different pastel.
- Dark mode = the light mode inverted, grey on darker grey.

**Shape and layout**
- Everything is a rounded card with a soft shadow. Cards inside cards.
- The same corner radius and the same padding on every element.
- A big centred title, a subtitle, a pill button. Three feature tiles with an icon on top.
- A "dashboard" of stat tiles on a phone app that has no stats worth showing.
- Glass and blur on everything, not only where it helps.

**Type**
- One font, two weights, no real size contrast. Titles that are just "a bit bigger".
- Rounded friendly font on an app for adults.
- Centred paragraphs. Title Case On Every Button.

**Icons and pictures**
- Emoji used as icons. The sparkle icon for anything "smart".
- Icons from three different sets with different line weights.
- Glossy 3D blobs, plastic characters with no reason to exist, the same smiling flat people.

**Words**
- "Welcome back! 👋" "Unlock your potential." "Supercharge your…" "Seamless." "Let's get started!"
- Buttons that say "Continue" five times in a row. Empty states that say "No items yet."

**Motion and sound**
- Everything fades in at 300 ms. Or everything bounces. Confetti for every tap.
- No sound at all, or one stock "pop".

**Behaviour**
- Only the happy state is designed. First open, empty, error and offline are blank.
- A 9-screen quiz before the user sees the product.

## The method (do these in order; never start in code)
1. **One person, one moment.** Write: who, where, which hand, what light, what mood, how long they have. ("Karim, 34, crane operator, break room, 10 minutes, gloves just off, bright daylight.") Design for that moment.
2. **Three words.** Pick three feeling words for this app that would be wrong for the last app we made. ("Solid, loud, quick" versus "quiet, papery, slow".)
3. **Look at real things, not at apps only.** Collect 12–20 references: 6 real apps in the category (to know the pattern), and 6+ from the user's real world (a tool catalogue, a newspaper puzzle page, a tiled wall, a bus ticket, a football scoreboard). The world references are where the special thing comes from.
4. **Make one decision per axis and write it down** in the app's `docs/world.md`: colour (2 neutrals + 1 action colour, maybe 1 reward colour), type (1 family for reading, at most 1 for display or numbers), shape (one radius rule, one border rule), depth (flat, or shadow, or layers; choose one), icon set (one), motion character (snappy, heavy, or soft; choose one), sound material (wood, paper, ceramic, metal, synth; choose one).
5. **Find the signature.** One element that appears on every important screen and exists in no other app we made: a material, a character, a way numbers move, a sound, a shape of button, a way the screen opens. It must come from step 3.
6. **Design the worst screens first:** the empty state, the error, the paywall, settings. If those have character, the app has character.
7. **Build one real screen. Screenshot it. Run the checks below.** Only then build the rest.

## The checks
- **Logo swap:** cover the name. Could this be any other app? If yes, it is slop.
- **Sibling test:** put it next to our other apps. If someone would guess "same maker, same template", change it. Shared quality, different worlds.
- **Squint:** blur your eyes. Is there one clear thing to do? Is there one hero?
- **Grey test:** remove all colour. Does the hierarchy still work with size and weight only?
- **Thumb:** main action in the lower half. Targets at least 44 pt (56 for gloves, older users, games).
- **Five-second test:** show it to Anass for five seconds. Ask what the app does and how it feels. Compare with the three words.
- **Slop count:** go through the tells list above. Zero is the target; fix every one or write why it stays.
- **Contrast:** `python3 tools/contrast.py path/to/palette.json` must pass.
- **States:** first time, empty, loading, error, offline, success, returning after a week. All designed.
- **Self-critique:** write 10 lines: "what would the best designer in this category change?" Then change it.
Use `/slop-check` to run these on a screenshot.

## Words (copy is design)
- Write like one person talking to one person. Use the user's own words from their reviews.
- Buttons say what happens: "Start 2 minutes", "Show the answer", "Add my shift".
- Empty states teach or invite: one line and one action.
- Errors say what happened and what to do, with no blame.
- No exclamation marks in a row, no emoji as decoration, no guilt ("you missed", "you failed", "don't lose your streak").
- Each app has a voice written in 5 lines in `docs/world.md`: who is speaking, what they never say.

## Motion and sound
- Fast for tools (under 200 ms, no bounce). More body for games (squash, weight, a short shake), but only on the things the player touches.
- Exits are faster than entrances. Nothing scales from zero.
- One sound family per app, recorded or CC0, levelled so nothing is louder than the rest. Sound and haptics have switches, and Reduce Motion is respected.

## Platform truth
iPhone and Android users expect their own patterns (back gesture, sheets, pickers, switches). Follow the current OS for navigation and system controls; put the app's character in the content, the signature, the words and the motion. Check what the newest OS version looks like before designing settings or sheets.

## Tools that help (use when installed; none is required)
Real-screen libraries and motion specs (the Gobblo repo used Screenrove and transitions.dev), the `taste-skill:imagegen-frontend-mobile` skill for image concepts of screens before coding, `mcpmarket-me:creative-director` for the idea behind the world, Google Flow pictures made by Anass for art. References are for the quality bar and the pattern. Never copy an asset, a logo or a sentence.
