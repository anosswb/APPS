// The app's single state: the session, the last 30 states for Undo, the history (past sessions, goals,
// awards already shown), the phone prefs, and saving.
import { useCallback, useEffect, useRef, useState } from 'react';
import { toRecord } from '../logic/history';
import { newSession, Session } from '../logic/session';
import { DEFAULT_PREFS, emptyHistory, History, load, Prefs, save, saveHistory } from './storage';

const HISTORY = 30;

export function useSession() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session>(() => newSession());
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [history, setHistoryState] = useState<History>(() => emptyHistory(0));
  const undoStack = useRef<Session[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    let alive = true;
    load()
      .then((out) => {
        if (!alive) return;
        setSession(out.session);
        setPrefs(out.prefs);
        setHistoryState(out.history);
        setReady(true);
      })
      .catch((e) => {
        console.warn(`[storage] load failed, starting fresh: ${String(e)}`);
        if (alive) setReady(true);
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

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => saveHistory(history), 400);
    return () => clearTimeout(id);
  }, [history, ready]);

  /** Apply a change. Changes that return the same session are ignored (nothing to undo). */
  const act = useCallback((change: (s: Session, now: number) => Session) => {
    setSession((s) => {
      const next = change(s, Date.now());
      if (next === s) return s;
      undoStack.current = [...undoStack.current.slice(-(HISTORY - 1)), s];
      setCanUndo(true);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    const prev = undoStack.current.pop();
    setCanUndo(undoStack.current.length > 0);
    if (prev) setSession(prev);
  }, []);

  /** Save the running session into the history, then start the next one (fresh start or end of session). */
  const closeSession = useCallback((next: (s: Session, now: number) => Session) => {
    setSession((s) => {
      const rec = toRecord(s);
      if (rec) setHistoryState((h) => ({ ...h, sessions: [...h.sessions.filter((x) => x.id !== rec.id), rec] }));
      undoStack.current = [];
      setCanUndo(false);
      return next(s, Date.now());
    });
  }, []);

  const setHistory = useCallback((change: (h: History) => History) => setHistoryState(change), []);

  return { ready, session, act, undo, canUndo, prefs, setPrefs, history, setHistory, closeSession };
}
