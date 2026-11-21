/**
 * Plus. Only iPhone can sell it (Google cannot pay a developer in Morocco: research/2026-11-13-market-facts.md).
 * On Android every feature is free and ads pay instead. NO REAL PURCHASE YET: the test button unlocks on this phone only.
 */
import { Platform } from 'react-native';
import { Saved } from '../store';

/** False until the Apple account and the purchase code exist. While false, buttons say "test" and charge nothing. */
export const PURCHASES_LIVE = false;
/**
 * True where Plus is shown. iPhone always; Android only in test builds, so Anass can see and judge the page
 * (Anass, 21 Nov 2026). A store build for Android hides it until Google can pay a developer in Morocco.
 */
export const SELLS_PLUS = Platform.OS !== 'android' || !PURCHASES_LIVE;

export const hasPlus = (d: Saved) => !SELLS_PLUS || d.plus;
