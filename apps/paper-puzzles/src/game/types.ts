/** What the player (or the solver) has decided about a square. */
export const UNKNOWN = 0;
export const GRASS = 1;
export const TENT = 2;
export type Mark = 0 | 1 | 2;

export type Grade = 'easy' | 'medium' | 'hard';

/** The printed puzzle: trees and the numbers on the edges. */
export interface PuzzleDef {
  n: number;
  /** true where a tree stands; index = row * n + col */
  trees: boolean[];
  /** tents in each row, top to bottom */
  rows: number[];
  /** tents in each column, left to right */
  cols: number[];
}

export interface Puzzle extends PuzzleDef {
  id: string;
  seed: number;
  grade: Grade;
  /** true where the one and only solution has a tent */
  solution: boolean[];
}

export type Line = { kind: 'row' | 'col'; index: number };

export type Conflict =
  | { kind: 'over'; line: Line }
  | { kind: 'short'; line: Line }
  | { kind: 'touch'; cells: [number, number] }
  | { kind: 'treeNoTent'; tree: number }
  | { kind: 'tentNoTree'; tent: number };

export type Technique =
  | 'noTree'
  | 'tentTouch'
  | 'lineFull'
  | 'lineAllTents'
  | 'treeLast'
  | 'treeDone'
  | 'treeNeeds'
  | 'fitTents'
  | 'fitGrass'
  | 'fitShadow'
  | 'contradiction';

/** How hard each technique is to see. The grade of a puzzle is the highest tier it needs. */
export const TIER: Record<Technique, 1 | 2 | 3> = {
  noTree: 1,
  tentTouch: 1,
  lineFull: 1,
  lineAllTents: 1,
  treeLast: 1,
  treeDone: 2,
  treeNeeds: 2,
  fitTents: 2,
  fitGrass: 2,
  fitShadow: 2,
  contradiction: 3,
};

/** One forced deduction, with enough detail to explain it to a person. */
export interface Step {
  technique: Technique;
  /** squares to mark, all with the same mark */
  cells: number[];
  mark: typeof GRASS | typeof TENT;
  /** the row or column the reasoning is about, if any */
  line?: Line;
  /** squares that explain the reasoning (a tent, a tree...) */
  because?: number[];
  /** how many tents the line still needs (for line techniques) */
  need?: number;
  /** for 'contradiction': what breaks if the square had the other mark */
  conflict?: Conflict;
}
