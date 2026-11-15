jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn(() => Promise.resolve()) }));
import { payByRules } from '../payrules';
import { FRESH, FRESH_PAY, migrate, payPlan, periodAround, planOf, rulesOf, Saved } from '../../store';

const base: Saved = { ...FRESH, shift: { start: 7 * 60, end: 19 * 60 }, book: { '2026-11-16': { kind: 'work', start: 6 * 60, end: 18 * 60 }, '2026-11-17': { kind: 'rest' } } };

describe('saved data', () => {
  test('a marked work day follows the usual shift (his bug: "My day still constant")', () => {
    const d = planOf(base).book['2026-11-16'];
    expect(d).toEqual({ kind: 'work', start: 7 * 60, end: 19 * 60 });
    expect(planOf(base).book['2026-11-17']).toEqual({ kind: 'rest' });
  });

  test('pay counts logged days only, and adds planned days from today when asked', () => {
    const d: Saved = { ...base, book: { ...base.book, '2026-11-18': { kind: 'work', start: 0, end: 0 } }, log: { '2026-11-16': { in: 6 * 60, out: 17 * 60 }, '2026-11-18': { in: 6 * 60, out: null } } };
    expect(Object.keys(payPlan(d, '2026-11-18', false).book)).toEqual(['2026-11-16']);
    // still at work today: today is not counted until clock-out
    expect(Object.keys(payPlan(d, '2026-11-18', true).book)).toEqual(['2026-11-16']);
    const tomorrow = { ...d, book: { ...d.book, '2026-11-19': { kind: 'work' as const, start: 0, end: 0 } } };
    expect(Object.keys(payPlan(tomorrow, '2026-11-18', true).book).sort()).toEqual(['2026-11-16', '2026-11-19']);
  });

  test('a holiday log day is paid with the holiday percentage', () => {
    const d: Saved = { ...base, pay: { ...FRESH_PAY, rate: 20, dayPercent: 0, holidayPercent: 100 }, log: { '2026-11-26': { in: 8 * 60, out: 16 * 60, holiday: true } } };
    const r = payByRules(payPlan(d, '2026-11-30', false), rulesOf(d.pay), { rate: 20, weekStarts: 0 }, '2026-11-26', '2026-11-26');
    expect(r.gross).toBe(320);
  });

  test('old saved data gets the new fields', () => {
    const m = migrate({ v: 1, book: {}, pay: { rate: 21 } });
    expect(m.pay.rate).toBe(21);
    expect(m.pay.nightFrom).toBe(22 * 60);
    expect(m.remind).toEqual({ lunch: false, twoLeft: false });
    expect(m.stubs).toEqual({});
  });

  test('pay periods of one and two weeks line up with the chosen start', () => {
    expect(periodAround(FRESH_PAY, '2026-11-18')).toEqual({ start: '2026-11-15', end: '2026-11-21' });
    const two = { ...FRESH_PAY, periodWeeks: 2 as const, periodStart: '2026-11-08' };
    expect(periodAround(two, '2026-11-18')).toEqual({ start: '2026-11-08', end: '2026-11-21' });
    expect(periodAround(two, '2026-11-22')).toEqual({ start: '2026-11-22', end: '2026-12-05' });
    expect(periodAround(two, '2026-11-01')).toEqual({ start: '2026-10-25', end: '2026-11-07' });
  });
});

describe('night hours', () => {
  const night = (from: number, to: number) => [{ id: 'n', name: 'Night', percent: 20, when: { type: 'clock' as const, from, to } }];
  const o = { rate: 10, weekStarts: 0 };
  const one = (start: number, end: number) => ({ book: { '2026-11-16': { kind: 'work' as const, start, end } } });

  test('a night shift 6 PM – 6 AM gets 8 night hours with a 10 PM – 6 AM window', () => {
    const r = payByRules(one(18 * 60, 6 * 60), night(22 * 60, 6 * 60), o, '2026-11-16', '2026-11-16');
    expect(r.lines).toEqual([{ percent: 0, hours: 4, names: [] }, { percent: 20, hours: 8, names: ['Night'] }]);
  });

  test('a day shift 6 AM – 6 PM gets no night hours', () => {
    const r = payByRules(one(6 * 60, 18 * 60), night(22 * 60, 6 * 60), o, '2026-11-16', '2026-11-16');
    expect(r.lines).toEqual([{ percent: 0, hours: 12, names: [] }]);
  });

  test('an early start 4 AM – 4 PM gets 2 night hours', () => {
    const r = payByRules(one(4 * 60, 16 * 60), night(22 * 60, 6 * 60), o, '2026-11-16', '2026-11-16');
    expect(r.lines).toEqual([{ percent: 0, hours: 10, names: [] }, { percent: 20, hours: 2, names: ['Night'] }]);
  });

  test('a window that does not cross midnight (2 PM – 10 PM) also works', () => {
    const r = payByRules(one(12 * 60, 20 * 60), night(14 * 60, 22 * 60), o, '2026-11-16', '2026-11-16');
    expect(r.lines).toEqual([{ percent: 0, hours: 2, names: [] }, { percent: 20, hours: 6, names: ['Night'] }]);
  });
});
