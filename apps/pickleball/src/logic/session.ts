// The open-play session: players, the waiting line (the "stack"), the courts and the rotation rules.
// Pure functions only: each takes a session and returns a new one. `now` is passed in so tests are exact.
import { DEFAULT_RULES, maxDeficit, ScoreRules, scoreFromRallies, Team } from './scoring';

export type RotationRule = 'all-off' | 'winners-stay' | 'winners-split';
export type PlayerStatus = 'waiting' | 'playing' | 'resting';

export interface Player {
  id: string;
  name: string;
  status: PlayerStatus;
  games: number;
  wins: number;
  /** When they joined the line this time; used for "waiting 12 min". */
  waitingSince: number;
  /** Checked out while on court: they leave the line when the game ends. */
  leaving: boolean;
}

export interface Game {
  id: string;
  teamA: [string, string];
  teamB: [string, string];
  rallies: Team[];
  firstServe: Team;
  /** When the four were put on the court; once started, when Start game was tapped (game lengths use it). */
  startedAt: number;
  /** False until the host taps Start game: the four may still be walking on (Anass, 22 Nov 2026). */
  started: boolean;
  /** Games in a row that team A has won on this court (winners-stay rule). */
  streakA: number;
}

export interface Settings {
  courts: number;
  rule: RotationRule;
  /** Winners-stay: after this many wins in a row, everyone comes off. */
  maxWins: number;
  scoring: ScoreRules;
}

export interface Result {
  court: number;
  winners: [string, string];
  losers: [string, string];
  score: [number, number]; // winners first
  startedAt: number;
  endedAt: number;
  /** The game was to this many points. */
  target: number;
  /** The biggest lead the losers ever had over the winners (a comeback when 5 or more). */
  maxDeficit: number;
  /** Start game was tapped (or a point scored). Missing in saves from before 22 Nov 2026: counts as started. */
  started?: boolean;
}

export interface Session {
  id: string;
  /** When the first game started; null before that. */
  startedAt: number | null;
  players: Record<string, Player>;
  /** Ids of waiting players, first = next on court. */
  queue: string[];
  /** One slot per court, null = open court. */
  courts: (Game | null)[];
  /** How many times two players were partners: key "idA|idB" with ids sorted. */
  partners: Record<string, number>;
  results: Result[];
  settings: Settings;
  nextId: number;
}

export const MAX_COURTS = 8;
export const MAX_NAME = 18;

export const DEFAULT_SETTINGS: Settings = { courts: 2, rule: 'all-off', maxWins: 2, scoring: DEFAULT_RULES };

export function newSession(settings: Settings = DEFAULT_SETTINGS, now = 0): Session {
  return {
    id: `s${now.toString(36)}`,
    startedAt: null,
    players: {},
    queue: [],
    courts: Array(settings.courts).fill(null),
    partners: {},
    results: [],
    settings,
    nextId: 1,
  };
}

export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
}

function pairKey(x: string, y: string): string {
  return x < y ? `${x}|${y}` : `${y}|${x}`;
}

export function findByName(s: Session, name: string): Player | undefined {
  const n = cleanName(name).toLowerCase();
  return Object.values(s.players).find((p) => p.name.toLowerCase() === n);
}

/** Add a player to the end of the line. A known name that is resting is checked back in instead. */
export function addPlayer(s: Session, rawName: string, now: number): Session {
  const name = cleanName(rawName);
  if (!name) return s;
  const known = findByName(s, name);
  if (known) return known.status === 'resting' ? checkIn(s, known.id, now) : s;
  const id = `p${s.nextId}`;
  const player: Player = { id, name, status: 'waiting', games: 0, wins: 0, waitingSince: now, leaving: false };
  return { ...s, players: { ...s.players, [id]: player }, queue: [...s.queue, id], nextId: s.nextId + 1 };
}

export function checkIn(s: Session, id: string, now: number): Session {
  const p = s.players[id];
  if (!p) return s;
  if (p.status === 'playing') return p.leaving ? patch(s, id, { leaving: false }) : s;
  if (p.status === 'waiting') return s;
  return { ...patch(s, id, { status: 'waiting', waitingSince: now }), queue: [...s.queue, id] };
}

/** Take a break or go home. On court: they finish the game first. */
export function checkOut(s: Session, id: string): Session {
  const p = s.players[id];
  if (!p) return s;
  if (p.status === 'playing') return patch(s, id, { leaving: true });
  if (p.status === 'resting') return s;
  return { ...patch(s, id, { status: 'resting' }), queue: s.queue.filter((q) => q !== id) };
}

/** Remove a resting or waiting player from the session completely (a typo, a duplicate). */
export function removePlayer(s: Session, id: string): Session {
  const p = s.players[id];
  if (!p || p.status === 'playing') return s;
  const players = { ...s.players };
  delete players[id];
  return { ...s, players, queue: s.queue.filter((q) => q !== id) };
}

