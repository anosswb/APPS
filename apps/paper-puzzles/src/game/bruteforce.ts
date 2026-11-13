/**
 * A plain try-everything solver. It is NOT used in the app. Tests use it to prove that
 * every puzzle we make has exactly one solution and that the logic solver never lies.
 */
import { geo } from './grid';
import { PuzzleDef } from './types';

export function countSolutions(def: PuzzleDef, limit = 2): { count: number; first: boolean[] | null } {
  const n = def.n;
  const size = n * n;
  const g = geo(n);
  const tent: boolean[] = new Array(size).fill(false);
  const rowLeft = def.rows.slice();
  const colLeft = def.cols.slice();
  const trees: number[] = [];
  for (let i = 0; i < size; i++) if (def.trees[i]) trees.push(i);
  let count = 0;
  let first: boolean[] | null = null;

  const matchingOk = (): boolean => {
    const partner = new Map<number, number>();
    const tryTree = (t: number, seen: Set<number>): boolean => {
      for (const c of g.orth[t]) {
        if (!tent[c] || seen.has(c)) continue;
        seen.add(c);
        const other = partner.get(c);
        if (other === undefined || tryTree(other, seen)) {
          partner.set(c, t);
          return true;
        }
      }
      return false;
    };
    for (const t of trees) if (!tryTree(t, new Set())) return false;
    return true;
  };

  const walk = (i: number, placed: number): void => {
    if (count >= limit) return;
    if (i === size) {
      if (placed !== trees.length) return;
      for (let c = 0; c < n; c++) if (colLeft[c] !== 0) return;
      if (!matchingOk()) return;
      count++;
      if (!first) first = tent.slice();
      return;
    }
    const r = (i / n) | 0;
    const c = i % n;
    const endOfRow = c === n - 1;
    // option 1: a tent here
    if (!def.trees[i] && rowLeft[r] > 0 && colLeft[c] > 0 && g.orth[i].some((j) => def.trees[j])) {
      let free = true;
      for (const j of g.around[i]) if (j < i && tent[j]) free = false;
      if (free && (!endOfRow || rowLeft[r] === 1)) {
        tent[i] = true;
        rowLeft[r]--;
        colLeft[c]--;
        walk(i + 1, placed + 1);
        tent[i] = false;
        rowLeft[r]++;
        colLeft[c]++;
      }
    }
    // option 2: no tent here
    if (!endOfRow || rowLeft[r] === 0) {
      if (rowLeft[r] <= n - 1 - c || rowLeft[r] === 0) walk(i + 1, placed);
    }
  };
  walk(0, 0);
  return { count, first };
}
