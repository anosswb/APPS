// The spectral accent from the design system: a thin line of colour, used only for small moments
// (a live court, a new award, a win). Solid colour stops only: Android paints see-through stops black.
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { spectral } from '../theme/tokens';

let next = 0;

export function Spectrum({ height = 3, kind = 'full', radius = 2, style }: { height?: number; kind?: keyof typeof spectral; radius?: number; style?: StyleProp<ViewStyle> }) {
  const id = `sp${(next = (next + 1) % 100000)}`;
  const stops = spectral[kind];
  return (
    <View pointerEvents="none" style={[{ height, borderRadius: radius, overflow: 'hidden' }, style]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 10">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            {stops.map((col, i) => (
              <Stop key={col} offset={i / (stops.length - 1)} stopColor={col} />
            ))}
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="10" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}
