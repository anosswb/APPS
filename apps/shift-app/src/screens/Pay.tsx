/**
 * Pay: clock in and out (or type the time), each day's pay, the week on top and the month under it,
 * a pay-stub check, and the worker's own numbers. Estimates before taxes, never a promise.
 */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { addDays, monthWeeks, weekday } from '../core/dates';
import { clock } from '../core/dayline';
import { clockKey } from '../core/now';
import { payByRules, RulePay } from '../core/payrules';
import { t } from '../i18n/en';
import { LogDay, PayNumbers, payPlan, periodAround, rulesOf, Saved } from '../store';
import { font, size, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { AdSlot } from '../money/AdSlot';
import { hasPlus, SELLS_PLUS } from '../money/plus';
import { Caps, Field, Glass, GlassButton, GlassPill, Link, Segment, TimeField, Toggle } from '../ui/Bits';

const money = (n: number) => `$${Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
const r1 = (n: number) => Math.round(n * 10) / 10;
const wrap = (m: number) => ((m % 1440) + 1440) % 1440;
const over = (r: RulePay) => r.lines.filter((l) => l.percent > 0).reduce((s, l) => s + l.hours, 0);

export function Pay({ data, today, now, top, onChange, onPlus }: { data: Saved; today: string; now: Date; top: number; onChange: (next: Saved) => void; onPlus: () => void }) {
  const c = useTheme();
  const plus = hasPlus(data);
  // Without Plus the extras are kept but not counted, so nothing is lost when Plus is turned on.
  const p = plus ? data.pay : { ...data.pay, nightPercent: 0, saturdayPercent: 0, sundayPercent: 0, holidayPercent: 0 };
  const [weekOff, setWeekOff] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [typing, setTyping] = useState<number | null>(null);
  const [stubOff, setStubOff] = useState(-1);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const rules = rulesOf(p);
  const opts = { rate: p.rate, weekStarts: 0 };
  const logged = payPlan(data, today, false);
  const withPlan = payPlan(data, today, true);
  const run = (plan: typeof logged, a: string, b: string) => payByRules(plan, rules, opts, a, b);

  const weekStart = addDays(today, -weekday(today) + weekOff * 7);
  const weekEnd = addDays(weekStart, 6);
  const days = [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(weekStart, i));
  const week = run(logged, weekStart, weekEnd), weekAll = run(withPlan, weekStart, weekEnd);
  const y = Number(today.slice(0, 4)), m = Number(today.slice(5, 7));
  const mk = monthWeeks(y, m).flat().filter((k): k is string => !!k);
  const month = run(logged, mk[0], mk[mk.length - 1]), monthAll = run(withPlan, mk[0], mk[mk.length - 1]);
  const perDay = days.map((k) => run(logged, k, k));
  const maxH = Math.max(12, ...perDay.map((r) => r.hours));

  const setLog = (key: string, v: LogDay | null) => {
    const log = { ...data.log };
    if (v) log[key] = v; else delete log[key];
    onChange({ ...data, log });
  };
  const setPay = (patch: Partial<PayNumbers>) => onChange({ ...data, pay: { ...data.pay, ...patch } });
  const label = (key: string) => `${t.daysShort[weekday(key)]} ${Number(key.slice(8))}`;
  const mon = (key: string) => `${t.monthsShort[Number(key.slice(5, 7)) - 1]} ${Number(key.slice(8))}`;
  const more = (r: RulePay, all: RulePay) => (all.gross !== null && r.gross !== null && all.gross - r.gross > 0.005 ? t.pay.planned(`+${money(all.gross - r.gross)}`) : '');
  // A night shift clocked in yesterday stays on this card until clock-out.
  const ck = clockKey(data.log, today);
  const todayLog = data.log[ck];

  // The pay-stub check: the last finished period by default, arrows to move.
  const cur = periodAround(p, today);
  const per = periodAround(p, addDays(cur.start, stubOff * p.periodWeeks * 7));
  const perRun = run(logged, per.start, per.end);
  const stub = data.stubs[per.start];
  const setStub = (patch: Partial<{ hours: number; gross: number }>) => onChange({ ...data, stubs: { ...data.stubs, [per.start]: { hours: stub?.hours ?? 0, gross: stub?.gross ?? 0, ...patch } } });
  let verdict = t.pay.typeStub, good = false;
  if (stub && (stub.hours > 0 || stub.gross > 0)) {
    const dh = r1(perRun.hours - stub.hours), dm = (perRun.gross ?? 0) - stub.gross;
    const ms = p.rate > 0 && stub.gross > 0 && Math.abs(dm) >= 0.01 ? ` (${money(dm)})` : '';
    if (Math.abs(dh) < 0.05 && (stub.gross === 0 || Math.abs(dm) < 0.01)) { verdict = t.pay.match; good = true; }
    else if (dh >= 0.05) verdict = t.pay.more(t.pay.hours(dh), ms);
    else if (dh <= -0.05) verdict = t.pay.less(t.pay.hours(-dh), ms);
    else verdict = t.pay.moneyOnly(money(dm));
  }

  const dayEditor = (k: string, l: LogDay) => (
    <View style={{ paddingBottom: space.s }}>
      <TimeField label={t.pay.in} value={l.in} onChange={(v) => setLog(k, { ...l, in: v })} />
      <TimeField label={t.pay.out} value={l.out ?? minutes} onChange={(v) => setLog(k, { ...l, out: v })} />
      <Toggle label={t.pay.holiday} sub={t.pay.holidaySub} icon="flag" on={!!l.holiday} onChange={(on) => setLog(k, { ...l, holiday: on })} />
      <View style={st.editEnd}>
        <Link label={t.pay.remove} muted onPress={() => { setLog(k, null); setOpen(null); }} />
        <Link label={t.pay.close} onPress={() => setOpen(null)} />
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ width: '100%', maxWidth: size.maxContent, alignSelf: 'center', paddingTop: top + space.l, paddingHorizontal: space.m, paddingBottom: size.navSpace, gap: space.m }}>
      <Text style={[st.title, { color: c.text }]}>{t.pay.title}</Text>

      <Glass style={{ gap: space.m }}>
        <View style={st.clockHead}>
          <View style={{ flex: 1 }}>
            <Text style={[st.clockBig, { color: c.text }]}>
              {!todayLog ? t.pay.notIn : todayLog.out === null ? t.pay.inSince(clock(todayLog.in).text) : t.pay.doneToday(clock(todayLog.in).text, clock(todayLog.out).text)}
            </Text>
            {todayLog && todayLog.out === null && <Text style={[st.small, { color: c.textSoft }]}>{t.pay.worked(wrap(minutes - todayLog.in))}</Text>}
          </View>
          <GlassButton icon="edit" label={todayLog ? t.pay.edit : t.pay.typeTime} on={typing !== null || open === ck}
            onPress={() => { if (todayLog) setOpen(open === ck ? null : ck); else setTyping(typing === null ? minutes : null); }} />
        </View>
        {typing !== null && !todayLog && (
          <View>
            <Text style={[st.small, { color: c.textSoft }]}>{t.pay.forgot}</Text>
            <TimeField label={t.pay.started} value={typing} onChange={setTyping} />
            <View style={st.editEnd}>
              <Link label={t.pay.cancel} muted onPress={() => setTyping(null)} />
              <Link label={t.pay.save} onPress={() => { setLog(today, { in: typing, out: null }); setTyping(null); }} />
            </View>
          </View>
        )}
        {open === ck && todayLog && dayEditor(ck, todayLog)}
        {!todayLog && typing === null && <GlassPill icon="login" label={t.pay.clockIn} right={clock(minutes).text} onPress={() => setLog(today, { in: minutes, out: null })} />}
        {todayLog && todayLog.out === null && open !== ck && <GlassPill icon="logout" tone="blue" label={t.pay.clockOut} right={clock(minutes).text} onPress={() => setLog(ck, { ...todayLog, out: minutes })} />}
      </Glass>

      <Glass style={{ gap: space.xs }}>
        <Caps>{weekOff === 0 ? t.pay.week : t.pay.weekOf(mon(weekStart), mon(weekEnd)).toUpperCase()}</Caps>
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
          <GlassButton icon="left" label={t.pay.prevWeek} onPress={() => setWeekOff(weekOff - 1)} s={size.glassIcon} />
          <Text style={[st.weekText, { color: c.text }]}>{t.pay.weekOf(mon(weekStart), mon(weekEnd))}</Text>
          <GlassButton icon="right" label={t.pay.nextWeek} onPress={() => setWeekOff(Math.min(0, weekOff + 1))} s={size.glassIcon} />
        </View>
        <View style={st.legend}>
          <Caps>{t.pay.chart}</Caps>
          <View style={{ flex: 1 }} />
          <View style={[st.key, { backgroundColor: c.blue }]} /><Text style={[st.small, { color: c.textSoft }]}>{t.pay.normal}</Text>
          <View style={[st.key, { backgroundColor: c.green }]} /><Text style={[st.small, { color: c.textSoft }]}>{t.pay.over}</Text>
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
                  {(ot > 0 || l?.holiday) && <Text style={[st.small, { color: c.green }]}>{[l?.holiday ? t.pay.holiday : '', ot > 0 ? t.pay.overtime(r1(ot)) : ''].filter(Boolean).join(' · ')}</Text>}
                </View>
                {r.hours > 0 && (
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[st.dayMoney, { color: c.text }]}>{r.gross !== null ? money(r.gross) : t.pay.hours(r1(r.hours))}</Text>
                    {r.gross !== null && <Text style={[st.small, { color: c.muted }]}>{t.pay.hours(r1(r.hours))}</Text>}
                  </View>
                )}
              </Pressable>
              {open === k && l && k !== ck && dayEditor(k, l)}
            </View>
          );
        })}
      </Glass>

      {plus && (
        <>
      <Glass style={{ gap: space.s }}>
        <View style={st.weekNav}>
          <GlassButton icon="left" label={t.pay.prevPeriod} onPress={() => setStubOff(stubOff - 1)} s={size.glassIcon} />
          <View style={{ alignItems: 'center' }}>
            <Caps>{t.pay.stub}</Caps>
            <Text style={[st.weekText, { color: c.text, marginTop: 4 }]}>{t.pay.weekOf(mon(per.start), mon(per.end))}</Text>
          </View>
          <GlassButton icon="right" label={t.pay.nextPeriod} onPress={() => setStubOff(Math.min(0, stubOff + 1))} s={size.glassIcon} />
        </View>
        <View style={[st.monthRow, { borderTopColor: c.line, marginTop: space.xs }]}>
          <Text style={[st.monthLabel, { color: c.textSoft }]}>{t.pay.yourLog}</Text>
          <Text style={[st.monthNum, { color: c.text }]}>{`${t.pay.hours(r1(perRun.hours))}${perRun.gross !== null ? `  ·  ${money(perRun.gross)}` : ''}`}</Text>
        </View>
        <Field label={t.pay.stubHours} value={stub?.hours ?? 0} onChange={(v) => setStub({ hours: v })} suffix="h" max={400} />
        <Field label={t.pay.stubGross} value={stub?.gross ?? 0} onChange={(v) => setStub({ gross: v })} prefix="$" max={99999} />
        <Text style={[st.verdict, { color: good ? c.green : c.text }]}>{verdict}</Text>
      </Glass>

        </>
      )}
      {!plus && (
        <Glass style={{ gap: space.s }}>
          <Caps color={c.green}>{t.plus.locked}</Caps>
          <Text style={[st.monthLabel, { color: c.text }]}>{t.plus.lockedSub}</Text>
          <GlassPill icon="receipt" label={t.plus.see} onPress={onPlus} />
        </Glass>
      )}
      <Glass style={{ paddingVertical: space.m }}>
        <Caps>{t.pay.mine}</Caps>
        <Field label={t.pay.rate} value={p.rate} onChange={(v) => setPay({ rate: v })} prefix="$" max={1000} />
        <Field label={t.pay.fixed} value={p.dayHours} onChange={(v) => setPay({ dayHours: v })} suffix="h" max={24} />
        <Field label={t.pay.otExtra} value={p.dayPercent} onChange={(v) => setPay({ dayPercent: v })} suffix="%" max={500} />
        <Field label={t.pay.weekHours} value={p.weekHours} onChange={(v) => setPay({ weekHours: v })} suffix="h" max={168} />
        <Field label={t.pay.weekPercent} value={p.weekPercent} onChange={(v) => setPay({ weekPercent: v })} suffix="%" max={500} />
        {plus && (
          <>
        <View style={{ marginTop: space.l }}><Caps>{t.pay.rules}</Caps></View>
        <Field label={t.pay.nightPct} value={p.nightPercent} onChange={(v) => setPay({ nightPercent: v })} suffix="%" max={500} />
        <TimeField label={t.pay.nightFrom} value={p.nightFrom} onChange={(v) => setPay({ nightFrom: v })} />
        <TimeField label={t.pay.nightTo} value={p.nightTo} onChange={(v) => setPay({ nightTo: v })} />
        <Field label={t.pay.saturday} value={p.saturdayPercent} onChange={(v) => setPay({ saturdayPercent: v })} suffix="%" max={500} />
        <Field label={t.pay.sunday} value={p.sundayPercent} onChange={(v) => setPay({ sundayPercent: v })} suffix="%" max={500} />
        <Field label={t.pay.holidayPct} value={p.holidayPercent} onChange={(v) => setPay({ holidayPercent: v })} suffix="%" max={500} />
        <Text style={[st.small, { color: c.textSoft, marginTop: space.s }]}>{t.pay.highest}</Text>
          </>
        )}
        <View style={{ marginTop: space.l, gap: space.s }}>
          <Caps>{t.pay.period}</Caps>
          <Segment options={[[1, t.pay.weekly], [2, t.pay.biweekly]]} value={p.periodWeeks} onChange={(v) => setPay({ periodWeeks: v as 1 | 2 })} />
          {p.periodWeeks === 2 && <Link label={t.pay.movePeriod} onPress={() => setPay({ periodStart: addDays(p.periodStart, 7) })} />}
        </View>
        <Text style={[st.small, { color: c.muted, marginTop: space.m }]}>{t.pay.note}</Text>
        {SELLS_PLUS && data.plus && <Text style={[st.small, { color: c.green, marginTop: space.s }]}>{t.plus.have}</Text>}
      </Glass>
      <AdSlot />
    </ScrollView>
  );
}


const st = StyleSheet.create({
  title: { fontFamily: font.display, fontSize: type.title.size, letterSpacing: type.title.tracking, paddingHorizontal: space.s },
  clockHead: { flexDirection: 'row', alignItems: 'center', gap: space.s },
  clockBig: { fontFamily: font.display, fontSize: type.big.size, letterSpacing: type.big.tracking },
  big: { fontFamily: font.display, fontSize: type.hero.size - 6, lineHeight: type.hero.line - 4, letterSpacing: type.hero.tracking, marginTop: space.xs },
  monthRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', borderTopWidth: 1, marginTop: space.m, paddingTop: space.m },
  monthLabel: { fontFamily: font.text, fontSize: type.body.size - 1 },
  monthNum: { fontFamily: font.textHeavy, fontSize: type.body.size + 1 },
  small: { fontFamily: font.text, fontSize: type.small.size, lineHeight: type.small.line },
  verdict: { fontFamily: font.textBold, fontSize: type.body.size - 1, lineHeight: type.body.line, marginTop: space.s },
  weekNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
});
