// The soft coloured light behind every screen: court blue, surround green and a hint of ball yellow.
// The glass panels sit on it; because the light is already soft, no real-time blur is needed.
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../theme/theme';

export function Ambient() {
  const c = useTheme();
  const glow = (id: string, colour: string, cx: string, cy: string, r: string, o: number) => (
    <>
      <Defs>
        <RadialGradient id={id} cx={cx} cy={cy} r={r} gradientUnits="objectBoundingBox">
          <Stop offset="0" stopColor={colour} stopOpacity={o} />
          <Stop offset="1" stopColor={colour} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </>
  );
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: c.bg }]}>
      <Svg width="100%" height="100%">
        {glow('g1', c.glow1, '0.1', '0.18', '0.62', c.glowOpacity)}
        {glow('g2', c.glow2, '0.95', '0.6', '0.55', c.glowOpacity * 0.9)}
        {glow('g3', c.glow3, '0.45', '1.02', '0.42', c.glowOpacity * 0.32)}
      </Svg>
    </View>
  );
}
