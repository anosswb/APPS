// The screen background: black (light grey in sun mode) with a large spectral glow across the top
// (Dark Athletic design system, Anass 22 Nov 2026: "large spectral gradients").
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/theme';
import { Atmosphere } from './Glow';

export function Ambient() {
  const c = useTheme();
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: c.bg }]}>
      <Atmosphere />
    </View>
  );
}
