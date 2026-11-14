/** Every money decision in one place, as plain functions with tests. No ad or store code here. */
import {
  AD_FIRST_BOOK_LEVEL,
  AD_MIN_GAP_MS,
  AD_QUIET_START_MS,
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

/** Android only: may a full-screen ad be shown after this Book puzzle, before the next one opens? */
export function interstitialDue(mode: MoneyMode, finishedLevel: number, now: number, m: MoneyState): boolean {
  if (mode !== 'ads') return false;
  if (finishedLevel < AD_FIRST_BOOK_LEVEL) return false;
  if (now - m.firstOpenAt < AD_QUIET_START_MS) return false;
  return now - m.lastAdAt >= AD_MIN_GAP_MS;
}
