/**
 * The logic solver. It only ever makes deductions that are forced by the rules,
 * so if it finishes a puzzle, that puzzle has exactly one solution and never needs a guess.
 * The same code finds the next step for a hint.
 *
 * Rules of the puzzle:
 *  1. Every tree has exactly one tent of its own, in a square next to it (not diagonal),
 *     and every tent belongs to exactly one tree.
 *  2. Tents never touch each other, not even at the corners.
 *  3. The numbers say how many tents are in each row and column.
 */
import { geo, Geo, lineCells } from './grid';
import { Conflict, GRASS, Line, Mark, PuzzleDef, Step, TENT, TIER, UNKNOWN } from './types';

/** Working copy of the marks where tree squares count as grass (a tent can never stand on a tree). */
export function workMarks(def: PuzzleDef, marks?: ArrayLike<number>): Mark[] {
  const size = def.n * def.n;
  const out: Mark[] = new Array(size);
  for (let i = 0; i < size; i++) out[i] = def.trees[i] ? GRASS : ((marks ? marks[i] : UNKNOWN) as Mark);
  return out;
}

function orthTrees(def: PuzzleDef, g: Geo, i: number): number[] {
  return g.orth[i].filter((j) => def.trees[j]);
}

/** Could a tent still go here? */
function canBeTent(def: PuzzleDef, g: Geo, m: Mark[], i: number): boolean {
  if (m[i] !== UNKNOWN) return false;
  let tree = false;
  for (const j of g.orth[i]) if (def.trees[j]) tree = true;
  if (!tree) return false;
  for (const j of g.around[i]) if (m[j] === TENT) return false;
  return true;
}

const LINES: Line['kind'][] = ['row', 'col'];

function lineCount(def: PuzzleDef, line: Line): number {
  return line.kind === 'row' ? def.rows[line.index] : def.cols[line.index];
}

/** The most tents that could still be added to a line: no two side by side. */
function maxFit(def: PuzzleDef, g: Geo, m: Mark[], cells: number[]): number {
  let total = 0;
  let run = 0;
  for (const i of cells) {
    if (canBeTent(def, g, m, i)) run++;
    else {
      total += (run + 1) >> 1;
      run = 0;
    }
  }
  return total + ((run + 1) >> 1);
}

/** Kuhn's matching. Returns the first left node that cannot get a partner of its own, or -1. */
function firstUnmatched(left: number[], adj: (l: number) => number[]): number {
  const partner = new Map<number, number>();
  const tryNode = (l: number, seen: Set<number>): boolean => {
    for (const r of adj(l)) {
      if (seen.has(r)) continue;
      seen.add(r);
      const other = partner.get(r);
      if (other === undefined || tryNode(other, seen)) {
        partner.set(r, l);
        return true;
      }
    }
    return false;
  };
  for (const l of left) if (!tryNode(l, new Set())) return l;
  return -1;
}

/** Is the position already broken? Returns what is wrong, or null. */
export function check(def: PuzzleDef, m: Mark[]): Conflict | null {
  const g = geo(def.n);
  const size = def.n * def.n;
  for (let i = 0; i < size; i++) {
    if (m[i] !== TENT) continue;
    for (const j of g.around[i]) if (j > i && m[j] === TENT) return { kind: 'touch', cells: [i, j] };
  }
  for (const kind of LINES) {
    for (let index = 0; index < def.n; index++) {
      const cells = lineCells(def.n, kind, index);
      let tents = 0;
      for (const i of cells) if (m[i] === TENT) tents++;
      const want = lineCount(def, { kind, index });
      if (tents > want) return { kind: 'over', line: { kind, index } };
      if (tents + maxFit(def, g, m, cells) < want) return { kind: 'short', line: { kind, index } };
    }
  }
  const trees: number[] = [];
  const tents: number[] = [];
  for (let i = 0; i < size; i++) {
    if (def.trees[i]) trees.push(i);
    else if (m[i] === TENT) tents.push(i);
  }
  const lonelyTent = firstUnmatched(tents, (t) => orthTrees(def, g, t));
  if (lonelyTent >= 0) return { kind: 'tentNoTree', tent: lonelyTent };
  const lonelyTree = firstUnmatched(trees, (t) =>
    g.orth[t].filter((c) => !def.trees[c] && (m[c] === TENT || canBeTent(def, g, m, c))),
  );
  if (lonelyTree >= 0) return { kind: 'treeNoTent', tree: lonelyTree };
  return null;
}

// ---------------------------------------------------------------- tier 1

function noTree(def: PuzzleDef, g: Geo, m: Mark[]): Step | null {
  const cells: number[] = [];
  for (let i = 0; i < m.length; i++) {
    if (m[i] === UNKNOWN && orthTrees(def, g, i).length === 0) cells.push(i);
  }
  return cells.length ? { technique: 'noTree', cells, mark: GRASS } : null;
}

