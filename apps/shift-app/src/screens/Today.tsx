/** Today: when do I rest, what is happening now, my week, my alarm. */
import * as IntentLauncher from 'expo-intent-launcher';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { addDays, weekday } from '../core/dates';
import { clock, dayLine } from '../core/dayline';
import { Day, dayOn, nextRest, nextWorkDay, Plan, shiftMinutes, workedInRow } from '../core/days';
import { t } from '../i18n/en';
import { Saved } from '../store';
import { font, radius, size, sky, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { DayCell } from '../ui/DayCell';
import { Icon } from '../ui/Icon';
import { Caps } from '../ui/Stepper';

const STARS = [[0.1, 0.12, 0.8], [0.33, 0.08, 0.5], [0.78, 0.15, 0.9], [0.9, 0.33, 0.5], [0.64, 0.07, 0.6], [0.86, 0.58, 0.3], [0.94, 0.2, 0.7], [0.74, 0.44, 0.4], [0.56, 0.62, 0.3]];
const SKYLINE = 'M0 34h44V20h10v14h30v-8h26v8h40V6h7v28h10V12h7v22h36l14-26 14 26h34v-10h30v10h22V16h9v18h57v26H0z';
/** "6a", "6:30p": a shift start small enough for a day cell. */
const tiny = (m: number) => { const k = clock(m); const h = k.hour % 12 === 0 ? 12 : k.hour % 12; return `${h}${k.minute ? ':' + `${k.minute}`.padStart(2, '0') : ''}${k.hour < 12 ? 'a' : 'p'}`; };

export function Today({ data, today, now, top, onCycle }: { data: Saved; today: string; now: Date; top: number; onCycle: (key: string) => void }) {
  const c = useTheme();
  const { width } = useWindowDimensions();
  const plan: Plan = { book: data.book };
  const skyH = size.sky + top;
  const minutes = now.getHours() * 60 + now.getMinutes();
  const hour = now.getHours();
  const colors = hour >= 4 && hour < 8 ? sky.dawn : hour >= 8 && hour < 17 ? sky.day : hour >= 17 && hour < 20 ? sky.dusk : sky.night;
  const stars = colors === sky.night || colors === sky.dawn;

  const todayDay = dayOn(plan, today);
  const rest = nextRest(plan, today);
  const row = workedInRow(plan, today);
  const work = nextWorkDay(plan, today);
  const line = todayDay?.kind === 'work' ? dayLine(todayDay, data.habits) : null;

  // The sun crosses the sky between waking and the end of the evening.
  const from = line ? line.wake : 6 * 60;
  const to = line ? line.home + 120 : 21 * 60;
  const p = Math.min(0.97, Math.max(0.03, (minutes - from) / (to - from)));
  const a = { x: 20, y: skyH - 16 }, b = { x: width / 2, y: skyH * 0.5 }, e = { x: width - 20, y: skyH - 16 };
  const sx = (1 - p) ** 2 * a.x + 2 * p * (1 - p) * b.x + p * p * e.x;
  const sy = (1 - p) ** 2 * a.y + 2 * p * (1 - p) * b.y + p * p * e.y;

  let l1: string, l2: string, sub = '';
  if (todayDay?.kind === 'rest') {
    [l1, l2] = t.today.restToday;
    if (work) sub = t.today.backOn(work.inDays === 1 ? 'tomorrow' : t.days[weekday(work.key)]);
  } else if (rest) {
    if (rest.inDays === 1) [l1, l2] = t.today.restTomorrow;
    else { l1 = t.today.restIn; l2 = t.today.nDays(rest.inDays); }
    sub = row > 0 ? t.today.inARow(row) : '';
    if (!rest.sure) sub = sub ? `${sub}\n${t.today.maybeSooner}` : t.today.maybeSooner;
  } else {
    [l1, l2] = t.today.noRest;
    sub = row > 0 ? t.today.inARow(row) : t.today.firstHint;
  }

  // What is happening now: one line, one number, one bar.
  let nowLeft: string, nowRight = '', bar = -1;
  if (todayDay?.kind === 'work') {
    const start = todayDay.start, end = start + shiftMinutes(todayDay);
    if (minutes < start) { nowLeft = t.today.now.clockIn(clock(start).text); nowRight = t.today.now.inTime(start - minutes); bar = 0; }
    else if (minutes < end) { nowLeft = t.today.now.clockOut(clock(end).text); nowRight = t.today.now.left(end - minutes); bar = (minutes - start) / (end - start); }
    else { nowLeft = t.today.now.done; bar = 1; if (work?.inDays === 1) nowRight = t.today.now.sleepBy(clock(dayLine(work.day, data.habits).sleepBy).text); }
  } else if (todayDay?.kind === 'rest') {
    nowLeft = t.today.now.restDay;
    if (work) nowRight = t.today.now.back(work.inDays === 1 ? 'tomorrow' : t.daysShort[weekday(work.key)], clock(work.day.start).text);
  } else { nowLeft = t.today.now.notMarked; nowRight = t.today.now.tapIt; }

  // The alarm is for today while it is still before wake-up time, otherwise for the next work day.
  const alarmToday = !!line && line.wake >= 0 && minutes < line.wake;
  const alarmDay: Day | null = alarmToday ? todayDay : work?.day ?? null;
  const wake = alarmDay?.kind === 'work' ? clock(dayLine(alarmDay, data.habits).wake) : null;
  const alarmName = alarmToday ? t.today.alarmToday : work ? t.today.alarmFor(t.days[weekday(work.key)]) : '';

  const setAlarm = async () => {
    if (!wake) return;
    const help = () => Alert.alert(t.today.alarmHelpTitle(wake.text), t.today.alarmHelp, [{ text: t.today.ok }]);
    if (Platform.OS !== 'android') return help();
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
        extra: { 'android.intent.extra.alarm.HOUR': wake.hour, 'android.intent.extra.alarm.MINUTES': wake.minute, 'android.intent.extra.alarm.MESSAGE': t.today.alarmLabel },
      });
    } catch (err) {
      console.warn('Could not open the clock', err);
      help();
    }
  };

  const d = new Date(today + 'T12:00:00');
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.bg }} bounces={false} contentContainerStyle={{ paddingBottom: space.l }}>
      <View style={{ height: skyH }}>
        <LinearGradient colors={[...colors]} locations={[...sky.stops]} style={StyleSheet.absoluteFill} />
        {stars && STARS.map(([x, y, o], i) => <View key={i} style={[st.star, { left: x * width, top: y * skyH, opacity: o }]} />)}
        <Svg width={width} height={skyH} style={st.abs}>
          <Path d={`M${a.x} ${a.y} Q${b.x} ${b.y} ${e.x} ${e.y}`} stroke={sky.arc} strokeOpacity={0.45} strokeWidth={2} strokeDasharray="1 9" strokeLinecap="round" fill="none" />
          <Circle cx={sx} cy={sy} r={size.sun * 2} fill={sky.sun} fillOpacity={0.22} />
          <Circle cx={sx} cy={sy} r={size.sun} fill={sky.sunCore} />
        </Svg>
        <Svg width={width} height={size.skyline} viewBox="0 0 390 60" preserveAspectRatio="none" style={[st.abs, { top: skyH - 50 }]}>
          <Path d={SKYLINE} fill={c.bg} />
        </Svg>
        <View style={{ paddingTop: top + space.m, paddingHorizontal: space.l }}>
          <Text style={st.date}>{`${t.days[d.getDay()]}, ${t.monthsShort[d.getMonth()]} ${d.getDate()}`.toUpperCase()}</Text>
          <Text style={st.hero} numberOfLines={1} adjustsFontSizeToFit>{l1}</Text>
          <Text style={[st.hero, { color: sky.sun }]} numberOfLines={1} adjustsFontSizeToFit>{l2}</Text>
          {sub !== '' && <Text style={st.sub}>{sub}</Text>}
        </View>
      </View>

      <View style={{ paddingHorizontal: space.m, gap: space.m }}>
        <View style={[st.now, { backgroundColor: c.surface, borderColor: c.line }]}>
          <View style={st.nowRow}>
            <Text style={[st.nowLeft, { color: c.text }]}>{nowLeft}</Text>
            <Text style={[st.nowRight, { color: c.accentText }]}>{nowRight}</Text>
          </View>
          {bar >= 0 && (
            <View style={[st.track, { backgroundColor: c.track }]}><View style={[st.fillBar, { backgroundColor: c.accent, width: `${Math.round(bar * 100)}%` }]} /></View>
          )}
        </View>

        <View style={{ gap: space.s }}>
          <Caps>{t.today.week}</Caps>
          <View style={st.strip}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const key = addDays(today, i);
              const wd = weekday(key);
              const day = dayOn(plan, key);
              return <DayCell key={key} day={day} top={i === 0 ? t.today.today : t.daysShort[wd]} bottom={day?.kind === 'work' ? tiny(day.start) : day?.kind === 'rest' ? t.today.rest : '?'} num={Number(key.slice(8))} isToday={i === 0} height={size.dayCell} onPress={() => onCycle(key)} label={`${t.days[wd]} ${Number(key.slice(8))}`} />;
            })}
          </View>
          <Text style={[st.hint, { color: c.muted }]}>{t.tapHint}</Text>
        </View>

        {wake && (
          <Pressable onPress={setAlarm} accessibilityRole="button" accessibilityLabel={`${alarmName} ${wake.text}`} style={({ pressed }) => [st.btn, { backgroundColor: c.accent, opacity: pressed ? 0.85 : 1 }]}>
            <Icon name="alarm" color={c.onAccent} s={size.iconBig} />
            <Text style={[st.btnText, { color: c.onAccent }]} numberOfLines={1} adjustsFontSizeToFit>{alarmName}</Text>
            <Text style={[st.btnTime, { color: c.onAccent }]}>{wake.text}</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  abs: { position: 'absolute', left: 0, top: 0 },
  star: { position: 'absolute', width: 2, height: 2, borderRadius: 1, backgroundColor: sky.star },
  date: { fontFamily: font.textHeavy, fontSize: type.caps.size, letterSpacing: type.caps.tracking, color: sky.textSoft, marginBottom: space.s },
  hero: { fontFamily: font.display, fontSize: type.hero.size, lineHeight: type.hero.line, letterSpacing: type.hero.tracking, color: sky.text },
  sub: { fontFamily: font.text, fontSize: type.body.size, lineHeight: type.body.line, color: sky.textSoft, marginTop: space.s },
  now: { borderRadius: radius.panel, borderWidth: 1, paddingHorizontal: space.m, paddingVertical: space.m, gap: space.s, marginTop: space.xs },
  nowRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space.s },
  nowLeft: { fontFamily: font.number, fontSize: type.big.size - 2, letterSpacing: type.big.tracking },
  nowRight: { fontFamily: font.textHeavy, fontSize: type.body.size },
  track: { height: size.bar, borderRadius: size.bar / 2, overflow: 'hidden' },
  fillBar: { height: size.bar, borderRadius: size.bar / 2 },
  strip: { flexDirection: 'row', gap: space.xs },
  hint: { fontFamily: font.text, fontSize: type.small.size },
  btn: { height: size.button, borderRadius: radius.button, flexDirection: 'row', alignItems: 'center', gap: space.s, paddingHorizontal: space.l },
  btnText: { flex: 1, fontFamily: font.textHeavy, fontSize: type.body.size + 1 },
  btnTime: { fontFamily: font.display, fontSize: type.big.size },
});
