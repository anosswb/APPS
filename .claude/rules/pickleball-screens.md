---
paths:
  - "apps/pickleball/src/screens/**"
  - "apps/pickleball/src/ui/**"
  - "apps/pickleball/App.tsx"
---
# Pickleball screen rules
- Colours, sizes, fonts only from `src/theme/tokens.ts`; words only from `src/i18n/en.ts`.
- Screens ask `src/logic/` who plays next; they never decide.
- No ad, pop-up or prompt on the Courts screen or the Scorer. Targets 56 pt minimum. Light mode only.
