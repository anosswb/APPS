import { clockKey, nowOf } from '../now';

const night = { kind: 'work' as const, start: 18 * 60, end: 6 * 60 };
const day = { kind: 'work' as const, start: 6 * 60, end: 18 * 60 };

describe('the now line', () => {
  test('2 AM after a 6 PM – 6 AM night shift that started yesterday: still at work, 4 h left', () => {
    const n = nowOf({ book: { '2026-11-15': night } }, '2026-11-16', 2 * 60);
    expect(n.kind).toBe('during');
    if (n.kind === 'during') { expect(n.left).toBe(240); expect(n.part).toBeCloseTo(8 / 12); }
  });

  test('7 AM after that night shift: today counts again (not marked)', () => {
    expect(nowOf({ book: { '2026-11-15': night } }, '2026-11-16', 7 * 60).kind).toBe('unknown');
  });

  test('a day shift: before, during, done', () => {
    const plan = { book: { '2026-11-16': day } };
    expect(nowOf(plan, '2026-11-16', 5 * 60)).toMatchObject({ kind: 'before', startsIn: 60 });
    expect(nowOf(plan, '2026-11-16', 12 * 60)).toMatchObject({ kind: 'during', left: 360 });
    expect(nowOf(plan, '2026-11-16', 19 * 60).kind).toBe('done');
  });

  test('tonight\'s night shift at 8 PM: during, clock-out tomorrow 6 AM', () => {
    expect(nowOf({ book: { '2026-11-16': night } }, '2026-11-16', 20 * 60)).toMatchObject({ kind: 'during', left: 600, clockOut: 30 * 60 });
  });

  test('rest day', () => {
    expect(nowOf({ book: { '2026-11-16': { kind: 'rest' } } }, '2026-11-16', 600).kind).toBe('rest');
  });
});

describe('which day the clock card uses', () => {
  test('clocked in yesterday evening and not out yet: yesterday', () => {
    expect(clockKey({ '2026-11-15': { out: null } }, '2026-11-16')).toBe('2026-11-15');
  });
  test('yesterday closed, or today already has a log: today', () => {
    expect(clockKey({ '2026-11-15': { out: 360 } }, '2026-11-16')).toBe('2026-11-16');
    expect(clockKey({ '2026-11-15': { out: null }, '2026-11-16': { out: null } }, '2026-11-16')).toBe('2026-11-16');
  });
});
