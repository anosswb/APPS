/**
 * Shift app. World "Daybreak" (docs/world.md): the sky for Today, the ring on My day. One job per tab.
 * The rules live in src/core (tested). Everything is saved on the phone only.
 */
import { BricolageGrotesque_600SemiBold } from '@expo-google-fonts/bricolage-grotesque/600SemiBold';
import { InstrumentSans_500Medium } from '@expo-google-fonts/instrument-sans/500Medium';
import { InstrumentSans_600SemiBold } from '@expo-google-fonts/instrument-sans/600SemiBold';
import { InstrumentSans_700Bold } from '@expo-google-fonts/instrument-sans/700Bold';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
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
import { Quiz, Result } from './src/screens/Onboarding';
import { Paywall } from './src/screens/Paywall';
import { Welcome } from './src/screens/Welcome';
import { SELLS_PLUS } from './src/money/plus';
import { schedule } from './src/notify';
import { load, save, Saved } from './src/store';
import { updateWidget } from './src/widget/sync';
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
  const [stage, setStage] = useState<'welcome' | 'quiz' | 'result' | 'paywall'>('welcome');
  const [showPlus, setShowPlus] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => { load().then(setData); }, []);
  // The sky and "today" follow the clock: refresh every minute and when the app comes back to the front.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active') setNow(new Date()); });
    return () => { clearInterval(id); sub.remove(); };
  }, []);

  // Notes and the home-screen widget follow the data, a moment after the last change.
  useEffect(() => {
    if (!data) return;
    const id = setTimeout(() => { schedule(data); updateWidget(data); }, 800);
    return () => clearTimeout(id);
  }, [data]);

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

  // First open: welcome, four questions, "here is your setup", then Plus on iPhone (with "Continue free"). Android goes straight in.
  if (!data.welcomed || showPlus) {
    const done = (next: Saved) => { setStage('welcome'); change({ ...next, welcomed: true }); };
    let page: React.ReactNode;
    if (showPlus) page = <Paywall top={insets.top} bottom={insets.bottom} onBuy={() => { change({ ...data, plus: true }); setShowPlus(false); }} onLater={() => setShowPlus(false)} laterLabel={t.plus.close} />;
    else if (stage === 'welcome') page = <Welcome top={insets.top} bottom={insets.bottom} onStart={() => setStage('quiz')} />;
    else if (stage === 'quiz') page = <Quiz data={data} top={insets.top} bottom={insets.bottom} onDone={(next) => { change(next); setStage('result'); }} />;
    else if (stage === 'result') page = <Result data={data} top={insets.top} bottom={insets.bottom} onNext={() => (SELLS_PLUS ? setStage('paywall') : done(data))} />;
    else page = <Paywall top={insets.top} bottom={insets.bottom} onBuy={() => done({ ...data, plus: true })} onLater={() => done(data)} />;
    return (
      <ThemeProvider theme={c}>
        <View style={[st.fill, { backgroundColor: c.bg }]}>
          <StatusBar style="light" />
          {page}
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={c}>
      <View style={[st.fill, { backgroundColor: c.bg }]}>
        <LinearGradient colors={[c.backdrop[0], c.backdrop[1], c.backdrop[2]]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
        <StatusBar style={tab === 'today' || c.dark ? 'light' : 'dark'} />
        <View style={st.fill}>
          {tab === 'today' && <Today data={data} today={today} now={now} top={insets.top} onCycle={cycle} onChange={change} />}
          {tab === 'calendar' && <Calendar data={data} today={today} top={insets.top} onCycle={cycle} />}
          {tab === 'myDay' && <MyDay data={data} today={today} now={now} top={insets.top} onChange={change} />}
          {tab === 'pay' && <Pay data={data} today={today} now={now} top={insets.top} onChange={change} onPlus={() => setShowPlus(true)} />}
        </View>
        <View style={[st.navWrap, { bottom: Math.max(insets.bottom, space.s) + 4 }]} pointerEvents="box-none">
          <View style={[st.nav, { backgroundColor: c.dark ? 'rgba(22,25,31,0.94)' : 'rgba(255,255,255,0.94)', borderColor: c.glass.edge }]}>
            <LinearGradient pointerEvents="none" colors={[c.glass.hi, 'rgba(255,255,255,0)']} locations={[0, 0.7]} style={[StyleSheet.absoluteFill, { borderRadius: size.nav / 2 }]} />
            {TABS.map(([id, icon]) => (
              <Pressable key={id} onPress={() => setTab(id)} accessibilityRole="tab" accessibilityState={{ selected: tab === id }} accessibilityLabel={t.tabs[id]}
                style={[st.tab, tab === id && { backgroundColor: c.dark ? 'rgba(255,255,255,0.12)' : 'rgba(14,16,19,0.07)' }]}>
                <Icon name={icon} color={tab === id ? c.text : c.muted} />
                <Text style={[st.tabText, { color: tab === id ? c.text : c.muted }]}>{t.tabs[id]}</Text>
              </Pressable>
            ))}
          </View>
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
  navWrap: { position: 'absolute', left: space.m, right: space.m, alignItems: 'center' },
  nav: { width: '100%', maxWidth: size.maxNav, flexDirection: 'row', height: size.nav + 8, borderRadius: (size.nav + 8) / 2, borderWidth: 1, padding: 4, overflow: 'hidden' },
  tab: { flex: 1, borderRadius: size.nav / 2, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabText: { fontFamily: font.textBold, fontSize: type.caps.size },
});
