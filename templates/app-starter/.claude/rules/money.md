---
paths:
  - "src/features/ads/**"
  - "src/features/purchases/**"
  - "src/app/paywall*.tsx"
  - "app.config.ts"
  - "store/**"
---
# Money and store rules (docs/money.md and docs/store.md are the source of truth)
- Android = ads, iPhone = purchases. Test ad IDs everywhere except the store build.
- Rewarded ads are optional, labelled, capped per day, reward only in the earned callback. Hide the offer when no ad is loaded.
- Full-screen ads only at a natural break, never in the first 10 minutes, never after a fail, never on open or exit.
- Paywall never in onboarding, never blocks the main loop, shows price, contents, Restore, Terms, Privacy, and only features that exist.
- No ads at the protected moment named in CLAUDE.md.
- No competitor names, no medical or money claims, no "Android" in iOS text, no prices in store images.
