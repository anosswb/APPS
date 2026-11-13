import { countSolutions } from '../bruteforce';
import { generate } from '../generator';
import { geo } from '../grid';
import { check, findStep, solveLogic, workMarks } from '../solver';
import { GRASS, Grade, TENT, TIER, UNKNOWN } from '../types';

const sizes = [5, 6, 7, 8];

describe('generator', () => {
  test('the same seed always gives the same puzzle', () => {
    const a = generate(7, 12345);
    const b = generate(7, 12345);
    expect(b).toEqual(a);
    expect(generate(7, 12346)).not.toEqual(a);
  });

  test('every puzzle follows the rules', () => {
    for (const n of sizes) {
      for (let seed = 1; seed <= 25; seed++) {
        const p = generate(n, seed);
        const g = geo(n);
        const tents = p.solution.map((t, i) => (t ? i : -1)).filter((i) => i >= 0);
        const trees = p.trees.map((t, i) => (t ? i : -1)).filter((i) => i >= 0);
        expect(tents.length).toBe(trees.length);
        for (const t of tents) {
          expect(p.trees[t]).toBe(false);
          expect(g.around[t].some((j) => p.solution[j])).toBe(false); // tents never touch
          expect(g.orth[t].some((j) => p.trees[j])).toBe(true); // every tent has a tree beside it
        }
        for (let r = 0; r < n; r++) {
          expect(p.rows[r]).toBe(tents.filter((t) => ((t / n) | 0) === r).length);
          expect(p.cols[r]).toBe(tents.filter((t) => t % n === r).length);
        }
        expect(check(p, workMarks(p, p.solution.map((t) => (t ? TENT : GRASS))))).toBeNull();
      }
    }
  });

  test('every puzzle has exactly one solution (checked by trying everything)', () => {
    for (const n of sizes) {
      for (let seed = 1; seed <= 40; seed++) {
        const p = generate(n, seed);
        const all = countSolutions(p, 2);
        expect(all.count).toBe(1);
        expect(all.first).toEqual(p.solution);
      }
    }
    for (const n of [10, 12]) {
      for (let seed = 1; seed <= 4; seed++) {
        const p = generate(n, seed);
        expect(countSolutions(p, 2).count).toBe(1);
      }
    }
  });

  test('asking for a grade gives that grade', () => {
    for (const grade of ['easy', 'medium', 'hard'] as Grade[]) {
      let hits = 0;
      for (let seed = 1; seed <= 12; seed++) if (generate(8, seed, grade).grade === grade) hits++;
      expect(hits).toBeGreaterThanOrEqual(10);
    }
  });
});

describe('logic solver', () => {
  test('every single step agrees with the solution (the solver never guesses or lies)', () => {
    const seen = new Set<string>();
    for (const n of [6, 8, 10]) {
      for (let seed = 100; seed < 130; seed++) {
        const p = generate(n, seed, seed % 3 === 0 ? 'hard' : undefined);
        const m = workMarks(p);
        for (let guard = 0; guard < 2000; guard++) {
          const step = findStep(p, m);
          if (!step) break;
          seen.add(step.technique);
          for (const i of step.cells) {
            expect(m[i]).toBe(UNKNOWN);
            expect(step.mark === TENT).toBe(p.solution[i]);
            m[i] = step.mark;
          }
        }
        expect(m.includes(UNKNOWN)).toBe(false);
      }
    }
    // the test only means something if the harder techniques were really used
    for (const t of ['noTree', 'tentTouch', 'lineFull', 'lineAllTents', 'treeLast', 'fitTents', 'contradiction']) {
      expect(seen.has(t)).toBe(true);
    }
  });

  test('easy puzzles need only the simple rules', () => {
    for (let seed = 1; seed <= 10; seed++) {
      const p = generate(6, seed, 'easy');
      if (p.grade !== 'easy') continue;
      expect(solveLogic(p, 1).solved).toBe(true);
    }
  });

  test('hard puzzles cannot be finished with the simple and medium rules alone', () => {
    let hard = 0;
    for (let seed = 1; seed <= 10; seed++) {
      const p = generate(8, seed, 'hard');
      if (p.grade !== 'hard') continue;
      hard++;
      expect(solveLogic(p, 2).solved).toBe(false);
      expect(solveLogic(p, 3).solved).toBe(true);
    }
    expect(hard).toBeGreaterThan(5);
  });

  test('check() notices broken positions', () => {
    const p = generate(6, 3);
    const m = workMarks(p);
    const tentsInSolution = p.solution.map((t, i) => (t ? i : -1)).filter((i) => i >= 0);
    // a tent on a square that touches a real tent
    const g = geo(6);
    const first = tentsInSolution[0];
    m[first] = TENT;
    const neighbour = g.around[first].find((j) => !p.trees[j]);
    m[neighbour as number] = TENT;
    expect(check(p, m)?.kind).toBe('touch');
  });

  test('tiers are defined for every technique', () => {
    expect(Object.values(TIER).every((t) => t >= 1 && t <= 3)).toBe(true);
  });
});

describe('speed', () => {
  test('making a puzzle is fast enough for a phone', () => {
    const report: string[] = [];
    for (const [n, grade] of [[5, 'easy'], [6, 'easy'], [8, 'medium'], [8, 'hard'], [10, 'medium'], [10, 'hard'], [12, 'medium'], [12, 'hard']] as [number, Grade][]) {
      const t0 = Date.now();
      let got = 0;
      for (let seed = 500; seed < 510; seed++) if (generate(n, seed, grade).grade === grade) got++;
      const ms = (Date.now() - t0) / 10;
      report.push(`${n}x${n} ${grade}: ${ms.toFixed(0)} ms each, ${got}/10 hit the grade`);
      expect(ms).toBeLessThan(1500);
    }
    console.log(report.join('\n'));
  });
});
