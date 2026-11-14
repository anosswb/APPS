# Builds — how to get Paper Pines on a real Android phone

The test app is built by GitHub, for free, with no Expo account. It is a real installed app (not Expo Go), signed for testing only.

## Get the test app (about 20 minutes, most of it waiting)
1. Open the repo on github.com and tap **Actions** (top bar).
2. On the left, tap **Paper Pines test build (Android APK)**.
3. Tap **Run workflow**, keep the branch `main`, tap the green **Run workflow** button.
4. Wait until the run shows a green tick (15–20 minutes the first time).
5. Tap the run, scroll down to **Artifacts**, tap **paper-pines-test-apk**. A zip file downloads. (You must be logged in to GitHub in that browser.)
6. On the phone: open the zip, tap the `.apk` file, allow "install unknown apps" for your browser or file app when Android asks, tap **Install**.

If the run shows a red cross: tap it, tap the red step, copy the last 30 lines and send them to Claude.

## What this build is and is not
- It is the same code as `main`, in release mode, so speed, touch, sound and vibration are real.
- It is signed with a test key. It can never be uploaded to Google Play. The store build comes later, with a real key that Anass keeps.
- It installs as its own app: `com.anosswb.paperpuzzles`. That ID is permanent once the app is on a store.

## Try the daily reminder on the phone
1. Solve today's puzzle. Under it, tap **Yes, tell me**, then **Allow** on the phone's own question.
2. Open **Settings** in the app and pick the time that comes next (for example **7 PM** in the afternoon).
3. Close the app. Today's puzzle is solved, so the first note comes **tomorrow** at that time.
4. To see a note the same day: on a day when you have not solved the puzzle yet, turn the reminder on in **Settings** and pick a time that is still ahead.
5. Tap the note: the app should open on today's puzzle.
6. Tell me: did it come, how late, did it make a sound, and does the small red tent show beside it?

## The other workflow
**Paper Pines checks** runs the type check and the tests on every pull request that touches the app. A green tick on the pull request means they passed.

## Status
Written on 14 Nov 2026. The Android project was generated once in a cloud session and came out valid (icons, opening screen, app ID). **The full build has not run yet:** the first run on GitHub is the real test. Since then two native libraries were added (ads, notifications); both generate cleanly, neither has been built.
