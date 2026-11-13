# DECISIONS.md — Paper Pines

| Date | Decision | Why | Who |
|---|---|---|---|
| 2026-11-13 | First app of the factory is the daily paper puzzle | Earns on both stores (Android ads, iPhone unlock), can be tested on an Android phone, levels are made by code, and the core promise can be proven by tests | Claude ("you decide") |
| 2026-11-13 | First and only puzzle type in v1: Tents | Three rules a person learns in a minute, one-thumb taps, small grids that suit a phone, a solver whose steps can be explained in a sentence | Claude |
| 2026-11-13 | A puzzle is kept only if the logic solver finishes it | Gives "one answer, never a guess" and means a hint can always explain the next step | Claude |
| 2026-11-13 | Hints are free and unlimited | 565 reviews: coin and pack paywalls are hated; explained hints are asked for. This replaces the brief's "one free hint a day, then a video" | Claude, from the review research |
| 2026-11-13 | No timer on screen, no lives; time is shown only after solving | Reviews: lives and pressure are hated | Claude |
| 2026-11-13 | Largest grid is 10 × 10 | Bigger squares would be under the 44 pt tap size on a phone | Claude |
| 2026-11-13 | Look: Sunday newspaper in two inks, SOLVED stamp as the signature | Different from every Tents app found and from Gobblo; fits "calm" | Claude; Anass can change it |
| 2026-11-13 | Works in Expo Go for now (no native-only libraries); simple screen switch, no Expo Router yet | Anass can test on his phone today without a build | Claude |
| 2026-11-13 | AsyncStorage for saves (not MMKV) | Works in Expo Go and on the web preview | Claude |
| 2026-11-13 | Working title "Paper Pines" | A web search found nothing with that name; full check still to do | Claude |
