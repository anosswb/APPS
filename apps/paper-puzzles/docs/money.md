# Money — Paper Pines

Plan only. **Nothing here is built yet** and nothing is a promise. Money rails re-checked in `research/2026-11-13-market-facts.md`: Android = ads, iPhone = purchases.

## What is free forever, on both stores
The daily puzzle. Hints. The rules. The first part of the Book. Dark mode. No account.

## Android (ads)
- **Full-screen ad only between Book puzzles,** after the "Next puzzle" tap, never before Book puzzle 6, at most one every 4 minutes, always with a visible close. Never around the daily puzzle. Never while a puzzle is open.
- **Optional video** to open a missed day in the archive, or an extra big puzzle. The player chooses.
- No banners. No ad on app open.
- Protected moment: an open puzzle.

## iPhone (purchases)
- **One-time unlock, $4.99 to test:** the whole Book with no end, the full archive of past dailies, the choice of size. No subscription, no coins. The paywall appears only at the end of the free part of the Book and in a quiet "Full edition" row on the front page. It shows the price, what you get, Restore Purchases, Terms and Privacy.
- No ads on iPhone at all, so "no ads" is literally true.

## Numbers (`python3 tools/roi.py`, 13 Nov 2026, planning values)
```
careful: 200 installs/day, day-1 30%, day-30 4%, half the users in rich countries, 2.5 ads/day
         DAU 1717   month $611    installs/day for $1k: 327   for $3k: 981
good:    200 installs/day, day-1 38%, day-30 7%, 60% in rich countries, small iPhone income
         DAU 3026   month $2209   installs/day for $1k: 91    for $3k: 272
```
What decides which line we get: how many players come back (retention) and how many are in the US.

## Costs before it earns
Apple $99 a year, Google $25 once (Anass decides when). Everything else is on free tiers at this size.

## 30-day verdict rule
Grow / fix once / park, as in playbook/07.
