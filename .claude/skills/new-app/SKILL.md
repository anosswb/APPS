---
name: new-app
description: Start a new app from the starter template (files, rules, docs skeleton). Use when Anass has picked an idea to build.
---
# /new-app <name>
Before anything: the idea has a filled card in `research/ideas/` with a "build" decision from Anass. If not, run `/score-idea` first.
1. Name check (playbook/11): stores, trademark search, domain, handles. Report risks. The name is one constant in code.
2. The app gets its own folder: `apps/<short-name>/` in this repo. Create the Expo project there (in a cloud session use `EXPO_OFFLINE=1` with `npx expo install`).
3. Copy `templates/app-starter/` into that folder (its `.claude/rules` go to the repo's root `.claude/rules/` with the paths prefixed by the app folder). Rename `gitignore.txt` to `.gitignore`. Replace `<APP>` and fill `docs/brief.md` from the idea card and from the app's brief in `briefs/` if it has one.
4. Do NOT copy any look, palette, mascot or screen from another app. `docs/world.md` stays empty until `/app-world`.
5. Stack: the one in the starter's CLAUDE.md. Read the current versioned docs before creating the project.
6. Next steps for this app, in order: `/mine-reviews` → `/app-world` → `/retention-plan` → `/money-plan` → grey-box core loop → first real screen → `/slop-check`.
7. Write the plan in the app's `PROGRESS.md`. Add a row to this repo's `DECISIONS.md`.
