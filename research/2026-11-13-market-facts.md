# Market and store facts — checked 13 Nov 2026

Rule for this folder: one dated file per research run. Before any web search, read the newest file here. Search again only if the fact is older than 60 days, or it decides money or a store submission. Add new findings to a NEW dated file; never edit old ones.

Trust labels: **[official]** Apple/Google page · **[report]** named industry report · **[blog]** vendor or news blog (use as a rough guide) · **[unverified]** could not confirm.

## 1. Money rails for a developer in Morocco
| Fact | Trust | Source |
|---|---|---|
| Google Play: Morocco can register as a developer but NOT as a merchant. No paid apps, no in-app purchases, no subscriptions on Android. | [official] table, re-check every 3 months | https://support.google.com/googleplay/android-developer/answer/9306917 |
| Morocco is the only MENA country without Google merchant access (local press). | [blog] | https://en.bladi.net/moroccan-tech-experts-urge-google-enable-app-monetization-morocco,86947.html |
| AdMob pays Morocco by bank transfer in dirham (already in the Gobblo money plan). | [official] | https://support.google.com/adsense/answer/1714398 |
| Apple collects Morocco's 20% VAT since Aug 2026; proceeds from buyers in Morocco are lower. Buyers elsewhere are not affected. | [official] via news | https://macdailynews.com/2026/08/27/apple-adjusts-app-store-taxes-and-prices-in-morocco-congo-tanzania-israel-and-indonesia/ |
| Which Moroccan banks Apple pays out to. | [unverified] check in App Store Connect › Business on day 1 of the account | — |
| Web checkout from Morocco (Stripe, Paddle, RevenueCat Web Billing, Dodo Payments). Only a vendor page claims Morocco support. | [unverified] do not build on it | https://dodopayments.com/blogs/merchant-of-record-morocco |

## 2. Store fees
| Fact | Trust | Source |
|---|---|---|
| Apple: 30% standard, 15% in the Small Business Program (under $1M a year). Enrol on day 1. | [official] | https://developer.apple.com/app-store/small-business-program/ |
| Apple EU: new single set of terms from 1 Oct 2026. Rates differ between reports. | [blog] conflicting | https://blog.funnelfox.com/apple-app-store-fees-2026-eu-dma/ |
| Apple US link-out commission: still in court. | [unverified] | https://www.neonpay.com/blog/apple-app-store-alternative-payment-fees-what-developers-pay-in-2026 |
| Google Play since 30 Jun 2026 (US, EEA, UK first): service fee 10% on the first $1M a year and on all auto-renewing subscriptions, plus a 5% billing fee only when Google's billing is used. | [official] | https://android-developers.googleblog.com/2026/06/play-expanded-billing.html |

## 3. Store rules that changed in 2026
| Fact | Trust | Source |
|---|---|---|
| Apple, June 2026: stricter on low-quality apps. Poorly designed apps can be removed after approval. "Don't submit apps that are indistinguishable from what's already widely available." | [blog] quoting Apple | https://macrumors.com/2026/06/09/app-store-guidelines-low-quality-apps/ |
| Apple, 16 Oct 2026: Section 5 bans apps that generate nude or sexual imagery; new rule 2.3.14 on creative assets (no discount prices in search-result and product-page art). | [official] + [blog] | https://developer.apple.com/news?id=vvzx6cul · https://ppc.land/apples-rule-2-3-14-bans-discount-prices-in-app-store-creative-assets/ |
| Google Play: a personal account made after 13 Nov 2023 needs a closed test with 12 testers opted in for 14 days in a row before production. Was 20 until 11 Dec 2024. Pausing the track resets the clock. Applies to each new app. | [official] page + [blog] details | https://support.google.com/googleplay/android-developer/answer/14151465 |
| Organisation accounts skip the 12-tester rule but need a D-U-N-S number (a registered business). | [blog] | https://www.choicely.com/blog/google-play-12-tester-rule |
| Android developer verification: required from 30 Sep 2026 in Brazil, Indonesia, Singapore, Thailand; worldwide in 2027. | [official] | https://developer.android.com/developer-verification/guides |
| US age laws: Texas enforced for new accounts since June 2026, Utah from 7 May 2026, Louisiana from 1 Jul 2026. Apple's Declared Age Range API and Google's Play Age Signals API give the age band. Court status after June not confirmed. | [blog] | https://idtechwire.com/apple-enforces-texas-app-store-age-assurance-law-after-injunction-lifted/ |

