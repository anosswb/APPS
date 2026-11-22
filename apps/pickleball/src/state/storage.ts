// Saving on the phone. Two keys: the running session (+ phone prefs) and the history (past sessions,
// goals, awards already shown). Both versioned; old saves are upgraded by `migrate`, never dropped.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_GOALS, Goal } from '../logic/goals';
import type { SessionRecord } from '../logic/history';
import { DEFAULT_SETTINGS, newSession, Session } from '../logic/session';

const KEY = 'dinkline.session';
const HISTORY_KEY = 'dinkline.history';
export const SCHEMA = 2;
export const HISTORY_SCHEMA = 1;

export type ThemeChoice = 'system' | 'dark' | 'light';

export interface Prefs {
  haptics: boolean;
  keepAwake: boolean;
  /** Say the next game out loud when a court opens. */
  voice: boolean;
  theme: ThemeChoice;
  /** Version of the look settings. 2 = dark became the default (22 Nov 2026). */
  lookV: number;
}
export const DEFAULT_PREFS: Prefs = { haptics: true, keepAwake: true, voice: true, theme: 'dark', lookV: 2 };

/** Old prefs had "Auto" as the default; Anass chose dark as the main look, so they move to dark once. */
export function upgradePrefs(raw: Partial<Prefs> | undefined): Prefs {
  const p = { ...DEFAULT_PREFS, ...raw };
  if ((raw?.lookV ?? 0) < 2) return { ...p, theme: 'dark', lookV: 2 };
  return p;
}

interface Saved {
  v: number;
  session: Session;
  prefs: Prefs;
}

/** What the host adds to a session to make it a post: where it was, and a photo (a file on this phone). */
export interface PostMeta {
  place?: string;
  photo?: string;
}

export interface History {
  sessions: SessionRecord[];
  goals: Goal[];
  /** Award ids already celebrated, so the banner shows once. */
  seen: string[];
  /** Place and photo per session id (the running session too). */
  meta: Record<string, PostMeta>;
  /** Places typed before, newest first, offered again. */
  places: string[];
}
export const emptyHistory = (now: number): History => ({ sessions: [], goals: DEFAULT_GOALS(now), seen: [], meta: {}, places: [] });

export const MAX_PLACE = 40;

/** Set the place of a session and remember it (newest first, no duplicates, at most 8). */
export function withPlace(h: History, sessionId: string, raw: string): History {
  const place = raw.replace(/\s+/g, ' ').trim().slice(0, MAX_PLACE);
  const meta = { ...h.meta, [sessionId]: { ...h.meta[sessionId], place: place || undefined } };
  const places = place ? [place, ...h.places.filter((p) => p.toLowerCase() !== place.toLowerCase())].slice(0, 8) : h.places;
  return { ...h, meta, places };
}

export function withPhoto(h: History, sessionId: string, photo: string | undefined): History {
  return { ...h, meta: { ...h.meta, [sessionId]: { ...h.meta[sessionId], photo } } };
}

/** Version 1 → 2: sessions get an id and a start time; results get start time, target and comeback depth. */
export function migrate(data: { v: number; session: Record<string, unknown> }): Session {
  const s = data.session as unknown as Session & { id?: string; startedAt?: number | null };
  if (data.v >= 2) return s;
  const results = (s.results ?? []).map((r) => ({ ...r, startedAt: r.startedAt ?? r.endedAt, target: r.target ?? s.settings?.scoring?.target ?? 11, maxDeficit: r.maxDeficit ?? 0 }));
  const firstGame = [...(s.courts ?? []).flatMap((g) => (g ? [g.startedAt] : [])), ...results.map((r) => r.startedAt)];
  return { ...s, id: s.id ?? `s${(firstGame.length ? Math.min(...firstGame) : 0).toString(36)}`, startedAt: firstGame.length ? Math.min(...firstGame) : null, results };
}

/** Turns stored text back into a session. Unknown or broken data gives a fresh session (and says why). */
export function parseSaved(raw: string | null): { session: Session; prefs: Prefs; problem?: string } {
  if (!raw) return { session: newSession(), prefs: DEFAULT_PREFS };
  try {
    const data = JSON.parse(raw) as Saved;
    if (!data || typeof data.v !== 'number' || data.v > SCHEMA || data.v < 1 || !data.session || !Array.isArray(data.session.queue)) {
      return { session: newSession(), prefs: DEFAULT_PREFS, problem: `unknown saved version ${String(data?.v)}` };
    }
    const session = migrate(data as unknown as { v: number; session: Record<string, unknown> });
    return {
      session: { ...session, settings: { ...DEFAULT_SETTINGS, ...session.settings } },
      prefs: upgradePrefs(data.prefs),
    };
  } catch (e) {
    return { session: newSession(), prefs: DEFAULT_PREFS, problem: `saved data unreadable: ${String(e)}` };
  }
}

export function parseHistory(raw: string | null, now: number): { history: History; problem?: string } {
  if (!raw) return { history: emptyHistory(now) };
  try {
    const data = JSON.parse(raw) as { v: number } & History;
    if (data.v !== HISTORY_SCHEMA || !Array.isArray(data.sessions)) return { history: emptyHistory(now), problem: `unknown history version ${String(data.v)}` };
    return {
      history: {
        sessions: data.sessions,
        goals: Array.isArray(data.goals) ? data.goals : DEFAULT_GOALS(now),
        seen: Array.isArray(data.seen) ? data.seen : [],
        meta: data.meta && typeof data.meta === 'object' ? data.meta : {},
        places: Array.isArray(data.places) ? data.places : [],
      },
    };
  } catch (e) {
    return { history: emptyHistory(now), problem: `history unreadable: ${String(e)}` };
  }
}

export async function load() {
  const [raw, rawHistory] = await Promise.all([AsyncStorage.getItem(KEY), AsyncStorage.getItem(HISTORY_KEY)]);
  const out = parseSaved(raw);
  if (out.problem) console.warn(`[storage] ${out.problem}; starting a fresh session`);
  const h = parseHistory(rawHistory, Date.now());
  if (h.problem) console.warn(`[storage] ${h.problem}; starting a fresh history`);
  return { ...out, history: h.history };
}

export async function save(session: Session, prefs: Prefs): Promise<void> {
  const data: Saved = { v: SCHEMA, session, prefs };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.warn(`[storage] could not save: ${String(e)}`);
  }
}

export async function saveHistory(history: History): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify({ v: HISTORY_SCHEMA, ...history }));
  } catch (e) {
    console.warn(`[storage] could not save the history: ${String(e)}`);
  }
}
