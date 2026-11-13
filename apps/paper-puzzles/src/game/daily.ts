/** The daily puzzle: the same for everyone, small on Monday and big on Sunday, like a newspaper. */
import { generate } from './generator';
import { hashString } from './rng';
import { Grade, Puzzle } from './types';

/** Local calendar day as YYYY-MM-DD. */
export function dateKey(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function keyToDate(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Sunday = 0. The week builds up to the big Sunday puzzle. */
const WEEK: { n: number; grade: Grade }[] = [
  { n: 10, grade: 'hard' }, // Sunday
  { n: 6, grade: 'easy' }, // Monday
  { n: 7, grade: 'easy' },
  { n: 7, grade: 'medium' },
  { n: 8, grade: 'medium' },
  { n: 8, grade: 'hard' },
  { n: 9, grade: 'medium' }, // Saturday
];

export function dailySpec(key: string): { n: number; grade: Grade } {
  return WEEK[keyToDate(key).getDay()];
}

export function dailyPuzzle(key: string): Puzzle {
  const spec = dailySpec(key);
  const p = generate(spec.n, hashString(`daily-${key}`), spec.grade);
  return { ...p, id: `daily-${key}` };
}

/** The seven days of the week that contains `key`, Monday first. */
export function weekOf(key: string): string[] {
  const d = keyToDate(key);
  const back = (d.getDay() + 6) % 7;
  const out: string[] = [];
  for (let i = 0; i < 7; i++) out.push(dateKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - back + i)));
  return out;
}
