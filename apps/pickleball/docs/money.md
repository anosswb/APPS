# Money plan — Dinkline (approved by Anass on 22 Nov 2026)

Rails (playbook/07, root CLAUDE.md): Android in Morocco = ads only. iPhone = purchases allowed. Checked research/2026-11-21-pickleball-reviews.md and research/2026-11-21-ideas-store-proof.md today; no newer money research exists.

## What people pay (seen / source says)
- Apple: Pickleball Score Keeper $5.99 one-time, 4.6 (134 ratings). PB Queue $9.99 one-time (iOS). Play: Pickleball Open Play Queue $4.99 one-time. Reviews hate an "exorbitant lifetime fee" and say about $4 is fair (source says, review-miner).

## iPhone: one-time unlock (guess: $4.99)
- Free forever: the line, rotation on 1–2 courts, the scorer, saving the group.
- Unlock: 3–8 courts, winners-stay rule, saved groups (several), later the big-board/TV mode. Shown only in Settings and when adding a 3rd court; never in the first session, never over the scorer.
- Clubs that run 3+ courts are exactly the organizers who pay (guess).

## Android: ads only
- **Never on the Courts screen or the Scorer** (the protected moments: the phone is at the court and everyone looks at it).
- One small banner on the Players and Settings tabs only. No interstitials, no rewarded ads in v1.
- Honest number: this app is opened ~1–3 times a week per organizer, so ad income per user is tiny (guess: under $0.50 per user per year). Android is mostly for reach and reviews.
- `react-native-google-mobile-ads` needs minify OFF in release builds (apps/paper-puzzles/DECISIONS.md). Test ad IDs only until Anass says otherwise.

## Built (22 Nov 2026)
- `src/money/rules.ts` (tested): banner only on Players and Settings, Android only; iPhone locks 3+ courts and the winners rules only when a real purchase is possible.
- Android: one anchored adaptive banner with Google's TEST unit id (`ads.android.tsx`). Ads start the first time Players or Settings opens, so a consent form can never cover the courts. Minify stays off.
- iPhone: `purchases.ts` is switched off (`available()` = false), so nothing is locked. The real `purchases.ios.ts` needs the Apple developer account and the product in App Store Connect.

## What Anass must do before real money (later, numbered steps when we get there)
1. AdMob account (free) → Android app → one banner unit id. Then we put the real ids in and build with live ads.
2. Apple developer account ($99/year) → App Store Connect → one non-consumable product "Dinkline Full" at $4.99.
3. Google Play data-safety form and the Apple privacy label must then say: device identifiers and ad data collected by Google AdMob on Android.

## tools/roi.py lines
Not run: no real numbers exist yet. Run it at day 30 with real installs.
