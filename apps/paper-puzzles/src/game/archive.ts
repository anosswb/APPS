/** The calendar of past daily puzzles. Pure date helpers, no UI. */
import { dateKey, keyToDate } from './daily';

/** The first day that has a daily puzzle. Must not change after launch. */
export const FIRST_EDITION = '2026-11-01';

export interface Month {
  year: number;
  /** 0 = January */
  month: number;
}

export function monthOf(key: string): Month {
  const d = keyToDate(key);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function addMonths(m: Month, delta: number): Month {
  const d = new Date(m.year, m.month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function monthIndex(m: Month): number {
  return m.year * 12 + m.month;
}

/** Can the calendar go to this month? Not before the first edition, not after today. */
export function monthInRange(m: Month, today: string): boolean {
  const i = monthIndex(m);
  return i >= monthIndex(monthOf(FIRST_EDITION)) && i <= monthIndex(monthOf(today));
}

/** A past or present day with a puzzle. Date keys sort correctly as plain text. */
export function canPlay(key: string, today: string): boolean {
  return key >= FIRST_EDITION && key <= today;
}

/**
 * The month as rows of seven days, Monday first (the puzzle week builds up to the big Sunday one).
 * Empty squares before the 1st and after the last day are null.
 */
export function monthGrid(m: Month): (string | null)[][] {
  const first = new Date(m.year, m.month, 1);
  const days = new Date(m.year, m.month + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const cells: (string | null)[] = new Array(lead).fill(null);
  for (let d = 1; d <= days; d++) cells.push(dateKey(new Date(m.year, m.month, d)));
  while (cells.length % 7) cells.push(null);
  const rows: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}
