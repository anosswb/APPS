// The first-run guide: four short animated pages (add names, courts fill, tap who won, the post), then a
// setup page (how many courts, who comes off, scoring) and Start, which opens the add-names bar.
// Shown once after install, and again from Settings or the "+" menu. Respects Reduce Motion.
import { ComponentRef, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, NativeScrollEvent, NativeSyntheticEvent, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../i18n/en';
import { MAX_COURTS, RotationRule, Settings } from '../logic/session';
import { Button } from '../ui/Button';
import { Label, Segments } from '../ui/Bits';
import { BADGES } from '../ui/badges';
import { CourtSurface } from '../ui/CourtSurface';
import { Glass } from '../ui/Glass';
import { Icon } from '../ui/Icon';
import { useReduceMotion } from '../ui/useReduceMotion';
import { themed, useTheme } from '../theme/theme';
import { font, radius, size, space, touch } from '../theme/tokens';

const native = Platform.OS !== 'web';
const PAGES = 5;

export function GuideScreen({ settings, onDone }: { settings: Settings; onDone: (s: Settings) => void }) {
  const s = useS();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const [setup, setSetup] = useState<Settings>(settings);
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);

  const go = (i: number) => {
    setPage(i);
    scroller.current?.scrollTo({ x: i * width, animated: true });
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== page) setPage(i);
  };

  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom + space.m }]}>
      <View style={s.top}>
        <Text style={s.brand}>{t.appName.toUpperCase()}</Text>
        {page < PAGES - 1 ? (
          <Pressable onPress={() => go(PAGES - 1)} style={s.skip} accessibilityRole="button">
            <Text style={s.skipText}>{t.guide.skip}</Text>
          </Pressable>
        ) : null}
      </View>
      <ScrollView ref={scroller} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScroll} onScroll={Platform.OS === 'web' ? onScroll : undefined} scrollEventThrottle={64} style={{ flex: 1 }}>
        <Page width={width} title={t.guide.p1Title} body={t.guide.p1Body}>
          <NamesIn active={page === 0} />
        </Page>
        <Page width={width} title={t.guide.p2Title} body={t.guide.p2Body}>
          <CourtFill active={page === 1} />
        </Page>
        <Page width={width} title={t.guide.p3Title} body={t.guide.p3Body}>
          <WhoWon active={page === 2} />
        </Page>
        <Page width={width} title={t.guide.p4Title} body={t.guide.p4Body}>
          <PostPop active={page === 3} />
        </Page>
        <View style={{ width, paddingHorizontal: space.l }}>
          <Setup value={setup} onChange={setSetup} />
        </View>
      </ScrollView>
      <View style={s.dots}>
        {Array.from({ length: PAGES }, (_, i) => (
          <View key={i} style={[s.dot, i === page && s.dotOn]} />
        ))}
      </View>
      <View style={s.bottom}>
        {page < PAGES - 1 ? <Button label={t.guide.next} kind="go" onPress={() => go(page + 1)} /> : <Button label={t.guide.start} kind="go" onPress={() => onDone(setup)} />}
      </View>
    </View>
  );
}

function Page({ width, title, body, children }: { width: number; title: string; body: string; children: React.ReactNode }) {
  const s = useS();
  return (
    <View style={{ width, paddingHorizontal: space.l }}>
      <View style={s.stage}>{children}</View>
      <Text style={s.title}>{title}</Text>
      <Text style={s.body}>{body}</Text>
    </View>
  );
}

