// A place in the line, drawn as a paddle lying in the rack: the face with the number and name, then the
// taped handle. The next four are yellow paddles.
import { Text, View } from 'react-native';
import { themed } from '../theme/theme';
import { font, size, space } from '../theme/tokens';
import { Glass } from './Glass';

export function LineTag({ pos, name, note, strong }: { pos: number; name: string; note: string; strong?: boolean }) {
  const s = useS();
  const inner = (
    <>
      <Text style={[s.num, strong && s.inkText]}>{pos}</Text>
      <Text style={[s.name, strong && s.inkText]} numberOfLines={1}>{name.toUpperCase()}</Text>
      <Text style={[s.note, strong && s.inkNote]} numberOfLines={1}>{note}</Text>
    </>
  );
  return (
    <View style={s.row}>
      {strong ? <View style={[s.face, s.faceStrong]}>{inner}</View> : <Glass radius={26} style={s.face}>{inner}</Glass>}
      <View style={s.throat} />
      <View style={s.handle}>
        <View style={s.wrap} />
        <View style={s.wrap} />
        <View style={s.wrap} />
      </View>
    </View>
  );
}

const useS = themed((c) => ({
  row: { flexDirection: 'row', alignItems: 'center' },
  face: { flex: 1, flexDirection: 'row', alignItems: 'center', minHeight: 56, borderTopLeftRadius: 28, borderBottomLeftRadius: 28, borderTopRightRadius: 16, borderBottomRightRadius: 16, paddingHorizontal: space.l },
  faceStrong: { backgroundColor: c.accent, borderWidth: c.mode === 'light' ? 1.5 : 0, borderColor: c.accentLine },
  num: { width: 30, fontFamily: font.displayItalic, fontSize: 28, color: c.mode === 'dark' ? c.accent : c.court },
  inkText: { color: c.accentText },
  name: { flex: 1, fontFamily: font.display, fontSize: size.name - 1, color: c.text, letterSpacing: 0.3 },
  note: { fontFamily: font.body, fontSize: size.small, color: c.mute, marginLeft: space.s },
  inkNote: { color: '#2B3038' },
  throat: { width: 8, height: 14, backgroundColor: c.mode === 'dark' ? '#2A2F3A' : '#0B0D12' },
  handle: { width: 34, height: 22, backgroundColor: c.mode === 'dark' ? '#2A2F3A' : '#0B0D12', borderTopRightRadius: 7, borderBottomRightRadius: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 3 },
  wrap: { width: 2, height: 16, backgroundColor: c.mode === 'dark' ? '#4A5160' : '#3B3E44', transform: [{ rotate: '20deg' }] },
}));
