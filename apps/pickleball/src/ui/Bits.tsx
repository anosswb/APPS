// Small shared pieces: section titles, stat tiles, progress rings, segmented switch, glass chips.
import { ReactNode } from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { themed, useTheme } from '../theme/theme';
import { font, radius, size, space } from '../theme/tokens';
import { Glass } from './Glass';

export function Section({ title, right }: { title: string; right?: ReactNode }) {
  const s = useS();
  return (
    <View style={s.section}>
      <Text style={s.sectionText} accessibilityRole="header">{title}</Text>
      {right}
    </View>
  );
}

export function Label({ children, style }: { children: string; style?: object }) {
  const s = useS();
  return <Text style={[s.label, style]}>{children.toUpperCase()}</Text>;
}

export function Stat({ value, unit, label, solid, style }: { value: string; unit?: string; label: string; solid?: boolean; style?: ViewStyle }) {
  const s = useS();
  const body = (
    <View style={s.statPad}>
      <Text style={[s.statValue, solid && s.solidText]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
        {unit ? <Text style={[s.statUnit, solid && s.solidText]}> {unit}</Text> : null}
      </Text>
      <Text style={[s.label, { marginTop: 6 }, solid && s.solidMute]}>{label.toUpperCase()}</Text>
    </View>
  );
  return solid ? <View style={[s.solid, style]}>{body}</View> : <Glass style={style} radius={radius.glass - 2}>{body}</Glass>;
}

export function Ring({ value, sizePx = 64, stroke = 7 }: { value: number; sizePx?: number; stroke?: number }) {
  const c = useTheme();
  const r = (sizePx - stroke) / 2;
  const len = 2 * Math.PI * r;
  return (
    <Svg width={sizePx} height={sizePx}>
      <Circle cx={sizePx / 2} cy={sizePx / 2} r={r} stroke={c.hairHex} strokeOpacity={c.hairOpacity} strokeWidth={stroke} fill="none" />
      <Circle cx={sizePx / 2} cy={sizePx / 2} r={r} stroke={c.highlight} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${len * Math.max(0.001, Math.min(1, value))} ${len}`} rotation={-90} origin={`${sizePx / 2}, ${sizePx / 2}`} />
    </Svg>
  );
}

export function Segments<T extends string>({ items, value, onChange }: { items: [T, string][]; value: T; onChange: (v: T) => void }) {
  const s = useS();
  return (
    <Glass radius={radius.pill} style={s.seg}>
      {items.map(([k, label]) => {
        const on = k === value;
        return (
          <Pressable key={k} onPress={() => onChange(k)} style={[s.segItem, on && s.segOn]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
            <Text style={[s.segText, on && s.segTextOn]} numberOfLines={1}>{label}</Text>
          </Pressable>
        );
      })}
    </Glass>
  );
}

export function Chip({ children, style, onPress, a11y }: { children: ReactNode; style?: ViewStyle; onPress?: () => void; a11y?: string }) {
  const s = useS();
  const inner = <Glass radius={radius.pill} style={[s.chip, style]}>{children}</Glass>;
  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={a11y} style={({ pressed }) => [pressed && { opacity: 0.8 }, { minHeight: 44, justifyContent: 'center' }]}>
      {inner}
    </Pressable>
  ) : (
    inner
  );
}

const useS = themed((c) => ({
  section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.l + 4, marginTop: space.xl, marginBottom: space.s + 2 },
  sectionText: { fontFamily: font.bodyBold, fontSize: 21, color: c.text },
  label: { fontFamily: font.label, fontSize: size.label, letterSpacing: 1.8, color: c.mute },
  statPad: { paddingHorizontal: space.l, paddingTop: space.m + 2, paddingBottom: space.m },
  statValue: { fontFamily: font.display, fontSize: size.stat, lineHeight: size.stat + 4, color: c.text },
  statUnit: { fontFamily: font.label, fontSize: 16, letterSpacing: 1, color: c.mute },
  solid: { backgroundColor: c.solid, borderRadius: radius.glass - 2 },
  solidText: { color: c.solidText },
  solidMute: { color: c.mode === 'dark' ? '#3B3E44' : '#B9BFCA' },
  seg: { flexDirection: 'row', padding: 4 },
  segItem: { flex: 1, minHeight: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  segOn: { backgroundColor: c.solid },
  segText: { fontFamily: font.bodyBold, fontSize: size.small + 1, color: c.textSoft },
  segTextOn: { color: c.solidText },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8 },
}));
