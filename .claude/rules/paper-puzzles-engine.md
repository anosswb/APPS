---
paths:
  - "apps/paper-puzzles/src/game/**"
---
# Paper Pines engine rules
- Pure TypeScript, no UI imports. Every function that decides something has a test.
- A puzzle is kept only if `solveLogic` finishes it. Never loosen `engine.test.ts` (one answer by brute force; every solver step agrees with the solution).
- A new solver technique needs: a tier in `types.ts`, a sentence in `src/i18n/en.ts`, and to appear in the soundness test.
- Seeds `daily-YYYY-MM-DD` and `book-<level>-<relief>` and the generator's use of the random stream must not change after launch.
- Help (relief, hints) is always in the player's favour.
