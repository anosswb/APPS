# Easy-to-read app screens (22 Nov 2026)

Why: Anass on the Dinkline v5 APK: names too tight, black buttons on a black background "merged", wants a line under every title, "I suffer to try to spot everything".

## What the sources say
| Fact | Source (read 22 Nov 2026 via Firecrawl) |
|---|---|
| Buttons, inputs and their states need **3:1 contrast against the colours next to them** (WCAG 2.1, 1.4.11 Non-text Contrast, level AA). A 14% white fill on black is about 1.4:1, so it fails. | https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html |
| Text needs 4.5:1 (normal) or 3:1 (large) against its background (WCAG 1.4.3, same family). | same |
| In dark mode, thin fonts read worse; use regular or medium weights and proper spacing. | https://medium.com/@enzoymribeiro/designing-in-the-dark-the-best-practices-for-dark-mode-ui-0ffe20057311 |
| Use soft dividers to separate content in dark mode; use size, weight and contrast for hierarchy; bold, not italics, for emphasis. | same |
| Pure black with very dark greys can strain the eye; lift surfaces a little so they separate. | same |

## What we do in Dinkline
- Secondary buttons: lighter fill plus a 1.5 pt border at about 50% white (well over 3:1 on black).
- Cards: a visible edge so each card separates from the black.
- Names in the condensed font get letter spacing so letters do not touch.
- A thin line under every screen title and section title.
- Small text stays at 65% white or more; 45% only for metadata.
