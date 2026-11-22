// The 20 awards. Player awards are earned by players (by name); host awards by the person running the app.
// Pure: everything is worked out again from the session records, so nothing can get out of step.
import { duration, GameRecord, SessionRecord, stats } from './history';

export type AwardId =
  | 'first-dink' | 'pickled' | 'comeback' | 'marathon' | 'quick-kill' | 'hot-streak' | 'on-fire' | 'iron-paddle'
  | 'social-butterfly' | 'win-by-two' | 'host' | 'regular' | 'club-captain' | 'full-house' | 'four-courts'
  | 'century' | 'early-bird' | 'night-owl' | 'weekend-warrior' | 'golden-paddle';

export interface AwardDef {
  id: AwardId;
  /** player = earned by players at the court; host = earned by whoever runs the sessions */
  kind: 'player' | 'host';
  /** For host awards with a count: the number to reach (shown as progress). */
  goal?: number;
}

export const AWARDS: AwardDef[] = [
  { id: 'first-dink', kind: 'player' },
  { id: 'pickled', kind: 'player' },
  { id: 'comeback', kind: 'player' },
  { id: 'marathon', kind: 'player' },
  { id: 'quick-kill', kind: 'player' },
  { id: 'hot-streak', kind: 'player' },
  { id: 'on-fire', kind: 'player' },
  { id: 'iron-paddle', kind: 'player' },
  { id: 'social-butterfly', kind: 'player' },
  { id: 'win-by-two', kind: 'player' },
  { id: 'host', kind: 'host', goal: 1 },
  { id: 'regular', kind: 'host', goal: 5 },
  { id: 'club-captain', kind: 'host', goal: 25 },
  { id: 'full-house', kind: 'host' },
  { id: 'four-courts', kind: 'host' },
  { id: 'century', kind: 'host', goal: 100 },
  { id: 'early-bird', kind: 'host' },
  { id: 'night-owl', kind: 'host' },
  { id: 'weekend-warrior', kind: 'host' },
  { id: 'golden-paddle', kind: 'player' },
];

export const MIN = 60 * 1000;

export interface AwardState {
  earned: boolean;
  /** Players who earned it (player awards), most recent first. */
  by: string[];
  /** When it was first earned. */
  at: number | null;
  /** Progress toward `goal` for counting awards. */
  progress?: number;
}

const scored = (g: GameRecord) => g.score[0] + g.score[1] > 0;

/** Player awards that one game can give, to its winners (or all four for first-dink and marathon). */
function gameAwards(g: GameRecord): [AwardId, string[]][] {
  const out: [AwardId, string[]][] = [['first-dink', [...g.winners, ...g.losers]]];
  const len = duration(g);
  if (scored(g) && g.score[1] === 0 && g.score[0] >= g.target) out.push(['pickled', g.winners]);
  if (g.maxDeficit >= 5) out.push(['comeback', g.winners]);
  if (len >= 20 * MIN) out.push(['marathon', [...g.winners, ...g.losers]]);
  if (len >= 2 * MIN && len < 8 * MIN) out.push(['quick-kill', g.winners]);
  if (scored(g) && g.score[1] >= g.target - 1) out.push(['win-by-two', g.winners]);
  return out;
}

export function evaluate(sessions: SessionRecord[]): Record<AwardId, AwardState> {
  const st = {} as Record<AwardId, AwardState>;
  for (const a of AWARDS) st[a.id] = { earned: false, by: [], at: null };
  const give = (id: AwardId, names: string[], at: number) => {
    const s = st[id];
    if (!s.earned) {
      s.earned = true;
      s.at = at;
    }
    for (const n of names) if (!s.by.includes(n)) s.by.unshift(n);
  };

  const real = sessions.filter((s) => s.games.length > 0);
  const partners = new Map<string, Set<string>>();
  let totalGames = 0;

  for (const s of real) {
    const games = [...s.games].sort((a, b) => a.endedAt - b.endedAt);
    const streak = new Map<string, number>();
    const played = new Map<string, number>();
    for (const g of games) {
      totalGames += 1;
      for (const [id, names] of gameAwards(g)) give(id, names, g.endedAt);
      if (new Date(g.startedAt).getHours() >= 19) give('night-owl', [], g.endedAt);
      if (totalGames === 100) give('century', [], g.endedAt);
      for (const team of [g.winners, g.losers]) {
        for (const n of team) {
          const other = team[0] === n ? team[1] : team[0];
          const set = partners.get(n) ?? new Set<string>();
          set.add(other);
          partners.set(n, set);
          if (set.size === 8) give('social-butterfly', [n], g.endedAt);
        }
      }
      for (const n of [...g.winners, ...g.losers]) {
        const won = g.winners.includes(n);
        const run = won ? (streak.get(n) ?? 0) + 1 : 0;
        streak.set(n, run);
        if (run === 3) give('hot-streak', [n], g.endedAt);
        if (run === 5) give('on-fire', [n], g.endedAt);
        const count = (played.get(n) ?? 0) + 1;
        played.set(n, count);
        if (count === 10) give('iron-paddle', [n], g.endedAt);
      }
    }
    const end = s.endedAt;
    if (s.players.length >= 16) give('full-house', [], end);
    if (games.some((g) => g.court >= 3)) give('four-courts', [], end);
    if (new Date(s.startedAt).getHours() < 8) give('early-bird', [], end);
    const top = stats(games).table;
    if (top.length && top[0].wins >= 3) give('golden-paddle', top.filter((p) => p.wins === top[0].wins).map((p) => p.name), end);
  }

  const count = real.length;
  st.host.progress = Math.min(count, 1);
  st.regular.progress = Math.min(count, 5);
  st['club-captain'].progress = Math.min(count, 25);
  st.century.progress = Math.min(totalGames, 100);
  if (count >= 1) give('host', [], real[0].endedAt);
  if (count >= 5) give('regular', [], real[4].endedAt);
  if (count >= 25) give('club-captain', [], real[24].endedAt);

  // A Saturday session followed by a Sunday session the next day.
  const days = real.map((s) => new Date(s.startedAt));
  for (const d of days) {
    if (d.getDay() !== 6) continue;
    const sunday = new Date(d);
    sunday.setDate(d.getDate() + 1);
    const hit = real.find((s) => new Date(s.startedAt).toDateString() === sunday.toDateString());
    if (hit) give('weekend-warrior', [], hit.endedAt);
  }
  return st;
}

/** Awards earned now that were not in `seen` (for the "unlocked" banner). */
export function newlyEarned(state: Record<AwardId, AwardState>, seen: string[]): AwardId[] {
  return AWARDS.filter((a) => state[a.id].earned && !seen.includes(a.id)).map((a) => a.id);
}
