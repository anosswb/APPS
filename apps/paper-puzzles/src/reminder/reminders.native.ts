/**
 * The daily reminder on a real phone (iPhone and Android). Notes are planned on the phone itself with
 * expo-notifications: nothing is sent anywhere, and no push service is used.
 * NOT YET TRIED ON A PHONE (14 Nov 2026): see PROGRESS.md.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { keyToDate } from '../game/daily';
import { t } from '../i18n/en';
import { palettes } from '../theme/tokens';
import { PlannedNote } from './plan';
import type { Reminders } from './reminders';

const CHANNEL = 'daily-puzzle';

// A note that arrives while the puzzle page is open would only be in the way: show nothing.
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: false, shouldShowList: false, shouldPlaySound: false, shouldSetBadge: false }),
});

/** Android shows its permission prompt only once a channel exists, so this runs before every question. */
async function channel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: t.reminder.channel,
    description: t.reminder.channelAbout,
    importance: Notifications.AndroidImportance.DEFAULT,
    showBadge: false,
    enableVibrate: false,
  });
}

async function allowed(): Promise<boolean> {
  const now = await Notifications.getPermissionsAsync();
  return now.granted;
}

export const reminders: Reminders = {
  available: () => true,
  allowed,
  ask: async () => {
    await channel();
    const now = await Notifications.getPermissionsAsync();
    if (now.granted) return true;
    if (!now.canAskAgain) return false;
    const answer = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
    return answer.granted;
  },
  set: async (notes: PlannedNote[]) => {
    await channel();
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const note of notes) {
      await Notifications.scheduleNotificationAsync({
        identifier: `daily-${note.key}`,
        content: {
          title: t.reminder.noteTitle(keyToDate(note.key)),
          body: t.reminder.noteBody(note.n, note.grade),
          sound: 'default',
          color: palettes.light.accent,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: note.at, channelId: CHANNEL },
      });
    }
  },
  clear: async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
  onOpen: (run) => {
    // The app was closed and a tap on a note started it.
    try {
      if (Notifications.getLastNotificationResponse()) {
        Notifications.clearLastNotificationResponse();
        run();
      }
    } catch (error) {
      console.warn('Could not read the opening note', error);
    }
    // The app was in the background and a tap on a note brought it back.
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      Notifications.clearLastNotificationResponse();
      run();
    });
    return () => sub.remove();
  },
};
