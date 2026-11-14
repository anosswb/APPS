/**
 * The daily reminder, as plain rules (no phone code here, so it can be tested).
 *
 * One note a day, only if the player said yes. The notes are made on the phone itself: no server, no account.
 * We plan a week ahead each time the app is opened. So after a week of silence the notes stop on their own.
 * That is on purpose: a puzzle page that keeps knocking gets deleted.
 */
import { dailySpec, dateKey } from '../game/daily';
import { Grade } from '../game/types';

/** How many days ahead are planned. Also the number of days after which a silent player is left alone. */
export const REMINDER_DAYS = 7;

/** The three times offered in Settings, as the hour of the day on the player's own clock. */
export const REMINDER_HOURS = { morning: 8, noon: 12, evening: 19 } as const;
export type ReminderTime = keyof typeof REMINDER_HOURS;
export const DEFAULT_REMINDER_TIME: ReminderTime = 'morning';

export interface ReminderState {
  on: boolean;
  time: ReminderTime;
  /** the yes/no question was shown once; we never ask twice */
  asked: boolean;
}

export interface PlannedNote {
  /** the day of the puzzle it announces, YYYY-MM-DD */
  key: string;
  at: Date;
  n: number;
  grade: Grade;
}

/** Notes are not planned closer than this, so one never pops up while the player is closing the app. */
const MIN_LEAD_MS = 60 * 1000;

/**
 * The next notes to put on the phone: one per day at the chosen hour, starting with the first moment
 * still ahead. A day whose puzzle is already solved gets no note.
 */
export function planReminders(now: Date, time: ReminderTime, isSolved: (key: string) => boolean, days: number = REMINDER_DAYS): PlannedNote[] {
  const hour = REMINDER_HOURS[time];
  const out: PlannedNote[] = [];
  // Look one day further than we plan, because today's slot is often already behind us.
  for (let i = 0; i <= days && out.length < days; i++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, hour, 0, 0, 0);
    if (at.getTime() - now.getTime() < MIN_LEAD_MS) continue;
    const key = dateKey(at);
    if (isSolved(key)) continue;
    out.push({ key, at, ...dailySpec(key) });
  }
  return out;
}

/** Should the yes/no question be shown now? Only once, only after a solved daily puzzle, only where notes work. */
export function shouldAsk(state: ReminderState, available: boolean, solvedToday: boolean): boolean {
  return available && solvedToday && !state.asked && !state.on;
}
