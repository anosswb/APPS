jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn() }));
import { parseSaved, SCHEMA } from './storage';
import { addPlayer, newSession } from '../logic/session';

describe('saved data', () => {
  it('nothing saved gives a fresh session', () => {
    expect(parseSaved(null).session.queue).toEqual([]);
  });
  it('reads back what was saved', () => {
    const s = addPlayer(newSession(), 'Dana', 1);
    const out = parseSaved(JSON.stringify({ v: SCHEMA, session: s, prefs: { haptics: false, keepAwake: true } }));
    expect(out.session.players.p1.name).toBe('Dana');
    expect(out.prefs.haptics).toBe(false);
    expect(out.problem).toBeUndefined();
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
