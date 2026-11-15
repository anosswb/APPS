/** Today: when do I rest, what is happening now, my week, my alarm. */
import * as IntentLauncher from 'expo-intent-launcher';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { addDays, weekday } from '../core/dates';
import { clock, dayLine } from '../core/dayline';
import { Day, dayOn, nextRest, nextWorkDay, shiftMinutes, workedInRow } from '../core/days';
import { t } from '../i18n/en';
import { planOf, Saved } from '../store';
import { font, onSky, radius, size, skyStops, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Caps, Glass, Pill } from '../ui/Bits';
import { DayCell } from '../ui/DayCell';

export function Today({ data, today, now, top, onCycle }: { data: Saved; today: string; now: Date; top: number; onCycle: (key: string) => void }) {
  const c = useTheme();
  const { height } = useWindowDimensions();
  const plan = planOf(data);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const hour = now.getHours();
  const colors = hour >= 4 && hour < 8 ? c.sky.dawn : hour >= 8 && hour < 17 ? c.sky.day : hour >= 17 && hour < 20 ? c.sky.dusk : c.sky.night;

  const todayDay = dayOn(plan, today);
  const rest = nextRest(plan, today);
  const row = workedInRow(plan, today);
  const work = nextWorkDay(plan, today);
  const line = todayDay?.kind === 'work' ? dayLine(todayDay, data.habits) : null;
  const dateOf = (key: string) => { const d = new Date(key + 'T12:00:00'); return `${t.daysShort[d.getDay()]}, ${t.monthsShort[d.getMonth()]} ${d.getDate()}`; };

  let big: string, when = '', sub = '';
  if (todayDay?.kind === 'rest') {
    big = t.today.restToday;
    if (work) sub = t.today.backOn(work.inDays === 1 ? 'tomorrow' : t.days[weekday(work.key)]);
  } else if (rest) {
    big = t.today.inDays(rest.inDays);
    when = dateOf(rest.key);
    sub = [row > 0 ? t.today.inARow(row) : '', rest.sure ? '' : t.today.maybeSooner].filter(Boolean).join(' · ');
  } else {
    big = t.today.noRest;
    sub = row > 0 ? t.today.inARow(row) : t.today.noRestSub;
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
  const alarmName = t.today.alarm(alarmToday ? "today's" : work ? `${t.days[weekday(work.key)]}'s` : '');

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

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <LinearGradient colors={[colors[0], colors[1], colors[2], colors[3]]} locations={[...skyStops]} style={[st.sky, { height: Math.round(height * size.skyPart) }]} />
      <ScrollView bounces={false} contentContainerStyle={{ paddingTop: top + space.l, paddingHorizontal: space.m, paddingBottom: space.l, gap: space.m }}>
        <View style={st.head}>
          <View style={{ flex: 1 }}>
            <Text style={st.title}>{t.today.title}</Text>
            <Text style={st.date}>{dateOf(today)}</Text>
          </View>
        </View>

        <Glass style={{ gap: space.m, backgroundColor: c.cardOnSky }}>
          <Caps>{t.today.nextRest}</Caps>
          <View>
            <Text style={[st.big, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>{big}</Text>
            {when !== '' && <Text style={[st.when, { color: c.green }]}>{when}</Text>}
            {sub !== '' && <Text style={[st.sub, { color: c.textSoft }]}>{sub}</Text>}
          </View>
          <View style={[st.now, { borderTopColor: c.line }]}>
            <View style={st.nowRow}>
              <Text style={[st.nowLeft, { color: c.text }]}>{nowLeft}</Text>
              <Text style={[st.nowRight, { color: c.textSoft }]}>{nowRight}</Text>
            </View>
            {bar >= 0 && <View style={[st.track, { backgroundColor: c.track }]}><View style={[st.fill, { backgroundColor: c.blue, width: `${Math.round(bar * 100)}%` }]} /></View>}
          </View>
          {wake && <Pill icon="alarm" label={alarmName} right={wake.text} onPress={setAlarm} />}
        </Glass>

        <Glass style={{ gap: space.s, paddingHorizontal: space.s }}>
          <View style={st.weekHead}>
            <Text style={[st.weekTitle, { color: c.text }]}>{t.today.thisWeek}</Text>
            <View style={st.legend}>
              <View style={[st.dot, { backgroundColor: c.blue }]} /><Text style={[st.legendText, { color: c.muted }]}>{t.legend.work}</Text>
              <View style={[st.dot, st.restDot, { backgroundColor: c.green }]} /><Text style={[st.legendText, { color: c.muted }]}>{t.legend.rest}</Text>
            </View>
          </View>
          <View style={st.strip}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const key = addDays(today, i);
              const wd = weekday(key);
              return <DayCell key={key} day={dayOn(plan, key)} top={t.daysLetter[wd]} num={Number(key.slice(8))} isToday={i === 0} height={size.dayPill} onPress={() => onCycle(key)} label={`${t.days[wd]} ${Number(key.slice(8))}`} />;
            })}
          </View>
          <Text style={[st.hint, { color: c.textSoft }]}>{t.tapHint}</Text>
        </Glass>
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  sky: { position: 'absolute', left: 0, right: 0, top: 0 },
  head: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.s, marginBottom: space.s },
  title: { fontFamily: font.display, fontSize: type.title.size, letterSpacing: type.title.tracking, color: onSky.text },
  date: { fontFamily: font.text, fontSize: type.big.size, color: onSky.soft },
  big: { fontFamily: font.display, fontSize: type.hero.size, lineHeight: type.hero.line, letterSpacing: type.hero.tracking },
  when: { fontFamily: font.textBold, fontSize: type.body.size, marginTop: 2 },
  sub: { fontFamily: font.text, fontSize: type.label.size, lineHeight: type.body.line, marginTop: space.xs },
  now: { borderTopWidth: 1, paddingTop: space.m, gap: space.s },
  nowRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space.s },
  nowLeft: { fontFamily: font.textBold, fontSize: type.body.size + 1 },
  nowRight: { fontFamily: font.text, fontSize: type.label.size + 1 },
  track: { height: size.bar, borderRadius: size.bar / 2, overflow: 'hidden' },
  fill: { height: size.bar, borderRadius: size.bar / 2 },
  weekHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.s },
  weekTitle: { fontFamily: font.textBold, fontSize: type.label.size + 1 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  legendText: { fontFamily: font.text, fontSize: type.small.size, marginEnd: space.xs },
  dot: { width: size.dot, height: size.dot, borderRadius: size.dot / 2 },
  restDot: { width: size.dot * 2.6 },
  strip: { flexDirection: 'row', gap: 2 },
  hint: { fontFamily: font.text, fontSize: type.small.size, textAlign: 'center' },
});
