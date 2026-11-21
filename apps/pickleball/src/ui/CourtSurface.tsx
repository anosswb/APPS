// The signature: a game is drawn as a top-down US hard court (green surround, blue court, lighter-blue
// kitchens, dark net with posts) with the players' names painted on it.
import { StyleSheet, Text, View } from 'react-native';
import { color, font, line, size } from '../theme/tokens';

interface Props {
  left: string[];
  right: string[];
  call?: string;
  height?: number;
  dim?: boolean;
}

export function CourtSurface({ left, right, call, height = 122, dim = false }: Props) {
  return (
    <View style={[s.out, dim && s.dim]}>
      <View style={[s.court, { height }]}>
        <Half names={left} />
        <View style={[s.kitchen, s.kitchenL]} />
        <View style={s.netWrap}>
          <View style={s.post} />
          <View style={s.net} />
          <View style={s.post} />
        </View>
        <View style={[s.kitchen, s.kitchenR]} />
        <Half names={right} />
      </View>
      {call ? (
        <View style={s.callChip}>
          <Text style={s.call}>{call}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Half({ names }: { names: string[] }) {
  return (
    <View style={s.half}>
      <View style={s.center} />
      {names.map((n, i) => (
        <Text key={`${n}-${i}`} style={s.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
          {n.toUpperCase()}
        </Text>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  out: { backgroundColor: color.courtOut, paddingVertical: 10, paddingHorizontal: 14 },
  dim: { opacity: 0.4 },
  court: { flexDirection: 'row', alignItems: 'stretch', backgroundColor: color.court, borderWidth: line.court, borderColor: color.paint },
  half: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  center: { position: 'absolute', left: 0, right: 0, top: '50%', height: 2, backgroundColor: color.kitchen },
  name: { fontFamily: font.display, fontSize: size.name, lineHeight: size.name + 4, color: color.paint, letterSpacing: 0.4 },
  kitchen: { width: 24, backgroundColor: color.kitchenFill },
  kitchenL: { borderLeftWidth: 2, borderColor: color.paint },
  kitchenR: { borderRightWidth: 2, borderColor: color.paint },
  netWrap: { width: 6, marginVertical: -16, alignItems: 'center' },
  net: { flex: 1, width: 4, backgroundColor: color.net },
  post: { width: 9, height: 9, borderRadius: 5, backgroundColor: color.net },
  callChip: { position: 'absolute', right: 8, bottom: -12, backgroundColor: color.ball, borderWidth: 2, borderColor: color.ink, paddingHorizontal: 10, paddingVertical: 1 },
  call: { fontFamily: font.displayItalic, fontSize: 20, color: color.ballInk, letterSpacing: 1.5 },
});
