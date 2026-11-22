// The signature: a game is drawn as a top-down US hard court (green surround, blue court, lighter-blue
// kitchens, dark net with posts) with the players' names painted on it.
// When a game starts, the court swoops down into place, a ball flies over the net, a glass shine sweeps
// across and the names float in. Once per game, and never when the phone asks for reduced motion.
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { color, font, glass, line, motion, size } from '../theme/tokens';
import { Glass } from './Glass';
import { useReduceMotion } from './useReduceMotion';

interface Props {
  left: string[];
  right: string[];
  /** The score call, shown on the glass tag. */
  call?: string;
  /** A game in progress: the glass tag shows a live dot. */
  live?: boolean;
  height?: number;
  dim?: boolean;
  /** The game id. A new id plays the opening once. */
  introKey?: string;
}

const native = Platform.OS !== 'web';
const played = new Set<string>();

export function CourtSurface({ left, right, call, live = false, height = 122, dim = false, introKey }: Props) {
  const reduce = useReduceMotion();
  const fresh = !!introKey && !played.has(introKey);
  const land = useRef(new Animated.Value(fresh ? 0 : 1)).current;
  const ball = useRef(new Animated.Value(fresh ? 0 : 1)).current;
  const shine = useRef(new Animated.Value(fresh ? 0 : 1)).current;
  const names = useRef(new Animated.Value(fresh ? 0 : 1)).current;
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!introKey || played.has(introKey)) return;
    played.add(introKey);
    if (reduce) {
      [land, ball, shine, names].forEach((v) => v.setValue(1));
      return;
    }
    [land, ball, shine, names].forEach((v) => v.setValue(0));
    Animated.sequence([
      Animated.timing(land, { toValue: 1, duration: motion.courtIn, easing: Easing.out(Easing.cubic), useNativeDriver: native }),
      Animated.parallel([
        Animated.timing(ball, { toValue: 1, duration: motion.ballFlight, easing: Easing.inOut(Easing.quad), useNativeDriver: native }),
        Animated.timing(shine, { toValue: 1, duration: motion.sweep, easing: Easing.inOut(Easing.cubic), useNativeDriver: native }),
        Animated.timing(names, { toValue: 1, duration: 320, delay: motion.nameStagger, easing: Easing.out(Easing.quad), useNativeDriver: native }),
      ]),
    ]).start();
  }, [introKey, reduce, land, ball, shine, names]);

  const courtStyle = {
    opacity: land.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0, 1, 1] }),
    transform: [
      { perspective: 700 },
      { rotateX: land.interpolate({ inputRange: [0, 1], outputRange: ['58deg', '0deg'] }) },
      { scale: land.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
    ],
  };
  const nameStyle = {
    opacity: names,
    transform: [{ translateY: names.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
  };
  const fromX = w * 0.16;
  const toX = w * 0.8;
  const ballX = ball.interpolate({ inputRange: [0, 1], outputRange: [fromX, toX] });
  const ballStyle = {
    opacity: ball.interpolate({ inputRange: [0, 0.05, 0.85, 1], outputRange: [0, 1, 1, 0] }),
    transform: [
      { translateX: ballX },
      { translateY: ball.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -46, 0] }) },
      { scale: ball.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.4, 1] }) },
    ],
  };
  const shadowStyle = {
    opacity: ball.interpolate({ inputRange: [0, 0.05, 0.85, 1], outputRange: [0, 0.35, 0.35, 0] }),
    transform: [{ translateX: ballX }, { scaleX: ball.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.55, 1] }) }],
  };
  const shineStyle = {
    opacity: shine.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
    transform: [{ translateX: shine.interpolate({ inputRange: [0, 1], outputRange: [-120, w + 40] }) }, { rotate: '18deg' }],
  };
  const mid = height / 2 + 4;

  return (
    <View style={[s.out, dim && s.dim]} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      <Animated.View style={[s.court, { height }, courtStyle]}>
        <Half names={left} style={nameStyle} />
        <View style={[s.kitchen, s.kitchenL]} />
        <View style={s.netWrap}>
          <View style={s.post} />
          <View style={s.net} />
          <View style={s.post} />
        </View>
        <View style={[s.kitchen, s.kitchenR]} />
        <Half names={right} style={nameStyle} />
        {w > 0 ? (
          <View pointerEvents="none" style={s.clip}>
          <Animated.View pointerEvents="none" style={[s.shine, { height: height + 60 }, shineStyle]}>
            <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 10 10">
              <Defs>
                <LinearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={color.paint} stopOpacity={0} />
                  <Stop offset="0.5" stopColor={color.paint} stopOpacity={glass.sweep} />
                  <Stop offset="1" stopColor={color.paint} stopOpacity={0} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="10" height="10" fill="url(#sweep)" />
            </Svg>
          </Animated.View>
          </View>
        ) : null}
      </Animated.View>
      {w > 0 ? (
        <>
          <Animated.View pointerEvents="none" style={[s.ballShadow, { top: mid + 12 }, shadowStyle]} />
          <Animated.View pointerEvents="none" style={[s.ball, { top: mid }, ballStyle]} />
        </>
      ) : null}
      {call || live ? (
        <Glass style={s.tag}>
          <View style={s.tagRow}>
            {live ? <LiveDot /> : null}
            <Text style={s.call}>{call ?? 'LIVE'}</Text>
          </View>
        </Glass>
      ) : null}
    </View>
  );
}

