/**
 * Plus. Only iPhone can sell it (Google cannot pay a developer in Morocco: research/2026-11-13-market-facts.md).
 * On Android every feature is free and ads pay instead. NO REAL PURCHASE YET: the test button unlocks on this phone only.
 */
import { Platform } from 'react-native';
import { Saved } from '../store';

/** True where Plus is sold. The web preview behaves like iPhone so the paywall can be seen. */
export const SELLS_PLUS = Platform.OS !== 'android';
/** False until the Apple account and the purchase code exist. While false, buttons say "test" and charge nothing. */
export const PURCHASES_LIVE = false;

export const hasPlus = (d: Saved) => !SELLS_PLUS || d.plus;
