---
name: slop-check
description: Check a screen for generic "AI-made" design and list the fixes. Use after building any screen, and whenever Anass says something looks generic, cheap, childish or like another app.
---
# /slop-check <screen or screenshot>
1. Get a screenshot of the real screen (light and dark if both exist). Normal size is enough.
2. Start the `design-critic` agent with the screenshots and the paths of the app's `docs/world.md`, `playbook/04` and `WORLDS.md`.
3. Fix its top 5 in the code. Screenshot again. Compare before and after yourself.
4. Run `python3 tools/contrast.py` if colours changed.
5. Tell Anass in 4 lines what changed and send the after picture. What needs a real phone (haptics, sound, gestures), say so.
