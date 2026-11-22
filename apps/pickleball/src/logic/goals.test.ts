import { DEFAULT_GOALS, fraction, progress } from './goals';
import { game, session } from './fixtures';

const at = (m: number, d: number) => new Date(2026, m, d, 10).getTime();

describe('goals', () => {
  const sessions = [
    session('a', at(9, 30), [game(['A', 'B'], ['C', 'D'], [11, 2], at(9, 30), 10)]),
    session('b', at(10, 3), [game(['A', 'B'], ['C', 'D'], [11, 2], at(10, 3), 10), game(['A', 'B'], ['C', 'D'], [11, 2], at(10, 3), 10)]),
    session('c', at(10, 20), [game(['A', 'B'], ['C', 'D'], [11, 2], at(10, 20), 10)], ['A', 'B', 'C', 'D', 'E', 'F']),
    session('empty', at(10, 21), []),
  ];
  const now = at(10, 22);
  it('sessions this month (empty sessions do not count)', () => {
    expect(progress({ id: 'x', kind: 'sessions-month', target: 4, createdAt: 0 }, sessions, now)).toBe(2);
  });
  it('games all time and this week', () => {
    expect(progress({ id: 'x', kind: 'games-total', target: 100, createdAt: 0 }, sessions, now)).toBe(4);
    expect(progress({ id: 'x', kind: 'games-week', target: 30, createdAt: 0 }, sessions, now)).toBe(1);
  });
  it('biggest session', () => {
    expect(progress({ id: 'x', kind: 'players-session', target: 16, createdAt: 0 }, sessions, now)).toBe(6);
  });
  it('fraction stops at 1 and defaults exist', () => {
    expect(fraction({ id: 'x', kind: 'games-total', target: 2, createdAt: 0 }, sessions, now)).toBe(1);
    expect(DEFAULT_GOALS(0)).toHaveLength(2);
  });
});
