import { bestNews, freshRecords, recordChallenge, recordSolve } from '../records';

describe('personal bests', () => {
  test('a best time is kept per grid size, only for a solve with no hints', () => {
    let r = freshRecords();
    r = recordSolve(r, 6, 90000, 0);
    expect(r.best).toEqual({ '6': 90000 });
    r = recordSolve(r, 6, 120000, 0); // slower: no change
    r = recordSolve(r, 6, 40000, 2); // faster but with hints: no change
    r = recordSolve(r, 6, 500, 0); // a reopened puzzle: no change
    expect(r.best).toEqual({ '6': 90000 });
    r = recordSolve(r, 6, 71000, 0);
    r = recordSolve(r, 7, 200000, 0);
    expect(r.best).toEqual({ '6': 71000, '7': 200000 });
  });

  test('what to say after a solve', () => {
    expect(bestNews(undefined, 90000, 0)).toBe('first');
    expect(bestNews(90000, 71000, 0)).toBe('new');
    expect(bestNews(90000, 95000, 0)).toBe('keep');
    expect(bestNews(90000, 71000, 1)).toBeNull();
  });

  test('wins in a row: a win adds, a helped win keeps, a loss ends the run but not the best', () => {
    let r = freshRecords();
    r = recordChallenge(r, 'ink', true, false);
    r = recordChallenge(r, 'ink', true, false);
    r = recordChallenge(r, 'ink', true, true);
    expect(r.ink).toEqual({ streak: 2, best: 2 });
    r = recordChallenge(r, 'ink', false, false);
    expect(r.ink).toEqual({ streak: 0, best: 2 });
    r = recordChallenge(r, 'ink', true, false);
    expect(r.ink).toEqual({ streak: 1, best: 2 });
    expect(r.race).toEqual({ streak: 0, best: 0 });
  });
});
