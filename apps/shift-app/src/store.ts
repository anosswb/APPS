/** What the app saves on the phone. One key, with a version number so later builds can upgrade old data. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayBook, Plan } from './core/days';
import { addDays } from './core/dates';
import { DEFAULT_HABITS, Habits } from './core/dayline';
import { PayRule } from './core/payrules';

export const SCHEMA = 1;
const KEY = 'shift-app/data';

export interface Saved {
  v: number;
  book: DayBook;
  habits: Habits;
  /** the usual shift, used when a day is marked as work. Minutes after midnight. */
  shift: { start: number; end: number };
  /** what really happened: clock-in and clock-out per day, minutes after midnight. out null = still at work */
  log: Record<string, { in: number; out: number | null }>;
  /** the welcome page was seen */
  welcomed: boolean;
  /** 'auto' follows the phone */
  look: 'auto' | 'light' | 'dark';
  /** the worker's own pay numbers. A percentage of 0 means the rule is off. */
  pay: PayNumbers;
}

export interface PayNumbers {
  rate: number;
  weekHours: number;
  weekPercent: number;
  dayHours: number;
  dayPercent: number;
  sundayPercent: number;
}

export const FRESH_PAY: PayNumbers = { rate: 0, weekHours: 40, weekPercent: 0, dayHours: 8, dayPercent: 50, sundayPercent: 0 };

/** The worker's numbers as rules for src/core/payrules. Names are shown on the Pay tab. */
export function rulesOf(p: PayNumbers): PayRule[] {
  return [
    { id: 'week', name: `Over ${p.weekHours} h a week`, percent: p.weekPercent, when: { type: 'weekOver', hours: p.weekHours } },
    { id: 'day', name: 'Overtime', percent: p.dayPercent, when: { type: 'dayOver', hours: p.dayHours } },
    { id: 'sun', name: 'Sunday', percent: p.sundayPercent, when: { type: 'weekday', day: 0 } },
  ];
}

export const FRESH: Saved = { v: SCHEMA, book: {}, habits: DEFAULT_HABITS, shift: { start: 6 * 60, end: 18 * 60 }, look: 'auto', pay: FRESH_PAY, log: {}, welcomed: false };

/** Turns anything read from the phone into today's shape. Unknown or broken data starts fresh instead of crashing. */
export function migrate(raw: unknown): Saved {
  if (!raw || typeof raw !== 'object') return FRESH;
  const r = raw as Partial<Saved>;
  if (r.v !== SCHEMA) return FRESH; // no older versions exist yet
  return {
    v: SCHEMA,
    book: r.book && typeof r.book === 'object' ? r.book : {},
    habits: { ...DEFAULT_HABITS, ...(r.habits ?? {}) },
    shift: { ...FRESH.shift, ...(r.shift ?? {}) },
    look: r.look === 'light' || r.look === 'dark' ? r.look : 'auto',
    pay: r.pay ? { ...FRESH_PAY, ...r.pay } : FRESH_PAY,
    log: r.log && typeof r.log === 'object' ? r.log : {},
    welcomed: r.welcomed === true || (!!r.book && Object.keys(r.book).length > 0),
  };
}

export async function load(): Promise<Saved> {
  try {
    const text = await AsyncStorage.getItem(KEY);
    return text ? migrate(JSON.parse(text)) : FRESH;
  } catch (e) {
    console.warn('Could not read saved data, starting fresh', e);
    return FRESH;
  }
}

export function save(data: Saved): void {
  AsyncStorage.setItem(KEY, JSON.stringify(data)).catch((e) => console.warn('Could not save', e));
}

/**
 * The calendar as the screens read it. A marked work day always uses the usual shift from "My numbers",
 * so changing those numbers changes every day at once (Anass, 15 Nov: "My day still constant even if I change the hours").
 */
export function planOf(d: Saved): Plan {
  const book: DayBook = {};
  for (const [key, v] of Object.entries(d.book)) book[key] = v.kind === 'work' ? { ...v, start: d.shift.start, end: d.shift.end } : v;
  return { book };
}

/**
 * The calendar as pay reads it. A day with a clock-in and a clock-out is paid on those real times.
 * With planned = false only logged days count (what is earned); with planned = true, marked work days
 * from `today` on that have no log yet are added (what is still expected).
 */
export function payPlan(d: Saved, today: string, planned: boolean): Plan {
  const book: DayBook = {};
  if (planned) for (const [key, v] of Object.entries(planOf(d).book)) if (v.kind === 'work' && key >= today) book[key] = v;
  for (const [key, l] of Object.entries(d.log)) {
    if (l.out !== null) book[key] = { kind: 'work', start: l.in, end: l.out };
    else delete book[key];
  }
  return { book };
}

/** Sunday of the week that holds `key`, moved by whole weeks. */
export const weekStartOf = (key: string, weekdayOfKey: number, weeks = 0) => addDays(key, -weekdayOfKey + weeks * 7);
