import { freshSave, migrate, SCHEMA } from '../save';

describe('reading a save', () => {
  test('nothing stored gives a fresh save', () => {
    expect(migrate(null)).toEqual(freshSave());
    expect(migrate('garbage')).toEqual(freshSave());
    expect(migrate([])).toEqual(freshSave());
  });

  test('a good save comes back unchanged', () => {
    const s = freshSave();
    s.book = { level: 14, relief: 1, solved: 13 };
    s.daily['2026-11-13'] = { ms: 200000, hints: 1 };
    s.games['book-14-1'] = { marks: [0, 1, 2, 0], ms: 5000, hints: 0 };
    s.settings.theme = 'dark';
    s.seenRules = true;
    expect(migrate(JSON.parse(JSON.stringify(s)))).toEqual(s);
  });

  test('missing parts are filled in and progress is kept', () => {
    const out = migrate({ book: { level: 7 } });
    expect(out.book).toEqual({ level: 7, relief: 0, solved: 0 });
    expect(out.settings).toEqual(freshSave().settings);
    expect(out.schema).toBe(SCHEMA);
  });

  test('broken pieces are dropped, the rest survives', () => {
    const out = migrate({
      book: { level: -3, relief: 99, solved: 4 },
      settings: { theme: 'pink', haptics: 'yes' },
      games: { a: { marks: [0, 9] }, b: { marks: [0, 2, 1], ms: 10, hints: 2 } },
      daily: { '2026-11-13': { ms: 'long' }, '2026-11-12': { ms: 1, hints: 0 } },
    });
    expect(out.book).toEqual({ level: 1, relief: 2, solved: 4 });
    expect(out.settings).toEqual(freshSave().settings);
    expect(Object.keys(out.games)).toEqual(['b']);
    expect(Object.keys(out.daily)).toEqual(['2026-11-12']);
  });
});
