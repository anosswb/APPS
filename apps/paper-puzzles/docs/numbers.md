# Numbers — anonymous usage counts

So we can see if people come back, and where they stop. Off until a key exists.

## What is sent
Only events from the closed list in `src/stats/events.ts`, with numbers, true/false, or words from a fixed list. A test proves that free text, names and unknown events are thrown away. No person profile, no advertising ID, no location. A random 32-character id, made on the phone, joins one phone's events together; it names nobody.

| Event | Tells us |
|---|---|
| `app_open` | day-1, day-7, day-30 return |
| `puzzle_start`, `puzzle_solved` (kind, size, grade, level, seconds, hints) | **the one number: puzzles finished on day 1**; where people stop in the Book |
| `hint_used` (which kind of step) | which thinking steps are too hard |
| `rules_seen`, `past_puzzles_open` | what people look for |
| `video_result`, `ad_shown` | whether ads work and how often |
| `full_edition_view`, `full_edition_bought` | whether the unlock sells |
| `setting_changed` | what people switch off |
| `reminder_answer` (yes / no / blocked), `reminder_open` | how many accept the daily note, and whether the note brings them back |

## The switch
Settings › "Share anonymous numbers" (on by default, shown only when the build has a key). Off means nothing is sent.

## To turn it on (Anass, free)
1. posthog.com › sign up › choose the **EU** region › create a project named Paper Pines.
2. **Settings › Project › Project API key**: copy it (starts with `phc_`). It is a public key; it can only send events.
3. GitHub › the repo › **Settings › Secrets and variables › Actions › New repository secret** › name `EXPO_PUBLIC_POSTHOG_KEY` › paste the key.
4. Tell Claude. The test-build workflow then passes the key into the build.

## Store forms once it is on
- Google Play Data safety: "App activity (app interactions)" collected, not shared, for analytics, not linked to identity, optional (the user can switch it off).
- Apple privacy label: "Usage Data › Product Interaction", not linked to the user, not used for tracking.
- The privacy page (`store/privacy.md`) already describes it.
