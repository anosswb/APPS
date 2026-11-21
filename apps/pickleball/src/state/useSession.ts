// The app's single state: the session, the last 30 states for Undo, the phone prefs, and saving.
import { useCallback, useEffect, useRef, useState } from 'react';
import { newSession, Session } from '../logic/session';
import { DEFAULT_PREFS, load, Prefs, save } from './storage';

const HISTORY = 30;

export function useSession() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session>(() => newSession());
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const history = useRef<Session[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    let alive = true;
    load().then((out) => {
      if (!alive) return;
      setSession(out.session);
      setPrefs(out.prefs);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => save(session, prefs), 250);
    return () => clearTimeout(id);
  }, [session, prefs, ready]);

  /** Apply a change. Changes that return the same session are ignored (nothing to undo). */
  const act = useCallback((change: (s: Session, now: number) => Session) => {
    setSession((s) => {
      const next = change(s, Date.now());
      if (next === s) return s;
      history.current = [...history.current.slice(-(HISTORY - 1)), s];
      setCanUndo(true);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    const prev = history.current.pop();
    setCanUndo(history.current.length > 0);
    if (prev) setSession(prev);
  }, []);

  return { ready, session, act, undo, canUndo, prefs, setPrefs };
}
