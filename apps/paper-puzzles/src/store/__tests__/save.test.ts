import { freshSave, migrate, SCHEMA } from '../save';

const NOW = 1_800_000_000_000;

describe('reading a save', () => {
  test('nothing stored gives a fresh save', () => {
    expect(migrate(null, NOW)).toEqual(freshSave(NOW));
    expect(migrate('garbage', NOW)).toEqual(freshSave(NOW));
    expect(migrate([], NOW)).toEqual(freshSave(NOW));
  });

  test('a good save comes back unchanged', () => {
    const s = freshSave(NOW);
    s.book = { level: 14, relief: 1, solved: 13 };
    s.daily['2026-11-13'] = { ms: 200000, hints: 1 };
    s.games['book-14-1'] = { marks: [0, 1, 2, 0], ms: 5000, hints: 0 };
    s.settings.theme = 'dark';
    s.seenRules = true;
    expect(migrate(JSON.parse(JSON.stringify(s)), NOW)).toEqual(s);
  });

  test('missing parts are filled in and progress is kept', () => {
    const out = migrate({ book: { level: 7 } }, NOW);
    expect(out.book).toEqual({ level: 7, relief: 0, solved: 0 });
    expect(out.settings).toEqual(freshSave(NOW).settings);
    expect(out.schema).toBe(SCHEMA);
  });

  test('a version 1 save (before the sound switch) keeps everything and gets sound on', () => {
    const v1 = {
      schema: 1,
      settings: { theme: 'dark', haptics: false },
      book: { level: 22, relief: 0, solved: 21 },
      daily: { '2026-11-13': { ms: 90000, hints: 0 } },
      games: {},
      seenRules: true,
    };
    const out = migrate(v1, NOW);
    expect(out.schema).toBe(SCHEMA);
    expect(out.settings).toEqual({ theme: 'dark', haptics: false, sound: true });
    expect(out.book.level).toBe(22);
    expect(out.daily['2026-11-13']).toEqual({ ms: 90000, hints: 0 });
    expect(out.seenRules).toBe(true);
  });

  test('reading a save never changes the defaults for the next one', () => {
    migrate({ book: { level: 50 }, settings: { theme: 'dark' } });
    expect(freshSave(NOW).book.level).toBe(1);
    expect(freshSave(NOW).settings.theme).toBe('system');
  });

  test('broken pieces are dropped, the rest survives', () => {
    const out = migrate(
      {
      book: { level: -3, relief: 99, solved: 4 },
      settings: { theme: 'pink', haptics: 'yes' },
      games: { a: { marks: [0, 9] }, b: { marks: [0, 2, 1], ms: 10, hints: 2 } },
      daily: { '2026-11-13': { ms: 'long' }, '2026-11-12': { ms: 1, hints: 0 } },
      money: { fullEdition: 'yes', unlockedDays: ['2026-11-02', 7, 'soon'], lastAdAt: -5 },
      },
      NOW,
    );
    expect(out.book).toEqual({ level: 1, relief: 2, solved: 4 });
    expect(out.settings).toEqual(freshSave(NOW).settings);
    expect(Object.keys(out.games)).toEqual(['b']);
    expect(Object.keys(out.daily)).toEqual(['2026-11-12']);
    expect(out.money).toEqual({ fullEdition: false, unlockedDays: ['2026-11-02'], lastAdAt: 0, firstOpenAt: NOW });
  });

  test('a version 2 save (before money) keeps everything; the ad-free start counts from the update', () => {
    const v2 = { schema: 2, settings: { theme: 'light', haptics: true, sound: false }, book: { level: 40, relief: 1, solved: 39 }, daily: {}, games: {}, seenRules: true };
    const out = migrate(v2, NOW);
    expect(out.book.level).toBe(40);
    expect(out.settings.sound).toBe(false);
    expect(out.money).toEqual({ fullEdition: false, unlockedDays: [], lastAdAt: 0, firstOpenAt: NOW });
  });

  test('a purchase and opened days survive a reload', () => {
    const s = freshSave(NOW);
    s.money = { fullEdition: true, unlockedDays: ['2026-11-02', '2026-11-03'], lastAdAt: 123, firstOpenAt: 99 };
    expect(migrate(JSON.parse(JSON.stringify(s)), NOW).money).toEqual(s.money);
  });
});
