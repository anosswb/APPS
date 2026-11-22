// History and numbers: today, this week or all time. Game lengths, the longest game, players, the top
// players, every finished game, past sessions, and a card to share with the group chat.
import { ComponentRef, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { t } from '../i18n/en';
import { clock, duration, GameRecord, gamesIn, Range, SessionRecord, stats } from '../logic/history';
import { useNow } from '../state/useNow';
import { Chip, Label, Section, Segments, Stat } from '../ui/Bits';
import { Glass } from '../ui/Glass';
import { Header } from '../ui/Header';
import { Icon } from '../ui/Icon';
import { ShareCard, shareCardImage } from '../ui/ShareCard';
import { themed, useTheme } from '../theme/theme';
import { font, size, space, TAB_SPACE } from '../theme/tokens';
import type { AwardId } from '../logic/achievements';

export function HistoryScreen({ sessions, earnedToday }: { sessions: SessionRecord[]; earnedToday: AwardId[] }) {
  const s = useS();
  const c = useTheme();
  const now = useNow(30000);
  const [range, setRange] = useState<Range>('today');
  const [sharing, setSharing] = useState<string | null>(null);
  const cardRef = useRef<ComponentRef<typeof View>>(null);
  const games = gamesIn(sessions, range, now);
  const st = stats(games);
  const longest = st.minutes.length ? Math.max(...st.minutes) : 0;
  const today = stats(gamesIn(sessions, 'today', now));
  const past = [...sessions].filter((x) => x.games.length).reverse();

  const share = async () => {
    setSharing(t.history.sharing);
    try {
      await shareCardImage(cardRef);
      setSharing(null);
    } catch (e) {
      console.warn(`[share] ${String(e)}`);
      setSharing(t.history.shareFailed);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={t.history.title} sub={t.history.sub(past.length)} />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.px}>
          <Segments<Range> items={[['today', t.history.today], ['week', t.history.week], ['all', t.history.all]]} value={range} onChange={setRange} />
        </View>
        {st.games === 0 ? (
          <Glass style={[s.mx, s.empty]}>
            <Icon name="chart" size={30} tint={c.mute} />
            <Text style={s.emptyTitle}>{t.history.emptyTitle}</Text>
            <Text style={s.emptyBody}>{t.history.emptyBody}</Text>
          </Glass>
        ) : (
          <>
            <View style={s.grid}>
              <Stat value={String(st.games)} label={t.history.games} solid style={s.tile} />
              <Stat value={clock(st.avgMs)} label={t.history.avg} style={s.tile} />
              <Stat value={clock(st.longestMs)} label={t.history.longest} style={s.tile} />
              <Stat value={String(st.players)} label={t.history.players} style={s.tile} />
            </View>

            <Glass style={[s.mx, { marginTop: space.m }]}>
              <View style={s.pad}>
                <View style={s.rowBetween}>
                  <Label>{t.history.chart}</Label>
                  <Label style={{ color: c.mode === 'dark' ? c.accent : c.court }}>{t.history.longestMin(longest)}</Label>
                </View>
                <Bars minutes={st.minutes.slice(-24)} />
              </View>
            </Glass>

            <Section title={t.history.top} />
            <Glass style={s.mx}>
              <View style={s.listPad}>
                {st.table.slice(0, 5).map((p, i) => (
                  <View key={p.name} style={[s.line, i > 0 && s.lineBorder]}>
                    <Text style={[s.rank, i === 0 && { color: c.mode === 'dark' ? c.accent : c.court }]}>{i + 1}</Text>
                    <Text style={s.lineName} numberOfLines={1}>{p.name.toUpperCase()}</Text>
                    <Text style={s.record}>{t.history.record(p.wins, p.games - p.wins)}</Text>
                  </View>
                ))}
              </View>
            </Glass>

            <Section title={t.history.gamesList} />
            <Glass style={s.mx}>
              <View style={s.listPad}>
                {[...games].reverse().slice(0, 30).map((g, i) => (
                  <GameLine key={`${g.endedAt}-${i}`} g={g} first={i === 0} />
                ))}
              </View>
            </Glass>
          </>
        )}

        {past.length > 1 || (past.length === 1 && range !== 'today') ? (
          <>
            <Section title={t.history.sessions} />
            <Glass style={s.mx}>
              <View style={s.listPad}>
                {past.slice(0, 20).map((x, i) => {
                  const sx = stats(x.games);
                  return (
                    <View key={x.id} style={[s.line, i > 0 && s.lineBorder]}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.lineName}>{t.history.day(x.startedAt)}</Text>
                        <Text style={s.lineMeta}>{t.history.sessionLine(sx.games, x.players.length, clock(sx.longestMs))}</Text>
                      </View>
                      <Icon name="chevron" size={18} tint={c.mute} />
                    </View>
                  );
                })}
              </View>
            </Glass>
          </>
        ) : null}

        {today.games > 0 ? (
          <View style={[s.mx, { marginTop: space.xl }]}>
            <Chip onPress={share} a11y={t.history.share} style={s.shareChip}>
              <Icon name="share" size={20} />
              <Text style={s.shareText}>{t.history.share}</Text>
            </Chip>
            {sharing ? <Text style={s.shareNote}>{sharing}</Text> : null}
            {Platform.OS === 'web' ? <Text style={s.shareNote}>{t.history.shareWeb}</Text> : null}
          </View>
        ) : null}
        {/* The card that is turned into a picture. It sits off-screen. */}
        <View style={s.offscreen} pointerEvents="none">
          <View ref={cardRef} collapsable={false}>
            <ShareCard stats={today} awards={earnedToday} when={now} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Bars({ minutes }: { minutes: number[] }) {
  const c = useTheme();
  const max = Math.max(1, ...minutes);
  const top = minutes.indexOf(max);
  const h = 120;
  const n = Math.max(minutes.length, 8);
  return (
    <Svg width="100%" height={h} style={{ marginTop: space.m }}>
      {minutes.map((m, i) => {
        const bh = Math.max(6, (m / max) * (h - 8));
        const w = 100 / n;
        return (
          <Rect key={i} x={`${i * w + w * 0.28}%`} y={h - bh} width={`${w * 0.44}%`} height={bh} rx={6} fill={i === top ? c.accent : c.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(11,13,18,0.55)'} />
        );
      })}
    </Svg>
  );
}

function GameLine({ g, first }: { g: GameRecord; first: boolean }) {
  const s = useS();
  const scored = g.score[0] + g.score[1] > 0;
  return (
    <View style={[s.line, !first && s.lineBorder]}>
      <View style={{ flex: 1 }}>
        <Text style={s.lineName} numberOfLines={1}>{g.winners.join(' & ').toUpperCase()}</Text>
        <Text style={s.lineMeta} numberOfLines={1}>{t.history.gameMeta(g.court + 1, Math.round(duration(g) / 60000), g.endedAt, g.losers.join(' & '))}</Text>
      </View>
      <Text style={s.lineScore}>{scored ? `${g.score[0]}–${g.score[1]}` : t.history.won}</Text>
    </View>
  );
}

const useS = themed((c) => ({
  scroll: { paddingBottom: TAB_SPACE + space.xl },
  px: { paddingHorizontal: space.l },
  mx: { marginHorizontal: space.l },
  pad: { padding: space.l },
  listPad: { paddingHorizontal: space.l, paddingVertical: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.m - 2, paddingHorizontal: space.l, marginTop: space.m },
  tile: { width: '48.3%' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  line: { flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: 60, paddingVertical: space.s },
  lineBorder: { borderTopWidth: 1, borderColor: c.hair },
  rank: { width: 24, fontFamily: font.displayItalic, fontSize: 24, color: c.mute },
  lineName: { flex: 1, fontFamily: font.display, fontSize: size.nameSmall, color: c.text },
  lineMeta: { fontFamily: font.body, fontSize: 13, color: c.mute, marginTop: 1 },
  record: { fontFamily: font.displayItalic, fontSize: 22, color: c.text },
  lineScore: { fontFamily: font.displayItalic, fontSize: 28, color: c.text },
  empty: { marginTop: space.m, padding: space.xl, alignItems: 'center', gap: space.s },
  emptyTitle: { fontFamily: font.displayItalic, fontSize: 26, color: c.text },
  emptyBody: { fontFamily: font.body, fontSize: size.body, lineHeight: 22, color: c.textSoft, textAlign: 'center' },
  shareChip: { justifyContent: 'center', minHeight: 56 },
  shareText: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: c.text },
  shareNote: { fontFamily: font.body, fontSize: size.small, color: c.mute, textAlign: 'center', marginTop: space.s },
  offscreen: { position: 'absolute', left: -2000, top: 0, width: 360 },
}));
