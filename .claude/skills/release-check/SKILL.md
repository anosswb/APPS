---
name: release-check
description: Run every quality, privacy and store gate before a test build or a store submission. Use before any build that leaves the computer.
---
# /release-check
Stop at the first failure, fix it, start again.
1. The app's own checks: doctor, type check, lint, tests, end-to-end flow of the core loop.
2. Start the `store-checker` agent on the app (playbook/08 and the newest `research/` file).
3. Security list from `playbook/10` ("Before each release").
4. Open the two official store pages named at the top of playbook/08 and read the latest change notes. If something new applies, add it to a new `research/` file and to playbook/08.
5. Screens: small phone, large phone, light, dark, largest font, airplane mode.
6. Report to Anass in max 8 lines: fails fixed, what he must check by hand, what is ready. Never build or submit without his yes.
