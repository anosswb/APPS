/** Hints: first point at a mistake if there is one, otherwise explain the next logical step. */
import { geo } from './grid';
import { findStep, workMarks } from './solver';
import { GRASS, Line, Puzzle, Step, TENT, UNKNOWN } from './types';

export type Hint =
  | { kind: 'solved' }
  | { kind: 'mistake'; reason: 'touch' | 'over' | 'wrong'; cells: number[]; line?: Line }
  | { kind: 'step'; step: Step }
  /** safety net: the solver saw no step, so we simply show one correct square */
  | { kind: 'reveal'; cells: number[]; mark: typeof GRASS | typeof TENT };

export function isSolved(p: Puzzle, marks: ArrayLike<number>): boolean {
  for (let i = 0; i < p.solution.length; i++) {
    if ((marks[i] === TENT) !== p.solution[i]) return false;
  }
  return true;
}

/** Squares the player marked against the solution. */
export function wrongCells(p: Puzzle, marks: ArrayLike<number>): number[] {
  const out: number[] = [];
  for (let i = 0; i < p.solution.length; i++) {
    if (marks[i] === TENT && !p.solution[i]) out.push(i);
    else if (marks[i] === GRASS && p.solution[i]) out.push(i);
  }
  return out;
}

/** Mistakes anyone can see from the rules alone: touching tents and lines with too many tents. */
export function visibleProblems(p: Puzzle, marks: ArrayLike<number>): { touching: number[]; over: Line[] } {
  const n = p.n;
  const g = geo(n);
  const touching = new Set<number>();
  for (let i = 0; i < n * n; i++) {
    if (marks[i] !== TENT) continue;
    for (const j of g.around[i]) if (marks[j] === TENT) touching.add(i);
  }
  const over: Line[] = [];
  for (let k = 0; k < n; k++) {
    let row = 0;
    let col = 0;
    for (let j = 0; j < n; j++) {
      if (marks[k * n + j] === TENT) row++;
      if (marks[j * n + k] === TENT) col++;
    }
    if (row > p.rows[k]) over.push({ kind: 'row', index: k });
    if (col > p.cols[k]) over.push({ kind: 'col', index: k });
  }
  return { touching: [...touching], over };
}

export function getHint(p: Puzzle, marks: ArrayLike<number>): Hint {
  if (isSolved(p, marks)) return { kind: 'solved' };
  const wrong = wrongCells(p, marks);
  if (wrong.length) {
    const seen = visibleProblems(p, marks);
    if (seen.touching.length) return { kind: 'mistake', reason: 'touch', cells: seen.touching };
    if (seen.over.length) {
      const line = seen.over[0];
      const cells = wrong.filter((i) => marks[i] === TENT && (line.kind === 'row' ? ((i / p.n) | 0) : i % p.n) === line.index);
      return { kind: 'mistake', reason: 'over', cells: cells.length ? cells : [wrong[0]], line };
    }
    const tents = wrong.filter((i) => marks[i] === TENT);
    return { kind: 'mistake', reason: 'wrong', cells: [tents.length ? tents[0] : wrong[0]] };
  }
  const step = findStep(p, workMarks(p, marks));
  if (step) return { kind: 'step', step };
  for (let i = 0; i < p.solution.length; i++) {
    if (!p.trees[i] && marks[i] === UNKNOWN && p.solution[i]) return { kind: 'reveal', cells: [i], mark: TENT };
  }
  for (let i = 0; i < p.solution.length; i++) {
    if (!p.trees[i] && marks[i] === UNKNOWN) return { kind: 'reveal', cells: [i], mark: GRASS };
  }
  return { kind: 'solved' };
}
