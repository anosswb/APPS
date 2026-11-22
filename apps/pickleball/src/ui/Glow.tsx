// Large blurred spectral light from the design system ("blurred spectral atmosphere").
// Drawn once as pictures by scripts/make-glow.py (real blur, clean edges, the same on every phone) and
// drifted slowly. Never behind long text; stops moving when the phone asks for reduced motion.
import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Platform, StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/theme';
import { motion } from '../theme/tokens';
import { useReduceMotion } from './useReduceMotion';

const ATMOSPHERE = require('../../assets/glow/atmosphere.png');
const AURA = require('../../assets/glow/aura.png');
const native = Platform.OS !== 'web';

function useDrift(still: boolean) {
  const reduce = useReduceMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce || still) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: motion.glow, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
        Animated.timing(v, { toValue: 0, duration: motion.glow, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduce, still, v]);
  return v;
}

/** A wide band of colour across the top of a screen, fading into the black. */
export function Atmosphere({ height = 440, still = false }: { height?: number; still?: boolean }) {
  const c = useTheme();
  const v = useDrift(still);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height, overflow: 'hidden' }}>
      <Animated.Image
        source={ATMOSPHERE}
        resizeMode="stretch"
        style={{
          position: 'absolute',
          left: -40,
          right: -40,
          top: -30,
          height: height + 30,
          width: undefined,
          opacity: c.glow,
          transform: [
            { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [-24, 24] }) },
            { scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) },
          ],
        }}
      />
    </View>
  );
}

/** A round cloud of colour behind one object (a badge, a court, the winner). */
export function Aura({ size = 320, style, still = false, strength = 1 }: { size?: number; style?: StyleProp<ViewStyle>; still?: boolean; strength?: number }) {
  const c = useTheme();
  const v = useDrift(still);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', width: size, height: size, opacity: c.glow * strength },
        { transform: [{ rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '40deg'] }) }, { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.06] }) }] },
        style,
      ]}
    >
      <Image source={AURA} style={{ width: size, height: size }} resizeMode="cover" />
    </Animated.View>
  );
}
