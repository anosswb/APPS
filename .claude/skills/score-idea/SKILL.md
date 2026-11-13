---
name: score-idea
description: Replace guesses with proof for one idea and give a build / twist / park verdict. Use before any design or code for a new app.
---
# /score-idea <idea>
1. Read `playbook/02-idea-hunting.md` (steps 2–4) and the idea's row in `IDEAS.md`.
2. Collect the four proofs with the `scout` agent (search phrases in 2 languages, 3 earning competitors) and the `review-miner` agent (15+ quotes, themes, the gap).
3. Fill `templates/idea-card.md` and save it as `research/ideas/<name>.md`. Score each of the 8 lines 0–5 with one line of why, marked P or G.
4. Run `python3 tools/roi.py` with numbers that fit this kind of app and paste the line.
5. Write the three best reasons it fails and your answer to each.
6. Verdict in 5 lines for Anass: build, twist (which one) or park. Update the row in `IDEAS.md`.
