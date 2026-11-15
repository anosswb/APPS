/** Pay: the worker's own rate and overtime numbers, and what this week and this month come to. Estimates only. */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addDays, monthWeeks, weekday } from '../core/dates';
import { Plan } from '../core/days';
import { payByRules, RulePay } from '../core/payrules';
import { t } from '../i18n/en';
import { PayNumbers, rulesOf, Saved } from '../store';
import { font, radius, size, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Caps, Stepper } from '../ui/Stepper';

const money = (n: number) => `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export function Pay({ data, today, top, onChange }: { data: Saved; today: string; top: number; onChange: (next: Saved) => void }) {
  const c = useTheme();
  const p = data.pay;
  const [rateText, setRateText] = useState(p.rate > 0 ? `${p.rate}` : '');
  const plan: Plan = { book: data.book };
  const rules = rulesOf(p);
  const opts = { rate: p.rate, weekStarts: 0 };
  const weekStart = addDays(today, -weekday(today));
  const week = payByRules(plan, rules, opts, weekStart, addDays(weekStart, 6));
  const y = Number(today.slice(0, 4)), m = Number(today.slice(5, 7));
  const keys = monthWeeks(y, m).flat().filter((k): k is string => !!k);
  const month = payByRules(plan, rules, opts, keys[0], keys[keys.length - 1]);
  const set = (k: keyof PayNumbers, by: number, min: number, max: number) => onChange({ ...data, pay: { ...p, [k]: Math.min(max, Math.max(min, p[k] + by)) } });
  const pct = (n: number) => (n > 0 ? t.pay.plus(n) : t.pay.off);

  const block = (title: string, r: RulePay) => (
    <View style={[st.panel, { backgroundColor: c.surface, borderColor: c.line }]}>
      <Caps>{title}</Caps>
      <View style={st.top}>
        <Text style={[st.big, { color: c.text }]}>{r.gross !== null ? money(r.gross) : t.pay.hours(r.hours)}</Text>
        {r.gross !== null && <Text style={[st.side, { color: c.textSoft }]}>{t.pay.hours(r.hours)}</Text>}
      </View>
      <Text style={[st.note, { color: c.muted }]}>{r.gross !== null ? t.pay.estimate : t.pay.noRate}</Text>
      {r.lines.filter((l) => l.percent > 0).length > 0 && r.lines.map((l) => (
        <View key={l.percent} style={[st.line, { borderTopColor: c.line }]}>
          <Text style={[st.lineText, { color: c.textSoft }]}>{l.percent > 0 ? `${l.names.join(', ')}  ${t.pay.plus(l.percent)}` : t.pay.normal}</Text>
          <Text style={[st.lineNum, { color: l.percent > 0 ? c.accentText : c.text }]}>{t.pay.hours(l.hours)}</Text>
        </View>
      ))}
      {r.open > 0 && <Text style={[st.note, { color: c.muted }]}>{t.pay.open(r.open)}</Text>}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: top + space.m, paddingHorizontal: space.l, paddingBottom: space.xl, gap: space.m }}>
      <Text style={[st.title, { color: c.text }]}>{t.pay.title}</Text>
      {block(t.pay.thisWeek, week)}
      {block(t.pay.thisMonth, month)}

      <View style={{ marginTop: space.m }}>
        <Caps>{t.pay.mine}</Caps>
        <View style={[st.rateRow, { borderTopColor: c.line }]}>
          <Text style={[st.rateLabel, { color: c.textSoft }]}>{t.pay.rate}</Text>
          <Text style={[st.dollar, { color: c.muted }]}>$</Text>
          <TextInput
            value={rateText}
            onChangeText={(v) => { const clean = v.replace(',', '.').replace(/[^0-9.]/g, ''); setRateText(clean); const n = parseFloat(clean); onChange({ ...data, pay: { ...p, rate: Number.isFinite(n) ? Math.min(1000, n) : 0 } }); }}
            keyboardType="decimal-pad" placeholder={t.pay.ratePlaceholder} placeholderTextColor={c.muted} accessibilityLabel={t.pay.rate} maxLength={7}
            style={[st.input, { color: c.text, backgroundColor: c.surface, borderColor: c.line }]} />
        </View>
        <Stepper label={t.pay.weekHours} value={t.pay.hours(p.weekHours)} onLess={() => set('weekHours', -1, 1, 100)} onMore={() => set('weekHours', 1, 1, 100)} />
        <Stepper label={t.pay.weekPercent} value={pct(p.weekPercent)} onLess={() => set('weekPercent', -5, 0, 300)} onMore={() => set('weekPercent', 5, 0, 300)} />
        <Stepper label={t.pay.dayHours} value={t.pay.hours(p.dayHours)} onLess={() => set('dayHours', -0.5, 1, 24)} onMore={() => set('dayHours', 0.5, 1, 24)} />
        <Stepper label={t.pay.dayPercent} value={pct(p.dayPercent)} onLess={() => set('dayPercent', -5, 0, 300)} onMore={() => set('dayPercent', 5, 0, 300)} />
        <Stepper label={t.pay.sunday} value={pct(p.sundayPercent)} onLess={() => set('sundayPercent', -5, 0, 300)} onMore={() => set('sundayPercent', 5, 0, 300)} />
        <Text style={[st.note, { color: c.muted, marginTop: space.m }]}>{t.pay.note}</Text>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  title: { fontFamily: font.display, fontSize: type.title.size, letterSpacing: type.title.tracking },
  panel: { borderRadius: radius.panel, borderWidth: 1, padding: space.m, gap: space.xs },
  top: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: space.xs },
  big: { fontFamily: font.display, fontSize: type.title.size + 6, letterSpacing: type.title.tracking },
  side: { fontFamily: font.number, fontSize: type.big.size - 2 },
  note: { fontFamily: font.text, fontSize: type.small.size + 1, lineHeight: type.label.line },
  line: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: space.s, marginTop: space.xs },
  lineText: { fontFamily: font.text, fontSize: type.label.size },
  lineNum: { fontFamily: font.number, fontSize: type.label.size + 1 },
  rateRow: { flexDirection: 'row', alignItems: 'center', minHeight: size.tap + 12, borderTopWidth: 1, marginTop: space.s, gap: space.xs },
  rateLabel: { flex: 1, fontFamily: font.text, fontSize: type.body.size },
  dollar: { fontFamily: font.number, fontSize: type.big.size - 2 },
  input: { width: 120, height: size.step + 4, borderRadius: radius.day, borderWidth: 1, paddingHorizontal: space.s, fontFamily: font.number, fontSize: type.big.size - 2, textAlign: 'right' },
});
