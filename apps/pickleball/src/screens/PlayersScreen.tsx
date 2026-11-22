import { Pressable, ScrollView, Text, View } from 'react-native';
import { t } from '../i18n/en';
import { checkIn, checkOut, moveUp, Player, removePlayer, Session } from '../logic/session';
import { Label } from '../ui/Bits';
import { Glass } from '../ui/Glass';
import { Header } from '../ui/Header';
import { Icon } from '../ui/Icon';
import { themed, useTheme } from '../theme/theme';
import { font, radius, size, space, TAB_SPACE } from '../theme/tokens';

interface Props {
  session: Session;
  act: (change: (s: Session, now: number) => Session) => void;
}

export function PlayersScreen({ session, act }: Props) {
  const s = useS();
  const all = Object.values(session.players);
  const waiting = session.queue.map((id) => session.players[id]).filter(Boolean);
  const playing = all.filter((p) => p.status === 'playing');
  const resting = all.filter((p) => p.status === 'resting').sort((a, b) => a.name.localeCompare(b.name));
  const courtOf = (id: string) => session.courts.findIndex((g) => g && [...g.teamA, ...g.teamB].includes(id)) + 1;

  return (
    <View style={{ flex: 1 }}>
      <Header title={t.players.title} sub={t.players.sub(all.length)} />
      <ScrollView contentContainerStyle={s.scroll}>
        {all.length === 0 ? <Text style={s.empty}>{t.players.empty}</Text> : null}
        {waiting.length ? <Label style={s.label}>{t.players.waiting}</Label> : null}
        {waiting.length ? (
          <Glass style={s.group}>
            {waiting.map((p, i) => (
              <Row key={p.id} p={p} first={i === 0} meta={`${t.players.inLine(i + 1)} · ${t.players.games(p.games, p.wins)}`}>
                {i > 0 ? (
                  <Pressable onPress={() => act((s2) => moveUp(s2, p.id))} style={s.upBtn} accessibilityRole="button" accessibilityLabel={`${t.players.up}: ${p.name}`}>
                    <Icon name="up" size={18} />
                  </Pressable>
                ) : null}
                <Small label={t.players.sitOut} onPress={() => act((s2) => checkOut(s2, p.id))} />
              </Row>
            ))}
          </Glass>
        ) : null}

        {playing.length ? <Label style={s.label}>{t.players.playing}</Label> : null}
        {playing.length ? (
          <Glass style={s.group}>
            {playing.map((p, i) => (
              <Row key={p.id} p={p} first={i === 0} meta={`${t.players.onCourt(courtOf(p.id))} · ${t.players.games(p.games, p.wins)}`}>
                {p.leaving ? <Small label={t.players.stay} onPress={() => act((s2, now) => checkIn(s2, p.id, now))} /> : <Small label={t.players.leave} onPress={() => act((s2) => checkOut(s2, p.id))} />}
              </Row>
            ))}
          </Glass>
        ) : null}

        <Label style={s.label}>{t.players.resting}</Label>
        {resting.length === 0 ? <Text style={s.help}>{t.players.emptyResting}</Text> : null}
        {resting.length ? (
          <Glass style={s.group}>
            {resting.map((p, i) => (
              <Row key={p.id} p={p} first={i === 0} meta={t.players.games(p.games, p.wins)} faded>
                <Small label={t.players.remove} onPress={() => act((s2) => removePlayer(s2, p.id))} quiet />
                <Small label={t.players.backIn} onPress={() => act((s2, now) => checkIn(s2, p.id, now))} strong />
              </Row>
            ))}
          </Glass>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Row({ p, meta, children, faded, first }: { p: Player; meta: string; children: React.ReactNode; faded?: boolean; first: boolean }) {
  const s = useS();
  return (
    <View style={[s.row, !first && s.rowBorder]}>
      <View style={{ flex: 1 }}>
        <Text style={[s.name, faded && s.faded]} numberOfLines={1}>{p.name.toUpperCase()}</Text>
        <Text style={s.meta} numberOfLines={1}>{meta}</Text>
      </View>
      {children}
    </View>
  );
}

function Small({ label, onPress, strong, quiet }: { label: string; onPress: () => void; strong?: boolean; quiet?: boolean }) {
  const s = useS();
  const c = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [s.small, strong && s.smallStrong, quiet && s.smallQuiet, pressed && { opacity: 0.7 }]}>
      <Text style={[s.smallText, strong && { color: c.accentText }, quiet && { color: c.stop }]}>{label}</Text>
    </Pressable>
  );
}

const useS = themed((c) => ({
  scroll: { paddingHorizontal: space.l, paddingBottom: TAB_SPACE + space.xl },
  label: { marginTop: space.l, marginBottom: space.s, marginLeft: 4 },
  empty: { fontFamily: font.body, fontSize: size.body, color: c.textSoft, marginTop: space.l },
  help: { fontFamily: font.body, fontSize: size.body, lineHeight: 22, color: c.mute, marginLeft: 4 },
  group: { paddingHorizontal: space.l },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s, minHeight: 66, paddingVertical: space.s },
  rowBorder: { borderTopWidth: 1, borderColor: c.hair },
  name: { fontFamily: font.name, textTransform: 'uppercase', fontSize: size.name, color: c.text },
  faded: { color: c.mute },
  meta: { fontFamily: font.body, fontSize: 13, color: c.mute },
  upBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: c.hair },
  small: { minHeight: 44, paddingHorizontal: space.m + 2, borderRadius: radius.pill, borderWidth: 1.5, borderColor: c.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(11,13,18,0.3)', justifyContent: 'center' },
  smallStrong: { backgroundColor: c.accent, borderColor: c.accent },
  smallQuiet: { borderColor: 'transparent' },
  smallText: { fontFamily: font.bodyBold, fontSize: size.small, color: c.text },
}));
