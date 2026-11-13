import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { hairline, radius, space, tapMin } from '../theme/tokens';
import { Type } from './Type';

interface Props {
  label: string;
  onPress: () => void;
  kind?: 'ink' | 'outline' | 'quiet';
  disabled?: boolean;
  style?: ViewStyle;
}

/** Ink = the one main action on a screen. Outline = second choice. Quiet = small tools. */
export function Btn({ label, onPress, kind = 'ink', disabled, style }: Props) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.base,
        kind === 'ink' && { backgroundColor: c.primary },
        kind === 'outline' && { borderWidth: hairline, borderColor: c.text },
        kind === 'quiet' && styles.quiet,
        { opacity: disabled ? 0.35 : pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Type variant={kind === 'quiet' ? 'label' : 'number'} tone={kind === 'ink' ? 'onPrimary' : 'text'}>
        {label}
      </Type>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: tapMin + 4,
    paddingHorizontal: space.xl,
    borderRadius: radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quiet: { paddingHorizontal: space.m, minHeight: tapMin },
});
