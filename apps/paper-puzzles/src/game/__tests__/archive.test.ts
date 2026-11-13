import { addMonths, canPlay, FIRST_EDITION, monthGrid, monthInRange, monthOf } from '../archive';

describe('archive calendar', () => {
  test('November 2026 starts on a Sunday, so the first row has one day at the end', () => {
    const rows = monthGrid({ year: 2026, month: 10 });
    expect(rows[0]).toEqual([null, null, null, null, null, null, '2026-11-01']);
    expect(rows[1][0]).toBe('2026-11-02'); // a Monday
    expect(rows.flat().filter(Boolean).length).toBe(30);
    expect(rows.every((r) => r.length === 7)).toBe(true);
    expect(rows[rows.length - 1][0]).toBe('2026-11-30');
  });

  test('February in a leap year has 29 days', () => {
    expect(monthGrid({ year: 2028, month: 1 }).flat().filter(Boolean).length).toBe(29);
  });

  test('only days from the first edition up to today can be played', () => {
    expect(canPlay(FIRST_EDITION, '2026-11-13')).toBe(true);
    expect(canPlay('2026-11-13', '2026-11-13')).toBe(true);
    expect(canPlay('2026-11-14', '2026-11-13')).toBe(false);
    expect(canPlay('2026-10-31', '2026-11-13')).toBe(false);
  });

  test('months move across the year end and stay in range', () => {
    expect(addMonths({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 });
    expect(addMonths({ year: 2027, month: 0 }, -1)).toEqual({ year: 2026, month: 11 });
    expect(monthOf('2027-01-05')).toEqual({ year: 2027, month: 0 });
    expect(monthInRange({ year: 2026, month: 10 }, '2027-01-05')).toBe(true);
    expect(monthInRange({ year: 2026, month: 9 }, '2027-01-05')).toBe(false);
    expect(monthInRange({ year: 2027, month: 1 }, '2027-01-05')).toBe(false);
  });
});
