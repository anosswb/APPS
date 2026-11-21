import { Platform } from 'react-native';

/**
 * How the app earns, per store (docs/money.md).
 *   Android = ads (no purchases are possible from Morocco). iPhone = one purchase, no ads.
 * EXPO_PUBLIC_MONEY_PREVIEW ('ads' or 'iap') turns on a PRETEND version for the web preview and screenshots:
 * a fake video that always "plays" and a fake purchase that always succeeds. Never set it in a store build.
 */
export type MoneyMode = 'ads' | 'iap' | 'none';

const preview = process.env.EXPO_PUBLIC_MONEY_PREVIEW;
export const MONEY_PREVIEW: MoneyMode | null = preview === 'ads' || preview === 'iap' ? preview : null;

export const MONEY_MODE: MoneyMode = MONEY_PREVIEW ?? Platform.select<MoneyMode>({ android: 'ads', ios: 'iap', default: 'none' });

/** iPhone: the Book is free up to this puzzle. After it comes the full edition. */
export const FREE_BOOK_PUZZLES = 30;
/** Both stores: today and the six days before it are always open in the calendar. */
export const FREE_ARCHIVE_DAYS = 7;
/** Android: no full-screen ad before the player has finished this many puzzles (free play, ink and clock together)... */
export const AD_AFTER_PUZZLES = 6;
/** ...only after this many games since the app opened or since the last ad... */
export const AD_GAMES_BETWEEN = 3;
/** ...and only when the last this-many games were all wins (never after a loss). */
export const AD_WINS_IN_A_ROW = 2;
/** ...nor in the first ten minutes after the very first opening... */
export const AD_QUIET_START_MS = 10 * 60 * 1000;
/** ...and never more often than once every four minutes. */
export const AD_MIN_GAP_MS = 4 * 60 * 1000;

/** Ink bottles (Anass, 21 Nov 2026): one bottle gives a lost challenge more room, instead of a video. */
export const FREE_BOTTLES = 3;
export const BOTTLE_DROPS = 3;
export const BOTTLE_MS = 30 * 1000;
/** iPhone only (Google pays no sellers in Morocco). Product ids must match App Store Connect. Prices are set there. */
export const BOTTLE_PACKS = [
  { id: 'ink_bottles_10', bottles: 10 },
  { id: 'ink_bottles_30', bottles: 30 },
] as const;

/** Shown on the paywall. They must be real pages before purchases go live (docs/store.md). */
export const LEGAL = { privacy: '', terms: '' };
