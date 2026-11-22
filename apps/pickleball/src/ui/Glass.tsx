// Frosted glass laid on the court paint: a see-through white body, a bright rim and a soft top shine.
// Drawn, not blurred, so it looks the same on every phone and keeps white text readable in sun.
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { color, glass } from '../theme/tokens';

export function Glass({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return (
    <View style={[s.body, style]}>
      <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none" viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color.paint} stopOpacity={glass.shineTop} />
            <Stop offset="0.55" stopColor={color.paint} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#shine)" />
      </Svg>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  body: { overflow: 'hidden', backgroundColor: glass.body, borderWidth: 1, borderColor: glass.rim, borderRadius: glass.radius },
});
