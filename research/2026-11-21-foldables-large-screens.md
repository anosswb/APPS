# Foldables and large screens: store rules (checked 21 Nov 2026)

Web check by a helper agent. [official] = the store's own page. Re-check before the first store build.

| Fact | Trust | Link |
|---|---|---|
| Google Play: new apps and updates must target Android 16 (API 36) since 31 Aug 2026 | [official] (search snippet) | https://support.google.com/googleplay/android-developer/answer/11926878 |
| API 36 ignores portrait lock, `resizeableActivity` and aspect-ratio limits on screens with smallest width >= 600dp (open foldables, tablets). So a portrait-locked app WILL rotate there | [official] | https://developer.android.com/develop/adaptive-apps/guides/app-orientation-aspect-ratio-resizability |
| Exceptions: screens under 600dp (phones keep the lock), games that declare `android:appCategory="game"`, users who choose the app default. API 37 removes the opt-out | [official] | same |
| Games: 3+ foldable screenshots plus 1 phone screenshot on the store page from Apr 2027 | [official], blog post 18 Nov 2026 | https://developer.android.com/blog/posts/elevating-game-quality-foldables-large-screens-google-play |
| Games must meet large-screen Tier 3 ("Ready") from Aug 2027, or Play blocks new games and updates | [official], same post | same |
| Tier 3 for a portrait game: do not lock orientation on open foldables, work in landscape, fill 1:1 and 10:9 inner screens, pillarbox cleanly on 4:3 and 16:10, keep state through fold, unfold and resize, playable in 50/50 split screen | [official] | https://developer.android.com/games/large-screen/tier-3 |
| Games below Tier 3 on a device "might not appear in search results" unless searched by name | [official], undated | https://developer.android.com/games/large-screen/build-large-screen-games |
| Apple iPhone Duo (foldable): on sale since 23 Oct 2026, 7.6" inner screen, iOS 27 | [official] | https://www.apple.com/newsroom/2026/09/apple-unveils-iphone-duo/ |
| On iPhone Duo, apps built with an SDK older than iOS 27 run letterboxed; iOS 27 SDK apps resize, iOS 27.1 SDK edge to edge | [official] (summary) | https://developer.apple.com/iphone-duo/prepare/ |
| App Store uploads need Xcode 26+ / iOS 26 SDK since 28 Apr 2026 | [official] | https://developer.apple.com/news/upcoming-requirements/ |
| `UIRequiresFullScreen` is deprecated and will be ignored | [official] | TN3192 |
| An app that supports iPad needs at least one 13-inch iPad screenshot (2064 x 2752) | [official] | https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications |

Not found: a date when the iOS 27 SDK becomes required; any new App Review rule about foldables.
