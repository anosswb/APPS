/**
 * The two challenge modes (Anass, 14 Nov 2026). Unlike the daily puzzle and the book, a challenge can be LOST.
 *
 *   race  "Beat the clock": solve the puzzle before the time runs out.
 *   ink   "One pot of ink": every tent pitched uses one drop of ink. The puzzle needs T tents,
 *         the pot holds T + N drops. A tent in the wrong place wastes a drop. Grass marks are free.
 *
 * The algorithm (playbook/06) sets how much room each player gets:
 *   race: time = usual time × factor.   ink: drops = tents + slack (the "N").
 * A win tightens it a little, a loss loosens it more. The steps are chosen so that a player settles
 * at about two wins in three: hard enough to matter, kind enough to keep playing.
 * It only ever changes between puzzles. Inside a puzzle the clock and the pot are what the page says.
 */
import { bookSpec, parMs } from './book';
import { generate } from './generator';
import { hashString } from './rng';
import { Grade, Puzzle } from './types';

export type ChallengeKind = 'race' | 'ink';

export interface RaceState {
  level: number;
  /** time allowed = usual time × factor */
  factor: number;
}
export interface InkState {
  level: number;
  /** drops of ink beyond the number of tents: the "N" */
  slack: number;
}
export interface ChallengeSave {
  race: RaceState;
  ink: InkState;
}

/**
 * A challenge attempt in progress, kept on the phone so that leaving and coming back changes nothing
 * (Anass, 17 Nov 2026: quitting used to give a fresh, full pot). `room` is the clock (ms) or the pot (drops)
 * fixed when the attempt started. Cleared by a win or by "Try again".
 */
export interface ChallengeRun {
  level: number;
  room: number;
  marks: number[];
  /** time spent on this attempt, counted only while it was open */
  ms: number;
  /** drops of ink used */
  used: number;
  /** ms or drops added by videos */
  extra: number;
  continues: number;
  failed: boolean;
  /** the loss was already counted (it is counted once, when the player leaves or tries again) */
  lossCounted: boolean;
}

export const RACE = { start: 3, min: 1, max: 4, win: 0.92, loss: 1.2 } as const;
export const INK = { start: 4, min: 1, max: 6, win: -1, loss: 2 } as const;

export function freshChallenges(): ChallengeSave {
  return { race: { level: 1, factor: RACE.start }, ink: { level: 1, slack: INK.start } };
}

/** Challenge puzzles grow like the book does, with their own puzzles. */
export function challengeSpec(level: number): { n: number; grade: Grade } {
  const { n, grade } = bookSpec(level);
  return { n, grade };
}

export function challengePuzzle(kind: ChallengeKind, level: number): Puzzle {
  const spec = challengeSpec(level);
  const p = generate(spec.n, hashString(`${kind}-${level}`), spec.grade);
  return { ...p, id: `${kind}-${level}` };
}

/** The clock for a race, rounded to five seconds, never under half a minute. */
export function raceLimitMs(n: number, grade: Grade, factor: number): number {
  const seconds = Math.round((parMs(n, grade) * factor) / 5000) * 5;
  return Math.max(30, seconds) * 1000;
}

export function inkDrops(tents: number, slack: number): number {
  return tents + slack;
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/**
 * After a race. `helped` = the player won only after taking extra time: they move on,
 * but the clock is not tightened for it.
 */
export function afterRace(state: RaceState, won: boolean, helped = false): RaceState {
  if (won) return { level: state.level + 1, factor: helped ? state.factor : clamp(state.factor * RACE.win, RACE.min, RACE.max) };
  return { level: state.level, factor: clamp(state.factor * RACE.loss, RACE.min, RACE.max) };
}

export function afterInk(state: InkState, won: boolean, helped = false): InkState {
  if (won) return { level: state.level + 1, slack: helped ? state.slack : clamp(state.slack + INK.win, INK.min, INK.max) };
  return { level: state.level, slack: clamp(state.slack + INK.loss, INK.min, INK.max) };
}

/** What one "keep playing" gives. */
export function raceExtraMs(limitMs: number): number {
  return Math.max(30000, Math.round(limitMs / 4 / 5000) * 5000);
}
export const INK_EXTRA = 3;
/** How many times a player may keep going on one puzzle. */
export const MAX_CONTINUES = 2;

/** How close a lost attempt was, from 0 to 1: the share of the tents that stood in the right place. */
export function proximity(p: Puzzle, marks: ArrayLike<number>, tentMark: number): number {
  let right = 0;
  let total = 0;
  for (let i = 0; i < p.solution.length; i++) {
    if (p.solution[i]) {
      total++;
      if (marks[i] === tentMark) right++;
    }
  }
  return total ? right / total : 0;
}
