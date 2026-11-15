/** My day: the 24 hours around a shift as one ring, then the times as plain lines, then the worker's own numbers. */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { weekday } from '../core/dates';
import { clock, dayLine, Habits } from '../core/dayline';
import { dayOn, nextWorkDay, shiftMinutes, WorkDay } from '../core/days';
import { t } from '../i18n/en';
import { planOf, Saved } from '../store';
import { font, radius, size, space, type } from '../theme/tokens';
import { Look, useTheme } from '../theme/useTheme';
import { Caps, Glass, Stepper } from '../ui/Bits';

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
  const shift = (k: 'start' | 'end', by: number) => onChange({ ...data, shift: { ...data.shift, [k]: wrap(data.shift[k] + by) } });
  const habit = (k: keyof Habits, by: number, min: number, max: number) => onChange({ ...data, habits: { ...data.habits, [k]: Math.min(max, Math.max(min, data.habits[k] + by)) } });

  const line = dayLine(day, data.habits);
  const rows: [number, string, boolean][] = [[line.wake, t.myDay.rows.wake, false], [line.leave, t.myDay.rows.leave, false], [line.clockIn, t.myDay.rows.clockIn, true], [line.eat, t.myDay.rows.eat, false], [line.clockOut, t.myDay.rows.clockOut, true], [line.home, t.myDay.rows.home, false], [line.sleepBy + 1440, t.myDay.rows.sleepBy, false]];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingTop: top + space.l, paddingHorizontal: space.m, paddingBottom: space.xl, gap: space.m }}>
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
        <Stepper label={t.myDay.start} value={clock(data.shift.start).text} onLess={() => shift('start', -30)} onMore={() => shift('start', 30)} />
        <Stepper label={t.myDay.end} value={clock(data.shift.end).text} onLess={() => shift('end', -30)} onMore={() => shift('end', 30)} />
        <Stepper label={t.myDay.getReady} value={t.myDay.min(data.habits.getReady)} onLess={() => habit('getReady', -5, 5, 180)} onMore={() => habit('getReady', 5, 5, 180)} />
        <Stepper label={t.myDay.commute} value={t.myDay.min(data.habits.commute)} onLess={() => habit('commute', -5, 0, 180)} onMore={() => habit('commute', 5, 0, 180)} />
        <Stepper label={t.myDay.sleep} value={t.myDay.hrs(data.habits.sleep)} onLess={() => habit('sleep', -0.5, 3, 12)} onMore={() => habit('sleep', 0.5, 3, 12)} />
      </Glass>

      <Glass style={{ paddingVertical: space.m, gap: space.s }}>
        <Caps>{t.myDay.look}</Caps>
        <View style={[st.seg, { backgroundColor: c.track }]}>
          {LOOKS.map((l) => (
            <Pressable key={l} onPress={() => onChange({ ...data, look: l })} accessibilityRole="button" accessibilityState={{ selected: data.look === l }} style={[st.segBtn, data.look === l && { backgroundColor: c.raised }]}>
              <Text style={[st.segText, { color: data.look === l ? c.text : c.muted }]}>{t.myDay.looks[l]}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={() => onChange({ ...data, welcomed: false })} accessibilityRole="button" style={st.link}><Text style={[st.linkText, { color: c.blue }]}>{t.myDay.guide}</Text></Pressable>
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
