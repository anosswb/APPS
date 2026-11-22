// Goals the host sets for themselves. Pure progress functions over the session records.
import { SessionRecord } from './history';

export type GoalKind = 'sessions-month' | 'games-total' | 'players-session' | 'games-week';

export interface Goal {
  id: string;
  kind: GoalKind;
  target: number;
  createdAt: number;
}

export const GOAL_KINDS: { kind: GoalKind; start: number; step: number; min: number; max: number }[] = [
  { kind: 'sessions-month', start: 4, step: 1, min: 1, max: 31 },
  { kind: 'games-week', start: 30, step: 5, min: 5, max: 500 },
  { kind: 'games-total', start: 100, step: 25, min: 25, max: 5000 },
  { kind: 'players-session', start: 16, step: 2, min: 4, max: 64 },
];

export const DEFAULT_GOALS = (now: number): Goal[] => [
  { id: 'g1', kind: 'sessions-month', target: 4, createdAt: now },
  { id: 'g2', kind: 'games-total', target: 100, createdAt: now },
];

const real = (s: SessionRecord[]) => s.filter((x) => x.games.length > 0);

export function progress(goal: Goal, sessions: SessionRecord[], now: number): number {
  const list = real(sessions);
  const d = new Date(now);
  switch (goal.kind) {
    case 'sessions-month':
      return list.filter((s) => {
        const t = new Date(s.startedAt);
        return t.getFullYear() === d.getFullYear() && t.getMonth() === d.getMonth();
      }).length;
    case 'games-week': {
      const from = new Date(d);
      from.setHours(0, 0, 0, 0);
      from.setDate(from.getDate() - 6);
      return list.flatMap((s) => s.games).filter((g) => g.endedAt >= from.getTime()).length;
    }
    case 'games-total':
      return list.reduce((n, s) => n + s.games.length, 0);
    case 'players-session':
      return list.reduce((best, s) => Math.max(best, s.players.length), 0);
  }
}

export const fraction = (goal: Goal, sessions: SessionRecord[], now: number) => Math.min(1, progress(goal, sessions, now) / goal.target);
