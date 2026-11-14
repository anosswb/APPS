/** Calendar: the whole month. Tap a day to change it: work, rest, not known yet. */
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { monthWeeks, weekday } from '../core/dates';
import { dayOn, Plan } from '../core/days';
import { t } from '../i18n/en';
import { Saved } from '../store';
import { color, font, radius, size, space, type } from '../theme/tokens';
import { DayCell } from '../ui/DayCell';
import { Icon } from '../ui/Icon';

export function Calendar({ data, today, top, onCycle }: { data: Saved; today: string; top: number; onCycle: (key: string) => void }) {
  const [ym, setYm] = useState({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) });
  const plan: Plan = { book: data.book };
  const move = (by: number) => setYm(({ y, m }) => { const n = y * 12 + (m - 1) + by; return { y: Math.floor(n / 12), m: (n % 12) + 1 }; });
  const legend = (label: string, style: object) => (<View style={st.leg} key={label}><View style={[st.dot, style]} /><Text style={st.legText}>{label}</Text></View>);
  return (
    <View style={[st.fill, { paddingTop: top + space.m }]}>
      <View style={st.head}>
        <Text style={st.title}>{`${t.months[ym.m - 1]} ${ym.y}`}</Text>
        <Pressable onPress={() => move(-1)} accessibilityRole="button" accessibilityLabel={t.cal.prev} style={st.nav}><Icon name="left" color={color.text} /></Pressable>
        <Pressable onPress={() => move(1)} accessibilityRole="button" accessibilityLabel={t.cal.next} style={st.nav}><Icon name="right" color={color.text} /></Pressable>
      </View>
      <View style={st.week}>{t.daysLetter.map((l, i) => <Text key={i} style={st.letter}>{l}</Text>)}</View>
      {monthWeeks(ym.y, ym.m).map((w, i) => (
        <View style={st.week} key={i}>
          {w.map((key, j) => key
            ? <DayCell key={key} day={dayOn(plan, key)} num={Number(key.slice(8))} isToday={key === today} height={size.tap} onPress={() => onCycle(key)} label={`${t.days[weekday(key)]} ${Number(key.slice(8))}`} />
            : <View key={j} style={st.blank} />)}
        </View>
      ))}
      <View style={st.legend}>
        {legend(t.cal.work, { backgroundColor: color.surface })}
        {legend(t.cal.rest, { backgroundColor: color.restMid })}
        {legend(t.cal.unknown, { borderWidth: 1.5, borderStyle: 'dashed', borderColor: color.dashed })}
      </View>
      <Text style={st.hint}>{t.cal.hint}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: color.bg, paddingHorizontal: space.m },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: space.m, paddingStart: space.s },
  title: { flex: 1, fontFamily: font.display, fontSize: type.title.size - 4, letterSpacing: type.title.tracking, color: color.text },
  nav: { width: size.tap, height: size.tap, alignItems: 'center', justifyContent: 'center' },
  week: { flexDirection: 'row', gap: space.xs, marginBottom: space.xs },
  letter: { flex: 1, textAlign: 'center', fontFamily: font.textBold, fontSize: type.small.size, color: color.muted, marginBottom: space.xs },
  blank: { flex: 1 },
  legend: { flexDirection: 'row', gap: space.l, marginTop: space.l, paddingStart: space.s },
  leg: { flexDirection: 'row', alignItems: 'center', gap: space.s },
  dot: { width: 18, height: 18, borderRadius: radius.day / 3 },
  legText: { fontFamily: font.textBold, fontSize: type.small.size + 1, color: color.textSoft },
  hint: { fontFamily: font.text, fontSize: type.small.size + 1, color: color.muted, marginTop: space.m, paddingStart: space.s },
});
