/**
 * The Plus page. Rules (playbook/07, App Store 3.1.2): price and length shown, what you get, Restore, Terms, Privacy,
 * a clear way to continue free, no timers, only features that exist. Test build: no charge.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { t } from '../i18n/en';
import { PURCHASES_LIVE } from '../money/plus';
import { font, onSky, radius, size, skyStops, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Glass, GlassPill, Link } from '../ui/Bits';
import { Icon } from '../ui/Icon';

export function Paywall({ top, bottom, onBuy, onLater, laterLabel }: { top: number; bottom: number; onBuy: () => void; onLater: () => void; laterLabel?: string }) {
  const c = useTheme();
  const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly');
  const s = c.sky.night;
  const option = (id: 'yearly' | 'monthly', price: string, note?: string) => (
    <Pressable key={id} onPress={() => setPlan(id)} accessibilityRole="radio" accessibilityState={{ selected: plan === id }}
      style={[st.plan, { backgroundColor: plan === id ? c.raised : c.glass.fill, borderColor: plan === id ? c.blue : c.glass.edge }]}>
      <View style={[st.radio, { borderColor: plan === id ? c.blue : c.muted }]}>{plan === id && <View style={[st.radioIn, { backgroundColor: c.blue }]} />}</View>
      <View style={{ flex: 1 }}>
        <Text style={[st.planName, { color: c.text }]}>{t.plus[id]}</Text>
        {note && <Text style={[st.small, { color: c.green }]}>{note}</Text>}
      </View>
      <Text style={[st.price, { color: c.text }]}>{price}</Text>
    </Pressable>
  );
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <LinearGradient colors={[s[0], s[1], s[2], c.dark ? 'rgba(10,15,21,0)' : 'rgba(226,232,240,0)']} locations={[...skyStops]} style={[st.sky, { height: size.sky + top }]} />
      <ScrollView contentContainerStyle={{ width: '100%', maxWidth: size.maxContent, alignSelf: 'center', paddingTop: top + space.xl, paddingHorizontal: space.m, paddingBottom: space.l, gap: space.m }}>
        <View style={{ paddingHorizontal: space.s, gap: space.xs }}>
          <Text style={st.title}>{t.plus.title}</Text>
          <Text style={st.sub}>{t.plus.sub}</Text>
        </View>
        <Glass style={{ gap: space.l }}>
          {t.plus.features.map(([icon, head, body]) => (
            <View key={head} style={st.feat}>
              <View style={[st.badge, { backgroundColor: c.glass.on }]}><Icon name={icon} color="#FFFFFF" /></View>
              <View style={{ flex: 1 }}>
                <Text style={[st.head, { color: c.text }]}>{head}</Text>
                <Text style={[st.small, { color: c.textSoft }]}>{body}</Text>
              </View>
            </View>
          ))}
          <Text style={[st.small, { color: c.muted }]}>{t.plus.free}</Text>
        </Glass>
        <View style={{ gap: space.s }}>
          {option('yearly', t.plus.price.yearly, t.plus.price.yearlyNote)}
          {option('monthly', t.plus.price.monthly)}
        </View>
        {!PURCHASES_LIVE && <Text style={[st.small, { color: c.textSoft, textAlign: 'center' }]}>{t.plus.test}</Text>}
        <Text style={[st.small, { color: c.muted, textAlign: 'center' }]}>{t.plus.renews}</Text>
        <View style={st.links}>
          <Link label={t.plus.restore} muted onPress={() => {}} />
          <Link label={t.plus.terms} muted onPress={() => {}} />
          <Link label={t.plus.privacy} muted onPress={() => {}} />
        </View>
      </ScrollView>
      <View style={{ width: '100%', maxWidth: size.maxContent, alignSelf: 'center', paddingHorizontal: space.m, paddingBottom: Math.max(bottom, space.m), paddingTop: space.s, gap: space.xs }}>
        <GlassPill solid icon="check" label={t.plus.buy} right={plan === 'yearly' ? t.plus.price.yearly : t.plus.price.monthly} onPress={onBuy} />
        <Pressable onPress={onLater} accessibilityRole="button" style={st.later}><Text style={[st.laterText, { color: c.text }]}>{laterLabel ?? t.plus.later}</Text></Pressable>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  sky: { position: 'absolute', left: 0, right: 0, top: 0 },
  title: { fontFamily: font.display, fontSize: type.hero.size - 6, lineHeight: type.hero.line - 4, letterSpacing: type.hero.tracking, color: onSky.text },
  sub: { fontFamily: font.text, fontSize: type.body.size, color: onSky.soft },
  feat: { flexDirection: 'row', gap: space.m, alignItems: 'center' },
  badge: { width: size.step + 2, height: size.step + 2, borderRadius: (size.step + 2) / 2, alignItems: 'center', justifyContent: 'center' },
  head: { fontFamily: font.textHeavy, fontSize: type.body.size + 1, marginBottom: 2 },
  small: { fontFamily: font.text, fontSize: type.small.size, lineHeight: type.small.line },
  plan: { flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: size.tap + 14, borderRadius: radius.inner, borderWidth: 1.5, paddingHorizontal: space.m },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioIn: { width: 11, height: 11, borderRadius: 6 },
  planName: { fontFamily: font.textHeavy, fontSize: type.body.size + 1 },
  price: { fontFamily: font.textHeavy, fontSize: type.body.size },
  links: { flexDirection: 'row', justifyContent: 'center', gap: space.l },
  later: { minHeight: size.tap, alignItems: 'center', justifyContent: 'center' },
  laterText: { fontFamily: font.textBold, fontSize: type.body.size },
});
