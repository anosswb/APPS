import { useState } from 'react';
import { Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { t } from '../i18n/en';
import { MAX_COURTS, newSession, restartSession, Session, updateSettings } from '../logic/session';
import { Prefs, ThemeChoice } from '../state/storage';
import { Button } from '../ui/Button';
import { Label, Segments } from '../ui/Bits';
import { Glass } from '../ui/Glass';
import { Header } from '../ui/Header';
import { Icon } from '../ui/Icon';
import { themed, useTheme } from '../theme/theme';
import { font, radius, size, space, TAB_SPACE, touch } from '../theme/tokens';

interface Props {
  session: Session;
  act: (change: (s: Session, now: number) => Session) => void;
  closeSession: (next: (s: Session, now: number) => Session) => void;
  prefs: Prefs;
  setPrefs: (p: Prefs) => void;
  openLicences: () => void;
}

export function SettingsScreen({ session, act, closeSession, prefs, setPrefs, openLicences }: Props) {
  const s = useS();
  const c = useTheme();
  const st = session.settings;
  const [confirm, setConfirm] = useState<'fresh' | 'clear' | null>(null);
  const twice = (which: 'fresh' | 'clear', run: () => void) => {
    if (confirm === which) {
      run();
      setConfirm(null);
    } else setConfirm(which);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={t.settings.title} />
      <ScrollView contentContainerStyle={s.scroll}>
        <Label style={s.label}>{t.settings.look}</Label>
        <Segments<ThemeChoice> items={[['system', t.settings.system], ['dark', t.settings.dark], ['light', t.settings.light]]} value={prefs.theme} onChange={(v) => setPrefs({ ...prefs, theme: v })} />
        <Text style={s.help}>{t.settings.lookHelp}</Text>

        <Label style={s.label}>{t.settings.courts}</Label>
        <Glass>
          <View style={s.pad}>
            <View style={s.stepper}>
              <Pressable style={s.step} onPress={() => act((s2, now) => updateSettings(s2, { courts: st.courts - 1 }, now))} disabled={st.courts <= 1} accessibilityRole="button" accessibilityLabel={t.a11y.minus}>
                <Icon name="minus" tint={st.courts <= 1 ? c.hair : c.text} />
              </Pressable>
              <Text style={s.big}>{st.courts}</Text>
              <Pressable style={s.step} onPress={() => act((s2, now) => updateSettings(s2, { courts: st.courts + 1 }, now))} disabled={st.courts >= MAX_COURTS} accessibilityRole="button" accessibilityLabel={t.a11y.plus}>
                <Icon name="plus" tint={st.courts >= MAX_COURTS ? c.hair : c.text} />
              </Pressable>
            </View>
            <Text style={s.help}>{t.settings.courtsHelp}</Text>
          </View>
        </Glass>

        <Label style={s.label}>{t.settings.rotation}</Label>
        <Glass>
          <View style={s.padTight}>
            <Choice on={st.rule === 'all-off'} title={t.settings.allOff} help={t.settings.allOffHelp} onPress={() => act((s2, now) => updateSettings(s2, { rule: 'all-off' }, now))} />
            <View style={s.hair} />
            <Choice on={st.rule === 'winners-stay'} title={t.settings.winnersStay} help={t.settings.winnersStayHelp(st.maxWins)} onPress={() => act((s2, now) => updateSettings(s2, { rule: 'winners-stay' }, now))} />
            <View style={s.hair} />
            <Choice on={st.rule === 'winners-split'} title={t.settings.winnersSplit} help={t.settings.winnersSplitHelp} onPress={() => act((s2, now) => updateSettings(s2, { rule: 'winners-split' }, now))} />
          </View>
        </Glass>

        <Label style={s.label}>{t.settings.scoring}</Label>
        <Segments<'sideout' | 'rally'> items={[['sideout', t.settings.sideout], ['rally', t.settings.rally]]} value={st.scoring.type} onChange={(v) => act((s2, now) => updateSettings(s2, { scoring: { ...st.scoring, type: v } }, now))} />
        <Label style={s.label}>{t.settings.gameTo}</Label>
        <Segments<'11' | '15' | '21'> items={[['11', '11'], ['15', '15'], ['21', '21']]} value={String(st.scoring.target) as '11'} onChange={(v) => act((s2, now) => updateSettings(s2, { scoring: { ...st.scoring, target: Number(v) } }, now))} />

        <Label style={s.label}>{t.settings.feel}</Label>
        <Glass>
          <View style={s.padTight}>
            <Toggle label={t.settings.voice} help={t.settings.voiceHelp} on={prefs.voice} set={(v) => setPrefs({ ...prefs, voice: v })} />
            <View style={s.hair} />
            <Toggle label={t.settings.keepAwake} on={prefs.keepAwake} set={(v) => setPrefs({ ...prefs, keepAwake: v })} />
            <View style={s.hair} />
            <Toggle label={t.settings.haptics} on={prefs.haptics} set={(v) => setPrefs({ ...prefs, haptics: v })} />
          </View>
        </Glass>

        <Label style={s.label}>{t.settings.session}</Label>
        <View style={{ gap: space.s }}>
          <Button label={confirm === 'fresh' ? t.settings.sure : t.settings.fresh} kind={confirm === 'fresh' ? 'solid' : 'glass'} onPress={() => twice('fresh', () => closeSession((s2, now) => restartSession(s2, now)))} />
          <Text style={s.help}>{t.settings.freshHelp}</Text>
          <Button label={confirm === 'clear' ? t.settings.sure : t.settings.clear} kind={confirm === 'clear' ? 'stop' : 'glass'} onPress={() => twice('clear', () => closeSession((s2, now) => newSession(s2.settings, now)))} />
          <Text style={s.help}>{t.settings.clearHelp}</Text>
        </View>

        <Text style={s.foot}>{Platform.OS === 'android' ? t.settings.privacyAndroid : t.settings.privacy}</Text>
        <Pressable onPress={openLicences} style={s.licBtn} accessibilityRole="button">
          <Text style={s.licText}>{t.licences.open}</Text>
        </Pressable>
        <Text style={s.foot}>{t.settings.version(Constants.expoConfig?.version ?? '1.0.0')}</Text>
      </ScrollView>
    </View>
  );
}

function Choice({ on, title, help, onPress }: { on: boolean; title: string; help: string; onPress: () => void }) {
  const s = useS();
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

function Toggle({ label, help, on, set }: { label: string; help?: string; on: boolean; set: (v: boolean) => void }) {
  const s = useS();
  const c = useTheme();
  return (
    <View style={s.toggle}>
      <View style={{ flex: 1, paddingRight: space.m }}>
        <Text style={s.choiceTitle}>{label}</Text>
        {help ? <Text style={s.help}>{help}</Text> : null}
      </View>
      <Switch value={on} onValueChange={set} trackColor={{ true: c.mode === 'dark' ? '#7FA526' : c.court, false: c.hair }} thumbColor="#FFFFFF" {...({ activeThumbColor: '#FFFFFF' } as object)} accessibilityLabel={label} />
    </View>
  );
}

const useS = themed((c) => ({
  scroll: { paddingHorizontal: space.l, paddingBottom: TAB_SPACE + space.xl },
  label: { marginTop: space.xl, marginBottom: space.s, marginLeft: 4 },
  pad: { padding: space.l },
  padTight: { paddingHorizontal: space.l, paddingVertical: space.s },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  step: { width: touch.big, height: touch.big, borderRadius: radius.pill, borderWidth: 1.5, borderColor: c.hair, alignItems: 'center', justifyContent: 'center' },
  big: { fontFamily: font.display, fontSize: 64, color: c.text, lineHeight: 68 },
  help: { fontFamily: font.body, fontSize: size.small + 1, lineHeight: 21, color: c.mute, marginTop: 2 },
  hair: { height: 1, backgroundColor: c.hair, marginVertical: space.s },
  choice: { flexDirection: 'row', gap: space.m, alignItems: 'flex-start', minHeight: touch.min, paddingVertical: space.xs },
  radio: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: c.textSoft, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioOn: { backgroundColor: c.accent, borderColor: c.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.accentText },
  choiceTitle: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: c.text },
  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: touch.min, paddingVertical: space.xs },
  foot: { fontFamily: font.body, fontSize: size.small, color: c.mute, textAlign: 'center', marginTop: space.l, lineHeight: 20 },
  licBtn: { minHeight: touch.min, alignItems: 'center', justifyContent: 'center', marginTop: space.s },
  licText: { fontFamily: font.bodyBold, fontSize: size.body, color: c.highlight, textDecorationLine: 'underline' },
}));
