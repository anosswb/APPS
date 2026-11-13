---
paths:
  - "apps/paper-puzzles/src/ui/**"
  - "apps/paper-puzzles/src/screens/**"
  - "apps/paper-puzzles/App.tsx"
---
# Paper Pines screen rules
- Colours, sizes, fonts only from `src/theme/tokens.ts`. Text only from `src/i18n/en.ts` through `<Type>`.
- The world is in `docs/world.md`: paper, two inks, square corners, hairline rules, no cards, shadows, gradients, emoji or icon sets.
- Nothing may appear over an open puzzle except the hint highlight and the SOLVED stamp.
- Tap targets 44 pt or more; `accessibilityLabel` on every button; `start`/`end`, never `left`/`right`.
- React Native 0.88: `StyleSheet.absoluteFillObject` no longer exists. Read the versioned docs before using an API from memory.
- After a change: `npx tsc --noEmit`, `npx jest`, web export, then look at the screen at phone size in light and dark.
