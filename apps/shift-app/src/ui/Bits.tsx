/**
 * Shared pieces. Glass ("liquid glass, not too much", Anass 15 Nov): a see-through fill, a thin edge and a soft light
 * on the top half. Lit pieces turn green, like the switches in the phone's control center.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { clock } from '../core/dayline';
import { t } from '../i18n/en';
import { font, radius, size, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Icon, IconName } from './Icon';

/** The light on the top of a glass piece. */
function Shine({ r, on }: { r: number; on?: boolean }) {
  const c = useTheme();
  return <LinearGradient pointerEvents="none" colors={[on ? 'rgba(255,255,255,0.30)' : c.glass.hi, 'rgba(255,255,255,0)']} locations={[0, 0.6]} style={[StyleSheet.absoluteFill, { borderRadius: r }]} />;
}

export function Glass({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const c = useTheme();
  return <View style={[st.glass, { backgroundColor: c.card, borderColor: c.cardLine }, style]}>{children}</View>;
}

export function Caps({ children, color }: { children: string; color?: string }) {
  const c = useTheme();
  return <Text style={[st.caps, { color: color ?? c.muted }]}>{children}</Text>;
}

/** A round glass switch or button. `on` lights it green. */
export function GlassButton({ icon, label, on, onPress, s = size.glassBtn }: { icon: IconName; label: string; on?: boolean; onPress: () => void; s?: number }) {
  const c = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: !!on }} hitSlop={4}
      style={({ pressed }) => [st.round, { width: s, height: s, borderRadius: s / 2, backgroundColor: on ? c.glass.on : c.glass.fill, borderColor: on ? c.glass.onEdge : c.glass.edge, transform: [{ scale: pressed ? 0.94 : 1 }] }]}>
      <Shine r={s / 2} on={on} />
      <Icon name={icon} color={on ? '#FFFFFF' : c.text} s={s * 0.42} />
    </Pressable>
  );
}

