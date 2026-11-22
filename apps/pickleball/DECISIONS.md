# DECISIONS.md — Dinkline (pickleball open play)

Newest at the bottom. "Claude" = decided while Anass slept (21 Nov 2026, he approved building everything); he can overrule any of them.

| Date | Decision | Why | Who |
|---|---|---|---|
| 2026-11-21 | Go on after the review research: no fatal problem. | No free 100K+ app does queue + rotation + score on one phone (Pickleheads 100K+ is a finder/organizer; queue apps have ~100 installs). Risk: many tiny new copycats. | Claude |
| 2026-11-21 | Working title **Dinkline** (one constant: `APP_NAME` in `src/i18n/en.ts`, package `com.anosswb.dinkline`). | "Next Up" = NextUp Pickleball on Play; "Paddle Stack" = PaddleStack and Paddle Stacker; CourtCall exists. Web search showed no "Dinkline" app. No trademark/domain check yet. | Claude |
| 2026-11-21 | Look: **A · Hard Court** (light ground, black ink, court blue with green surround, ball yellow as fill only). B (night board) and C (park paint) are in `docs/world/`. | Readable in full sun at arm's length; every colour comes from a real US court. To switch: `src/theme/tokens.ts` only. | Claude |
| 2026-11-21 | Light mode only in v1. | Outdoor use in sun; a separate dark design is not worth it before people use it. | Claude |
| 2026-11-21 | Rotation default: **all four off**, winners and losers interleaved at the back of the line; teams picked to avoid repeated partners. Winners-stay (max 2 wins) as a setting. | Matches the paddle rack most parks use; mixing partners is a top complaint (source says). | Claude |
| 2026-11-21 | Side-out doubles starts at 0-0-2; first lost rally is a sideout. Rally scoring as a setting. Game to 11/15/21, win by 2. | Official rule; scorer reviews complain about wrong server numbers. | Claude |
| 2026-11-21 | **No ad SDK and no purchases in the first test APK.** Money plan written in `docs/money.md` for Anass's yes. | First question is "is it useful at a real court?". Fewer native parts = less crash risk tonight. | Claude |
| 2026-11-21 | No Expo Router; three tabs + scorer in `App.tsx`. AsyncStorage with a schema version. | Same proven setup that builds in CI for Paper Pines; enough for 4 screens. | Claude |
| 2026-11-21 | Slop-check (design-critic) fixes applied: no white card behind courts, ink outline on yellow buttons, text at 15–16 px, labelled "Move up", scorer Close/Undo moved to the bottom. Not done: Players rows as tap-to-open sheets; error/offline states (the app has no network). | Sun readability and one-hand use. | Claude |
| 2026-11-22 | Anass tested the APK: "It's good." | First phone test passed. | Anass |
| 2026-11-22 | **Money plan approved** (`docs/money.md`): iPhone one-time unlock (about $4.99) for 3+ courts and the winners rules; Android one small banner on Players and Settings only, test ad IDs until he says otherwise. | His "Yes" to point 2. | Anass |
| 2026-11-22 | **Name stays Dinkline** (a "dink" is the soft shot into the kitchen, so it is a pickleball word). Trademark check still to do before the store. | "If it's related to pickleball keep it." | Anass |
| 2026-11-22 | Court opening animation: the court swoops down (tilt), a ball flies over the net, a glass shine sweeps across, names float in; blue glass "LIVE" tag with a breathing dot. Once per game, off with Reduce Motion. Glass is drawn (no blur library): same on every phone and readable in sun. | "Add some animation in the court when it's open, Apple glass type, something dope." | Anass (ask), Claude (how) |