function tentTouch(def: PuzzleDef, g: Geo, m: Mark[]): Step | null {
  for (let i = 0; i < m.length; i++) {
    if (m[i] !== TENT) continue;
    const cells = g.around[i].filter((j) => m[j] === UNKNOWN);
    if (cells.length) return { technique: 'tentTouch', cells, mark: GRASS, because: [i] };
  }
  return null;
}

function lineBasics(def: PuzzleDef, g: Geo, m: Mark[], which: 'lineFull' | 'lineAllTents'): Step | null {
  for (const kind of LINES) {
    for (let index = 0; index < def.n; index++) {
      const cells = lineCells(def.n, kind, index);
      const unknown = cells.filter((i) => m[i] === UNKNOWN);
      if (!unknown.length) continue;
      let tents = 0;
      for (const i of cells) if (m[i] === TENT) tents++;
      const need = lineCount(def, { kind, index }) - tents;
      if (which === 'lineFull' && need === 0) {
        return { technique: 'lineFull', cells: unknown, mark: GRASS, line: { kind, index }, need: 0 };
      }
      if (which === 'lineAllTents' && need > 0 && unknown.length === need) {
        return { technique: 'lineAllTents', cells: unknown, mark: TENT, line: { kind, index }, need };
      }
    }
  }
  return null;
}

function treeLast(def: PuzzleDef, g: Geo, m: Mark[]): Step | null {
  for (let t = 0; t < m.length; t++) {
    if (!def.trees[t]) continue;
    const o = g.orth[t];
    if (o.some((j) => m[j] === TENT)) continue;
    const open = o.filter((j) => m[j] === UNKNOWN);
    if (open.length === 1) return { technique: 'treeLast', cells: open, mark: TENT, because: [t] };
  }
  return null;
}

function tier1(def: PuzzleDef, g: Geo, m: Mark[]): Step | null {
  return (
    noTree(def, g, m) ||
    tentTouch(def, g, m) ||
    lineBasics(def, g, m, 'lineFull') ||
    lineBasics(def, g, m, 'lineAllTents') ||
    treeLast(def, g, m)
  );
}

// ---------------------------------------------------------------- tier 2

/** Which tents surely belong to which tree. A tent with one possible tree belongs to it. */
function claims(def: PuzzleDef, g: Geo, m: Mark[]): { owner: Map<number, number>; claimed: Set<number> } {
  const owner = new Map<number, number>();
  const claimed = new Set<number>();
  let changed = true;
  while (changed) {
    changed = false;
    for (let x = 0; x < m.length; x++) {
      if (m[x] !== TENT || owner.has(x)) continue;
      const free = orthTrees(def, g, x).filter((t) => !claimed.has(t));
      if (free.length === 1) {
        owner.set(x, free[0]);
        claimed.add(free[0]);
        changed = true;
      }
    }
  }
  return { owner, claimed };
}

function treeDone(def: PuzzleDef, g: Geo, m: Mark[]): Step | null {
  const { claimed } = claims(def, g, m);
  if (!claimed.size) return null;
  const cells: number[] = [];
  const because = new Set<number>();
  for (let i = 0; i < m.length; i++) {
    if (m[i] !== UNKNOWN) continue;
    const trees = orthTrees(def, g, i);
    if (trees.length && trees.every((t) => claimed.has(t))) {
      cells.push(i);
      for (const t of trees) because.add(t);
    }
  }
  return cells.length ? { technique: 'treeDone', cells, mark: GRASS, because: [...because] } : null;
}

function treeNeeds(def: PuzzleDef, g: Geo, m: Mark[]): Step | null {
  const { owner, claimed } = claims(def, g, m);
  for (let t = 0; t < m.length; t++) {
    if (!def.trees[t] || claimed.has(t)) continue;
    const tents = g.orth[t].filter((j) => m[j] === TENT);
    if (!tents.length) continue; // treeLast covers trees with no tent beside them
    if (!tents.every((x) => owner.has(x) && owner.get(x) !== t)) continue;
    const open = g.orth[t].filter((j) => m[j] === UNKNOWN);
    if (open.length === 1) return { technique: 'treeNeeds', cells: open, mark: TENT, because: [t, ...tents] };
  }
  return null;
}

