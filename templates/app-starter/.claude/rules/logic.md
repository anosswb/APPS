---
paths:
  - "src/game/**"
  - "src/features/**/logic*.ts"
  - "src/lib/**"
---
# Logic rules
- Pure functions, no UI imports, each with tests. Generators take a seed so a level can be rebuilt.
- Generated puzzles must have exactly one solution; a test proves it.
- Difficulty comes from the engine in docs/retention.md. Help is always in the player's favour.
- Storage changes need a schema version bump and a migration test.
- No silent `catch`. Timers use an end time.
- Code taken from open source is listed in THIRD_PARTY.md with its licence.
