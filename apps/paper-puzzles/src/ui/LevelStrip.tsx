import React from 'react';
import { StyleSheet, View } from 'react-native';

import { bookSpec } from '../game/book';
import { t } from '../i18n/en';
import { useTheme } from '../theme/ThemeContext';
import { hairline, space } from '../theme/tokens';
import { Type } from './Type';

/** The five levels around the player's place in the Book: where they are, what is done, and the big one ahead. */
export function levelWindow(level: number): number[] {
  const start = level <= 10 ? Math.max(1, Math.min(level - 2, 6)) : 11 + 5 * Math.floor((level - 11) / 5);
  return [0, 1, 2, 3, 4].map((i) => start + i);
}

export function LevelStrip({ level, relief }: { level: number; relief: number }) {
  const { c } = useTheme();
  return (
    <View style={styles.row} accessible accessibilityLabel={t.home.stripLabel(level)}>
      {levelWindow(level).map((n) => {
        const spec = bookSpec(n, n === level ? relief : 0);
        const done = n < level;
        const here = n === level;
        return (
          <View key={n} style={styles.slot}>
            <View
              style={[
                styles.box,
                { borderColor: here ? c.text : c.rule, borderWidth: here ? 1.5 : hairline },
                done && { backgroundColor: c.accent, borderColor: c.accent },
                spec.boss && !done && { borderColor: c.text, borderWidth: 3 },
              ]}
            >
              <Type variant="number" style={{ color: done ? c.bg : here || spec.boss ? c.text : c.muted }}>
                {n}
              </Type>
            </View>
            <Type variant="label" tone={here ? 'text' : 'muted'} style={styles.size}>
              {spec.boss ? t.home.big : `${spec.n}×${spec.n}`}
            </Type>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.m },
  slot: { alignItems: 'center', gap: space.xs },
  box: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  size: { fontSize: 10, letterSpacing: 0.8 },
});
