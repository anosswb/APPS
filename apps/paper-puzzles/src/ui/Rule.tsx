import React from 'react';
import { View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { hairline } from '../theme/tokens';

/** A printed rule line. "double" is the heavy-and-light pair under a newspaper masthead. */
export function Rule({ double, strong }: { double?: boolean; strong?: boolean }) {
  const { c } = useTheme();
  if (double) {
    return (
      <View>
        <View style={{ height: 3, backgroundColor: c.text }} />
        <View style={{ height: 2 }} />
        <View style={{ height: hairline, backgroundColor: c.text }} />
      </View>
    );
  }
  return <View style={{ height: hairline, backgroundColor: strong ? c.text : c.rule }} />;
}
