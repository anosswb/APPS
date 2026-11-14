/**
 * Shift app. World "Daybreak" (docs/world.md): the sky for Today, the ring on My day. One job per tab.
 * The rules live in src/core (tested). Everything is saved on the phone only.
 */
import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque/700Bold';
import { BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque/800ExtraBold';
import { InstrumentSans_500Medium } from '@expo-google-fonts/instrument-sans/500Medium';
import { InstrumentSans_600SemiBold } from '@expo-google-fonts/instrument-sans/600SemiBold';
import { InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans/700Bold';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { todayKey } from './src/core/dates';
import { Day, markDay } from './src/core/days';
import { t } from './src/i18n/en';
import { Calendar } from './src/screens/Calendar';
import { MyDay } from './src/screens/MyDay';
import { Today } from './src/screens/Today';
import { load, save, Saved } from './src/store';
import { color, font, size, space, type } from './src/theme/tokens';
import { Icon, IconName } from './src/ui/Icon';

type Tab = 'today' | 'calendar' | 'myDay' | 'pay';
const TABS: [Tab, IconName][] = [['today', 'home'], ['calendar', 'calendar'], ['myDay', 'day'], ['pay', 'pay']];

function Shell() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<Saved | null>(null);
  const [tab, setTab] = useState<Tab>('today');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => { load().then(setData); }, []);
  // The sky and "today" follow the clock: refresh every minute and when the app comes back to the front.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active') setNow(new Date()); });
    return () => { clearInterval(id); sub.remove(); };
  }, []);

  if (!data) return <View style={st.fill} />;
  const today = todayKey(now);
  const change = (next: Saved) => { setData(next); save(next); };
  // One tap moves a day along: not known yet → work → rest → not known yet.
  const cycle = (key: string) => {
    const cur = data.book[key];
    const next: Day | null = !cur ? { kind: 'work', start: data.shift.start, end: data.shift.end } : cur.kind === 'work' ? { kind: 'rest' } : null;
    change({ ...data, book: markDay(data.book, key, next) });
  };

  return (
    <View style={st.fill}>
      <StatusBar style="light" />
      <View style={st.fill}>
        {tab === 'today' && <Today data={data} today={today} now={now} top={insets.top} onCycle={cycle} />}
        {tab === 'calendar' && <Calendar data={data} today={today} top={insets.top} onCycle={cycle} />}
        {tab === 'myDay' && <MyDay data={data} today={today} now={now} top={insets.top} onChange={change} />}
        {tab === 'pay' && (
          <View style={[st.pay, { paddingTop: insets.top + space.m }]}>
            <Text style={st.title}>{t.pay.title}</Text>
            <Text style={st.soon}>{t.pay.soon}</Text>
            <Text style={st.body}>{t.pay.what}</Text>
          </View>
        )}
      </View>
      <View style={[st.nav, { paddingBottom: Math.max(insets.bottom, space.s) }]}>
        {TABS.map(([id, icon]) => (
          <Pressable key={id} onPress={() => setTab(id)} accessibilityRole="tab" accessibilityState={{ selected: tab === id }} accessibilityLabel={t.tabs[id]} style={st.tab}>
            <Icon name={icon} color={tab === id ? color.sun : color.muted} />
            <Text style={[st.tabText, tab === id && st.on]}>{t.tabs[id]}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function App() {
  const [ready] = useFonts({ BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold, InstrumentSans_500Medium, InstrumentSans_600SemiBold, InstrumentSans_700Bold });
  return <SafeAreaProvider>{ready ? <Shell /> : <View style={st.fill} />}</SafeAreaProvider>;
}

const st = StyleSheet.create({
  fill: { flex: 1, backgroundColor: color.bg },
  nav: { flexDirection: 'row', backgroundColor: color.bg, borderTopWidth: 1, borderTopColor: color.line },
  tab: { flex: 1, height: size.nav, alignItems: 'center', justifyContent: 'center', gap: space.xs },
  tabText: { fontFamily: font.textBold, fontSize: type.small.size - 1, color: color.muted },
  on: { color: color.sun },
  pay: { flex: 1, paddingHorizontal: space.l, gap: space.m },
  title: { fontFamily: font.display, fontSize: type.title.size, letterSpacing: type.title.tracking, color: color.text },
  soon: { fontFamily: font.number, fontSize: type.number.size, color: color.sun },
  body: { fontFamily: font.text, fontSize: type.body.size, lineHeight: type.body.line, color: color.textSoft },
});
