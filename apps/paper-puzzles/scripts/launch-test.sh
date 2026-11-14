#!/usr/bin/env bash
# Installs the built app on the running emulator, opens it, and checks that it is still alive after 25 seconds.
# Prints the crash lines of the phone log if it died. Used by the "launch test" workflow.
set -u
PKG=com.anosswb.paperpuzzles
APK=$(ls android/app/build/outputs/apk/release/*.apk | head -1)
echo "Installing $APK"
adb install -r "$APK" || exit 1
adb logcat -c
adb shell monkey -p "$PKG" -c android.intent.category.LAUNCHER 1
sleep 25
PID=$(adb shell pidof "$PKG" | tr -d '\r' || true)
adb logcat -d -v brief > logcat.txt
adb exec-out screencap -p > screen.png || true
echo "==== app process after 25 seconds: '${PID}' ===="
echo "==== crash and error lines ===="
grep -n -E "FATAL|AndroidRuntime|ReactNativeJS|SoLoader|UnsatisfiedLink|libc    :|DEBUG   :|ExpoModulesCore|$PKG" logcat.txt | grep -v -E "^[0-9]+:[VDI]/(ActivityTaskManager|WindowManager|PackageManager|installd|Zygote)" | head -220
# What is written on the screen. The front page must be there, not a blank or an error screen.
adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1 || true
adb shell cat /sdcard/ui.xml 2>/dev/null | grep -o 'text="[^"]\{1,80\}"' | head -40 > screen-text.txt || true
echo "==== words on the screen ===="
cat screen-text.txt
if [ -z "$PID" ]; then
  echo "==== THE APP DIED ===="
  exit 1
fi
if ! grep -q "Paper Pines" screen-text.txt; then
  echo "==== THE APP IS OPEN BUT THE FRONT PAGE IS NOT ON THE SCREEN ===="
  exit 1
fi
echo "==== THE APP IS RUNNING AND SHOWS THE FRONT PAGE ===="
