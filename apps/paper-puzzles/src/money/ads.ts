/**
 * Ads, as the rest of the app sees them. This file is used on iPhone and on the web: no ads there.
 * Android loads `ads.android.ts` in its place (same name, platform ending).
 */
import { MONEY_PREVIEW } from '../config/money';

export type VideoResult = 'earned' | 'dismissed' | 'unavailable';

export interface Ads {
  /** ask for consent where the law needs it, then get the first ads ready */
  init(): Promise<void>;
  /** show a full-screen ad if one is ready; resolves when it is closed. true = one was shown */
  showInterstitial(): Promise<boolean>;
  /** show an optional video. 'unavailable' = none was ready, so the player must not be made to wait */
  showRewarded(): Promise<VideoResult>;
  /** does the law give this player an ad-privacy form to reopen? */
  needsPrivacyOptions(): boolean;
  showPrivacyOptions(): Promise<void>;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const none: Ads = {
  init: async () => {},
  showInterstitial: async () => false,
  showRewarded: async () => 'unavailable',
  needsPrivacyOptions: () => false,
  showPrivacyOptions: async () => {},
};

/** Preview only: pretends an ad played, so the flows can be seen in a browser. */
const pretend: Ads = {
  ...none,
  showInterstitial: async () => {
    await wait(400);
    return true;
  },
  showRewarded: async () => {
    await wait(400);
    return 'earned';
  },
};

export const ads: Ads = MONEY_PREVIEW === 'ads' ? pretend : none;
