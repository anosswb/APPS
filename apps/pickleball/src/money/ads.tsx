// Ads as the rest of the app sees them. This file is used on iPhone and the web: no ads there.
// Android loads ads.android.tsx in its place.
export async function prepareAds(): Promise<void> {}

/** Shows the after-game ad if one is loaded. Returns true when it was shown. */
export function showGameAd(): boolean {
  return false;
}
