/** Calendar: the whole month. Tap a day to change it. */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { monthWeeks, weekday } from '../core/dates';
import { dayOn, Plan } from '../core/days';
import { t } from '../i18n/en';
import { Saved } from '../store';
import { font, size, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { DayCell } from '../ui/DayCell';
import { Icon } from '../ui/Icon';

export function Calendar({ data, today, top, onCycle }: { data: Saved; today: string; top: number; onCycle: (key: string) => void }) {
  const c = useTheme();
  const [ym, setYm] = useState({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) });
  const plan: Plan = { book: data.book };
  const move = (by: number) => setYm(({ y, m }) => { const n = y * 12 + (m - 1) + by; return { y: Math.floor(n / 12), m: (n % 12) + 1 }; });
  const weeks = monthWeeks(ym.y, ym.m);
  const keys = weeks.flat().filter((k): k is string => !!k);
  const worked = keys.filter((k) => dayOn(plan, k)?.kind === 'work').length;
  const rested = keys.filter((k) => dayOn(plan, k)?.kind === 'rest').length;
  const sum = (n: string, color: string) => <Text key={n} style={[st.sum, { color }]}>{n}</Text>;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingTop: top + space.m, paddingHorizontal: space.m, paddingBottom: space.l }}>
      <View style={st.head}>
        <View style={{ flex: 1 }}>
          <Text style={[st.title, { color: c.text }]}>{t.months[ym.m - 1]}</Text>
          <Text style={[st.year, { color: c.muted }]}>{ym.y}</Text>
        </View>
        <Pressable onPress={() => move(-1)} accessibilityRole="button" accessibilityLabel={t.cal.prev} style={[st.nav, { backgroundColor: c.surface }]}><Icon name="left" color={c.text} /></Pressable>
        <Pressable onPress={() => move(1)} accessibilityRole="button" accessibilityLabel={t.cal.next} style={[st.nav, { backgroundColor: c.surface }]}><Icon name="right" color={c.text} /></Pressable>
      </View>
      <View style={st.week}>{t.daysLetter.map((l, i) => <Text key={i} style={[st.letter, { color: c.muted }]}>{l}</Text>)}</View>
      {weeks.map((w, i) => (
        <View style={st.week} key={i}>
          {w.map((key, j) => key
            ? <DayCell key={key} day={dayOn(plan, key)} num={Number(key.slice(8))} isToday={key === today} height={size.tap} onPress={() => onCycle(key)} label={`${t.days[weekday(key)]} ${Number(key.slice(8))}`} />
            : <View key={j} style={{ flex: 1 }} />)}
        </View>
      ))}
      <View style={[st.sums, { borderTopColor: c.line }]}>
        {sum(t.cal.worked(worked), c.text)}
        {sum(t.cal.rested(rested), c.accentText)}
        {sum(t.cal.open(keys.length - worked - rested), c.muted)}
      </View>
      <Text style={[st.hint, { color: c.muted }]}>{t.tapHint}</Text>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.s, marginBottom: space.l, paddingStart: space.xs },
  title: { fontFamily: font.display, fontSize: type.title.size, lineHeight: type.title.line, letterSpacing: type.title.tracking },
  year: { fontFamily: font.textBold, fontSize: type.label.size },
  nav: { width: size.tap, height: size.tap, borderRadius: size.tap / 2, alignItems: 'center', justifyContent: 'center' },
  week: { flexDirection: 'row', gap: space.xs, marginBottom: space.xs },
  letter: { flex: 1, textAlign: 'center', fontFamily: font.textHeavy, fontSize: type.caps.size, marginBottom: space.xs },
  sums: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, marginTop: space.m, paddingTop: space.m, paddingHorizontal: space.xs },
  sum: { fontFamily: font.number, fontSize: type.body.size + 1 },
  hint: { fontFamily: font.text, fontSize: type.small.size, marginTop: space.m, paddingStart: space.xs },
});
