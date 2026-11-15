/** One day in a week strip or a month: a number with a dot under it. Blue dot = work, green = rest, none = not known. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Day } from '../core/days';
import { t } from '../i18n/en';
import { font, radius, size, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function DayCell({ day, top, num, isToday, height, onPress, label }: { day: Day | null; top?: string; num: number; isToday: boolean; height: number; onPress: () => void; label: string }) {
  const c = useTheme();
  const kind = day ? t.kind[day.kind] : t.kind.unknown;
  const dot = day?.kind === 'work' ? c.blue : day?.kind === 'rest' ? c.green : 'transparent';
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}, ${kind}`}
      style={({ pressed }) => [st.cell, { height, backgroundColor: isToday ? c.raised : 'transparent', opacity: pressed ? 0.6 : 1 }]}>
      {top !== undefined && <Text style={[st.top, { color: c.muted }]}>{top}</Text>}
      <Text style={[st.num, { color: day || isToday ? c.text : c.muted }]}>{num}</Text>
      <View style={[st.dot, { backgroundColor: dot }, day?.kind === 'rest' && st.rest]} />
    </Pressable>
  );
}

const st = StyleSheet.create({
  cell: { flex: 1, borderRadius: radius.inner, alignItems: 'center', justifyContent: 'center', gap: 7 },
  top: { fontFamily: font.textBold, fontSize: type.small.size },
  num: { fontFamily: font.textBold, fontSize: type.body.size + 2 },
  dot: { width: size.dot, height: size.dot, borderRadius: size.dot / 2 },
  rest: { width: size.dot * 2.6 },
});
