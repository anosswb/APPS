/**
 * Android ads through Google AdMob. NOT yet tried on a real phone (docs/money.md).
 * Test ads are used unless the build sets EXPO_PUBLIC_ADS_LIVE=1 AND real IDs are in src/config/ad-ids.json.
 * Never tap a real ad of our own app: Google can close the account for that.
 */
import mobileAds, {
  AdEventType,
  AdsConsent,
  AdsConsentPrivacyOptionsRequirementStatus,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

import ids from '../config/ad-ids.json';
import type { Ads, AdStatus, VideoResult } from './ads';

const LIVE = process.env.EXPO_PUBLIC_ADS_LIVE === '1';
const INTERSTITIAL_ID = LIVE && ids.android.interstitialId ? ids.android.interstitialId : TestIds.INTERSTITIAL;
const REWARDED_ID = LIVE && ids.android.rewardedId ? ids.android.rewardedId : TestIds.REWARDED;

/** Test builds keep a plain-words status, shown in Settings and written to the phone log. */
const status: AdStatus = { consent: 'not asked yet', started: false, fullScreen: 'not started', video: 'not started' };
function note(change: Partial<AdStatus>): void {
  Object.assign(status, change);
  if (!LIVE) console.log('Ads status', JSON.stringify(status));
}
function words(error: unknown): string {
  const e = error as { code?: string; message?: string } | null;
  return `${e?.code ?? ''} ${e?.message ?? String(error)}`.trim().slice(0, 140);
}

/** An ad that did not load is asked for again a minute later, a few times. Without this one bad start meant no ads all session. */
const RETRY_MS = 60 * 1000;
const MAX_RETRIES = 5;
let interstitialTries = 0;
let rewardedTries = 0;

let ready = false;
let privacyOptions = false;
let interstitial: InterstitialAd | null = null;
let interstitialLoaded = false;
let rewarded: RewardedAd | null = null;
let rewardedLoaded = false;

function loadInterstitial(): void {
  interstitialLoaded = false;
  const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_ID);
  ad.addAdEventListener(AdEventType.LOADED, () => {
    interstitialLoaded = true;
    interstitialTries = 0;
    note({ fullScreen: 'ready' });
  });
  ad.addAdEventListener(AdEventType.ERROR, (error) => {
    if (interstitial !== ad || interstitialLoaded) return;
    note({ fullScreen: `did not load: ${words(error)}` });
    if (interstitialTries++ < MAX_RETRIES) setTimeout(() => interstitial === ad && !interstitialLoaded && loadInterstitial(), RETRY_MS);
  });
  note({ fullScreen: 'loading' });
  ad.load();
  interstitial = ad;
}

function loadRewarded(): void {
  rewardedLoaded = false;
  const ad = RewardedAd.createForAdRequest(REWARDED_ID);
  ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
    rewardedLoaded = true;
    rewardedTries = 0;
    note({ video: 'ready' });
  });
  ad.addAdEventListener(AdEventType.ERROR, (error) => {
    if (rewarded !== ad || rewardedLoaded) return;
    note({ video: `did not load: ${words(error)}` });
    if (rewardedTries++ < MAX_RETRIES) setTimeout(() => rewarded === ad && !rewardedLoaded && loadRewarded(), RETRY_MS);
  });
  note({ video: 'loading' });
  ad.load();
  rewarded = ad;
}

export const ads: Ads = {
  async init() {
    if (ready) return;
    let allowed = false;
    try {
      const info = await AdsConsent.gatherConsent();
      allowed = info.canRequestAds;
      note({ consent: allowed ? 'ok, ads may be asked for' : 'answered: ads may NOT be asked for' });
      privacyOptions = info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED;
    } catch (error) {
      console.warn('Consent form failed; using the last known answer', error);
      note({ consent: `failed: ${words(error)}` });
      try {
        allowed = (await AdsConsent.getConsentInfo()).canRequestAds;
        if (allowed) note({ consent: 'failed now, but an earlier answer allows ads' });
      } catch (again) {
        console.warn('No consent answer at all: no ads this session', again);
      }
    }
    if (!allowed) return;
    try {
      await mobileAds().initialize();
    } catch (error) {
      note({ fullScreen: `the ads library did not start: ${words(error)}` });
      throw error;
    }
    ready = true;
    note({ started: true });
    loadInterstitial();
    loadRewarded();
  },

  showInterstitial() {
    const ad = interstitial;
    if (!ready || !ad || !interstitialLoaded) return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      let done = false;
      const finish = (shown: boolean) => {
        if (done) return;
        done = true;
        offClosed();
        offError();
        loadInterstitial();
        resolve(shown);
      };
      const offClosed = ad.addAdEventListener(AdEventType.CLOSED, () => finish(true));
      const offError = ad.addAdEventListener(AdEventType.ERROR, () => finish(false));
      ad.show().catch((error) => {
        console.debug('Full-screen ad did not show', error);
        finish(false);
      });
    });
  },

  showRewarded() {
    const ad = rewarded;
    if (!ready || !ad || !rewardedLoaded) return Promise.resolve<VideoResult>('unavailable');
    return new Promise<VideoResult>((resolve) => {
      let done = false;
      let earned = false;
      const finish = (result: VideoResult) => {
        if (done) return;
        done = true;
        offEarned();
        offClosed();
        offError();
        loadRewarded();
        resolve(result);
      };
      // The reward counts only when Google says it was earned.
      const offEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        earned = true;
      });
      const offClosed = ad.addAdEventListener(AdEventType.CLOSED, () => finish(earned ? 'earned' : 'dismissed'));
      const offError = ad.addAdEventListener(AdEventType.ERROR, () => finish('unavailable'));
      ad.show().catch((error) => {
        console.debug('Video ad did not show', error);
        finish('unavailable');
      });
    });
  },

  needsPrivacyOptions: () => privacyOptions,

  status: () => (LIVE ? null : { ...status }),

  async showPrivacyOptions() {
    try {
      await AdsConsent.showPrivacyOptionsForm();
    } catch (error) {
      console.warn('Could not open the ad privacy form', error);
    }
  },
};
