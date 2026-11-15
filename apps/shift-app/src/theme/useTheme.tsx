/** Which look is on: the phone's own setting, or the worker's choice in My day. */
import React, { createContext, useContext } from 'react';
import { Theme, themes } from './tokens';

export type Look = 'auto' | 'light' | 'dark';
const Ctx = createContext<Theme>(themes.dark);
export const ThemeProvider = ({ theme, children }: { theme: Theme; children: React.ReactNode }) => <Ctx.Provider value={theme}>{children}</Ctx.Provider>;
export const useTheme = () => useContext(Ctx);
