import {
  canOpenCourt, canRemoveCourt, addPlayer, bestTeams, cancelGame, checkIn, checkOut, counts, DEFAULT_SETTINGS, fillCourts, finishGame,
  beginGame, gamesToWait, moveUp, newSession, removePlayer, renamePlayer, restartSession, scoreRally, Session, setCourtCount, undoRally,
} from './session';

function withPlayers(n: number, settings = DEFAULT_SETTINGS): Session {
  let s = newSession(settings);
  for (let i = 1; i <= n; i++) s = addPlayer(s, `P${i}`, 0);
  return s;
}
const names = (s: Session, ids: string[]) => ids.map((id) => s.players[id].name);

describe('the line', () => {
  it('adds players at the end and trims names', () => {
    let s = addPlayer(newSession(), '  Dana   Lee ', 0);
    s = addPlayer(s, 'Sam', 0);
    expect(names(s, s.queue)).toEqual(['Dana Lee', 'Sam']);
  });
  it('ignores empty names and duplicate names', () => {
    let s = addPlayer(newSession(), '   ', 0);
    s = addPlayer(s, 'Sam', 0);
    s = addPlayer(s, 'sam', 0);
    expect(s.queue).toHaveLength(1);
  });
  it('a known resting name is checked back in at the end', () => {
    let s = withPlayers(3);
    s = checkOut(s, 'p1');
    expect(names(s, s.queue)).toEqual(['P2', 'P3']);
    s = addPlayer(s, 'p1', 5);
    expect(names(s, s.queue)).toEqual(['P2', 'P3', 'P1']);
    expect(s.players.p1.waitingSince).toBe(5);
  });
  it('moveUp swaps with the player in front', () => {
    const s = moveUp(withPlayers(3), 'p3');
    expect(names(s, s.queue)).toEqual(['P1', 'P3', 'P2']);
    expect(moveUp(s, 'p1')).toBe(s);
  });
  it('remove and rename', () => {
    let s = removePlayer(withPlayers(3), 'p2');
    expect(names(s, s.queue)).toEqual(['P1', 'P3']);
    s = renamePlayer(s, 'p1', 'Alex');
    expect(s.players.p1.name).toBe('Alex');
    expect(renamePlayer(s, 'p3', 'alex')).toBe(s); // name taken
  });
  it('gamesToWait counts groups of four', () => {
    const s = withPlayers(9);
    expect(gamesToWait(s, 'p1')).toBe(0);
    expect(gamesToWait(s, 'p5')).toBe(1);
    expect(gamesToWait(s, 'p9')).toBe(2);
  });
});

describe('filling courts', () => {
  it('puts the first four on court 1, the next four on court 2', () => {
    const s = fillCourts(withPlayers(9), 0);
    expect(s.courts[0]).not.toBeNull();
    expect(s.courts[1]).not.toBeNull();
    expect(names(s, s.queue)).toEqual(['P9']);
    expect(counts(s)).toEqual({ waiting: 1, playing: 8, resting: 0 });
  });
  it('needs four players for a court', () => {
    const s = fillCourts(withPlayers(3), 0);
    expect(s.courts[0]).toBeNull();
  });
  it('picks partners who have not played together', () => {
    const teams = bestTeams(['a', 'b', 'c', 'd'], { 'a|b': 1, 'c|d': 1 });
    expect(teams.teamA).toEqual(['a', 'c']);
    expect(teams.teamB).toEqual(['b', 'd']);
  });
});

describe('all off (the paddle stack)', () => {
  it('all four go to the back and the next four come on', () => {
    let s = fillCourts(withPlayers(8, { ...DEFAULT_SETTINGS, courts: 1 }), 0);
    expect(names(s, s.queue)).toEqual(['P5', 'P6', 'P7', 'P8']);
    s = finishGame(s, 0, 'A', 10);
    const onCourt = s.courts[0]!;
    expect(names(s, [...onCourt.teamA, ...onCourt.teamB]).sort()).toEqual(['P5', 'P6', 'P7', 'P8']);
    expect(s.queue).toHaveLength(4);
    expect(s.players.p1).toMatchObject({ games: 1, wins: 1, status: 'waiting', waitingSince: 10 });
    expect(s.players.p3).toMatchObject({ games: 1, wins: 0 });
  });
  it('a player who checks out on court rests after the game', () => {
    let s = fillCourts(withPlayers(8, { ...DEFAULT_SETTINGS, courts: 1 }), 0);
    s = checkOut(s, 'p2');
    expect(s.players.p2).toMatchObject({ status: 'playing', leaving: true });
    s = finishGame(s, 0, 'B', 10);
    expect(s.players.p2.status).toBe('resting');
    expect(s.queue).not.toContain('p2');
    s = checkIn(s, 'p2', 20);
    expect(s.queue[s.queue.length - 1]).toBe('p2');
  });
  it('records the score of the game', () => {
    let s = fillCourts(withPlayers(4, { ...DEFAULT_SETTINGS, courts: 1 }), 0);
    for (let i = 0; i < 11; i++) s = scoreRally(s, 0, 'A');
    s = undoRally(s, 0);
    s = scoreRally(s, 0, 'A');
    s = finishGame(s, 0, 'A', 1);
    expect(s.results[0].score).toEqual([11, 0]);
  });
});

