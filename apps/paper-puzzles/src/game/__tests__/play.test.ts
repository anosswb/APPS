import { bookPuzzle, bookSpec, nextPace, parMs } from '../book';
import { dailyPuzzle, dailySpec, dateKey, weekOf } from '../daily';
import { generate } from '../generator';
import { geo } from '../grid';
import { getHint, isSolved, visibleProblems, wrongCells } from '../hints';
import { GRASS, TENT, UNKNOWN } from '../types';

describe('hints', () => {
  test('following the hints from an empty grid solves the puzzle', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const p = generate(8, seed, seed % 2 ? 'hard' : 'medium');
      const marks = new Array(64).fill(UNKNOWN);
      for (let guard = 0; guard < 500 && !isSolved(p, marks); guard++) {
        const hint = getHint(p, marks);
        expect(hint.kind).toBe('step');
        if (hint.kind !== 'step') break;
        for (const i of hint.step.cells) marks[i] = hint.step.mark;
      }
      expect(isSolved(p, marks)).toBe(true);
      expect(getHint(p, marks).kind).toBe('solved');
    }
  });

  test('a hint points at a mistake before anything else', () => {
    const p = generate(6, 9);
    const g = geo(6);
    const marks = new Array(36).fill(UNKNOWN);
    const tent = p.solution.findIndex((t) => t);
    const beside = g.around[tent].find((j) => !p.trees[j]) as number;
    marks[tent] = TENT;
    marks[beside] = TENT;
    const hint = getHint(p, marks);
    expect(hint.kind).toBe('mistake');
    if (hint.kind === 'mistake') {
      expect(hint.reason).toBe('touch');
      expect(hint.cells.sort()).toEqual([tent, beside].sort());
    }
    expect(visibleProblems(p, marks).touching.length).toBe(2);
    expect(wrongCells(p, marks)).toEqual([beside]);
  });

  test('grass on a tent square is found as a mistake', () => {
    const p = generate(6, 11);
    const marks = new Array(36).fill(UNKNOWN);
    const tent = p.solution.findIndex((t) => t);
    marks[tent] = GRASS;
    const hint = getHint(p, marks);
    expect(hint).toEqual({ kind: 'mistake', reason: 'wrong', cells: [tent] });
  });

  test('grass marks are not needed to win, only the tents', () => {
    const p = generate(5, 2);
    const marks = p.solution.map((t) => (t ? TENT : UNKNOWN));
    expect(isSolved(p, marks)).toBe(true);
  });
});

