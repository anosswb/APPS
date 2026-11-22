/**
 * The iPhone unlock, as the rest of the app sees it. Today there is NO real store code: buying is off,
 * so `available()` is false and nothing is ever locked (rules.ts). The real version goes in
 * `purchases.ios.ts` once Anass has the Apple developer account and the product in App Store Connect.
 */
export type BuyResult = 'bought' | 'cancelled' | 'failed';

export interface Purchases {
  /** true only when a real purchase can be made right now */
  available(): boolean;
  /** does the store say this person owns the unlock? Throws when the store cannot be reached. */
  owns(): Promise<boolean>;
  /** the price as the store shows it to this person, or null */
  price(): Promise<string | null>;
  buy(): Promise<BuyResult>;
  restore(): Promise<boolean>;
}

export const purchases: Purchases = {
  available: () => false,
  owns: async () => false,
  price: async () => null,
  buy: async () => 'failed',
  restore: async () => false,
};
