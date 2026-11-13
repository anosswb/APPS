/** Neighbour tables for an n x n grid, built once per size. */
export interface Geo {
  n: number;
  /** up, down, left, right */
  orth: number[][];
  /** the 8 squares around */
  around: number[][];
}

const cache = new Map<number, Geo>();

export function geo(n: number): Geo {
  const hit = cache.get(n);
  if (hit) return hit;
  const orth: number[][] = [];
  const around: number[][] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const o: number[] = [];
      const a: number[] = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const rr = r + dr;
          const cc = c + dc;
          if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
          a.push(rr * n + cc);
          if (dr === 0 || dc === 0) o.push(rr * n + cc);
        }
      }
      orth.push(o);
      around.push(a);
    }
  }
  const g = { n, orth, around };
  cache.set(n, g);
  return g;
}

export function lineCells(n: number, kind: 'row' | 'col', index: number): number[] {
  const out: number[] = [];
  for (let k = 0; k < n; k++) out.push(kind === 'row' ? index * n + k : k * n + index);
  return out;
}
