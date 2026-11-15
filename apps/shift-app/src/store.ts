/** What the app saves on the phone. One key, with a version number so later builds can upgrade old data. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayBook } from './core/days';
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

export const FRESH_PAY: PayNumbers = { rate: 0, weekHours: 40, weekPercent: 50, dayHours: 8, dayPercent: 0, sundayPercent: 0 };

/** The worker's numbers as rules for src/core/payrules. Names are shown on the Pay tab. */
export function rulesOf(p: PayNumbers): PayRule[] {
  return [
    { id: 'week', name: `Over ${p.weekHours} h a week`, percent: p.weekPercent, when: { type: 'weekOver', hours: p.weekHours } },
    { id: 'day', name: `Over ${p.dayHours} h a day`, percent: p.dayPercent, when: { type: 'dayOver', hours: p.dayHours } },
    { id: 'sun', name: 'Sunday', percent: p.sundayPercent, when: { type: 'weekday', day: 0 } },
  ];
}

export const FRESH: Saved = { v: SCHEMA, book: {}, habits: DEFAULT_HABITS, shift: { start: 6 * 60, end: 18 * 60 }, look: 'auto', pay: FRESH_PAY };

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
    pay: { ...FRESH_PAY, ...(r.pay ?? {}) },
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
