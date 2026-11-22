// Liquid glass, drawn: a see-through body that is lighter at the top, a rim that catches the light on the
// top-left edge, and a thin shine line. Same on every phone; text on it stays readable in sun.
import { ReactNode, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../theme/theme';
import { radius as R } from '../theme/tokens';

let n = 0;

export function Glass({ children, style, radius = R.glass, tint }: { children?: ReactNode; style?: StyleProp<ViewStyle>; radius?: number; tint?: string }) {
  const c = useTheme();
  const [id] = useState(() => `gl${(n = (n + 1) % 100000)}`);
  const [box, setBox] = useState({ w: 0, h: 0 });
  // SVG turns a corner bigger than half the side into an oval; a pill needs exactly half the height.
  const rx = box.h ? Math.min(radius, box.h / 2, box.w / 2) : Math.min(radius, 28);
  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden' }, s.shadow, { shadowColor: c.shadow }, style]} onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id={`${id}b`} x1="0" y1="0" x2="0.35" y2="1">
            <Stop offset="0" stopColor={tint ?? c.glassTop} stopOpacity={1} />
            <Stop offset="1" stopColor={tint ?? c.glassBottom} stopOpacity={1} />
          </LinearGradient>
          <LinearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={c.glassRimHi} stopOpacity={1} />
            <Stop offset="0.45" stopColor={c.glassRim} stopOpacity={1} />
            <Stop offset="1" stopColor={c.glassRimHi} stopOpacity={0.35} />
          </LinearGradient>
          <LinearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={c.glassShine} />
            <Stop offset="0.4" stopColor="#FFFFFF" stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" rx={rx} fill={`url(#${id}b)`} />
        <Rect x="0" y="0" width="100%" height="100%" rx={rx} fill={`url(#${id}s)`} />
        {box.w ? <Rect x={0.75} y={0.75} width={box.w - 1.5} height={box.h - 1.5} rx={Math.max(0, rx - 0.75)} fill="none" stroke={`url(#${id}r)`} strokeWidth={1.5} /> : null}
      </Svg>
      {children}
    </View>
  );
}

const s = StyleSheet.create({ shadow: { shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 24, elevation: 0 } });
