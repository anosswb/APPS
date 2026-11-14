/**
 * Calendar days without clocks. A day is a text key "YYYY-MM-DD" or a day number (days since 1 Jan 1970).
 * All maths is done on day numbers, so daylight saving time, leap years and month ends can never shift a shift.
 * (Lesson from the reviews of other shift apps: "keeps moving my days from one month to another".)
 */
const DAY_MS = 86400000;

export function dayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / DAY_MS);
}

export function keyOf(n: number): string {
  const d = new Date(n * DAY_MS);
  const m = `${d.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${d.getUTCDate()}`.padStart(2, '0');
  return `${d.getUTCFullYear()}-${m}-${day}`;
}

/** Today on the phone's own calendar. */
export function todayKey(now: Date = new Date()): string {
  const m = `${now.getMonth() + 1}`.padStart(2, '0');
  const d = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

export function addDays(key: string, n: number): string {
  return keyOf(dayNumber(key) + n);
}

/** Sunday = 0 … Saturday = 6. */
export function weekday(key: string): number {
  return (((dayNumber(key) + 4) % 7) + 7) % 7; // 1 Jan 1970 was a Thursday
}

/** The weeks of a month, Sunday first (US calendars). Days outside the month are null. month: 1–12. */
export function monthWeeks(year: number, month: number): (string | null)[][] {
  const first = `${year}-${`${month}`.padStart(2, '0')}-01`;
  const start = dayNumber(first);
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (string | null)[] = new Array(weekday(first)).fill(null);
  for (let i = 0; i < days; i++) cells.push(keyOf(start + i));
  while (cells.length % 7) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
