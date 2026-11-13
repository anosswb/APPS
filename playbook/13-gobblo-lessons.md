# 13 — What Gobblo taught us

Gobblo is the first app (own repo; its `DECISIONS.md` has every call with the reason). This page keeps what is useful for the NEXT apps.

**Carry over:** the method, the mistakes, the store and money facts.
**Do not carry over:** the otter, the palettes, the pet-feeding loop, the settings layout, the look. The next app starts its world from zero (playbook/05).

## Product
1. **Read the reviews first.** 1,500 competitor reviews and 226 forum comments decided the product: what to give free, what never to do. It was the best-spent day of the project. Do it for every app (`/mine-reviews`).
2. **What users of four competitors hated most:** price and paywalls · bugs · sync and lost data · notifications (too many on iPhone, not arriving on Android) · billing and cancelling (average 1.5 stars) · AI that gets it wrong · paywall after a long setup · rating prompt in the first minutes · Android treated as second class · basics behind a paywall · one-time buyers moved to a subscription. These are true far beyond one category.
3. **Onboarding teaches by doing the real thing,** in under 60 seconds, and must differ from the leader's flow (copycat risk).
4. **A simulated buyer panel finds objections,** not truth. It moved the offer from 25% to 55% "would buy" by changing what was sold, and found real problems (French input, guilt in the morning, promises of unbuilt features). Then confirm with real people.
5. **Only promise what exists.** Features listed on a paywall or a store page must be in the build.
6. **No guilt.** The day starts at 4 am for night owls, the lowest state is "hungry" and never "starving", no "you missed". Shame makes people uninstall.
7. **People do not find gestures.** Drag, long-press and swipe need a small looping demo the first time.
8. **Users write in their own language** even in an English app. Rules and word lists must handle French, Spanish, Arabic.
9. **Reasons to come back in week 2 must be planned,** free and offline (a weekly surprise, a weekly card).
10. **Levels: fast first, slower later** (Anass). Level 2 after one session; the last level about 3 months away, with a real surprise.

## Design
11. **Anass decides by seeing.** Three directions in two days were normal. Show boards and screens early; keep every look in tokens so a change is cheap.
12. **What read as childish or cheap:** pink and purple, rounded display fonts, emoji as icons, glow blobs, a generic blob mascot, flat grey dark mode, a long settings form.
13. **A character must be animatable.** Art from an image tool is a reference; the character in the app is rebuilt in code as layers.
14. **Marketing art that looks handmade** (clay) beat glossy 3D.
15. **Sound is design.** Real CC0 recordings, levelled to the same loudness, chosen by ear against a reference. A sound that is slightly too loud gets noticed.
16. **Design in the web preview, judge on the phone.** Gestures, haptics, sound, glass effects and widgets only show their truth on a device.

## Engineering (Expo / React Native)
17. **Training data is older than the SDK.** Read the versioned docs for the version in `package.json` before using an API. Install with `npx expo install`.
18. **Guardrails on day 1:** permissions in `.claude/settings.json`, a hook that type-checks and lints after each edit, path-scoped rules, skills for repeated jobs. They paid for themselves in the first week.
19. **A platform file can be hidden by a plain file.** `update.ts` was loaded in place of `update.android.tsx` and Android widgets never updated. Add a test that fails when a plain file shadows a platform file.
20. **No silent failures.** A `.catch(() => undefined)` hid a real error for days. Log or surface every caught error.
21. **Timers use the wall clock** (end time), not counting ticks, so they survive the app being closed.
22. **Storage has a schema version and tested migrations** from the first release. Saved settings are deep-merged with defaults.
23. **Android sound on vibrate mode:** nothing plays unless "play in silent mode" is set. Test with the ringer off.
24. **Free build workers run out of memory** on heavy native libraries: build one architecture for test builds, limit Gradle workers.
25. **Android notifications** need real-phone tests with battery saver on. Emulators lie.
26. **Analytics from the start, with a closed event list** and a test that rejects free text.
27. **Two sessions on the same files make a merge problem.** Run parallel work only on different files.

## Store and money
28. **Morocco: no purchases on Android.** This was found in the official table, not assumed. Check the rails before the business model.
29. **Check the name before the logo.** The first name was taken by a new app two weeks earlier.
30. **Rating prompt:** after the third success and two days, once per version.
31. **Test ad IDs everywhere except the store build.** Tapping your own real ads can close the account.
32. **No ads at the moment that is the product** (in Gobblo: starting a task). In every app, find that moment and protect it.
33. **Do not ask Anass to pay before he is ready.** Plan the work so it does not need the paid accounts until he says so.

## Process
34. **PROGRESS.md and DECISIONS.md made long work possible** across many sessions.
35. **One screen fully finished** (all states, light and dark, self-critique) before the next.
36. **Strong model to plan and judge, cheaper models for tests and mechanical work.**
37. **After each block: checks, then 3–5 lines to Anass** with what to try on his phone.

## Add new lessons here
One line each, with the date and the app. A lesson is something that would have saved a day.
