import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { color, font, line, radius, size, touch } from '../theme/tokens';

type Kind = 'go' | 'outline' | 'ink' | 'quiet' | 'stop';

export function Button({ label, onPress, kind = 'outline', style, a11y }: { label: string; onPress: () => void; kind?: Kind; style?: ViewStyle; a11y?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y ?? label}
      onPress={onPress}
      style={({ pressed }) => [s.base, s[kind], pressed && s.pressed, style]}
    >
      <Text style={[s.text, kind === 'ink' && { color: color.ground }, kind === 'stop' && { color: color.card }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: { minHeight: touch.min, borderRadius: radius.box, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, borderWidth: line.button, borderColor: color.ink },
  go: { backgroundColor: color.ball, borderColor: color.ink },
  outline: { backgroundColor: 'transparent' },
  ink: { backgroundColor: color.ink },
  quiet: { borderColor: color.hair, backgroundColor: color.card },
  stop: { backgroundColor: color.stop, borderColor: color.stop },
  pressed: { transform: [{ translateY: 1 }], opacity: 0.85 },
  text: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: color.ink },
});
