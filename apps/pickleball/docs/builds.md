# Test builds — how Anass gets the app on his Android phone

1. Open https://github.com/anosswb/APPS/actions/workflows/pickleball-test-build.yml
2. Click the newest green run (or "Run workflow" → "Run workflow" to make a new one, about 15–20 minutes).
3. Scroll down to **Artifacts** and click **dinkline-test-apk**. It downloads a .zip.
4. On the phone: open the .zip, tap the .apk, allow "Install unknown apps" for your browser or Files app when asked, then Install.
The APK is signed with a debug key: for testing only, never for the store.

The launch test (`pickleball-launch-test.yml`) builds the same app for an emulator, opens it, waits 45 seconds and fails if it closed or the Courts screen is not shown. It runs on pull requests that change the app's packages or config, or by hand.
