/** My day: the 24 hours around a shift as one ring, then the times as plain lines, then the worker's own numbers. */
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { weekday } from '../core/dates';
import { clock, dayLine, Habits } from '../core/dayline';
import { dayOn, nextWorkDay, shiftMinutes, WorkDay } from '../core/days';
import { t } from '../i18n/en';
import { planOf, Saved } from '../store';
import { font, radius, size, space, type } from '../theme/tokens';
import { Look, useTheme } from '../theme/useTheme';
import { ask } from '../notify';
import { Caps, Field, Glass, Link, Segment, TimeField, Toggle } from '../ui/Bits';

const R = size.ringR;
const BOX = 2 * R + size.ring + 8;
const LOOKS: Look[] = ['auto', 'light', 'dark'];

function arcPath(fromMin: number, toMin: number): string {
  const pt = (m: number) => { const an = (m / 1440) * 2 * Math.PI; return [BOX / 2 + R * Math.sin(an), BOX / 2 - R * Math.cos(an)]; };
  let span = toMin - fromMin;
  while (span <= 0) span += 1440;
  const [x1, y1] = pt(fromMin), [x2, y2] = pt(fromMin + span);
  return `M${x1} ${y1}A${R} ${R} 0 ${span > 720 ? 1 : 0} 1 ${x2} ${y2}`;
}

const short = (m: number) => clock(m).text.replace(':00', '');
const wrap = (m: number) => ((m % 1440) + 1440) % 1440;

