import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { themed } from '../theme/theme';
import { font, radius, size, touch } from '../theme/tokens';

type Kind = 'go' | 'glass' | 'solid' | 'stop' | 'quiet';

export function Button({ label, onPress, kind = 'glass', style, a11y, disabled }: { label: string; onPress: () => void; kind?: Kind; style?: StyleProp<ViewStyle>; a11y?: string; disabled?: boolean }) {
  const s = useS();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={a11y ?? label} onPress={onPress} disabled={disabled} style={({ pressed }) => [s.base, pressed && s.pressed, disabled && { opacity: 0.4 }, style]}>
      <View style={[s.fill, s[kind]]}>
        <Text style={[s.text, kind === 'go' && s.goText, kind === 'solid' && s.solidText, kind === 'stop' && s.stopText]} numberOfLines={1}>{label}</Text>
      </View>
    </Pressable>
  );
}

const useS = themed((c) => ({
  base: { minHeight: touch.min, borderRadius: radius.pill },
  fill: { flex: 1, minHeight: touch.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  glass: { backgroundColor: c.control, borderWidth: 1.5, borderColor: c.controlEdge },
  go: { backgroundColor: c.accent, borderWidth: c.mode === 'light' ? 1.5 : 0, borderColor: c.accentLine },
  solid: { backgroundColor: c.solid },
  stop: { backgroundColor: c.stop },
  quiet: { backgroundColor: 'transparent' },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  text: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: c.text },
  goText: { color: c.accentText },
  solidText: { color: c.solidText },
  stopText: { color: '#FFFFFF' },
}));
