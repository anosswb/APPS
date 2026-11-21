# Money plan — Dinkline (draft, needs Anass's yes before any ad or purchase code)

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

## Not in the test APK of 21 Nov 2026
No ad SDK and no purchase code yet: the first test is "is it useful at a real court?". Ads come after his yes on this plan.

## tools/roi.py lines
Not run: no real numbers exist yet. Run it at day 30 with real installs.