describe('winners stay', () => {
  const ws = { ...DEFAULT_SETTINGS, courts: 1, rule: 'winners-stay' as const, maxWins: 2 };
  it('winners stay once, two challengers come on, losers go to the back', () => {
    let s = fillCourts(withPlayers(8, ws), 0);
    const g = s.courts[0]!;
    s = finishGame(s, 0, 'A', 10);
    const g2 = s.courts[0]!;
    expect(g2.teamA).toEqual(g.teamA);
    expect(names(s, g2.teamB)).toEqual(['P5', 'P6']);
    expect(s.queue.slice(-2)).toEqual(g.teamB);
    expect(g2.streakA).toBe(1);
  });
  it('after two wins in a row, everyone comes off', () => {
    let s = fillCourts(withPlayers(8, ws), 0);
    const g = s.courts[0]!;
    s = finishGame(s, 0, 'A', 10);
    s = finishGame(s, 0, 'A', 20);
    const g3 = s.courts[0]!;
    expect([...g3.teamA, ...g3.teamB]).not.toContain(g.teamA[0]);
    expect(s.queue).toContain(g.teamA[0]);
  });
  it('challengers who win start a new streak', () => {
    let s = fillCourts(withPlayers(8, ws), 0);
    s = finishGame(s, 0, 'A', 10);
    const challengers = s.courts[0]!.teamB;
    s = finishGame(s, 0, 'B', 20);
    expect(s.courts[0]!.teamA).toEqual(challengers);
    expect(s.courts[0]!.streakA).toBe(1);
  });
});

describe('winners split', () => {
  const sp = { ...DEFAULT_SETTINGS, courts: 1, rule: 'winners-split' as const };
  it('winners stay on opposite teams with two new partners, losers go to the back', () => {
    let s = fillCourts(withPlayers(8, sp), 0);
    const g = s.courts[0]!;
    s = finishGame(s, 0, 'A', 10);
    const g2 = s.courts[0]!;
    expect(g2.teamA[0]).toBe(g.teamA[0]);
    expect(g2.teamB[0]).toBe(g.teamA[1]);
    expect(names(s, [g2.teamA[1], g2.teamB[1]])).toEqual(['P5', 'P6']);
    expect(s.queue.slice(-2)).toEqual(g.teamB);
  });
  it('after the split game everyone comes off', () => {
    let s = fillCourts(withPlayers(8, sp), 0);
    s = finishGame(s, 0, 'A', 10);
    const g2 = s.courts[0]!;
    s = finishGame(s, 0, 'B', 20);
    const on = [...s.courts[0]!.teamA, ...s.courts[0]!.teamB];
    for (const id of [...g2.teamA, ...g2.teamB]) expect(on).not.toContain(id);
  });
});

describe('courts and undo-like actions', () => {
  it('cancel puts the four back at the front in order', () => {
    let s = fillCourts(withPlayers(6, { ...DEFAULT_SETTINGS, courts: 1 }), 0);
    const g = s.courts[0]!;
    s = cancelGame(s, 0);
    expect(s.queue.slice(0, 4)).toEqual([...g.teamA, ...g.teamB]);
    expect(s.courts[0]).toBeNull();
  });
  it('fewer courts sends those players to the front; more courts fill at once', () => {
    let s = fillCourts(withPlayers(9), 0);
    s = setCourtCount(s, 1, 0);
    expect(s.courts).toHaveLength(1);
    expect(s.queue).toHaveLength(5);
    s = setCourtCount(s, 2, 0);
    expect(s.courts[1]).not.toBeNull();
    expect(s.queue).toHaveLength(1);
  });
  it('restart keeps the names and clears the games', () => {
    let s = fillCourts(withPlayers(6), 0);
    s = finishGame(s, 0, 'A', 1);
    const r = restartSession(s, 2);
    expect(Object.keys(r.players)).toHaveLength(6);
    expect(r.results).toHaveLength(0);
    expect(r.courts.every((c) => c === null)).toBe(true);
  });
});

