/**
 * The calendar with NO pattern needed (Anass, 14 Nov 2026: "we work 10 days, or 3 days… we don't know").
 * The worker marks days one by one as they learn them. A day that nobody has marked is "not known yet":
 * it is never guessed. A ready rotation is only an optional way to fill the days the worker has not marked.
 * Days are stored by their own date ("2026-11-14"), so nothing can drift from month to month.
 */
import { addDays } from './dates';
import { Rotation, ShiftCode, plannedOn } from './rotation';

/** A working day. Times are minutes after midnight on the day the shift STARTS. */
export interface WorkDay {
  kind: 'work';
  start: number;
  /** if `end` is not after `start`, the shift ends the next day (18:00 → 06:00; 07:00 → 07:00 is 24 hours) */
  end: number;
  /** unpaid break, in minutes */
  breakMin?: number;
  /** marks the worker puts on a day by hand, used by their own pay rules: "holiday", "night", "call-in"… */
  marks?: string[];
  /** this one day only: every hour is paid at this extra percentage, whatever the rules say */
  extra?: number;
}
export interface RestDay {
  kind: 'rest';
}
export type Day = WorkDay | RestDay;

/** Days the worker marked, by date. A date that is not here is not known yet (or comes from the rotation). */
export type DayBook = Record<string, Day>;

/** Clock times for the shift letters of a ready rotation. */
export type ShiftTimes = Partial<Record<ShiftCode, { start: number; end: number; breakMin?: number }>>;

export const DEFAULT_TIMES: ShiftTimes = {
  D: { start: 6 * 60, end: 18 * 60 },
  N: { start: 18 * 60, end: 6 * 60 },
  S: { start: 14 * 60, end: 22 * 60 },
  X: { start: 7 * 60, end: 7 * 60 },
};

export interface Plan {
  book: DayBook;
  /** optional: fills the days the worker has not marked */
  rotation?: Rotation;
  times?: ShiftTimes;
}

const FAR = 366;

/** What this date is: a working day, a rest day, or null = not known yet. */
export function dayOn(plan: Plan, key: string): Day | null {
  const marked = plan.book[key];
  if (marked) return marked;
  if (!plan.rotation) return null;
  const code = plannedOn(plan.rotation, key);
  if (code === 'O') return { kind: 'rest' };
  const t = (plan.times ?? DEFAULT_TIMES)[code] ?? DEFAULT_TIMES[code];
  return t ? { kind: 'work', start: t.start, end: t.end, breakMin: t.breakMin } : null;
}

/** Minutes from the start of the shift to its end (a shift that ends the next day is handled). */
export function shiftMinutes(day: WorkDay): number {
  const span = day.end > day.start ? day.end - day.start : day.end - day.start + 24 * 60;
  return span;
}

/** Paid hours of a day: 0 for rest and for days not known yet. */
export function paidHours(day: Day | null): number {
  if (!day || day.kind !== 'work') return 0;
  return Math.max(0, shiftMinutes(day) - (day.breakMin ?? 0)) / 60;
}

export interface NextRest {
  key: string;
  /** days from `from` to that rest day (tomorrow = 1) */
  inDays: number;
  /** how many rest days in a row start there */
  length: number;
  /** false when a day before it is not known yet: rest may come sooner than this */
  sure: boolean;
}

/** The next rest day after `from` (not counting `from`), or null when none is marked in the coming year. */
export function nextRest(plan: Plan, from: string): NextRest | null {
  let sure = true;
  for (let i = 1; i <= FAR; i++) {
    const key = addDays(from, i);
    const day = dayOn(plan, key);
    if (!day) sure = false;
    else if (day.kind === 'rest') {
      let length = 1;
      while (length < FAR && dayOn(plan, addDays(key, length))?.kind === 'rest') length++;
      return { key, inDays: i, length, sure };
    }
  }
  return null;
}

/** The next working day after `from` (not counting `from`), or null. */
export function nextWorkDay(plan: Plan, from: string): { key: string; day: WorkDay; inDays: number } | null {
  for (let i = 1; i <= FAR; i++) {
    const key = addDays(from, i);
    const day = dayOn(plan, key);
    if (day?.kind === 'work') return { key, day, inDays: i };
  }
  return null;
}

/**
 * "Day 6 in a row": working days in a row up to and counting `key`.
 * 0 when `key` is not a working day. A day that is not known stops the count (we do not guess).
 */
export function workedInRow(plan: Plan, key: string): number {
  let n = 0;
  while (n < FAR && dayOn(plan, addDays(key, -n))?.kind === 'work') n++;
  return n;
}

/** How long this run of work will be in total, as far as it is known: the days before, `key`, and the days after. */
export function runTotal(plan: Plan, key: string): number {
  const before = workedInRow(plan, key);
  if (before === 0) return 0;
  let after = 0;
  while (after < FAR && dayOn(plan, addDays(key, after + 1))?.kind === 'work') after++;
  return before + after;
}

/**
 * Days since the last rest day before `key` (yesterday was rest = 1). 0 when `key` itself is a rest day.
 * null when no rest day is marked in the past year. `sure` is false when a day in between is not known.
 */
export function daysSinceRest(plan: Plan, key: string): { days: number; sure: boolean } | null {
  let sure = true;
  for (let i = 0; i <= FAR; i++) {
    const day = dayOn(plan, addDays(key, -i));
    if (!day) sure = false;
    else if (day.kind === 'rest') return { days: i, sure };
  }
  return null;
}

/** How many days between two dates (both counted) are not known yet. */
export function notKnown(plan: Plan, start: string, end: string): number {
  let n = 0;
  for (let key = start; key <= end; key = addDays(key, 1)) if (!dayOn(plan, key)) n++;
  return n;
}

/** Mark one day. Passing null takes the mark away (the day goes back to "not known" or to the rotation). */
export function markDay(book: DayBook, key: string, day: Day | null): DayBook {
  const next = { ...book };
  if (day) next[key] = day;
  else delete next[key];
  return next;
}

/** Mark a run of days the same way ("I work the next 10 days"). */
export function markRun(book: DayBook, from: string, count: number, day: Day): DayBook {
  const next = { ...book };
  for (let i = 0; i < count; i++) next[addDays(from, i)] = day;
  return next;
}
