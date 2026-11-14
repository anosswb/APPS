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
Made by a 12-hour shift worker. Set up in 20 seconds; one look says: what am I working today, when is my next day off, how many hours this pay period, when is payday.

## Version 1 does
1. **Your rotation, for years ahead:** pick a ready rotation (2-2-3, 4 on 4 off, DuPont, three 12s, four 10s, 24/48…) or build your own, say where you are today, done. Change any single day.
2. **Today, in one look:** shift, day off countdown, days in a row.
3. **The pay period:** hours, simple overtime (over 40 in a week), an estimate before taxes, payday countdown.
Also: free backup and restore, and export of the month as a picture.

## Version 1 does NOT do (and why)
- **Team rosters, sync between people, accounts:** needs a server; broken sync is the top complaint about the others.
- **Taxes, payslip maths, state overtime rules, double time:** different everywhere; a wrong number destroys trust. Estimates only, labelled.
- **Shift differential and attendance points:** Anass's blue-collar ideas, and no other app has them, but no review asked for them. Build after 10 real US workers say yes (or their forum threads do).
- **Alarms:** phones do this already.
- **Widget:** wanted in version 1, but it needs native code. Check how in the current Expo version before promising it.

## The one number
Days the app is opened per week, per user. Target: 5 or more (it is a daily glance). Second: share of new users who finish setup in under 60 seconds.

## Rules from the review research
1. Dates come from the rotation rule, never stored month by month. (Built and tested: `src/core/rotation.ts`.)
2. Backup and restore are free and on by default.
3. Never sell a sync we do not control.
4. Every ready rotation is tested, and the next 12 months are shown before saving.
5. Payday and pay-period hours on the first screen.
6. The widget must never show the wrong month.

## Open questions for Anass
1. What do you check or worry about at 5 am that no app helps with?
2. Do you want attendance points, differential and forced-overtime marks in version 1 anyway, before the test with US workers?
3. The working name.
