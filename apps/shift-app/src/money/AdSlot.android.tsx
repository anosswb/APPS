/**
 * Android only: one banner at the end of Calendar and Pay. Never on Today (the moment that is the product), never in the first pages.
 * TEST ads only until real AdMob IDs exist and the build sets EXPO_PUBLIC_ADS_LIVE=1. Never tap a real ad of our own app.
 */
import React from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const LIVE = process.env.EXPO_PUBLIC_ADS_LIVE === '1';
const UNIT = LIVE ? '' : TestIds.ADAPTIVE_BANNER;

export function AdSlot() {
  if (!UNIT) return null;
  return (
    <View style={{ alignItems: 'center', marginTop: 8 }}>
      <BannerAd unitId={UNIT} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} onAdFailedToLoad={(e) => console.warn('Banner did not load', e)} />
    </View>
  );
}
