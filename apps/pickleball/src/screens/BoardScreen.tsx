// The board: hold the phone up to the players. Who is on each court, and who goes next, in huge type.
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../i18n/en';
import { gamesToWait, Session } from '../logic/session';
import { Icon } from '../ui/Icon';
import { font, radius, size, space, touch } from '../theme/tokens';
import { themed, useTheme } from '../theme/theme';

export function BoardScreen({ session, onClose }: { session: Session; onClose: () => void }) {
  const s = useS();
  const color = useTheme();
  const insets = useSafeAreaInsets();
  const name = (id: string) => (session.players[id]?.name ?? '?').toUpperCase();
  const next = session.queue.slice(0, 4);
  const later = session.queue.slice(4);
  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.label}>{t.board.next}</Text>
        {next.length === 0 ? <Text style={s.none}>{t.board.nobody}</Text> : null}
        <View style={s.nextBox}>
          {next.map((id, i) => (
            <View key={id} style={s.nextRow}>
              <View style={s.ball}>
                <Text style={s.ballText}>{i + 1}</Text>
              </View>
              <Text style={s.nextName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                {name(id)}
              </Text>
            </View>
          ))}
        </View>
        {later.length ? (
          <>
            <Text style={s.label}>{t.board.after}</Text>
            {later.map((id) => (
              <Text key={id} style={s.later} numberOfLines={1}>
                {name(id)} <Text style={s.laterNote}>· {t.courts.gamesAway(gamesToWait(session, id))}</Text>
              </Text>
            ))}
          </>
        ) : null}
        <Text style={s.label}>{t.board.playing}</Text>
        {session.courts.map((g, i) => (
          <View key={`c${i}`} style={s.courtRow}>
            <Text style={s.courtNum}>{i + 1}</Text>
            <Text style={s.courtNames} numberOfLines={2}>
              {g ? `${g.teamA.map(name).join(' & ')}  v  ${g.teamB.map(name).join(' & ')}` : t.courts.open.toUpperCase()}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Pressable onPress={onClose} style={s.close} accessibilityRole="button" accessibilityLabel={t.board.close}>
        <Text style={s.closeText}>{t.board.close}</Text>
        <Icon name="close" tint={color.text} />
      </Pressable>
    </View>
  );
}

const useS = themed((color) => ({
  root: { flex: 1, backgroundColor: color.bg },
  pad: { padding: space.l },
  label: { fontFamily: font.label, fontSize: 23, letterSpacing: 1, color: color.textSoft, marginTop: space.l, marginBottom: space.s },
  none: { fontFamily: font.body, fontSize: size.body + 2, color: color.text },
  nextBox: { backgroundColor: color.solid, borderRadius: radius.glass, padding: space.l, gap: space.s },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: space.m },
  ball: { width: 52, height: 52, borderRadius: 26, backgroundColor: color.ball, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: color.solidText },
  ballText: { fontFamily: font.figure, fontSize: 21, color: color.ballInk },
  nextName: { flex: 1, fontFamily: font.name, textTransform: 'uppercase', letterSpacing: 3, fontSize: 51, lineHeight: 57, color: color.solidText },
  later: { fontFamily: font.name, textTransform: 'uppercase', letterSpacing: 3, fontSize: 29, lineHeight: 36, color: color.text },
  laterNote: { fontFamily: font.body, fontSize: size.body, color: color.textSoft },
  courtRow: { flexDirection: 'row', alignItems: 'center', gap: space.m, paddingVertical: space.s, borderBottomWidth: 1, borderColor: color.hair },
  courtNum: { width: 48, fontFamily: font.figure, fontSize: 28, color: color.text },
  courtNames: { flex: 1, fontFamily: font.name, textTransform: 'uppercase', letterSpacing: 3, fontSize: 25, lineHeight: 29, color: color.text },
  close: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.s, minHeight: touch.big, margin: space.l, marginTop: 0, backgroundColor: color.cardHi, borderRadius: radius.pill },
  closeText: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: color.text },
}));
