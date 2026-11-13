import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME } from '../config/app';
import { bookSpec } from '../game/book';
import { dailyPuzzle, keyToDate, weekOf } from '../game/daily';
import { t } from '../i18n/en';
import { useStore } from '../store/Store';
import { useTheme } from '../theme/ThemeContext';
import { hairline, space } from '../theme/tokens';
import { Btn } from '../ui/Btn';
import { MiniGrid } from '../ui/MiniGrid';
import { Rule } from '../ui/Rule';
import { Stamp } from '../ui/Stamp';
import { Type } from '../ui/Type';

interface Props {
  today: string;
  onDaily: () => void;
  onBook: () => void;
  onRules: () => void;
}

/** The front page: masthead, today's puzzle, the week, the book. */
export function Home({ today, onDaily, onBook, onRules }: Props) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { save } = useStore();
  const date = keyToDate(today);
  const puzzle = useMemo(() => dailyPuzzle(today), [today]);
  const done = save.daily[today];
  const started = !!save.games[puzzle.id]?.marks.some((m) => m !== 0);
  const spec = bookSpec(save.book.level, save.book.relief);
  const week = weekOf(today);

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.page, { paddingTop: insets.top + space.l, paddingBottom: insets.bottom + space.xxl }]}
    >
      <View style={styles.column}>
        <Type variant="label" tone="muted" style={styles.center}>
          {t.dateLine(date)}
        </Type>
        <Type variant="masthead" accessibilityRole="header" style={[styles.center, styles.masthead]}>
          {APP_NAME}
        </Type>
        <Rule double />
        <Type variant="bodyItalic" tone="muted" style={[styles.center, styles.tagline]}>
          {t.home.tagline}
        </Type>

        <Type variant="label" tone="accent" style={styles.kicker}>
          {t.home.today}
        </Type>
        <View style={styles.lead}>
          <View>
            <MiniGrid puzzle={puzzle} width={112} />
            {done ? (
              <View style={styles.stampOver} pointerEvents="none">
                <Stamp word={t.home.solved} animate={false} small />
              </View>
            ) : null}
          </View>
          <View style={styles.leadText}>
            <Type variant="title" accessibilityRole="header">
              {t.home.dailyTitle(date)}
            </Type>
            <Type variant="label" tone="muted" style={styles.meta}>
              {t.sizeLine(puzzle.n, puzzle.grade)}
            </Type>
            <Type tone="muted">{t.home.dailyBlurb}</Type>
          </View>
        </View>
        <Btn label={done ? t.home.look : started ? t.home.resume : t.home.start} kind={done ? 'outline' : 'ink'} onPress={onDaily} style={styles.wide} />

        <Type variant="label" tone="muted" style={styles.kicker}>
          {t.home.week}
        </Type>
        <View style={styles.week}>
          {week.map((key) => {
            const solved = !!save.daily[key];
            const isToday = key === today;
            return (
              <View key={key} style={styles.day} accessible accessibilityLabel={`${t.days[keyToDate(key).getDay()]}${solved ? ', solved' : ''}`}>
                <View
                  style={[
                    styles.dayBox,
                    { borderColor: isToday ? c.text : c.rule, borderWidth: isToday ? 1.5 : hairline },
                    solved && { backgroundColor: c.accent, borderColor: c.accent },
                  ]}
                />
                <Type variant="label" tone={isToday ? 'text' : 'muted'}>
                  {t.dayShort(keyToDate(key))}
                </Type>
              </View>
            );
          })}
        </View>

        <View style={styles.gap} />
        <Rule />
        <Type variant="label" tone="muted" style={styles.kicker}>
          {t.home.book}
        </Type>
        <View style={styles.bookRow}>
          <View style={styles.leadText}>
            <Type variant="title" accessibilityRole="header">
              {t.home.bookTitle(save.book.level)}
            </Type>
            <Type variant="label" tone="muted" style={styles.meta}>
              {t.sizeLine(spec.n, spec.grade)}
            </Type>
            <Type tone="muted">{t.home.bookBlurb(save.book.solved)}</Type>
          </View>
        </View>
        <Btn label={t.home.open} kind={done ? 'ink' : 'outline'} onPress={onBook} style={styles.wide} />

        <View style={styles.gap} />
        <Rule />
        <Btn label={t.home.rules} kind="quiet" onPress={onRules} style={styles.footer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: space.xl, alignItems: 'center' },
  column: { width: '100%', maxWidth: 520 },
  center: { textAlign: 'center' },
  masthead: { marginTop: space.xs, marginBottom: space.s },
  tagline: { marginTop: space.s },
  kicker: { marginTop: space.xl, marginBottom: space.m },
  lead: { flexDirection: 'row', gap: space.l },
  leadText: { flex: 1 },
  meta: { marginTop: space.xs, marginBottom: space.s },
  stampOver: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  wide: { marginTop: space.l },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: space.xs },
  dayBox: { width: 30, height: 30 },
  gap: { height: space.xl },
  bookRow: { flexDirection: 'row' },
  footer: { alignSelf: 'center', marginTop: space.s },
});
