/** The first open: one page that says what the app does, then gets out of the way. */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { t } from '../i18n/en';
import { font, onSky, size, skyStops, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Glass, GlassPill } from '../ui/Bits';
import { Icon } from '../ui/Icon';

export function Welcome({ top, bottom, onStart }: { top: number; bottom: number; onStart: () => void }) {
  const c = useTheme();
  const s = c.sky.dawn;
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <LinearGradient colors={[s[0], s[1], s[2], c.dark ? 'rgba(10,15,21,0)' : 'rgba(226,232,240,0)']} locations={[...skyStops]} style={[st.sky, { height: size.sky + top }]} />
      <ScrollView contentContainerStyle={{ paddingTop: top + space.xl, paddingHorizontal: space.m, paddingBottom: space.l, gap: space.m }}>
        <View style={{ paddingHorizontal: space.s, gap: space.s, marginBottom: space.s }}>
          <Text style={st.title}>{t.welcome.title}</Text>
          <Text style={st.sub}>{t.welcome.sub}</Text>
        </View>
        <Glass style={{ gap: space.l, backgroundColor: c.cardOnSky }}>
          {t.welcome.points.map(([icon, head, body]) => (
            <View key={head} style={st.point}>
              <View style={[st.badge, { backgroundColor: c.raised }]}><Icon name={icon} color={c.blue} /></View>
              <View style={{ flex: 1 }}>
                <Text style={[st.head, { color: c.text }]}>{head}</Text>
                <Text style={[st.body, { color: c.textSoft }]}>{body}</Text>
              </View>
            </View>
          ))}
        </Glass>
      </ScrollView>
      <View style={{ paddingHorizontal: space.m, paddingBottom: Math.max(bottom, space.m), paddingTop: space.s }}>
        <GlassPill solid icon="right" label={t.welcome.start} onPress={onStart} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  sky: { position: 'absolute', left: 0, right: 0, top: 0 },
  title: { fontFamily: font.display, fontSize: type.hero.size - 4, lineHeight: type.hero.line - 2, letterSpacing: type.hero.tracking, color: onSky.text },
  sub: { fontFamily: font.text, fontSize: type.body.size, color: onSky.soft },
  point: { flexDirection: 'row', gap: space.m, alignItems: 'flex-start' },
  badge: { width: size.step + 2, height: size.step + 2, borderRadius: (size.step + 2) / 2, alignItems: 'center', justifyContent: 'center' },
  head: { fontFamily: font.textHeavy, fontSize: type.body.size + 1, marginBottom: 2 },
  body: { fontFamily: font.text, fontSize: type.label.size + 1, lineHeight: type.body.line },
});
