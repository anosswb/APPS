import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useFonts, BarlowCondensed_600SemiBold, BarlowCondensed_800ExtraBold } from '@expo-google-fonts/barlow-condensed';
import { Archivo_500Medium, Archivo_700Bold } from '@expo-google-fonts/archivo';
import { t } from './src/i18n/en';
import { finishGame, scoreRally, setFirstServe, undoRally } from './src/logic/session';
import { Team } from './src/logic/scoring';
import { useSession } from './src/state/useSession';
import { CourtsScreen } from './src/screens/CourtsScreen';
import { PlayersScreen } from './src/screens/PlayersScreen';
import { ScorerScreen } from './src/screens/ScorerScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Icon, IconName } from './src/ui/Icon';
import { color, font, space } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch((e) => console.warn(`[splash] ${String(e)}`));

type Tab = 'courts' | 'players' | 'settings';

export default function App() {
  const [fontsLoaded] = useFonts({ BarlowCondensed_600SemiBold, BarlowCondensed_800ExtraBold, Archivo_500Medium, Archivo_700Bold });
  const { ready, session, act, undo, canUndo, prefs, setPrefs } = useSession();
  const [tab, setTab] = useState<Tab>('courts');
  const [scoring, setScoring] = useState<number | null>(null);

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
      <StatusBar style="dark" />
      <SafeAreaView style={s.root} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1 }}>
          {tab === 'courts' ? <CourtsScreen session={session} act={act} undo={undo} canUndo={canUndo} openScorer={setScoring} buzz={buzz} /> : null}
          {tab === 'players' ? <PlayersScreen session={session} act={act} /> : null}
          {tab === 'settings' ? <SettingsScreen session={session} act={act} prefs={prefs} setPrefs={setPrefs} /> : null}
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
                <Icon name={icon} tint={on ? color.ink : color.mute} />
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
  root: { flex: 1, backgroundColor: color.ground },
  tabs: { flexDirection: 'row', backgroundColor: color.card, borderTopWidth: 1, borderColor: color.hair },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 62, paddingBottom: space.xs },
  tabMark: { height: 3, width: 36, marginBottom: 6, backgroundColor: 'transparent' },
  tabMarkOn: { backgroundColor: color.ink },
  tabText: { fontFamily: font.body, fontSize: 14, color: color.inkSoft, marginTop: 2 },
  tabTextOn: { fontFamily: font.bodyBold, color: color.ink },
});
