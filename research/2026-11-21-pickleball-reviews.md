# Pickleball open play app: competitor and review research (2026-11-21)

Labels: **seen** = I read it on the page in this session. **a source says** = a blog, maker site or search snippet. **guess** = my opinion.
Firecrawl calls used: 32 of 60 (4 were rate-limit failures, 2 were Reddit "site not supported"). WebFetch on Reddit was also blocked.

## Summary verdict (5 lines)
1. Fatal problem: NO, but the idea is NOT empty. Queue + rotation + score on one phone already exists in small free apps (none above 100+ installs on Google Play that I saw). (seen)
2. No app with 100K+ downloads does queue + rotation + score. The 100K+ app (Pickleheads) schedules games and has no on-court queue. (seen)
3. New copycats appeared in 2026 and the space is filling fast: PB Queue (iOS, $9.99), Pickleball Open Play Queue (Android, $4.99), Pickleball Open Play Rotation (Android, ads), Pickleball Flow, Pickleball Rotator. (seen / a source says)
4. Money risk: most are free with a one-time unlock of $4.99 to $9.99. Review text shows people hate paying for a scorer. Guess: income is small, ad-free one-time unlock is the only model people accept.
5. Big caveat: Reddit was blocked, so real-court pain is from search snippets and blogs only (thin). Before building, Anass should watch one real open play session. (guess)

