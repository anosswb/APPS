# Foldable phones and large screens: what the stores ask now (21 Nov 2026)

Checked with web search on 21 Nov 2026. "page" = official developer page in the results; "blog" = third-party.

## Android / Google Play
- Apps that target Android 16 (API 36) cannot lock orientation, resizing or aspect ratio on screens 600 dp wide or more (tablets, unfolded foldables). `screenOrientation`, `resizeableActivity`, `minAspectRatio`, `maxAspectRatio` are ignored there. Games are exempt; narrow screens keep the lock. (page: https://developer.android.com/about/versions/16/behavior-changes-16)
- Google Play has required target API 36 for new apps and updates on phones, tablets and foldables since 31 Aug 2026 (several blogs; one says an extension to 1 Nov 2026 existed). (blog: https://ecorpit.com/android-target-api-36-play-store-deadline-migration-2026/)
- The temporary opt-out disappears when targeting API 37 (one blog says Play requires API 37 from Aug 2027: not confirmed).
- Expo's app.json has no switch to opt out (blog: https://rorklab.net/en/articles/app-dev/android-16-large-screen-orientation-override-expo-manifest-property). So the app must simply work wide and in landscape.

## Apple
- First foldable iPhone ("iPhone Duo"): 5.4-inch outer and 7.6-inch inner screen, shipped 23 Oct 2026 with iOS 27.1 (several sources).
- Apple's guidance: resize to the container (no fixed screen sizes), handle size changes while running, side bars in some poses. (page: https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo.md)
- No official App Store deadline for fold support found. Apps that do not adapt run "like iPhone apps on iPad".

## What the Shift app does about it (21 Nov 2026)
Content keeps a readable width and is centered on wide screens; the tab bar is centered; orientation is no longer locked; checked at phone, unfolded (840×700) and landscape sizes in the browser.
