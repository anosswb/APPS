import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MONEY_MODE } from '../config/money';
import { addMonths, canPlay, Month, monthGrid, monthInRange } from '../game/archive';
import { keyToDate } from '../game/daily';
import { t } from '../i18n/en';
import { ads } from '../money/ads';
import { purchases } from '../money/purchases';
import { archiveLocked } from '../money/rules';
import { useStore } from '../store/Store';
import { useTheme } from '../theme/ThemeContext';
import { hairline, space, tapMin } from '../theme/tokens';
import { Btn } from '../ui/Btn';
import { Chevron } from '../ui/Glyphs';
import { Rule } from '../ui/Rule';
import { Type } from '../ui/Type';

interface Props {
  today: string;
  month: Month;
  onMonth: (month: Month) => void;
  onOpen: (key: string) => void;
  onExit: () => void;
  onFullEdition: () => void;
}

/** The calendar of past daily puzzles. A solved day is inked red, like a stamp. */
export function Archive({ today, month, onMonth, onOpen, onExit, onFullEdition }: Props) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { save, unlockDay } = useStore();
  /** the closed day the player just tapped, and what is happening with it */
  const [asking, setAsking] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [onUs, setOnUs] = useState(false);
  const canSell = purchases.available();

  const watch = async (key: string) => {
    setBusy(true);
    try {
      const result = await ads.showRewarded();
      if (result === 'dismissed') return;
      // 'unavailable' still opens the day: a player is never left waiting for an ad that is not there
      unlockDay(key);
      if (result === 'unavailable') {
        setOnUs(true);
        return;
      }
      setAsking(null);
      onOpen(key);
    } catch (error) {
      console.warn('Video error', error);
    } finally {
      setBusy(false);
    }
  };
  const rows = monthGrid(month);
  const earlier = addMonths(month, -1);
  const later = addMonths(month, 1);
  const canEarlier = monthInRange(earlier, today);
  const canLater = monthInRange(later, today);
  const solvedCount = rows.flat().filter((key) => key && save.daily[key]).length;

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.page, { paddingTop: insets.top + space.s, paddingBottom: insets.bottom + space.xxl }]}
    >
      <View style={styles.column}>
        <Pressable accessibilityRole="button" accessibilityLabel={t.game.back} onPress={onExit} hitSlop={8} style={styles.back}>
          <Chevron size={20} color={c.text} />
          <Type variant="label">{t.game.back}</Type>
        </Pressable>
        <Rule strong />
        <Type variant="title" accessibilityRole="header" style={styles.title}>
          {t.archive.title}
        </Type>

        <View style={styles.monthBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.archive.earlier}
            accessibilityState={{ disabled: !canEarlier }}
            disabled={!canEarlier}
            onPress={() => onMonth(earlier)}
            style={[styles.arrow, { opacity: canEarlier ? 1 : 0.25 }]}
          >
            <Chevron size={22} color={c.text} />
          </Pressable>
          <Type variant="number" accessibilityRole="header">
            {t.archive.month(month.year, month.month)}
          </Type>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t.archive.later}
            accessibilityState={{ disabled: !canLater }}
            disabled={!canLater}
            onPress={() => onMonth(later)}
            style={[styles.arrow, { opacity: canLater ? 1 : 0.25, transform: [{ scaleX: -1 }] }]}
          >
            <Chevron size={22} color={c.text} />
          </Pressable>
        </View>
        <Rule />

        <View style={styles.week}>
          {t.archive.week.map((letter, i) => (
            <View key={i} style={styles.slot}>
              <Type variant="label" tone="muted">
                {letter}
              </Type>
            </View>
          ))}
        </View>
        {rows.map((row, r) => (
          <View key={r} style={styles.week}>
            {row.map((key, k) => {
              if (!key) return <View key={k} style={styles.slot} />;
              const date = keyToDate(key);
              const open = canPlay(key, today);
              const solved = !!save.daily[key];
              const started = !solved && !!save.games[`daily-${key}`]?.marks.some((m) => m !== 0);
              const isToday = key === today;
              const locked = open && archiveLocked(key, today, MONEY_MODE, canSell, save.money, solved || started);
              const state = solved ? 'solved' : started ? 'started' : open ? 'open' : 'closed';
              return (
                <View key={k} style={styles.slot}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={locked ? `${t.archive.dayLabel(date, 'open')}, ${t.archive.lockedLabel}` : t.archive.dayLabel(date, state)}
                    accessibilityState={{ disabled: !open }}
                    disabled={!open}
                    onPress={() => {
                      setOnUs(false);
                      if (locked) setAsking(key);
                      else onOpen(key);
                    }}
                    style={[
                      styles.day,
                      { borderColor: isToday ? c.text : c.rule, borderWidth: isToday ? 1.5 : hairline },
                      solved && { backgroundColor: c.accent, borderColor: c.accent },
                      !open && { borderColor: 'transparent' },
                      locked && { borderStyle: 'dashed', borderColor: asking === key ? c.text : c.rule },
                    ]}
                  >
                    <Type variant="number" style={{ color: solved ? c.bg : open && !locked ? c.text : c.muted, opacity: open ? 1 : 0.45 }}>
                      {date.getDate()}
                    </Type>
                    {started ? <View style={[styles.dot, { backgroundColor: c.accent }]} /> : null}
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}

        <Rule />
        {asking ? (
          <View style={styles.ask} accessibilityLiveRegion="polite">
            <Type variant="bodyItalic">
              {onUs ? t.archive.onUs : MONEY_MODE === 'ads' ? t.archive.olderVideo(keyToDate(asking)) : t.archive.olderFull(keyToDate(asking))}
            </Type>
            {onUs ? (
              <Btn label={t.home.start} onPress={() => onOpen(asking)} style={styles.askBtn} />
            ) : MONEY_MODE === 'ads' ? (
              <Btn label={t.archive.watch} onPress={() => void watch(asking)} disabled={busy} style={styles.askBtn} />
            ) : (
              <Btn label={t.archive.seeFull} onPress={onFullEdition} style={styles.askBtn} />
            )}
            {onUs ? null : <Btn label={t.archive.notNow} kind="quiet" onPress={() => setAsking(null)} style={styles.askQuiet} />}
          </View>
        ) : (
          <Type variant="bodyItalic" tone="muted" style={styles.count}>
            {t.archive.count(solvedCount)}
          </Type>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: space.l, alignItems: 'center' },
  column: { width: '100%', maxWidth: 520 },
  back: { flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: tapMin, alignSelf: 'flex-start', paddingEnd: space.m },
  title: { marginTop: space.l },
  monthBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.m },
  arrow: { width: tapMin, height: tapMin, alignItems: 'center', justifyContent: 'center' },
  week: { flexDirection: 'row', marginTop: space.s },
  slot: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  day: { width: tapMin, height: tapMin, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', bottom: 5, width: 5, height: 5, borderRadius: 3 },
  count: { marginTop: space.m, textAlign: 'center' },
  ask: { marginTop: space.m },
  askBtn: { marginTop: space.m },
  askQuiet: { alignSelf: 'center', marginTop: space.xs },
});
