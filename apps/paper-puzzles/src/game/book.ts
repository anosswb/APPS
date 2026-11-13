/**
 * "The Book": an endless row of numbered puzzles. Difficulty rises in waves (playbook/06):
 * four kinder puzzles, then a bigger, harder one, then a breath. The first ten teach the game.
 * If a player needed a lot of help, the next puzzles step down quietly ("relief").
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
export const MAX_RELIEF = 2;

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
  return { level, n, grade, boss };
}

export function bookPuzzle(level: number, relief = 0): Puzzle {
  const spec = bookSpec(level, relief);
  const p = generate(spec.n, hashString(`book-${level}-${relief}`), spec.grade);
  return { ...p, id: `book-${level}-${relief}` };
}

/** Help is always in the player's favour: lots of hints lowers the next puzzles, a clean solve resets it. */
export function nextRelief(previous: number, hintsUsed: number): number {
  if (hintsUsed >= 3) return Math.min(MAX_RELIEF, previous + 1);
  if (hintsUsed === 0) return 0;
  return previous;
}
