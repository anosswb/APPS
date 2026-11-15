import React from 'react';
import { StyleSheet, View } from 'react-native';

import { clock, t } from '../i18n/en';
import { useTheme } from '../theme/ThemeContext';
import { hairline, space } from '../theme/tokens';
import { Drop } from './Glyphs';
import { Type } from './Type';

/**
 * The pot of ink, drawn as a row of drops: full ones are left, outlines are spent.
 * The last two drops turn red. Used big in the ink game and as a preview on the front page.
 */
export function InkGauge({ total, left, width, showCount = true }: { total: number; left: number; width: number; showCount?: boolean }) {
  const { c } = useTheme();
  const gap = 3;
  const drop = Math.max(8, Math.min(20, Math.floor((width - gap * (total - 1)) / total)));
  const low = left <= 2;
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={t.challenge.gauge.ink(left, total)}>
      {showCount ? (
        <View style={styles.head}>
          <Type variant="label" tone="muted">
            {t.challenge.inkLeft}
          </Type>
          <Type variant="title" tone={low ? 'accent' : 'text'}>
            {`${left}`}
            <Type variant="label" tone="muted">{` / ${total}`}</Type>
          </Type>
        </View>
      ) : null}
      <View style={[styles.row, { gap, width }]}>
        {Array.from({ length: total }, (_, i) => (
          <Drop key={i} size={drop} full={i < left} color={low && i < left ? c.accent : c.text} />
        ))}
      </View>
    </View>
  );
}

/** The clock of the race: a bar that empties, and the time left in big figures. Red in the last 20 seconds. */
export function ClockGauge({ totalMs, leftMs, width }: { totalMs: number; leftMs: number; width: number }) {
  const { c } = useTheme();
  const low = leftMs < 20000;
  const share = totalMs > 0 ? Math.max(0, Math.min(1, leftMs / totalMs)) : 0;
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={t.challenge.gauge.race(clock(leftMs))}>
      <View style={styles.head}>
        <Type variant="label" tone="muted">
          {t.challenge.timeLeft}
        </Type>
        <Type variant="title" tone={low ? 'accent' : 'text'}>
          {clock(leftMs)}
        </Type>
      </View>
      <View style={[styles.track, { width, borderColor: c.text }]}>
        <View style={{ width: `${share * 100}%`, height: '100%', backgroundColor: low ? c.accent : c.text }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: space.xs },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  track: { height: 12, borderWidth: hairline },
});