/** A glass capsule with a lit circle on the left, like the Focus switch. The main action of a panel. */
export function GlassPill({ icon, label, right, onPress, tone = 'green' }: { icon: IconName; label: string; right?: string; onPress: () => void; tone?: 'green' | 'blue' | 'plain' }) {
  const c = useTheme();
  const dot = tone === 'green' ? c.glass.on : tone === 'blue' ? c.blue : c.raised;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={right ? `${label} ${right}` : label}
      style={({ pressed }) => [st.pill, { backgroundColor: c.glass.fill, borderColor: c.glass.edge, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
      <Shine r={radius.pill} />
      <View style={[st.dot, { backgroundColor: dot }]}><Icon name={icon} color={tone === 'plain' ? c.text : '#FFFFFF'} s={size.icon} /></View>
      <Text style={[st.pillText, { color: c.text }]} numberOfLines={1}>{label}</Text>
      {right && <Text style={[st.pillRight, { color: c.textSoft }]}>{right}</Text>}
    </Pressable>
  );
}

/** Two or three choices in one glass track. */
export function Segment<T extends string | number>({ options, value, onChange }: { options: [T, string][]; value: T; onChange: (v: T) => void }) {
  const c = useTheme();
  return (
    <View style={[st.seg, { backgroundColor: c.glass.fill, borderColor: c.glass.edge }]}>
      {options.map(([v, label]) => (
        <Pressable key={String(v)} onPress={() => onChange(v)} accessibilityRole="button" accessibilityState={{ selected: value === v }} style={[st.segBtn, value === v && { backgroundColor: c.raised }]}>
          <Text style={[st.segText, { color: value === v ? c.text : c.muted }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

/** A row with a label and a round glass switch. */
export function Toggle({ label, sub, icon, on, onChange }: { label: string; sub?: string; icon: IconName; on: boolean; onChange: (on: boolean) => void }) {
  const c = useTheme();
  return (
    <View style={[st.row, { borderTopColor: c.line }]}>
      <View style={{ flex: 1, paddingEnd: space.s }}>
        <Text style={[st.label, { color: c.text }]}>{label}</Text>
        {sub && <Text style={[st.sub, { color: c.muted }]}>{sub}</Text>}
      </View>
      <GlassButton icon={icon} label={label} on={on} onPress={() => onChange(!on)} s={size.glassIcon + 6} />
    </View>
  );
}

/** A number the worker types with the keyboard. */
export function Field({ label, value, onChange, prefix, suffix, decimals = true, max = 9999 }: { label: string; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; decimals?: boolean; max?: number }) {
  const c = useTheme();
  const [text, setText] = useState(value ? `${value}` : '');
  useEffect(() => { if ((parseFloat(text) || 0) !== value) setText(value ? `${value}` : ''); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <View style={[st.row, { borderTopColor: c.line }]}>
      <Text style={[st.label, { color: c.textSoft, flex: 1 }]}>{label}</Text>
      <View style={[st.box, { backgroundColor: c.glass.fill, borderColor: c.glass.edge }]}>
        {prefix && <Text style={[st.affix, { color: c.muted }]}>{prefix}</Text>}
        <TextInput value={text} placeholder="0" placeholderTextColor={c.muted} accessibilityLabel={label} keyboardType={decimals ? 'decimal-pad' : 'number-pad'} maxLength={7} selectTextOnFocus
          onChangeText={(v) => { const clean = v.replace(',', '.').replace(decimals ? /[^0-9.]/g : /[^0-9]/g, ''); setText(clean); const n = parseFloat(clean); onChange(Number.isFinite(n) ? Math.min(max, n) : 0); }}
          style={[st.input, { color: c.text }]} />
        {suffix && <Text style={[st.affix, { color: c.muted }]}>{suffix}</Text>}
      </View>
    </View>
  );
}

const digitsOf = (m: number) => { const k = clock(m); const h = k.hour % 12 === 0 ? 12 : k.hour % 12; return `${h}${`${k.minute}`.padStart(2, '0')}`; };
const show = (d: string) => (d.length <= 2 ? d : `${d.slice(0, d.length - 2)}:${d.slice(-2)}`);
/** "630" → 6:30, "1215" → 12:15, "7" → 7:00. null when it is not a real time. */
export function parseTime(digits: string, pm: boolean): number | null {
  if (!digits) return null;
  const h = digits.length <= 2 ? +digits : +digits.slice(0, digits.length - 2);
  const m = digits.length <= 2 ? 0 : +digits.slice(-2);
  if (h < 1 || h > 12 || m > 59) return null;
  return ((h % 12) + (pm ? 12 : 0)) * 60 + m;
}

/** A clock time the worker types (for the day they forgot to clock in), with AM and PM. */
export function TimeField({ label, value, onChange }: { label: string; value: number; onChange: (m: number) => void }) {
  const c = useTheme();
  const [digits, setDigits] = useState(digitsOf(value));
  const pm = value >= 720;
  useEffect(() => { if (parseTime(digits, pm) !== value) setDigits(digitsOf(value)); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  const ampm = (p: boolean) => (
    <Pressable onPress={() => { const m = parseTime(digits, p); if (m !== null) onChange(m); }} accessibilityRole="button" accessibilityState={{ selected: pm === p }}
      style={[st.ampm, pm === p && { backgroundColor: c.raised }]}><Text style={[st.ampmText, { color: pm === p ? c.text : c.muted }]}>{p ? 'PM' : 'AM'}</Text></Pressable>
  );
  return (
    <View style={[st.row, { borderTopColor: c.line }]}>
      <Text style={[st.label, { color: c.textSoft, flex: 1 }]}>{label}</Text>
      <View style={[st.box, { backgroundColor: c.glass.fill, borderColor: c.glass.edge, width: 84 }]}>
        <TextInput value={show(digits)} accessibilityLabel={label} keyboardType="number-pad" maxLength={5} selectTextOnFocus
          onChangeText={(v) => { const d = v.replace(/[^0-9]/g, '').slice(0, 4); setDigits(d); const m = parseTime(d, pm); if (m !== null) onChange(m); }}
          style={[st.input, { color: c.text, textAlign: 'center' }]} />
      </View>
      <View style={[st.ampmTrack, { backgroundColor: c.glass.fill, borderColor: c.glass.edge }]}>{ampm(false)}{ampm(true)}</View>
    </View>
  );
}

export function Link({ label, onPress, muted }: { label: string; onPress: () => void; muted?: boolean }) {
  const c = useTheme();
  return <Pressable onPress={onPress} accessibilityRole="button" style={st.link}><Text style={[st.linkText, { color: muted ? c.muted : c.blue }]}>{label}</Text></Pressable>;
}

export const fmt = { time: (m: number) => clock(m).text, words: t };

const st = StyleSheet.create({
  glass: { borderRadius: radius.card, borderWidth: 1, padding: space.l },
  caps: { fontFamily: font.textHeavy, fontSize: type.caps.size, letterSpacing: type.caps.tracking },
  round: { borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  pill: { height: size.button + 8, borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: space.m, paddingStart: 6, paddingEnd: space.l, overflow: 'hidden' },
  dot: { width: size.button - 4, height: size.button - 4, borderRadius: (size.button - 4) / 2, alignItems: 'center', justifyContent: 'center' },
  pillText: { flex: 1, fontFamily: font.textHeavy, fontSize: type.body.size + 1 },
  pillRight: { fontFamily: font.textBold, fontSize: type.body.size },
  seg: { flexDirection: 'row', borderRadius: radius.inner, borderWidth: 1, padding: 4 },
  segBtn: { flex: 1, height: size.step, borderRadius: radius.inner - 4, alignItems: 'center', justifyContent: 'center' },
  segText: { fontFamily: font.textBold, fontSize: type.label.size },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.tap + 12, borderTopWidth: 1, gap: space.s },
  label: { fontFamily: font.text, fontSize: type.body.size - 1, lineHeight: type.body.line },
  sub: { fontFamily: font.text, fontSize: type.small.size, lineHeight: type.small.line, marginTop: 2 },
  box: { width: 116, height: size.step + 2, borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.m, gap: 4 },
  affix: { fontFamily: font.textBold, fontSize: type.body.size },
  input: { flex: 1, minWidth: 0, width: '100%', fontFamily: font.textHeavy, fontSize: type.body.size + 1, textAlign: 'right', paddingVertical: 0 },
  ampmTrack: { flexDirection: 'row', borderRadius: radius.pill, borderWidth: 1, padding: 3 },
  ampm: { width: 42, height: size.step - 6, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  ampmText: { fontFamily: font.textHeavy, fontSize: type.small.size },
  link: { minHeight: size.step, justifyContent: 'center' },
  linkText: { fontFamily: font.textBold, fontSize: type.label.size + 1 },
});
