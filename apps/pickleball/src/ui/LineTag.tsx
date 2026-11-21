// A place in the line: the yellow ball number, the name, and why they are where they are.
import { StyleSheet, Text, View } from 'react-native';
import { color, font, radius, size, space } from '../theme/tokens';

export function LineTag({ pos, name, note, strong }: { pos: number; name: string; note: string; strong?: boolean }) {
  return (
    <View style={[s.tag, strong && s.strong]}>
      <View style={s.num}>
        <Text style={s.numText}>{pos}</Text>
      </View>
      <Text style={s.name} numberOfLines={1}>
        {name.toUpperCase()}
      </Text>
      <Text style={s.note} numberOfLines={1}>
        {note}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  tag: { flexDirection: 'row', alignItems: 'center', minHeight: 56, backgroundColor: color.card, borderTopLeftRadius: radius.tag, borderBottomLeftRadius: radius.tag, borderTopRightRadius: radius.box, borderBottomRightRadius: radius.box, paddingLeft: 7, paddingRight: space.l },
  strong: { borderWidth: 2, borderColor: color.ink },
  num: { width: 36, height: 36, borderRadius: 18, backgroundColor: color.ball, alignItems: 'center', justifyContent: 'center', marginRight: space.m },
  numText: { fontFamily: font.display, fontSize: 19, color: color.ballInk },
  name: { flex: 1, fontFamily: font.display, fontSize: size.name, color: color.ink },
  note: { fontFamily: font.body, fontSize: size.body - 1, color: color.inkSoft, marginLeft: space.s },
});