describe('fairness with winners staying', () => {
  it.each(['winners-stay', 'winners-split'] as const)('%s: over 40 games nobody runs away with the court (winners play a bit more by design)', (rule) => {
    let s = fillCourts(withPlayers(10, { ...DEFAULT_SETTINGS, courts: 2, rule }), 0);
    for (let round = 0; round < 40; round++) s = finishGame(s, round % 2, round % 4 === 0 ? 'B' : 'A', round + 1);
    const games = Object.values(s.players).map((p) => p.games);
    expect(Math.max(...games) - Math.min(...games)).toBeLessThanOrEqual(5);
  });
});

describe('fairness over a long session', () => {
  it.each([
    [9, 2],
    [13, 3],
    [6, 1],
    [17, 4],
  ])('%i players on %i courts: games played stay even and partners spread out', (n, courts) => {
    let s = fillCourts(withPlayers(n, { ...DEFAULT_SETTINGS, courts }), 0);
    let t = 0;
    for (let round = 0; round < 40; round++) {
      const c = round % courts;
      t += 1;
      s = finishGame(s, c, round % 3 === 0 ? 'B' : 'A', t);
    }
    const games = Object.values(s.players).map((p) => p.games);
    // The players on court right now are one game behind at most.
    expect(Math.max(...games) - Math.min(...games)).toBeLessThanOrEqual(2);
    // Partners are spread out: no pair plays together much more often than the average pair.
    const pairs = (n * (n - 1)) / 2;
    const pairings = Object.values(s.partners).reduce((a, b) => a + b, 0);
    expect(Math.max(...Object.values(s.partners))).toBeLessThanOrEqual(Math.ceil(pairings / pairs) + 2);
  });
});

describe('opening and closing courts from the courts screen', () => {
  it('offers a new court when 4 wait and all courts are busy', () => {
    let s = fillCourts(withPlayers(8, { ...DEFAULT_SETTINGS, courts: 1 }), 0);
    expect(canOpenCourt(s)).toBe(true);
    s = setCourtCount(s, 2, 0);
    expect(s.courts[1]).not.toBeNull();
    expect(canOpenCourt(s)).toBe(false);
  });
  it('no offer with fewer than 4 waiting or with an open court', () => {
    expect(canOpenCourt(fillCourts(withPlayers(7, { ...DEFAULT_SETTINGS, courts: 1 }), 0))).toBe(false);
    expect(canOpenCourt(fillCourts(withPlayers(8, { ...DEFAULT_SETTINGS, courts: 3 }), 0))).toBe(false);
  });
  it('only an empty last court can be removed', () => {
    const busy = fillCourts(withPlayers(8), 0);
    expect(canRemoveCourt(busy)).toBe(false);
    const open = fillCourts(withPlayers(4), 0);
    expect(canRemoveCourt(open)).toBe(true);
    expect(canRemoveCourt(newSession({ ...DEFAULT_SETTINGS, courts: 1 }))).toBe(false);
  });
});

describe('start game', () => {
  it('four on a court wait for Start: the clock starts when the host taps it', () => {
    let s = fillCourts(withPlayers(4), 100);
    expect(s.courts[0]).toMatchObject({ started: false, startedAt: 100 });
    s = beginGame(s, 0, 400);
    expect(s.courts[0]).toMatchObject({ started: true, startedAt: 400 });
    expect(beginGame(s, 0, 900)).toBe(s);
  });
  it('a point scored starts the game too', () => {
    const s = scoreRally(fillCourts(withPlayers(4), 0), 0, 'A');
    expect(s.courts[0]?.started).toBe(true);
  });
  it('the next game on a court waits for Start again', () => {
    let s = beginGame(fillCourts(withPlayers(8), 0), 0, 0);
    s = finishGame(s, 0, 'A', 600_000);
    expect(s.courts[0]?.started).toBe(false);
  });
});
