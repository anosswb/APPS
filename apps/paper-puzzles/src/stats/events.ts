/**
 * The closed list of things the app may count. Nothing typed by a person, no names, no location:
 * only event names from this list, with numbers, true/false, or words from the lists below.
 * `clean` throws away anything else, and a test proves it.
 */
export const EVENTS = {
  app_open: [],
  rules_seen: [],
  puzzle_start: ['kind', 'size', 'grade', 'level'],
  puzzle_solved: ['kind', 'size', 'grade', 'level', 'seconds', 'hints'],
  hint_used: ['kind', 'what'],
  past_puzzles_open: [],
  video_result: ['result'],
  ad_shown: [],
  full_edition_view: ['from'],
  full_edition_bought: [],
  setting_changed: ['name', 'value'],
} as const;

export type EventName = keyof typeof EVENTS;

/** Every word a text value may be. Anything else is dropped. */
const WORDS = new Set([
  'daily', 'book', 'past',
  'easy', 'medium', 'hard',
  'mistake', 'step', 'reveal', 'solved',
  'noTree', 'tentTouch', 'lineFull', 'lineAllTents', 'treeLast', 'treeDone', 'treeNeeds', 'fitTents', 'fitGrass', 'fitShadow', 'contradiction',
  'touch', 'over', 'wrong',
  'earned', 'dismissed', 'unavailable',
  'home', 'calendar', 'book_end',
  'theme', 'sound', 'haptics', 'stats',
  'system', 'light', 'dark', 'on', 'off',
]);

export type Props = Record<string, string | number | boolean | undefined>;

/** Keep only what the list allows for this event. Returns null for an unknown event. */
export function clean(event: string, props: Props = {}): Record<string, string | number | boolean> | null {
  if (!Object.prototype.hasOwnProperty.call(EVENTS, event)) return null;
  const allowed: readonly string[] = EVENTS[event as EventName];
  const out: Record<string, string | number | boolean> = {};
  for (const key of allowed) {
    const v = props[key];
    if (typeof v === 'boolean') out[key] = v;
    else if (typeof v === 'number' && Number.isFinite(v)) out[key] = Math.round(v);
    else if (typeof v === 'string' && WORDS.has(v)) out[key] = v;
  }
  return out;
}

/** The message sent to the numbers service. No person profile is ever made. */
export function payload(apiKey: string, id: string, event: EventName, props: Props, base: { platform: string; version: string }, at: Date) {
  const safe = clean(event, props);
  if (!safe) return null;
  return {
    api_key: apiKey,
    event,
    distinct_id: id,
    timestamp: at.toISOString(),
    properties: { ...safe, platform: base.platform, app_version: base.version, $process_person_profile: false },
  };
}
