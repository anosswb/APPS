import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { SAVE_KEY } from '../config/app';
import { nextRelief } from '../game/book';
import { ThemeChoice } from '../theme/ThemeContext';
import { freshSave, GameSave, migrate, Save } from './save';

interface StoreApi {
  save: Save;
  ready: boolean;
  keepGame: (id: string, game: GameSave) => void;
  finishDaily: (key: string, ms: number, hints: number) => void;
  finishBook: (id: string, hints: number) => void;
  setTheme: (theme: ThemeChoice) => void;
  setHapticsOn: (on: boolean) => void;
  setSoundOn: (on: boolean) => void;
  setSeenRules: () => void;
}

const Ctx = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [save, setSave] = useState<Save>(freshSave);
  const [ready, setReady] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(SAVE_KEY)
      .then((text) => {
        if (!alive) return;
        if (text) setSave(migrate(JSON.parse(text)));
      })
      .catch((error) => {
        // A broken save must never block the app. We start fresh and say so in the log.
        console.warn('Could not read the save', error);
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      AsyncStorage.setItem(SAVE_KEY, JSON.stringify(save)).catch((error) => console.warn('Could not write the save', error));
    }, 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [save, ready]);

  const keepGame = useCallback((id: string, game: GameSave) => {
    setSave((s) => ({ ...s, games: { ...s.games, [id]: game } }));
  }, []);

  const finishDaily = useCallback((key: string, ms: number, hints: number) => {
    setSave((s) => {
      if (s.daily[key]) return s;
      return { ...s, daily: { ...s.daily, [key]: { ms, hints } } };
    });
  }, []);

  const finishBook = useCallback((id: string, hints: number) => {
    setSave((s) => {
      const games = { ...s.games };
      delete games[id];
      return {
        ...s,
        games,
        book: { level: s.book.level + 1, relief: nextRelief(s.book.relief, hints), solved: s.book.solved + 1 },
      };
    });
  }, []);

  const setTheme = useCallback((theme: ThemeChoice) => {
    setSave((s) => ({ ...s, settings: { ...s.settings, theme } }));
  }, []);

  const setHapticsOn = useCallback((on: boolean) => {
    setSave((s) => ({ ...s, settings: { ...s.settings, haptics: on } }));
  }, []);

  const setSoundOn = useCallback((on: boolean) => {
    setSave((s) => ({ ...s, settings: { ...s.settings, sound: on } }));
  }, []);

  const setSeenRules = useCallback(() => {
    setSave((s) => (s.seenRules ? s : { ...s, seenRules: true }));
  }, []);

  return (
    <Ctx.Provider value={{ save, ready, keepGame, finishDaily, finishBook, setTheme, setHapticsOn, setSoundOn, setSeenRules }}>{children}</Ctx.Provider>
  );
}

export function useStore(): StoreApi {
  const api = useContext(Ctx);
  if (!api) throw new Error('useStore needs a StoreProvider above it');
  return api;
}
