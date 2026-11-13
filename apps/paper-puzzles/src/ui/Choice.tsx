import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { hairline, radius, tapMin } from '../theme/tokens';
import { Type } from './Type';

interface Props<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

/** A row of boxes where one is inked in. Used for every setting. */
export function Choice<T extends string>({ label, value, options, onChange }: Props<T>) {
  const { c } = useTheme();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={[styles.row, { borderColor: c.text }]}>
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            style={[
              styles.box,
              on && { backgroundColor: c.primary },
              i > 0 && { borderStartWidth: hairline, borderStartColor: c.text },
            ]}
          >
            <Type variant="number" tone={on ? 'onPrimary' : 'text'} numberOfLines={1} style={{ textAlign: 'center' }}>
              {o.label}
            </Type>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', borderWidth: hairline, borderRadius: radius, overflow: 'hidden' },
  box: { flex: 1, minHeight: tapMin + 4, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
});
