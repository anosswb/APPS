# 07 — Making money (with Morocco's rules)

Use `/money-plan` to apply this page to one app. Re-read the newest file in `research/` first: these rails can change.

## The rails we have (checked 13 Nov 2026)
| | Android (Google Play) | iPhone (App Store) |
|---|---|---|
| Sell the app, in-app purchases, subscriptions | **No.** Morocco has no Google merchant account. | **Yes**, through Apple. Confirm the bank in App Store Connect › Business on day 1. |
| Ads (AdMob) | **Yes.** Paid by bank transfer in dirham. | Possible, but it adds the tracking prompt and a heavier privacy label. Usually no. |
| Store fee | — | 15% in the Small Business Program (join on day 1), else 30% |

Selling to the US while living in Morocco changes nothing above: getting paid depends on where the developer is, not where the user is. It helps the income a lot: US ad prices are among the highest, and most Americans who pay for apps are on iPhone.

So the default for every app:
```
Android = ads        iPhone = purchases, no ads
```
Because of this, **an idea that only earns from purchases is an iPhone-first idea, and an idea that only earns from ads must be opened every day.** Decide this before design.

Things to re-check every 3 months (they would change everything): Google merchant support for Morocco · a legal company outside Morocco (only with a real accountant) · web checkout through a merchant of record that pays Moroccan sellers (unverified today).

## What the numbers say (run `python3 tools/roi.py`)
Output on 13 Nov 2026, all at 200 new installs a day:
```
A  puzzle game, ads only, mixed geo   DAU 1717   month $  389   installs/day for $1k:  515   for $3k: 1544
B  same, weak retention (22/1.5)      DAU  739   month $  167   installs/day for $1k: 1195   for $3k: 3584
C  same, strong retention (40/8)      DAU 3492   month $  791   installs/day for $1k:  253   for $3k:  759
D  same as A, 50% tier-1 users        DAU 1717   month $  799   installs/day for $1k:  250   for $3k:  751
E  same as A, mostly tier-3 users     DAU 1717   month $  195   installs/day for $1k: 1024   for $3k: 3071
F  utility, rewarded only, no inter   DAU 1717   month $   95   installs/day for $1k: 2095   for $3k: 6285
G  iPhone app, no ads, IAP $0.03/DAU  DAU 1717   month $ 1545   installs/day for $1k:  129   for $3k:  388
```
These are planning numbers from rough public ranges, not promises. What they teach:
1. **Retention doubles or halves the money** (B against C). Fix retention before buying or chasing installs.
2. **Where users live matters as much as how many** (D against E). One user in the US is worth 5–10 users in tier 3. This is why we target the US: aim every app at line D or better, by making the listing, the words and the look for Americans.
3. **Ads on a tool earn almost nothing** (F). Tools earn on iPhone.
4. **A small purchase income beats ads** (G). Three cents per daily user is already four times scenario A.
5. **One app will not replace a salary quickly.** A portfolio of several small apps, with the best one grown, is the realistic road (ROADMAP.md).

## Ads without ruining the app (Android)
**Rewarded video is the main income.** The user chooses it and gets something real.
- Good offers: extra moves at the end of a failed try, a hint, double the reward on the win screen, a cosmetic for 24 hours, a skip.
- Place the offer at a moment of wanting, and never in the middle of play.
- Reward only in the `EARNED_REWARD` callback. Cap per day (3–6). Label it clearly: "Watch a video".
- If no video is ready, hide the button. Never show "no ad available" after a tap.

**Interstitials (full screen) are the second income for games,** and the biggest risk.
- Only at a natural break (after a level ends, back on the map). Never before the first 10 minutes of the first day. Never after a fail. Never on app open or on exit.
- At most one every 3–4 minutes, and none in a session where the user watched a rewarded video in the last 2 minutes.
- Test with and without: if day 7 drops by more than a tenth, reduce.
- For tools and habits: no interstitials at all.

**Banners:** small money, ugly, and a risk of accidental taps near buttons. Use only on a quiet screen with real space, or not at all.

**App-open ads:** no. They hurt the first impression and reviews.

**Setup:** Google's test ad unit IDs in every build except the store build. Never tap your own real ads. Consent form (UMP) before loading ads in Europe and the UK. "Contains ads" and the advertising ID declared in Play Console. After 20,000+ daily users, add mediation (more ad networks bidding) for a higher price per view; before that it is not worth the work.

## Purchases without anger (iPhone)
What the review research on four competitors showed (1,500 reviews, in the Gobblo repo): the most hated things are paywalls on basics, subscriptions that are hard to cancel, a paywall after a long quiz, and moving one-time buyers to a subscription.

| Model | Use when | Notes |
|---|---|---|
| **One-time unlock** ($2.99–$9.99) | Tools, small games, anything without ongoing cost to us | Loved by users burned by subscriptions. "Yours forever" must stay true. |
| **Remove ads + extras** | Games (if we run ads on iPhone at all) | Simple and expected. |
| **Consumables** (hints, moves) | Puzzle games with a fail moment | Small prices, honest value, also earnable by playing. |
| **Subscription** | Only when the app gives new value every week (content, sync, a service) | Short trial or none; price shown clearly; easy cancel link. RevenueCat 2026: most trial conversions happen in week 1, a third on day 0. |

Paywall rules for every app: never inside onboarding · never blocks the main loop · shows price, what you get, Restore Purchases, Terms, Privacy · only lists features that exist today · offered after the user has felt the value (after a win, after day 3, at a locked extra). No discount prices in store images (Apple rule 2.3.14, Oct 2026).

Use RevenueCat for purchases (free at small size; check current pricing). Test: buy with a sandbox account, delete the app, reinstall, Restore.

## Keeping both stores fair
The same extras exist on both: bought on iPhone, earned with play and optional videos on Android. On Android, show a price in the app's own currency (stars, coins), never the word "Plus" or "Buy".

## Costs (know them before the first app)
Apple Developer $99 a year · Google Play $25 once · domain about $15 a year (optional) · Expo/EAS free tier, then paid if builds run out · RevenueCat, AdMob, PostHog, Sentry free at small size · Claude plan · Anass's hours. Add them to the app's `docs/money.md`. An app "earns" only after these.

## Paid installs
Not until an app's own numbers show that a user is worth more than an install costs, for at least 30 days. Until then: US store search (playbook/11), short videos in English (Anass already makes these), and cross-promotion between our own apps (a "more from us" row costs nothing).

## The kill and grow rule (30 days after launch)
- **Grow:** day 1 over 35% and day 7 over 12%, or iPhone purchase rate over 2%. Add content, translate, make videos.
- **Fix once:** day 1 between 25% and 35%. One round of first-session fixes, two weeks, measure again.
- **Park:** below that after the fix. Leave it in the store, stop working on it, write the lesson in `playbook/13`, move on.

_Not financial, tax or legal advice. Talk to an accountant in Morocco when real money arrives._
