/** One day: a work day is a solid block, a rest day is the sun colour, a day not known yet is dashed. Tap to change it. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Day } from '../core/days';
import { t } from '../i18n/en';
import { font, radius, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function DayCell({ day, top, bottom, num, isToday, height, onPress, label }: { day: Day | null; top?: string; bottom?: string; num: number; isToday: boolean; height: number; onPress: () => void; label: string }) {
  const c = useTheme();
  const rest = day?.kind === 'rest';
  const bg = rest ? c.accent : day ? (isToday ? c.today : c.surface) : 'transparent';
  const fg = rest ? c.onAccent : day ? (isToday ? c.onToday : c.text) : c.muted;
  const kind = day ? t.kind[day.kind] : t.kind.unknown;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}, ${kind}`}
      style={({ pressed }) => [st.cell, { height, backgroundColor: bg, borderColor: day ? (isToday && rest ? c.text : bg) : isToday ? c.text : c.dashed, borderStyle: day || isToday ? 'solid' : 'dashed', opacity: pressed ? 0.7 : 1 }]}>
      {top !== undefined && <Text style={[st.small, { color: fg, opacity: 0.75 }]}>{top}</Text>}
      <Text style={[st.num, { color: fg }]}>{num}</Text>
      {bottom !== undefined && <Text style={[st.small, { color: fg }]}>{bottom}</Text>}
      {!day && isToday && top === undefined && <View />}
    </Pressable>
  );
}

const st = StyleSheet.create({
  cell: { flex: 1, borderRadius: radius.day, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', gap: 5 },
  small: { fontFamily: font.textBold, fontSize: type.caps.size },
  num: { fontFamily: font.number, fontSize: type.big.size },
});
