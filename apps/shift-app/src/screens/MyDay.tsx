/** My day: the 24 hours around a shift as one ring, then the times as plain lines, then the worker's own numbers. */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { weekday } from '../core/dates';
import { clock, dayLine, Habits } from '../core/dayline';
import { dayOn, nextWorkDay, Plan, shiftMinutes, WorkDay } from '../core/days';
import { t } from '../i18n/en';
import { Saved } from '../store';
import { color, font, size, space, type } from '../theme/tokens';
import { Icon } from '../ui/Icon';

const R = 112;
const BOX = 2 * R + size.ring + 8;

function arcPath(fromMin: number, toMin: number): string {
  const pt = (m: number) => { const an = (m / 1440) * 2 * Math.PI; return [BOX / 2 + R * Math.sin(an), BOX / 2 - R * Math.cos(an)]; };
  let span = toMin - fromMin;
  while (span <= 0) span += 1440;
  const [x1, y1] = pt(fromMin), [x2, y2] = pt(fromMin + span);
  return `M${x1} ${y1}A${R} ${R} 0 ${span > 720 ? 1 : 0} 1 ${x2} ${y2}`;
}

/** "6 AM" when the time is on the hour, so the middle of the ring stays short. */
const short = (m: number) => clock(m).text.replace(':00', '');

