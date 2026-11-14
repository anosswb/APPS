import { t } from '../../i18n/en';
import { pick, praiseFor, underMark } from '../praise';

const base = { n: 6, grade: 'easy' as const, ms: 100000, hints: 0 };

describe('praise after a solved puzzle', () => {
  test('the round mark a time is under', () => {
    expect(underMark(19000)).toBe(20);
    expect(underMark(28000)).toBe(30);
    expect(underMark(30000)).toBe(45);
    expect(underMark(59000)).toBe(60);
    expect(underMark(170000)).toBe(180);
    expect(underMark(400000)).toBeNull();
  });

  test('fast and clean names the time: "under 30 seconds"', () => {
    // a 6 x 6 gentle puzzle usually takes 72 s; 28 s is fast
    expect(praiseFor({ ...base, ms: 28000 })).toEqual({ kind: 'under', mark: 30 });
    // 60 s is clean but not fast
    expect(praiseFor({ ...base, ms: 60000 })).toEqual({ kind: 'clean' });
  });

  test('a new personal best wins over the time', () => {
    expect(praiseFor({ ...base, ms: 28000, bestBefore: 40000 }).kind).toBe('newBest');
    expect(praiseFor({ ...base, ms: 28000, bestBefore: 20000 }).kind).toBe('under');
  });

  test('hints change the praise, and it never pretends', () => {
    expect(praiseFor({ ...base, hints: 1 }).kind).toBe('fewHints');
    expect(praiseFor({ ...base, hints: 5 }).kind).toBe('helped');
    expect(praiseFor({ ...base, ms: 10000, hints: 4 }).kind).toBe('helped');
  });

  test('a tricky or big puzzle with no hints gets its own line', () => {
    expect(praiseFor({ n: 8, grade: 'hard', ms: 900000, hints: 0 }).kind).toBe('hardClean');
    expect(praiseFor({ n: 10, grade: 'medium', ms: 900000, hints: 0 }).kind).toBe('hardClean');
  });

  test('challenges: the clock and the ink', () => {
    expect(praiseFor({ ...base, challenge: { kind: 'ink', room: 9, left: 0, helped: false } }).kind).toBe('lastDrop');
    expect(praiseFor({ ...base, challenge: { kind: 'ink', room: 9, left: 3, helped: false } }).kind).toBe('inkSpare');
    expect(praiseFor({ ...base, challenge: { kind: 'race', room: 100000, left: 60000, helped: false } }).kind).toBe('clockHalf');
    expect(praiseFor({ ...base, challenge: { kind: 'race', room: 100000, left: 5000, helped: false } }).kind).toBe('clock');
    expect(praiseFor({ ...base, challenge: { kind: 'race', room: 100000, left: 5000, helped: true } }).kind).toBe('fewHints');
  });

  test('a reopened puzzle (a second or two) is never called fast', () => {
    expect(praiseFor({ ...base, ms: 800 }).kind).toBe('clean');
  });

  test('the same puzzle always gets the same wording', () => {
    const options = ['a', 'b', 'c'];
    expect(pick(options, 'book-12-0')).toBe(pick(options, 'book-12-0'));
  });

  test('the words: every kind has some, and none is childish', () => {
    const all: string[] = [];
    for (const [kind, lines] of Object.entries(t.praise.lines)) {
      expect(lines.length).toBeGreaterThanOrEqual(2);
      for (const line of lines) all.push(typeof line === 'function' ? line('30 seconds') : line);
      expect(kind).toBeTruthy();
    }
    for (const line of all) {
      expect(line).not.toMatch(/!/);
      expect(line).not.toMatch(/awesome|amazing|super|wow|yay|genius|rockstar|woohoo|sweet|tasty|divine/i);
      expect(line.length).toBeLessThanOrEqual(60);
    }
  });
});
