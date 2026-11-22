// The big scorer: the phone lies at the net post or in a hand. Tap the half of the team that won the rally.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from '../i18n/en';
import { isGamePoint, scoreCall, scoreFromRallies, switchEndsAt, Team } from '../logic/scoring';
import { Session } from '../logic/session';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Aura } from '../ui/Glow';
import { dark, font, line, radius, size, space, touch } from '../theme/tokens';

/** The scorer looks the same in dark and light mode: a night court on a black canvas. */
const color = { ...dark, ground: '#FFFFFF', ink: '#FFFFFF' };

interface Props {
  session: Session;
  court: number;
  onRally: (team: Team) => void;
  onUndo: () => void;
  onFirstServe: (team: Team) => void;
  onFinish: (winner: Team) => void;
  onClose: () => void;
}

export function ScorerScreen({ session, court, onRally, onUndo, onFirstServe, onFinish, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const g = session.courts[court];
  if (!g) return null;
  const rules = session.settings.scoring;
  const sc = scoreFromRallies(g.rallies, rules, g.firstServe);
  const names = (team: Team) => (team === 'A' ? g.teamA : g.teamB).map((id) => session.players[id]?.name ?? '?');
  const half = switchEndsAt(rules);
  const prev = g.rallies.length ? scoreFromRallies(g.rallies.slice(0, -1), rules, g.firstServe) : null;
  const justSwitch = prev && Math.max(prev.a, prev.b) < half && Math.max(sc.a, sc.b) === half;
  const fresh = g.rallies.length === 0;

  const side = (team: Team) => {
    const serving = sc.serving === team && !sc.winner;
    const pts = team === 'A' ? sc.a : sc.b;
    return (
      <Pressable
        style={({ pressed }) => [s.half, team === 'A' ? { paddingBottom: KITCHEN } : { paddingTop: KITCHEN }, pressed && !sc.winner && s.pressed, sc.winner && sc.winner !== team && s.lost]}
        onPress={() => onRally(team)}
        disabled={!!sc.winner}
        accessibilityRole="button"
        accessibilityLabel={t.a11y.teamWon(names(team).join(' and '))}
      >
        {/* Court paint: the kitchen sits next to the net (the middle of the screen), the centre line runs to the baseline. */}
        <View pointerEvents="none" style={[s.kitchen, team === 'A' ? { bottom: 0 } : { top: 0 }]} />
        <View pointerEvents="none" style={[s.centerLine, team === 'A' ? { top: 0, bottom: KITCHEN } : { bottom: 0, top: KITCHEN }]} />
        <Text style={s.names} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
          {names(team).join(' & ').toUpperCase()}
        </Text>
        <Text style={s.points} accessibilityLiveRegion="polite">
          {pts}
        </Text>
        <View style={s.status}>
          {serving ? (
            <>
              <Icon name="ball" size={32} />
              <Text style={s.statusText}>{rules.type === 'sideout' && rules.doubles ? t.scorer.server(sc.server) : t.scorer.serving}</Text>
            </>
          ) : fresh ? (
            <Pressable onPress={() => onFirstServe(team)} style={s.serveFirst} accessibilityRole="button">
              <Text style={s.serveFirstText}>{t.scorer.servesFirst}</Text>
            </Pressable>
          ) : null}
          {isGamePoint(sc, team, rules) ? <Text style={s.gp}>{t.scorer.gamePoint.toUpperCase()}</Text> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={s.bar}>
        <Text style={s.barText}>
          {t.scorer.court(court + 1)} · {rules.type === 'rally' ? t.scorer.rally : t.scorer.sideout} · {rules.target}
        </Text>
      </View>
      {side('A')}
      <View style={s.callBand}>
        <Text style={s.call}>{sc.winner ? `${sc.a}–${sc.b}` : scoreCall(sc, rules)}</Text>
        <Text style={s.hint}>{justSwitch ? t.scorer.switchEnds.toUpperCase() : fresh ? t.scorer.tapHint : ''}</Text>
      </View>
      {side('B')}
      <View style={s.bottom}>
        <Pressable onPress={onUndo} disabled={fresh} style={[s.bottomBtn, fresh && { opacity: 0.3 }]} accessibilityRole="button" accessibilityLabel={t.scorer.undo}>
          <Icon name="undo" tint={color.ground} />
          <Text style={s.bottomText}>{t.scorer.undo}</Text>
        </Pressable>
        <Pressable onPress={onClose} style={s.bottomBtn} accessibilityRole="button" accessibilityLabel={t.a11y.close}>
          <Text style={s.bottomText}>{t.scorer.close}</Text>
          <Icon name="close" tint={color.ground} />
        </Pressable>
      </View>
      {sc.winner ? (
        <View style={s.winBox}>
          <Aura size={460} style={s.winLine} />
          <Text style={s.winText}>
            {t.scorer.wins(names(sc.winner).join(' & '), Math.max(sc.a, sc.b), Math.min(sc.a, sc.b))}
          </Text>
          <View style={s.row}>
            <Button label={t.scorer.undo} onPress={onUndo} style={{ flex: 1 }} />
            <Button label={t.scorer.nextGame} kind="go" onPress={() => onFinish(sc.winner!)} style={{ flex: 1.3 }} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const KITCHEN = 64;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  bar: { alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: space.s },
  bottomBtn: { flexDirection: 'row', alignItems: 'center', gap: space.s, minHeight: touch.big, paddingHorizontal: space.l },
  bottomText: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: color.ground },
  barText: { fontFamily: font.label, fontSize: 21, letterSpacing: 0.8, color: color.textSoft, textTransform: 'uppercase' },
  kitchen: { position: 'absolute', left: 0, right: 0, height: KITCHEN, backgroundColor: color.kitchenFill, borderColor: color.paint, borderTopWidth: 2, borderBottomWidth: 2 },
  centerLine: { position: 'absolute', left: '50%', width: 2, marginLeft: -1, backgroundColor: color.kitchen },
  half: { flex: 1, overflow: 'hidden', backgroundColor: color.court, borderWidth: line.court, borderColor: color.paint, marginHorizontal: space.s, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.m },
  pressed: { backgroundColor: color.courtDeep },
  lost: { opacity: 0.45 },
  names: { fontFamily: font.name, textTransform: 'uppercase', fontSize: size.name + 4, color: color.paint, letterSpacing: 0.5, backgroundColor: color.court, paddingHorizontal: space.s },
  points: { fontFamily: font.display, fontSize: size.scoreGiant, lineHeight: size.scoreGiant * 1.02, color: color.paint, includeFontPadding: false },
  status: { flexDirection: 'row', alignItems: 'center', gap: space.s, minHeight: 40, backgroundColor: color.court, paddingHorizontal: space.s },
  statusText: { fontFamily: font.label, fontSize: 24, letterSpacing: 0.8, textTransform: 'uppercase', color: color.paint },
  serveFirst: { backgroundColor: color.solid, paddingHorizontal: space.l, minHeight: 40, justifyContent: 'center', borderRadius: radius.pill },
  serveFirstText: { fontFamily: font.bodyBold, fontSize: size.small, color: color.solidText },
  gp: { fontFamily: font.label, fontSize: size.body + 6, letterSpacing: 0.8, borderRadius: radius.box, color: color.ballInk, backgroundColor: color.ball, paddingHorizontal: space.s, paddingVertical: 2, overflow: 'hidden' },
  callBand: { alignItems: 'center', paddingVertical: space.xs, backgroundColor: color.net, marginHorizontal: 0 },
  call: { fontFamily: font.num, fontSize: size.call, color: color.paint, letterSpacing: 1.5, lineHeight: size.call + 4 },
  hint: { fontFamily: font.body, fontSize: size.small, color: color.mute, minHeight: 18 },
  winBox: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: color.sheet, padding: space.l, paddingTop: space.l + 3, paddingBottom: space.xxl, gap: space.m, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, overflow: 'hidden' },
  winLine: { right: -140, top: -170 },
  winText: { fontFamily: font.heading, fontSize: 17, lineHeight: 22, color: color.ink },
  row: { flexDirection: 'row', gap: space.s },
});
