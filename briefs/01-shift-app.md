# 01 — Shift app
**Tool · for Americans on rotating and 12-hour shifts: nurses, warehouse and factory workers, EMS, plant operators · first-guess score 33/40 · about 4 weeks**

## What it is
A calendar that understands shift patterns. You enter your pattern once (for example 2 days, 2 nights, 4 off) and it shows every shift for the next year. It also counts your hours, your overtime and what you earned this month.

## The special thing
Made by someone who works 12-hour shifts. Setup takes 20 seconds, and one look tells you: what am I working today, when is my next day off, how much have I earned.

## What to put in version 1
- **Pattern setup:** pick a common pattern or build your own, choose the first day, done.
- **Month view:** one colour per shift type (day, night, off, holiday). Readable at arm's length.
- **Today card:** "Night shift, 19:00–07:00. Next day off: Saturday."
- **Change one day:** tap a day to swap, add an extra shift, mark sick or holiday.
- **Hours and pay:** hourly rate, overtime (time and a half after 40 hours a week by default, editable), shift differential; totals for the pay period. Always labelled "estimate", before taxes.
- **Share the month as a picture** by text message (for the family and the babysitter).
- **Home-screen widget:** today and the next day off.
- A note on any day.

## What NOT to put
Team rosters, sync, calendar import, tax or payslip maths (different in every country), alarms. Later, if people ask.

## The world (first direction)
The roster pinned on the break-room wall. Bold blocks of colour, strong black type, a magnet-board feel. **Signature:** the month is a strip of blocks you can read from two metres, and it shares as a clean picture.

## Why people come back
They need it every day: a glance in the morning, the widget, the countdown to the next day off and to payday, a short month summary ("168 hours, 22 overtime").

## How it earns
- **iPhone:** free = one pattern, calendar, basic hours. One-time unlock ($4.99–6.99 to test): widgets, pay totals and export, more than one job, colour sets.
- **Android:** light ads only (a small ad on the summary page, a video to try a colour set for a week). Never on the calendar.
- **Protected moment:** opening the app to see today's shift.

## Build order
1. Pattern engine: pattern + start date → shift for any date. Pure functions, many tests (leap years, month ends, changes on one day).
2. Grey-box month view with 5 ready patterns. Anass tries it with his real roster.
3. Setup in 20 seconds. Today card.
4. Hours and pay. Share picture. Widget.
5. World, then `/slop-check`.

## Check first
US search phrases ("shift calendar", "shift schedule", "nurse schedule", "work schedule") · the top 5 shift calendars in the US store and their 1–3 star reviews · the most common US patterns (3×12 for nurses, 2-2-3, 4 on 4 off, DuPont, Pitman) · how widgets are built in the current Expo version.

## What Anass does
Says what a shift worker really needs at 5 am (he knows). Then we test the grey box on American shift workers found in their online groups, because their patterns and pay rules are not the same as his.

## Biggest risk
It earns mostly on iPhone, and shift calendars already exist. **Answer:** be faster to set up and nicer to read than all of them, and let the review research say exactly where they fail. Wrong pay numbers destroy trust: the user sets every rate and the word "estimate" stays.
