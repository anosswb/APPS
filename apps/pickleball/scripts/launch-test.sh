#!/usr/bin/env bash
# Installs the built app on the running emulator, opens it, and checks that it is still alive after 45 seconds.
# Prints the crash lines of the phone log if it died. Used by the "launch test" workflow.
set -u
PKG=com.anosswb.dinkline
APK=$(ls android/app/build/outputs/apk/release/*.apk | head -1)
echo "Installing $APK"
adb install -r "$APK" || exit 1
adb logcat -c
adb shell monkey -p "$PKG" -c android.intent.category.LAUNCHER 1
sleep 45
PID=$(adb shell pidof "$PKG" | tr -d '\r' || true)
adb logcat -d -v brief > logcat.txt
adb exec-out screencap -p > screen.png || true
echo "==== app process after 45 seconds: '${PID}' ===="
echo "==== crash and error lines ===="
grep -n -E "FATAL|AndroidRuntime|ReactNativeJS|SoLoader|UnsatisfiedLink|libc    :|DEBUG   :|ExpoModulesCore|\[ads\]|$PKG" logcat.txt | grep -v -E "^[0-9]+:[VDI]/(ActivityTaskManager|WindowManager|PackageManager|installd|Zygote)" | head -220
# A crash inside native code leaves a "tombstone" in the log: print all of it, with the reason and the call stack.
echo "==== native crash report (empty when there was none) ===="
grep -E "^F/|^A/|Abort message|JNI DETECTED|signal [0-9]+ \(SIG" logcat.txt | cut -c1-260 | head -120
# What is written on the screen. The Courts screen ("OPEN PLAY") must be there, not a blank or an error screen.
adb shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1 || true
adb shell cat /sdcard/ui.xml 2>/dev/null | grep -o 'text="[^"]\{1,80\}"' | head -40 > screen-text.txt || true
echo "==== words on the screen ===="
cat screen-text.txt
if [ -z "$PID" ]; then
  echo "==== THE APP DIED ===="
  exit 1
fi
if ! grep -q -i "open play" screen-text.txt; then
  echo "==== THE APP IS OPEN BUT THE COURTS SCREEN IS NOT ON THE SCREEN ===="
  exit 1
fi
echo "==== THE APP IS RUNNING AND SHOWS THE COURTS SCREEN ===="
# Second step: open the Players tab (this starts the ads) and check the app is still alive 25 seconds later.
BOUNDS=$(adb shell cat /sdcard/ui.xml 2>/dev/null | grep -o 'text="Players"[^>]*bounds="\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]"' | grep -o '\[[0-9]*,[0-9]*\]\[[0-9]*,[0-9]*\]' | head -1)
if [ -z "$BOUNDS" ]; then
  echo "==== COULD NOT FIND THE PLAYERS TAB ===="
  exit 1
fi
read X1 Y1 X2 Y2 <<<"$(echo "$BOUNDS" | tr -d '[]' | tr ',' ' ')"
adb shell input tap $(( (X1 + X2) / 2 )) $(( (Y1 + Y2) / 2 ))
sleep 25
PID2=$(adb shell pidof "$PKG" | tr -d '\r' || true)
adb logcat -d -v brief > logcat2.txt
adb exec-out screencap -p > screen-players.png || true
echo "==== ads lines after opening Players ===="
grep -E "\[ads\]|Ads|FATAL|AndroidRuntime" logcat2.txt | grep -v -E "^[VD]/" | head -40
if [ -z "$PID2" ]; then
  echo "==== THE APP DIED AFTER OPENING PLAYERS ===="
  exit 1
fi
echo "==== PLAYERS TAB OPEN, APP STILL RUNNING ===="
