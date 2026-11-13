---
name: retention-plan
description: Design why people come back to one app - loops, difficulty algorithm, return reasons, the numbers to track. Use before building a game's levels or an app's home screen.
---
# /retention-plan
1. Read `playbook/06-retention-engine.md` and the app's `docs/brief.md` and `docs/world.md`.
2. Game: write the three loops, the sawtooth targets, what "difficulty" changes in THIS game, the fail moment, 2–3 return reasons. Non-game: the first 60 seconds, the one-tap repeat, the natural clock, the weekly new thing.
3. Name the one number that says the app works, and the event list needed to see it (closed list, no typed text; playbook/10).
4. For a game, put the algorithm in pure functions with tests before any UI, and check its shape with `python3 tools/dda_sim.py`.
5. Check the plan against "the line we do not cross". Remove anything that only works when the user does not understand it.
6. Save as the app's `docs/retention.md`. Tell Anass in 5 lines, with the one thing to try on his phone.
