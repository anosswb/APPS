# PROMPTS — copy, paste, change the words in < >

Keep prompts short. Claude already has the rules in CLAUDE.md.

## Every session
- **Start:** `Read PROGRESS.md and tell me in 5 lines where we are and what is next.`
- **End:** `/wrap-up`

## Ideas
- `/find-ideas` — 5 new ideas with first proof, in one table.
- `/find-ideas for <shift workers | truck drivers | people over 55 | puzzle players>` (always for US users)
- `/score-idea <idea name or number>` — proof and score for one idea.
- `/mine-reviews <app name 1>, <app name 2>, <app name 3>` — what their users hate.
- `Find open-source <puzzle | card | word> games with a licence we can use. Table with the licence checked in the LICENSE file.`
- `Kill this idea: <idea>. Give me the 3 strongest reasons it fails.`

## A new app
- `/make-app <name or number from IDEAS.md>` — the whole path, step by step. Claude stops when it needs you.
- `/make-app` — continue the app in progress from its current step.
- `/new-app <name>` — makes the app's files from the starter.
- `/app-world` — 3 directions for the look. `Show them as pictures. I pick.`
- `/retention-plan` — the loops, the difficulty, the reasons to come back.
- `/money-plan` — how it earns on each store, with numbers.

## Design
- `/slop-check <screenshot or screen name>`
- `Here is a screenshot from my phone. What would the best designer in this category change? Top 5 only.`
- `Dark mode looks flat. Design it on its own, don't invert.`
- `Make the first 60 seconds better. A new user must <do the main thing> before any question.`

## Build
- `Build <screen> from docs/<file>. All states. Screenshot light and dark when done.`
- `This is broken on my phone: <what happened, what I expected>. Find the cause, fix it, add a test.`
- `Use a cheaper model for the tests and checks.`

## Before the stores
- `/release-check`
- `Write the US store listing. Research the search words Americans really type first.`
- `Give me the Play Console steps for <thing>, one by one, with the button names.`

## Money and numbers
- `Run tools/roi.py with our real numbers: <installs/day>, day 1 <x>%, day 30 <y>%.`
- `The app has 30 days of numbers. Grow, fix or park? Use playbook/07.`

## When Claude drifts
`Too long. 5 lines.` · `One recommendation.` · `Show me, don't describe.` · `Did you check that or guess it?` · `That looks like every AI app.` · `That looks like our last app. Own world.` · `US users only. English. No Arabic.`
