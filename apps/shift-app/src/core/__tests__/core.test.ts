import { addDays, dayNumber, keyOf, monthWeeks, weekday } from '../dates';
import { hoursBetween, nextPayday, periodOf, periodPay } from '../pay';
import { PRESETS, presetById } from '../presets';
import { anchorFor, nextOff, nextWork, patternDay, plannedOn, runLength, shiftOn } from '../rotation';

const H = { D: 12, N: 12, S: 8, X: 24, O: 0 };

describe('calendar days', () => {
  test('keys and day numbers go back and forth across leap days and year ends', () => {
    for (const key of ['2026-11-14', '2028-02-29', '2027-12-31', '2028-01-01', '2100-02-28']) expect(keyOf(dayNumber(key))).toBe(key);
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2027-02-28', 1)).toBe('2027-03-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(dayNumber('2027-03-15') - dayNumber('2027-03-13')).toBe(2); // across the US clock change
  });

  test('weekdays', () => {
    expect(weekday('2026-11-14')).toBe(6); // Saturday
    expect(weekday('2026-11-15')).toBe(0);
    expect(weekday('1970-01-01')).toBe(4);
  });

  test('a month is laid out in full weeks, Sunday first', () => {
    const nov = monthWeeks(2026, 11);
    expect(nov[0]).toEqual(['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07']);
    expect(nov.flat().filter(Boolean)).toHaveLength(30);
    const feb = monthWeeks(2028, 2);
    expect(feb.flat().filter(Boolean)).toHaveLength(29);
    for (const week of feb) expect(week).toHaveLength(7);
  });
});

describe('rotations', () => {
  const pitman = { cycle: presetById('223-days')!.cycle, anchor: '2026-11-09' }; // a Monday

  test('the shift on any date comes from the rule', () => {
    expect(['2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'].map((k) => plannedOn(pitman, k)).join('')).toBe('DDOODDD');
    // 14 days later it repeats, and it also works for dates before the anchor
    expect(plannedOn(pitman, '2026-11-23')).toBe('D');
    expect(plannedOn(pitman, '2026-11-08')).toBe('O');
    expect(patternDay(pitman, '2026-11-08')).toBe(13);
  });

  test('ten years out, the pattern has not drifted by a day', () => {
    const start = dayNumber(pitman.anchor);
    for (let i = 0; i < 3653; i += 14) expect(plannedOn(pitman, keyOf(start + i))).toBe('D');
    for (let i = 13; i < 3653; i += 14) expect(plannedOn(pitman, keyOf(start + i))).toBe('O');
  });

  test('"today is day 3 of my pattern" sets the start', () => {
    const r = { cycle: pitman.cycle, anchor: anchorFor('2026-11-14', 2) };
    expect(patternDay(r, '2026-11-14')).toBe(2);
    expect(plannedOn(r, '2026-11-14')).toBe('O');
  });

  test('one changed day changes only that day', () => {
    const changes = { '2026-11-11': 'D' as const };
    expect(shiftOn(pitman, '2026-11-11', changes)).toBe('D');
    expect(shiftOn(pitman, '2026-11-12', changes)).toBe('O');
    expect(shiftOn(pitman, '2026-11-25', changes)).toBe('O');
  });

  test('next day off, next working day, days in a row', () => {
    expect(nextOff(pitman, '2026-11-09')).toBe('2026-11-11');
    expect(nextOff(pitman, '2026-11-11')).toBe('2026-11-12');
    expect(nextWork(pitman, '2026-11-11')).toBe('2026-11-13');
    expect(runLength(pitman, '2026-11-14')).toBe(3);
    expect(runLength(pitman, '2026-11-11')).toBe(0);
    expect(nextOff({ cycle: ['D'], anchor: '2026-01-01' }, '2026-11-09')).toBeNull();
  });

  test('every ready-made rotation is whole weeks or a known length, and its weekly hours make sense', () => {
    const expected: Record<string, [number, number]> = {
      '223-days': [14, 42], '223-nights': [14, 42], '223-rotating': [28, 42],
      '4on4off-days': [8, 42], '4on4off-nights': [8, 42], '4on4off-rotating': [16, 42],
      dupont: [28, 42], '3x12': [7, 36], '4x10': [7, 40], '5x8': [7, 40], 'swing-3-week': [21, 40],
      '24-48': [3, 56], '48-96': [6, 56],
    };
    expect(PRESETS.map((p) => p.id).sort()).toEqual(Object.keys(expected).sort());
    for (const p of PRESETS) {
      const [length, weekly] = expected[p.id];
      expect([p.id, p.cycle.length]).toEqual([p.id, length]);
      const worked = p.cycle.filter((c) => c !== 'O').length;
      expect([p.id, (worked * p.hours * 7) / p.cycle.length]).toEqual([p.id, weekly]);
      expect(p.cycle.every((c) => 'DNSXO'.includes(c))).toBe(true);
    }
  });

  test('DuPont ends with seven days off in a row', () => {
    const d = presetById('dupont')!;
    expect(d.cycle.slice(-7).join('')).toBe('OOOOOOO');
    expect(d.cycle.slice(0, 4).join('')).toBe('NNNN');
  });
});

