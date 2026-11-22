// History and numbers. Today's session as a post on top (photo, place, numbers, badges), then the numbers
// for today / this week / all time, then older sessions as a feed of posts. Any post can be shared.
import { ComponentRef, useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { t } from '../i18n/en';
import type { AwardId, AwardState } from '../logic/achievements';
import { clock, duration, GameRecord, gamesIn, Range, SessionRecord, startOfDay, stats } from '../logic/history';
import { forget, pickPhoto, PhotoSource } from '../state/photos';
import { MAX_PLACE, PostMeta } from '../state/storage';
import { useNow } from '../state/useNow';
import { Button } from '../ui/Button';
import { Label, Section, Segments, Stat } from '../ui/Bits';
import { Glass } from '../ui/Glass';
import { Header } from '../ui/Header';
import { Icon } from '../ui/Icon';
import { PostCard } from '../ui/PostCard';
import { shareCardImage } from '../ui/ShareCard';
import { ThemeProvider, themed, useTheme } from '../theme/theme';
import { dark, font, radius, size, space, TAB_SPACE } from '../theme/tokens';

interface Props {
  sessions: SessionRecord[];
  awards: Record<AwardId, AwardState>;
  meta: Record<string, PostMeta>;
  places: string[];
  setPlace: (sessionId: string, place: string) => void;
  setPhoto: (sessionId: string, uri: string | undefined) => void;
}

/** Awards first earned during this session. */
export function sessionAwards(awards: Record<AwardId, AwardState>, r: SessionRecord): AwardId[] {
  return (Object.keys(awards) as AwardId[]).filter((id) => {
    const at = awards[id].at;
    return awards[id].earned && at !== null && at >= r.startedAt && at <= r.endedAt + 60000;
  });
}

export function HistoryScreen({ sessions, awards, meta, places, setPlace, setPhoto }: Props) {
  const s = useS();
  const c = useTheme();
  const now = useNow(30000);
  const [range, setRange] = useState<Range>('today');
  const [note, setNote] = useState<string | null>(null);
  const [photoFor, setPhotoFor] = useState<string | null>(null);
  const [placeFor, setPlaceFor] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const cardRef = useRef<ComponentRef<typeof View>>(null);

  const games = gamesIn(sessions, range, now);
  const st = stats(games);
  const longest = st.minutes.length ? Math.max(...st.minutes) : 0;
  const withGames = [...sessions].filter((x) => x.games.length).reverse();
  const todays = withGames.find((x) => x.startedAt >= startOfDay(now)) ?? null;
  const older = withGames.filter((x) => x !== todays).slice(0, 12);
  const shareRecord = shareId ? withGames.find((x) => x.id === shareId) ?? null : null;

  // Sharing: the post is drawn off-screen in the dark look, then turned into a picture.
  useEffect(() => {
    if (!shareId) return;
    const id = setTimeout(() => {
      shareCardImage(cardRef)
        .then(() => setNote(null))
        .catch((e) => {
          console.warn(`[share] ${String(e)}`);
          setNote(Platform.OS === 'web' ? t.history.shareWeb : t.history.shareFailed);
        })
        .finally(() => setShareId(null));
    }, 250);
    return () => clearTimeout(id);
  }, [shareId]);

  const choose = async (source: PhotoSource) => {
    const id = photoFor;
    setPhotoFor(null);
    if (!id) return;
    const res = await pickPhoto(source, id);
    if ('uri' in res) {
      forget(meta[id]?.photo);
      setPhoto(id, res.uri);
    } else if (res.error === 'denied') setNote(t.posts.cameraDenied);
    else if (res.error === 'failed') setNote(t.posts.photoFailed);
  };

  const post = (r: SessionRecord) => (
    <PostCard
      key={r.id}
      record={r}
      meta={meta[r.id]}
      awards={sessionAwards(awards, r)}
      onPhoto={() => setPhotoFor(r.id)}
      onPlace={() => setPlaceFor(r.id)}
      onShare={() => {
        setNote(t.history.sharing);
        setShareId(r.id);
      }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title={t.history.title} sub={t.history.sub(withGames.length)} />
      <ScrollView contentContainerStyle={s.scroll}>
        {note ? <Text style={s.note}>{note}</Text> : null}
        {todays ? <View style={s.mx}>{post(todays)}</View> : null}

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
                  <Label style={{ color: c.highlight }}>{t.history.longestMin(longest)}</Label>
                </View>
                <Bars minutes={st.minutes.slice(-24)} />
              </View>
            </Glass>

            <Section title={t.history.top} />
            <Glass style={s.mx}>
              <View style={s.listPad}>
                {st.table.slice(0, 5).map((p, i) => (
                  <View key={p.name} style={[s.line, i > 0 && s.lineBorder]}>
                    <Text style={[s.rank, i === 0 && { color: c.highlight }]}>{i + 1}</Text>
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

        {older.length ? (
          <>
            <Section title={t.posts.feed} />
            <View style={s.mx}>{older.map(post)}</View>
          </>
        ) : null}

        <View style={s.offscreen} pointerEvents="none">
          {shareRecord ? (
            <ThemeProvider palette={dark}>
              <View ref={cardRef} collapsable={false}>
                <PostCard record={shareRecord} meta={meta[shareRecord.id]} awards={sessionAwards(awards, shareRecord)} forShare />
              </View>
            </ThemeProvider>
          ) : null}
        </View>
      </ScrollView>

      <Modal visible={photoFor !== null} transparent animationType="slide" onRequestClose={() => setPhotoFor(null)}>
        <Pressable style={s.scrimBottom} onPress={() => setPhotoFor(null)}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>{t.posts.photoTitle}</Text>
            <Button label={t.posts.takePhoto} kind="go" onPress={() => choose('camera')} />
            <Button label={t.posts.fromGallery} onPress={() => choose('library')} />
            {photoFor && meta[photoFor]?.photo ? (
              <Button
                label={t.posts.removePhoto}
                kind="quiet"
                onPress={() => {
                  forget(meta[photoFor]?.photo);
                  setPhoto(photoFor, undefined);
                  setPhotoFor(null);
                }}
              />
            ) : null}
            <Text style={s.help}>{t.posts.photoPrivate}</Text>
          </View>
        </Pressable>
      </Modal>

      <PlaceSheet
        visible={placeFor !== null}
        initial={placeFor ? meta[placeFor]?.place ?? '' : ''}
        places={places}
        onClose={() => setPlaceFor(null)}
        onSave={(p) => {
          if (placeFor) setPlace(placeFor, p);
          setPlaceFor(null);
        }}
      />
    </View>
  );
}

function PlaceSheet({ visible, initial, places, onClose, onSave }: { visible: boolean; initial: string; places: string[]; onClose: () => void; onSave: (p: string) => void }) {
  const s = useS();
  const c = useTheme();
  const [text, setText] = useState(initial);
  useEffect(() => setText(initial), [initial, visible]);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.scrimBottom}>
        <View style={s.sheet}>
          <Text style={s.sheetTitle}>{t.posts.placeTitle}</Text>
          <TextInput value={text} onChangeText={setText} placeholder={t.posts.placeHint} placeholderTextColor={c.mute} style={s.input} autoFocus maxLength={MAX_PLACE} autoCapitalize="words" returnKeyType="done" onSubmitEditing={() => onSave(text)} accessibilityLabel={t.posts.placeTitle} />
          {places.length ? (
            <View style={s.places}>
              {places.map((p) => (
                <Pressable key={p} onPress={() => onSave(p)} style={s.placeChip} accessibilityRole="button">
                  <Icon name="pin" size={14} />
                  <Text style={s.placeChipText}>{p}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', gap: space.s, marginTop: space.s }}>
            <Button label={t.awards.cancel} onPress={onClose} style={{ flex: 1 }} />
            <Button label={t.posts.save} kind="go" onPress={() => onSave(text)} style={{ flex: 1.4 }} />
          </View>
        </View>
      </View>
    </Modal>
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
        return <Rect key={i} x={`${i * w + w * 0.28}%`} y={h - bh} width={`${w * 0.44}%`} height={bh} rx={6} fill={i === top ? c.accent : c.hairHex} fillOpacity={i === top ? 1 : c.mode === 'dark' ? 0.55 : 0.45} />;
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
  note: { fontFamily: font.bodyBold, fontSize: size.small, color: c.textSoft, textAlign: 'center', marginBottom: space.s, paddingHorizontal: space.l },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.m - 2, paddingHorizontal: space.l, marginTop: space.m },
  tile: { width: '48.3%' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  line: { flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: 60, paddingVertical: space.s },
  lineBorder: { borderTopWidth: 1, borderColor: c.hair },
  rank: { width: 24, fontFamily: font.displayItalic, fontSize: 24, color: c.mute },
  lineName: { flex: 1, fontFamily: font.display, fontSize: size.nameSmall, color: c.text },
  lineMeta: { fontFamily: font.body, fontSize: 13, color: c.mute, marginTop: 1 },
  lineScore: { fontFamily: font.displayItalic, fontSize: 28, color: c.text },
  record: { fontFamily: font.displayItalic, fontSize: 22, color: c.text },
  empty: { marginTop: space.m, padding: space.xl, alignItems: 'center', gap: space.s },
  emptyTitle: { fontFamily: font.displayItalic, fontSize: 26, color: c.text },
  emptyBody: { fontFamily: font.body, fontSize: size.body, lineHeight: 22, color: c.textSoft, textAlign: 'center' },
  offscreen: { position: 'absolute', left: -2000, top: 0, width: 360 },
  scrimBottom: { flex: 1, backgroundColor: c.scrim, justifyContent: 'flex-end' },
  sheet: { backgroundColor: c.sheet, padding: space.l, paddingBottom: space.xxl + space.l, borderTopLeftRadius: 28, borderTopRightRadius: 28, gap: space.s },
  sheetTitle: { fontFamily: font.displayItalic, fontSize: size.title, color: c.text, marginBottom: space.xs },
  help: { fontFamily: font.body, fontSize: size.small, color: c.mute, textAlign: 'center', marginTop: space.xs },
  input: { minHeight: 56, borderRadius: radius.chip, borderWidth: 1.5, borderColor: c.hair, paddingHorizontal: space.l, fontFamily: font.bodyBold, fontSize: size.body + 2, color: c.text },
  places: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  placeChip: { flexDirection: 'row', alignItems: 'center', gap: 5, minHeight: 44, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: c.hair },
  placeChipText: { fontFamily: font.bodyBold, fontSize: size.small, color: c.text },
}));
