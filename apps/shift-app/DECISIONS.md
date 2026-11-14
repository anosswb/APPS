# DECISIONS.md

| Date | Decision | Why | Who |
|---|---|---|---|
| 2026-11-14 | The second app is the Shift app, with features for blue-collar workers | "Shift app and make some features related to blue collar." He works 12-hour shifts himself; the other candidates were in a full store | Anass |
| 2026-11-14 | Build first: a calendar that cannot lose or shift days, and pay-period hours with payday | The reviews: lost data, drifting dates and missing payday are the real complaints | Claude, from the research |
| 2026-11-14 | Attendance points, shift differential and forced-overtime marks wait for proof from real US workers | No other app has them, but no review asked for them, and the forums could not be read | Claude; Anass can overrule |
| 2026-11-14 | Every date is worked out from the rotation rule on day numbers, never stored per month | "Keeps moving my days from one month to another." A test checks ten years with no drift | Claude |
| 2026-11-14 | Pay is an estimate with the plain federal rule only (over 40 hours a week at time and a half) | State rules, double time and differential need official pages first; a wrong number destroys trust | Claude |
| 2026-11-14 | The calendar must work with no fixed rotation, and rest days come first | "We work 10 days or 3 days… we don't know where the 5 days are going to be." The research assumed rotations; the man who lives it says otherwise | Anass |
| 2026-11-14 | Overtime percentages are typed in by the user, several of them, never fixed by the app | "Don't make it constant, make it variant. The people put it." It also removes the risk of the app getting a pay rule wrong | Anass |
| 2026-11-14 | Wake-up alarm button, daily reminder with motivation, day and food planning go into the plan | His list of what a worker needs | Anass |
| 2026-11-14 | The look: alive and modern, nothing like paper | "They need a live one, like a calendar, something good, not like this, like it's from paper." | Anass |
| 2026-11-14 | The grey box uses AsyncStorage, one file, no router | It is a test, not the app. The starter's stack applies when the real screens are built | Claude |
| 2026-11-14 | Look B (the board) is out; the look comes from A (sky) and C (ring) | "I love A and C, hard to choose between." | Anass |
| 2026-11-14 | One job per tab: Today, Calendar, My day, Pay. Few colours and few words on each | "So much colour and text and things at one tab that feel distracting… put each thing in a place." | Anass |
| 2026-11-14 | A day nobody marked is "not known yet" and is never guessed; answers that cross such a day carry `sure: false` | His work has no pattern. A wrong "rest in 2 days" at 5 am is worse than "next rest you marked: Monday" | Claude, from Anass's rule |
| 2026-11-14 | A rule's percentage is the EXTRA on top of the normal rate (50 = pays 1.5 times) | "The percentage they get more when they work overpaid hours" | Claude, from his words; check the wording on the screen with him |
| 2026-11-14 | Two rules on the same hour: the higher percentage wins; adding them is a setting | A guess about how most employers pay. Not checked with US workers | Claude (guess) |