## Competitor table
| App | Store | Downloads | Rating (count) | Last update | Price / ads | Queue | Rotation | Score | Account |
|---|---|---|---|---|---|---|---|---|---|
| Pickleball Open Play Queue (Fabio Tongson) | Play | 100+ | none shown | 2026-11-18 | Free, IAP Pro $4.99 once (seen) | yes, FIFO free; skill/random/manual | FIFO, winners stay (Pro) | yes, presets; match history | no account; 4-digit PIN (seen) |
| Pickleball Open Play Rotation (figs softwares) | Play | 100+ | none shown | 2026-09-17 | Contains ads (seen) | equal sit-outs | open play, winners stay, king, round robin; 1-6 courts, 5-24 players | not stated | no account, offline (seen) |
| NextUp Pickleball (MemberSports) | Play | 10+ | none shown | 2024-05-02 | free | groups/events | round robin, kings court | yes | likely (events, invites) |
| Pickleball Round Robin Mixer | Play | 100+ | none shown | 2026-09-29 | not stated | no real queue | round robin generator, king of court, timer | standings by point diff | no account, offline (seen) |
| Pickleball Flow: Round Robin (Carl Evans) | Play | 100+ | none shown | 2026-11-09 | not stated | live rounds, late/early handled | 4-24 players, 1-4 courts | optional score | offline-first (seen) |
| Pickleball Scoreboard (SeedsJP) | Play | 10K+ | 4.2 (16) | 2025-09-16 | ads + IAP | no | no | yes, side-out, big tap | no |
| Pickleball Pro Scorekeeper (Vikorus) | Play | 1K+ | 4.0 (41) | 2026-11-21 | IAP | no | no | side-out + rally, 11/15/21 | no |
| Pickleball Scores (Ster Software) | Play | 5K+ | not shown | 2026-05-11 | IAP (pro subscription) | no | no | referee style, side-out only | no |
| Pickleheads | Play | 100K+ | 4.8 (3.86K) | 2026-11-06 | ads; Pro tier | no (waitlists for signups) | round robin organize | scores in round robin | yes (phone sign-up) |
| PlayTime Scheduler | Play | 50K+ | 4.4 (129) | 2026-11-18 | Free; Premium $25/yr, Power $35/yr (a source says) | no | round robin from sign-up list | yes, players enter | yes |
| Side Out (205L Studio) | Apple | n/a | 4.5 (91) | recent (version notes seen) | Free | no | no | side-out, rally, simple; Watch | no (iCloud) |
| Pickleball Score Keeper (codeDependent) | Apple | n/a | 4.6 (134) | recent (watchOS 27 note) | $5.99 | no | no | Watch swipe; no rally scoring (review) | no |
| PB Queue (pbqueue.com) | Apple | n/a | no reviews shown | not read | Free up to 2 courts/16 players; $9.99 once | yes, "Stage Next" | auto matchmaking by rest and games | tap score, long press undo | no account (seen on its site) |
| PaddleStack (paddlestack.com) | web/venue | n/a | n/a | n/a | not stated | yes, QR join, text alerts, spoken calls | multiple queue types | yes | players sign up (venue product) |
| Reffy, PickleQ, CourtControl, Picklerlobby | web/iOS | n/a | n/a | n/a | free tiers | yes (PickleQ, Picklerlobby) | yes | yes | mixed (a source says: playreffy.com comparison, Oct 2026, a rival's page) |

Review dates: the Play pages Firecrawl returned do not show review dates (only one SeedsJP reply dated 2023-04-02). Apple reviews undated in the scrape. Google Play pages show only 3 reviews each; I could not page further. Apple: about 8 each read.

## THE KEY QUESTION
Is there a strong free app with 100K+ downloads that already does queue + rotation + score well on one phone? **NO.**
Proof (seen): the only 100K+ pickleball app found is Pickleheads (find/organize games, no on-court queue, 100K+). PlayTime Scheduler is 50K+, a scheduler. Every app that does queue + rotation on one phone has 100+ installs (Open Play Queue, Open Play Rotation, Flow, Mixer). Scorers top out at 10K+ and do no queue. One web search on Play and the web found only small or new apps. Caution: iOS download counts are not public, and PB Queue / Reffy / Picklr Lab are iOS-only and could be bigger than their Play twins (not seen).

## HATE
- Pickleheads, Play: "The app has potential, but it didn't work for me. I tried to use it once but it kept getting stuck on the first round. I entered all the scores but it kept saying it was waiting for a court. waste of time." (https://play.google.com/store/apps/details?id=com.pickleheads.mobile&hl=en&gl=US)
- PlayTime Scheduler, Play: "this app is almost impossible to follow. you cannot tell where you're at. it's a jumbled mess." (https://play.google.com/store/apps/details?id=com.ptsdev.ptsnativeapp&hl=en&gl=US)
- SeedsJP scoreboard, Play, price anger: "Overpriced for what it delivers." and "I'm not a pro umpire to be paying a subscription or exorbitant lifetime fee." (https://play.google.com/store/apps/details?id=com.naoyaono.pickleball_scoreboard&hl=en&gl=US)
- Vikorus, Play, wrong server and stuck load: "there is a wrong player serving on the serving side when it goes back to their side" and "app stuck on loading screen, would not load even after resetting phone." (https://play.google.com/store/apps/details?id=com.vikorus.pickleballScorekeeper&hl=en&gl=US). The store text itself warns: "doubles server indicators can differ from the actual serving order."
- Side Out, Apple, crashes/undo: "There’s a bug when complete a match and then click undo to go back into the match, the app freezes." and "The data syncing is really bad". (https://apps.apple.com/us/app/side-out-pickleball/id1671243214)
- Pickleball Score Keeper, Apple, accidental end of game: "if you swiped the wrong way on your last point, giving a team the winning point when they didn’t win, there was no way to go back." (fixed later) and "hands get sweaty sometimes, or I miss a swipe, and it takes a few swipes." (https://apps.apple.com/us/app/pickleball-score-keeper/id1217654817)
- Reddit snippet (search result, a source says): "Our local courts use the typical whiteboard system for drop-in games, but it gets pretty chaotic - people missing their turn, confusion about ..." (https://www.reddit.com/r/Pickleball/comments/1naf8b9/dropin_queue_management_what_works_at_your_courts/)

## MISS (wishes)
- Side Out: "a small in-game timer would be nice (many round robin games are timed and it would be great to see remaining time)" and "In open play we change partners and opponents every game." (name entry hurts) and "you really can't use this in tournament play. There is no option for TIMED matches." (https://apps.apple.com/us/app/side-out-pickleball/id1671243214)
- Side Out: "I also wish that the app saved matches by sessions so you can see how well you played for each session rather than only having stats for all play."
- Score Keeper: "Rally scoring is increasing popular and would be great if this app supported it." (https://apps.apple.com/us/app/pickleball-score-keeper/id1217654817)
- Vikorus: "the app should let the user to select manually who the serving side is" and "there should be an option to announce the running score without triggering a point." (Play link above)
- SeedsJP: "really good app, would like to be able to change background color."
- Pickleheads: "Can not use a WhatsApp group to create a player list." and "Only accepts North America phone no's" (Play link above)
- Score Keeper: "Half the time, I can’t hear the score being called" (so spoken or very loud display matters).
- Side Out: "I cannot play music from my phone via Bluetooth while keeping score at the same time." (fixed in a later version per its notes)
- Pay-intent: "If they need to get paid to keep going, I would certainly pay." (Side Out review) and "it’s well worth the $4 investment!" (Score Keeper). Guess: people pay for scoring when it just works.

## LOVE (do not break)
- Score disputes end: "makes score disputes nonexistent" (Side Out) and "Frustrated over constant scoring arguments. I love it!" (Score Keeper).
- Speed: "Only takes under a second to record a rally win or lost so is not at all disruptive to the game." (Score Keeper)
- Undo: "If you accidentally mark the wrong score it’s no big deal. There is an undo feature!" (Side Out)
- Knowing where to go: "I play every day and always know where I can go and who is playing." (PlayTime)
- Recurring games: "the recurring weekly game and automatic invites with rsvps, guests, etc makes the pro level account worth the cost" (Pickleheads)
- Maker claims, not reviews (a source says): no account, works with no signal, fairness shown in public ("Sitting out: Carlos, Beth — fewest sit-outs so far", Open Play Rotation listing).

## UNSOLVED by every app I read (guess from gaps)
- No store review of any queue app was readable yet (all have 100+ installs and no shown rating), so queue apps have no proven love. That is both the opening and the risk.
- Big score and queue and rotation in ONE flow, readable from a few feet in sun, with fast late-arrival entry: makers claim it, nobody has reviews proving it.
- Rally scoring + sideout in the same app with correct doubles server order (Vikorus has a known bug; Score Keeper had no rally mode).
- Timed games (rotate by clock, not score) in a queue app: asked for in Side Out reviews, and Score Keeper added "save results even if the game has not been completed" for rotating by time.

## How open play works at real courts
- Paddle stack / rack (a source says, playcamppickle.com and picklefriend.net): paddles go in groups of four; next four go on the next free court; game to 11; all four come off. "Real mixing needs five or six players waiting at all times; with exactly four off, the same foursome cycles back on together." Rack cannot remember who played whom.
- 4-on-4-off (Reddit snippet): "They had 1 queue for all there courts and it was 4 on 4 off." One shared queue for all courts.
- Winners stay and split (a source says): winners stay, one per side, two new players; "nobody stays longer than two games". Reddit snippet: "We do winners-stay-and-split - but that's because open play sessions are by reservation, and limited to 5 players per court."
- Challenge court: one court where a waiting pair challenges holders; winners keep it; losers go to the back. Blog warns winners-stay sorts the room by skill in about half an hour.
- King of the court / waterfall: winners up a court, losers down.
- Skill-level courts (a source says): from 4+ courts split into bands (self-rated, DUPR or organizer judgment); self-rating "unreliable in both directions".
- Whiteboard squares of four: needs one owner all night; late arrivals and leavers mean rewriting.
- Arguments (a source says): paddle racked for a friend in the parking lot ("the cardinal sin"); jumping the stack; whether winners should split ("Should they split and go to different sides of the pickleball court? Otherwise, two strongest ..." Facebook group snippet); stepping away (blog rule: "Your paddle slides back one group, not to the bottom"); targeting the weakest player; double stacking; wind knocking paddles off the fence.
- Late arrivals / leavers: whiteboards and printed rotations break; apps claim to handle them (Open Play Rotation: a latecomer "joins the queue where the group already is, so they neither jump the line nor sit all night"; Flow: "late arrivals join the next game automatically").
- Sunlight / readability: no review about glare on a phone app found (search returned only scoreboard hardware). Open Play Rotation lists a sideways big board "in letters you can read from the fence" (maker claim). Gap: unverified.
- Name entry speed: only signals are Side Out's name-change pain and makers' "paste a whole list" (PB Queue) / "fast setup and search" (Flow). Nothing measured.

## Five rules for our app
1. Time to first game under 60 seconds: paste or tap names, no account, no setup screens; late arrivals added in two taps from the main screen. (evidence: whiteboard rewrites, Side Out name pain)
2. Show WHY: next up, on deck, and a plain reason line for every sit-out. Visible fairness beats a promise; most disputes are "am I next?" and "who sat twice". (blogs, Open Play Rotation)
3. Scoring must never lose a game: giant tap targets, always-on undo, "are you sure?" on the last point, rally AND side-out, correct doubles server shown, resume after crash. (Vikorus bug, Side Out freeze, Score Keeper last-point complaint)
4. Support the real rotations by choice, one tap each: 4-on-4-off, winners stay and split, challenge court, optional skill courts; plus a clock mode for sessions rotated by time. (blogs, Side Out timed-match request)
5. Free to run a session; charge once, small (guess: $4.99 ad-free unlock; competitors range $4.99 to $9.99), never a subscription for a scorer. No ads over the big screen. (SeedsJP "exorbitant lifetime fee" anger; Android in Morocco = ads only per CLAUDE.md, so iOS purchase first)

## Gaps and honesty
- Not reached: Reddit threads (Firecrawl: site not supported; WebFetch blocked). Only titles and snippets from search. Apple pages gave about 8 reviews each; Play gave 3 each. Total reviews read: about 30. Thin themes (under 5 reviews): sunlight, late arrivals, name-entry speed, queue-app reviews (zero).
- Play ratings for the small queue apps were not shown on the page (likely too few). PB Queue and Pickleball Rotator iOS pages had no reviews in the scrape.
- Comparison page playreffy.com is a rival app's marketing; treat its claims as a source says.
- Next, if Anass wants: watch one real session, or read the Reddit threads by hand (links above), and confirm iOS ratings of PB Queue / Picklr Lab in the App Store.
