import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { font, radius, space } from '../theme/tokens';

/** The signature of the app: a red rubber stamp that lands when a puzzle is solved. */
export function Stamp({ word, sub, animate = true, small }: { word: string; sub?: string; animate?: boolean; small?: boolean }) {
  const { c } = useTheme();
  const drop = useRef(new Animated.Value(animate ? 0 : 1)).current;

  useEffect(() => {
    if (!animate) return;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduce) => {
        if (cancelled) return;
        if (reduce) drop.setValue(1);
        else Animated.timing(drop, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
      })
      .catch(() => drop.setValue(1));
    return () => {
      cancelled = true;
    };
  }, [animate, drop]);

  const scale = drop.interpolate({ inputRange: [0, 1], outputRange: [1.7, 1] });
  return (
    <Animated.View
      accessibilityRole="text"
      accessibilityLabel={sub ? `${word}. ${sub}` : word}
      style={[
        styles.box,
        small && styles.small,
        { borderColor: c.accent, opacity: drop, transform: [{ rotate: '-8deg' }, { scale }] },
      ]}
    >
      <View style={[styles.inner, { borderColor: c.accent }]}>
        <Animated.Text style={[styles.word, small && styles.wordSmall, { color: c.accent }]}>{word}</Animated.Text>
        {sub ? <Animated.Text style={[styles.sub, { color: c.accent }]}>{sub}</Animated.Text> : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 3, borderRadius: radius * 2, padding: 3, alignSelf: 'center' },
  small: { borderWidth: 2, padding: 2 },
  inner: { borderWidth: 1, borderRadius: radius, paddingHorizontal: space.l, paddingVertical: space.s, alignItems: 'center' },
  word: { fontFamily: font.sansBold, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase' },
  wordSmall: { fontSize: 13, letterSpacing: 2.5 },
  sub: { fontFamily: font.sans, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 },
});
