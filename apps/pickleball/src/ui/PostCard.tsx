// A session as a post, like a run on a running app: the photo (or the painted court), the day and the
// place, the numbers of the session, the top player and the badges won. The same card is shared as a picture.
import { Image, Pressable, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { t } from '../i18n/en';
import type { AwardId } from '../logic/achievements';
import { clock, SessionRecord, stats } from '../logic/history';
import type { PostMeta } from '../state/storage';
import { themed, useTheme } from '../theme/theme';
import { font, radius, size, space } from '../theme/tokens';
import { BADGES } from './badges';
import { CourtSurface } from './CourtSurface';
import { Glass } from './Glass';
import { Icon } from './Icon';

interface Props {
  record: SessionRecord;
  meta: PostMeta | undefined;
  awards: AwardId[];
  /** The picture version: fixed width, no buttons. */
  forShare?: boolean;
  onPhoto?: () => void;
  onPlace?: () => void;
  onShare?: () => void;
}

export function PostCard({ record, meta, awards, forShare, onPhoto, onPlace, onShare }: Props) {
  const s = useS();
  const c = useTheme();
  const st = stats(record.games);
  const top = st.table[0];
  const photo = meta?.photo;
  const body = (
    <>
      <View style={[s.media, forShare && s.mediaShare]}>
        {photo ? (
          <Image source={{ uri: photo }} style={s.photo} resizeMode="cover" accessibilityIgnoresInvertColors />
        ) : (
          <View style={s.art}>
            <View style={{ width: '100%', paddingHorizontal: space.l }}>
              <CourtSurface left={top ? [top.name] : ['']} right={[t.posts.wins(top?.wins ?? 0)]} height={86} />
            </View>
            {!forShare ? (
              <View style={s.mediaButtons}>
                <Pressable onPress={onPhoto} style={s.mediaBtn} accessibilityRole="button" accessibilityLabel={t.posts.addPhoto}>
                  <Icon name="camera" size={18} tint="#FFFFFF" />
                  <Text style={s.mediaBtnText}>{t.posts.addPhoto}</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        )}
        <Svg style={s.fade} width="100%" height="100%" pointerEvents="none">
          <Defs>
            <LinearGradient id={`fade-${record.id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0.45" stopColor="#000000" stopOpacity={0} />
              <Stop offset="1" stopColor="#000000" stopOpacity={0.78} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#fade-${record.id})`} />
        </Svg>
        <View style={s.caption} pointerEvents="none">
          <Text style={s.kicker}>{t.posts.when(record.startedAt).toUpperCase()}</Text>
          <Text style={s.title} numberOfLines={1}>{t.posts.title(record.startedAt)}</Text>
          {meta?.place ? (
            <View style={s.placeRow}>
              <Icon name="pin" size={15} tint="#FFFFFF" />
              <Text style={s.place} numberOfLines={1}>{meta.place}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={s.statsRow}>
        <Cell v={String(st.games)} l={t.history.games} />
        <View style={s.vr} />
        <Cell v={clock(st.longestMs)} l={t.history.longest} />
        <View style={s.vr} />
        <Cell v={String(record.players.length)} l={t.history.players} />
      </View>
      {top ? (
        <View style={s.topRow}>
          <Text style={s.topLabel}>{t.posts.top}</Text>
          <Text style={s.topName} numberOfLines={1}>{top.name.toUpperCase()}</Text>
          <Text style={s.topMeta}>{t.history.record(top.wins, top.games - top.wins)}</Text>
        </View>
      ) : null}
      {awards.length ? (
        <View style={s.badges}>
          {awards.slice(0, 6).map((id) => (
            <View key={id} style={s.badgeCase}>
              <Image source={BADGES[id]} style={s.badge} resizeMode="contain" accessibilityLabel={t.awards.name[id]} />
            </View>
          ))}
          {awards.length > 6 ? <Text style={s.more}>+{awards.length - 6}</Text> : null}
        </View>
      ) : null}

      {forShare ? (
        <Text style={s.foot}>{t.share.foot}</Text>
      ) : (
        <View style={s.actions}>
          <Action icon={photo ? 'image' : 'camera'} label={photo ? t.posts.changePhoto : t.posts.addPhoto} onPress={onPhoto} />
          <Action icon="pin" label={meta?.place ? t.posts.changePlace : t.posts.addPlace} onPress={onPlace} />
          <Action icon="share" label={t.posts.share} onPress={onShare} strong />
        </View>
      )}
    </>
  );
  if (forShare) return <View style={[s.card, s.shareCard, { backgroundColor: c.bg }]}>{body}</View>;
  return <Glass style={s.card}>{body}</Glass>;
}

function Cell({ v, l }: { v: string; l: string }) {
  const s = useS();
  return (
    <View style={s.cell}>
      <Text style={s.cellV} numberOfLines={1} adjustsFontSizeToFit>{v}</Text>
      <Text style={s.cellL}>{l.toUpperCase()}</Text>
    </View>
  );
}

function Action({ icon, label, onPress, strong }: { icon: 'camera' | 'image' | 'pin' | 'share'; label: string; onPress?: () => void; strong?: boolean }) {
  const s = useS();
  const c = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.action, strong && s.actionStrong, pressed && { opacity: 0.75 }]} accessibilityRole="button" accessibilityLabel={label}>
      <Icon name={icon} size={18} tint={strong ? c.accentText : c.text} />
      <Text style={[s.actionText, strong && { color: c.accentText }]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const useS = themed((c) => ({
  card: { marginBottom: space.l },
  shareCard: { width: 360, borderRadius: 0, paddingBottom: space.l },
  media: { height: 230, margin: 6, borderRadius: radius.glass - 6, overflow: 'hidden', backgroundColor: c.courtOut },
  mediaShare: { height: 270, margin: 0, borderRadius: 0 },
  photo: { width: '100%', height: '100%' },
  art: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1B4A33' },
  mediaButtons: { position: 'absolute', top: space.m, right: space.m },
  mediaBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  mediaBtnText: { fontFamily: font.bodyBold, fontSize: 13, color: '#FFFFFF' },
  fade: { position: 'absolute', left: 0, top: 0 },
  caption: { position: 'absolute', left: space.l, right: space.l, bottom: space.m },
  kicker: { fontFamily: font.label, fontSize: 12, letterSpacing: 1.8, color: 'rgba(255,255,255,0.8)' },
  title: { fontFamily: font.displayItalic, fontSize: 30, lineHeight: 33, color: '#FFFFFF' },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  place: { fontFamily: font.bodyBold, fontSize: 14, color: '#FFFFFF' },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.l, paddingTop: space.m },
  vr: { width: 1, height: 34, backgroundColor: c.hair },
  cell: { flex: 1, alignItems: 'center' },
  cellV: { fontFamily: font.display, fontSize: 28, color: c.text },
  cellL: { fontFamily: font.label, fontSize: 11, letterSpacing: 1.5, color: c.mute },
  topRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.s, paddingHorizontal: space.l, paddingTop: space.m },
  topLabel: { fontFamily: font.label, fontSize: 12, letterSpacing: 1.6, color: c.mute },
  topName: { flex: 1, fontFamily: font.display, fontSize: 22, color: c.text },
  topMeta: { fontFamily: font.displayItalic, fontSize: 20, color: c.mode === 'dark' ? c.accent : c.court },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.l, paddingTop: space.m },
  badgeCase: { width: 46, height: 54, borderRadius: 12, backgroundColor: c.showcase, alignItems: 'center', justifyContent: 'center' },
  badge: { width: 38, height: 47 },
  more: { fontFamily: font.bodyBold, fontSize: 14, color: c.mute },
  actions: { flexDirection: 'row', gap: space.s, padding: space.m },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: c.hair },
  actionStrong: { backgroundColor: c.accent, borderColor: c.accent },
  actionText: { fontFamily: font.bodyBold, fontSize: size.small - 1, color: c.text },
  foot: { fontFamily: font.body, fontSize: 12, color: c.mute, paddingHorizontal: space.l, paddingTop: space.m },
}));