describe('pay periods (estimates)', () => {
  const r = { cycle: presetById('223-days')!.cycle, anchor: '2026-11-08' }; // pattern starts on a Sunday
  const pay = { length: 14 as const, anchor: '2026-11-08', paydayAfter: 5, weekStarts: 0, rate: 20 };

  test('the pay period around a date, and its payday', () => {
    expect(periodOf(pay, '2026-11-14')).toEqual({ start: '2026-11-08', end: '2026-11-21', payday: '2026-11-26' });
    expect(periodOf(pay, '2026-11-22').start).toBe('2026-11-22');
    expect(periodOf(pay, '2026-11-07').end).toBe('2026-11-07');
    expect(periodOf({ ...pay, length: 7 }, '2026-11-14')).toEqual({ start: '2026-11-08', end: '2026-11-14', payday: '2026-11-19' });
  });

  test('the next payday can belong to the period before this one', () => {
    // period 25 Oct – 7 Nov pays on 12 Nov
    expect(nextPayday(pay, '2026-11-09')).toBe('2026-11-12');
    expect(nextPayday(pay, '2026-11-12')).toBe('2026-11-12');
    expect(nextPayday(pay, '2026-11-13')).toBe('2026-11-26');
  });

  test('hours in a period, and overtime over 40 in a workweek', () => {
    // 2-2-3 from a Sunday: week one D D O O D D D = 60 h, week two O O D D O O O = 24 h
    expect(hoursBetween(r, H, '2026-11-08', '2026-11-21')).toBe(84);
    const p = periodPay(r, H, pay, '2026-11-08', '2026-11-21');
    expect(p).toEqual({ hours: 84, regular: 64, overtime: 20, gross: 64 * 20 + 20 * 30 });
  });

  test('a workweek that starts before the pay period still counts toward 40', () => {
    const weekly = { ...pay, length: 7 as const, anchor: '2026-11-11' }; // periods run Wednesday to Tuesday
    // workweek Sun 8 – Sat 14: D D O O D D D. The period starts Wed 11: 24 h fall before it, 36 h inside.
    const p = periodPay(r, H, weekly, '2026-11-11', '2026-11-17');
    // inside the first workweek: 36 h, of which 16 regular (40 − 24) and 20 overtime; second workweek (Sun 15 – Tue 17): O O D = 12 regular
    expect(p).toEqual({ hours: 48, regular: 28, overtime: 20, gross: 28 * 20 + 20 * 30 });
  });

  test('no rate set means no dollar figure, and an extra shift adds hours', () => {
    expect(periodPay(r, H, { ...pay, rate: 0 }, '2026-11-08', '2026-11-21').gross).toBeNull();
    expect(hoursBetween(r, H, '2026-11-08', '2026-11-21', { '2026-11-10': 'D' })).toBe(96);
  });
});
