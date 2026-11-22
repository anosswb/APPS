// Every money decision of the app, in one place, with tests (rules.test.ts). Screens ask; they never decide.
// Plan approved by Anass on 22 Nov 2026 (docs/money.md).
import type { RotationRule } from '../logic/session';

export type Screen = 'courts' | 'scorer' | 'board' | 'players' | 'settings' | 'licences';
export type Platform = 'android' | 'ios' | 'web';

/** The protected moments: the phone is at the court and everyone looks at it. Never an ad there. */
const NO_AD_SCREENS: Screen[] = ['courts', 'scorer', 'board'];

/** Android only, small banner, only on Players and Settings. */
export function bannerAllowed(platform: Platform, screen: Screen): boolean {
  return platform === 'android' && !NO_AD_SCREENS.includes(screen) && (screen === 'players' || screen === 'settings');
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
