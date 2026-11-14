import { bookPuzzle, bookSpec, nextRelief } from '../book';
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

  test('relief makes the next puzzle easier, never harder', () => {
    expect(bookSpec(15, 1).grade).toBe('medium');
    expect(bookSpec(15, 2).n).toBe(6);
    expect(nextRelief(0, 4)).toBe(1);
    expect(nextRelief(2, 5)).toBe(2);
    expect(nextRelief(2, 0)).toBe(0);
    expect(nextRelief(1, 1)).toBe(1);
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
