/** What is kept on the phone, and how an old save is read safely after an update. */
import { ChallengeKind, ChallengeRun, ChallengeSave, freshChallenges, INK, RACE } from '../game/challenge';
import { freshRecords, Records } from '../game/records';
import { FREE_BOTTLES } from '../config/money';
import { MoneyState } from '../money/rules';
import { DEFAULT_REMINDER_TIME, REMINDER_HOURS, ReminderState } from '../reminder/plan';
import { ThemeChoice } from '../theme/ThemeContext';

/** 2: added settings.sound · 3: added money · 4: added stats · 5: added reminder · 6: book.fast, relief may be negative · 7: challenge · 8: records · 9: runs (challenges in progress) · 10: ink bottles */
export const SCHEMA = 10;

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
  /** relief: +1/+2 kinder, -1/-2 harder (game/book.ts). fast: quick clean solves in a row */
  book: { level: number; relief: number; solved: number; fast: number };
  /** finished daily puzzles, by date */
  daily: Record<string, DailyResult>;
  /** puzzles in progress, by puzzle id */
  games: Record<string, GameSave>;
  seenRules: boolean;
  money: MoneyState;
  /** anonymous usage numbers: the switch, and a random id that names nobody */
  stats: { on: boolean; id: string };
  /** the two challenge modes: where the player is, and how much room the algorithm gives them */
  challenge: ChallengeSave;
  /** personal bests: best clean time per grid size, win runs in the challenges */
  records: Records;
  /** a challenge attempt in progress, per mode: leaving and coming back never refills the pot or the clock */
  runs: Partial<Record<ChallengeKind, ChallengeRun>>;
  /** ink bottles the player holds: free ones at the start, more bought on iPhone */
  bottles: number;
  /** the daily note: off until the player says yes */
  reminder: ReminderState;
}

function randomId(): string {
  let out = '';
  for (let i = 0; i < 32; i++) out += Math.floor(Math.random() * 16).toString(16);
  return out;
}

export function freshSave(now: number = Date.now()): Save {
  return {
    schema: SCHEMA,
    settings: { theme: 'system', haptics: true, sound: true },
    book: { level: 1, relief: 0, solved: 0, fast: 0 },
    daily: {},
    games: {},
    seenRules: false,
    money: { fullEdition: false, unlockedDays: [], lastAdAt: 0, firstOpenAt: now },
    stats: { on: true, id: randomId() },
    reminder: { on: false, time: DEFAULT_REMINDER_TIME, asked: false },
    challenge: freshChallenges(),
    records: freshRecords(),
    runs: {},
    bottles: FREE_BOTTLES,
  };
}

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/** Read whatever was stored. Anything missing or broken falls back to the default, nothing is thrown away. */
export function migrate(raw: unknown, now: number = Date.now()): Save {
  const base = freshSave(now);
  if (!isObject(raw)) return base;
  const out: Save = { ...base, settings: { ...base.settings }, book: { ...base.book }, money: { ...base.money, unlockedDays: [] }, stats: { ...base.stats }, reminder: { ...base.reminder }, challenge: { race: { ...base.challenge.race }, ink: { ...base.challenge.ink } }, records: freshRecords(), runs: {} };
  if (isObject(raw.settings)) {
    const s = raw.settings;
    if (s.theme === 'system' || s.theme === 'light' || s.theme === 'dark') out.settings.theme = s.theme;
    if (typeof s.haptics === 'boolean') out.settings.haptics = s.haptics;
    if (typeof s.sound === 'boolean') out.settings.sound = s.sound;
  }
  if (isObject(raw.book)) {
    const b = raw.book;
    if (typeof b.level === 'number' && b.level >= 1) out.book.level = Math.floor(b.level);
    if (typeof b.relief === 'number' && Number.isFinite(b.relief)) out.book.relief = Math.max(-2, Math.min(2, Math.round(b.relief)));
    if (typeof b.fast === 'number' && b.fast >= 0) out.book.fast = Math.min(9, Math.floor(b.fast));
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
  if (isObject(raw.stats)) {
    if (typeof raw.stats.on === 'boolean') out.stats.on = raw.stats.on;
    if (typeof raw.stats.id === 'string' && /^[0-9a-f]{32}$/.test(raw.stats.id)) out.stats.id = raw.stats.id;
  }
  if (isObject(raw.reminder)) {
    const r = raw.reminder;
    if (typeof r.on === 'boolean') out.reminder.on = r.on;
    if (typeof r.time === 'string' && Object.prototype.hasOwnProperty.call(REMINDER_HOURS, r.time)) out.reminder.time = r.time as ReminderState['time'];
    if (typeof r.asked === 'boolean') out.reminder.asked = r.asked;
  }
  if (isObject(raw.challenge)) {
    const { race, ink } = raw.challenge;
    if (isObject(race)) {
      if (typeof race.level === 'number' && race.level >= 1) out.challenge.race.level = Math.floor(race.level);
      if (typeof race.factor === 'number' && Number.isFinite(race.factor)) out.challenge.race.factor = Math.min(RACE.max, Math.max(RACE.min, race.factor));
    }
    if (isObject(ink)) {
      if (typeof ink.level === 'number' && ink.level >= 1) out.challenge.ink.level = Math.floor(ink.level);
      if (typeof ink.slack === 'number' && Number.isFinite(ink.slack)) out.challenge.ink.slack = Math.min(INK.max, Math.max(INK.min, Math.round(ink.slack)));
    }
  }
  if (isObject(raw.records)) {
    const rec = raw.records;
    if (isObject(rec.best)) {
      for (const [size, ms] of Object.entries(rec.best)) {
        if (/^\d{1,2}$/.test(size) && typeof ms === 'number' && ms > 0 && Number.isFinite(ms)) out.records.best[size] = Math.round(ms);
      }
    }
    for (const kind of ['race', 'ink'] as const) {
      const run = rec[kind];
      if (isObject(run) && typeof run.streak === 'number' && typeof run.best === 'number' && run.streak >= 0 && run.best >= 0) {
        const streak = Math.floor(run.streak);
        out.records[kind] = { streak, best: Math.max(streak, Math.floor(run.best)) };
      }
    }
  }
  if (isObject(raw.runs)) {
    for (const kind of ['race', 'ink'] as const) {
      const run = readRun(raw.runs[kind]);
      if (run) out.runs[kind] = run;
    }
  }
  // A save from before bottles existed gets the free ones too.
  if (typeof raw.bottles === 'number' && Number.isFinite(raw.bottles) && raw.bottles >= 0) out.bottles = Math.min(9999, Math.floor(raw.bottles));
  out.schema = SCHEMA;
  return out;
}

const count = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x) && x >= 0;

/** A saved attempt is used only if every field is sound; a broken one is dropped (the player just starts the level). */
function readRun(raw: unknown): ChallengeRun | null {
  if (!isObject(raw)) return null;
  const { level, room, marks, ms, used, extra, continues, failed, lossCounted } = raw;
  if (!count(level) || level < 1 || !count(room) || room <= 0 || !count(ms) || !count(used) || !count(extra) || !count(continues)) return null;
  if (!Array.isArray(marks) || marks.length > 400 || !marks.every((m) => m === 0 || m === 1 || m === 2)) return null;
  if (typeof failed !== 'boolean' || typeof lossCounted !== 'boolean') return null;
  return { level: Math.floor(level), room, marks: marks as number[], ms, used: Math.floor(used), extra, continues: Math.floor(continues), failed, lossCounted };
}
