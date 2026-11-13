# 08 — App Store and Google Play rules

Apps are rarely rejected for code. They are rejected for what is around it: the listing, the privacy answers, the paywall, a copied idea. Checked 13 Nov 2026; sources and trust labels are in `research/`. **Before each submission, open the two official pages and read the change notes:** https://developer.apple.com/app-store/review/guidelines/ and https://play.google/developer-content-policy/ (the Play policy centre). Use `/release-check` to run this page.

## New in 2026 (the things an older guide will not tell you)
- **Apple, June 2026: low-quality and look-alike apps.** Apple can now remove a poorly designed app after approval, and says not to submit apps "indistinguishable from what's already widely available". Our rule of one world and one signature per app is also our protection here. Put the twist in the first screenshot and in the review notes.
- **Apple, Oct 2026:** rule 2.3.14, no discount prices in store art; Section 5, no apps that generate sexual imagery.
- **Google Play, since late 2023, still true:** a new personal account must run a closed test with **12 testers opted in for 14 days in a row** before each app can go to production. Details below.
- **Google developer verification:** identity checks are rolling out (four countries since 30 Sep 2026, the world in 2027). Keep the legal name, address and ID in Play Console exact and the same everywhere.
- **Age laws in some US states** (Texas, Utah, Louisiana): the stores now pass an age band to apps through Apple's Declared Age Range API and Google's Play Age Signals API. For a general-audience app with no mature content and no chat, the usual answer is: set the age rating honestly and do not target children. Read the current developer page before launch; the court cases were still moving in mid-2026.
- **Morocco VAT:** Apple takes 20% VAT on sales to buyers in Morocco since Aug 2026. Our buyers are in the US, so this hardly touches us.
- **US rules that matter because we target the US:** no fake reviews or paid-for ratings, "free" must be true, subscriptions need a clear price and an easy cancel, no data from children under 13, and state privacy laws. Our defaults already fit: no accounts, data on the phone, no children's apps, honest listings.

## Apple: the rules that reject small apps
| Rule | What we do |
|---|---|
| 4.2 Minimum functionality | Real native screens and real features. No web page in a wrapper. |
| 4.3 Spam and copies; "indistinguishable" | Own name, art, text, levels. No competitor names anywhere. One signature. No ten near-identical apps from one account: different apps must be truly different. |
| 4.1 Copycats | Never use another app's or brand's name, icon or look. |
| 2.1 App completeness | No crashes, no placeholder text, no dead buttons, no "coming soon". Works without an account. Give a demo login if one exists. |
| 2.3 Accurate metadata | Screenshots show the real app. No prices or "sale" in images. No other platform names ("Android") in text. No keyword stuffing. |
| 3.1.1 In-app purchase | Everything digital is sold through Apple's purchase system. Restore Purchases on the paywall and in Settings. Random rewards must show odds (we avoid them). |
| 3.1.2 Subscriptions | Price per period, what you get, renewal terms, Terms and Privacy links on the paywall and in the listing. Value must be ongoing. |
| 5.1.1 Privacy | Privacy policy link in the app and in the listing. Ask a permission only when needed, with a real reason. If there are accounts, deleting the account in the app is required. |
| 5.1.2 Tracking | No tracking without the system prompt. No ads on iPhone means no prompt. |
| Privacy manifest and labels | Declare what every SDK collects. Labels, manifest and policy must say the same thing. |
| 1.4 / 5.1.3 Health | No medical claims ("treats", "cures", "clinically proven"). |
| 1.3 / Kids | Do not enter the Kids category. Do not design for under 13. |
| 5.3 Gambling, contests | No real-money play, no prizes. |
| 5.2 Intellectual property | Every picture, sound, font and line of text is ours or licensed. Keep `RIGHTS.md`. |
| Ratings | Only the system rating prompt, never in the first session, no reward for a review. |
| Review notes | Say: no login needed, where the paywall is, what makes the app different, how to test the purchase. |

## Google Play: the rules that reject or suspend small apps
| Rule | What we do |
|---|---|
| **Closed test, 12 testers, 14 days** | Keep a standing group of 15–20 real people with Android phones (family, friends, co-workers, a WhatsApp group). Add all of them on day 1; some will forget to opt in. Do not pause the test (it resets the clock). Ship 2–3 updates during the test and collect feedback: Google asks what you learned. Start the test as soon as the app runs, weeks before it is "ready". |
| Organisation account | Skips the tester rule but needs a registered business and a D-U-N-S number. Worth it once there is income. |
| Target API level | Always the newest required level (the Expo default for the current SDK). |
| Data safety form | Filled for every app, also with "no data". Must match the privacy policy and every SDK (AdMob, analytics, crash reports). |
| Ads policy | No ad that surprises or blocks the user, none near buttons, full-screen ads only at breaks and closable, rewarded ads optional. "Contains ads" declared. |
| Families policy | Target age 13+ in Play Console. Nothing in the listing that attracts children (it can pull the app into the Families rules). |
| Consent | Google's consent form before ads in Europe and the UK; a "Privacy options" row in Settings. |
| Permissions | Only what the feature needs. Explain before the system prompt. |
| Impersonation, IP | Same as Apple: own name, own icon, own content. |
| Repetitive content | Several near-identical apps from one account can be removed. One world per app also covers this. |
| Payments | No purchases on Android (Morocco). Do not link out to buy digital things either. |
| Invalid ad traffic | Never tap our own ads, never ask anyone to. Test devices registered. This can close the AdMob account for good. |
| Account health | One account, real identity, answer every policy email within the deadline. A suspended account takes all apps with it. |

## Both stores: things that must exist before submission
- [ ] Privacy policy and terms pages live on the web, linked in the app and the listing.
- [ ] Support email that someone reads.
- [ ] Age rating questionnaire answered honestly.
- [ ] Every third-party asset logged with licence (`RIGHTS.md`, `THIRD_PARTY.md`).
- [ ] No medical, money or "guaranteed" claims in the app or the listing.
- [ ] No competitor or brand names in title, keywords, description, screenshots, code strings.
- [ ] Listing text and screenshots match the real app today.
- [ ] Tested on a small phone and a big one, light and dark, airplane mode, font size at maximum.
- [ ] iPhone: purchase, restore and price display tested with a sandbox account. No "Android" in any text.
- [ ] Android: test ad IDs in every build except the store build; consent form tested as a European user; data safety and ads declared.
- [ ] No rating prompt in the first session.

## If an app is rejected
Read the exact rule number. Fix only that. Reply politely in the Resolution Centre with what changed and where to see it. Do not resubmit unchanged. Write the cause in `playbook/13` so it never happens again.
