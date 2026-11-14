# 06 — The retention engine: why people come back

Anass's brief: "Each app has an algorithm that keeps people using it. Candy Crush controls the difficulty." This page is that algorithm, for games and for non-game apps. Use `/retention-plan` to apply it to one app.

**The honest version is also the one that earns more.** A field test on 300,000+ players of a match-3 style game found that making the game *easier* for players who were about to quit raised both play time and spending (Columbia Business School, in `research/`). So our engine helps the player. It never makes the game harder to force a purchase, never fakes an "almost won", and never lies about odds. Those tricks get apps removed and reviews destroyed.

## Part A — Games

### A1. The three loops
| Loop | Length | What must happen |
|---|---|---|
| **Core** | 30–180 seconds | One level or round. Clear goal, one decision that matters, a satisfying end (win or "so close, again"). |
| **Session** | 5–15 minutes | 3–8 rounds with a rhythm: easy, easy, medium, easy, hard. Ends on a win and a reason to return. |
| **Return** | days and weeks | Something is different tomorrow: a daily puzzle, a new chapter, a collection that grows, a weekly surprise. |

Design the core loop first, in grey boxes. If one round is not fun, nothing below matters.

### A2. Difficulty: the sawtooth
Never a straight ramp. Difficulty goes up in waves, and each wave ends with a harder "boss" level and then a breath.

Target chance to win on the **first try**, by position in a block of five levels:

| Position | 1 | 2 | 3 | 4 | 5 (boss) |
|---|---|---|---|---|---|
| Target win chance | 90% | 85% | 75% | 80% | 55% |

- The first 10 levels are almost impossible to lose (95%+). They teach one rule each. Anass's instinct, "first levels fast, then slower", is exactly right.
- After a boss, the next level is easy and gives a reward. That is the "breath".
- Every 20–30 levels, add one new rule or piece. New things reset boredom.

### A3. The algorithm (per player, on the phone, no server)
```
state per player:  skill (starts at 0), fails_on_this_level, relief, days_away

before each level:
    target      = SAWTOOTH[position in block]          # table above
    if level <= 10:               target = 0.95        # onboarding
    if days_away >= 3:            target = max(target, 0.90)   # welcome back, first level only
    difficulty  = skill - logit(target) - relief       # logit(p) = ln(p / (1 - p))
    build or pick the level with that difficulty

after each try:
    expected = 1 / (1 + exp(-(skill - difficulty)))
    skill   += 0.25 * ((won ? 1 : 0) - expected)        # Elo-style: learn how good they are
    if won:    fails_on_this_level = 0; relief = 0
    else:      fails_on_this_level += 1
               if fails_on_this_level >= 2: relief = min(1.5, relief + 0.5)
```
What "difficulty" changes depends on the game. Always change things the player cannot call unfair:
- **Generated puzzles:** grid size, number of givens, which solving techniques are needed, move limit.
- **Board games with luck:** the mix of pieces offered, the starting board. With relief on, offer pieces that fit. The rules never change mid-level.
- **Action games:** speed, gaps, number of enemies.

`relief` is quiet help after two fails on the same level. It is capped, and it resets on a win. It never removes the need to play.

### A3b. Inside a level: the progress band (the "Candy Crush sauce")
**Source:** a video Anass sent on 14 Nov 2026. Its maker shows names and tables found inside the Candy Crush app files. *A source says; we did not check the files ourselves.* This is what Anass means by "the algorithm".

**What the video shows**
1. **A band for every level.** A big table gives, for each level and each move number, a lower and an upper line for how far the player should be toward the goal (it calls this "pass proximity").
2. **A check after every move.** The game compares the player's real progress with the band.
   - Falling behind → a "make easier" action: it changes the odds of the next pieces (fewer colours, more of the ones that help).
   - Too far ahead → a "make harder" action: the odds go the other way.
   - Result: most levels end close, won or lost by a move or two. Close games feel exciting, and people replay them.
3. **The money sits on the fail screen.** "Keep playing? +5 moves." Which offer, which price and which ad reward are picked from how close the player was, the losing streak, lives left, and whether they quit after failing before.

**The three ideas worth taking**
- **Measure progress during the level**, not only win or lose at the end. A level needs a "how far along" number (goal %, squares solved, lines cleared) and a usual pace.
- **Act at once when a player falls behind.** Do not wait for the fail. A stuck player closes the app.
- **Offer help at the moment of most wanting:** the near miss. A player who was 80% done wants five more moves far more than one who was 20% done. So show the "watch a video for 5 more moves" offer only when they were close. That is good targeting, not rigging.

**How we use it, by kind of game**
| Game | Behind the band | Ahead of the band | Money |
|---|---|---|---|
| Pure logic, no luck, no fail (Paper Pines) | The board cannot change (one answer). Help comes forward instead: the Hint button lights up, a mistake is pointed out | Nothing mid-puzzle. The next puzzles get harder (`nextPace`) | Ads between levels |
| Luck games (match, merge, blocks) | Kinder pieces: ones that fit, fewer colours | Our rule today: nothing mid-level; raise the next level | Near miss → optional video for 5 more moves (Android), paid continue (iPhone) |

