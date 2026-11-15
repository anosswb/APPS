/**
 * The two notes on a work day: lunch, and "2 hours to go". Local only, scheduled for the next 7 days,
 * rebuilt every time the calendar or the shift changes. Off until the worker turns them on.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { addDays, dayNumber, todayKey } from './core/dates';
import { dayLine } from './core/dayline';
import { dayOn, shiftMinutes } from './core/days';
import { t } from './i18n/en';
import { planOf, Saved } from './store';

const CHANNEL = 'shift-notes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export async function allowed(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const p = await Notifications.getPermissionsAsync();
  return p.granted;
}

/** Asks the phone once. Returns false when the worker said no (the switches then explain where to turn it on). */
export async function ask(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync(CHANNEL, { name: 'Shift notes', importance: Notifications.AndroidImportance.DEFAULT });
  const now = await Notifications.getPermissionsAsync();
  if (now.granted) return true;
  if (!now.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

const at = (key: string, minutes: number) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d, 0, minutes); };

export async function schedule(data: Saved, now: Date = new Date()): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!data.remind.lunch && !data.remind.twoLeft) return;
    if (!(await allowed())) return;
    const plan = planOf(data);
    const today = todayKey(now);
    for (let i = 0; i < 7; i++) {
      const key = addDays(today, i);
      const day = dayOn(plan, key);
      if (day?.kind !== 'work') continue;
      const pick = (list: readonly string[]) => list[dayNumber(key) % list.length];
      const line = dayLine(day, data.habits);
      const notes: [boolean, number, string, string][] = [
        [data.remind.lunch, line.eat, t.notes.lunchTitle, pick(t.notes.lunch)],
        [data.remind.twoLeft && shiftMinutes(day) > 180, line.clockOut - 120, t.notes.twoTitle, pick(t.notes.two)],
      ];
      for (const [on, minute, title, body] of notes) {
        const when = at(key, minute);
        if (!on || when <= now) continue;
        await Notifications.scheduleNotificationAsync({
          content: { title, body },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: CHANNEL },
        });
      }
    }
  } catch (e) {
    console.warn('Could not schedule the notes', e);
  }
}
