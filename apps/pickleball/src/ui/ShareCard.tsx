// The picture people share to the group chat at the end of the day. Always dark (it is a poster),
// with the top player, the numbers of the day and the badges won.
import { RefObject } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { APP_NAME, t } from '../i18n/en';
import type { AwardId } from '../logic/achievements';
import { clock, Stats } from '../logic/history';
import { dark as c, font } from '../theme/tokens';
import { BADGES } from './badges';
import { CourtSurface } from './CourtSurface';

export async function shareCardImage(ref: RefObject<unknown>): Promise<void> {
  if (!ref.current) throw new Error('card not ready');
  const uri = await captureRef(ref as Parameters<typeof captureRef>[0], { format: 'png', quality: 1, result: 'tmpfile' });
  if (!(await Sharing.isAvailableAsync())) throw new Error('sharing not available');
  await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t.history.share });
}

export function ShareCard({ stats, awards, when }: { stats: Stats; awards: AwardId[]; when: number }) {
  const top = stats.table[0];
  return (
    <View style={s.card}>
      <View style={[s.glow, { backgroundColor: c.glow1, left: -80, top: -60 }]} />
      <View style={[s.glow, { backgroundColor: c.glow2, right: -90, top: 200 }]} />
      <Text style={s.brand}>{APP_NAME.toUpperCase()}</Text>
      <Text style={s.date}>{t.history.day(when)}</Text>
      <View style={{ marginTop: 14 }}>
        <CourtSurface left={top ? [top.name] : ['']} right={[t.share.wins(top?.wins ?? 0)]} height={70} />
      </View>
      <Text style={s.kicker}>{t.share.top}</Text>
      <Text style={s.top} numberOfLines={1}>{(top?.name ?? '').toUpperCase()}</Text>
      <View style={s.row}>
        <Cell v={String(stats.games)} l={t.history.games} />
        <Cell v={clock(stats.longestMs)} l={t.history.longest} />
        <Cell v={String(stats.players)} l={t.history.players} />
      </View>
      {awards.length ? (
        <View style={s.badges}>
          {awards.slice(0, 5).map((id) => (
            <Image key={id} source={BADGES[id]} style={s.badge} resizeMode="contain" />
          ))}
        </View>
      ) : null}
      <Text style={s.foot}>{t.share.foot}</Text>
    </View>
  );
}

function Cell({ v, l }: { v: string; l: string }) {
  return (
    <View style={s.cell}>
      <Text style={s.cellV}>{v}</Text>
      <Text style={s.cellL}>{l.toUpperCase()}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { width: 360, padding: 22, backgroundColor: c.bg, overflow: 'hidden' },
  glow: { position: 'absolute', width: 260, height: 260, borderRadius: 130, opacity: 0.35 },
  brand: { fontFamily: font.displayItalic, fontSize: 22, letterSpacing: 2, color: c.accent },
  date: { fontFamily: font.body, fontSize: 14, color: c.mute },
  kicker: { fontFamily: font.label, fontSize: 13, letterSpacing: 2, color: c.mute, marginTop: 18 },
  top: { fontFamily: font.displayItalic, fontSize: 46, lineHeight: 50, color: c.text },
  row: { flexDirection: 'row', gap: 8, marginTop: 12 },
  cell: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  cellV: { fontFamily: font.display, fontSize: 26, color: c.text },
  cellL: { fontFamily: font.label, fontSize: 11, letterSpacing: 1.5, color: c.mute },
  badges: { flexDirection: 'row', gap: 6, marginTop: 14 },
  badge: { width: 56, height: 70 },
  foot: { fontFamily: font.body, fontSize: 12, color: c.mute, marginTop: 14 },
});
