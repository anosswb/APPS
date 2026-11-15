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
1. **Today:** tap the days: 1 tap = work day, 2 taps = rest day, 3 taps = clear. Is the big text right? Is the line under the sky right (time to clock in, or time left in your shift)?
2. **The alarm button:** does the phone's clock open with the wake-up time filled in?
3. **My day:** change "Shift starts" with − and +. Go back to Today: did the small time on the work days change too?
4. **Pay:** type your hourly rate and set your own overtime numbers. Is the estimate for this week close to what you expect?
5. **Look:** My day → Look → Light, then Dark. Which one is better for your eyes?
6. Close the app and open it again: is everything still there?

## What this build is not
No daily reminder yet. No backup yet. No pay period or payday yet (week and month only). The sun does not glide, it jumps once a minute.
