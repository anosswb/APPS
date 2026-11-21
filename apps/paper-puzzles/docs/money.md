# Money — Paper Pines

Nothing here is a promise of income. Money rails re-checked in `research/2026-11-13-market-facts.md` at the repo root: Android = ads, iPhone = purchases.

## What is free forever, on both stores
The daily puzzle · the last seven days in the calendar · every puzzle already started or solved · hints · the rules · dark mode · no account.

## Android (ads) — code written, NOT yet tried on a phone
| Thing | Rule (in `src/money/rules.ts`, tested) |
|---|---|
| Full-screen ad | Only at a good moment: after a WON puzzle, on the "Next" tap (free play, ink pot or clock), when at least 3 games were played since the app opened or since the last ad AND the last 2 were wins. Never after a loss, nor on the first win after a loss. Never before 6 puzzles are finished (all modes together), never in the first 10 minutes after the first opening, at most one every 4 minutes. Never around the daily puzzle, never over an open puzzle. |
| Optional video | Opens one past day older than a week, for good. If no video is ready, the day opens anyway ("this one is on us"). |
| Optional video on a lost challenge | "Watch a video: 3 more drops" or more seconds, at most twice per puzzle. Try again is always free. If no video is ready, the player keeps going anyway. |
| Consent | Google's consent form runs first where the law asks for it; Settings shows "Ad privacy choices" when required. |
| The Book | Never locked on Android. |
Today the app shows **Google's test ads**. That is on purpose: tapping your own real ads can close an AdMob account.

### To switch on real ads (Anass, after the test build works)
1. admob.google.com › **Apps › Add app** › Android › "Not listed yet" › name it Paper Pines. Copy the **App ID** (`ca-app-pub-…~…`).
2. In that app: **Ad units › Add ad unit › Interstitial** › name "Between puzzles" › copy its ID. Then **Add ad unit › Rewarded** › name "Open a past day" › copy its ID.
3. Send Claude the three IDs. The App ID goes in `app.json` (the `react-native-google-mobile-ads` line); the two unit IDs go in `src/config/ad-ids.json`.
4. Only the store build sets `EXPO_PUBLIC_ADS_LIVE=1`. Every other build keeps test ads.

## iPhone (one purchase) — screens and rules built, buying switched OFF
- **The full edition, $4.99 to test, once:** the whole Book after puzzle 30, every past puzzle, and no ads (there are none on iPhone at all).
- The page is reached only by choice: the end of the free Book, an older day in the calendar, or a quiet link on the front page. It shows the price from the store, what you get, what stays free, Restore purchases, and Terms and Privacy links.
- **Nothing is locked on iPhone today.** Locks switch on only when a real store adapter says buying works (`purchases.available()`), so nobody can meet a lock with no way through it.

### To switch on the purchase (after the Apple account exists)
1. App Store Connect › the app › **In-App Purchases › +** › **Non-Consumable** › product ID `full_edition` › price $4.99.
2. revenuecat.com › new project › add the App Store app › **Entitlements › + › `full`** › attach the product › **Offerings › default** › one package with that product. Copy the public iOS key (`appl_…`).
3. Claude adds `react-native-purchases` (excluded from Android), writes `src/money/purchases.ios.ts` against the interface in `purchases.ts`, and reads the key from `EXPO_PUBLIC_RC_IOS_KEY`.
4. Fill `LEGAL` in `src/config/money.ts` with the live Terms and Privacy pages.
5. Test with a sandbox account: buy, delete the app, reinstall, Restore. Only then ship.

## Ink bottles (Anass, 21 Nov 2026) — built, buying switched OFF
- Every player starts with **3 free bottles** (Android and iPhone). On a lost ink or clock puzzle, one bottle gives **3 more drops or 30 more seconds**, and the board stays as it is. Bottles have no limit per puzzle; videos still stop at 2. "Try again" stays free.
- **iPhone only, to buy:** `ink_bottles_10` (10 bottles, $1.99) and `ink_bottles_30` (30 bottles, $4.99), on the shop page above the full edition. "Get ink bottles" shows on the lost screen when the player has none. Going to the shop does not count the attempt as lost.
- Android cannot sell (Google pays no sellers in Morocco). Android players only have the 3 free bottles; the video stays their way to more room.
- Bottles are kept on the phone (a consumable: Apple does not restore them). The shop says so.

### To switch on bottles (with the full edition, after the Apple account exists)
1. App Store Connect › the app › **In-App Purchases › +** › **Consumable** › product ID `ink_bottles_10`, price $1.99. Again for `ink_bottles_30`, $4.99.
2. RevenueCat › **Offerings** › add both products (no entitlement: they are consumables).
3. Claude writes `bottlePrice` and `buyBottles` in `src/money/purchases.ios.ts` (same file as the full edition).
4. Sandbox test: buy, see the count go up, use a bottle, kill the app, reopen: the count is still right.

## Seeing the money screens without a phone
`EXPO_PUBLIC_MONEY_PREVIEW=iap` or `=ads` builds a web preview with a pretend shop or pretend videos:
```bash
EXPO_PUBLIC_MONEY_PREVIEW=iap npx expo export --platform web --output-dir dist-iap
```
Never set this in a build that goes to a store.

## Numbers (`python3 tools/roi.py` at the repo root, 13 Nov 2026, planning values)
```
careful: 200 installs/day, day-1 30%, day-30 4%, half the users in rich countries, 2.5 ads/day
         DAU 1717   month $611    installs/day for $1k: 327   for $3k: 981
good:    200 installs/day, day-1 38%, day-30 7%, 60% in rich countries, small iPhone income
         DAU 3026   month $2209   installs/day for $1k: 91    for $3k: 272
```
What decides which line we get: how many players come back, and how many are in the US.

## Costs before it earns
Apple $99 a year, Google $25 once (Anass decides when). Everything else is on free tiers at this size.

## 30-day verdict rule
Grow / fix once / park, as in `playbook/07` at the repo root.
