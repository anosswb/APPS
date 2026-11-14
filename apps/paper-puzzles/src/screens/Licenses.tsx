import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME } from '../config/app';
import data from '../config/licences.json';
import { t } from '../i18n/en';
import { useTheme } from '../theme/ThemeContext';
import { space, tapMin } from '../theme/tokens';
import { Btn } from '../ui/Btn';
import { Chevron } from '../ui/Glyphs';
import { Rule } from '../ui/Rule';
import { Type } from '../ui/Type';

type LicenceId = keyof typeof data.texts;
const ORDER: LicenceId[] = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC', 'OFL-1.1'];

/** A package under two licences (our font packages) is listed under the first; the font itself is in the Type section. */
function firstId(licence: string): LicenceId {
  return licence.split(/ AND | OR /)[0] as LicenceId;
}

/** The work of others inside the app, with their names and the licence texts. Made by scripts/make-licences.js. */
export function Licenses({ onExit }: { onExit: () => void }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<LicenceId | null>(null);

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.page, { paddingTop: insets.top + space.s, paddingBottom: insets.bottom + space.xxl }]}
    >
      <View style={styles.column}>
        <Pressable accessibilityRole="button" accessibilityLabel={t.licenses.back} onPress={onExit} hitSlop={8} style={styles.back}>
          <Chevron size={20} color={c.text} />
          <Type variant="label">{t.licenses.back}</Type>
        </Pressable>
        <Rule strong />
        <Type variant="title" accessibilityRole="header" style={styles.title}>
          {t.licenses.title}
        </Type>
        <Type tone="muted" style={styles.intro}>
          {t.licenses.intro(APP_NAME)}
        </Type>

        {ORDER.map((id) => {
          const fonts = id === 'OFL-1.1' ? data.fonts : [];
          const packages = data.packages.filter((p) => firstId(p.licence) === id);
          if (!fonts.length && !packages.length) return null;
          return (
            <View key={id} style={styles.group}>
              <Rule />
              <Type variant="label" tone="muted" accessibilityRole="header" style={styles.label}>
                {t.licenses.names[id]}
              </Type>
              {fonts.map((f) => (
                <Type key={f.name} style={styles.line}>
                  {t.licenses.font(f.name)}
                  <Type tone="muted">{`  ${f.copyright}`}</Type>
                </Type>
              ))}
              {packages.map((p) => (
                <Type key={`${p.name}@${p.version}`} style={styles.line}>
                  {`${p.name} ${p.version}`}
                  {p.copyright ? <Type tone="muted">{`  ${p.copyright}`}</Type> : null}
                </Type>
              ))}
              <Btn
                label={open === id ? t.licenses.hide : t.licenses.read}
                kind="quiet"
                onPress={() => setOpen(open === id ? null : id)}
                style={styles.read}
              />
              {open === id ? (
                <Type tone="muted" style={styles.text}>
                  {data.texts[id]}
                </Type>
              ) : null}
            </View>
          );
        })}

        {Platform.OS === 'android' ? (
          <View style={styles.group}>
            <Rule />
            <Type tone="muted" style={styles.intro}>
              {t.licenses.android}
            </Type>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: space.xl, alignItems: 'center' },
  column: { width: '100%', maxWidth: 520 },
  back: { flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: tapMin, alignSelf: 'flex-start', paddingEnd: space.m },
  title: { marginTop: space.l },
  intro: { marginTop: space.m },
  group: { marginTop: space.xl },
  label: { marginTop: space.l, marginBottom: space.s },
  line: { marginTop: space.s },
  read: { alignSelf: 'flex-start', marginTop: space.s },
  text: { marginTop: space.s },
});
