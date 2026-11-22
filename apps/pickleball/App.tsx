import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Platform, Pressable, Text, useColorScheme, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useFonts, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplineSansMono_500Medium, SplineSansMono_600SemiBold } from '@expo-google-fonts/spline-sans-mono';
import { Michroma_400Regular } from '@expo-google-fonts/michroma';
import { t } from './src/i18n/en';
import { AwardId, evaluate, newlyEarned } from './src/logic/achievements';
import { allSessions } from './src/logic/history';
import { finishGame, scoreRally, setFirstServe, undoRally, updateSettings } from './src/logic/session';
import { Team } from './src/logic/scoring';
import { useSession } from './src/state/useSession';
import { withPhoto, withPlace } from './src/state/storage';
import { AwardsScreen } from './src/screens/AwardsScreen';
import { BoardScreen } from './src/screens/BoardScreen';
import { GuideScreen } from './src/screens/GuideScreen';
import { CourtsScreen } from './src/screens/CourtsScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { LicencesScreen } from './src/screens/LicencesScreen';
import { PlayersScreen } from './src/screens/PlayersScreen';
import { ScorerScreen } from './src/screens/ScorerScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AdBanner, initAds } from './src/money/ads';
import { Ambient } from './src/ui/Ambient';
import { BADGES } from './src/ui/badges';
import { Glass } from './src/ui/Glass';
import { Icon, IconName } from './src/ui/Icon';
import { useReduceMotion } from './src/ui/useReduceMotion';
import { ThemeProvider, themed, useTheme } from './src/theme/theme';
import { dark, font, light, motion, radius, space } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch((e) => console.warn(`[splash] ${String(e)}`));

