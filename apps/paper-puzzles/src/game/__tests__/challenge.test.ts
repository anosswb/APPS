import { afterInk, afterRace, challengePuzzle, challengeSpec, freshChallenges, INK, inkDrops, proximity, RACE, raceExtraMs, raceLimitMs } from '../challenge';
import { countSolutions } from '../bruteforce';
import { TENT } from '../types';

describe('challenge modes', () => {
  test('a new player starts with a lot of room', () => {
    const c = freshChallenges();
    expect(c.race).toEqual({ level: 1, factor: RACE.start });
    expect(c.ink).toEqual({ level: 1, slack: INK.start });
    const spec = challengeSpec(1);
    // first race: 5 x 5 gentle, two and a half minutes
    expect(raceLimitMs(spec.n, spec.grade, c.race.factor)).toBe(150000);
  });

  test('a win moves on and tightens a little; a loss stays and loosens more', () => {
    const won = afterRace({ level: 3, factor: 2 }, true);
    expect(won.level).toBe(4);
    expect(won.factor).toBeCloseTo(1.84);
    const lost = afterRace({ level: 3, factor: 2 }, false);
    expect(lost.level).toBe(3);
    expect(lost.factor).toBeCloseTo(2.4);
    expect(afterInk({ level: 3, slack: 3 }, true)).toEqual({ level: 4, slack: 2 });
    expect(afterInk({ level: 3, slack: 3 }, false)).toEqual({ level: 3, slack: 5 });
  });

  test('a win with extra time or ink moves on but does not tighten', () => {
    expect(afterRace({ level: 3, factor: 2 }, true, true)).toEqual({ level: 4, factor: 2 });
    expect(afterInk({ level: 3, slack: 3 }, true, true)).toEqual({ level: 4, slack: 3 });
  });

  test('the room never leaves its limits', () => {
    let r: { level: number; factor: number } = { level: 1, factor: RACE.start };
    for (let i = 0; i < 50; i++) r = afterRace(r, true);
    expect(r.factor).toBe(RACE.min);
    for (let i = 0; i < 50; i++) r = afterRace(r, false);
    expect(r.factor).toBe(RACE.max);
    let k: { level: number; slack: number } = { level: 1, slack: INK.start };
    for (let i = 0; i < 50; i++) k = afterInk(k, true);
    expect(k.slack).toBe(INK.min);
    for (let i = 0; i < 50; i++) k = afterInk(k, false);
    expect(k.slack).toBe(INK.max);
  });

  test('the steps settle near two wins in three', () => {
    // A player who wins exactly when there is enough room ends up bouncing around their own limit.
    for (const need of [2, 3, 4]) {
      let k: { level: number; slack: number } = { level: 1, slack: INK.start };
      let wins = 0;
      const rounds = 300;
      for (let i = 0; i < rounds; i++) {
        const won = k.slack >= need;
        if (won) wins++;
        k = afterInk(k, won);
      }
      expect(wins / rounds).toBeGreaterThan(0.6);
      expect(wins / rounds).toBeLessThan(0.75);
    }
    let r: { level: number; factor: number } = { level: 1, factor: RACE.start };
    let wins = 0;
    for (let i = 0; i < 400; i++) {
      const won = r.factor >= 1.7;
      if (won) wins++;
      r = afterRace(r, won);
    }
    expect(wins / 400).toBeGreaterThan(0.6);
    expect(wins / 400).toBeLessThan(0.78);
  });

  test('the pot holds the tents plus the slack, so the puzzle can always be finished', () => {
    for (const level of [1, 5, 12, 30]) {
      const p = challengePuzzle('ink', level);
      const tents = p.solution.filter(Boolean).length;
      expect(inkDrops(tents, INK.min)).toBeGreaterThan(tents);
    }
  });

  test('challenge puzzles are their own puzzles, always the same, with one answer', () => {
    expect(challengePuzzle('race', 7)).toEqual(challengePuzzle('race', 7));
    expect(challengePuzzle('race', 7).trees).not.toEqual(challengePuzzle('ink', 7).trees);
    for (const kind of ['race', 'ink'] as const) {
      for (const level of [1, 4, 11, 15]) {
        const p = challengePuzzle(kind, level);
        expect(countSolutions(p, 2).count).toBe(1);
      }
    }
  });

  test('extra time is a quarter of the clock, at least half a minute', () => {
    expect(raceExtraMs(150000)).toBe(40000);
    expect(raceExtraMs(60000)).toBe(30000);
  });

  test('proximity is the share of tents in the right place', () => {
    const p = challengePuzzle('ink', 1);
    const marks = new Array(p.solution.length).fill(0);
    expect(proximity(p, marks, TENT)).toBe(0);
    const tents = p.solution.map((s, i) => (s ? i : -1)).filter((i) => i >= 0);
    marks[tents[0]] = TENT;
    expect(proximity(p, marks, TENT)).toBeCloseTo(1 / tents.length);
    for (const i of tents) marks[i] = TENT;
    expect(proximity(p, marks, TENT)).toBe(1);
  });
});