/** Loops `run` while the page is shown; shows the end state when motion is reduced. */
function useLoop(active: boolean, values: Animated.Value[], build: () => Animated.CompositeAnimation) {
  const reduce = useReduceMotion();
  useEffect(() => {
    if (!active) return;
    if (reduce) {
      values.forEach((v) => v.setValue(1));
      return;
    }
    let alive = true;
    const once = () => {
      values.forEach((v) => v.setValue(0));
      build().start(({ finished }) => {
        if (alive && finished) setTimeout(() => alive && once(), 900);
      });
    };
    once();
    return () => {
      alive = false;
      values.forEach((v) => v.stopAnimation());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reduce]);
}

const GUIDE_NAMES = ['DANA', 'MARCUS', 'PRIYA', 'TED'];

/** Page 1: names drop into the line one by one, like paddles going into the rack. */
function NamesIn({ active }: { active: boolean }) {
  const s = useS();
  const vals = useRef(GUIDE_NAMES.map(() => new Animated.Value(0))).current;
  useLoop(active, vals, () => Animated.stagger(380, vals.map((v) => Animated.spring(v, { toValue: 1, useNativeDriver: native, damping: 14, stiffness: 140 }))));
  return (
    <View style={{ gap: 8, width: '100%' }}>
      <Glass radius={radius.pill} style={s.fakeInput}>
        <Icon name="people" size={18} />
        <Text style={s.fakeInputText}>{t.guide.typing}</Text>
      </Glass>
      {GUIDE_NAMES.map((n, i) => (
        <Animated.View key={n} style={{ opacity: vals[i], transform: [{ translateX: vals[i].interpolate({ inputRange: [0, 1], outputRange: [120, 0] }) }] }}>
          <View style={s.tag}>
            <Text style={s.tagNum}>{i + 1}</Text>
            <Text style={s.tagName}>{n}</Text>
            <View style={s.tagHandle} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

/** Page 2: the court swoops in with the four names, again each time the page is shown. */
function CourtFill({ active }: { active: boolean }) {
  const [round, setRound] = useState(0);
  const reduce = useReduceMotion();
  useEffect(() => {
    if (!active) return;
    setRound((r) => r + 1);
    if (reduce) return;
    const id = setInterval(() => setRound((r) => r + 1), 3400);
    return () => clearInterval(id);
  }, [active, reduce]);
  return (
    <View style={{ width: '100%' }}>
      <CourtSurface key={round} left={['Dana', 'Marcus']} right={['Priya', 'Ted']} height={120} introKey={`guide-court-${round}`} />
    </View>
  );
}

/** Page 3: "Game over" is tapped, the winners light up, the line moves. */
function WhoWon({ active }: { active: boolean }) {
  const s = useS();
  const tap = useRef(new Animated.Value(0)).current;
  const win = useRef(new Animated.Value(0)).current;
  const move = useRef(new Animated.Value(0)).current;
  useLoop(active, [tap, win, move], () =>
    Animated.sequence([
      Animated.timing(tap, { toValue: 1, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: native }),
      Animated.timing(win, { toValue: 1, duration: 360, useNativeDriver: native }),
      Animated.delay(250),
      Animated.timing(move, { toValue: 1, duration: 620, easing: Easing.inOut(Easing.cubic), useNativeDriver: native }),
    ]),
  );
  const press = tap.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.9, 1] });
  return (
    <View style={{ width: '100%', gap: 10 }}>
      <Animated.View style={[s.team, s.teamWin, { opacity: win.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }), transform: [{ scale: win.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1.03] }) }] }]}>
        <Text style={s.teamText}>DANA & MARCUS</Text>
        <Text style={s.teamTag}>{t.guide.won}</Text>
      </Animated.View>
      <Animated.View style={[s.team, { opacity: move.interpolate({ inputRange: [0, 1], outputRange: [1, 0.15] }), transform: [{ translateY: move.interpolate({ inputRange: [0, 1], outputRange: [0, 46] }) }] }]}>
        <Text style={s.teamTextDim}>PRIYA & TED</Text>
        <Text style={s.teamTagDim}>{t.guide.toLine}</Text>
      </Animated.View>
      <Animated.View style={[s.fakeGo, { transform: [{ scale: press }] }]}>
        <Text style={s.fakeGoText}>{t.courts.gameOver}</Text>
      </Animated.View>
    </View>
  );
}

