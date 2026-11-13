import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { t } from '../i18n/en';
import { useTheme } from '../theme/ThemeContext';
import { hairline, space } from '../theme/tokens';
import { Btn } from '../ui/Btn';
import { Grass, Tent, Tree } from '../ui/Glyphs';
import { Rule } from '../ui/Rule';
import { Type } from '../ui/Type';

type Sq = 'tree' | 'tent' | 'grass' | '';

/** A tiny picture of part of a grid, to show a rule. */
function Diagram({ rows, verdict }: { rows: Sq[][]; verdict: 'yes' | 'no' }) {
  const { c } = useTheme();
  const cell = 34;
  return (
    <View style={styles.diagram}>
      <View style={[styles.grid, { borderColor: verdict === 'yes' ? c.text : c.accent, backgroundColor: c.surface }]}>
        {rows.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((sq, k) => (
              <View
                key={k}
                style={[
                  styles.cell,
                  { width: cell, height: cell, borderColor: c.rule },
                  k === row.length - 1 && { borderRightWidth: 0 },
                  r === rows.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                {sq === 'tree' ? <Tree size={26} color={c.pine} /> : null}
                {sq === 'tent' ? <Tent size={26} color={c.accent} paper={c.surface} /> : null}
                {sq === 'grass' ? <Grass size={26} color={c.muted} /> : null}
              </View>
            ))}
          </View>
        ))}
      </View>
      <Type variant="label" tone={verdict === 'yes' ? 'muted' : 'accent'} style={styles.verdict}>
        {verdict === 'yes' ? 'Yes' : 'No'}
      </Type>
    </View>
  );
}

export function Rules({ onDone }: { onDone: () => void }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.page, { paddingTop: insets.top + space.xl, paddingBottom: insets.bottom + space.xxl }]}
    >
      <View style={styles.column}>
        <Type variant="title" accessibilityRole="header">
          {t.rules.title}
        </Type>
        <Type tone="muted" style={styles.intro}>
          {t.rules.intro}
        </Type>
        <Rule strong />

        <Type style={styles.rule}>1. {t.rules.r1}</Type>
        <View style={styles.pair}>
          <Diagram rows={[['', '', ''], ['', 'tree', 'tent'], ['', '', '']]} verdict="yes" />
          <Diagram rows={[['', '', 'tent'], ['', 'tree', ''], ['', '', '']]} verdict="no" />
        </View>
        <Rule />

        <Type style={styles.rule}>2. {t.rules.r2}</Type>
        <View style={styles.pair}>
          <Diagram rows={[['tent', '', 'tent'], ['tree', '', 'tree']]} verdict="yes" />
          <Diagram rows={[['tent', '', ''], ['tree', 'tent', 'tree']]} verdict="no" />
        </View>
        <Rule />

        <Type style={styles.rule}>3. {t.rules.r3}</Type>
        <Rule />

        <Type style={styles.rule}>{t.rules.marks}</Type>
        <View style={styles.pair}>
          <Diagram rows={[['grass', 'tent', '']]} verdict="yes" />
        </View>
        <Rule />

        <Type variant="bodyItalic" style={styles.rule}>
          {t.rules.promise}
        </Type>
        <Btn label={t.rules.done} onPress={onDone} style={styles.done} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: space.xl, alignItems: 'center' },
  column: { width: '100%', maxWidth: 520 },
  intro: { marginTop: space.s, marginBottom: space.l },
  rule: { marginTop: space.l, marginBottom: space.m },
  pair: { flexDirection: 'row', gap: space.xl, marginBottom: space.l },
  diagram: { alignItems: 'center' },
  grid: { borderWidth: 1.5 },
  row: { flexDirection: 'row' },
  cell: { borderRightWidth: hairline, borderBottomWidth: hairline, alignItems: 'center', justifyContent: 'center' },
  verdict: { marginTop: space.xs },
  done: { marginTop: space.l },
});
