// A place in the line, drawn as a paddle lying in the rack: the face with the number and name,
// then the gripped handle. The next four are yellow paddles.
import { StyleSheet, Text, View } from 'react-native';
import { color, font, size, space } from '../theme/tokens';

export function LineTag({ pos, name, note, strong }: { pos: number; name: string; note: string; strong?: boolean }) {
  return (
    <View style={s.row}>
      <View style={[s.face, strong && s.faceStrong]}>
        <Text style={[s.num, strong && s.numStrong]}>{pos}</Text>
        <Text style={s.name} numberOfLines={1}>
          {name.toUpperCase()}
        </Text>
        <Text style={s.note} numberOfLines={1}>
          {note}
        </Text>
      </View>
      <View style={s.throat} />
      <View style={s.handle}>
        <View style={s.wrap} />
        <View style={s.wrap} />
        <View style={s.wrap} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  face: { flex: 1, flexDirection: 'row', alignItems: 'center', minHeight: 56, backgroundColor: color.card, borderWidth: 2, borderColor: color.ink, borderTopLeftRadius: 28, borderBottomLeftRadius: 28, borderTopRightRadius: 14, borderBottomRightRadius: 14, paddingLeft: space.m, paddingRight: space.m },
  faceStrong: { backgroundColor: color.ball },
  num: { width: 30, fontFamily: font.displayItalic, fontSize: 30, color: color.court },
  numStrong: { color: color.ballInk },
  name: { flex: 1, fontFamily: font.display, fontSize: size.name, color: color.ink },
  note: { fontFamily: font.body, fontSize: size.body - 1, color: color.inkSoft, marginLeft: space.s },
  throat: { width: 8, height: 14, backgroundColor: color.ink },
  handle: { width: 34, height: 22, backgroundColor: color.ink, borderTopRightRadius: 6, borderBottomRightRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 3 },
  wrap: { width: 2, height: 16, backgroundColor: color.inkSoft, transform: [{ rotate: '20deg' }] },
});
