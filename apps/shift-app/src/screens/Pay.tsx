/**
 * Pay: clock in and out each day, see each day's pay, and the week and the month on top.
 * Everything is worked out from the worker's own numbers. Estimates before taxes, never a promise.
 */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addDays, monthWeeks, weekday } from '../core/dates';
import { clock } from '../core/dayline';
import { payByRules, RulePay } from '../core/payrules';
import { t } from '../i18n/en';
import { PayNumbers, payPlan, rulesOf, Saved } from '../store';
import { font, radius, size, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Caps, Glass, Pill, Stepper } from '../ui/Bits';
import { Icon } from '../ui/Icon';

const money = (n: number) => `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
const r1 = (n: number) => Math.round(n * 10) / 10;
const wrap = (m: number) => ((m % 1440) + 1440) % 1440;
const over = (r: RulePay) => r.lines.filter((l) => l.percent > 0).reduce((s, l) => s + l.hours, 0);

export function Pay({ data, today, now, top, onChange }: { data: Saved; today: string; now: Date; top: number; onChange: (next: Saved) => void }) {
  const c = useTheme();
  const p = data.pay;
  const [rateText, setRateText] = useState(p.rate > 0 ? `${p.rate}` : '');
  const [weekOff, setWeekOff] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const rules = rulesOf(p);
  const opts = { rate: p.rate, weekStarts: 0 };
  const logged = payPlan(data, today, false);
  const withPlan = payPlan(data, today, true);

  const weekStart = addDays(today, -weekday(today) + weekOff * 7);
  const weekEnd = addDays(weekStart, 6);
  const days = [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(weekStart, i));
  const week = payByRules(logged, rules, opts, weekStart, weekEnd);
  const weekAll = payByRules(withPlan, rules, opts, weekStart, weekEnd);
  const y = Number(today.slice(0, 4)), m = Number(today.slice(5, 7));
  const mk = monthWeeks(y, m).flat().filter((k): k is string => !!k);
  const month = payByRules(logged, rules, opts, mk[0], mk[mk.length - 1]);
  const monthAll = payByRules(withPlan, rules, opts, mk[0], mk[mk.length - 1]);
  const perDay = days.map((k) => payByRules(logged, rules, opts, k, k));
  const maxH = Math.max(12, ...perDay.map((r) => r.hours));

  const setLog = (key: string, v: { in: number; out: number | null } | null) => {
    const log = { ...data.log };
    if (v) log[key] = v; else delete log[key];
    onChange({ ...data, log });
  };
  const set = (k: keyof PayNumbers, by: number, min: number, max: number) => onChange({ ...data, pay: { ...p, [k]: Math.min(max, Math.max(min, p[k] + by)) } });
  const pct = (n: number) => (n > 0 ? t.pay.plus(n) : t.pay.off);
  const label = (key: string) => `${t.daysShort[weekday(key)]} ${Number(key.slice(8))}`;
  const mon = (key: string) => `${t.monthsShort[Number(key.slice(5, 7)) - 1]} ${Number(key.slice(8))}`;
  const todayLog = data.log[today];

  const more = (r: RulePay, all: RulePay) => (all.gross !== null && r.gross !== null && all.gross - r.gross > 0.005 ? t.pay.planned(`+${money(all.gross - r.gross)}`) : '');
  const weekTitle = weekOff === 0 ? t.pay.week : t.pay.weekOf(mon(weekStart), mon(weekEnd)).toUpperCase();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: top + space.l, paddingHorizontal: space.m, paddingBottom: space.xl, gap: space.m }}>
      <Text style={[st.title, { color: c.text }]}>{t.pay.title}</Text>

      <Glass style={{ gap: space.m }}>
        <View>
          <Text style={[st.clockBig, { color: c.text }]}>
            {!todayLog ? t.pay.notIn : todayLog.out === null ? t.pay.inSince(clock(todayLog.in).text) : t.pay.doneToday(clock(todayLog.in).text, clock(todayLog.out).text)}
          </Text>
          {todayLog && todayLog.out === null && <Text style={[st.small, { color: c.muted }]}>{t.pay.worked(wrap(minutes - todayLog.in))}</Text>}
        </View>
        {!todayLog && <Pill label={t.pay.clockIn} right={clock(minutes).text} onPress={() => setLog(today, { in: minutes, out: null })} />}
        {todayLog && todayLog.out === null && <Pill label={t.pay.clockOut} right={clock(minutes).text} onPress={() => setLog(today, { in: todayLog.in, out: minutes })} />}
      </Glass>

      <Glass style={{ gap: space.xs }}>
        <Caps>{weekTitle}</Caps>
        <Text style={[st.big, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>{week.gross !== null ? money(week.gross) : t.pay.hours(r1(week.hours))}</Text>
        <Text style={[st.small, { color: c.textSoft }]}>{week.gross !== null ? `${t.pay.hours(r1(week.hours))} · ${t.pay.earned}` : t.pay.noRate}</Text>
        {more(week, weekAll) !== '' && <Text style={[st.small, { color: c.green }]}>{more(week, weekAll)}</Text>}
        <View style={[st.monthRow, { borderTopColor: c.line }]}>
          <Text style={[st.monthLabel, { color: c.textSoft }]}>{t.pay.monthName(t.months[m - 1])}</Text>
          <Text style={[st.monthNum, { color: c.text }]}>{month.gross !== null ? money(month.gross) : t.pay.hours(r1(month.hours))}</Text>
        </View>
        {more(month, monthAll) !== '' && <Text style={[st.small, { color: c.green, textAlign: 'right' }]}>{more(month, monthAll)}</Text>}
      </Glass>

      <Glass style={{ gap: space.s }}>
        <View style={st.weekNav}>
          <Pressable onPress={() => setWeekOff(weekOff - 1)} accessibilityRole="button" accessibilityLabel={t.pay.prevWeek} hitSlop={8} style={[st.navBtn, { backgroundColor: c.raised }]}><Icon name="left" color={c.text} s={size.icon - 4} /></Pressable>
          <Text style={[st.weekText, { color: c.text }]}>{t.pay.weekOf(mon(weekStart), mon(weekEnd))}</Text>
          <Pressable onPress={() => setWeekOff(Math.min(0, weekOff + 1))} accessibilityRole="button" accessibilityLabel={t.pay.nextWeek} hitSlop={8} style={[st.navBtn, { backgroundColor: c.raised, opacity: weekOff === 0 ? 0.35 : 1 }]}><Icon name="right" color={c.text} s={size.icon - 4} /></Pressable>
        </View>

        <View style={st.legend}>
          <Caps>{t.pay.chart}</Caps>
          <View style={{ flex: 1 }} />
          <View style={[st.key, { backgroundColor: c.blue }]} /><Text style={[st.small, { color: c.muted }]}>{t.pay.normal}</Text>
          <View style={[st.key, { backgroundColor: c.green }]} /><Text style={[st.small, { color: c.muted }]}>{t.pay.over}</Text>
        </View>
        <View style={[st.chart, { borderBottomColor: c.line }]}>
          {perDay.map((r, i) => {
            const ot = over(r), norm = r.hours - ot;
            return (
              <View key={days[i]} style={st.col} accessibilityLabel={`${label(days[i])}: ${t.pay.hours(r1(r.hours))}${ot > 0 ? `, ${t.pay.overtime(r1(ot))}` : ''}`}>
                {ot > 0 && <View style={[st.bar, st.barTop, { height: (ot / maxH) * size.chart, backgroundColor: c.green, marginBottom: 2 }]} />}
                {norm > 0 && <View style={[st.bar, ot > 0 ? null : st.barTop, { height: (norm / maxH) * size.chart, backgroundColor: c.blue }]} />}
              </View>
            );
          })}
        </View>
        <View style={st.letters}>{days.map((k) => <Text key={k} style={[st.letter, { color: k === today ? c.text : c.muted }]}>{t.daysLetter[weekday(k)]}</Text>)}</View>

        {days.map((k, i) => {
          const l = data.log[k], r = perDay[i], ot = over(r), future = k > today;
          return (
            <View key={k} style={[st.dayRow, { borderTopColor: c.line }]}>
              <Pressable disabled={future} accessibilityRole="button" accessibilityLabel={label(k)} style={st.dayHead}
                onPress={() => { if (!l) setLog(k, { in: data.shift.start, out: data.shift.end }); setOpen(open === k ? null : k); }}>
                <Text style={[st.dayName, { color: k === today ? c.text : c.textSoft }]}>{label(k)}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[st.dayTimes, { color: l ? c.text : c.muted }]}>
                    {l ? (l.out === null ? t.pay.inSince(clock(l.in).text) : t.pay.doneToday(clock(l.in).text, clock(l.out).text)) : future ? '—' : t.pay.notLogged}
                  </Text>
                  {ot > 0 && <Text style={[st.small, { color: c.green }]}>{t.pay.overtime(r1(ot))}</Text>}
                </View>
                {r.hours > 0 && (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[st.dayMoney, { color: c.text }]}>{r.gross !== null ? money(r.gross) : t.pay.hours(r1(r.hours))}</Text>
                    {r.gross !== null && <Text style={[st.small, { color: c.muted }]}>{t.pay.hours(r1(r.hours))}</Text>}
                  </View>
                )}
              </Pressable>
              {open === k && l && (
                <View style={{ paddingBottom: space.s }}>
                  <Stepper label={t.pay.in} value={clock(l.in).text} onLess={() => setLog(k, { ...l, in: wrap(l.in - 5) })} onMore={() => setLog(k, { ...l, in: wrap(l.in + 5) })} />
                  <Stepper label={t.pay.out} value={clock(l.out ?? minutes).text} onLess={() => setLog(k, { ...l, out: wrap((l.out ?? minutes) - 5) })} onMore={() => setLog(k, { ...l, out: wrap((l.out ?? minutes) + 5) })} />
                  <View style={st.editEnd}>
                    <Pressable onPress={() => { setLog(k, null); setOpen(null); }} accessibilityRole="button" style={st.link}><Text style={[st.linkText, { color: c.muted }]}>{t.pay.remove}</Text></Pressable>
                    <Pressable onPress={() => setOpen(null)} accessibilityRole="button" style={st.link}><Text style={[st.linkText, { color: c.blue }]}>{t.pay.close}</Text></Pressable>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </Glass>

      <Glass style={{ paddingVertical: space.m }}>
        <Caps>{t.pay.mine}</Caps>
        <View style={st.rateRow}>
          <Text style={[st.rateLabel, { color: c.textSoft }]}>{t.pay.rate}</Text>
          <Text style={[st.dollar, { color: c.muted }]}>$</Text>
          <TextInput
            value={rateText}
            onChangeText={(v) => { const clean = v.replace(',', '.').replace(/[^0-9.]/g, ''); setRateText(clean); const n = parseFloat(clean); onChange({ ...data, pay: { ...p, rate: Number.isFinite(n) ? Math.min(1000, n) : 0 } }); }}
            keyboardType="decimal-pad" placeholder={t.pay.ratePlaceholder} placeholderTextColor={c.muted} accessibilityLabel={t.pay.rate} maxLength={7}
            style={[st.input, { color: c.text, backgroundColor: c.raised }]} />
        </View>
        <Stepper label={t.pay.fixed} value={t.pay.hours(p.dayHours)} onLess={() => set('dayHours', -0.5, 1, 24)} onMore={() => set('dayHours', 0.5, 1, 24)} />
        <Stepper label={t.pay.otExtra} value={pct(p.dayPercent)} onLess={() => set('dayPercent', -5, 0, 300)} onMore={() => set('dayPercent', 5, 0, 300)} />
        <Stepper label={t.pay.weekHours} value={t.pay.hours(p.weekHours)} onLess={() => set('weekHours', -1, 1, 100)} onMore={() => set('weekHours', 1, 1, 100)} />
        <Stepper label={t.pay.weekPercent} value={pct(p.weekPercent)} onLess={() => set('weekPercent', -5, 0, 300)} onMore={() => set('weekPercent', 5, 0, 300)} />
        <Stepper label={t.pay.sunday} value={pct(p.sundayPercent)} onLess={() => set('sundayPercent', -5, 0, 300)} onMore={() => set('sundayPercent', 5, 0, 300)} />
        <Text style={[st.small, { color: c.muted, marginTop: space.m }]}>{t.pay.note}</Text>
      </Glass>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  title: { fontFamily: font.display, fontSize: type.title.size, letterSpacing: type.title.tracking, paddingHorizontal: space.s },
  clockBig: { fontFamily: font.display, fontSize: type.big.size, letterSpacing: type.big.tracking },
  big: { fontFamily: font.display, fontSize: type.hero.size - 6, lineHeight: type.hero.line - 4, letterSpacing: type.hero.tracking, marginTop: space.xs },
  monthRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', borderTopWidth: 1, marginTop: space.m, paddingTop: space.m },
  monthLabel: { fontFamily: font.text, fontSize: type.body.size - 1 },
  monthNum: { fontFamily: font.textHeavy, fontSize: type.body.size + 2 },
  small: { fontFamily: font.text, fontSize: type.small.size, lineHeight: type.small.line },
  weekNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: { width: size.step, height: size.step, borderRadius: size.step / 2, alignItems: 'center', justifyContent: 'center' },
  weekText: { fontFamily: font.textBold, fontSize: type.body.size },
  legend: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: space.s },
  key: { width: 8, height: 8, borderRadius: 2, marginStart: space.xs },
  chart: { height: size.chart + 4, flexDirection: 'row', alignItems: 'flex-end', borderBottomWidth: 1 },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: size.chartBar },
  barTop: { borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  letters: { flexDirection: 'row', marginBottom: space.xs },
  letter: { flex: 1, textAlign: 'center', fontFamily: font.textBold, fontSize: type.small.size },
  dayRow: { borderTopWidth: 1 },
  dayHead: { flexDirection: 'row', alignItems: 'center', minHeight: size.tap + 10, gap: space.s },
  dayName: { width: 58, fontFamily: font.textHeavy, fontSize: type.label.size },
  dayTimes: { fontFamily: font.text, fontSize: type.label.size + 1 },
  dayMoney: { fontFamily: font.textHeavy, fontSize: type.body.size },
  editEnd: { flexDirection: 'row', justifyContent: 'space-between' },
  link: { minHeight: size.step, justifyContent: 'center' },
  linkText: { fontFamily: font.textBold, fontSize: type.label.size + 1 },
  rateRow: { flexDirection: 'row', alignItems: 'center', minHeight: size.tap + 12, gap: space.xs, marginTop: space.xs },
  rateLabel: { flex: 1, fontFamily: font.text, fontSize: type.body.size - 1 },
  dollar: { fontFamily: font.textHeavy, fontSize: type.body.size + 2 },
  input: { width: 118, height: size.step + 4, borderRadius: radius.inner, paddingHorizontal: space.m, fontFamily: font.textHeavy, fontSize: type.body.size + 2, textAlign: 'right' },
});