type Tab = 'courts' | 'players' | 'history' | 'awards' | 'settings';

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_500Medium, Inter_600SemiBold, Inter_700Bold, SplineSansMono_500Medium, SplineSansMono_600SemiBold, Michroma_400Regular });
  const app = useSession();
  const system = useColorScheme();
  const palette = app.prefs.theme === 'light' || (app.prefs.theme === 'system' && system === 'light') ? light : dark;

  useEffect(() => {
    if (fontsLoaded && app.ready) SplashScreen.hideAsync().catch((e) => console.warn(`[splash] ${String(e)}`));
  }, [fontsLoaded, app.ready]);

  if (!fontsLoaded || !app.ready) return null;
  return (
    <SafeAreaProvider>
      <ThemeProvider palette={palette}>
        <Shell app={app} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function Shell({ app }: { app: ReturnType<typeof useSession> }) {
  const { session, act, undo, canUndo, prefs, setPrefs, history, setHistory, closeSession } = app;
  const c = useTheme();
  const s = useS();
  const [tab, setTab] = useState<Tab>('courts');
  const [scoring, setScoring] = useState<number | null>(null);
  const [board, setBoard] = useState(false);
  const [licences, setLicences] = useState(false);
  const [adsReady, setAdsReady] = useState(false);
  const [adsAsked, setAdsAsked] = useState(false);
  const [banner, setBanner] = useState<{ id: AwardId; who: string } | null>(null);
  const [guide, setGuide] = useState(false);
  const [startAdding, setStartAdding] = useState(false);

  // Ads start the first time Players or Settings opens, never on the courts (docs/money.md).
  useEffect(() => {
    if (adsAsked || (tab !== 'players' && tab !== 'settings')) return;
    setAdsAsked(true);
    initAds()
      .then(() => setAdsReady(true))
      .catch((e) => console.warn(`[ads] did not start: ${String(e)}`));
  }, [tab, adsAsked]);

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

  // Voice: when a new game starts on a court, say who goes on. Skips the games already there at app start.
  const known = useRef<Set<string> | null>(null);
  useEffect(() => {
    const ids = session.courts.flatMap((g, i) => (g ? [[g.id, i] as const] : []));
    if (known.current === null) {
      known.current = new Set(ids.map(([id]) => id));
      return;
    }
    for (const [id, court] of ids) {
      if (known.current.has(id)) continue;
      known.current.add(id);
      const g = session.courts[court]!;
      if (prefs.voice && Platform.OS !== 'web') {
        const names = [...g.teamA, ...g.teamB].map((p) => session.players[p]?.name ?? '');
        Speech.speak(t.voice.open(court + 1, names), { language: 'en-US', rate: 0.95 });
      }
    }
  }, [session.courts, session.players, prefs.voice]);

  // Awards, worked out again from all sessions. A new one shows a banner once.
  const sessions = useMemo(() => allSessions(history.sessions, session), [history.sessions, session]);
  const awards = useMemo(() => evaluate(sessions), [sessions]);
  useEffect(() => {
    const fresh = newlyEarned(awards, history.seen);
    if (!fresh.length) return;
    setHistory((h) => ({ ...h, seen: [...h.seen, ...fresh] }));
    const id = fresh[fresh.length - 1];
    setBanner({ id, who: awards[id].by[0] ?? '' });
    buzz('done');
  }, [awards, history.seen, setHistory, buzz]);

  if (guide || !prefs.guideDone) {
    return (
      <>
        <StatusBar style={c.mode === 'dark' ? 'light' : 'dark'} />
        <GuideScreen
          settings={session.settings}
          onDone={(st) => {
            act((x, now) => updateSettings(x, { courts: st.courts, rule: st.rule, scoring: st.scoring }, now));
            setPrefs({ ...prefs, guideDone: true });
            setGuide(false);
            setTab('courts');
            setStartAdding(Object.keys(session.players).length === 0);
          }}
        />
      </>
    );
  }
  if (licences) {
    return (
      <>
        <StatusBar style={c.mode === 'dark' ? 'light' : 'dark'} />
        <Ambient />
        <LicencesScreen onClose={() => setLicences(false)} />
      </>
    );
  }
  if (board) {
    return (
      <>
        <StatusBar style={c.mode === 'dark' ? 'light' : 'dark'} />
        <Ambient />
        <BoardScreen session={session} onClose={() => setBoard(false)} />
      </>
    );
  }
  if (scoring !== null && session.courts[scoring]) {
    const ct = scoring;
    return (
      <>
        <StatusBar style="light" />
        <ScorerScreen
          session={session}
          court={ct}
          onRally={(team: Team) => {
            act((x) => scoreRally(x, ct, team));
            buzz('tap');
          }}
          onUndo={() => act((x) => undoRally(x, ct))}
          onFirstServe={(team) => act((x) => setFirstServe(x, ct, team))}
          onFinish={(winner) => {
            act((x, now) => finishGame(x, ct, winner, now));
            buzz('done');
            setScoring(null);
          }}
          onClose={() => setScoring(null)}
        />
      </>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={c.mode === 'dark' ? 'light' : 'dark'} />
      <Ambient />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {tab === 'courts' ? <CourtsScreen session={session} act={act} undo={undo} canUndo={canUndo} openScorer={setScoring} openBoard={() => setBoard(true)} openGuide={() => setGuide(true)} startAdding={startAdding} buzz={buzz} /> : null}
        {tab === 'players' ? <PlayersScreen session={session} act={act} /> : null}
        {tab === 'history' ? (
          <HistoryScreen
            sessions={sessions}
            awards={awards}
            meta={history.meta}
            places={history.places}
            setPlace={(id, p) => setHistory((h) => withPlace(h, id, p))}
            setPhoto={(id, uri) => setHistory((h) => withPhoto(h, id, uri))}
          />
        ) : null}
        {tab === 'awards' ? <AwardsScreen awards={awards} sessions={sessions} goals={history.goals} setGoals={(goals) => setHistory((h) => ({ ...h, goals }))} /> : null}
        {tab === 'settings' ? <SettingsScreen session={session} act={act} closeSession={closeSession} prefs={prefs} setPrefs={setPrefs} openLicences={() => setLicences(true)} openGuide={() => setGuide(true)} /> : null}
      </SafeAreaView>
      {adsReady && (tab === 'players' || tab === 'settings') ? (
        <View style={s.ad}>
          <AdBanner place={tab} />
        </View>
      ) : null}
      <TabBar tab={tab} setTab={setTab} />
      {banner ? <Banner id={banner.id} who={banner.who} onDone={() => setBanner(null)} onOpen={() => { setBanner(null); setTab('awards'); }} /> : null}
    </View>
  );
}

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const s = useS();
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const items: [Tab, IconName, string][] = [
    ['courts', 'courts', t.tabs.courts],
    ['players', 'people', t.tabs.players],
    ['history', 'chart', t.tabs.history],
    ['awards', 'award', t.tabs.awards],
    ['settings', 'gear', t.tabs.settings],
  ];
  return (
    <View style={[s.tabWrap, { bottom: Math.max(insets.bottom, 10) + 6 }]} pointerEvents="box-none">
      <Glass radius={radius.pill} style={s.tabs} tint={c.bar}>
        {items.map(([key, icon, label]) => {
          const on = tab === key;
          return (
            <Pressable key={key} style={s.tab} onPress={() => setTab(key)} accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={label}>
              <View style={[s.tabIcon, on && s.tabIconOn]}>
                <Icon name={icon} size={21} tint={on ? (c.highlight) : c.mute} />
              </View>
              <Text style={[s.tabText, on && s.tabTextOn]} numberOfLines={1}>{label}</Text>
            </Pressable>
          );
        })}
      </Glass>
    </View>
  );
}

/** "Award unlocked" slides down from the top with the badge, then leaves by itself. */
function Banner({ id, who, onDone, onOpen }: { id: AwardId; who: string; onDone: () => void; onOpen: () => void }) {
  const s = useS();
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const y = useRef(new Animated.Value(reduce ? 0 : -160)).current;
  useEffect(() => {
    const native = Platform.OS !== 'web';
    const show = reduce ? Animated.delay(0) : Animated.spring(y, { toValue: 0, useNativeDriver: native, damping: 16, stiffness: 160 });
    const hide = reduce ? Animated.delay(0) : Animated.timing(y, { toValue: -180, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: native });
    const run = Animated.sequence([show, Animated.delay(motion.banner), hide]);
    run.start(({ finished }) => finished && onDone());
    return () => run.stop();
  }, [y, reduce, onDone]);
  return (
    <Animated.View style={[s.bannerWrap, { top: insets.top + 6, transform: [{ translateY: y }] }]}>
      <Pressable onPress={onOpen} accessibilityRole="button">
        <Glass radius={26} style={s.banner} tint={c.bar}>
          <View style={s.bannerCase}>
            <Image source={BADGES[id]} style={s.bannerBadge} resizeMode="contain" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.bannerKicker}>{t.awards.unlocked.toUpperCase()}</Text>
            <Text style={s.bannerName}>{t.awards.name[id]}</Text>
            {who ? <Text style={s.bannerWho} numberOfLines={1}>{who}</Text> : null}
          </View>
        </Glass>
      </Pressable>
    </Animated.View>
  );
}

