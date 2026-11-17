/**
 * What is happening right now, for the line on Today. A night shift that started yesterday (6 PM – 6 AM)
 * is still "during" after midnight: it must not show "Today is not marked" at 2 AM.
 */
import { addDays } from './dates';
import { Day, dayOn, Plan, shiftMinutes, WorkDay } from './days';

export type Now =
  | { kind: 'before'; day: WorkDay; startsIn: number }
  | { kind: 'during'; day: WorkDay; clockOut: number; left: number; part: number }
  | { kind: 'done'; day: WorkDay }
  | { kind: 'rest' }
  | { kind: 'unknown' };

/** `minutes` = minutes after midnight on `today`. clockOut is minutes after midnight of the shift's own day. */
export function nowOf(plan: Plan, today: string, minutes: number): Now {
  const y: Day | null = dayOn(plan, addDays(today, -1));
  if (y?.kind === 'work') {
    const end = y.start + shiftMinutes(y);
    if (end > 1440 && minutes < end - 1440) return { kind: 'during', day: y, clockOut: end, left: end - 1440 - minutes, part: (minutes + 1440 - y.start) / (end - y.start) };
  }
  const d = dayOn(plan, today);
  if (!d) return { kind: 'unknown' };
  if (d.kind === 'rest') return { kind: 'rest' };
  const end = d.start + shiftMinutes(d);
  if (minutes < d.start) return { kind: 'before', day: d, startsIn: d.start - minutes };
  if (minutes < end) return { kind: 'during', day: d, clockOut: end, left: end - minutes, part: (minutes - d.start) / (end - d.start) };
  return { kind: 'done', day: d };
}

/** The log day the clock-in card works on: yesterday while a shift clocked in yesterday is still open, else today. */
export function clockKey(log: Record<string, { out: number | null }>, today: string): string {
  const y = addDays(today, -1);
  return !log[today] && log[y] && log[y].out === null ? y : today;
}
