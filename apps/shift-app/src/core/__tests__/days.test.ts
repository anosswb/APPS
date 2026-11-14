import { clock, dayLine } from '../dayline';
import { DayBook, Plan, WorkDay, dayOn, daysSinceRest, markDay, markRun, nextRest, nextWorkDay, notKnown, paidHours, runTotal, workedInRow } from '../days';
import { ONE_DAY, PayRule, cleanRule, payByRules } from '../payrules';
import { presetById } from '../presets';

const DAY: WorkDay = { kind: 'work', start: 6 * 60, end: 18 * 60 }; // 6 AM – 6 PM, 12 hours
const NIGHT: WorkDay = { kind: 'work', start: 18 * 60, end: 6 * 60 };
const REST = { kind: 'rest' } as const;

/** The Saturday of the three pictures: work Mon 9 – Sun 15, rest Mon 16 and Tue 17, work Wed 18, Thu 19 not known, work Fri 20. */
function week(): Plan {
  let book: DayBook = markRun({}, '2026-11-09', 7, DAY);
  book = markRun(book, '2026-11-16', 2, REST);
  book = markDay(book, '2026-11-18', DAY);
  book = markDay(book, '2026-11-20', DAY);
  book = markDay(book, '2026-11-08', REST);
  return { book };
}

describe('the calendar with no pattern', () => {
  test('a day nobody marked is not known, and is never guessed', () => {
    const plan = week();
    expect(dayOn(plan, '2026-11-14')).toEqual(DAY);
    expect(dayOn(plan, '2026-11-16')).toEqual(REST);
    expect(dayOn(plan, '2026-11-19')).toBeNull();
    expect(dayOn({ book: {} }, '2026-11-14')).toBeNull();
    expect(notKnown(plan, '2026-11-14', '2026-11-22')).toBe(3); // Thu 19, Sat 21, Sun 22
  });

  test('when do I rest: the next rest day, how long it is, and whether it is sure', () => {
    const plan = week();
    expect(nextRest(plan, '2026-11-14')).toEqual({ key: '2026-11-16', inDays: 2, length: 2, sure: true });
    // after Wednesday the next marked rest is far away or missing, and Thursday is open
    expect(nextRest(plan, '2026-11-18')).toBeNull();
    const later = { book: markDay(plan.book, '2026-11-22', REST) };
    expect(nextRest(later, '2026-11-18')).toEqual({ key: '2026-11-22', inDays: 4, length: 1, sure: false });
    expect(nextRest({ book: {} }, '2026-11-14')).toBeNull();
  });

  test('days in a row and days since the last rest', () => {
    const plan = week();
    expect(workedInRow(plan, '2026-11-14')).toBe(6);
    expect(runTotal(plan, '2026-11-14')).toBe(7);
    expect(workedInRow(plan, '2026-11-16')).toBe(0);
    expect(daysSinceRest(plan, '2026-11-14')).toEqual({ days: 6, sure: true });
    expect(daysSinceRest(plan, '2026-11-16')).toEqual({ days: 0, sure: true });
    // Friday: Thursday is not known, so the count stops there and the days since rest are not sure
    expect(workedInRow(plan, '2026-11-20')).toBe(1);
    expect(daysSinceRest(plan, '2026-11-20')).toEqual({ days: 3, sure: false });
    expect(daysSinceRest({ book: { '2026-11-14': DAY } }, '2026-11-14')).toBeNull();
    expect(nextWorkDay(plan, '2026-11-15')).toEqual({ key: '2026-11-18', day: DAY, inDays: 3 });
  });

  test('a 10-day run marked in one go, then changed one day at a time', () => {
    let book = markRun({}, '2026-12-01', 10, DAY);
    expect(workedInRow({ book }, '2026-12-10')).toBe(10);
    book = markDay(book, '2026-12-05', REST);
    expect(workedInRow({ book }, '2026-12-10')).toBe(5);
    book = markDay(book, '2026-12-05', null);
    expect(dayOn({ book }, '2026-12-05')).toBeNull();
  });

  test('a ready rotation only fills the days the worker has not marked', () => {
    const plan: Plan = { book: { '2026-11-10': REST }, rotation: { cycle: presetById('223-days')!.cycle, anchor: '2026-11-09' } };
    expect(dayOn(plan, '2026-11-09')).toEqual({ kind: 'work', start: 360, end: 1080, breakMin: undefined });
    expect(dayOn(plan, '2026-11-10')).toEqual(REST); // marked by hand, wins
    expect(dayOn(plan, '2026-11-11')).toEqual(REST); // from the rotation
    expect(nextRest(plan, '2026-11-13')?.sure).toBe(true);
  });

  test('paid hours: nights that end the next day, 24-hour shifts, unpaid breaks', () => {
    expect(paidHours(DAY)).toBe(12);
    expect(paidHours(NIGHT)).toBe(12);
    expect(paidHours({ kind: 'work', start: 420, end: 420 })).toBe(24);
    expect(paidHours({ ...DAY, breakMin: 30 })).toBe(11.5);
    expect(paidHours(REST)).toBe(0);
    expect(paidHours(null)).toBe(0);
  });
});

