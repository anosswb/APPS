// Android ads through Google AdMob: one small banner on Players and Settings only (rules.ts).
// TEST ads only: the real unit id comes later, after Anass makes the AdMob account. Never tap a real ad of our own app.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import mobileAds, { AdsConsent, BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { bannerAllowed } from './rules';
import { color } from '../theme/tokens';

let allowed = false;

export async function initAds(): Promise<void> {
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
}

export function AdBanner({ place }: { place: 'players' | 'settings' }) {
  const [failed, setFailed] = useState(false);
  if (!allowed || failed || !bannerAllowed('android', place)) return null;
  return (
    <View style={s.slot}>
      <BannerAd
        unitId={TestIds.ADAPTIVE_BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={(e) => {
          console.warn(`[ads] banner did not load: ${String(e?.message ?? e)}`);
          setFailed(true);
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({ slot: { alignItems: 'center', backgroundColor: color.ground, borderTopWidth: 1, borderColor: color.hair } });
