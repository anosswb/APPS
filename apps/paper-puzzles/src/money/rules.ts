/** Every money decision in one place, as plain functions with tests. No ad or store code here. */
import {
  AD_AFTER_PUZZLES,
  AD_GAMES_BETWEEN,
  AD_MIN_GAP_MS,
  AD_QUIET_START_MS,
  AD_WINS_IN_A_ROW,
  FREE_ARCHIVE_DAYS,
  FREE_BOOK_PUZZLES,
  MoneyMode,
} from '../config/money';
import { dateKey, keyToDate } from '../game/daily';

export interface MoneyState {
  /** iPhone: the full edition was bought (the store is the truth; this is a copy for offline use) */
  fullEdition: boolean;
  /** Android: past days opened with a video */
  unlockedDays: string[];
  /** when the last full-screen ad was shown (ms), 0 = never */
  lastAdAt: number;
  /** when the app was first opened (ms) */
  firstOpenAt: number;
}

/** The oldest day that is always free: today and the six days before it. */
export function oldestFreeDay(today: string): string {
  const d = keyToDate(today);
  return dateKey(new Date(d.getFullYear(), d.getMonth(), d.getDate() - (FREE_ARCHIVE_DAYS - 1)));
}

/**
 * Is this past day closed for now?
 * Never: the last seven days, a day already started or solved, anything once the full edition is owned.
 * iPhone: older days belong to the full edition, but only when buying is really possible.
 * Android: older days open with one video each, and stay open.
 */
export function archiveLocked(key: string, today: string, mode: MoneyMode, canSell: boolean, m: MoneyState, touched: boolean): boolean {
  if (mode === 'none' || m.fullEdition || touched) return false;
  if (key >= oldestFreeDay(today)) return false;
  if (mode === 'iap') return canSell;
  return !m.unlockedDays.includes(key);
}

/** iPhone only: the Book past the free part needs the full edition. Android's Book has no end. */
export function bookLocked(level: number, mode: MoneyMode, canSell: boolean, m: MoneyState): boolean {
  return mode === 'iap' && canSell && !m.fullEdition && level > FREE_BOOK_PUZZLES;
}

/**
 * The player's mood since the app was opened, or since the last full-screen ad (Anass, 16 Nov 2026):
 * an ad comes only at a good moment. Kept in memory only: a fresh opening starts a fresh count.
 */
export interface AdMood {
  /** games finished (won or lost) since the app opened or since the last ad */
  games: number;
  /** the results of those games, newest last: true = won */
  results: boolean[];
}
export const freshMood = (): AdMood => ({ games: 0, results: [] });

/** One game ended. A lost challenge counts; a puzzle left half-done does not. */
export function afterGame(mood: AdMood, won: boolean): AdMood {
  return { games: mood.games + 1, results: [...mood.results, won].slice(-AD_WINS_IN_A_ROW) };
}

/**
 * A good moment: at least AD_GAMES_BETWEEN games, and the last AD_WINS_IN_A_ROW were all wins.
 * So never right after opening, never after a loss, and not on the first win after losses either:
 * a player who just fought back deserves to enjoy it.
 */
export function goodMoment(mood: AdMood): boolean {
  return mood.games >= AD_GAMES_BETWEEN && mood.results.length >= AD_WINS_IN_A_ROW && mood.results.every(Boolean);
}

/** How many puzzles a player has finished in the three level-by-level modes. Each level starts at 1. */
export function puzzlesFinished(levels: { book: number; ink: number; race: number }): number {
  return Math.max(0, levels.book - 1) + Math.max(0, levels.ink - 1) + Math.max(0, levels.race - 1);
}

/**
 * Android only: may a full-screen ad be shown now? It is asked only after a WON puzzle, when the player
 * taps "Next" (free play, ink or clock). Never after a loss, never around the daily puzzle.
 */
export function interstitialDue(mode: MoneyMode, finished: number, now: number, m: MoneyState, mood: AdMood): boolean {
  if (mode !== 'ads') return false;
  if (!goodMoment(mood)) return false;
  if (finished < AD_AFTER_PUZZLES) return false;
  if (now - m.firstOpenAt < AD_QUIET_START_MS) return false;
  return now - m.lastAdAt >= AD_MIN_GAP_MS;
}
