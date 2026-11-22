jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn() }));
import { DEFAULT_PREFS, emptyHistory, parseHistory, parseSaved, SCHEMA, withPhoto, withPlace } from './storage';
import { addPlayer, fillCourts, newSession } from '../logic/session';

describe('saved data', () => {
  it('nothing saved gives a fresh session', () => {
    expect(parseSaved(null).session.queue).toEqual([]);
  });
  it('reads back what was saved', () => {
    const s = addPlayer(newSession(), 'Dana', 1);
    const out = parseSaved(JSON.stringify({ v: SCHEMA, session: s, prefs: { haptics: false, keepAwake: true } }));
    expect(out.session.players.p1.name).toBe('Dana');
    expect(out.prefs).toEqual({ ...DEFAULT_PREFS, haptics: false });
    expect(out.problem).toBeUndefined();
  });
  it('a version 1 save is upgraded, not lost', () => {
    const old = addPlayer(newSession(), 'Dana', 1) as unknown as Record<string, unknown>;
    delete old.id;
    delete old.startedAt;
    (old as { results: unknown[] }).results = [{ court: 0, winners: ['p1', 'p2'], losers: ['p3', 'p4'], score: [11, 4], endedAt: 500 }];
    const out = parseSaved(JSON.stringify({ v: 1, session: old, prefs: {} }));
    expect(out.problem).toBeUndefined();
    expect(out.session.players.p1.name).toBe('Dana');
    expect(out.session.results[0]).toMatchObject({ startedAt: 500, target: 11, maxDeficit: 0 });
    expect(out.session.startedAt).toBe(500);
    expect(typeof out.session.id).toBe('string');
  });
  it('the old look choice is dropped: dark or light follows the phone', () => {
    const old = parseSaved(JSON.stringify({ v: SCHEMA, session: newSession(), prefs: { theme: 'light', lookV: 2, voice: false } }));
    expect(old.prefs).toEqual({ ...DEFAULT_PREFS, voice: false });
  });
  it('a version 2 save keeps its running games, counted as started', () => {
    let s = newSession();
    for (const n of ['A', 'B', 'C', 'D']) s = addPlayer(s, n, 0);
    s = fillCourts(s, 100);
    const old = JSON.parse(JSON.stringify(s));
    delete old.courts[0].started;
    const out = parseSaved(JSON.stringify({ v: 2, session: old, prefs: {} }));
    expect(out.problem).toBeUndefined();
    expect(out.session.courts[0]).toMatchObject({ started: true, startedAt: 100 });
  });
  it('broken text gives a fresh session and a reason', () => {
    const out = parseSaved('{oops');
    expect(out.session.queue).toEqual([]);
    expect(out.problem).toMatch(/unreadable/);
  });
  it('a future version is not trusted', () => {
    expect(parseSaved(JSON.stringify({ v: 99, session: newSession() })).problem).toMatch(/version/);
  });
});

describe('saved history', () => {
  it('starts with the two default goals', () => {
    expect(parseHistory(null, 0).history.goals).toHaveLength(2);
  });
  it('reads back sessions and seen awards', () => {
    const h = parseHistory(JSON.stringify({ v: 1, sessions: [{ id: 'a', startedAt: 0, endedAt: 1, players: [], games: [] }], goals: [], seen: ['host'] }), 0).history;
    expect(h.sessions).toHaveLength(1);
    expect(h.seen).toEqual(['host']);
  });
  it('an older history without places and photos still loads', () => {
    const h = parseHistory(JSON.stringify({ v: 1, sessions: [], goals: [], seen: [] }), 0).history;
    expect(h.meta).toEqual({});
    expect(h.places).toEqual([]);
  });
  it('places are remembered newest first, once, trimmed', () => {
    let h = withPlace(emptyHistory(0), 's1', '  Riverside   Park ');
    h = withPlace(h, 's2', 'Oak Courts');
    h = withPlace(h, 's3', 'riverside park');
    expect(h.places).toEqual(['riverside park', 'Oak Courts']);
    expect(h.meta.s1.place).toBe('Riverside Park');
    h = withPhoto(h, 's1', 'file:///p.jpg');
    expect(h.meta.s1).toEqual({ place: 'Riverside Park', photo: 'file:///p.jpg' });
    expect(withPlace(h, 's1', '   ').meta.s1.place).toBeUndefined();
  });
  it('broken history gives an empty one and a reason', () => {
    expect(parseHistory('nope', 0).problem).toMatch(/unreadable/);
  });
});
