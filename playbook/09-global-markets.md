# 09 — The market: United States first

Anass's rule (13 Nov 2026): **"No Arabic, no Darija. We target the US."** Every app is made for American users, in English. Other countries get the same English app for free reach. Other languages come later, only for an app that is already winning.

## Why the US
- The highest ad prices and the highest spending per user among large countries (`research/`, benchmarks).
- More than half of American phone users are on iPhone, which is where we can sell (playbook/07). *(Common knowledge, not checked today: confirm the current share before leaning on it.)*
- One language, one culture to get right, one set of search words.

## Build for an American user
| Thing | US default |
|---|---|
| Language | American English: "color", "favorite", "check" (not cheque), "truck", "paycheck", "vacation" |
| Money | $ before the number, two decimals: $1,234.50 |
| Dates and time | Month/day/year. 12-hour clock with AM/PM. Week starts on Sunday |
| Units | Feet, inches (with fractions for trades), miles, pounds, ounces, °F, gallons. Metric as a setting |
| Work words | Overtime after 40 hours a week ("time and a half"), shift differential, PTO, paycheck, W-2 / 1099. Never give tax or legal advice |
| Names of things | Forklift, semi / tractor-trailer, jobsite, break room, time card |
| Tone | Friendly, plain, direct. No British spelling, no formal phrases |
| Sharing | Text message and the system share sheet first |
All of these come from the phone's settings where possible; the table is what the app shows when the phone is set to the United States.

## Getting the English right
Anass and Claude are not Americans. So:
- Claude writes in American English and checks spelling and units.
- **A US native reads the store listing, the onboarding and the paywall before each release** (a friend, a tester from the target group, or a paid proofreader for a few dollars).
- Use the words real users use: copy them from American reviews and forum posts.
- Test screenshots and the name on Americans in the target group, not on friends at home.

## Know the American user (per app, in `docs/brief.md`)
Research them the same way as any user, with extra care because we do not live there:
- Read where they talk: Reddit, Facebook groups, YouTube comments, trade forums, App Store reviews (US store).
- Learn the rules of their job from official US sources when the app touches work (pay, safety, driving). Describe; never advise.
- Mind what is sensitive in the US: politics, religion, race, guns, health claims, anything about children. Stay out of all of them.

## The US calendar (ship 6–10 weeks before)
New Year (resolutions) · tax season, January to mid-April (pay, mileage, invoices) · spring and summer (outdoors, fishing, building season) · back to school · hunting season in the fall · Thanksgiving and the holidays (games for families, gifts of time).

## Soft launch and other countries
- Test first in **Canada, Australia or New Zealand**: English speakers with similar habits, so mistakes cost less.
- Then the United States. Then the UK, Ireland and the rest of the English-speaking world with the same app (add metric and day/month dates as settings).
- The app is open in every country from day one; tier-3 installs bring ratings and testers but little money.

## Other languages: later, and only for a winner
When an app passes its 30-day test (playbook/07) and the store numbers show real demand:
1. **Spanish** first. Tens of millions of people in the US speak Spanish at home, and many work in the trades our tools are for.
2. Then by the store's own download numbers: German, French, Portuguese, Japanese.
3. **Not Arabic and not Darija** (Anass's rule). If he ever changes this, it is his call, written in `DECISIONS.md`.
Translate the listing and the app together, with a native reader.

## Keep the code ready anyway (it is cheap now, expensive later)
- All text in language files, none in code or images.
- Dates, numbers, money and units formatted from the phone's locale.
- Layouts that survive longer words. `start`/`end` in place of `left`/`right`.

## Technical reach
App size small. Works offline. Runs well on a four-year-old low-cost Android phone as well as a new iPhone: many American shift and trade workers use budget Android phones.
