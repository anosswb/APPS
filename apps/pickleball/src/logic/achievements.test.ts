import { AWARDS, evaluate, newlyEarned } from './achievements';
import { game, session } from './fixtures';

const MIN = 60000;
const at = (d: number, h: number, m = 0) => new Date(2026, 10, d, h, m).getTime(); // November 2026; 21 = Saturday

describe('the 20 host awards', () => {
  it('there are 20 with unique ids', () => {
    expect(new Set(AWARDS.map((a) => a.id)).size).toBe(20);
  });
  it('nothing is earned with no games', () => {
    const st = evaluate([]);
    expect(AWARDS.every((a) => !st[a.id].earned)).toBe(true);
    expect(st.regular.progress).toBe(0);
  });
  it('awards belong to the host: no player names are kept', () => {
    const st = evaluate([session('s', at(22, 10), [game(['Dana', 'Marcus'], ['Priya', 'Ted'], [11, 0], at(22, 10), 9)])]);
    expect(st.pickled).toEqual({ earned: true, at: at(22, 10, 9), progress: undefined });
    expect(JSON.stringify(st)).not.toContain('Dana');
  });
  it('games you scored: first game, pickled, comeback, win by two', () => {
    const st = evaluate([
      session('s', at(22, 10), [
        game(['Dana', 'Marcus'], ['Priya', 'Ted'], [11, 0], at(22, 10), 9),
        game(['Raj', 'Beth'], ['Lou', 'Kim'], [12, 10], at(22, 10, 20), 24, { maxDeficit: 6 }),
      ]),
    ]);
    for (const id of ['first-dink', 'host', 'pickled', 'comeback', 'win-by-two'] as const) expect(st[id].earned).toBe(true);
  });
  it('an unscored game gives no score awards', () => {
    const st = evaluate([session('s', at(22, 10), [game(['A', 'B'], ['C', 'D'], [0, 0], at(22, 10), 1)])]);
    expect(st['first-dink'].earned).toBe(true);
    expect(st.pickled.earned || st['win-by-two'].earned).toBe(false);
  });
  it('a busy session: 10 games, 6 in an hour, 2 hours long, 16 players', () => {
    const many = Array.from({ length: 16 }, (_, i) => `P${i}`);
    const games = Array.from({ length: 10 }, (_, i) => game(['A', 'B'], ['C', 'D'], [11, 5], at(22, 9) + i * 9 * MIN, 9));
    games.push(game(['A', 'B'], ['C', 'D'], [11, 5], at(22, 11), 10));
    const st = evaluate([session('s', at(22, 9), games, many)]);
    for (const id of ['iron-paddle', 'quick-kill', 'marathon', 'full-house'] as const) expect(st[id].earned).toBe(true);
  });
  it('slow games are no fast lane, and progress shows the best hour', () => {
    const games = Array.from({ length: 4 }, (_, i) => game(['A', 'B'], ['C', 'D'], [11, 5], at(22, 9) + i * 30 * MIN, 25));
    const st = evaluate([session('s', at(22, 9), games)]);
    expect(st['quick-kill']).toMatchObject({ earned: false, progress: 2 });
  });
  it('different players over time count once each, by name', () => {
    const sessions = [
      session('1', at(20, 10), [game(['A', 'B'], ['C', 'D'], [11, 3], at(20, 10), 12)], Array.from({ length: 30 }, (_, i) => `P${i}`)),
      session('2', at(23, 10), [game(['A', 'B'], ['C', 'D'], [11, 3], at(23, 10), 12)], Array.from({ length: 30 }, (_, i) => `p${i + 20}`)),
    ];
    expect(evaluate(sessions)['social-butterfly']).toMatchObject({ earned: true, progress: 50 });
  });
  it('days in a row, weekend, early bird, night owl, four courts', () => {
    const one = (d: number, h: number, extra = {}) => session(`s${d}`, at(d, h), [game(['A', 'B'], ['C', 'D'], [11, 3], at(d, h), 12, extra)]);
    const st = evaluate([one(21, 7, { court: 3 }), one(22, 19), one(23, 10)]);
    for (const id of ['hot-streak', 'weekend-warrior', 'early-bird', 'night-owl', 'four-courts'] as const) expect(st[id].earned).toBe(true);
    expect(st.regular).toMatchObject({ earned: false, progress: 3 });
  });
  it('two days in a row is not yet a streak', () => {
    const one = (d: number) => session(`s${d}`, at(d, 10), [game(['A', 'B'], ['C', 'D'], [11, 3], at(d, 10), 12)]);
    expect(evaluate([one(23), one(24)])['hot-streak']).toMatchObject({ earned: false, progress: 2 });
  });
  it('totals: 100 games, 500 points, 5 sessions', () => {
    const sessions = Array.from({ length: 5 }, (_, d) =>
      session(`s${d}`, at(10 + d * 2, 10), Array.from({ length: 20 }, (_, i) => game(['A', 'B'], ['C', 'D'], [11, 3], at(10 + d * 2, 10) + i * 15 * MIN, 12))),
    );
    const st = evaluate(sessions);
    expect(st.century).toMatchObject({ earned: true, progress: 100 });
    expect(st['on-fire']).toMatchObject({ earned: true, progress: 500 });
    expect(st.regular.earned).toBe(true);
    expect(st['golden-paddle']).toMatchObject({ earned: false, progress: 5 });
  });
  it('newly earned compares with what was already shown', () => {
    const st = evaluate([session('s', at(22, 10), [game(['A', 'B'], ['C', 'D'], [11, 0], at(22, 10), 9)])]);
    expect(newlyEarned(st, ['first-dink', 'host'])).toEqual(['pickled']);
  });
});
