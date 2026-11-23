// The win moment: when a game ends, the winners' names rise up big, a spectral line opens across,
// and a burst of colour pieces flies out from the middle. About 2.4 seconds, tap to close early.
// With Reduce Motion on, the card simply fades in and out: same words, no burst.
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { t } from '../i18n/en';
import { celebrate as timing, dark as color, font, spectrum } from '../theme/tokens';
import { Spectrum } from './Spectrum';
import { useReduceMotion } from './useReduceMotion';

const native = Platform.OS !== 'web';
const COLORS = [spectrum.cyan, spectrum.blue, spectrum.violet, spectrum.magenta, spectrum.coral, spectrum.orange, spectrum.yellow, spectrum.green];
const PIECES = 26;

interface Props {
  court: number;
  names: string[];
  score: [number, number];
  onDone: () => void;
}

export function Celebrate({ court, names, score, onDone }: Props) {
  const reduce = useReduceMotion();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(0)).current;
  const burst = useRef(new Animated.Value(0)).current;
  // Each piece flies on its own angle and distance; fixed per celebration.
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => {
        const angle = (i / PIECES) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = 120 + Math.random() * 110;
        return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist * 0.8 + 40, spin: `${Math.round((Math.random() - 0.5) * 720)}deg`, color: COLORS[i % COLORS.length], round: i % 3 === 0 };
      }),
    [],
  );

  useEffect(() => {
    const show = Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: native }),
      reduce ? Animated.delay(0) : Animated.spring(rise, { toValue: 1, damping: 13, stiffness: 140, useNativeDriver: native }),
      reduce ? Animated.delay(0) : Animated.timing(burst, { toValue: 1, duration: timing.burst, easing: Easing.out(Easing.cubic), useNativeDriver: native }),
    ]);
    if (reduce) rise.setValue(1);
    const run = Animated.sequence([show, Animated.delay(reduce ? timing.hold + 400 : timing.hold), Animated.timing(fade, { toValue: 0, duration: 260, useNativeDriver: native })]);
    run.start(({ finished }) => finished && onDone());
    return () => run.stop();
  }, [fade, rise, burst, reduce, onDone]);

  const won = Math.max(score[0], score[1]);
  const lost = Math.min(score[0], score[1]);
  return (
    <Animated.View style={[s.wrap, { opacity: fade }]} accessibilityLiveRegion="assertive">
      <Pressable style={s.fill} onPress={onDone} accessibilityRole="button" accessibilityLabel={t.celebrate.a11y(names.join(' and '))}>
        <View style={s.center}>
          {!reduce
            ? pieces.map((p, i) => (
                <Animated.View
                  key={i}
                  style={[
                    s.piece,
                    p.round && s.round,
                    {
                      backgroundColor: p.color,
                      opacity: burst.interpolate({ inputRange: [0, 0.1, 0.75, 1], outputRange: [0, 1, 1, 0] }),
                      transform: [
                        { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, p.dx] }) },
                        { translateY: burst.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, p.dy - 50, p.dy] }) },
                        { rotate: burst.interpolate({ inputRange: [0, 1], outputRange: ['0deg', p.spin] }) },
                        { scale: burst.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.3, 1.2, 0.8] }) },
                      ],
                    },
                  ]}
                />
              ))
            : null}
          <Animated.View
            style={[
              s.card,
              {
                transform: [
                  { translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
                  { scale: rise.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
                ],
              },
            ]}
          >
            <Text style={s.kicker}>{t.celebrate.kicker(court + 1)}</Text>
            {names.map((n, i) => (
              <Text key={`${n}-${i}`} style={s.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                {n.toUpperCase()}
              </Text>
            ))}
            <Animated.View style={{ alignSelf: 'stretch', transform: [{ scaleX: rise }] }}>
              <Spectrum height={3} style={s.line} />
            </Animated.View>
            {won > 0 ? <Text style={s.score}>{`${won}–${lost}`}</Text> : <Text style={s.score}>{t.celebrate.won}</Text>}
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.78)' },
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  piece: { position: 'absolute', width: 10, height: 16, borderRadius: 2 },
  round: { width: 12, height: 12, borderRadius: 6 },
  card: { alignItems: 'center', paddingHorizontal: 32, maxWidth: 360, width: '100%' },
  kicker: { fontFamily: font.micro, fontSize: 14, letterSpacing: 3, color: color.textSoft, marginBottom: 10 },
  name: { fontFamily: font.display, fontSize: 46, lineHeight: 52, color: color.paint, letterSpacing: 2, textTransform: 'uppercase' },
  line: { marginTop: 14, marginBottom: 12 },
  score: { fontFamily: font.num, fontSize: 30, color: color.ball, letterSpacing: 2 },
});
