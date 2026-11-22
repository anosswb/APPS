// The 20 awards. All of them belong to the person who runs the app (a host or a coach), never to the
// players: a coach can have hundreds of names, so awards count what YOU ran (Anass, 22 Nov 2026).
// Pure: everything is worked out again from the session records, so nothing can get out of step.
// The ids stay as they were so the badge pictures and the "already shown" list still match.
import { duration, SessionRecord } from './history';

export type AwardId =
  | 'first-dink' | 'pickled' | 'comeback' | 'marathon' | 'quick-kill' | 'hot-streak' | 'on-fire' | 'iron-paddle'
  | 'social-butterfly' | 'win-by-two' | 'host' | 'regular' | 'club-captain' | 'full-house' | 'four-courts'
  | 'century' | 'early-bird' | 'night-owl' | 'weekend-warrior' | 'golden-paddle';

export interface AwardDef {
  id: AwardId;
  /** For counting awards: the number to reach (shown as progress). */
  goal?: number;
}

export const AWARDS: AwardDef[] = [
  { id: 'first-dink' },
  { id: 'host', goal: 1 },
  { id: 'pickled' },
  { id: 'comeback' },
  { id: 'win-by-two' },
  { id: 'iron-paddle', goal: 10 },
  { id: 'quick-kill', goal: 6 },
  { id: 'marathon' },
  { id: 'regular', goal: 5 },
  { id: 'hot-streak', goal: 3 },
  { id: 'full-house', goal: 16 },
  { id: 'four-courts' },
  { id: 'early-bird' },
  { id: 'night-owl' },
  { id: 'weekend-warrior' },
  { id: 'social-butterfly', goal: 50 },
  { id: 'club-captain', goal: 25 },
  { id: 'century', goal: 100 },
  { id: 'on-fire', goal: 500 },
  { id: 'golden-paddle', goal: 50 },
];

export const MIN = 60 * 1000;
const HOUR = 60 * MIN;

export interface AwardState {
  earned: boolean;
  /** When it was first earned. */
  at: number | null;
  /** Progress toward `goal` for counting awards. */
  progress?: number;
}

const dayKey = (t: number) => new Date(t).toDateString();

export function evaluate(sessions: SessionRecord[]): Record<AwardId, AwardState> {
  const st = {} as Record<AwardId, AwardState>;
  for (const a of AWARDS) st[a.id] = { earned: false, at: null, progress: a.goal ? 0 : undefined };
  const give = (id: AwardId, at: number) => {
    if (!st[id].earned) st[id] = { ...st[id], earned: true, at };
  };
  /** A counting award: keeps the best value reached, earned when it reaches the goal. */
  const count = (id: AwardId, value: number, at: number) => {
    const goal = AWARDS.find((a) => a.id === id)!.goal!;
    st[id].progress = Math.max(st[id].progress ?? 0, Math.min(value, goal));
    if (value >= goal) give(id, at);
  };

  const real = sessions.filter((s) => s.games.length > 0);
  const names = new Set<string>();
  let games = 0;
  let points = 0;

  real.forEach((s, i) => {
    const list = [...s.games].sort((a, b) => a.endedAt - b.endedAt);
    const end = s.endedAt;
    count('host', i + 1, end);
    count('regular', i + 1, end);
    count('club-captain', i + 1, end);
    count('golden-paddle', i + 1, end);
    list.forEach((g, k) => {
      games += 1;
      points += g.score[0] + g.score[1];
      give('first-dink', g.endedAt);
      const scored = g.score[0] + g.score[1] > 0;
      if (scored && g.score[1] === 0 && g.score[0] >= g.target) give('pickled', g.endedAt);
      if (g.maxDeficit >= 5) give('comeback', g.endedAt);
      if (scored && g.score[1] >= g.target - 1) give('win-by-two', g.endedAt);
      if (new Date(g.startedAt).getHours() >= 19) give('night-owl', g.endedAt);
      if (g.court >= 3) give('four-courts', g.endedAt);
      count('century', games, g.endedAt);
      count('on-fire', points, g.endedAt);
      count('iron-paddle', k + 1, g.endedAt);
      // Fast lane: games finished inside any one hour.
      const inHour = list.slice(0, k + 1).filter((x) => g.endedAt - x.endedAt < HOUR).length;
      count('quick-kill', inHour, g.endedAt);
    });
    for (const n of s.players) names.add(n.trim().toLowerCase());
    count('social-butterfly', names.size, end);
    count('full-house', s.players.length, end);
    if (end - s.startedAt >= 2 * HOUR) give('marathon', end);
    if (new Date(s.startedAt).getHours() < 8) give('early-bird', end);
  });

  // Days in a row with a session, and a Saturday followed by a Sunday.
  const days = [...new Set(real.map((s) => dayKey(s.startedAt)))].map((d) => new Date(d));
  const has = (d: Date) => real.find((s) => dayKey(s.startedAt) === d.toDateString());
  for (const d of days) {
    let run = 1;
    const next = new Date(d);
    for (;;) {
      next.setDate(next.getDate() + 1);
      const hit = has(next);
      if (!hit) break;
      run += 1;
      count('hot-streak', run, hit.endedAt);
    }
    if (d.getDay() === 6) {
      const sunday = new Date(d);
      sunday.setDate(d.getDate() + 1);
      const hit = has(sunday);
      if (hit) give('weekend-warrior', hit.endedAt);
    }
  }
  if (real.length) st['hot-streak'].progress = Math.max(st['hot-streak'].progress ?? 0, 1);
  return st;
}

/** Awards earned now that were not in `seen` (for the "unlocked" banner). */
export function newlyEarned(state: Record<AwardId, AwardState>, seen: string[]): AwardId[] {
  return AWARDS.filter((a) => state[a.id].earned && !seen.includes(a.id)).map((a) => a.id);
}
