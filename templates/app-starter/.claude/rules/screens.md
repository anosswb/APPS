---
paths:
  - "src/app/**/*.tsx"
  - "src/screens/**/*.tsx"
  - "src/components/**/*.tsx"
---
# Screen rules
- Colours, sizes, radii and durations only from the token file. No hex, no magic numbers.
- Text only from `src/i18n/`. Sentence case. The app name is a constant. `start`/`end`, never `left`/`right`.
- One icon set, no emoji as icons. Every icon button has `accessibilityLabel`. Targets 44 pt or more.
- Design every state: first time, empty, loading, error, offline, success, returning.
- The screen shows this app's signature (docs/world.md) or has a reason not to.
- Before calling it done: screenshot, `/slop-check`, fix.
