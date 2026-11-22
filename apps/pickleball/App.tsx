import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useFonts, BarlowCondensed_600SemiBold, BarlowCondensed_800ExtraBold, BarlowCondensed_800ExtraBold_Italic } from '@expo-google-fonts/barlow-condensed';
import { Archivo_500Medium, Archivo_700Bold } from '@expo-google-fonts/archivo';
import { t } from './src/i18n/en';
import { finishGame, scoreRally, setFirstServe, undoRally } from './src/logic/session';
import { Team } from './src/logic/scoring';
import { useSession } from './src/state/useSession';
import { CourtsScreen } from './src/screens/CourtsScreen';
import { PlayersScreen } from './src/screens/PlayersScreen';
import { ScorerScreen } from './src/screens/ScorerScreen';
import { BoardScreen } from './src/screens/BoardScreen';
import { LicencesScreen } from './src/screens/LicencesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Icon, IconName } from './src/ui/Icon';
import { color, font, space } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch((e) => console.warn(`[splash] ${String(e)}`));

type Tab = 'courts' | 'players' | 'settings';

export default function App() {
  const [fontsLoaded] = useFonts({ BarlowCondensed_600SemiBold, BarlowCondensed_800ExtraBold, BarlowCondensed_800ExtraBold_Italic, Archivo_500Medium, Archivo_700Bold });
  const { ready, session, act, undo, canUndo, prefs, setPrefs } = useSession();
  const [tab, setTab] = useState<Tab>('courts');
  const [scoring, setScoring] = useState<number | null>(null);
  const [board, setBoard] = useState(false);
  const [licences, setLicences] = useState(false);

  useEffect(() => {
    if (fontsLoaded && ready) SplashScreen.hideAsync().catch((e) => console.warn(`[splash] ${String(e)}`));
  }, [fontsLoaded, ready]);

  useEffect(() => {
    const tag = 'court';
    if (prefs.keepAwake) activateKeepAwakeAsync(tag).catch((e) => console.warn(`[awake] ${String(e)}`));
    else deactivateKeepAwake(tag).catch((e) => console.warn(`[awake] ${String(e)}`));
  }, [prefs.keepAwake]);

  const buzz = useCallback(
    (kind: 'tap' | 'done') => {
      if (!prefs.haptics) return;
      const run = kind === 'done' ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      run.catch((e) => console.warn(`[haptics] ${String(e)}`));
    },
    [prefs.haptics],
  );

  if (!fontsLoaded || !ready) return null;

  if (licences) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <LicencesScreen onClose={() => setLicences(false)} />
      </SafeAreaProvider>
    );
  }

  if (board) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <BoardScreen session={session} onClose={() => setBoard(false)} />
      </SafeAreaProvider>
    );
  }

  if (scoring !== null && session.courts[scoring]) {
    const c = scoring;
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <ScorerScreen
          session={session}
          court={c}
          onRally={(team: Team) => {
            act((s) => scoreRally(s, c, team));
            buzz('tap');
          }}
          onUndo={() => act((s) => undoRally(s, c))}
          onFirstServe={(team) => act((s) => setFirstServe(s, c, team))}
          onFinish={(winner) => {
            act((s, now) => finishGame(s, c, winner, now));
            buzz('done');
            setScoring(null);
          }}
          onClose={() => setScoring(null)}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={s.root} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1 }}>
          {tab === 'courts' ? <CourtsScreen session={session} act={act} undo={undo} canUndo={canUndo} openScorer={setScoring} openBoard={() => setBoard(true)} buzz={buzz} /> : null}
          {tab === 'players' ? <PlayersScreen session={session} act={act} /> : null}
          {tab === 'settings' ? <SettingsScreen session={session} act={act} prefs={prefs} setPrefs={setPrefs} openLicences={() => setLicences(true)} /> : null}
        </View>
        <SafeAreaView edges={['bottom']} style={s.tabs}>
          {(
            [
              ['courts', 'courts', t.tabs.courts],
              ['players', 'people', t.tabs.players],
              ['settings', 'gear', t.tabs.settings],
            ] as [Tab, IconName, string][]
          ).map(([key, icon, label]) => {
            const on = tab === key;
            return (
              <Pressable key={key} style={s.tab} onPress={() => setTab(key)} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={label}>
                <View style={[s.tabMark, on && s.tabMarkOn]} />
                <Icon name={icon} tint={on ? color.ball : color.barMute} />
                <Text style={[s.tabText, on && s.tabTextOn]}>{label}</Text>
              </Pressable>
            );
          })}
        </SafeAreaView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.court },
  tabs: { flexDirection: 'row', backgroundColor: color.bar },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 62, paddingBottom: space.xs },
  tabMark: { height: 3, width: 36, marginBottom: 6, backgroundColor: 'transparent' },
  tabMarkOn: { backgroundColor: color.ball },
  tabText: { fontFamily: font.body, fontSize: 14, color: color.barMute, marginTop: 2 },
  tabTextOn: { fontFamily: font.bodyBold, color: color.ball },
});
