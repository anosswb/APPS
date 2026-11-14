/** What is kept on the phone, and how an old save is read safely after an update. */
import { MoneyState } from '../money/rules';
import { ThemeChoice } from '../theme/ThemeContext';

/** 2: added settings.sound · 3: added money */
export const SCHEMA = 3;

export interface GameSave {
  marks: number[];
  ms: number;
  hints: number;
}

export interface DailyResult {
  ms: number;
  hints: number;
}

export interface Save {
  schema: number;
  settings: { theme: ThemeChoice; haptics: boolean; sound: boolean };
  book: { level: number; relief: number; solved: number };
  /** finished daily puzzles, by date */
  daily: Record<string, DailyResult>;
  /** puzzles in progress, by puzzle id */
  games: Record<string, GameSave>;
  seenRules: boolean;
  money: MoneyState;
}

export function freshSave(now: number = Date.now()): Save {
  return {
    schema: SCHEMA,
    settings: { theme: 'system', haptics: true, sound: true },
    book: { level: 1, relief: 0, solved: 0 },
    daily: {},
    games: {},
    seenRules: false,
    money: { fullEdition: false, unlockedDays: [], lastAdAt: 0, firstOpenAt: now },
  };
}

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/** Read whatever was stored. Anything missing or broken falls back to the default, nothing is thrown away. */
export function migrate(raw: unknown, now: number = Date.now()): Save {
  const base = freshSave(now);
  if (!isObject(raw)) return base;
  const out: Save = { ...base, settings: { ...base.settings }, book: { ...base.book }, money: { ...base.money, unlockedDays: [] } };
  if (isObject(raw.settings)) {
    const s = raw.settings;
    if (s.theme === 'system' || s.theme === 'light' || s.theme === 'dark') out.settings.theme = s.theme;
    if (typeof s.haptics === 'boolean') out.settings.haptics = s.haptics;
    if (typeof s.sound === 'boolean') out.settings.sound = s.sound;
  }
  if (isObject(raw.book)) {
    const b = raw.book;
    if (typeof b.level === 'number' && b.level >= 1) out.book.level = Math.floor(b.level);
    if (typeof b.relief === 'number' && b.relief >= 0) out.book.relief = Math.min(2, Math.floor(b.relief));
    if (typeof b.solved === 'number' && b.solved >= 0) out.book.solved = Math.floor(b.solved);
  }
  if (isObject(raw.daily)) {
    for (const [key, v] of Object.entries(raw.daily)) {
      if (isObject(v) && typeof v.ms === 'number' && typeof v.hints === 'number') out.daily[key] = { ms: v.ms, hints: v.hints };
    }
  }
  if (isObject(raw.games)) {
    for (const [key, v] of Object.entries(raw.games)) {
      if (isObject(v) && Array.isArray(v.marks) && v.marks.every((m) => m === 0 || m === 1 || m === 2)) {
        out.games[key] = { marks: v.marks as number[], ms: typeof v.ms === 'number' ? v.ms : 0, hints: typeof v.hints === 'number' ? v.hints : 0 };
      }
    }
  }
  if (typeof raw.seenRules === 'boolean') out.seenRules = raw.seenRules;
  if (isObject(raw.money)) {
    const m = raw.money;
    if (typeof m.fullEdition === 'boolean') out.money.fullEdition = m.fullEdition;
    if (Array.isArray(m.unlockedDays)) out.money.unlockedDays = m.unlockedDays.filter((d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d));
    if (typeof m.lastAdAt === 'number' && m.lastAdAt >= 0) out.money.lastAdAt = m.lastAdAt;
    if (typeof m.firstOpenAt === 'number' && m.firstOpenAt > 0) out.money.firstOpenAt = m.firstOpenAt;
  }
  out.schema = SCHEMA;
  return out;
}
