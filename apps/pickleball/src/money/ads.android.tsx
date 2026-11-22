// Android ads through Google AdMob: one full-screen ad after a game, when rules.ts says so. No banner.
// TEST ads only: the real unit id comes later, after Anass makes the AdMob account. Never tap a real ad of our own app.
import mobileAds, { AdEventType, AdsConsent, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

let allowed = false;
let started = false;
let ad: InterstitialAd | null = null;
let loaded = false;

function loadNext() {
  if (!allowed) return;
  loaded = false;
  ad = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);
  ad.addAdEventListener(AdEventType.LOADED, () => {
    loaded = true;
  });
  ad.addAdEventListener(AdEventType.ERROR, (e) => {
    console.warn(`[ads] after-game ad did not load: ${String(e?.message ?? e)}`);
    loaded = false;
  });
  // Get the next one ready as soon as this one is closed.
  ad.addAdEventListener(AdEventType.CLOSED, loadNext);
  ad.load();
}

/** Asks for consent (once) and loads the first ad. Called when the first game of the session ends. */
export async function prepareAds(): Promise<void> {
  if (started) return;
  started = true;
  try {
    const info = await AdsConsent.gatherConsent();
    allowed = info.canRequestAds;
  } catch (e) {
    console.warn(`[ads] consent form failed: ${String(e)}`);
    try {
      allowed = (await AdsConsent.getConsentInfo()).canRequestAds;
    } catch (again) {
      console.warn(`[ads] no consent answer, no ads this session: ${String(again)}`);
      allowed = false;
    }
  }
  if (!allowed) return;
  await mobileAds().initialize();
  console.log('[ads] started (test ads)');
  loadNext();
}

/** Shows the after-game ad if one is loaded. Returns true when it was shown. */
export function showGameAd(): boolean {
  if (!allowed || !ad || !loaded) return false;
  loaded = false;
  ad.show().catch((e) => console.warn(`[ads] after-game ad did not show: ${String(e)}`));
  return true;
}
