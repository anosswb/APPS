/**
 * Pay with the worker's OWN numbers (Anass, 14 Nov 2026: "don't make it constant… the people put it").
 * The app fixes no percentage. The worker types the hourly rate and any number of rules; each rule has
 * a name, an extra percentage and one condition. Everything here is an ESTIMATE before taxes.
 *
 * `percent` is the EXTRA on top of the normal rate: 50 means the hour pays 1.5 times, 100 means double.
 *
 * Choices made here that are guesses about how employers pay (not checked with US workers yet):
 * - When two rules cover the same hour, the higher percentage wins. `stack: 'add'` adds them instead.
 * - Every worked hour counts toward the daily and weekly limits, also hours already paid extra.
 * - A shift belongs to the day it starts on (a Saturday night shift is not "Sunday").
 */
import { dayNumber, keyOf, weekday } from './dates';
import { Plan, dayOn, paidHours } from './days';

export type RuleWhen =
  /** hours after the first N in one day */
  | { type: 'dayOver'; hours: number }
  /** hours after the first N in one workweek */
  | { type: 'weekOver'; hours: number }
  /** every hour on this weekday (0 = Sunday … 6 = Saturday) */
  | { type: 'weekday'; day: number }
  /** every hour on a day the worker marked by hand ("holiday", "night", "call-in") */
  | { type: 'mark'; mark: string }
  /** every hour whose clock time is inside a window, minutes after midnight (22:00 → 06:00 crosses midnight) */
  | { type: 'clock'; from: number; to: number };

export interface PayRule {
  id: string;
  name: string;
  percent: number;
  when: RuleWhen;
}

export interface PayOptions {
  /** dollars per hour; 0 = not set */
  rate: number;
  /** the workweek starts on this weekday (0 = Sunday) */
  weekStarts: number;
  /** two rules on the same hour: the higher one wins (default), or they add up */
  stack?: 'highest' | 'add';
}

export interface PayLine {
  /** extra percentage of these hours; 0 = normal hours */
  percent: number;
  hours: number;
  /** the names of the rules behind this line (empty for normal hours, "This day" for a day changed by hand) */
  names: string[];
}

export interface RulePay {
  hours: number;
  /** hours by extra percentage, normal hours first, then rising */
  lines: PayLine[];
  /** estimated pay before taxes; null when no hourly rate is set */
  gross: number | null;
  /** days in the period that are not known yet: the total can still grow */
  open: number;
}

export const ONE_DAY = 'This day';

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Hours and estimated pay between two dates (both counted), by the worker's own rules. */
export function payByRules(plan: Plan, rules: PayRule[], o: PayOptions, start: string, end: string): RulePay {
  const first = dayNumber(start);
  const last = dayNumber(end);
  const weekStart = (n: number) => n - ((((weekday(keyOf(n)) - o.weekStarts) % 7) + 7) % 7);
  const byPercent = new Map<number, { hours: number; names: Set<string> }>();
  const add = (percent: number, hours: number, names: string[]) => {
    if (hours <= 0) return;
    const line = byPercent.get(percent) ?? { hours: 0, names: new Set<string>() };
    line.hours += hours;
    names.forEach((n) => line.names.add(n));
    byPercent.set(percent, line);
  };

  let open = 0;
  let weekSoFar = 0;
  // A workweek can begin before the period does: start counting from the week's first day.
  for (let n = weekStart(first); n <= last; n++) {
    if (n === weekStart(n)) weekSoFar = 0;
    const key = keyOf(n);
    const day = dayOn(plan, key);
    const inside = n >= first;
    if (!day && inside) open++;
    const h = paidHours(day);
    if (h > 0 && inside && day?.kind === 'work') {
      if (day.extra !== undefined) add(day.extra, h, day.extra > 0 ? [ONE_DAY] : []);
      else {
        // Cut the day where a daily or weekly limit is crossed, then price each piece.
        const cuts = new Set<number>([0, h]);
        for (const r of rules) {
          if (r.when.type === 'dayOver' && r.when.hours > 0 && r.when.hours < h) cuts.add(r.when.hours);
          if (r.when.type === 'weekOver') {
            const at = r.when.hours - weekSoFar;
            if (at > 0 && at < h) cuts.add(at);
          }
          if (r.when.type === 'clock') {
            // Where the window opens and closes, in hours after the shift started (a long shift can meet them twice).
            for (const b of [r.when.from, r.when.to]) {
              for (let at = ((((b - day.start) % 1440) + 1440) % 1440) / 60; at < h; at += 24) if (at > 0) cuts.add(at);
            }
          }
        }
        const points = [...cuts].sort((a, b) => a - b);
        for (let i = 0; i + 1 < points.length; i++) {
          const from = points[i];
          const applying = rules.filter((r) => {
            const w = r.when;
            if (r.percent <= 0) return false;
            if (w.type === 'dayOver') return from >= w.hours;
            if (w.type === 'weekOver') return weekSoFar + from >= w.hours;
            if (w.type === 'weekday') return weekday(key) === w.day;
            if (w.type === 'clock') {
              const t = (((day.start + Math.round(from * 60)) % 1440) + 1440) % 1440;
              return w.from === w.to ? false : w.from < w.to ? t >= w.from && t < w.to : t >= w.from || t < w.to;
            }
            return (day.marks ?? []).includes(w.mark);
          });
          const len = points[i + 1] - from;
          if (applying.length === 0) add(0, len, []);
          else if (o.stack === 'add') add(applying.reduce((s, r) => s + r.percent, 0), len, applying.map((r) => r.name));
          else {
            const top = applying.reduce((a, b) => (b.percent > a.percent ? b : a));
            add(top.percent, len, [top.name]);
          }
        }
      }
    }
    weekSoFar += h;
  }

  const lines: PayLine[] = [...byPercent.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([percent, v]) => ({ percent, hours: round2(v.hours), names: [...v.names] }));
  const hours = round2(lines.reduce((s, l) => s + l.hours, 0));
  const gross = o.rate > 0 ? round2(lines.reduce((s, l) => s + l.hours * o.rate * (1 + l.percent / 100), 0)) : null;
  return { hours, lines, gross, open };
}

/** A starting point the worker can change or delete: the plain US federal rule. Nothing is forced. */
export const STARTER_RULES: PayRule[] = [{ id: 'week40', name: 'Overtime', percent: 50, when: { type: 'weekOver', hours: 40 } }];

/** Keep what the worker typed sane: no negative numbers, a percentage of at most 500. */
export function cleanRule(r: PayRule): PayRule {
  const percent = Math.min(500, Math.max(0, Number.isFinite(r.percent) ? r.percent : 0));
  const when: RuleWhen =
    r.when.type === 'dayOver' || r.when.type === 'weekOver'
      ? { ...r.when, hours: Math.max(0, Number.isFinite(r.when.hours) ? r.when.hours : 0) }
      : r.when;
  return { ...r, name: r.name.trim().slice(0, 30) || 'Rule', percent, when };
}
