// The signature: a game is drawn as a top-down hard court, with the players' names painted on it.
import { StyleSheet, Text, View } from 'react-native';
import { color, font, line, size } from '../theme/tokens';

interface Props {
  left: string[];
  right: string[];
  call?: string;
  height?: number;
  servingSide?: 'left' | 'right' | null;
  dim?: boolean;
}

export function CourtSurface({ left, right, call, height = 122, servingSide = null, dim = false }: Props) {
  return (
    <View style={[s.out, dim && s.dim]}>
    <View style={[s.court, { height }]}>
      <Half names={left} serving={servingSide === 'left'} />
      <View style={s.kitchenL} />
      <View style={s.net} />
      <View style={s.kitchenR} />
      <Half names={right} serving={servingSide === 'right'} />
      {call ? <Text style={s.call}>{call}</Text> : null}
    </View>
    </View>
  );
}

function Half({ names, serving }: { names: string[]; serving: boolean }) {
  return (
    <View style={s.half}>
      <View style={s.center} />
      {names.map((n, i) => (
        <Text key={`${n}-${i}`} style={s.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          {n.toUpperCase()}
        </Text>
      ))}
      {serving ? <View style={s.serveDot} /> : null}
    </View>
  );
}

const s = StyleSheet.create({
  out: { backgroundColor: color.courtOut, padding: 7 },
  court: { flexDirection: 'row', alignItems: 'stretch', backgroundColor: color.court, borderWidth: line.court, borderColor: color.paint },
  dim: { opacity: 0.35 },
  half: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  name: { fontFamily: font.display, fontSize: size.name, lineHeight: size.name + 2, color: color.paint, letterSpacing: 0.3 },
  net: { width: line.court, backgroundColor: color.paint },
  kitchenL: { width: 26, borderRightWidth: 2, borderColor: color.kitchen },
  kitchenR: { width: 26, borderLeftWidth: 2, borderColor: color.kitchen },
  call: { position: 'absolute', right: 8, bottom: 4, fontFamily: font.display, fontSize: 19, color: color.paint, letterSpacing: 1 },
  center: { position: 'absolute', left: 0, right: 0, top: '50%', height: 2, backgroundColor: color.kitchen },
  serveDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: color.ball, marginTop: 4 },
});
