// Ads as the rest of the app sees them. This file is used on iPhone and the web: no ads there.
// Android loads ads.android.tsx in its place.
export async function initAds(): Promise<void> {}

export function AdBanner(_: { place: 'players' | 'settings' }) {
  return null;
}