## 4. Benchmarks (planning ranges, sources disagree)
| Fact | Trust | Source |
|---|---|---|
| Puzzle games: about 32% D1, 12% D7, 5% D30. Hyper-casual: about 29% / 6% / 1.4%. | [blog] citing Mistplay | https://segwise.ai/blog/mobile-gaming-app-user-retention-strategies.md |
| All games median D1 is 22–27%. "Good" is 35 / 15 / 5. Top quarter is 40 / 20 / 10. | [blog] | https://blog.playio.co/d1-d7-d30-retention-benchmarks-2026 |
| Rewarded video eCPM: US about $16 Android, $20 iOS; tier 2–3 about $2–10. Interstitial floors: tier 2 $1–3, tier 3 $0.30–1. | [blog] several, mixed years | https://blog.playio.co/mobile-game-ecpm-benchmarks-2026 · https://revenueflex.com/blog/app-ad-revenue-benchmarks-2026 |
| Hybrid-casual games that sell things earn several times more than ads-only ones. Fewer than 30% of games use both. | [report] Sensor Tower, AppsFlyer via newsletter | https://gamedevreports.substack.com/p/sensor-tower-mobile-game-ad-monetization |
| Subscriptions (RevenueCat 2026, 115,000 apps): over 60% of trial conversions happen in week 1 and about a third on day 0; trials are getting shorter; higher-priced apps reach about 6× the one-year value; 95% of annual subscribers who cancel never return; apps launched before 2020 hold 69% of revenue. | [report] | https://www.revenuecat.com/state-of-subscription-apps-2026/ |

## 5. What people download and pay for
| Fact | Trust | Source |
|---|---|---|
| Block Blast! was the most downloaded game of 2025 (356M installs). Block and "arrow" puzzles led download charts in mid-2026. | [report] AppMagic via news | https://games.gg/news/top-mobile-games-of-2025-by-downloads/ · https://foxdata.com/en/blogs/global-mobile-game-rankings-june-2026-top-15-downloads-revenue/ |
| Puzzle took over 44% of casual-game spending in H1 2026 (about $4.9B). The most downloaded games are not the ones that earn most. | [report] AppMagic via news | https://respawn.outlookindia.com/gaming/gaming-news/top-mobile-puzzle-games-ruling-the-global-grossing-charts-in-2026 |
| In 2025 non-game apps passed games in purchase revenue for the first time. Total downloads fell 7.2%. | [report] Sensor Tower via eMarketer | https://www.emarketer.com/content/app-economy-shifts-growth-extraction |
| Fast growers: AI apps, health and fitness, productivity. Utilities are the #2 category for new launches (so, crowded). | [blog] | https://sensortower.com/blog/health-and-fitness-apps-ai |
| Localisation: Spanish, Portuguese (Brazil), French, German, Japanese, Korean give most of the gain; the first 5–6 languages bring about 80% of it. Japan, Korea and Saudi Arabia have very high revenue per user. | [blog] | https://appfollow.io/blog/app-store-optimization-localization |

## 6. Difficulty and retention research
| Fact | Trust | Source |
|---|---|---|
| Field test, 300,000+ players, 12 weeks, a match-3 style game: making the game EASIER for players about to quit raised play time and spending. | [report] Columbia Business School | https://business.columbia.edu/research-brief/digital-future/easier-games-more-revenue |
| King judges a level by time-to-pass and time-to-abandon, by player skill group, and removes bad levels. Hard is not the same as bad. | [blog] GDC talk report | https://mobilegamer.biz/how-king-defines-a-good-candy-crush-saga-level-and-why-it-constantly-prunes-the-bad-ones/ |
| Patents exist for setting the next level's difficulty from a player's predicted chance of quitting after a fail. | [official] patent | https://uspto.report/patent/app/20180243656 |

## 7. Where open-source games are listed
https://github.com/michelpereira/awesome-open-source-games · https://github.com/bobeff/open-source-games · https://github.com/akinmustafa/awesome-godot-games · https://github.com/Trilarion/opensourcegames · https://osgameclones.com · https://libregamewiki.org — a list never proves a licence. Open the LICENSE file of each project (playbook/03).

## 8. Claude Code habits (third-party guides quoting Anthropic's docs)
Context fills fast and quality drops as it fills · keep CLAUDE.md short · skills load only when needed · subagents explore in their own context and return a summary · hooks are guaranteed, CLAUDE.md is advice. https://composio.dev/content/ways-to-cut-token-consumption-in-claude-code · https://kdnuggets.com/7-practical-ways-to-reduce-claude-code-token-usage
