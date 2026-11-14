/**
 * The heart of the app: a rotation is a repeating list of shifts and the date it starts from.
 * The shift on ANY date is worked out from that rule. Nothing is stored month by month,
 * so nothing can drift, and one changed day never touches the others.
 */
import { addDays, dayNumber } from './dates';

/** D day · N night · S swing (afternoon/evening) · X a 24-hour shift · O off */
export type ShiftCode = 'D' | 'N' | 'S' | 'X' | 'O';

export interface Rotation {
  /** the repeating pattern, one entry per day */
  cycle: ShiftCode[];
  /** the date of the first day of the pattern (any one of them) */
  anchor: string;
}

/** One-off changes to single days (a swap, an extra shift, a sick day), by date. */
export type Changes = Record<string, ShiftCode>;

export function patternDay(r: Rotation, key: string): number {
  const n = r.cycle.length;
  return (((dayNumber(key) - dayNumber(r.anchor)) % n) + n) % n;
}

/** What the rotation says for this date, before any one-off change. */
export function plannedOn(r: Rotation, key: string): ShiftCode {
  return r.cycle[patternDay(r, key)];
}

export function shiftOn(r: Rotation, key: string, changes: Changes = {}): ShiftCode {
  return changes[key] ?? plannedOn(r, key);
}

/** "Today is day 3 of my pattern" → the anchor date. position starts at 0. */
export function anchorFor(today: string, position: number): string {
  return addDays(today, -position);
}

/** The first day off after `from` (not counting `from` itself), or null if the rotation has none. */
export function nextOff(r: Rotation, from: string, changes: Changes = {}): string | null {
  for (let i = 1; i <= 366; i++) {
    const key = addDays(from, i);
    if (shiftOn(r, key, changes) === 'O') return key;
  }
  return null;
}

/** The first working day after `from`. */
export function nextWork(r: Rotation, from: string, changes: Changes = {}): string | null {
  for (let i = 1; i <= 366; i++) {
    const key = addDays(from, i);
    if (shiftOn(r, key, changes) !== 'O') return key;
  }
  return null;
}

/** How many days in a row are worked, counting `key` (0 if it is a day off). */
export function runLength(r: Rotation, key: string, changes: Changes = {}): number {
  if (shiftOn(r, key, changes) === 'O') return 0;
  let n = 1;
  while (n < 366 && shiftOn(r, addDays(key, -n), changes) !== 'O') n++;
  let after = 1;
  while (after < 366 && shiftOn(r, addDays(key, after), changes) !== 'O') after++;
  return n + after - 1;
}