**Where our line is today (Anass can move it; log it in DECISIONS.md)**
- Steering difficulty to keep a player in the game: yes. Both ways between levels, toward easier inside a level.
- Making a level harder mid-way so the player fails, or tuning a near miss so that a paid continue sells: no. It is the "rigged almost-won" in the hard rules. It is also the thing players write angry reviews about when they notice.
- Open question for the first luck game: Anass asked for "decide if the person wins or loses". Candy Crush does both directions. Before building that game, show him both options with a toy run (`tools/dda_sim.py`) and let him choose.

### A4. Does it work? Run the toy model
`python3 tools/dda_sim.py` plays 3,000 simulated players with the same quit rules under a fixed ramp and under the algorithm above. Output on 13 Nov 2026:
```
mode      median level   still playing @100 tries  @300 tries  win rate
static              45                       24%          0%       64%
dda                100                       59%         21%       76%
```
This is a toy: it shows the logic, not real people. With real players, the truth comes from the numbers in A7.

### A5. The fail moment (where players quit, and where money is)
A fail must feel like "my fault, and I was close", and never like a wall.
- Show how close they were, truthfully (2 moves short, 1 tile left).
- Offer ONE choice: "Watch a short video for +3 moves" (optional, only at the end of a try, never mid-play) or "Try again".
- After 3 fails: offer a free hint. After 5: offer to skip the level. A stuck player is a lost player.
- Never show an ad the player did not choose right after a fail. That is the moment they uninstall.

### A6. Reasons to come back (pick 2–3; more is noise)
| Mechanic | Honest version | Never |
|---|---|---|
| Daily puzzle | One hand-picked or seeded puzzle a day, the same for everyone, with a calendar | Punishing a missed day |
| Streak | Counts days played; a missed day is forgiven with a free "rest day" each week | "You lost your 40-day streak!" |
| Collection | Each chapter completes a picture, a tile set, a set of stamps | Paid random boxes |
| Chapters | A new look or rule every 20–30 levels, shown ahead on a map | Hiding how long it is |
| Comeback gift | After 3+ days away: an easy level and a small gift | Daily guilt notifications |
| Weekly event | A themed set for one weekend | Timers that pressure spending |

Notifications: local only, at most one a day, in the user's own daytime, asked for after the first win, with an off switch. A notification must say something true and new ("Today's puzzle is ready"), never guilt.

### A7. The numbers that tell the truth
Track these from day one (anonymous, with an off switch; playbook/10):
| Number | Good sign (puzzle) | If bad |
|---|---|---|
| Tutorial finished | over 85% | first minute is confusing or slow |
| Levels played on day 1 | 8 or more | core loop is weak or too hard early |
| Day 1 / 7 / 30 return | 35% / 15% / 5% | D1: first session. D7: no reason to return. D30: content ran out |
| Win rate on first try, per level | within 10 points of target | retune that level |
| **Quit rate per level** (last level ever played) | no spike | a spike is a "bad level": fix or remove it. King does exactly this |
| Tries before quitting a level | — | sets when to give relief |
| Session length and sessions a day | 8+ min, 2+ | session rhythm |
| Rewarded videos per daily user | 1 or more | the offer is in the wrong place or the reward is weak |
"Hard" and "bad" are different. A hard level has many tries and people stay. A bad level has people leaving. Fix bad levels first.

## Part B — Apps that are not games
There is no difficulty to tune. The engine is **value per open**.
1. **Time to first value under 60 seconds.** No sign-up, no long quiz. The first screen does the job. (Gobblo's review research: people hate a paywall or a rating prompt before they have used the app.)
2. **One-tap repeat.** The thing they do every day is one tap from the home screen or a widget.
3. **The app gets better with use.** It remembers their shifts, their favourites, their history. Leaving means losing something they built. Their data is safe and can be exported.
4. **A natural clock.** Tie the app to something that already happens: the shift roster, payday, Friday prayer, the school week. Then the reminder is a service.
5. **Show progress without shame.** Totals that only go up, "this month" summaries, a weekly card. No red, no "you missed".
6. **Something small that is new each week,** free: a tip, a colour, a summary.
7. **Adapt the pace** the same way as a game: if a user ignores three nudges, send fewer. If they come back after a week, greet them, do not list what they missed.
Numbers: used again on day 2, days active in week 1 (3+ is a habit forming), the key action per active day, day 30 return.

## The line we do not cross
- No fake scarcity or fake countdowns. No rigged near-misses. No changing odds without saying so.
- Random paid rewards must show their odds (Apple requires it), and we avoid them anyway.
- No pressure on children, no guilt, no notifications at night.
- Difficulty help is always in the player's favour.
If a mechanic only works when the user does not understand it, we do not ship it.