describe('pay with the worker’s own rules', () => {
  const o = { rate: 20, weekStarts: 0 };
  const week40: PayRule = { id: 'a', name: 'Overtime', percent: 50, when: { type: 'weekOver', hours: 40 } };
  const day8: PayRule = { id: 'b', name: 'After 8 hours', percent: 25, when: { type: 'dayOver', hours: 8 } };
  const sunday: PayRule = { id: 'c', name: 'Sunday', percent: 100, when: { type: 'weekday', day: 0 } };
  const holiday: PayRule = { id: 'd', name: 'Holiday', percent: 150, when: { type: 'mark', mark: 'holiday' } };
  // Sun 15 – Sat 21 Nov 2026: five 12-hour days, Mon–Fri
  const five: Plan = { book: markRun(markRun({}, '2026-11-15', 1, REST), '2026-11-16', 5, DAY) };

  test('no rules: every hour is a normal hour', () => {
    expect(payByRules(five, [], o, '2026-11-15', '2026-11-21')).toEqual({ hours: 60, lines: [{ percent: 0, hours: 60, names: [] }], gross: 1200, open: 1 });
  });

  test('over 40 in the week at the worker’s own percentage', () => {
    const r = payByRules(five, [week40], o, '2026-11-15', '2026-11-21');
    expect(r.lines).toEqual([{ percent: 0, hours: 40, names: [] }, { percent: 50, hours: 20, names: ['Overtime'] }]);
    expect(r.gross).toBe(40 * 20 + 20 * 30);
    // the same week at +30 % instead: nothing is fixed by the app
    expect(payByRules(five, [{ ...week40, percent: 30 }], o, '2026-11-15', '2026-11-21').gross).toBe(40 * 20 + 20 * 26);
  });

  test('daily and weekly rules together: the higher percentage wins on each hour', () => {
    const r = payByRules(five, [week40, day8], o, '2026-11-15', '2026-11-21');
    // Mon–Wed: 8 normal + 4 at 25 %. Thursday: 4 normal (36→40), 4 over 40 at 50 %, 4 more at 50 %. Friday: 12 at 50 %.
    expect(r.lines).toEqual([
      { percent: 0, hours: 28, names: [] },
      { percent: 25, hours: 12, names: ['After 8 hours'] },
      { percent: 50, hours: 20, names: ['Overtime'] },
    ]);
    expect(r.gross).toBe(28 * 20 + 12 * 25 + 20 * 30);
  });

  test('adding instead of the highest, when the worker says their plant stacks', () => {
    // Thursday: 4 normal, 4 at 50, 4 at 75. Friday: 8 at 50, 4 at 75.
    const r = payByRules(five, [week40, day8], { ...o, stack: 'add' }, '2026-11-15', '2026-11-21');
    expect(r.lines.map((l) => [l.percent, l.hours])).toEqual([[0, 28], [25, 12], [50, 12], [75, 8]]);
  });

  test('Sundays, days marked by hand, and one day changed by hand', () => {
    const book = { ...five.book, '2026-11-15': DAY, '2026-11-16': { ...DAY, marks: ['holiday'] }, '2026-11-17': { ...DAY, extra: 200 } };
    const r = payByRules({ book }, [sunday, holiday], o, '2026-11-15', '2026-11-17');
    expect(r.lines).toEqual([
      { percent: 100, hours: 12, names: ['Sunday'] },
      { percent: 150, hours: 12, names: ['Holiday'] },
      { percent: 200, hours: 12, names: [ONE_DAY] },
    ]);
    expect(r.open).toBe(0);
    // a mark with no rule for it changes nothing
    expect(payByRules({ book }, [], o, '2026-11-16', '2026-11-16').lines).toEqual([{ percent: 0, hours: 12, names: [] }]);
  });

  test('a workweek that starts before the pay period still counts toward the weekly limit', () => {
    // period starts Thursday; Mon–Wed already gave 36 hours
    const r = payByRules(five, [week40], o, '2026-11-19', '2026-11-21');
    expect(r.lines).toEqual([{ percent: 0, hours: 4, names: [] }, { percent: 50, hours: 20, names: ['Overtime'] }]);
  });

  test('no hourly rate: hours only, no money shown; and what the worker types is kept sane', () => {
    expect(payByRules(five, [week40], { rate: 0, weekStarts: 0 }, '2026-11-15', '2026-11-21').gross).toBeNull();
    expect(cleanRule({ id: 'x', name: '  ', percent: -5, when: { type: 'dayOver', hours: NaN } })).toEqual({ id: 'x', name: 'Rule', percent: 0, when: { type: 'dayOver', hours: 0 } });
    expect(cleanRule({ ...week40, percent: 9999 }).percent).toBe(500);
  });
});

describe('the day around a shift', () => {
  test('a 6 AM start: wake, leave, eat, home, and sleep the evening before', () => {
    const line = dayLine(DAY, { getReady: 60, commute: 30, sleep: 7.5 });
    expect(clock(line.wake).text).toBe('4:30 AM');
    expect(clock(line.leave).text).toBe('5:30 AM');
    expect(clock(line.eat).text).toBe('12:00 PM');
    expect(clock(line.home).text).toBe('6:30 PM');
    expect(clock(line.sleepBy)).toEqual({ text: '9:00 PM', hour: 21, minute: 0, dayOffset: -1 });
  });

  test('a night shift ends and gets home the next day', () => {
    const line = dayLine(NIGHT, { getReady: 45, commute: 30, sleep: 7 });
    expect(clock(line.clockOut)).toEqual({ text: '6:00 AM', hour: 6, minute: 0, dayOffset: 1 });
    expect(clock(line.eat).text).toBe('12:00 AM');
    expect(clock(line.wake).text).toBe('4:45 PM');
    expect(clock(line.sleepBy).text).toBe('9:45 AM');
  });
});
