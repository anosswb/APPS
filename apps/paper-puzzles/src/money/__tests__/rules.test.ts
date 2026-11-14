import { archiveLocked, bookLocked, interstitialDue, MoneyState, oldestFreeDay } from '../rules';

const MIN = 60 * 1000;
const base: MoneyState = { fullEdition: false, unlockedDays: [], lastAdAt: 0, firstOpenAt: 0 };
const today = '2026-12-20';

describe('past puzzles', () => {
  test('today and the six days before it are always open', () => {
    expect(oldestFreeDay(today)).toBe('2026-12-14');
    for (const mode of ['ads', 'iap'] as const) {
      expect(archiveLocked('2026-12-20', today, mode, true, base, false)).toBe(false);
      expect(archiveLocked('2026-12-14', today, mode, true, base, false)).toBe(false);
      expect(archiveLocked('2026-12-13', today, mode, true, base, false)).toBe(true);
    }
  });

  test('the free week crosses month and year ends', () => {
    expect(oldestFreeDay('2027-01-03')).toBe('2026-12-28');
  });

  test('a day already started or solved is never taken away', () => {
    expect(archiveLocked('2026-11-02', today, 'iap', true, base, true)).toBe(false);
    expect(archiveLocked('2026-11-02', today, 'ads', true, base, true)).toBe(false);
  });

  test('iPhone: nothing is locked until buying really works, and nothing after the purchase', () => {
    expect(archiveLocked('2026-11-02', today, 'iap', false, base, false)).toBe(false);
    expect(archiveLocked('2026-11-02', today, 'iap', true, { ...base, fullEdition: true }, false)).toBe(false);
  });

  test('Android: one video opens a day for good', () => {
    expect(archiveLocked('2026-11-02', today, 'ads', false, base, false)).toBe(true);
    expect(archiveLocked('2026-11-02', today, 'ads', false, { ...base, unlockedDays: ['2026-11-02'] }, false)).toBe(false);
  });

  test('with no store (web preview) everything is open', () => {
    expect(archiveLocked('2026-11-02', today, 'none', true, base, false)).toBe(false);
  });
});

describe('the Book', () => {
  test('iPhone: free up to puzzle 30, then the full edition', () => {
    expect(bookLocked(30, 'iap', true, base)).toBe(false);
    expect(bookLocked(31, 'iap', true, base)).toBe(true);
    expect(bookLocked(31, 'iap', true, { ...base, fullEdition: true })).toBe(false);
    expect(bookLocked(31, 'iap', false, base)).toBe(false); // cannot sell yet: never lock
  });

  test('Android: the Book never locks', () => {
    expect(bookLocked(500, 'ads', true, base)).toBe(false);
  });
});

describe('full-screen ads', () => {
  const late = 60 * MIN;
  test('only on Android', () => {
    expect(interstitialDue('iap', 20, late, base)).toBe(false);
    expect(interstitialDue('none', 20, late, base)).toBe(false);
    expect(interstitialDue('ads', 20, late, base)).toBe(true);
  });

  test('never before Book puzzle 6 is finished', () => {
    expect(interstitialDue('ads', 5, late, base)).toBe(false);
    expect(interstitialDue('ads', 6, late, base)).toBe(true);
  });

  test('never in the first ten minutes after the first opening', () => {
    const m = { ...base, firstOpenAt: 1000 * MIN };
    expect(interstitialDue('ads', 20, 1009 * MIN, m)).toBe(false);
    expect(interstitialDue('ads', 20, 1010 * MIN, m)).toBe(true);
  });

  test('at most one every four minutes', () => {
    const m = { ...base, lastAdAt: 100 * MIN };
    expect(interstitialDue('ads', 20, 103 * MIN, m)).toBe(false);
    expect(interstitialDue('ads', 20, 104 * MIN, m)).toBe(true);
  });
});
