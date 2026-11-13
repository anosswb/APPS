/** Makes puzzles. A puzzle is kept only if the logic solver can finish it, so it never needs a guess. */
import { geo } from './grid';
import { mulberry32, randInt, Rng, shuffle } from './rng';
import { solveLogic } from './solver';
import { Grade, Puzzle, PuzzleDef } from './types';

export const MIN_SIZE = 5;
export const MAX_SIZE = 12;

const GRADES: Grade[] = ['easy', 'medium', 'hard'];

function tentTarget(n: number): number {
  return Math.round((n * n) / 5);
}

function layout(n: number, rng: Rng): { trees: boolean[]; tents: boolean[] } | null {
  const g = geo(n);
  const size = n * n;
  const tents: boolean[] = new Array(size).fill(false);
  const trees: boolean[] = new Array(size).fill(false);
  const order = shuffle(rng, Array.from({ length: size }, (_, i) => i));
  const placed: number[] = [];
  const target = tentTarget(n);
  for (const i of order) {
    if (placed.length >= target) break;
    if (g.around[i].some((j) => tents[j])) continue;
    tents[i] = true;
    placed.push(i);
  }
  if (placed.length < target - 1) return null;
  for (const t of shuffle(rng, placed)) {
    const spots = g.orth[t].filter((j) => !tents[j] && !trees[j]);
    if (!spots.length) return null;
    trees[spots[randInt(rng, spots.length)]] = true;
  }
  return { trees, tents };
}

function counts(n: number, tents: boolean[]): { rows: number[]; cols: number[] } {
  const rows = new Array(n).fill(0);
  const cols = new Array(n).fill(0);
  for (let i = 0; i < n * n; i++) {
    if (!tents[i]) continue;
    rows[(i / n) | 0]++;
    cols[i % n]++;
  }
  return { rows, cols };
}

/**
 * Build the puzzle for a seed. The same (size, seed, grade) always gives the same puzzle.
 * If the wanted grade does not turn up within the attempt budget, the closest one found is returned.
 */
export function generate(n: number, seed: number, want?: Grade, budget = 400): Puzzle {
  if (n < MIN_SIZE || n > MAX_SIZE) throw new Error(`size ${n} is outside ${MIN_SIZE}-${MAX_SIZE}`);
  const rng = mulberry32(seed);
  let best: Puzzle | null = null;
  let bestGap = 99;
  for (let attempt = 0; attempt < budget; attempt++) {
    const made = layout(n, rng);
    if (!made) continue;
    const def: PuzzleDef = { n, trees: made.trees, ...counts(n, made.tents) };
    const result = solveLogic(def);
    if (!result.solved) continue;
    const grade = GRADES[result.tier - 1];
    const puzzle: Puzzle = { ...def, id: `${n}-${seed}-${want ?? 'any'}`, seed, grade, solution: result.tents };
    if (!want || grade === want) return puzzle;
    const gap = Math.abs(GRADES.indexOf(grade) - GRADES.indexOf(want));
    if (gap < bestGap) {
      best = puzzle;
      bestGap = gap;
    }
  }
  if (best) return best;
  throw new Error(`no puzzle found for size ${n}, seed ${seed}`);
}
