/**
 * The line of praise after a solved puzzle (Anass, 14 Nov 2026): a real compliment for what the player
 * actually did, in the voice of a puzzle editor. For adults: no "Awesome!!", no confetti talk,
 * no exclamation marks. It names the fact (the time, no hints, the last drop of ink) and nods.
 * This file only decides WHICH kind of praise fits. The words are in i18n/en.ts.
 */
import { parMs } from './book';
import { Grade } from './types';

export type PraiseKind =
  | 'lastDrop' // ink challenge, won with no ink left
  | 'inkSpare' // ink challenge, won with ink left
  | 'clockHalf' // race, won with half the clock or more still left
  | 'clock' // race, won
  | 'newBest' // a new personal best for this size
  | 'under' // fast and clean: "Under a minute."
  | 'hardClean' // a tricky or big puzzle with no hints
  | 'clean' // no hints
  | 'fewHints' // one or two hints
  | 'helped'; // three hints or more

export interface Solve {
  n: number;
  grade: Grade;
  ms: number;
  hints: number;
  /** the best clean time for this size before this solve, if there was one */
  bestBefore?: number;
  challenge?: { kind: 'race' | 'ink'; room: number; left: number; helped: boolean };
}

/** The round marks a fast time can be "under", in seconds. */
const MARKS = [20, 30, 45, 60, 90, 120, 180, 300];
const FAST = 0.6; // of the usual time

/** The smallest round mark the time is under, or null if it is over five minutes. */
export function underMark(ms: number): number | null {
  const seconds = ms / 1000;
  return MARKS.find((m) => seconds < m) ?? null;
}

export function praiseFor(s: Solve): { kind: PraiseKind; mark?: number } {
  if (s.challenge && !s.challenge.helped) {
    if (s.challenge.kind === 'ink') return { kind: s.challenge.left === 0 ? 'lastDrop' : 'inkSpare' };
    return { kind: s.challenge.left >= s.challenge.room / 2 ? 'clockHalf' : 'clock' };
  }
  if (s.challenge?.helped) return { kind: 'fewHints' };
  if (s.hints >= 3) return { kind: 'helped' };
  if (s.hints > 0) return { kind: 'fewHints' };
  // From here on: no hints.
  const real = s.ms >= 3000;
  if (real && s.bestBefore !== undefined && s.ms < s.bestBefore) return { kind: 'newBest' };
  const mark = underMark(s.ms);
  if (real && mark !== null && s.ms <= parMs(s.n, s.grade) * FAST) return { kind: 'under', mark };
  if (s.grade === 'hard' || s.n >= 9) return { kind: 'hardClean' };
  return { kind: 'clean' };
}

/** Picks one of several wordings, always the same one for the same puzzle. */
export function pick<T>(options: readonly T[], seed: string): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return options[h % options.length];
}
