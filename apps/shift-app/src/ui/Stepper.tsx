/** One of the worker's own numbers: a label, the value, and big minus and plus buttons. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { t } from '../i18n/en';
import { font, size, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Icon } from './Icon';

export function Stepper({ label, value, onLess, onMore }: { label: string; value: string; onLess: () => void; onMore: () => void }) {
  const c = useTheme();
  const btn = { backgroundColor: c.surfaceHi };
  return (
    <View style={[st.row, { borderTopColor: c.line }]}>
      <Text style={[st.label, { color: c.textSoft }]}>{label}</Text>
      <Pressable onPress={onLess} accessibilityRole="button" accessibilityLabel={t.myDay.less(label)} style={[st.btn, btn]}><Icon name="minus" color={c.text} /></Pressable>
      <Text style={[st.val, { color: c.text }]}>{value}</Text>
      <Pressable onPress={onMore} accessibilityRole="button" accessibilityLabel={t.myDay.more(label)} style={[st.btn, btn]}><Icon name="plus" color={c.text} /></Pressable>
    </View>
  );
}

export function Caps({ children }: { children: string }) {
  const c = useTheme();
  return <Text style={[st.caps, { color: c.muted }]}>{children}</Text>;
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.tap + 8, borderTopWidth: 1 },
  label: { flex: 1, fontFamily: font.text, fontSize: type.body.size, lineHeight: type.body.line },
  btn: { width: size.step, height: size.step, borderRadius: size.step / 2, alignItems: 'center', justifyContent: 'center' },
  val: { width: size.valCol, textAlign: 'center', fontFamily: font.number, fontSize: type.body.size + 2 },
  caps: { fontFamily: font.textHeavy, fontSize: type.caps.size, letterSpacing: type.caps.tracking },
});
