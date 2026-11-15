/** Small shared pieces: the glass panel, the small capital label, the pill button, the stepper row. */
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { t } from '../i18n/en';
import { font, radius, size, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Icon, IconName } from './Icon';

export function Glass({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  return <View style={[st.glass, { backgroundColor: c.card, borderColor: c.cardLine }, style]}>{children}</View>;
}

export function Caps({ children, color }: { children: string; color?: string }) {
  const c = useTheme();
  return <Text style={[st.caps, { color: color ?? c.muted }]}>{children}</Text>;
}

export function Pill({ label, right, icon, onPress, quiet }: { label: string; right?: string; icon?: IconName; onPress: () => void; quiet?: boolean }) {
  const c = useTheme();
  const bg = quiet ? c.raised : c.primary, fg = quiet ? c.text : c.onPrimary;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={right ? `${label} ${right}` : label} style={({ pressed }) => [st.pill, { backgroundColor: bg, opacity: pressed ? 0.8 : 1 }]}>
      {icon && <Icon name={icon} color={fg} s={size.icon - 2} />}
      <Text style={[st.pillText, { color: fg }]} numberOfLines={1}>{label}</Text>
      {right && <Text style={[st.pillRight, { color: fg }]}>{right}</Text>}
    </Pressable>
  );
}

export function Stepper({ label, value, onLess, onMore }: { label: string; value: string; onLess: () => void; onMore: () => void }) {
  const c = useTheme();
  return (
    <View style={[st.row, { borderTopColor: c.line }]}>
      <Text style={[st.label, { color: c.textSoft }]}>{label}</Text>
      <Pressable onPress={onLess} accessibilityRole="button" accessibilityLabel={t.myDay.less(label)} hitSlop={6} style={[st.btn, { backgroundColor: c.raised }]}><Icon name="minus" color={c.text} s={size.icon - 4} /></Pressable>
      <Text style={[st.val, { color: c.text }]}>{value}</Text>
      <Pressable onPress={onMore} accessibilityRole="button" accessibilityLabel={t.myDay.more(label)} hitSlop={6} style={[st.btn, { backgroundColor: c.raised }]}><Icon name="plus" color={c.text} s={size.icon - 4} /></Pressable>
    </View>
  );
}

const st = StyleSheet.create({
  glass: { borderRadius: radius.card, borderWidth: 1, padding: space.l },
  caps: { fontFamily: font.textHeavy, fontSize: type.caps.size, letterSpacing: type.caps.tracking },
  pill: { height: size.button, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.s, paddingHorizontal: space.l },
  pillText: { fontFamily: font.textBold, fontSize: type.body.size },
  pillRight: { fontFamily: font.text, fontSize: type.body.size, opacity: 0.7 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.tap + 8, borderTopWidth: 1 },
  label: { flex: 1, fontFamily: font.text, fontSize: type.body.size - 1, lineHeight: type.body.line },
  btn: { width: size.step, height: size.step, borderRadius: size.step / 2, alignItems: 'center', justifyContent: 'center' },
  val: { width: size.valCol, textAlign: 'center', fontFamily: font.textHeavy, fontSize: type.body.size },
});
