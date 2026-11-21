import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { t } from '../i18n/en';
import { checkIn, checkOut, moveUp, Player, removePlayer, Session } from '../logic/session';
import { Icon } from '../ui/Icon';
import { Header } from '../ui/Header';
import { color, font, radius, size, space } from '../theme/tokens';

interface Props {
  session: Session;
  act: (change: (s: Session, now: number) => Session) => void;
}

export function PlayersScreen({ session, act }: Props) {
  const all = Object.values(session.players);
  const waiting = session.queue.map((id) => session.players[id]).filter(Boolean);
  const playing = all.filter((p) => p.status === 'playing');
  const resting = all.filter((p) => p.status === 'resting').sort((a, b) => a.name.localeCompare(b.name));
  const courtOf = (id: string) => session.courts.findIndex((g) => g && [...g.teamA, ...g.teamB].includes(id)) + 1;

  return (
    <View style={s.root}>
      <Header title={t.players.title} />
      <ScrollView style={s.root} contentContainerStyle={s.pad}>
      {all.length === 0 ? <Text style={s.empty}>{t.players.empty}</Text> : null}

      {waiting.length ? <Text style={s.label}>{t.players.waiting}</Text> : null}
      {waiting.map((p, i) => (
        <Row key={p.id} p={p} meta={`${t.players.inLine(i + 1)} · ${t.players.games(p.games, p.wins)}`}>
          {i > 0 ? (
            <Pressable onPress={() => act((s2) => moveUp(s2, p.id))} style={s.upBtn} accessibilityRole="button" accessibilityLabel={`${t.players.up}: ${p.name}`}>
              <Icon name="up" size={20} />
              <Text style={s.upText}>{t.players.up}</Text>
            </Pressable>
          ) : null}
          <Small label={t.players.sitOut} onPress={() => act((s2) => checkOut(s2, p.id))} />
        </Row>
      ))}

      {playing.length ? <Text style={s.label}>{t.players.playing}</Text> : null}
      {playing.map((p) => (
        <Row key={p.id} p={p} meta={`${t.players.onCourt(courtOf(p.id))} · ${t.players.games(p.games, p.wins)}`}>
          {p.leaving ? (
            <Small label={t.players.stay} onPress={() => act((s2, now) => checkIn(s2, p.id, now))} />
          ) : (
            <Small label={t.players.leave} onPress={() => act((s2) => checkOut(s2, p.id))} />
          )}
        </Row>
      ))}

      <Text style={s.label}>{t.players.resting}</Text>
      {resting.length === 0 ? <Text style={s.help}>{t.players.emptyResting}</Text> : null}
      {resting.map((p) => (
        <Row key={p.id} p={p} meta={t.players.games(p.games, p.wins)} faded>
          <Small label={t.players.remove} onPress={() => act((s2) => removePlayer(s2, p.id))} quiet />
          <Small label={t.players.backIn} onPress={() => act((s2, now) => checkIn(s2, p.id, now))} strong />
        </Row>
      ))}
      <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function Row({ p, meta, children, faded }: { p: Player; meta: string; children: React.ReactNode; faded?: boolean }) {
  return (
    <View style={s.row}>
      <View style={{ flex: 1 }}>
        <Text style={[s.name, faded && { color: color.mute }]} numberOfLines={1}>
          {p.name.toUpperCase()}
        </Text>
        <Text style={s.meta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
      {children}
    </View>
  );
}

function Small({ label, onPress, strong, quiet }: { label: string; onPress: () => void; strong?: boolean; quiet?: boolean }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.small, strong && s.smallStrong, quiet && s.smallQuiet, pressed && { opacity: 0.7 }]}>
      <Text style={[s.smallText, quiet && { color: color.stop }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.ground },
  pad: { paddingHorizontal: space.l, paddingTop: space.xs },
  title: { fontFamily: font.display, fontSize: size.hero, color: color.ink, marginBottom: space.s },
  label: { fontFamily: font.label, fontSize: size.label, letterSpacing: 1.5, color: color.inkSoft, marginTop: space.l, marginBottom: space.s },
  empty: { fontFamily: font.body, fontSize: size.body, color: color.inkSoft, marginTop: space.l },
  help: { fontFamily: font.body, fontSize: size.body, lineHeight: 22, color: color.inkSoft },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s, backgroundColor: color.card, borderRadius: radius.box, paddingLeft: space.m, paddingRight: space.s, paddingVertical: space.s, marginBottom: 6 },
  name: { fontFamily: font.display, fontSize: size.nameSmall + 1, color: color.ink },
  meta: { fontFamily: font.body, fontSize: size.small + 1, color: color.inkSoft },
  upBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 48, paddingHorizontal: space.xs },
  upText: { fontFamily: font.bodyBold, fontSize: size.small, color: color.ink },
  small: { minHeight: 48, paddingHorizontal: space.m, borderRadius: radius.box, borderWidth: 2, borderColor: color.ink, justifyContent: 'center' },
  smallStrong: { backgroundColor: color.ball, borderColor: color.ball },
  smallQuiet: { borderColor: 'transparent' },
  smallText: { fontFamily: font.bodyBold, fontSize: size.small, color: color.ink },
});
