// A panel: dark grey (or white in light mode) with a thin edge and a fine bright line along the top,
// like Apple's dark cards. Plain views only: Android draws them exactly like the preview.
// (SVG gradients were dropped: Android painted their see-through colours solid black.)
import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/theme';
import { radius as R } from '../theme/tokens';

export function Glass({ children, style, radius = R.glass, tint }: { children?: ReactNode; style?: StyleProp<ViewStyle>; radius?: number; tint?: string }) {
  const c = useTheme();
  return (
    <View style={[{ borderRadius: radius, backgroundColor: tint ?? c.card, borderWidth: 1, borderColor: c.edge, overflow: 'hidden' }, style]}>
      <View pointerEvents="none" style={{ position: 'absolute', left: radius / 2, right: radius / 2, top: 0, height: 1, backgroundColor: c.edgeHi }} />
      {children}
    </View>
  );
}