const useS = themed((c) => ({
  ad: { position: 'absolute', left: 0, right: 0, bottom: 96 },
  tabWrap: { position: 'absolute', left: space.m, right: space.m },
  tabs: { flexDirection: 'row', paddingHorizontal: 6, paddingVertical: 6 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 58 },
  tabIcon: { width: 48, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  tabIconOn: { backgroundColor: c.mode === 'dark' ? 'rgba(216,242,58,0.16)' : 'rgba(33,71,201,0.12)' },
  tabText: { fontFamily: font.body, fontSize: 11.5, color: c.mute, marginTop: 2 },
  tabTextOn: { fontFamily: font.bodyBold, color: c.text },
  bannerWrap: { position: 'absolute', left: space.m, right: space.m },
  banner: { flexDirection: 'row', alignItems: 'center', gap: space.m, padding: space.s },
  bannerCase: { width: 64, height: 72, borderRadius: 18, backgroundColor: c.showcase, alignItems: 'center', justifyContent: 'center' },
  bannerBadge: { width: 52, height: 64 },
  bannerKicker: { fontFamily: font.label, fontSize: 12, letterSpacing: 1, color: c.highlight },
  bannerName: { fontFamily: font.heading, fontSize: 16, color: c.text },
  bannerWho: { fontFamily: font.body, fontSize: 13, color: c.mute },
}));

