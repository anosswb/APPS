import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { t } from '../i18n/en';
import { MAX_COURTS, newSession, restartSession, Session, updateSettings } from '../logic/session';
import { Prefs } from '../state/storage';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Header } from '../ui/Header';
import { color, font, radius, size, space, touch } from '../theme/tokens';

interface Props {
  session: Session;
  act: (change: (s: Session, now: number) => Session) => void;
  prefs: Prefs;
  setPrefs: (p: Prefs) => void;
  openLicences: () => void;
}

export function SettingsScreen({ session, act, prefs, setPrefs, openLicences }: Props) {
  const st = session.settings;
  const [confirm, setConfirm] = useState<'fresh' | 'clear' | null>(null);
  const twice = (which: 'fresh' | 'clear', run: () => void) => {
    if (confirm === which) {
      run();
      setConfirm(null);
    } else setConfirm(which);
  };

  return (
    <View style={s.root}>
      <Header title={t.settings.title} />
      <ScrollView style={s.root} contentContainerStyle={s.pad}>

      <Text style={s.label}>{t.settings.courts}</Text>
      <View style={s.box}>
        <View style={s.stepper}>
          <Pressable style={s.step} onPress={() => act((s2, now) => updateSettings(s2, { courts: st.courts - 1 }, now))} disabled={st.courts <= 1} accessibilityRole="button" accessibilityLabel={t.a11y.minus}>
            <Icon name="minus" tint={st.courts <= 1 ? color.hair : color.ink} />
          </Pressable>
          <Text style={s.big}>{st.courts}</Text>
          <Pressable style={s.step} onPress={() => act((s2, now) => updateSettings(s2, { courts: st.courts + 1 }, now))} disabled={st.courts >= MAX_COURTS} accessibilityRole="button" accessibilityLabel={t.a11y.plus}>
            <Icon name="plus" tint={st.courts >= MAX_COURTS ? color.hair : color.ink} />
          </Pressable>
        </View>
        <Text style={s.help}>{t.settings.courtsHelp}</Text>
      </View>

      <Text style={s.label}>{t.settings.rotation}</Text>
      <View style={s.box}>
        <Choice on={st.rule === 'all-off'} title={t.settings.allOff} help={t.settings.allOffHelp} onPress={() => act((s2, now) => updateSettings(s2, { rule: 'all-off' }, now))} />
        <View style={s.hair} />
        <Choice on={st.rule === 'winners-stay'} title={t.settings.winnersStay} help={t.settings.winnersStayHelp(st.maxWins)} onPress={() => act((s2, now) => updateSettings(s2, { rule: 'winners-stay' }, now))} />
        <View style={s.hair} />
        <Choice on={st.rule === 'winners-split'} title={t.settings.winnersSplit} help={t.settings.winnersSplitHelp} onPress={() => act((s2, now) => updateSettings(s2, { rule: 'winners-split' }, now))} />
      </View>

      <Text style={s.label}>{t.settings.scoring}</Text>
      <Segments
        items={[
          [t.settings.sideout, st.scoring.type === 'sideout', () => act((s2, now) => updateSettings(s2, { scoring: { ...st.scoring, type: 'sideout' } }, now))],
          [t.settings.rally, st.scoring.type === 'rally', () => act((s2, now) => updateSettings(s2, { scoring: { ...st.scoring, type: 'rally' } }, now))],
        ]}
      />
      <Text style={s.label}>{t.settings.gameTo}</Text>
      <Segments
        items={[11, 15, 21].map((n) => [String(n), st.scoring.target === n, () => act((s2, now) => updateSettings(s2, { scoring: { ...st.scoring, target: n } }, now))] as const)}
      />

      <Text style={s.label}>{t.settings.feel}</Text>
      <View style={s.box}>
        <Toggle label={t.settings.keepAwake} on={prefs.keepAwake} set={(v) => setPrefs({ ...prefs, keepAwake: v })} />
        <View style={s.hair} />
        <Toggle label={t.settings.haptics} on={prefs.haptics} set={(v) => setPrefs({ ...prefs, haptics: v })} />
      </View>

      <Text style={s.label}>{t.settings.session}</Text>
      <View style={[s.box, { gap: space.s }]}>
        <Button label={confirm === 'fresh' ? t.settings.sure : t.settings.fresh} kind={confirm === 'fresh' ? 'ink' : 'outline'} onPress={() => twice('fresh', () => act((s2, now) => restartSession(s2, now)))} />
        <Text style={s.help}>{t.settings.freshHelp}</Text>
        <Button label={confirm === 'clear' ? t.settings.sure : t.settings.clear} kind={confirm === 'clear' ? 'stop' : 'outline'} onPress={() => twice('clear', () => act((s2) => newSession(s2.settings)))} />
        <Text style={s.help}>{t.settings.clearHelp}</Text>
      </View>

      <Text style={s.foot}>{Platform.OS === 'android' ? t.settings.privacyAndroid : t.settings.privacy}</Text>
      <Pressable onPress={openLicences} style={s.licBtn} accessibilityRole="button">
        <Text style={s.licText}>{t.licences.open}</Text>
      </Pressable>
      <Text style={s.foot}>{t.settings.version(Constants.expoConfig?.version ?? '1.0.0')}</Text>
      <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function Choice({ on, title, help, onPress }: { on: boolean; title: string; help: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={s.choice} accessibilityRole="radio" accessibilityState={{ selected: on }}>
      <View style={[s.radio, on && s.radioOn]}>{on ? <View style={s.radioDot} /> : null}</View>
      <View style={{ flex: 1 }}>
        <Text style={s.choiceTitle}>{title}</Text>
        <Text style={s.help}>{help}</Text>
      </View>
    </Pressable>
  );
}

function Segments({ items }: { items: (readonly [string, boolean, () => void])[] }) {
  return (
    <View style={s.seg}>
      {items.map(([label, on, press]) => (
        <Pressable key={label} onPress={press} style={[s.segItem, on && s.segOn]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
          <Text style={[s.segText, on && { color: color.ground }]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <View style={s.toggle}>
      <Text style={s.choiceTitle}>{label}</Text>
      <Switch value={on} onValueChange={set} trackColor={{ true: color.court, false: color.hair }} thumbColor={color.card}
        {...({ activeThumbColor: color.card } as object)} accessibilityLabel={label} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.ground },
  pad: { paddingHorizontal: space.l, paddingTop: space.xs },
  title: { fontFamily: font.display, fontSize: size.hero, color: color.ink },
  label: { fontFamily: font.label, fontSize: size.label, letterSpacing: 1.5, color: color.inkSoft, marginTop: space.xl, marginBottom: space.s },
  box: { backgroundColor: color.card, borderRadius: radius.box, padding: space.m },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  step: { width: touch.big, height: touch.big, borderWidth: 2, borderColor: color.ink, borderRadius: radius.box, alignItems: 'center', justifyContent: 'center' },
  big: { fontFamily: font.display, fontSize: 64, color: color.ink, lineHeight: 68 },
  help: { fontFamily: font.body, fontSize: size.body - 1, lineHeight: 21, color: color.inkSoft, marginTop: 2 },
  hair: { height: 1, backgroundColor: color.hair, marginVertical: space.s },
  choice: { flexDirection: 'row', gap: space.m, alignItems: 'flex-start', minHeight: touch.min, paddingVertical: space.xs },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: color.ink, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioOn: { backgroundColor: color.ball },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: color.ink },
  choiceTitle: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: color.ink },
  seg: { flexDirection: 'row', borderWidth: 2, borderColor: color.ink, borderRadius: radius.box, overflow: 'hidden' },
  segItem: { flex: 1, minHeight: touch.min, alignItems: 'center', justifyContent: 'center', backgroundColor: color.card },
  segOn: { backgroundColor: color.ink },
  segText: { fontFamily: font.display, fontSize: size.nameSmall, color: color.ink },
  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: touch.min },
  licBtn: { minHeight: touch.min, alignItems: 'center', justifyContent: 'center', marginTop: space.s },
  licText: { fontFamily: font.bodyBold, fontSize: size.body, color: color.court, textDecorationLine: 'underline' },
  foot: { fontFamily: font.body, fontSize: size.small, color: color.mute, textAlign: 'center', marginTop: space.l },
});
