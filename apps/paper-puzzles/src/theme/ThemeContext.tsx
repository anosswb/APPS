import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

import { Palette, palettes } from './tokens';

export type ThemeChoice = 'system' | 'light' | 'dark';

interface Theme {
  c: Palette;
  dark: boolean;
}

const Ctx = createContext<Theme>({ c: palettes.light, dark: false });

export function ThemeProvider({ choice, children }: { choice: ThemeChoice; children: React.ReactNode }) {
  const system = useColorScheme();
  const dark = choice === 'system' ? system === 'dark' : choice === 'dark';
  return <Ctx.Provider value={{ c: dark ? palettes.dark : palettes.light, dark }}>{children}</Ctx.Provider>;
}

export function useTheme(): Theme {
  return useContext(Ctx);
}
