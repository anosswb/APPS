/** Calendar: the whole month in one glass panel. Tap a day to change it. */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { monthWeeks, weekday } from '../core/dates';
import { dayOn } from '../core/days';
import { t } from '../i18n/en';
import { planOf, Saved } from '../store';
import { font, size, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Glass } from '../ui/Bits';
import { DayCell } from '../ui/DayCell';
import { Icon } from '../ui/Icon';

export function Calendar({ data, today, top, onCycle }: { data: Saved; today: string; top: number; onCycle: (key: string) => void }) {
  const c = useTheme();
  const [ym, setYm] = useState({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) });
  const plan = planOf(data);
  const move = (by: number) => setYm(({ y, m }) => { const n = y * 12 + (m - 1) + by; return { y: Math.floor(n / 12), m: (n % 12) + 1 }; });
  const weeks = monthWeeks(ym.y, ym.m);
  const keys = weeks.flat().filter((k): k is string => !!k);
  const worked = keys.filter((k) => dayOn(plan, k)?.kind === 'work').length;
  const rested = keys.filter((k) => dayOn(plan, k)?.kind === 'rest').length;
  const sum = (dot: string | null, label: string) => (
    <View style={st.sum} key={label}>{dot && <View style={[st.dot, { backgroundColor: dot }]} />}<Text style={[st.sumText, { color: c.textSoft }]}>{label}</Text></View>
  );
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingTop: top + space.l, paddingHorizontal: space.m, paddingBottom: space.l, gap: space.m }}>
      <View style={st.head}>
        <View style={{ flex: 1 }}>
          <Text style={[st.title, { color: c.text }]}>{t.months[ym.m - 1]}</Text>
          <Text style={[st.year, { color: c.muted }]}>{ym.y}</Text>
        </View>
        <Pressable onPress={() => move(-1)} accessibilityRole="button" accessibilityLabel={t.cal.prev} style={[st.nav, { backgroundColor: c.card, borderColor: c.cardLine }]}><Icon name="left" color={c.text} /></Pressable>
        <Pressable onPress={() => move(1)} accessibilityRole="button" accessibilityLabel={t.cal.next} style={[st.nav, { backgroundColor: c.card, borderColor: c.cardLine }]}><Icon name="right" color={c.text} /></Pressable>
      </View>
      <Glass style={{ paddingHorizontal: space.s, gap: 2 }}>
        <View style={st.week}>{t.daysLetter.map((l, i) => <Text key={i} style={[st.letter, { color: c.muted }]}>{l}</Text>)}</View>
        {weeks.map((w, i) => (
          <View style={st.week} key={i}>
            {w.map((key, j) => key
              ? <DayCell key={key} day={dayOn(plan, key)} num={Number(key.slice(8))} isToday={key === today} height={size.tap + 4} onPress={() => onCycle(key)} label={`${t.days[weekday(key)]} ${Number(key.slice(8))}`} />
              : <View key={j} style={{ flex: 1 }} />)}
          </View>
        ))}
      </Glass>
      <View style={st.sums}>
        {sum(c.blue, t.cal.worked(worked))}
        {sum(c.green, t.cal.rested(rested))}
        {sum(null, t.cal.open(keys.length - worked - rested))}
      </View>
      <Text style={[st.hint, { color: c.textSoft }]}>{t.tapHint}</Text>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.s, paddingHorizontal: space.s },
  title: { fontFamily: font.display, fontSize: type.title.size, lineHeight: type.title.line, letterSpacing: type.title.tracking },
  year: { fontFamily: font.text, fontSize: type.big.size },
  nav: { width: size.tap, height: size.tap, borderRadius: size.tap / 2, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  week: { flexDirection: 'row', gap: 2 },
  letter: { flex: 1, textAlign: 'center', fontFamily: font.textBold, fontSize: type.small.size, marginBottom: space.xs },
  sums: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.m },
  sum: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  sumText: { fontFamily: font.textBold, fontSize: type.label.size },
  dot: { width: size.dot + 2, height: size.dot + 2, borderRadius: size.dot },
  hint: { fontFamily: font.text, fontSize: type.small.size, textAlign: 'center' },
});
