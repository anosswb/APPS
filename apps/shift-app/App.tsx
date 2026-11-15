/**
 * Shift app. World "Daybreak" (docs/world.md): the sky for Today, the ring on My day. One job per tab.
 * The rules live in src/core (tested). Everything is saved on the phone only.
 */
import { BricolageGrotesque_600SemiBold } from '@expo-google-fonts/bricolage-grotesque/600SemiBold';
import { InstrumentSans_500Medium } from '@expo-google-fonts/instrument-sans/500Medium';
import { InstrumentSans_600SemiBold } from '@expo-google-fonts/instrument-sans/600SemiBold';
import { InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans/700Bold';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { todayKey } from './src/core/dates';
import { Day, markDay } from './src/core/days';
import { t } from './src/i18n/en';
import { Calendar } from './src/screens/Calendar';
import { MyDay } from './src/screens/MyDay';
import { Pay } from './src/screens/Pay';
import { Today } from './src/screens/Today';
import { Welcome } from './src/screens/Welcome';
import { load, save, Saved } from './src/store';
import { font, size, space, themes, type } from './src/theme/tokens';
import { ThemeProvider } from './src/theme/useTheme';
import { Icon, IconName } from './src/ui/Icon';

type Tab = 'today' | 'calendar' | 'myDay' | 'pay';
const TABS: [Tab, IconName][] = [['today', 'home'], ['calendar', 'calendar'], ['myDay', 'day'], ['pay', 'pay']];

function Shell() {
  const insets = useSafeAreaInsets();
  const phone = useColorScheme();
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

  const c = themes[(data?.look ?? 'auto') === 'auto' ? (phone === 'light' ? 'light' : 'dark') : data!.look === 'light' ? 'light' : 'dark'];
  if (!data) return <View style={[st.fill, { backgroundColor: c.bg }]} />;
  const today = todayKey(now);
  const change = (next: Saved) => { setData(next); save(next); };
  // One tap moves a day along: not known yet → work → rest → not known yet.
  const cycle = (key: string) => {
    const cur = data.book[key];
    const next: Day | null = !cur ? { kind: 'work', start: data.shift.start, end: data.shift.end } : cur.kind === 'work' ? { kind: 'rest' } : null;
    change({ ...data, book: markDay(data.book, key, next) });
  };

  if (!data.welcomed) {
    return (
      <ThemeProvider theme={c}>
        <StatusBar style="light" />
        <Welcome top={insets.top} bottom={insets.bottom} onStart={() => change({ ...data, welcomed: true })} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={c}>
      <View style={[st.fill, { backgroundColor: c.bg }]}>
        <StatusBar style={tab === 'today' || c.dark ? 'light' : 'dark'} />
        <View style={st.fill}>
          {tab === 'today' && <Today data={data} today={today} now={now} top={insets.top} onCycle={cycle} />}
          {tab === 'calendar' && <Calendar data={data} today={today} top={insets.top} onCycle={cycle} />}
          {tab === 'myDay' && <MyDay data={data} today={today} now={now} top={insets.top} onChange={change} />}
          {tab === 'pay' && <Pay data={data} today={today} now={now} top={insets.top} onChange={change} />}
        </View>
        <View style={[st.nav, { backgroundColor: c.bg, borderTopColor: c.line, paddingBottom: Math.max(insets.bottom, space.s) }]}>
          {TABS.map(([id, icon]) => (
            <Pressable key={id} onPress={() => setTab(id)} accessibilityRole="tab" accessibilityState={{ selected: tab === id }} accessibilityLabel={t.tabs[id]} style={st.tab}>
              <Icon name={icon} color={tab === id ? c.text : c.muted} />
              <Text style={[st.tabText, { color: tab === id ? c.text : c.muted }]}>{t.tabs[id]}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ThemeProvider>
  );
}

export default function App() {
  const [ready] = useFonts({ BricolageGrotesque_600SemiBold, InstrumentSans_500Medium, InstrumentSans_600SemiBold, InstrumentSans_700Bold });
  return <SafeAreaProvider>{ready ? <Shell /> : <View style={[st.fill, { backgroundColor: themes.dark.bg }]} />}</SafeAreaProvider>;
}

const st = StyleSheet.create({
  fill: { flex: 1 },
  nav: { flexDirection: 'row', borderTopWidth: 1 },
  tab: { flex: 1, height: size.nav, alignItems: 'center', justifyContent: 'center', gap: space.xs },
  tabText: { fontFamily: font.textBold, fontSize: type.caps.size },
});
