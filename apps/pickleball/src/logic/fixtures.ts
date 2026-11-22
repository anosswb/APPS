// Small builders for tests (not used by the app).
import type { GameRecord, SessionRecord } from './history';

const MIN = 60000;
export function game(w: [string, string], l: [string, string], score: [number, number], start: number, mins: number, extra: Partial<GameRecord> = {}): GameRecord {
  return { court: 0, winners: w, losers: l, score, startedAt: start, endedAt: start + mins * MIN, target: 11, maxDeficit: 0, ...extra };
}
export function session(id: string, start: number, games: GameRecord[], players?: string[]): SessionRecord {
  const names = players ?? [...new Set(games.flatMap((g) => [...g.winners, ...g.losers]))];
  return { id, startedAt: start, endedAt: games.length ? games[games.length - 1].endedAt : start, players: names, games };
}

