---
paths:
  - "apps/pickleball/src/logic/**"
---
# Pickleball logic rules
- Pure functions only (no React, no storage). `now` is a parameter. Every change has a test.
- The fairness test (games even, partners spread) and the side-out start "0-0-2" test must stay green.
