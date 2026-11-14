/**
 * "The Book": an endless row of numbered puzzles. Difficulty rises in waves (playbook/06):
 * four kinder puzzles, then a bigger, harder one, then a breath. The first ten teach the game.
 *
 * The path also bends to the player, both ways, through one number called `relief`:
 *   +1, +2  the player needed a lot of help: the next puzzles are kinder, then also one size smaller.
 *   -1, -2  the player solves fast and clean: the next puzzles are harder, then also one size bigger.
 * Nobody can lose in this game, so this is not "let them win or let them fail". It keeps each player
 * near the edge of their own skill: not bored, not stuck. It never changes anything to sell something.
 */
import { generate } from './generator';
import { hashString } from './rng';
import { Grade, Puzzle } from './types';

export interface BookSpec {
  level: number;
  n: number;
  grade: Grade;
  /** the fifth puzzle of each block */
  boss: boolean;
}

const WAVE: Grade[] = ['easy', 'easy', 'medium', 'easy', 'hard'];
const LATE_WAVE: Grade[] = ['easy', 'medium', 'medium', 'medium', 'hard'];
const DOWN: Record<Grade, Grade> = { hard: 'medium', medium: 'easy', easy: 'easy' };
const UP: Record<Grade, Grade> = { easy: 'medium', medium: 'hard', hard: 'hard' };
export const MAX_RELIEF = 2;
export const MIN_RELIEF = -2;
/** The first ten puzzles teach the game. They are the same for everyone. */
const TEACHING = 10;
const MAX_SIZE = 10;

export function bookSpec(level: number, relief = 0): BookSpec {
  if (level <= 3) return { level, n: 5, grade: 'easy', boss: false };
  if (level <= 10) return { level, n: 6, grade: 'easy', boss: false };
  const block = Math.floor((level - 11) / 5);
  const pos = (level - 11) % 5;
  const boss = pos === 4;
  let n = Math.min(9, 6 + Math.floor(block / 2)) + (boss ? 1 : 0);
  let grade = (block >= 4 ? LATE_WAVE : WAVE)[pos];
  if (relief >= 1) grade = DOWN[grade];
  if (relief >= 2) n = Math.max(5, n - 1);
  if (relief <= -1) grade = UP[grade];
  if (relief <= -2) n = Math.min(MAX_SIZE, n + 1);
  return { level, n, grade, boss };
}

export function bookPuzzle(level: number, relief = 0): Puzzle {
  const spec = bookSpec(level, relief);
  const p = generate(spec.n, hashString(`book-${level}-${relief}`), spec.grade);
  return { ...p, id: `book-${level}-${relief}` };
}

/**
 * How long a puzzle "should" take. A GUESS until real numbers come in (docs/numbers.md): seconds per square.
 * Only used to tell a fast solve from a slow one; it is never shown to the player.
 */
const SECONDS_PER_SQUARE: Record<Grade, number> = { easy: 2, medium: 3, hard: 4.5 };
export function parMs(n: number, grade: Grade): number {
  return n * n * SECONDS_PER_SQUARE[grade] * 1000;
}
const QUICK = 0.6; // under 60% of the usual time, with no hint
const SLOW = 1.6; // over 160% of the usual time
/** Fast clean solves in a row before the path steps up. One lucky puzzle is not enough. */
const QUICK_IN_A_ROW = 2;

export interface Pace {
  relief: number;
  /** fast clean solves in a row */
  fast: number;
}

/** After a solved Book puzzle: where the player's path goes next. */
export function nextPace(before: Pace, spec: BookSpec, hintsUsed: number, ms: number): Pace {
  const par = parMs(spec.n, spec.grade);
  const quick = hintsUsed === 0 && ms > 0 && ms <= par * QUICK;
  const slow = ms >= par * SLOW;
  let { relief, fast } = before;

  if (hintsUsed >= 3) {
    // Needed a lot of help: kinder next time.
    return { relief: Math.min(MAX_RELIEF, relief + 1), fast: 0 };
  }
  if (hintsUsed === 0 && relief > 0) relief = 0; // a clean solve ends the kinder stretch
  if (quick) {
    fast += 1;
    if (fast >= QUICK_IN_A_ROW && spec.level >= TEACHING && relief <= 0) {
      relief = Math.max(MIN_RELIEF, relief - 1);
      fast = 0;
    }
    return { relief, fast };
  }
  // Not quick. On a stepped-up path, a hint or a slow solve brings it one step back toward normal.
  if (relief < 0 && (hintsUsed > 0 || slow)) relief += 1;
  return { relief, fast: 0 };
}
