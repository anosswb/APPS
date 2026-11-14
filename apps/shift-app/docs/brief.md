# Brief — Shift app (working title)
Written 14 Nov 2026 from `research/ideas/shift-app.md`, `shift-app-market.md` and `shift-app-reviews.md` (repo root). Anass picked this app and asked for blue-collar features.

## The person
An American who works rotating or 12-hour shifts with their hands: warehouse, factory, plant operator, mechanic, driver. Opens the app at 5 am before a shift, for five seconds, half awake. Today they use the paper roster on the wall, a photo of it, or a shift app that lost their data when they changed phones. **Anass is this person** (12-hour shifts, in Morocco: his pay rules are not the American ones).
Second group: nurses, EMS, firefighters (24/48, 48/96).

## The pain, in their words (real reviews of other shift apps)
- "The backup/restore functions don't work, so you'll have to re-create all your shifts… any time you get a new phone."
- "Keeps moving my days from one month to another one and messing up my schedule."
- "Spent an hour trying to figure it out. Then gave up and uninstalled it."
- "The widget is a month behind… until you open the actual app."
- "It asks for a pay day but it doesn't recognise a pay day and it doesn't automatically calculate."
**Not read yet:** what blue-collar workers say in their own forums (Reddit was blocked). See "Open questions".

## The gap
They all show when you work, and nobody keeps that safe and turns it into pay-period hours with payday on the screen. No shift app found is made for blue-collar workers.

## The special thing
Made by a 12-hour shift worker. No pattern needed: mark the days as you learn them. One look says: what am I working today, when do I rest, how many days in a row, how many hours this pay period, when is payday.

## Version 1 does (rewritten 14 Nov 2026 from what Anass said, below)
Three things, and each one is small.
1. **The rest-day calendar, with no pattern needed.** Mark any day in one tap: Work (with start and end time), Rest, or "not known yet". The first screen says: what today is, **when the next rest day is**, days worked in a row, days since the last rest. Days nobody has told you yet stay open, they are not guessed. A ready rotation (2-2-3, 4 on 4 off…) is an optional way to fill the calendar fast; every day can still be changed.
2. **Pay with your own numbers.** You type the hourly rate and your own overtime rules. Each rule has a name, a percentage and one condition: hours over N in a day · hours over N in a week · a weekday (Sunday) · days I mark myself (holiday, night, call-in). The app never fixes a percentage. One day can be changed by hand. The screen shows hours this pay period, an estimate before taxes (labelled "estimate") and days to payday.
3. **The morning of a shift.** A big button that opens the phone's clock to set the wake-up alarm for the next shift. A simple day line worked out from three numbers you give once (time to get ready, commute, hours of sleep you want): sleep by, wake, pack the lunch box, leave, shift, home. One note a day, the evening before: tomorrow's shift, the wake time, the lunch box, and one plain line for people who do hard work.
Also: free backup and restore to a file.

## Version 1 does NOT do (and why)
- **Meal plans, recipes, shopping lists:** version 1 only reminds you to pack the box and shows when to eat. A food planner is its own feature; later, if people ask.
- **Its own alarm clock:** the phone's clock does it better and it rings even if our app is closed. We only open it. (Android can open it with the time filled in. iPhone: not checked yet, it may only open a shortcut. Check before promising.)
- **Help for sleep, back pain, heat, family time** (Anass's point 6): research first, with real workers' words. Nothing medical, ever. Later.
- **Automatic night hours and holiday lists:** in version 1 the worker marks the special day by hand. The app does not know your plant's calendar.
- **Taxes, payslip check, state rules:** estimates only, from the worker's own numbers.
- **Team rosters, sync, accounts:** needs a server; broken sync is the top complaint about the other apps.
- **Attendance points, shift differential as its own feature:** wait for proof from US workers. (A differential can already be typed as one of the worker's own rules.)
- **Widget:** wanted soon after version 1. It needs native code; check how in the current Expo version first.
- **More than one job:** later.

## The one number
Days the app is opened per week, per user. Target: 5 or more (it is a daily glance). Second: share of new users who finish setup in under 60 seconds.

## Rules from the review research
1. Dates come from the rotation rule, never stored month by month. (Built and tested: `src/core/rotation.ts`.)
2. Backup and restore are free and on by default.
3. Never sell a sync we do not control.
4. Every ready rotation is tested, and the next 12 months are shown before saving.
5. Payday and pay-period hours on the first screen.
6. The widget must never show the wrong month.

## What Anass said after seeing the grey box (14 Nov 2026). These are requirements.
He works this life, so this outranks the review research where they differ.
1. **Work is not a fixed rotation.** "We work 10 days, or 3 days, or 10 days, 5 days. We don't know where the 5 days are going to be." So the calendar must work without any pattern: the worker marks days as they become known. **Rest days are the star:** "the calendar that has when we are going to rest." Show the next rest day, days worked in a row, days since the last rest. Ready rotations stay as an option for people who have one.
2. **Pay is the worker's own numbers.** A place for the hourly rate and for the extra percentage paid on overtime hours. "Don't make it constant, make it variant. The people put it." So: several overtime rules, each with its own percentage and its own condition (after N hours a day, after N hours a week, nights, Sundays, holidays), all typed in by the user, and changeable for one day.
3. **Daily reminder and motivation** for people who work all week. One note a day; words for adults who do hard work (no slogans, no hustle talk).
4. **Wake-up alarm:** a button that takes the worker to the phone's clock to set the alarm for the next shift. (Android can open the clock with the time filled in; on iPhone check what is allowed before promising it.)
5. **Plan the day around the shift:** food and the rest of the day. "It's hard to plan your day" around a 12-hour shift: sleep, meals, the lunch box, the commute.
6. **"Look at what blue-collar workers suffer from the most and help them."** To research before choosing (candidates, all unproven: sleep on changing shifts, tired body and back, checking the paycheck is right, too little time with family, heat and water, forced overtime at short notice). No medical or legal claims in the app.
7. **The look must be alive and modern**, "a live calendar, something good", and nothing like the paper look of Paper Pines.

## Open questions for Anass
1. What do you check or worry about at 5 am that no app helps with?
2. Do you want attendance points, differential and forced-overtime marks in version 1 anyway, before the test with US workers?
3. The working name.
