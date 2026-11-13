# 12 — Saving tokens and using agents

Anass pays for every token. The quality of answers also drops as the context fills up. So saving tokens and working well are the same habit.

## The ten rules
1. **Files are the memory.** Plans go in `PROGRESS.md`, choices in `DECISIONS.md`, facts in `research/`. A new session reads 3 small files and is ready. Never rely on a long chat.
2. **One job per session.** New job: `/clear` (or a new session). Mixing jobs carries dead weight in every later message.
3. **CLAUDE.md stays short** (under about 120 lines) and points to other files. Everything in it is paid for on every turn.
4. **Read only what the task needs.** Use the table in CLAUDE.md. Search for the line (`grep`), read a range, not the whole file.
5. **Never paste or print long output.** Pipe to `| tail -20` or `| head -40`. Save big results to a file and read the part you need.
6. **Research once.** Save it in `research/` with the date and the source. Read there first next time.
7. **Skills, not long prompts.** A skill's text loads only when it is used. Put repeated jobs in `.claude/skills/`.
8. **Hooks for must-do checks.** A hook runs every time and costs nothing to remember (type check after an edit).
9. **Subagents for wide or noisy work,** on a cheaper model. Their reading stays in their own context; only the summary comes back.
10. **Fewer connected tools.** Every connector and plugin that is switched on adds to the context. For app work, switch off the ones not needed (trading, video, email…).

## Commands worth knowing
- `/clear` — empty the context between jobs.
- `/compact` — shrink a long session at a natural break. Add what to keep: `/compact keep the file list, the failing test and the plan`.
- `/context` — see what is filling the context.
- `/model` — change the model for the session.
- Plan mode — for any job bigger than an hour. The plan is written to `PROGRESS.md` before code.
If a command is missing in your version, ask "how do I … in Claude Code" and it will check the current docs.

## Which model for which job
| Job | Model |
|---|---|
| Choosing an idea, the app's world, the retention and money plan, a hard bug, reviewing a finished feature | the strongest model (Opus) |
| Building a screen from a clear spec, tests, refactors, store text from a brief | Sonnet |
| Searching the web or the repo, reading many reviews, checking licences, listing files, formatting | Haiku |
Effort: medium by default. High only for a real design or architecture choice.

## The agents in this repo (`.claude/agents/`)
| Agent | Model | Job | Returns |
|---|---|---|---|
| `scout` | haiku | web and store research for one question | a table with links and dates, under 40 lines |
| `review-miner` | sonnet | reads competitor reviews, groups the complaints | themes with counts and 2 real quotes each |
| `license-checker` | haiku | opens LICENSE files and asset credits of a repo | licence table: can use / cannot / unclear |
| `store-checker` | sonnet | checks an app against playbook/08 before a build | each item pass / fail with file and line |
| `design-critic` | inherits | runs the slop checks on screenshots | the tells found and the 5 most important fixes |

How to brief an agent (it starts with zero context): the goal in one line · what done looks like · what is already known · what makes it hard · limits (no installs, no pushes) · the exact output shape and maximum length. Ask it to label facts: seen / source says / guess.

When NOT to use an agent: a single file to read, a quick search, anything where you need the details yourself. An agent starts cold and re-reads; for small things it costs more.

Parallel work: jobs that touch different files can run side by side (separate sessions or agents in their own git worktrees). Jobs that touch the same files run one after another.

## Screenshots and images
They cost many tokens. Take them at normal size (scale 1) for your own checks, crop to the part that matters, and look once. Use full quality only for what Anass will see.

## A good session, start to end
1. Anass: one line with the job (see PROMPTS.md).
2. Claude: reads `PROGRESS.md` and the one playbook page for the job.
3. Work. Checks. Screenshots.
4. `/wrap-up`: update PROGRESS.md, DECISIONS.md, IDEAS.md or research/; commit; 3–6 lines to Anass.
5. `/clear`.

## Signs that tokens are being wasted
Reading the same file twice · searching the web for something in `research/` · long explanations nobody asked for · five options in place of one · a chat with more than three different jobs in it · re-running a full test suite after a one-line text change · screenshots of screens that did not change.
