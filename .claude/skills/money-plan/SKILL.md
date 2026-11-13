---
name: money-plan
description: Decide how one app earns on each store, with numbers, costs and the ad or paywall placement. Use before building ads or purchases, and when reviewing an app's first 30 days.
---
# /money-plan
1. Read the newest `research/` file (rails can change), `playbook/07-monetization.md`, and the app's brief and retention doc.
2. Decide per store: Android = ads (which formats, where, daily caps, which moments are protected). iPhone = purchase (model, price to test, what is free forever, when the offer appears).
3. Run `python3 tools/roi.py --installs … --d1 … --d30 … --t1 … --t2 … --rew … --inter … --iap …` for a careful and a good case. Paste both lines. Never present them as a promise.
4. List costs (accounts, tools, hours) and the installs a day needed to cover them.
5. Check against playbook/08 (paywall and ad rules) and the review research (what users hate).
6. Save as the app's `docs/money.md`. Give Anass the plan in 6 lines and any step he must do by hand, numbered.