export function renamePlayer(s: Session, id: string, rawName: string): Session {
  const name = cleanName(rawName);
  const other = findByName(s, name);
  if (!name || !s.players[id] || (other && other.id !== id)) return s;
  return patch(s, id, { name });
}

/** Move a waiting player one place toward the front (for someone who was skipped by mistake). */
export function moveUp(s: Session, id: string): Session {
  const i = s.queue.indexOf(id);
  if (i <= 0) return s;
  const q = [...s.queue];
  [q[i - 1], q[i]] = [q[i], q[i - 1]];
  return { ...s, queue: q };
}

function patch(s: Session, id: string, change: Partial<Player>): Session {
  return { ...s, players: { ...s.players, [id]: { ...s.players[id], ...change } } };
}

/** The three ways to split four players into two teams. */
const SPLITS: [number, number, number, number][] = [
  [0, 1, 2, 3],
  [0, 2, 1, 3],
  [0, 3, 1, 2],
];

/** Pick the split where the partners have played together the fewest times. Ties keep line order. */
export function bestTeams(four: string[], partners: Record<string, number>): { teamA: [string, string]; teamB: [string, string] } {
  let best = SPLITS[0];
  let bestCost = Infinity;
  for (const sp of SPLITS) {
    const cost = (partners[pairKey(four[sp[0]], four[sp[1]])] ?? 0) + (partners[pairKey(four[sp[2]], four[sp[3]])] ?? 0);
    if (cost < bestCost) {
      bestCost = cost;
      best = sp;
    }
  }
  return { teamA: [four[best[0]], four[best[1]]], teamB: [four[best[2]], four[best[3]]] };
}

function startGame(s: Session, court: number, teamA: [string, string], teamB: [string, string], now: number, streakA: number): Session {
  let next = s;
  for (const id of [...teamA, ...teamB]) next = patch(next, id, { status: 'playing' });
  const game: Game = { id: `g${next.nextId}`, teamA, teamB, rallies: [], firstServe: 'A', startedAt: now, started: false, streakA };
  const courts = [...next.courts];
  courts[court] = game;
  const used = new Set([...teamA, ...teamB]);
  return { ...next, startedAt: next.startedAt ?? now, courts, queue: next.queue.filter((q) => !used.has(q)), nextId: next.nextId + 1 };
}

/** Put the next four in line on every open court, lowest court number first. */
export function fillCourts(s: Session, now: number): Session {
  let next = s;
  for (let c = 0; c < next.courts.length; c++) {
    if (next.courts[c] || next.queue.length < 4) continue;
    const four = next.queue.slice(0, 4);
    const { teamA, teamB } = bestTeams(four, next.partners);
    next = startGame(next, c, teamA, teamB, now, 0);
  }
  return next;
}

/** Who is up next: the first four in line, or fewer if the line is short. */
export function nextUp(s: Session): string[] {
  return s.queue.slice(0, 4);
}

/** How many games a waiting player still has to wait (0 = on the next open court). */
export function gamesToWait(s: Session, id: string): number {
  const i = s.queue.indexOf(id);
  return i < 0 ? -1 : Math.floor(i / 4);
}

function backToLine(s: Session, ids: string[], now: number): Session {
  let next = s;
  const join: string[] = [];
  for (const id of ids) {
    const p = next.players[id];
    if (!p) continue;
    if (p.leaving) {
      next = patch(next, id, { status: 'resting', leaving: false });
    } else {
      next = patch(next, id, { status: 'waiting', waitingSince: now });
      join.push(id);
    }
  }
  return { ...next, queue: [...next.queue, ...join] };
}

/**
 * End the game on `court`. `winner` is the team that won. Stats and partner counts are saved, then the
 * rotation rule decides who comes off, and open courts are filled from the line.
 */
export function finishGame(s: Session, court: number, winner: Team, now: number): Session {
  const g = s.courts[court];
  if (!g) return s;
  const winners = winner === 'A' ? g.teamA : g.teamB;
  const losers = winner === 'A' ? g.teamB : g.teamA;
  const score = scoreFromRallies(g.rallies, s.settings.scoring, g.firstServe);
  const result: Result = {
    court,
    winners,
    losers,
    score: winner === 'A' ? [score.a, score.b] : [score.b, score.a],
    startedAt: g.startedAt,
    endedAt: now,
    target: s.settings.scoring.target,
    maxDeficit: maxDeficit(g.rallies, s.settings.scoring, g.firstServe, winner),
    started: g.started,
  };

  let next: Session = { ...s, results: [...s.results, result] };
  const partners = { ...next.partners };
  partners[pairKey(...g.teamA)] = (partners[pairKey(...g.teamA)] ?? 0) + 1;
  partners[pairKey(...g.teamB)] = (partners[pairKey(...g.teamB)] ?? 0) + 1;
  next = { ...next, partners };
  for (const id of [...g.teamA, ...g.teamB]) {
    const p = next.players[id];
    next = patch(next, id, { games: p.games + 1, wins: p.wins + (winners.includes(id) ? 1 : 0) });
  }
  const courts = [...next.courts];
  courts[court] = null;
  next = { ...next, courts };

  const streak = (winner === 'A' ? g.streakA : 0) + 1;
  const winnersCanStay =
    next.settings.rule === 'winners-stay' &&
    streak < next.settings.maxWins &&
    !winners.some((id) => next.players[id].leaving) &&
    next.queue.length >= 2;

  const canSplit =
    next.settings.rule === 'winners-split' &&
    g.streakA === 0 &&
    !winners.some((id) => next.players[id].leaving) &&
    next.queue.length >= 2;

  if (canSplit) {
    // Winners split up: each one plays with a new partner, against the other. One game, then all four off.
    const [c1, c2] = next.queue.slice(0, 2);
    next = startGame(next, court, [winners[0], c1], [winners[1], c2], now, 1);
    next = backToLine(next, losers, now);
  } else if (winnersCanStay) {
    const challengers = next.queue.slice(0, 2) as [string, string];
    next = startGame(next, court, winners, challengers, now, streak);
    next = backToLine(next, losers, now);
  } else {
    // Everyone off. Winners and losers are interleaved so the next game mixes partners.
    next = backToLine(next, [winners[0], losers[0], winners[1], losers[1]], now);
  }
  return fillCourts(next, now);
}

