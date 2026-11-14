# THIRD_PARTY.md — code and fonts from others

| Project | Use | Licence (where seen) | What we must do |
|---|---|---|---|
| Expo, React Native, React and the packages in `package.json` | the app framework | MIT (each package's own LICENSE in `node_modules`) | Done: **Settings › Open-source licenses** lists every shipped package with its copyright line and the licence texts |
| Expo blank TypeScript template | project skeleton | MIT (the template's LICENSE file, removed from our folder so it is not read as OUR licence) | Listed here |
| Newsreader font, by Production Type | reading text and numbers | SIL Open Font License 1.1 (`node_modules/@expo-google-fonts/newsreader/LICENSE_FONT`) | Keep the licence text in the licences page; do not sell the font by itself |
| Libre Franklin font | small capital labels | SIL Open Font License 1.1 (`node_modules/@expo-google-fonts/libre-franklin/LICENSE_FONT`) | Same |

## The licences page
- `scripts/make-licences.js` reads the source maps of the Android, iPhone and web bundles, so it lists what is really shipped (57 packages on 14 Nov 2026: 53 MIT, 2 Apache 2.0, 1 ISC, 1 BSD 3-Clause; fonts under OFL 1.1), not the build tools.
- **Run it again after adding or updating any package** (the two commands are at the top of the script). A test fails if a package from `package.json` is missing from the list, or if a GPL-family or unknown licence appears.
- Not covered by the script: the native Android libraries that the build pulls in (AndroidX, Kotlin: Apache 2.0; Google Mobile Ads SDK: Google's own terms). They are named in one line at the bottom of the page on Android. This is from what those projects publish, not from files read here.
- Listing name, copyright line and licence text is the usual practice for apps. It is not legal advice.

**The puzzle engine is our own code,** written from the rules of the puzzle. No code was copied from any other project. The Tents puzzle is a generic logic puzzle; our name, look, text and levels are our own.
