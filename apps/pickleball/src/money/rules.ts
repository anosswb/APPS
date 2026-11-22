// Every money decision of the app, in one place, with tests (rules.test.ts). Screens ask; they never decide.
// Plan approved by Anass on 22 Nov 2026 (docs/money.md).
import type { RotationRule } from '../logic/session';

export type Platform = 'android' | 'ios' | 'web';

/**
 * No banner anywhere (Anass, 22 Nov 2026: "the ad bar is so big"). One full-screen ad (often a video,
 * skippable) when a game ends, Android only, and only when:
 *  - the game really ran at least 3 minutes on its clock (Anass: someone ending a game after 1 minute
 *    just wants to clear the court), and
 *  - no ad was shown in the last 10 minutes (with 4 courts a game ends every few minutes; without a gap
 *    the host would see an ad after almost every game).
 * Never while a game is being played or scored.
 */
export const AD_MIN_GAME_MS = 3 * 60_000;
export const AD_GAP_MS = 10 * 60_000;

export function adAfterGame(platform: Platform, game: { started: boolean; startedAt: number; endedAt: number }, lastAdAt: number | null): boolean {
  if (platform !== 'android' || !game.started) return false;
  if (game.endedAt - game.startedAt < AD_MIN_GAME_MS) return false;
  return lastAdAt === null || game.endedAt - lastAdAt >= AD_GAP_MS;
}

/** Free forever: 1–2 courts. The unlock opens 3–8. */
export const FREE_COURTS = 2;

/**
 * iPhone only. Nothing is locked until a real purchase can be made (`canSell`): a lock with no way to
 * buy would be a dead end. Android never locks anything (ads only, Morocco money rails).
 */
export function courtsLocked(platform: Platform, canSell: boolean, owned: boolean, wanted: number): boolean {
  return platform === 'ios' && canSell && !owned && wanted > FREE_COURTS;
}

export function ruleLocked(platform: Platform, canSell: boolean, owned: boolean, rule: RotationRule): boolean {
  return platform === 'ios' && canSell && !owned && rule !== 'all-off';
}
