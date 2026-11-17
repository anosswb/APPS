jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn(() => Promise.resolve()) }));
jest.mock('expo-notifications', () => ({ setNotificationHandler: jest.fn() }));
import { planNotes } from '../../notify';
import { FRESH, Saved } from '../../store';

const base: Saved = { ...FRESH, remind: { lunch: true, twoLeft: true }, shift: { start: 6 * 60, end: 18 * 60 } };
const hm = (d: Date) => `${d.getDate()} ${d.getHours()}:${`${d.getMinutes()}`.padStart(2, '0')}`;

describe('work-day notes', () => {
  test('a 6 AM – 6 PM day: lunch at 12:00, "2 hours to go" at 4:00 PM', () => {
    const d = { ...base, book: { '2026-11-18': { kind: 'work' as const, start: 0, end: 0 } } };
    const n = planNotes(d, new Date(2026, 10, 18, 5, 0));
    expect(n.map((x) => [hm(x.when), x.title])).toEqual([['18 12:00', 'Lunch'], ['18 16:00', '2 hours to go']]);
  });

  test('notes already past are not scheduled', () => {
    const d = { ...base, book: { '2026-11-18': { kind: 'work' as const, start: 0, end: 0 } } };
    expect(planNotes(d, new Date(2026, 10, 18, 13, 0)).map((x) => x.title)).toEqual(['2 hours to go']);
  });

  test('a night shift 6 PM – 6 AM that started yesterday still gets its 4 AM note after midnight', () => {
    const d = { ...base, shift: { start: 18 * 60, end: 6 * 60 }, book: { '2026-11-17': { kind: 'work' as const, start: 0, end: 0 } } };
    expect(planNotes(d, new Date(2026, 10, 18, 1, 0)).map((x) => [hm(x.when), x.title])).toEqual([['18 4:00', '2 hours to go']]);
  });

  test('nothing when both switches are off, and nothing on rest days', () => {
    expect(planNotes({ ...base, remind: { lunch: false, twoLeft: false }, book: { '2026-11-18': { kind: 'work', start: 0, end: 0 } } }, new Date(2026, 10, 18, 5))).toEqual([]);
    expect(planNotes({ ...base, book: { '2026-11-18': { kind: 'rest' } } }, new Date(2026, 10, 18, 5))).toEqual([]);
  });
});