export function MyDay({ data, today, now, top, onChange }: { data: Saved; today: string; now: Date; top: number; onChange: (next: Saved) => void }) {
  const c = useTheme();
  const plan = planOf(data);
  const todayDay = dayOn(plan, today);
  const next = nextWorkDay(plan, today);
  const isToday = todayDay?.kind === 'work';
  // With no work day marked, the day line still shows the usual shift, so the numbers below always change something.
  const day: WorkDay = isToday ? (todayDay as WorkDay) : next?.day ?? { kind: 'work', start: data.shift.start, end: data.shift.end };
  const d = new Date(today + 'T12:00:00');
  const an = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 2 * Math.PI;
  const [blocked, setBlocked] = useState(false);
  const shift = (k: 'start' | 'end', v: number) => onChange({ ...data, shift: { ...data.shift, [k]: wrap(v) } });
  const habit = (k: keyof Habits, v: number, min: number) => onChange({ ...data, habits: { ...data.habits, [k]: Math.max(min, v) } });
  const remind = async (k: 'lunch' | 'twoLeft', on: boolean) => {
    if (on && !(await ask())) { setBlocked(Platform.OS !== 'web'); if (Platform.OS !== 'web') return; }
    setBlocked(false);
    onChange({ ...data, remind: { ...data.remind, [k]: on }, remindAsked: true });
  };

  const line = dayLine(day, data.habits);
  const rows: [number, string, boolean][] = [[line.wake, t.myDay.rows.wake, false], [line.leave, t.myDay.rows.leave, false], [line.clockIn, t.myDay.rows.clockIn, true], [line.eat, t.myDay.rows.eat, false], [line.clockOut, t.myDay.rows.clockOut, true], [line.home, t.myDay.rows.home, false], [line.sleepBy + 1440, t.myDay.rows.sleepBy, false]];

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: top + space.l, paddingHorizontal: space.m, paddingBottom: size.navSpace, gap: space.m }}>
      <View style={st.head}>
        <Text style={[st.title, { color: c.text }]}>{t.myDay.title}</Text>
        <Text style={[st.date, { color: c.muted }]}>{isToday ? `${t.daysShort[d.getDay()]}, ${t.monthsShort[d.getMonth()]} ${d.getDate()}` : next ? t.myDay.nextShift(t.days[weekday(next.key)]) : t.myDay.usual}</Text>
      </View>

      <Glass style={{ gap: space.s }}>
        <View style={{ width: BOX, height: BOX, alignSelf: 'center' }}>
          <Svg width={BOX} height={BOX}>
            <Circle cx={BOX / 2} cy={BOX / 2} r={R} stroke={c.track} strokeWidth={size.ring} fill="none" />
            <Path d={arcPath(line.sleepBy, line.wake)} stroke={c.sleep} strokeWidth={size.ring} strokeLinecap="round" fill="none" />
            <Path d={arcPath(line.clockIn, line.clockOut)} stroke={c.blue} strokeWidth={size.ring} strokeLinecap="round" fill="none" />
            {isToday && <Circle cx={BOX / 2 + R * Math.sin(an)} cy={BOX / 2 - R * Math.cos(an)} r={size.sun} fill={c.text} stroke={c.bg} strokeWidth={3} />}
          </Svg>
          <View style={st.mid}>
            <Caps>{t.myDay.shift}</Caps>
            <Text style={[st.midBig, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>{`${short(line.clockIn)} – ${short(line.clockOut)}`}</Text>
            <Text style={[st.midSmall, { color: c.muted }]}>{t.myDay.hours(Math.round(shiftMinutes(day) / 6) / 10)}</Text>
          </View>
        </View>
        {rows.map(([m, label, hi], i) => (
          <View style={[st.row, { borderTopColor: c.line, borderTopWidth: i === 0 ? 0 : 1 }]} key={label}>
            <Text style={[st.time, { color: c.text }]}>{clock(m).text}</Text>
            <Text style={[st.what, { color: hi ? c.blue : c.textSoft, fontFamily: hi ? font.textBold : font.text }]}>{label}</Text>
          </View>
        ))}
      </Glass>

      <Glass style={{ paddingVertical: space.m }}>
        <View style={{ marginBottom: space.s }}><Caps>{t.myDay.numbers}</Caps></View>
        <TimeField label={t.myDay.start} value={data.shift.start} onChange={(v) => shift('start', v)} />
        <TimeField label={t.myDay.end} value={data.shift.end} onChange={(v) => shift('end', v)} />
        <Field label={t.myDay.getReady} value={data.habits.getReady} onChange={(v) => habit('getReady', v, 0)} suffix="min" decimals={false} max={300} />
        <Field label={t.myDay.commute} value={data.habits.commute} onChange={(v) => habit('commute', v, 0)} suffix="min" decimals={false} max={300} />
        <Field label={t.myDay.sleep} value={data.habits.sleep} onChange={(v) => habit('sleep', v, 0)} suffix="h" max={14} />
      </Glass>

      <Glass style={{ paddingVertical: space.m }}>
        <Caps>{t.myDay.reminders}</Caps>
        <Toggle label={t.myDay.lunch} sub={t.myDay.lunchSub} icon="utensils" on={data.remind.lunch} onChange={(on) => remind('lunch', on)} />
        <Toggle label={t.myDay.twoLeft} sub={t.myDay.twoLeftSub} icon="hourglass" on={data.remind.twoLeft} onChange={(on) => remind('twoLeft', on)} />
        {blocked && <Text style={[st.what, { color: c.textSoft, marginTop: space.s }]}>{t.myDay.blocked}</Text>}
      </Glass>

      <Glass style={{ paddingVertical: space.m, gap: space.s }}>
        <Caps>{t.myDay.widget}</Caps>
        <Text style={[st.what, { color: c.textSoft }]}>{t.myDay.widgetHow}</Text>
      </Glass>

      <Glass style={{ paddingVertical: space.m, gap: space.s }}>
        <Caps>{t.myDay.look}</Caps>
        <Segment options={LOOKS.map((l) => [l, t.myDay.looks[l]] as [Look, string])} value={data.look} onChange={(l) => onChange({ ...data, look: l })} />
        <Link label={t.myDay.guide} onPress={() => onChange({ ...data, welcomed: false })} />
      </Glass>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: space.s },
  title: { fontFamily: font.display, fontSize: type.title.size, letterSpacing: type.title.tracking },
  date: { fontFamily: font.text, fontSize: type.label.size + 1 },
  mid: { position: 'absolute', left: size.ring + 18, right: size.ring + 18, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: space.xs },
  midSmall: { fontFamily: font.text, fontSize: type.label.size },
  midBig: { fontFamily: font.display, fontSize: type.big.size + 3, letterSpacing: type.big.tracking },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.tap - 4 },
  time: { width: size.timeCol, fontFamily: font.textHeavy, fontSize: type.body.size + 1 },
  what: { flex: 1, fontSize: type.body.size - 1, lineHeight: type.body.line },
  seg: { flexDirection: 'row', borderRadius: radius.inner, padding: 4 },
  segBtn: { flex: 1, height: size.step, borderRadius: radius.inner - 4, alignItems: 'center', justifyContent: 'center' },
  segText: { fontFamily: font.textBold, fontSize: type.label.size },
  link: { minHeight: size.step, justifyContent: 'center' },
  linkText: { fontFamily: font.textBold, fontSize: type.label.size + 1 },
});
