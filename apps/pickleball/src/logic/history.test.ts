import { allSessions, clock, gamesIn, stats, toRecord } from './history';
import { addPlayer, DEFAULT_SETTINGS, fillCourts, finishGame, newSession, scoreRally } from './session';
import { maxDeficit, DEFAULT_RULES, Team } from './scoring';

import { game, session } from './fixtures';

const MIN = 60000;

describe('comeback depth', () => {
  it('counts the biggest lead the other side had', () => {
    const rally = { ...DEFAULT_RULES, type: 'rally' as const };
    const r: Team[] = [...Array(6).fill('B'), ...Array(11).fill('A')];
    expect(maxDeficit(r, rally, 'A', 'A')).toBe(6);
    expect(maxDeficit(r, rally, 'A', 'B')).toBe(5); // B ends 6-11
  });
});

describe('a session becomes a record with names, length and score', () => {
  it('keeps everything the History screen needs', () => {
    let s = newSession({ ...DEFAULT_SETTINGS, courts: 1, scoring: { ...DEFAULT_RULES, type: 'rally' } }, 1000);
    for (const n of ['Dana', 'Marcus', 'Priya', 'Ted']) s = addPlayer(s, n, 1000);
    s = fillCourts(s, 2000);
    for (let i = 0; i < 11; i++) s = scoreRally(s, 0, 'A');
    s = finishGame(s, 0, 'A', 2000 + 14 * MIN);
    const rec = toRecord(s)!;
    expect(rec.startedAt).toBe(2000);
    expect(rec.games[0]).toMatchObject({ score: [11, 0], startedAt: 2000, target: 11 });
    expect(rec.games[0].winners.sort()).toEqual(['Dana', 'Marcus']);
    expect(toRecord(newSession())).toBeNull();
  });
  it('the running session is added once to the past ones', () => {
    let s = newSession(DEFAULT_SETTINGS, 5);
    for (const n of ['A', 'B', 'C', 'D']) s = addPlayer(s, n, 5);
    s = finishGame(fillCourts(s, 6), 0, 'A', 7);
    const past = [session('old', 0, [game(['x', 'y'], ['z', 'w'], [11, 3], 0, 10)]), toRecord(s)!];
    expect(allSessions(past, s).map((x) => x.id)).toEqual(['old', s.id]);
  });
});

describe('stats', () => {
  const day = new Date(2026, 10, 22, 10).getTime();
  const games = [
    game(['Dana', 'Marcus'], ['Priya', 'Ted'], [11, 7], day, 16),
    game(['Raj', 'Beth'], ['Lou', 'Kim'], [11, 9], day + 20 * MIN, 22),
    game(['Dana', 'Priya'], ['Raj', 'Ted'], [11, 4], day + 50 * MIN, 10),
  ];
  it('games, average, longest, shortest and players', () => {
    const st = stats(games);
    expect(st).toMatchObject({ games: 3, longestMs: 22 * MIN, shortestMs: 10 * MIN, players: 8, minutes: [16, 22, 10] });
    expect(st.avgMs).toBe(16 * MIN);
    expect(st.table[0]).toEqual({ name: 'Dana', games: 2, wins: 2 });
  });
  it('today, this week and all time', () => {
    const old = game(['A', 'B'], ['C', 'D'], [11, 2], day - 30 * 24 * 60 * MIN, 12);
    const all = [session('s1', old.startedAt, [old]), session('s2', day, games)];
    expect(gamesIn(all, 'today', day + 3 * 60 * MIN)).toHaveLength(3);
    expect(gamesIn(all, 'week', day)).toHaveLength(3);
    expect(gamesIn(all, 'all', day)).toHaveLength(4);
  });
  it('empty is all zeros', () => {
    expect(stats([])).toMatchObject({ games: 0, avgMs: 0, longestMs: 0, players: 0 });
  });
  it('clock', () => {
    expect(clock(14 * MIN + 32000)).toBe('14:32');
    expect(clock(62 * MIN + 10000)).toBe('1:02:10');
    expect(clock(0)).toBe('0:00');
  });
});
