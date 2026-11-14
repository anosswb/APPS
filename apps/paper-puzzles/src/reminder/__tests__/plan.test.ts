import { dateKey } from '../../game/daily';
import { planReminders, REMINDER_DAYS, shouldAsk } from '../plan';

const never = () => false;
// Saturday 14 Nov 2026
const at = (h: number, m = 0, d = 14) => new Date(2026, 10, d, h, m, 0, 0);

describe('daily reminder plan', () => {
  it('plans one note a day for a week, at the chosen hour', () => {
    const notes = planReminders(at(21), 'morning', never);
    expect(notes).toHaveLength(REMINDER_DAYS);
    expect(notes.map((n) => n.key)).toEqual(['2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21']);
    for (const n of notes) {
      expect(n.at.getHours()).toBe(8);
      expect(n.at.getMinutes()).toBe(0);
      expect(dateKey(n.at)).toBe(n.key);
    }
  });

  it('starts today when the hour is still ahead', () => {
    const notes = planReminders(at(6, 30), 'morning', never);
    expect(notes[0].key).toBe('2026-11-14');
    expect(notes).toHaveLength(REMINDER_DAYS);
  });

  it('skips today when the hour has passed, or is less than a minute away', () => {
    expect(planReminders(at(8, 0), 'morning', never)[0].key).toBe('2026-11-15');
    expect(planReminders(new Date(2026, 10, 14, 7, 59, 30), 'morning', never)[0].key).toBe('2026-11-15');
    expect(planReminders(at(7, 58), 'morning', never)[0].key).toBe('2026-11-14');
  });

  it('gives no note for a day that is already solved', () => {
    const notes = planReminders(at(6), 'evening', (key) => key === '2026-11-14');
    expect(notes[0].key).toBe('2026-11-15');
    expect(notes.every((n) => n.at.getHours() === 19)).toBe(true);
  });

  it('never plans a note in the past and never two for one day', () => {
    for (let h = 0; h < 24; h++) {
      const now = at(h, 17);
      for (const time of ['morning', 'noon', 'evening'] as const) {
        const notes = planReminders(now, time, never);
        expect(notes.every((n) => n.at.getTime() > now.getTime())).toBe(true);
        expect(new Set(notes.map((n) => n.key)).size).toBe(notes.length);
      }
    }
  });

  it('keeps the same clock hour across the US clock change (1 Nov 2026 and 14 Mar 2027)', () => {
    for (const now of [new Date(2026, 9, 29, 22), new Date(2027, 2, 11, 22)]) {
      const notes = planReminders(now, 'morning', never);
      expect(notes).toHaveLength(REMINDER_DAYS);
      expect(notes.every((n) => n.at.getHours() === 8)).toBe(true);
    }
  });

  it('says how big each puzzle is: small on Monday, big on Sunday', () => {
    const notes = planReminders(at(21), 'morning', never);
    expect(notes[0]).toMatchObject({ key: '2026-11-15', n: 10, grade: 'hard' }); // Sunday
    expect(notes[1]).toMatchObject({ key: '2026-11-16', n: 6, grade: 'easy' }); // Monday
  });

  it('asks once, after a solved daily puzzle, and never where notes do not work', () => {
    const fresh = { on: false, time: 'morning' as const, asked: false };
    expect(shouldAsk(fresh, true, true)).toBe(true);
    expect(shouldAsk(fresh, true, false)).toBe(false);
    expect(shouldAsk(fresh, false, true)).toBe(false);
    expect(shouldAsk({ ...fresh, asked: true }, true, true)).toBe(false);
    expect(shouldAsk({ ...fresh, on: true }, true, true)).toBe(false);
  });
});