/** Take a game off the court without a result (started by mistake). The four go back to the front of the line. */
export function cancelGame(s: Session, court: number): Session {
  const g = s.courts[court];
  if (!g) return s;
  const four = [...g.teamA, ...g.teamB];
  let next = s;
  for (const id of four) next = patch(next, id, { status: 'waiting', leaving: false });
  const courts = [...next.courts];
  courts[court] = null;
  return { ...next, courts, queue: [...four, ...next.queue] };
}

/** The four are on court and play begins: the clock starts now. Does nothing to a game already started. */
export function beginGame(s: Session, court: number, now: number): Session {
  const g = s.courts[court];
  if (!g || g.started) return s;
  const courts = [...s.courts];
  courts[court] = { ...g, started: true, startedAt: now };
  return { ...s, courts };
}

export function scoreRally(s: Session, court: number, team: Team): Session {
  const g = s.courts[court];
  if (!g) return s;
  const now = scoreFromRallies(g.rallies, s.settings.scoring, g.firstServe);
  if (now.winner) return s;
  const courts = [...s.courts];
  // A point scored means the game is on, even if Start game was not tapped.
  courts[court] = { ...g, started: true, rallies: [...g.rallies, team] };
  return { ...s, courts };
}

export function undoRally(s: Session, court: number): Session {
  const g = s.courts[court];
  if (!g || g.rallies.length === 0) return s;
  const courts = [...s.courts];
  courts[court] = { ...g, rallies: g.rallies.slice(0, -1) };
  return { ...s, courts };
}

export function setFirstServe(s: Session, court: number, team: Team): Session {
  const g = s.courts[court];
  if (!g || g.rallies.length > 0) return s;
  const courts = [...s.courts];
  courts[court] = { ...g, firstServe: team };
  return { ...s, courts };
}

/** Change the number of courts. Games on removed courts go back to the front of the line. */
export function setCourtCount(s: Session, count: number, now: number): Session {
  const n = Math.max(1, Math.min(MAX_COURTS, Math.round(count)));
  let next = s;
  for (let c = next.courts.length - 1; c >= n; c--) next = cancelGame(next, c);
  const courts = next.courts.slice(0, n);
  while (courts.length < n) courts.push(null);
  next = { ...next, courts, settings: { ...next.settings, courts: n } };
  return fillCourts(next, now);
}

export function updateSettings(s: Session, change: Partial<Settings>, now: number): Session {
  const next = { ...s, settings: { ...s.settings, ...change } };
  return change.courts !== undefined ? setCourtCount(next, change.courts, now) : next;
}

/** Same players and settings, everyone back in line, no results. For "new session" with the same group. */
export function restartSession(s: Session, now: number): Session {
  let next = newSession(s.settings, now);
  const names = [...s.queue, ...s.courts.flatMap((g) => (g ? [...g.teamA, ...g.teamB] : []))]
    .map((id) => s.players[id]?.name)
    .filter((n): n is string => !!n);
  for (const n of names) next = addPlayer(next, n, now);
  return next;
}

export function counts(s: Session): { waiting: number; playing: number; resting: number } {
  const all = Object.values(s.players);
  return {
    waiting: all.filter((p) => p.status === 'waiting').length,
    playing: all.filter((p) => p.status === 'playing').length,
    resting: all.filter((p) => p.status === 'resting').length,
  };
}

/** Four or more are waiting, every court is busy and there is room for another court: offer to open one. */
export function canOpenCourt(s: Session): boolean {
  return s.courts.length < MAX_COURTS && s.courts.every((g) => g !== null) && s.queue.length >= 4;
}

/** A court can be removed only when the last one is empty (never stop a game in progress). */
export function canRemoveCourt(s: Session): boolean {
  return s.courts.length > 1 && s.courts[s.courts.length - 1] === null;
}
