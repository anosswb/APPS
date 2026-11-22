// What happened at past sessions: every finished game with names, length and score, and the numbers
// the History screen shows. Pure functions. Players are matched across sessions by name.
import type { Session } from './session';

export interface GameRecord {
  court: number;
  winners: [string, string];
  losers: [string, string];
  score: [number, number]; // winners first; [0, 0] when the game was not scored
  startedAt: number;
  endedAt: number;
  target: number;
  maxDeficit: number;
}

export interface SessionRecord {
  id: string;
  startedAt: number;
  endedAt: number;
  players: string[];
  games: GameRecord[];
}

export type Range = 'today' | 'week' | 'all';

const DAY = 24 * 60 * 60 * 1000;

/** The session as a record with names, or null when no game was finished. */
export function toRecord(s: Session): SessionRecord | null {
  if (s.results.length === 0) return null;
  const name = (id: string) => s.players[id]?.name ?? '?';
  const games: GameRecord[] = s.results.map((r) => ({
    court: r.court,
    winners: [name(r.winners[0]), name(r.winners[1])],
    losers: [name(r.losers[0]), name(r.losers[1])],
    score: r.score,
    startedAt: r.startedAt ?? r.endedAt,
    endedAt: r.endedAt,
    target: r.target ?? 11,
    maxDeficit: r.maxDeficit ?? 0,
  }));
  return {
    id: s.id,
    startedAt: s.startedAt ?? games[0].startedAt,
    endedAt: games[games.length - 1].endedAt,
    players: Object.values(s.players).map((p) => p.name),
    games,
  };
}

/** Past sessions plus the running one (if it has games), oldest first. */
export function allSessions(past: SessionRecord[], current: Session): SessionRecord[] {
  const now = toRecord(current);
  const rest = past.filter((p) => p.id !== current.id);
  return now ? [...rest, now] : rest;
}

export function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function gamesIn(sessions: SessionRecord[], range: Range, now: number): GameRecord[] {
  const from = range === 'today' ? startOfDay(now) : range === 'week' ? startOfDay(now) - 6 * DAY : -Infinity;
  return sessions.flatMap((s) => s.games).filter((g) => g.endedAt >= from);
}

export const duration = (g: GameRecord) => Math.max(0, g.endedAt - g.startedAt);

export interface PlayerLine {
  name: string;
  games: number;
  wins: number;
}

export interface Stats {
  games: number;
  avgMs: number;
  longestMs: number;
  shortestMs: number;
  players: number;
  /** Game lengths in minutes, oldest first, for the chart. */
  minutes: number[];
  /** Most wins first; ties broken by fewer games, then name. */
  table: PlayerLine[];
}

export function stats(games: GameRecord[]): Stats {
  const lengths = games.map(duration);
  const lines = new Map<string, PlayerLine>();
  for (const g of games) {
    for (const n of [...g.winners, ...g.losers]) {
      const l = lines.get(n) ?? { name: n, games: 0, wins: 0 };
      l.games += 1;
      if (g.winners.includes(n)) l.wins += 1;
      lines.set(n, l);
    }
  }
  const table = [...lines.values()].sort((a, b) => b.wins - a.wins || a.games - b.games || a.name.localeCompare(b.name));
  return {
    games: games.length,
    avgMs: lengths.length ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : 0,
    longestMs: lengths.length ? Math.max(...lengths) : 0,
    shortestMs: lengths.length ? Math.min(...lengths) : 0,
    players: lines.size,
    minutes: lengths.map((ms) => Math.round(ms / 60000)),
    table,
  };
}

/** How long a session lasted, from the first game's start to the last game's end. */
export const sessionLength = (r: SessionRecord) => Math.max(0, r.endedAt - r.startedAt);

/** "2h 14m" or "48m": the way running apps show time played. */
export function hoursMinutes(ms: number): string {
  const m = Math.round(ms / 60000);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${String(m % 60).padStart(2, '0')}m` : `${m}m`;
}

/** "14:32" for minutes and seconds, "1:02:10" past an hour. */
export function clock(ms: number): string {
  const total = Math.round(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const two = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${two(m)}:${two(s)}` : `${m}:${two(s)}`;
}