/** Page 4: the photo post with the numbers, and badges popping in. */
function PostPop({ active }: { active: boolean }) {
  const s = useS();
  const ids = ['pickled', 'hot-streak', 'marathon', 'golden-paddle'] as const;
  const vals = useRef(ids.map(() => new Animated.Value(0))).current;
  useLoop(active, vals, () => Animated.stagger(260, vals.map((v) => Animated.spring(v, { toValue: 1, useNativeDriver: native, damping: 9, stiffness: 170 }))));
  return (
    <View style={s.post}>
      <Text style={s.postBrand}>{t.appName.toUpperCase()}</Text>
      <Text style={s.postTitle}>{t.guide.postTitle}</Text>
      <View style={s.postStats}>
        {[
          ['1h 24m', t.posts.played],
          ['12', t.history.games],
          ['10', t.history.players],
        ].map(([v, l]) => (
          <View key={l} style={{ flex: 1 }}>
            <Text style={s.postV}>{v}</Text>
            <Text style={s.postL}>{l.toUpperCase()}</Text>
          </View>
        ))}
      </View>
      <View style={s.postBadges}>
        {ids.map((id, i) => (
          <Animated.View key={id} style={{ opacity: vals[i], transform: [{ scale: vals[i].interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }] }}>
            <Image source={BADGES[id]} style={s.postBadge} resizeMode="contain" />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

function Setup({ value, onChange }: { value: Settings; onChange: (s: Settings) => void }) {
  const s = useS();
  const c = useTheme();
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: space.l }}>
      <Text style={[s.title, { marginTop: space.m }]}>{t.guide.setupTitle}</Text>
      <Label style={s.setupLabel}>{t.guide.courts}</Label>
      <Glass>
        <View style={s.stepper}>
          <Pressable style={s.step} onPress={() => onChange({ ...value, courts: Math.max(1, value.courts - 1) })} accessibilityRole="button" accessibilityLabel={t.a11y.minus}>
            <Icon name="minus" tint={value.courts <= 1 ? c.hair : c.text} />
          </Pressable>
          <Text style={s.big}>{value.courts}</Text>
          <Pressable style={s.step} onPress={() => onChange({ ...value, courts: Math.min(MAX_COURTS, value.courts + 1) })} accessibilityRole="button" accessibilityLabel={t.a11y.plus}>
            <Icon name="plus" tint={value.courts >= MAX_COURTS ? c.hair : c.text} />
          </Pressable>
        </View>
      </Glass>
      <Text style={s.hint}>{t.guide.courtsHint}</Text>
      <Label style={s.setupLabel}>{t.settings.rotation}</Label>
      <View style={{ gap: space.s }}>
        {(['all-off', 'winners-stay', 'winners-split'] as RotationRule[]).map((r) => {
          const on = value.rule === r;
          return (
            <Pressable key={r} onPress={() => onChange({ ...value, rule: r })} style={[s.rule, on && s.ruleOn]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
              <Text style={[s.ruleTitle, on && s.ruleTitleOn]}>{t.menu.ruleShort[r]}</Text>
              <Text style={[s.ruleHelp, on && s.ruleHelpOn]}>{t.menu.ruleHelp[r]}</Text>
            </Pressable>
          );
        })}
      </View>
      <Label style={s.setupLabel}>{t.settings.scoring}</Label>
      <Segments<'sideout' | 'rally'> items={[['sideout', t.settings.sideout], ['rally', t.settings.rally]]} value={value.scoring.type} onChange={(v) => onChange({ ...value, scoring: { ...value.scoring, type: v } })} />
      <Text style={s.hint}>{t.guide.changeLater}</Text>
    </ScrollView>
  );
}

const useS = themed((c) => ({
  root: { flex: 1, backgroundColor: c.bg },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.l + 4, minHeight: 52 },
  brand: { fontFamily: font.displayItalic, fontSize: 20, letterSpacing: 2, color: c.accent },
  skip: { minHeight: 44, minWidth: 64, alignItems: 'flex-end', justifyContent: 'center' },
  skipText: { fontFamily: font.bodyBold, fontSize: size.body, color: c.mute },
  stage: { height: 300, alignItems: 'center', justifyContent: 'center', marginTop: space.l, overflow: 'hidden' },
  title: { fontFamily: font.displayItalic, fontSize: 36, lineHeight: 40, color: c.text, marginTop: space.l },
  body: { fontFamily: font.body, fontSize: size.body + 1, lineHeight: 25, color: c.textSoft, marginTop: space.s },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: space.m },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.hair },
  dotOn: { width: 26, backgroundColor: c.accent },
  bottom: { paddingHorizontal: space.l },
  fakeInput: { flexDirection: 'row', alignItems: 'center', gap: space.s, minHeight: 52, paddingHorizontal: space.l },
  fakeInputText: { fontFamily: font.bodyBold, fontSize: size.body, color: c.mute },
  tag: { flexDirection: 'row', alignItems: 'center', minHeight: 52, borderRadius: 26, backgroundColor: c.accent, paddingLeft: space.l, paddingRight: 6 },
  tagNum: { width: 28, fontFamily: font.displayItalic, fontSize: 24, color: c.accentText },
  tagName: { flex: 1, fontFamily: font.display, fontSize: 24, color: c.accentText },
  tagHandle: { width: 34, height: 18, borderRadius: 6, backgroundColor: '#0B0D12' },
  team: { minHeight: 64, borderRadius: 18, backgroundColor: c.card, borderWidth: 1, borderColor: c.edge, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.l },
  teamWin: { backgroundColor: c.court, borderColor: c.paint, borderWidth: 2 },
  teamText: { fontFamily: font.display, fontSize: 24, color: c.paint },
  teamTag: { fontFamily: font.label, fontSize: 13, letterSpacing: 1.5, color: c.ball },
  teamTextDim: { fontFamily: font.display, fontSize: 24, color: c.text },
  teamTagDim: { fontFamily: font.label, fontSize: 13, letterSpacing: 1.5, color: c.mute },
  fakeGo: { alignSelf: 'center', minHeight: 56, minWidth: 180, borderRadius: 28, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', marginTop: space.m },
  fakeGoText: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: c.accentText },
  post: { width: '100%', borderRadius: 24, backgroundColor: '#163E2B', padding: space.l, overflow: 'hidden' },
  postBrand: { fontFamily: font.displayItalic, fontSize: 16, letterSpacing: 2, color: c.accent },
  postTitle: { fontFamily: font.displayItalic, fontSize: 30, color: '#FFFFFF', marginTop: space.xl },
  postStats: { flexDirection: 'row', marginTop: space.s },
  postV: { fontFamily: font.display, fontSize: 28, color: '#FFFFFF' },
  postL: { fontFamily: font.label, fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.75)' },
  postBadges: { flexDirection: 'row', gap: 6, marginTop: space.m },
  postBadge: { width: 50, height: 62 },
  setupLabel: { marginTop: space.l, marginBottom: space.s, marginLeft: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: space.m },
  step: { width: touch.big, height: touch.big, borderRadius: radius.pill, borderWidth: 1.5, borderColor: c.hair, alignItems: 'center', justifyContent: 'center' },
  big: { fontFamily: font.display, fontSize: 60, color: c.text },
  hint: { fontFamily: font.body, fontSize: size.small, color: c.mute, marginTop: space.s, marginLeft: 4 },
  rule: { borderRadius: 16, borderWidth: 1, borderColor: c.hair, backgroundColor: c.card, paddingHorizontal: space.l, paddingVertical: space.m },
  ruleOn: { backgroundColor: c.solid, borderColor: c.solid },
  ruleTitle: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: c.text },
  ruleTitleOn: { color: c.solidText },
  ruleHelp: { fontFamily: font.body, fontSize: size.small, color: c.mute, marginTop: 2 },
  ruleHelpOn: { color: c.mode === 'dark' ? '#3A3A3C' : '#C7C7CC' },
}));
