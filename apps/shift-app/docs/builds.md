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
1. **Today:** tap the days of the week. One tap = work, two = rest, three = not known. Does the big text say the right thing ("Rest in 2 days", "Day 3 in a row")?
2. **The alarm button:** does the phone's clock open with the wake-up time filled in?
3. **My day:** change your shift start, get-ready time and commute with − and +. Are the times right for your real day? (New shift times apply to days you mark after the change.)
4. **Calendar:** mark a few weeks. Close the app, open it again: is everything still there?
5. Look at Today at different hours: the sky changes (before sunrise, day, evening, night).

## What this build is not
Pay is only a note. No reminder yet. No backup yet. The sun does not glide, it jumps once a minute.
