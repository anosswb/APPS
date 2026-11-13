# 02 — Finding app ideas that can earn

An idea is good when four things are true: people already want it, we can earn from it with our money rails, one person can build it without a server, and we can be visibly better or different. Use `/find-ideas` to run this page and `/score-idea` to score one idea.

**Market rule: United States first, English only.** No idea for Arabic speakers and none built around Morocco. An idea must make sense to an American who has never left the US.

## Step 1 — Start from where the money already is
Do not look for an empty market. No competitors usually means no money. Look for a market where **small teams already earn** and the top apps are **old, ugly, overpriced or missing a language**.

Places to look (all free):
| Where | What to look for |
|---|---|
| App Store and Google Play top charts for the **United States**, per category | Apps in the top 200 made by a person or a tiny studio. Open their other apps too. |
| Store search suggestions (type a word, read the dropdown) | These are real searches. Write them down word for word. |
| 1–3 star reviews of the leaders | "I would pay if…", "why is … behind a paywall", "too many ads", "it lost my data". Each is a product brief. |
| The "newest" tab of reviews after a big update | A redesign or a new subscription makes angry users who want a new home. |
| Reddit, Facebook groups, Discord, forum threads for one job or hobby | "Is there an app for…", "I use a spreadsheet for…", "I still use paper for…" |
| Etsy, Gumroad, Notion template shops | A paper planner or spreadsheet that sells well is an app idea with proof. |
| GitHub: open-source games and small tools with many stars and no good phone app | See playbook/03. |
| Old phone games and old web games | A mechanic that was loved, with no good modern version. |
| Anass's own working life | The shift, the site, the machines, the commute. Problems that designers in offices never see. Then check that American workers have the same problem. |
| The US calendar | New Year, tax season (April), summer, back to school, hunting and fishing seasons, Thanksgiving, the holidays. Build 3 months before. |

## Step 2 — Prove demand before any design (2 hours, not 2 weeks)
For each idea collect:
1. **Search proof:** 5+ real US store search phrases for it (from the dropdown, store set to the United States).
2. **Money proof:** 3 competitors that clearly earn (ads everywhere, a paywall, "in-app purchases" listed, long life, many ratings).
3. **Pain proof:** 15+ real review quotes with links, sorted by theme. Use `/mine-reviews`.
4. **Gap proof:** one sentence. "They all … and nobody …"
No proof for one of the four: the idea waits in IDEAS.md under "needs proof".

## Step 3 — Score it (0 to 5 each, total 40)
| | 0 | 5 |
|---|---|---|
| **Demand** | no searches, no competitors | many searches, several earning competitors |
| **Money fit** | only works with Android purchases (we have none) | earns from ads on Android AND a purchase on iPhone |
| **Build cost** | needs a server, accounts, content team | offline, generated content, 3–4 weeks |
| **Gap** | leaders are excellent and loved | leaders are old, ugly, hated or missing a market |
| **Edge** | anyone could do it | Anass knows these users and their work |
| **Reach** | a small group in the US | millions of people in the US, and easy to take to other countries later |
| **Risk** (reversed) | health, kids, money, copyright, betting | no sensitive data, original content |
| **Habit** | used once | opened every day |

28 or more: build a one-page brief. 22–27: needs a twist. Under 22: drop it. **Gap or Edge must be 3 or more:** a high total with Gap 1 and Edge 1 is a copy of a crowded hit, and it waits for a twist. Always write WHY for each score, and mark each score as proof (P) or guess (G).

## Step 4 — The twist (this is the "special thing")
Every app needs one sentence that starts with "the only one that…". Ways to find it:
- **Move it to a new audience:** the same mechanic for night-shift workers, for truck drivers, for people over 55.
- **Remove the most hated thing:** no account, no subscription, no ads in the middle of play, works offline.
- **Add a body:** a sound, a material, a character, a physical feeling that the others do not have.
- **Change the unit:** one puzzle a day; 2 minutes; one hand; no reading.
- **Join two things** that are never together (a calculator that is also a diary; a puzzle set on a loading dock).
If the sentence could be said by a competitor, it is not a twist.

## Step 5 — Test before building
- A store-style screenshot set and a title, shown to 10 people from the target group: "Would you install this? What do you think it does?"
- A 20-person simulated panel is fine for finding objections (`founder-skill:founder-consumer`), but it is not proof. Say so.
- For a game: a playable prototype of ONE level in a day. If it is not fun in grey boxes, art will not save it.

## Traps
- **Trend chasing.** When a mechanic is #1 on the charts there are already 200 copies, and Apple now rejects apps "indistinguishable from what's already widely available" (research/, June 2026). Take the mechanic only with a real twist.
- **"AI wrapper".** Costs money per user, weak retention (RevenueCat 2026: AI apps earn more per payer but lose users faster), and needs a server.
- **Ads-only tools.** A utility opened once a week earns almost nothing from ads (`python3 tools/roi.py`, line F). Tools must earn from iPhone purchases; ads suit games and daily habits.
- **Kids' apps.** Extra store rules, almost no ads allowed, parents pay rarely. Not now.
- **Brand names.** No football club logos, no famous game names, no "… for WhatsApp".
