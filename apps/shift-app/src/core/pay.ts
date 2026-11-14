/**
 * Hours and pay for a pay period. Everything here is an ESTIMATE, before taxes, and the app says so.
 * Overtime here is the plain federal rule only: over 40 hours in a workweek at time and a half.
 * State rules (daily overtime in California, for example), double time, union contracts and shift
 * differential are NOT handled yet. They need checking against official pages and with real workers first.
 */
import { addDays, dayNumber, keyOf, weekday } from './dates';
import { Changes, Rotation, ShiftCode, shiftOn } from './rotation';

export interface PaySetup {
  /** days in a pay period: 7 (weekly) or 14 (every two weeks) */
  length: 7 | 14;
  /** the first day of any one pay period */
  anchor: string;
  /** payday comes this many days after the period ends (a Friday the week after = 5 or 6, for example) */
  paydayAfter: number;
  /** the workweek for overtime starts on this weekday (0 = Sunday) */
  weekStarts: number;
  /** dollars per hour; 0 = not set */
  rate: number;
}

/** Paid hours for each kind of shift. */
export type Hours = Record<ShiftCode, number>;

export function periodOf(p: PaySetup, key: string): { start: string; end: string; payday: string } {
  const offset = (((dayNumber(key) - dayNumber(p.anchor)) % p.length) + p.length) % p.length;
  const start = addDays(key, -offset);
  const end = addDays(start, p.length - 1);
  return { start, end, payday: addDays(end, p.paydayAfter) };
}

/** The next payday on or after `key`. */
export function nextPayday(p: PaySetup, key: string): string {
  // The period that pays next may be the one before this one (its payday has not come yet).
  let period = periodOf(p, addDays(key, -p.length - p.paydayAfter));
  for (let i = 0; i < 6; i++) {
    if (dayNumber(period.payday) >= dayNumber(key)) return period.payday;
    period = periodOf(p, addDays(period.end, 1));
  }
  return period.payday;
}

export function hoursBetween(r: Rotation, hours: Hours, start: string, end: string, changes: Changes = {}): number {
  let total = 0;
  for (let n = dayNumber(start); n <= dayNumber(end); n++) total += hours[shiftOn(r, keyOf(n), changes)];
  return total;
}

export interface PeriodPay {
  hours: number;
  regular: number;
  overtime: number;
  /** estimated pay before taxes; null when no hourly rate is set */
  gross: number | null;
}

/** Hours in a pay period, split by the 40-hour workweek rule. */
export function periodPay(r: Rotation, hours: Hours, p: PaySetup, start: string, end: string, changes: Changes = {}): PeriodPay {
  // Overtime is counted per workweek, and a workweek can begin before the pay period does.
  let regular = 0;
  let overtime = 0;
  const first = dayNumber(start);
  const last = dayNumber(end);
  const weekStart = (n: number) => n - ((((weekday(keyOf(n)) - p.weekStarts) % 7) + 7) % 7);
  for (let w = weekStart(first); w <= last; w += 7) {
    let before = 0; // hours of this workweek that fall before the pay period
    let inside = 0;
    for (let n = w; n < w + 7; n++) {
      const h = hours[shiftOn(r, keyOf(n), changes)];
      if (n < first) before += h;
      else if (n <= last) inside += h;
    }
    const regularLeft = Math.max(0, 40 - before);
    regular += Math.min(inside, regularLeft);
    overtime += Math.max(0, inside - regularLeft);
  }
  const total = regular + overtime;
  return { hours: total, regular, overtime, gross: p.rate > 0 ? Math.round((regular * p.rate + overtime * p.rate * 1.5) * 100) / 100 : null };
}
