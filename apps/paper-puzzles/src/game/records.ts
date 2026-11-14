/**
 * Personal bests: the player against themselves. Nothing here is compared with anyone else,
 * and nothing leaves the phone.
 *   - the best time for each grid size, counted only for a solve with no hints
 *   - wins in a row in each challenge, now and best ever
 */
import { ChallengeKind } from './challenge';

export interface Streak {
  streak: number;
  best: number;
}
export interface Records {
  /** best clean solve time in ms, by grid size ("6", "7", ...) */
  best: Record<string, number>;
  race: Streak;
  ink: Streak;
}

export function freshRecords(): Records {
  return { best: {}, race: { streak: 0, best: 0 }, ink: { streak: 0, best: 0 } };
}

/** A solve this short is a puzzle that was reopened, not played. */
const MIN_MS = 3000;

/** Does this solve count for the best-time list? */
export function countsForBest(ms: number, hints: number): boolean {
  return hints === 0 && ms >= MIN_MS;
}

export function recordSolve(r: Records, n: number, ms: number, hints: number): Records {
  if (!countsForBest(ms, hints)) return r;
  const before = r.best[String(n)];
  if (before !== undefined && before <= ms) return r;
  return { ...r, best: { ...r.best, [String(n)]: Math.round(ms) } };
}

/**
 * After a challenge. A win adds to the run. A win that needed extra time or ink keeps the run
 * but does not add to it. A loss ends it.
 */
export function recordChallenge(r: Records, kind: ChallengeKind, won: boolean, helped: boolean): Records {
  const now = r[kind];
  if (!won) return now.streak === 0 ? r : { ...r, [kind]: { streak: 0, best: now.best } };
  if (helped) return r;
  const streak = now.streak + 1;
  return { ...r, [kind]: { streak, best: Math.max(now.best, streak) } };
}

/** What to say after a clean solve: first time for this size, a new best, or the time to beat. */
export function bestNews(before: number | undefined, ms: number, hints: number): 'first' | 'new' | 'keep' | null {
  if (!countsForBest(ms, hints)) return null;
  if (before === undefined) return 'first';
  return ms < before ? 'new' : 'keep';
}