describe('daily puzzle', () => {
  test('the same day gives everyone the same puzzle', () => {
    expect(dailyPuzzle('2026-11-13')).toEqual(dailyPuzzle('2026-11-13'));
    expect(dailyPuzzle('2026-11-14').trees).not.toEqual(dailyPuzzle('2026-11-13').trees);
  });

  test('the week builds up to a big Sunday puzzle', () => {
    expect(dailySpec('2026-11-09')).toEqual({ n: 6, grade: 'easy' }); // a Monday
    expect(dailySpec('2026-11-15')).toEqual({ n: 10, grade: 'hard' }); // a Sunday
    for (const key of weekOf('2026-11-13')) {
      const p = dailyPuzzle(key);
      expect(p.n).toBe(dailySpec(key).n);
      expect(p.grade).toBe(dailySpec(key).grade);
    }
  });

  test('weekOf starts on Monday and holds the day', () => {
    const week = weekOf('2026-11-13');
    expect(week[0]).toBe('2026-11-09');
    expect(week[6]).toBe('2026-11-15');
    expect(week).toContain('2026-11-13');
    expect(dateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('the book', () => {
  test('the first ten puzzles are small and easy', () => {
    for (let level = 1; level <= 10; level++) {
      const spec = bookSpec(level);
      expect(spec.grade).toBe('easy');
      expect(spec.n).toBeLessThanOrEqual(6);
      expect(bookPuzzle(level).grade).toBe('easy');
    }
  });

  test('every fifth puzzle after that is the big hard one, then it gets kinder again', () => {
    expect(bookSpec(15)).toMatchObject({ boss: true, grade: 'hard', n: 7 });
    expect(bookSpec(16)).toMatchObject({ boss: false, grade: 'easy', n: 6 });
    expect(bookSpec(20).boss).toBe(true);
    expect(bookSpec(200).n).toBeLessThanOrEqual(10);
  });

  test('a player who needs help gets kinder puzzles, then smaller ones', () => {
    expect(bookSpec(15, 1).grade).toBe('medium');
    expect(bookSpec(15, 2).n).toBe(6);
    const spec = bookSpec(15);
    expect(nextPace({ relief: 0, fast: 0 }, spec, 4, 600000)).toEqual({ relief: 1, fast: 0 });
    expect(nextPace({ relief: 2, fast: 0 }, spec, 5, 600000)).toEqual({ relief: 2, fast: 0 });
    // one or two hints: stay where you are
    expect(nextPace({ relief: 1, fast: 0 }, spec, 1, 300000)).toEqual({ relief: 1, fast: 0 });
    // a clean solve ends the kinder stretch
    expect(nextPace({ relief: 2, fast: 0 }, spec, 0, 300000)).toEqual({ relief: 0, fast: 0 });
  });

  test('a player who is fast and clean gets harder puzzles, then bigger ones', () => {
    expect(bookSpec(16, -1)).toMatchObject({ grade: 'medium', n: 6 });
    expect(bookSpec(16, -2)).toMatchObject({ grade: 'medium', n: 7 });
    expect(bookSpec(200, -2).n).toBeLessThanOrEqual(10);
    const spec = bookSpec(16);
    const quick = parMs(spec.n, spec.grade) * 0.5;
    // one fast solve is not enough, two in a row are
    const one = nextPace({ relief: 0, fast: 0 }, spec, 0, quick);
    expect(one).toEqual({ relief: 0, fast: 1 });
    const two = nextPace(one, spec, 0, quick);
    expect(two).toEqual({ relief: -1, fast: 0 });
    // and it never goes past two steps
    expect(nextPace({ relief: -2, fast: 1 }, spec, 0, quick)).toEqual({ relief: -2, fast: 0 });
    // a normal-speed clean solve breaks the run but keeps the level
    expect(nextPace({ relief: -1, fast: 1 }, spec, 0, parMs(spec.n, spec.grade))).toEqual({ relief: -1, fast: 0 });
  });

  test('on a harder path, a hint or a slow solve steps back toward normal', () => {
    const spec = bookSpec(16, -2);
    const par = parMs(spec.n, spec.grade);
    expect(nextPace({ relief: -2, fast: 0 }, spec, 1, par)).toEqual({ relief: -1, fast: 0 });
    expect(nextPace({ relief: -1, fast: 0 }, spec, 0, par * 2)).toEqual({ relief: 0, fast: 0 });
    expect(nextPace({ relief: -1, fast: 0 }, spec, 3, par)).toEqual({ relief: 0, fast: 0 });
  });

  test('the first ten puzzles are the same for everyone', () => {
    for (let level = 1; level <= 10; level++) {
      expect(bookSpec(level, -2)).toEqual(bookSpec(level, 0));
    }
    const spec = bookSpec(5);
    const quick = parMs(spec.n, spec.grade) * 0.3;
    expect(nextPace({ relief: 0, fast: 1 }, spec, 0, quick).relief).toBe(0);
    // from puzzle 10 on, two fast solves do step up (the next puzzle is 11)
    expect(nextPace({ relief: 0, fast: 1 }, bookSpec(10), 0, quick).relief).toBe(-1);
  });

  test('every harder or kinder puzzle can still be made, with one answer', () => {
    for (const relief of [-2, -1, 1, 2]) {
      for (const level of [11, 15, 20, 45]) {
        const p = bookPuzzle(level, relief);
        expect(p.solution.filter(Boolean).length).toBeGreaterThan(0);
      }
    }
  });

  test('a level is always the same puzzle', () => {
    expect(bookPuzzle(12)).toEqual(bookPuzzle(12));
  });
});

describe('the level strip on the front page', () => {
  // imported here so the test stays with the other Book tests
  const { levelWindow } = require('../../ui/LevelStrip') as typeof import('../../ui/LevelStrip');

  test('early on it shows five neighbours and never goes below 1', () => {
    expect(levelWindow(1)).toEqual([1, 2, 3, 4, 5]);
    expect(levelWindow(4)).toEqual([2, 3, 4, 5, 6]);
    expect(levelWindow(10)).toEqual([6, 7, 8, 9, 10]);
  });

  test('later it shows the whole wave of five, ending on the big one', () => {
    expect(levelWindow(11)).toEqual([11, 12, 13, 14, 15]);
    expect(levelWindow(15)).toEqual([11, 12, 13, 14, 15]);
    expect(levelWindow(16)).toEqual([16, 17, 18, 19, 20]);
    for (const level of [11, 13, 27, 104]) {
      const window = levelWindow(level);
      expect(window).toContain(level);
      expect(bookSpec(window[4]).boss).toBe(true);
    }
  });
});
