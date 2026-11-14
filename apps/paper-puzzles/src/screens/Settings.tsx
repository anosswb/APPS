import React, { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME, APP_VERSION } from '../config/app';
import { MONEY_MODE } from '../config/money';
import { ads } from '../money/ads';
import { ReminderTime } from '../reminder/plan';
import { reminders } from '../reminder/reminders';
import { count } from '../stats/stats';
import { STATS_AVAILABLE } from '../stats/stats';
import { t } from '../i18n/en';
import { useStore } from '../store/Store';
import { ThemeChoice, useTheme } from '../theme/ThemeContext';
import { space, tapMin } from '../theme/tokens';
import { Btn } from '../ui/Btn';
import { Choice } from '../ui/Choice';
import { Chevron } from '../ui/Glyphs';
import { Rule } from '../ui/Rule';
import { Type } from '../ui/Type';

type OnOff = 'on' | 'off';
type ReminderChoice = 'off' | ReminderTime;

export function Settings({ onExit, onRules }: { onExit: () => void; onRules: () => void }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { save, setTheme, setSoundOn, setHapticsOn, setStatsOn, setReminder } = useStore();
  /** the reminder is wanted but the phone itself does not allow notes */
  const [blocked, setBlocked] = useState(false);
  const reminderOn = save.reminder.on;
  useEffect(() => {
    if (!reminderOn || !reminders.available()) return;
    let alive = true;
    reminders
      .allowed()
      .then((ok) => {
        if (alive) setBlocked(!ok);
      })
      .catch((error) => console.warn('Could not read the note permission', error));
    return () => {
      alive = false;
    };
  }, [reminderOn]);

  const chooseReminder = async (choice: ReminderChoice) => {
    count('setting_changed', { name: 'reminder', value: choice });
    if (choice === 'off') {
      setBlocked(false);
      setReminder({ on: false, asked: true });
      return;
    }
    let ok = false;
    try {
      ok = await reminders.ask();
    } catch (error) {
      console.warn('Could not ask for notes', error);
    }
    setBlocked(!ok);
    setReminder({ on: ok, time: choice, asked: true });
  };
  const onOff = [
    { value: 'on' as OnOff, label: t.settings.on },
    { value: 'off' as OnOff, label: t.settings.off },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.page, { paddingTop: insets.top + space.s, paddingBottom: insets.bottom + space.xxl }]}
    >
      <View style={styles.column}>
        <Pressable accessibilityRole="button" accessibilityLabel={t.game.back} onPress={onExit} hitSlop={8} style={styles.back}>
          <Chevron size={20} color={c.text} />
          <Type variant="label">{t.game.back}</Type>
        </Pressable>
        <Rule strong />
        <Type variant="title" accessibilityRole="header" style={styles.title}>
          {t.settings.title}
        </Type>

        <Type variant="label" tone="muted" style={styles.label}>
          {t.settings.look}
        </Type>
        <Choice<ThemeChoice>
          label={t.settings.look}
          value={save.settings.theme}
          onChange={setTheme}
          options={[
            { value: 'system', label: t.settings.lookOptions.system },
            { value: 'light', label: t.settings.lookOptions.light },
            { value: 'dark', label: t.settings.lookOptions.dark },
          ]}
        />

        <Type variant="label" tone="muted" style={styles.label}>
          {t.settings.sound}
        </Type>
        <Choice<OnOff> label={t.settings.sound} value={save.settings.sound ? 'on' : 'off'} onChange={(v) => setSoundOn(v === 'on')} options={onOff} />

        <Type variant="label" tone="muted" style={styles.label}>
          {t.settings.haptics}
        </Type>
        <Choice<OnOff> label={t.settings.haptics} value={save.settings.haptics ? 'on' : 'off'} onChange={(v) => setHapticsOn(v === 'on')} options={onOff} />

        {reminders.available() ? (
          <>
            <Type variant="label" tone="muted" style={styles.label}>
              {t.reminder.setting}
            </Type>
            <Choice<ReminderChoice>
              label={t.reminder.setting}
              value={save.reminder.on ? save.reminder.time : 'off'}
              onChange={(v) => void chooseReminder(v)}
              options={[
                { value: 'off', label: t.settings.off },
                { value: 'morning', label: t.reminder.times.morning },
                { value: 'noon', label: t.reminder.times.noon },
                { value: 'evening', label: t.reminder.times.evening },
              ]}
            />
            <Type tone="muted" style={styles.about}>
              {blocked ? t.reminder.blocked : t.reminder.settingAbout}
            </Type>
            {blocked ? <Btn label={t.reminder.phoneSettings} kind="outline" onPress={() => void Linking.openSettings()} style={styles.about} /> : null}
          </>
        ) : null}

        <Btn label={t.home.rules} kind="outline" onPress={onRules} style={styles.rules} />

        <View style={styles.gap} />
        <Rule />
        <Type variant="label" tone="muted" style={styles.label}>
          {t.settings.privacy}
        </Type>
        <Type tone="muted">{t.settings.privacyText(APP_NAME, MONEY_MODE === 'ads', STATS_AVAILABLE && save.stats.on)}</Type>
        {STATS_AVAILABLE ? (
          <>
            <Type variant="label" tone="muted" style={styles.label}>
              {t.settings.stats}
            </Type>
            <Choice<OnOff> label={t.settings.stats} value={save.stats.on ? 'on' : 'off'} onChange={(v) => setStatsOn(v === 'on')} options={onOff} />
          </>
        ) : null}
        {ads.needsPrivacyOptions() ? <Btn label={t.settings.adChoices} kind="outline" onPress={() => void ads.showPrivacyOptions()} style={styles.rules} /> : null}

        <Type variant="label" tone="muted" style={styles.label}>
          {t.settings.credits}
        </Type>
        <Type tone="muted">{t.settings.creditsText}</Type>

        <Type variant="label" tone="muted" style={styles.version}>
          {t.settings.version(APP_NAME, APP_VERSION)}
        </Type>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: space.xl, alignItems: 'center' },
  column: { width: '100%', maxWidth: 520 },
  back: { flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: tapMin, alignSelf: 'flex-start', paddingEnd: space.m },
  title: { marginTop: space.l },
  label: { marginTop: space.xl, marginBottom: space.s },
  rules: { marginTop: space.xl },
  about: { marginTop: space.s },
  gap: { height: space.xl },
  version: { marginTop: space.xl, textAlign: 'center' },
});
