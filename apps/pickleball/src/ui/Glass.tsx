// A card: white at 10% on the black canvas (white in light mode), radius 18, a barely-there edge.
// No shadow, no shine line (Dark Athletic design system). Plain views only: Android draws them exactly like the preview.
// (SVG gradients were dropped: Android painted their see-through colours solid black.)
import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/theme';
import { radius as R } from '../theme/tokens';

export function Glass({ children, style, radius = R.glass, tint }: { children?: ReactNode; style?: StyleProp<ViewStyle>; radius?: number; tint?: string }) {
  const c = useTheme();
  return (
    <View style={[{ borderRadius: radius, backgroundColor: tint ?? c.card, borderWidth: 1, borderColor: c.edge, overflow: 'hidden' }, style]}>
      {children}
    </View>
  );
}
