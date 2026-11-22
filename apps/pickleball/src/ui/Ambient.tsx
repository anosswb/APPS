// The screen background: plain black (dark) or plain grey (light). No coloured light (Anass, 22 Nov 2026).
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/theme';

export function Ambient() {
  const c = useTheme();
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: c.bg }]} />;
}
