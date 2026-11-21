// The board: hold the phone up to the players. Who is on each court, and who goes next, in huge type.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../i18n/en';
import { gamesToWait, Session } from '../logic/session';
import { Icon } from '../ui/Icon';
import { color, font, radius, size, space, touch } from '../theme/tokens';

export function BoardScreen({ session, onClose }: { session: Session; onClose: () => void }) {
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
        <Icon name="close" tint={color.ink} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.ground },
  pad: { padding: space.l },
  label: { fontFamily: font.label, fontSize: 18, letterSpacing: 2, color: color.inkSoft, marginTop: space.l, marginBottom: space.s },
  none: { fontFamily: font.body, fontSize: size.body + 2, color: color.ink },
  nextBox: { backgroundColor: color.court, borderWidth: 3, borderColor: color.paint, padding: space.m, gap: space.s },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: space.m },
  ball: { width: 52, height: 52, borderRadius: 26, backgroundColor: color.ball, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: color.ink },
  ballText: { fontFamily: font.display, fontSize: 30, color: color.ballInk },
  nextName: { flex: 1, fontFamily: font.display, fontSize: 50, lineHeight: 56, color: color.paint },
  later: { fontFamily: font.display, fontSize: 28, lineHeight: 36, color: color.ink },
  laterNote: { fontFamily: font.body, fontSize: size.body, color: color.inkSoft },
  courtRow: { flexDirection: 'row', alignItems: 'center', gap: space.m, paddingVertical: space.s, borderBottomWidth: 2, borderColor: color.hair },
  courtNum: { width: 40, fontFamily: font.display, fontSize: 40, color: color.court },
  courtNames: { flex: 1, fontFamily: font.display, fontSize: 24, lineHeight: 28, color: color.ink },
  close: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.s, minHeight: touch.big, margin: space.l, marginTop: 0, borderWidth: 2, borderColor: color.ink, borderRadius: radius.box },
  closeText: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: color.ink },
});
