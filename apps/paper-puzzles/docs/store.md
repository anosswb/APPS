# Store — Paper Pines

Full rules: `playbook/08-store-policies.md` at the repo root. This file holds what is specific to this app.

- **Name:** "Paper Pines" is a working title. A web search found no app or brand with that name; the stores and the trademark databases have NOT been checked yet (they were not reachable from the cloud session). Check them by hand before the listing is made.
- **Category:** Games › Puzzle. Age rating: lowest (no violence, no chat, no user content).
- **Data collected today:** the app itself collects nothing. **Android has Google's ads library (AdMob):** in the Play Console say "Contains ads: yes", declare the advertising ID, and fill the Data safety form with what the AdMob library collects (device or other IDs, app interactions, diagnostics; purpose: advertising). iPhone has no ads library and no tracking prompt.
- **Permissions:** Android gets internet access and the advertising ID permission from the ads library, and the notification permission for the daily reminder (asked only after the player says yes in the app; Android 13 and later show their own prompt). The reminder needs no "exact alarm" permission: without it Android may deliver a note a few minutes late, which is fine here, and no extra Play declaration is needed. No push service is used: iPhone remote notifications are switched off in `app.json` (`enableRemoteNotifications: false`), so no push entitlement is requested.
- **Notification rules (both stores):** opt-in only, one a day, about the puzzle itself, never an ad or a sale. Keep it that way: Apple rule 4.5.4 forbids promotional notes without a separate consent.
- **Look-alike risk (Apple, June 2026):** several Tents apps exist. Ours differs in look (newspaper), in promise (logic only, proven by tests), in hints (explained) and in money (pay once). Say this in the review notes and show it in the first screenshot.
- **Fonts and code we use:** see `THIRD_PARTY.md`. All drawings are our own (`RIGHTS.md`).
- **Drafts exist** in `store/` (listing, privacy, terms). Still to do: put the two pages on the web and their links in `src/config/money.ts`, a support email, real search-word research, screenshots.
- **Android closed test:** not started (needs the Play account). 12 testers for 14 days.
