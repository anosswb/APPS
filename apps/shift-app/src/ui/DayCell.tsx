/** One day: a work day is dark, a rest day is a small sunrise, a day not known yet is dashed. Tap to change it. */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Day } from '../core/days';
import { t } from '../i18n/en';
import { color, font, radius, type } from '../theme/tokens';

export function DayCell({ day, top, num, isToday, height, onPress, label }: { day: Day | null; top?: string; num: number; isToday: boolean; height: number; onPress: () => void; label: string }) {
  const rest = day?.kind === 'rest';
  const fg = isToday && !rest ? color.onToday : rest ? color.onRest : day ? color.textSoft : color.muted;
  const kind = day ? t.kind[day.kind] : t.kind.unknown;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}, ${kind}`} style={[st.cell, { height }]}>
      {rest ? (
        <LinearGradient colors={[color.restTop, color.restMid, color.restBottom]} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, isToday ? st.today : day ? st.work : st.unknown]} />
      )}
      {isToday && rest && <View style={[StyleSheet.absoluteFill, st.ring]} />}
      {top !== undefined && <Text style={[st.top, { color: fg }]}>{top}</Text>}
      <Text style={[st.num, { color: fg }]}>{num}</Text>
    </Pressable>
  );
}

const st = StyleSheet.create({
  cell: { flex: 1, borderRadius: radius.day, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', gap: 8 },
  work: { backgroundColor: color.surface },
  today: { backgroundColor: color.today },
  unknown: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: color.dashed, borderRadius: radius.day },
  ring: { borderWidth: 3, borderColor: color.today, borderRadius: radius.day },
  top: { fontFamily: font.textBold, fontSize: type.small.size },
  num: { fontFamily: font.number, fontSize: type.number.size },
});
