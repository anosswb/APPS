/** Today: when do I rest, my week, my alarm. Nothing else lives here (Anass: "put each thing in a place"). */
import * as IntentLauncher from 'expo-intent-launcher';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { addDays, weekday } from '../core/dates';
import { clock, dayLine } from '../core/dayline';
import { Day, dayOn, nextRest, nextWorkDay, Plan, workedInRow } from '../core/days';
import { t } from '../i18n/en';
import { Saved } from '../store';
import { arc, color, font, radius, size, sky, skyStops, space, star, type } from '../theme/tokens';
import { DayCell } from '../ui/DayCell';
import { Icon } from '../ui/Icon';

const STARS = [[0.1, 0.12, 0.8], [0.33, 0.08, 0.5], [0.78, 0.15, 0.9], [0.9, 0.33, 0.5], [0.64, 0.07, 0.6], [0.86, 0.58, 0.3], [0.94, 0.2, 0.7], [0.74, 0.44, 0.4], [0.56, 0.62, 0.3]];
const SKYLINE = 'M0 34h44V20h10v14h30v-8h26v8h40V6h7v28h10V12h7v22h36l14-26 14 26h34v-10h30v10h22V16h9v18h57v26H0z';

export function Today({ data, today, now, top, onCycle }: { data: Saved; today: string; now: Date; top: number; onCycle: (key: string) => void }) {
  const { width, height } = useWindowDimensions();
  const plan: Plan = { book: data.book };
  const skyH = Math.round(height * 0.54);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const hour = now.getHours();
  const colors = hour >= 4 && hour < 8 ? sky.dawn : hour >= 8 && hour < 17 ? sky.day : hour >= 17 && hour < 20 ? sky.dusk : sky.night;
  const isNight = colors === sky.night || colors === sky.dawn;

  const todayDay = dayOn(plan, today);
  const rest = nextRest(plan, today);
  const row = workedInRow(plan, today);
  const work = nextWorkDay(plan, today);

  // The sun crosses the sky between waking and the end of the evening.
  const line = todayDay?.kind === 'work' ? dayLine(todayDay, data.habits) : null;
  const from = line ? line.wake : 6 * 60;
  const to = line ? line.home + 120 : 21 * 60;
  const p = Math.min(0.97, Math.max(0.03, (minutes - from) / (to - from)));
  const a = { x: 20, y: skyH - 18 }, b = { x: width / 2, y: skyH * 0.36 }, c = { x: width - 20, y: skyH - 18 };
  const sx = (1 - p) ** 2 * a.x + 2 * p * (1 - p) * b.x + p * p * c.x;
  const sy = (1 - p) ** 2 * a.y + 2 * p * (1 - p) * b.y + p * p * c.y;

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

  // The alarm is for today while it is still before wake-up time, otherwise for the next work day.
  const alarmToday = line && minutes < ((line.wake % 1440) + 1440) % 1440 && line.wake >= 0;
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
    } catch (e) {
      console.warn('Could not open the clock', e);
      help();
    }
  };

  const d = new Date(today + 'T12:00:00');
  return (
    <View style={st.fill}>
      <LinearGradient colors={[...colors]} locations={[...skyStops]} style={[st.sky, { height: skyH }]} />
      {isNight && STARS.map(([x, y, o], i) => <View key={i} style={[st.star, { left: x * width, top: y * skyH, opacity: o }]} />)}
      <Svg width={width} height={skyH} style={st.abs}>
        <Path d={`M${a.x} ${a.y} Q${b.x} ${b.y} ${c.x} ${c.y}`} stroke={arc} strokeOpacity={0.5} strokeWidth={2.5} strokeDasharray="1 9" strokeLinecap="round" fill="none" />
        <Circle cx={sx} cy={sy} r={size.sun * 2} fill={color.restTop} fillOpacity={0.22} />
        <Circle cx={sx} cy={sy} r={size.sun} fill={color.sunCore} />
      </Svg>
      <Svg width={width} height={size.skyline} viewBox="0 0 390 60" preserveAspectRatio="none" style={[st.abs, { top: skyH - 50 }]}>
        <Path d={SKYLINE} fill={color.bg} />
      </Svg>

      <View style={[st.head, { paddingTop: top + space.m }]}>
        <Text style={st.date}>{`${t.days[d.getDay()]}, ${t.monthsShort[d.getMonth()]} ${d.getDate()}`}</Text>
        <Text style={st.hero} numberOfLines={1} adjustsFontSizeToFit>{l1}</Text>
        <Text style={[st.hero, st.sun]} numberOfLines={1} adjustsFontSizeToFit>{l2}</Text>
        {sub !== '' && <Text style={st.sub}>{sub}</Text>}
      </View>

      <View style={[st.bottom, { top: skyH + space.m }]}>
        <View style={st.strip}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const key = addDays(today, i);
            const wd = weekday(key);
            return <DayCell key={key} day={dayOn(plan, key)} top={i === 0 ? t.today.today : t.daysShort[wd]} num={Number(key.slice(8))} isToday={i === 0} height={size.dayCell} onPress={() => onCycle(key)} label={`${t.days[wd]} ${Number(key.slice(8))}`} />;
          })}
        </View>
        <Text style={st.hint}>{t.today.tapHint}</Text>
        {wake && (
          <Pressable onPress={setAlarm} accessibilityRole="button" accessibilityLabel={`${alarmName} ${wake.text}`} style={({ pressed }) => [st.btn, pressed && st.pressed]}>
            <Icon name="alarm" color={color.onSun} s={size.iconBig} />
            <Text style={st.btnText} numberOfLines={1} adjustsFontSizeToFit>{alarmName}</Text>
            <Text style={st.btnTime}>{wake.text}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: color.bg },
  abs: { position: 'absolute', left: 0, top: 0 },
  sky: { position: 'absolute', left: 0, right: 0, top: 0 },
  star: { position: 'absolute', width: 2, height: 2, borderRadius: 1, backgroundColor: star },
  head: { paddingHorizontal: space.l },
  date: { fontFamily: font.textBold, fontSize: type.label.size, color: color.textSoft, marginBottom: space.s },
  hero: { fontFamily: font.display, fontSize: type.hero.size, lineHeight: type.hero.line, letterSpacing: type.hero.tracking, color: color.text },
  sun: { color: color.sun },
  sub: { fontFamily: font.text, fontSize: type.body.size, lineHeight: type.body.line, color: color.textSoft, marginTop: space.m },
  bottom: { position: 'absolute', left: space.m, right: space.m },
  strip: { flexDirection: 'row', gap: space.xs },
  hint: { fontFamily: font.text, fontSize: type.small.size + 1, color: color.muted, marginTop: space.s, marginStart: space.s },
  btn: { marginTop: space.m, height: size.button, borderRadius: radius.button, backgroundColor: color.sun, flexDirection: 'row', alignItems: 'center', gap: space.s, paddingHorizontal: space.l - 4 },
  pressed: { opacity: 0.85 },
  btnText: { flex: 1, fontFamily: font.textHeavy, fontSize: type.body.size + 1, color: color.onSun },
  btnTime: { fontFamily: font.display, fontSize: type.number.size, color: color.onSun },
});