export function MyDay({ data, today, now, top, onChange }: { data: Saved; today: string; now: Date; top: number; onChange: (next: Saved) => void }) {
  const { width } = useWindowDimensions();
  const plan: Plan = { book: data.book };
  const todayDay = dayOn(plan, today);
  const next = nextWorkDay(plan, today);
  const day: WorkDay | null = todayDay?.kind === 'work' ? todayDay : next?.day ?? null;
  const isToday = todayDay?.kind === 'work';
  const d = new Date(today + 'T12:00:00');
  const minutes = now.getHours() * 60 + now.getMinutes();
  const an = (minutes / 1440) * 2 * Math.PI;

  const step = (label: string, value: string, less: () => void, more: () => void) => (
    <View style={st.row} key={label}>
      <Text style={st.what}>{label}</Text>
      <Pressable onPress={less} accessibilityRole="button" accessibilityLabel={t.myDay.less(label)} style={st.step}><Icon name="minus" color={color.text} /></Pressable>
      <Text style={st.val}>{value}</Text>
      <Pressable onPress={more} accessibilityRole="button" accessibilityLabel={t.myDay.more(label)} style={st.step}><Icon name="plus" color={color.text} /></Pressable>
    </View>
  );
  const wrap = (m: number) => ((m % 1440) + 1440) % 1440;
  const shift = (k: 'start' | 'end', by: number) => onChange({ ...data, shift: { ...data.shift, [k]: wrap(data.shift[k] + by) } });
  const habit = (k: keyof Habits, by: number, min: number, max: number) => onChange({ ...data, habits: { ...data.habits, [k]: Math.min(max, Math.max(min, data.habits[k] + by)) } });

  const line = day ? dayLine(day, data.habits) : null;
  const rows: [number, string, boolean][] = line
    ? [[line.wake, t.myDay.rows.wake, false], [line.leave, t.myDay.rows.leave, false], [line.clockIn, t.myDay.rows.clockIn, true], [line.eat, t.myDay.rows.eat, false], [line.clockOut, t.myDay.rows.clockOut, true], [line.home, t.myDay.rows.home, false], [line.sleepBy + 1440, t.myDay.rows.sleepBy, false]]
    : [];

  return (
    <ScrollView style={st.fill} contentContainerStyle={{ paddingTop: top + space.m, paddingHorizontal: space.l, paddingBottom: space.xl }}>
      <View style={st.head}>
        <Text style={st.title}>{t.myDay.title}</Text>
        <Text style={st.date}>{isToday || !next ? `${t.daysShort[d.getDay()]}, ${t.monthsShort[d.getMonth()]} ${d.getDate()}` : t.myDay.nextShift(t.days[weekday(next.key)])}</Text>
      </View>

      {day && line ? (
        <>
          <Text style={st.tick}>{t.myDay.midnight}</Text>
          <View style={{ width: BOX, height: BOX, alignSelf: 'center' }}>
            <Svg width={BOX} height={BOX}>
              <Circle cx={BOX / 2} cy={BOX / 2} r={R} stroke={color.ringTrack} strokeWidth={size.ring} fill="none" />
              <Path d={arcPath(line.sleepBy, line.wake)} stroke={color.sleep} strokeWidth={size.ring} strokeLinecap="round" fill="none" />
              <Path d={arcPath(line.clockIn, line.clockOut)} stroke={color.sun} strokeWidth={size.ring} strokeLinecap="round" fill="none" />
              {isToday && <Circle cx={BOX / 2 + R * Math.sin(an)} cy={BOX / 2 - R * Math.cos(an)} r={10} fill={color.sunCore} stroke={color.bg} strokeWidth={4} />}
            </Svg>
            <View style={st.mid}>
              <Text style={st.midSmall}>{t.myDay.shift}</Text>
              <Text style={st.midBig} numberOfLines={1} adjustsFontSizeToFit>{`${short(line.clockIn)} – ${short(line.clockOut)}`}</Text>
              <Text style={st.midSmall}>{t.myDay.hours(Math.round(shiftMinutes(day) / 6) / 10)}</Text>
            </View>
          </View>
          <Text style={[st.tick, { marginBottom: space.m }]}>{t.myDay.noon}</Text>
          {rows.map(([m, label, hi]) => (
            <View style={st.row} key={label}>
              <Text style={[st.time, hi && st.hi]}>{clock(m).text}</Text>
              <Text style={[st.what, hi && st.hi]}>{label}</Text>
            </View>
          ))}
        </>
      ) : (
        <View style={st.empty}>
          <Text style={st.emptyBig}>{t.myDay.empty}</Text>
          <Text style={st.what}>{t.myDay.emptyDo}</Text>
        </View>
      )}

      <Text style={st.section}>{t.myDay.numbers}</Text>
      {step(t.myDay.start, clock(data.shift.start).text, () => shift('start', -30), () => shift('start', 30))}
      {step(t.myDay.end, clock(data.shift.end).text, () => shift('end', -30), () => shift('end', 30))}
      {step(t.myDay.getReady, t.myDay.min(data.habits.getReady), () => habit('getReady', -5, 5, 180), () => habit('getReady', 5, 5, 180))}
      {step(t.myDay.commute, t.myDay.min(data.habits.commute), () => habit('commute', -5, 0, 180), () => habit('commute', 5, 0, 180))}
      {step(t.myDay.sleep, t.myDay.hrs(data.habits.sleep), () => habit('sleep', -0.5, 3, 12), () => habit('sleep', 0.5, 3, 12))}
      <Text style={st.note}>{t.myDay.numbersNote}</Text>
      <View style={{ width, height: 1 }} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: color.bg },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: space.m },
  title: { fontFamily: font.display, fontSize: type.title.size, letterSpacing: type.title.tracking, color: color.text },
  date: { fontFamily: font.textBold, fontSize: type.label.size, color: color.muted },
  tick: { fontFamily: font.textBold, fontSize: type.small.size, color: color.muted, textAlign: 'center', marginVertical: space.xs },
  mid: { position: 'absolute', left: size.ring + 16, right: size.ring + 16, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: space.xs },
  midSmall: { fontFamily: font.text, fontSize: type.label.size - 1, color: color.muted },
  midBig: { fontFamily: font.display, fontSize: 28, color: color.text, letterSpacing: -0.8 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.tap, borderTopWidth: 1, borderTopColor: color.line },
  time: { width: 124, fontFamily: font.number, fontSize: 22, color: color.text },
  what: { flex: 1, fontFamily: font.text, fontSize: type.body.size - 1, lineHeight: type.body.line, color: color.textSoft },
  hi: { color: color.sun },
  empty: { paddingVertical: space.xl, gap: space.s },
  emptyBig: { fontFamily: font.number, fontSize: type.number.size, color: color.text },
  section: { fontFamily: font.display, fontSize: type.number.size, color: color.text, marginTop: space.xl, marginBottom: space.s },
  step: { width: size.step, height: size.step, borderRadius: size.step / 2, backgroundColor: color.surface, alignItems: 'center', justifyContent: 'center' },
  val: { width: 92, textAlign: 'center', fontFamily: font.number, fontSize: 18, color: color.text },
  note: { fontFamily: font.text, fontSize: type.small.size + 1, color: color.muted, marginTop: space.s },
});
