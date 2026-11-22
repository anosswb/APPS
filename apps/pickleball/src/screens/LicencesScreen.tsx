// The work of others inside the app: the two fonts and every code package, with the licence texts.
// The data is made by scripts/make-licences.js (run it after adding or updating a package).
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import data from '../config/licences.json';
import { t } from '../i18n/en';
import { Header } from '../ui/Header';
import { Icon } from '../ui/Icon';
import { font, radius, size, space, touch } from '../theme/tokens';
import { themed, useTheme } from '../theme/theme';

type Pkg = { name: string; version: string; licence: string; copyright: string };

export function LicencesScreen({ onClose }: { onClose: () => void }) {
  const s = useS();
  const color = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<string | null>(null);
  const texts = data.texts as Record<string, string>;
  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Header title={t.licences.title} />
      <View style={s.body0}>
      <ScrollView contentContainerStyle={s.pad}>
        <Text style={s.intro}>{t.licences.intro}</Text>
        <Text style={s.label}>{t.licences.type}</Text>
        {data.fonts.map((f) => (
          <View key={f.name} style={s.row}>
            <Text style={s.name}>{f.name}</Text>
            <Text style={s.meta}>{f.copyright}</Text>
            <Text style={s.meta}>{f.licence}</Text>
          </View>
        ))}
        <Text style={s.label}>{t.licences.code(data.packages.length)}</Text>
        {(data.packages as Pkg[]).map((p) => (
          <View key={`${p.name}@${p.version}`} style={s.row}>
            <Text style={s.pkg}>
              {p.name} <Text style={s.meta}>{p.version}</Text>
            </Text>
            {p.copyright ? <Text style={s.meta}>{p.copyright}</Text> : null}
            <Text style={s.meta}>{p.licence}</Text>
          </View>
        ))}
        <Text style={s.label}>{t.licences.texts}</Text>
        {Object.keys(texts).map((id) => (
          <View key={id} style={s.row}>
            <Pressable onPress={() => setOpen(open === id ? null : id)} style={s.toggle} accessibilityRole="button">
              <Text style={s.name}>{id}</Text>
              <Text style={s.link}>{open === id ? t.licences.hide : t.licences.show}</Text>
            </Pressable>
            {open === id ? <Text style={s.body}>{texts[id]}</Text> : null}
          </View>
        ))}
      </ScrollView>
      <Pressable onPress={onClose} style={s.close} accessibilityRole="button">
        <Text style={s.closeText}>{t.licences.close}</Text>
        <Icon name="close" />
      </Pressable>
      </View>
    </View>
  );
}

const useS = themed((color) => ({
  root: { flex: 1, backgroundColor: color.court },
  body0: { flex: 1, backgroundColor: color.bg },
  pad: { padding: space.l },
  intro: { fontFamily: font.body, fontSize: size.body, lineHeight: 23, color: color.textSoft },
  label: { fontFamily: font.label, fontSize: size.label, letterSpacing: 1, color: color.textSoft, marginTop: space.xl, marginBottom: space.s },
  row: { backgroundColor: color.card, borderRadius: radius.box, padding: space.m, marginBottom: 6 },
  name: { fontFamily: font.name, fontSize: size.nameSmall, color: color.text },
  pkg: { fontFamily: font.bodyBold, fontSize: size.body, color: color.text },
  meta: { fontFamily: font.body, fontSize: size.small, color: color.textSoft, marginTop: 2 },
  toggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 44 },
  link: { fontFamily: font.bodyBold, fontSize: size.body, color: color.court, textDecorationLine: 'underline' },
  body: { fontFamily: font.body, fontSize: size.small, lineHeight: 20, color: color.text, marginTop: space.s },
  close: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.s, minHeight: touch.big, margin: space.l, borderWidth: 2, borderColor: color.text, borderRadius: radius.box },
  closeText: { fontFamily: font.bodyBold, fontSize: size.body + 1, color: color.text },
}));
