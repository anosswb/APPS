import { AWARDS, evaluate, newlyEarned } from './achievements';
import { game, session } from './fixtures';

const MIN = 60000;
const at = (d: number, h: number, m = 0) => new Date(2026, 10, d, h, m).getTime(); // November 2026; 21 = Saturday

describe('the 20 awards', () => {
  it('there are 20 with unique ids', () => {
    expect(new Set(AWARDS.map((a) => a.id)).size).toBe(20);
  });
  it('nothing is earned with no games', () => {
    const st = evaluate([]);
    expect(AWARDS.every((a) => !st[a.id].earned)).toBe(true);
    expect(st.regular.progress).toBe(0);
  });
  it('game awards: pickled, comeback, marathon, quick kill, win by two, first dink', () => {
    const st = evaluate([
      session('s', at(22, 10), [
        game(['Dana', 'Marcus'], ['Priya', 'Ted'], [11, 0], at(22, 10), 9),
        game(['Raj', 'Beth'], ['Lou', 'Kim'], [12, 10], at(22, 10, 20), 24, { maxDeficit: 6 }),
        game(['Sam', 'Ana'], ['Joe', 'Mei'], [11, 6], at(22, 11), 6),
      ]),
    ]);
    expect(st.pickled.by.sort()).toEqual(['Dana', 'Marcus']);
    expect(st.comeback.by.sort()).toEqual(['Beth', 'Raj']);
    expect(st['win-by-two'].earned).toBe(true);
    expect(st.marathon.by).toHaveLength(4);
    expect(st['quick-kill'].by.sort()).toEqual(['Ana', 'Sam']);
    expect(st['first-dink'].by).toHaveLength(12);
  });
  it('an unscored game gives no score awards and a 1-minute game is no quick kill', () => {
    const st = evaluate([session('s', at(22, 10), [game(['A', 'B'], ['C', 'D'], [0, 0], at(22, 10), 1)])]);
    expect(st.pickled.earned || st['win-by-two'].earned || st['quick-kill'].earned).toBe(false);
  });
  it('streaks, iron paddle, golden paddle and social butterfly', () => {
    const games = [];
    const others = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
    for (let i = 0; i < 10; i++) games.push(game(['Dana', others[i % others.length]], ['X', 'Y'], [11, 5], at(22, 9) + i * 15 * MIN, 12));
    const st = evaluate([session('s', at(22, 9), games)]);
    expect(st['hot-streak'].by).toContain('Dana');
    expect(st['on-fire'].by).toContain('Dana');
    expect(st['iron-paddle'].by).toEqual(expect.arrayContaining(['Dana', 'X', 'Y']));
    expect(st['golden-paddle'].by).toEqual(['Dana']);
    expect(st['social-butterfly'].by).toContain('Dana');
    expect(st['social-butterfly'].by).not.toContain('X');
  });
  it('host awards: host, regular, early bird, night owl, four courts, full house, weekend warrior, century', () => {
    const many = Array.from({ length: 16 }, (_, i) => `P${i}`);
    const sessions = [
      session('sat', at(21, 7), [game(['A', 'B'], ['C', 'D'], [11, 3], at(21, 7), 12, { court: 3 })], many),
      session('sun', at(22, 19), [game(['A', 'B'], ['C', 'D'], [11, 3], at(22, 19), 12)]),
      session('3', at(23, 10), [game(['A', 'B'], ['C', 'D'], [11, 3], at(23, 10), 12)]),
      session('4', at(24, 10), [game(['A', 'B'], ['C', 'D'], [11, 3], at(24, 10), 12)]),
    ];
    let st = evaluate(sessions);
    expect(st.host.earned).toBe(true);
    expect(st.regular).toMatchObject({ earned: false, progress: 4 });
    for (const id of ['early-bird', 'night-owl', 'four-courts', 'full-house', 'weekend-warrior'] as const) expect(st[id].earned).toBe(true);
    sessions.push(session('5', at(25, 10), Array.from({ length: 96 }, (_, i) => game(['A', 'B'], ['C', 'D'], [11, 3], at(25, 10) + i * MIN, 1))));
    st = evaluate(sessions);
    expect(st.regular.earned).toBe(true);
    expect(st.century).toMatchObject({ earned: true, progress: 100 });
  });
  it('newly earned compares with what was already shown', () => {
    const st = evaluate([session('s', at(22, 10), [game(['A', 'B'], ['C', 'D'], [11, 0], at(22, 10), 9)])]);
    expect(newlyEarned(st, ['first-dink', 'host'])).toEqual(['pickled']);
  });
});