/** Try every way to fit the missing tents into one line and keep what is true in all of them. */
function fit(def: PuzzleDef, g: Geo, m: Mark[]): Step | null {
  const n = def.n;
  for (const kind of LINES) {
    for (let index = 0; index < n; index++) {
      const cells = lineCells(n, kind, index);
      let tents = 0;
      for (const i of cells) if (m[i] === TENT) tents++;
      const need = lineCount(def, { kind, index }) - tents;
      if (need <= 0) continue;
      const pos: number[] = [];
      for (let k = 0; k < n; k++) if (canBeTent(def, g, m, cells[k])) pos.push(k);
      if (pos.length < need) continue;

      const neighbours: number[] = [];
      for (const d of [-1, 1]) {
        const other = index + d;
        if (other < 0 || other >= n) continue;
        for (const i of lineCells(n, kind, other)) if (m[i] === UNKNOWN) neighbours.push(i);
      }
      const used = new Map<number, number>();
      const touched = new Map<number, number>();
      let ways = 0;
      const pick: number[] = [];
      const walk = (start: number) => {
        if (pick.length === need) {
          ways++;
          const hit = new Set<number>();
          for (const k of pick) {
            const cell = cells[k];
            used.set(cell, (used.get(cell) || 0) + 1);
            for (const a of g.around[cell]) hit.add(a);
          }
          for (const i of neighbours) if (hit.has(i)) touched.set(i, (touched.get(i) || 0) + 1);
          return;
        }
        for (let p = start; p < pos.length; p++) {
          if (pick.length && pos[p] - pick[pick.length - 1] < 2) continue;
          if (pos.length - p < need - pick.length) break;
          pick.push(pos[p]);
          walk(p + 1);
          pick.pop();
        }
      };
      walk(0);
      if (!ways) continue;

      const line: Line = { kind, index };
      const always = pos.map((k) => cells[k]).filter((c) => used.get(c) === ways);
      if (always.length) return { technique: 'fitTents', cells: always, mark: TENT, line, need };
      const never = cells.filter((c) => m[c] === UNKNOWN && !used.get(c));
      if (never.length) return { technique: 'fitGrass', cells: never, mark: GRASS, line, need };
      const shadow = neighbours.filter((i) => touched.get(i) === ways);
      if (shadow.length) return { technique: 'fitShadow', cells: shadow, mark: GRASS, line, need };
    }
  }
  return null;
}

function tier2(def: PuzzleDef, g: Geo, m: Mark[]): Step | null {
  return treeDone(def, g, m) || treeNeeds(def, g, m) || fit(def, g, m);
}

// ---------------------------------------------------------------- tier 3

function apply(m: Mark[], step: Step): void {
  for (const i of step.cells) m[i] = step.mark;
}

/** Follow the simple rules as far as they go, and report the first thing that breaks. */
function runSimpleRules(def: PuzzleDef, g: Geo, m: Mark[]): Conflict | null {
  for (let guard = 0; guard < 400; guard++) {
    const bad = check(def, m);
    if (bad) return bad;
    const step = tier1(def, g, m);
    if (!step) return null;
    apply(m, step);
  }
  return null;
}

/** "Suppose this were a tent... then something breaks. So it is grass." (and the other way round) */
function contradiction(def: PuzzleDef, g: Geo, m: Mark[]): Step | null {
  for (const mark of [TENT, GRASS] as const) {
    for (let i = 0; i < m.length; i++) {
      if (m[i] !== UNKNOWN) continue;
      if (mark === TENT && !canBeTent(def, g, m, i)) continue;
      const trial = m.slice();
      trial[i] = mark;
      const conflict = runSimpleRules(def, g, trial);
      if (conflict) {
        return { technique: 'contradiction', cells: [i], mark: mark === TENT ? GRASS : TENT, conflict };
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------- public

/** The simplest forced deduction from this position, or null if the solver sees none. */
export function findStep(def: PuzzleDef, m: Mark[], maxTier: 1 | 2 | 3 = 3): Step | null {
  const g = geo(def.n);
  const s1 = tier1(def, g, m);
  if (s1 || maxTier < 2) return s1;
  const s2 = tier2(def, g, m);
  if (s2 || maxTier < 3) return s2;
  return contradiction(def, g, m);
}

export interface SolveResult {
  solved: boolean;
  /** true where the solver placed a tent */
  tents: boolean[];
  /** highest tier of technique that was needed */
  tier: 1 | 2 | 3;
  steps: number;
  tier2Steps: number;
  tier3Steps: number;
}

/** Solve from the empty grid using logic only. */
export function solveLogic(def: PuzzleDef, maxTier: 1 | 2 | 3 = 3): SolveResult {
  const m = workMarks(def);
  let tier: 1 | 2 | 3 = 1;
  let steps = 0;
  let tier2Steps = 0;
  let tier3Steps = 0;
  for (let guard = 0; guard < 2000; guard++) {
    const step = findStep(def, m, maxTier);
    if (!step) break;
    apply(m, step);
    steps++;
    const t = TIER[step.technique];
    if (t > tier) tier = t;
    if (t === 2) tier2Steps++;
    if (t === 3) tier3Steps++;
  }
  let solved = !m.includes(UNKNOWN) && check(def, m) === null;
  if (solved) {
    for (const kind of LINES) {
      for (let index = 0; index < def.n; index++) {
        let tents = 0;
        for (const i of lineCells(def.n, kind, index)) if (m[i] === TENT) tents++;
        if (tents !== lineCount(def, { kind, index })) solved = false;
      }
    }
  }
  return { solved, tents: m.map((x) => x === TENT), tier, steps, tier2Steps, tier3Steps };
}
