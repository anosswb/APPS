import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** EXPO_PUBLIC_READER_PREVIEW=1 pretends a screen reader is on, only to test the labels in a browser. */
const PREVIEW = process.env.EXPO_PUBLIC_READER_PREVIEW === '1';

/** True while VoiceOver (iPhone) or TalkBack (Android) is on. */
export function useScreenReader(): boolean {
  const [on, setOn] = useState(PREVIEW);
  useEffect(() => {
    if (PREVIEW) return;
    let alive = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((yes) => {
        if (alive) setOn(yes);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('screenReaderChanged', setOn);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  return on;
}
