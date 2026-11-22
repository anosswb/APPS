import { createContext, ReactNode, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { dark, Palette } from './tokens';

const Ctx = createContext<Palette>(dark);

export function ThemeProvider({ palette, children }: { palette: Palette; children: ReactNode }) {
  return <Ctx.Provider value={palette}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);

/** Styles that depend on the palette, made once per palette. */
/** The style-sheet shape React Native accepts (its own type name changes between versions). */
type Styles = Parameters<typeof StyleSheet.create>[0];

export function themed<S extends Styles>(make: (c: Palette) => S & Styles): () => Readonly<S> {
  const cache = new Map<Palette, Readonly<S>>();
  return function useStyles() {
    const c = useTheme();
    const hit = cache.get(c);
    if (hit) return hit;
    const made = StyleSheet.create(make(c));
    cache.set(c, made);
    return made;
  };
}
