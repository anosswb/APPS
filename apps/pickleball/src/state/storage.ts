// Saving the session on the phone. Versioned so a later app version can migrate old data.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS, newSession, Session } from '../logic/session';

const KEY = 'dinkline.session';
export const SCHEMA = 1;

export interface Prefs {
  haptics: boolean;
  keepAwake: boolean;
}
export const DEFAULT_PREFS: Prefs = { haptics: true, keepAwake: true };

interface Saved {
  v: number;
  session: Session;
  prefs: Prefs;
}

/** Turns stored text back into a session. Unknown or broken data gives a fresh session (and says why). */
export function parseSaved(raw: string | null): { session: Session; prefs: Prefs; problem?: string } {
  if (!raw) return { session: newSession(), prefs: DEFAULT_PREFS };
  try {
    const data = JSON.parse(raw) as Saved;
    if (data.v !== SCHEMA || !data.session || !Array.isArray(data.session.queue)) {
      return { session: newSession(), prefs: DEFAULT_PREFS, problem: `unknown saved version ${String(data.v)}` };
    }
    return {
      session: { ...data.session, settings: { ...DEFAULT_SETTINGS, ...data.session.settings } },
      prefs: { ...DEFAULT_PREFS, ...data.prefs },
    };
  } catch (e) {
    return { session: newSession(), prefs: DEFAULT_PREFS, problem: `saved data unreadable: ${String(e)}` };
  }
}

export async function load() {
  const raw = await AsyncStorage.getItem(KEY);
  const out = parseSaved(raw);
  if (out.problem) console.warn(`[storage] ${out.problem}; starting a fresh session`);
  return out;
}

export async function save(session: Session, prefs: Prefs): Promise<void> {
  const data: Saved = { v: SCHEMA, session, prefs };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.warn(`[storage] could not save: ${String(e)}`);
  }
}
