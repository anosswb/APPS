// The blue band at the top of every tab, like the scoreboard on a court fence.
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, font, size, space } from '../theme/tokens';

export function Header({ title, chip, right }: { title: string; chip?: string; right?: ReactNode }) {
  return (
    <View style={s.band}>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title.toUpperCase()}</Text>
        {chip ? (
          <View style={s.chip}>
            <View style={s.dot} />
            <Text style={s.chipText}>{chip.toUpperCase()}</Text>
          </View>
        ) : null}
      </View>
      {right}
      <View style={s.baseline} />
    </View>
  );
}

const s = StyleSheet.create({
  band: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.court, paddingHorizontal: space.l + 2, paddingTop: space.s, paddingBottom: space.l },
  title: { fontFamily: font.displayItalic, fontSize: size.hero + 4, lineHeight: size.hero + 8, color: color.paint, letterSpacing: 0.5 },
  chip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, backgroundColor: color.ball, paddingHorizontal: space.s, paddingVertical: 3, marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: color.ink },
  chipText: { fontFamily: font.label, fontSize: size.label, letterSpacing: 1.2, color: color.ballInk },
  baseline: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, backgroundColor: color.paint },
});
