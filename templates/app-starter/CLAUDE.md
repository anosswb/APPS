# CLAUDE.md — <APP>

You are building **<APP>**, an iOS + Android app for Anass (solo founder, Morocco). Short, simple messages to him; numbered steps for anything he does by hand. He decides by seeing: show screens, not descriptions.

## Market
Users in the United States, in American English: US spelling, dollars, 12-hour clock, feet/inches/pounds/°F by default (metric as a setting). A US native reads the listing and first-run text before release.

## One line
<who> can <do what> without <the pain>. **The special thing:** <the only one that …>

## Read before working (only what the task needs)
1. `docs/brief.md` — users, the pain (from real reviews), what v1 does and does not do
2. `docs/world.md` — this app's own look, feel, voice and signature. **Nothing is borrowed from our other apps.**
3. `docs/retention.md` — loops, difficulty, reasons to come back, the one number
4. `docs/money.md` — how it earns on each store
5. `docs/store.md` — store rules for this app
The shared playbook is at the root of this repo (`playbook/`, `research/`, `CHEATSHEET.md`). The root `CLAUDE.md` rules apply here too.

## Stack
Expo (React Native) with TypeScript strict, Expo Router, Reanimated; Skia for game boards. Local storage only (MMKV) with a schema version and tested migrations.
**The Expo SDK changes every release.** Read the major version in `package.json`, then the matching versioned docs, before using any API. Add packages only with `npx expo install <pkg>`.

## Hard rules
- No accounts, no server, no paid API in v1. User content stays on the phone.
- `MONETIZATION = Platform.select({ ios: 'iap', android: 'ads' })`. Test ad IDs in every build except the store build. Never ads at the moment that is the product: <name that moment>.
- Paywall: never in onboarding, never blocks the main loop; shows price, what you get, Restore Purchases, Terms, Privacy; lists only what exists.
- Every colour, size, radius and duration comes from the one token file. No hex and no magic numbers in components.
- All text in `src/i18n/`. Layout uses `start`/`end`. The app name is one constant.
- No emoji as icons. One icon set.
- Every screen: first time, empty, loading, error, offline, success. Light and dark (or one mode, chosen in docs/world.md). Small and large phones. Largest font size. Reduce Motion.
- Tap targets 44 pt or more. `accessibilityLabel` on every icon button.
- No medical, money or "guaranteed" claims. No guilt words. No competitor or brand names anywhere.
- Rating prompt: system prompt only, after a clear success, never in the first session, once per version.
- Notifications: local, at most one a day, asked after the first success, with an off switch.
- Analytics: anonymous, closed event list, never typed text, one switch off.
- Only art, sound, fonts and code we may sell. Log each in `RIGHTS.md` or `THIRD_PARTY.md`.
- No silent `catch`. Timers use end time, not ticks.
- Ask before: `git push`, any build that leaves the computer, any spending, deleting a feature.

## How to work
- Plan in `PROGRESS.md` first for anything bigger than an hour.
- Game logic and rules are pure functions with tests, built before the UI.
- One screen fully finished (all states, screenshot, `/slop-check`) before the next.
- After each block: type check, lint, tests, run the app, screenshot. Then 3–5 lines to Anass with what to try on his phone.
- Say what you could not check (haptics, sound, real gestures) and give the 30-second phone test.
- Log choices in `DECISIONS.md`. End sessions with `/wrap-up`.
- Mechanical work (tests, checks, search) goes to a cheaper model or a subagent.