function Half({ names, style }: { names: string[]; style: object }) {
  return (
    <View style={s.half}>
      <View style={s.center} />
      <Animated.View style={[s.names, style]}>
        {names.map((n, i) => (
          <Text key={`${n}-${i}`} style={s.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
            {n.toUpperCase()}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

/** A small dot with a ring that breathes out, like a "live" light on a scoreboard. */
function LiveDot() {
  const reduce = useReduceMotion();
  const ring = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return;
    const loop = Animated.loop(Animated.timing(ring, { toValue: 1, duration: motion.livePulse, easing: Easing.out(Easing.quad), useNativeDriver: native }));
    loop.start();
    return () => loop.stop();
  }, [reduce, ring]);
  return (
    <View style={s.dotBox}>
      {!reduce ? (
        <Animated.View
          style={[
            s.dotRing,
            {
              opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
              transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [1, 2.4] }) }],
            },
          ]}
        />
      ) : null}
      <View style={s.dot} />
    </View>
  );
}

const s = StyleSheet.create({
  out: { backgroundColor: color.courtOut, paddingVertical: 10, paddingHorizontal: 14 },
  dim: { opacity: 0.4 },
  court: { flexDirection: 'row', alignItems: 'stretch', backgroundColor: color.court, borderWidth: line.court, borderColor: color.paint, overflow: 'visible' },
  half: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  names: { alignItems: 'center' },
  center: { position: 'absolute', left: 0, right: 0, top: '50%', height: 2, backgroundColor: color.kitchen },
  name: { fontFamily: font.display, fontSize: size.name, lineHeight: size.name + 4, color: color.paint, letterSpacing: 0.4 },
  kitchen: { width: 24, backgroundColor: color.kitchenFill },
  kitchenL: { borderLeftWidth: 2, borderColor: color.paint },
  kitchenR: { borderRightWidth: 2, borderColor: color.paint },
  netWrap: { width: 6, marginVertical: -16, alignItems: 'center' },
  net: { flex: 1, width: 4, backgroundColor: color.net },
  post: { width: 9, height: 9, borderRadius: 5, backgroundColor: color.net },
  clip: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
  shine: { position: 'absolute', top: -30, left: 0, width: 90 },
  ball: { position: 'absolute', left: 0, width: 16, height: 16, marginLeft: -8, borderRadius: 8, backgroundColor: color.ball, borderWidth: 1.5, borderColor: color.ink },
  ballShadow: { position: 'absolute', left: 0, width: 16, height: 6, marginLeft: -8, borderRadius: 4, backgroundColor: color.net },
  tag: { position: 'absolute', right: 10, bottom: -14, paddingHorizontal: 12, paddingVertical: 3, backgroundColor: glass.tint },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  call: { fontFamily: font.displayItalic, fontSize: 20, color: color.paint, letterSpacing: 1.5 },
  dotBox: { width: 10, height: 10, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: color.ball },
  dotRing: { position: 'absolute', width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: color.ball },
});
