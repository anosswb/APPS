/** My day: the 24 hours around a shift as one ring, then the times as plain lines, then the worker's own numbers. */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { weekday } from '../core/dates';
import { clock, dayLine, Habits } from '../core/dayline';
import { DayBook, dayOn, nextWorkDay, Plan, shiftMinutes, WorkDay } from '../core/days';
import { t } from '../i18n/en';
import { Saved } from '../store';
import { font, radius, size, space, type } from '../theme/tokens';
import { Look, useTheme } from '../theme/useTheme';
import { Caps, Stepper } from '../ui/Stepper';

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

/** "6 AM" when the time is on the hour, so the middle of the ring stays short. */
const short = (m: number) => clock(m).text.replace(':00', '');
const wrap = (m: number) => ((m % 1440) + 1440) % 1440;

export function MyDay({ data, today, now, top, onChange }: { data: Saved; today: string; now: Date; top: number; onChange: (next: Saved) => void }) {
  const c = useTheme();
  const plan: Plan = { book: data.book };
  const todayDay = dayOn(plan, today);
  const next = nextWorkDay(plan, today);
  const day: WorkDay | null = todayDay?.kind === 'work' ? todayDay : next?.day ?? null;
  const isToday = todayDay?.kind === 'work';
  const d = new Date(today + 'T12:00:00');
  const an = ((now.getHours() * 60 + now.getMinutes()) / 1440) * 2 * Math.PI;

  // A new usual shift also moves every marked day that still had the old usual times (days changed by hand stay).
  const shift = (k: 'start' | 'end', by: number) => {
    const old = data.shift;
    const usual = { ...old, [k]: wrap(old[k] + by) };
    const book: DayBook = {};
    for (const [key, v] of Object.entries(data.book)) book[key] = v.kind === 'work' && v.start === old.start && v.end === old.end ? { ...v, start: usual.start, end: usual.end } : v;
    onChange({ ...data, shift: usual, book });
  };
  const habit = (k: keyof Habits, by: number, min: number, max: number) => onChange({ ...data, habits: { ...data.habits, [k]: Math.min(max, Math.max(min, data.habits[k] + by)) } });

  const line = day ? dayLine(day, data.habits) : null;
  const rows: [number, string, boolean][] = line
    ? [[line.wake, t.myDay.rows.wake, false], [line.leave, t.myDay.rows.leave, false], [line.clockIn, t.myDay.rows.clockIn, true], [line.eat, t.myDay.rows.eat, false], [line.clockOut, t.myDay.rows.clockOut, true], [line.home, t.myDay.rows.home, false], [line.sleepBy + 1440, t.myDay.rows.sleepBy, false]]
    : [];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ paddingTop: top + space.m, paddingHorizontal: space.l, paddingBottom: space.xl }}>
      <View style={st.head}>
        <Text style={[st.title, { color: c.text }]}>{t.myDay.title}</Text>
        <Text style={[st.date, { color: c.muted }]}>{isToday || !next ? `${t.daysShort[d.getDay()]}, ${t.monthsShort[d.getMonth()]} ${d.getDate()}` : t.myDay.nextShift(t.days[weekday(next.key)])}</Text>
      </View>

      {day && line ? (
        <>
          <Text style={[st.tick, { color: c.muted }]}>{t.myDay.midnight}</Text>
          <View style={{ width: BOX, height: BOX, alignSelf: 'center' }}>
            <Svg width={BOX} height={BOX}>
              <Circle cx={BOX / 2} cy={BOX / 2} r={R} stroke={c.track} strokeWidth={size.ring} fill="none" />
              <Path d={arcPath(line.sleepBy, line.wake)} stroke={c.sleep} strokeWidth={size.ring} strokeLinecap="round" fill="none" />
              <Path d={arcPath(line.clockIn, line.clockOut)} stroke={c.accent} strokeWidth={size.ring} strokeLinecap="round" fill="none" />
              {isToday && <Circle cx={BOX / 2 + R * Math.sin(an)} cy={BOX / 2 - R * Math.cos(an)} r={size.sun} fill={c.text} stroke={c.bg} strokeWidth={4} />}
            </Svg>
            <View style={st.mid}>
              <Caps>{t.myDay.shift}</Caps>
              <Text style={[st.midBig, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>{`${short(line.clockIn)} – ${short(line.clockOut)}`}</Text>
              <Text style={[st.midSmall, { color: c.muted }]}>{t.myDay.hours(Math.round(shiftMinutes(day) / 6) / 10)}</Text>
            </View>
          </View>
          <Text style={[st.tick, { color: c.muted, marginBottom: space.m }]}>{t.myDay.noon}</Text>
          {rows.map(([m, label, hi]) => (
            <View style={[st.row, { borderTopColor: c.line }]} key={label}>
              <Text style={[st.time, { color: hi ? c.accentText : c.text }]}>{clock(m).text}</Text>
              <Text style={[st.what, { color: hi ? c.accentText : c.textSoft }]}>{label}</Text>
            </View>
          ))}
        </>
      ) : (
        <View style={st.empty}>
          <Text style={[st.emptyBig, { color: c.text }]}>{t.myDay.empty}</Text>
          <Text style={[st.what, { color: c.textSoft }]}>{t.myDay.emptyDo}</Text>
        </View>
      )}

      <View style={st.section}><Caps>{t.myDay.numbers}</Caps></View>
      <Stepper label={t.myDay.start} value={clock(data.shift.start).text} onLess={() => shift('start', -30)} onMore={() => shift('start', 30)} />
      <Stepper label={t.myDay.end} value={clock(data.shift.end).text} onLess={() => shift('end', -30)} onMore={() => shift('end', 30)} />
      <Stepper label={t.myDay.getReady} value={t.myDay.min(data.habits.getReady)} onLess={() => habit('getReady', -5, 5, 180)} onMore={() => habit('getReady', 5, 5, 180)} />
      <Stepper label={t.myDay.commute} value={t.myDay.min(data.habits.commute)} onLess={() => habit('commute', -5, 0, 180)} onMore={() => habit('commute', 5, 0, 180)} />
      <Stepper label={t.myDay.sleep} value={t.myDay.hrs(data.habits.sleep)} onLess={() => habit('sleep', -0.5, 3, 12)} onMore={() => habit('sleep', 0.5, 3, 12)} />

      <View style={st.section}><Caps>{t.myDay.look}</Caps></View>
      <View style={[st.seg, { backgroundColor: c.surface, borderColor: c.line }]}>
        {LOOKS.map((l) => (
          <Pressable key={l} onPress={() => onChange({ ...data, look: l })} accessibilityRole="button" accessibilityState={{ selected: data.look === l }} style={[st.segBtn, data.look === l && { backgroundColor: c.today }]}>
            <Text style={[st.segText, { color: data.look === l ? c.onToday : c.textSoft }]}>{t.myDay.looks[l]}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: space.m },
  title: { fontFamily: font.display, fontSize: type.title.size, letterSpacing: type.title.tracking },
  date: { fontFamily: font.textBold, fontSize: type.label.size },
  tick: { fontFamily: font.textBold, fontSize: type.small.size, textAlign: 'center', marginVertical: space.xs },
  mid: { position: 'absolute', left: size.ring + 18, right: size.ring + 18, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: space.xs },
  midSmall: { fontFamily: font.text, fontSize: type.label.size },
  midBig: { fontFamily: font.display, fontSize: type.big.size + 4, letterSpacing: type.big.tracking },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: size.tap, borderTopWidth: 1 },
  time: { width: size.timeCol, fontFamily: font.number, fontSize: type.big.size - 2 },
  what: { flex: 1, fontFamily: font.text, fontSize: type.body.size, lineHeight: type.body.line },
  empty: { paddingVertical: space.xl, gap: space.s },
  emptyBig: { fontFamily: font.number, fontSize: type.big.size },
  section: { marginTop: space.xl, marginBottom: space.s },
  seg: { flexDirection: 'row', borderRadius: radius.panel, borderWidth: 1, padding: 4 },
  segBtn: { flex: 1, height: size.step, borderRadius: radius.panel - 4, alignItems: 'center', justifyContent: 'center' },
  segText: { fontFamily: font.textHeavy, fontSize: type.label.size },
});
