import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME, APP_VERSION } from '../config/app';
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

export function Settings({ onExit, onRules }: { onExit: () => void; onRules: () => void }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { save, setTheme, setSoundOn, setHapticsOn } = useStore();
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

        <Btn label={t.home.rules} kind="outline" onPress={onRules} style={styles.rules} />

        <View style={styles.gap} />
        <Rule />
        <Type variant="label" tone="muted" style={styles.label}>
          {t.settings.privacy}
        </Type>
        <Type tone="muted">{t.settings.privacyText(APP_NAME)}</Type>

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
  gap: { height: space.xl },
  version: { marginTop: space.xl, textAlign: 'center' },
});
