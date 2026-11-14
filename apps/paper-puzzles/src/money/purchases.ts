/**
 * The one purchase ("the full edition"), as the rest of the app sees it.
 * Today there is NO real store code: buying is switched off everywhere, so nothing is ever locked
 * on iPhone (see `canSell` in rules.ts). The real iPhone version goes in `purchases.ios.ts`
 * once the Apple account and the product exist (steps in docs/money.md).
 */
import { MONEY_PREVIEW } from '../config/money';

export type BuyResult = 'bought' | 'cancelled' | 'failed';

export interface Purchases {
  /** true only when a real purchase can be made right now */
  available(): boolean;
  init(): Promise<void>;
  /**
   * Does the store say this person owns the full edition?
   * It must THROW when the store cannot be reached (offline), and return false only when the store
   * really answers "not owned". A false answer removes the unlock; a throw keeps the saved one.
   */
  ownsFullEdition(): Promise<boolean>;
  /** the price as the store formats it for this person, or null if it is not known */
  price(): Promise<string | null>;
  buy(): Promise<BuyResult>;
  /** true if a past purchase was found */
  restore(): Promise<boolean>;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const off: Purchases = {
  available: () => false,
  init: async () => {},
  ownsFullEdition: async () => false,
  price: async () => null,
  buy: async () => 'failed',
  restore: async () => false,
};

/** Preview only: a pretend shop where buying always works, so the screens can be seen in a browser. */
let pretendOwned = false;
const pretend: Purchases = {
  available: () => true,
  init: async () => {},
  ownsFullEdition: async () => pretendOwned,
  price: async () => '$4.99',
  buy: async () => {
    await wait(500);
    pretendOwned = true;
    return 'bought';
  },
  restore: async () => pretendOwned,
};

export const purchases: Purchases = MONEY_PREVIEW === 'iap' ? pretend : off;
