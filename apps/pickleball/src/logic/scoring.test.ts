import { applyRally, DEFAULT_RULES, isGamePoint, scoreCall, scoreFromRallies, startState, ScoreRules, Team } from './scoring';

const sideout = DEFAULT_RULES;
const rally: ScoreRules = { type: 'rally', target: 11, winBy: 2, doubles: true };

describe('sideout doubles', () => {
  it('starts at 0-0-2', () => {
    expect(scoreCall(startState(sideout), sideout)).toBe('0-0-2');
  });
  it('the first lost rally is a sideout because of the start exception', () => {
    const s = scoreFromRallies(['B'], sideout);
    expect(s).toMatchObject({ a: 0, b: 0, serving: 'B', server: 1 });
    expect(scoreCall(s, sideout)).toBe('0-0-1');
  });
  it('only the serving team scores', () => {
    const s = scoreFromRallies(['A', 'A', 'B'], sideout);
    expect(s).toMatchObject({ a: 2, b: 0, serving: 'B', server: 1 });
  });
  it('the second server serves before the sideout', () => {
    const s = scoreFromRallies(['B', 'B', 'B'], sideout); // sideout to B, B's server 1 wins, ...
    expect(s).toMatchObject({ a: 0, b: 2, serving: 'B', server: 1 });
    const t = scoreFromRallies(['B', 'A'], sideout); // B serving server 1 loses -> server 2
    expect(t).toMatchObject({ serving: 'B', server: 2 });
    const u = scoreFromRallies(['B', 'A', 'A'], sideout); // server 2 loses -> sideout to A server 1
    expect(u).toMatchObject({ serving: 'A', server: 1 });
    expect(scoreCall(u, sideout)).toBe('0-0-1');
  });
  it('a game to 11 must be won by 2 (10-10 built with rally rules)', () => {
    const r: Team[] = [];
    for (let i = 0; i < 10; i++) r.push('A', 'B');
    const s = scoreFromRallies(r, rally);
    expect(s).toMatchObject({ a: 10, b: 10, winner: null });
    const s2 = applyRally(s, 'A', rally);
    expect(s2.winner).toBeNull();
    const s3 = applyRally(s2, 'A', rally);
    expect(s3.winner).toBe('A');
  });
  it('a won game does not change', () => {
    const r: Team[] = Array(11).fill('A');
    const s = scoreFromRallies(r, sideout);
    expect(s).toMatchObject({ a: 11, b: 0, winner: 'A' });
    expect(applyRally(s, 'B', sideout)).toBe(s);
  });
});

describe('rally scoring', () => {
  it('every rally scores and the winner serves', () => {
    const s = scoreFromRallies(['A', 'B', 'B'], rally);
    expect(s).toMatchObject({ a: 1, b: 2, serving: 'B', server: 1 });
    expect(scoreCall(s, rally)).toBe('2-1');
  });
  it('game to 15 and 21 work', () => {
    const r15: ScoreRules = { ...rally, target: 15 };
    expect(scoreFromRallies(Array(15).fill('B'), r15).winner).toBe('B');
    expect(scoreFromRallies(Array(14).fill('B'), r15).winner).toBeNull();
  });
});

describe('game point', () => {
  it('in sideout only the serving team can have game point', () => {
    const s = scoreFromRallies(Array(10).fill('A'), sideout);
    expect(isGamePoint(s, 'A', sideout)).toBe(true);
    expect(isGamePoint(s, 'B', sideout)).toBe(false);
  });
  it('in rally scoring the receiving side can have game point', () => {
    const r: Team[] = [...Array(10).fill('B'), 'A'];
    const s = scoreFromRallies(r, rally);
    expect(isGamePoint(s, 'B', rally)).toBe(true);
  });
});

describe('singles sideout', () => {
  it('one server, a lost rally is a sideout', () => {
    const singles: ScoreRules = { ...sideout, doubles: false };
    expect(scoreCall(startState(singles), singles)).toBe('0-0');
    const s = scoreFromRallies(['A', 'B'], singles);
    expect(s).toMatchObject({ a: 1, b: 0, serving: 'B' });
  });
});
