// The big title at the top of every tab, Apple-style: large, bold, left-aligned, with a line under it.
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { themed } from '../theme/theme';
import { font, size, space } from '../theme/tokens';

export function Header({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  const s = useS();
  return (
    <View style={s.wrap}>
    <View style={s.row}>
      <View style={{ flex: 1 }}>
        <Text style={s.title} accessibilityRole="header">{title.toUpperCase()}</Text>
        {sub ? <Text style={s.sub} numberOfLines={1}>{sub}</Text> : null}
      </View>
      {right}
    </View>
      <View style={s.line} />
    </View>
  );
}

const useS = themed((c) => ({
  wrap: { paddingHorizontal: space.l + 4, paddingBottom: space.m },
  row: { flexDirection: 'row', alignItems: 'flex-end', paddingTop: space.m, paddingBottom: space.m },
  line: { height: 1, backgroundColor: c.titleLine },
  title: { fontFamily: font.heading, fontSize: size.hero, lineHeight: size.hero + 4, color: c.text, letterSpacing: 0.2 },
  sub: { fontFamily: font.body, fontSize: size.small + 1, color: c.textSoft, marginTop: 2 },
}));
