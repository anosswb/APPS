// A session as a photo post, like a run on a running app: the group photo fills the card and the numbers
// of the session sit on it in big white type (time played, games, players, longest game), with the day,
// the top player and the badges won. Without a photo, the painted court is the background.
// The same picture is what gets shared.
import { Image, Pressable, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { APP_NAME, t } from '../i18n/en';
import type { AwardId } from '../logic/achievements';
import { clock, hoursMinutes, SessionRecord, sessionLength, stats } from '../logic/history';
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
  const st = stats(record.games);
  const top = st.table[0];
  const photo = meta?.photo;

  const picture = (
    <View style={[s.media, forShare && s.mediaShare]}>
      {photo ? (
        <Image source={{ uri: photo }} style={s.fill} resizeMode="cover" accessibilityIgnoresInvertColors />
      ) : (
        <View style={[s.fill, s.art]}>
          <View style={s.artCourt}>
            <CourtSurface left={top ? [top.name] : ['']} right={[t.posts.wins(top?.wins ?? 0)]} height={92} />
          </View>
        </View>
      )}
      <Svg style={s.fill} width="100%" height="100%" pointerEvents="none">
        <Defs>
          <LinearGradient id={`top-${record.id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.5} />
            <Stop offset="0.22" stopColor="#000000" stopOpacity={0} />
            <Stop offset="0.42" stopColor="#000000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.86} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#top-${record.id})`} />
      </Svg>

      <View style={s.topBar} pointerEvents="box-none">
        <View>
          <Text style={s.brand}>{APP_NAME.toUpperCase()}</Text>
          <Text style={s.when}>{t.posts.when(record.startedAt)}</Text>
        </View>
        {!forShare && !photo ? (
          <Pressable onPress={onPhoto} style={s.cameraBtn} accessibilityRole="button" accessibilityLabel={t.posts.groupPhoto}>
            <Icon name="camera" size={18} tint="#0B0D12" />
            <Text style={s.cameraText}>{t.posts.groupPhoto}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={s.bottom} pointerEvents="none">
        <Text style={s.title} numberOfLines={1}>{t.posts.title(record.startedAt)}</Text>
        {meta?.place ? (
          <View style={s.placeRow}>
            <Icon name="pin" size={14} tint="#FFFFFF" />
            <Text style={s.place} numberOfLines={1}>{meta.place}</Text>
          </View>
        ) : null}
        <View style={s.statsRow}>
          <Big v={hoursMinutes(sessionLength(record))} l={t.posts.played} grow={1.45} />
          <Big v={String(st.games)} l={t.history.games} grow={0.8} />
          <Big v={String(record.players.length)} l={t.history.players} grow={0.9} />
          <Big v={clock(st.longestMs)} l={t.history.longest} grow={1.1} />
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
              <Image key={id} source={BADGES[id]} style={s.badge} resizeMode="contain" accessibilityLabel={t.awards.name[id]} />
            ))}
            {awards.length > 6 ? <Text style={s.more}>+{awards.length - 6}</Text> : null}
          </View>
        ) : null}
      </View>
    </View>
  );

  if (forShare) return picture;
  return (
    <Glass style={s.card}>
      {picture}
      <View style={s.actions}>
        <Action icon={photo ? 'image' : 'camera'} label={photo ? t.posts.changePhoto : t.posts.addPhoto} onPress={onPhoto} />
        <Action icon="pin" label={meta?.place ? t.posts.changePlace : t.posts.addPlace} onPress={onPlace} />
        <Action icon="share" label={t.posts.share} onPress={onShare} strong />
      </View>
    </Glass>
  );
}

function Big({ v, l, grow }: { v: string; l: string; grow: number }) {
  const s = useS();
  return (
    <View style={[s.big, { flex: grow }]}>
      <Text style={s.bigV} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>{v}</Text>
      <Text style={s.bigL}>{l.toUpperCase()}</Text>
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

const W = '#FFFFFF';

const useS = themed((c) => ({
  card: { marginBottom: space.l },
  media: { aspectRatio: 4 / 5, margin: 6, borderRadius: radius.glass - 6, overflow: 'hidden', backgroundColor: c.courtOut },
  mediaShare: { width: 360, margin: 0, borderRadius: 0 },
  fill: { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  art: { backgroundColor: '#163E2B', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 92 },
  artCourt: { width: '100%', paddingHorizontal: space.l },
  topBar: { position: 'absolute', left: space.l, right: space.m, top: space.m, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { fontFamily: font.heading, fontSize: 11, letterSpacing: 1.0, color: c.accent },
  when: { fontFamily: font.bodyBold, fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  cameraBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: 14, borderRadius: 22, backgroundColor: c.accent },
  cameraText: { fontFamily: font.bodyBold, fontSize: 13, color: '#0B0D12' },
  bottom: { position: 'absolute', left: space.l, right: space.l, bottom: space.l },
  title: { fontFamily: font.heading, fontSize: 20, lineHeight: 22, color: W },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  place: { fontFamily: font.bodyBold, fontSize: 14, color: W },
  statsRow: { flexDirection: 'row', marginTop: space.m, gap: space.s },
  big: { flex: 1 },
  bigV: { fontFamily: font.num, fontSize: 24, lineHeight: 27, color: W },
  bigL: { fontFamily: font.label, fontSize: 11, letterSpacing: 1, color: 'rgba(255,255,255,0.78)' },
  topRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.s, marginTop: space.m, paddingTop: space.s, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  topLabel: { fontFamily: font.label, fontSize: 11, letterSpacing: 1, color: 'rgba(255,255,255,0.78)' },
  topName: { flex: 1, fontFamily: font.name, fontSize: 17, color: W },
  topMeta: { fontFamily: font.num, fontSize: 17, color: c.accent },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: space.s },
  badge: { width: 40, height: 50 },
  more: { fontFamily: font.bodyBold, fontSize: 14, color: W },
  actions: { flexDirection: 'row', gap: space.s, paddingHorizontal: space.m, paddingBottom: space.m, paddingTop: 6 },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 48, borderRadius: radius.pill, borderWidth: 1, borderColor: c.hair },
  actionStrong: { backgroundColor: c.accent, borderColor: c.accent },
  actionText: { fontFamily: font.bodyBold, fontSize: size.small - 1, color: c.text },
}));
