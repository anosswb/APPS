# Builds — how to get the Shift app on a real Android phone

Built by GitHub, for free, with no Expo account. A real installed app, signed for testing only (it can never go to Google Play).

## Get the test app (about 15–20 minutes, most of it waiting)
1. Open the repo on github.com and tap **Actions**.
2. On the left, tap **Shift app test build (Android APK)**.
3. If a run with a green tick is already there, tap it. If not: tap **Run workflow**, keep `main`, tap the green **Run workflow**, and wait for the green tick.
4. In the run, scroll down to **Artifacts** and tap **shift-app-test-apk**. A zip downloads (you must be logged in to GitHub).
5. On the phone: open the zip, tap the `.apk`, allow "install unknown apps" when Android asks, tap **Install**.

If the run shows a red cross: tap it, tap the red step, copy the last 30 lines and send them to Claude.

## What to try (5 minutes)
1. **First open:** the welcome page. Is it clear? Tap **Start**. (If you had the old version installed, you will not see it: open My day and tap "Show the welcome page again".)
2. **Today:** tap the days (1 tap = work day, 2 taps = rest day, 3 taps = clear). Blue dot = work, green bar = rest.
3. **My day:** change "Shift starts" and "Shift ends". The times above must change at once, and so must Today.
4. **Pay:** type your hourly rate, your fixed hours a day and your overtime extra. Tap **Clock in now** when you start, **Clock out now** when you finish. To add a past day: tap it in the list, set the times with − and +, tap **Done**.
5. **Look:** My day → Look → Light, then Dark.
6. **Alarm button** on Today: does the phone's clock open with the time filled in?

## What this build is not
No daily reminder yet. No backup yet. No pay period or payday yet (week and month only). No widget.
