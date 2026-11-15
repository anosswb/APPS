/** First open, after the welcome page: four one-tap questions, the usual start time, then a short "here is your setup". */
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { clock } from '../core/dayline';
import { t } from '../i18n/en';
import { Saved } from '../store';
import { font, onSky, radius, size, skyStops, space, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Caps, Glass, GlassPill, Link, TimeField } from '../ui/Bits';
import { Icon } from '../ui/Icon';

type Answers = Saved['profile'];

function Sky({ top }: { top: number }) {
  const c = useTheme();
  const s = c.sky.dawn;
  return <LinearGradient colors={[s[0], s[1], s[2], c.dark ? 'rgba(10,15,21,0)' : 'rgba(226,232,240,0)']} locations={[...skyStops]} style={[st.sky, { height: size.sky + top }]} />;
}

export function Quiz({ data, top, bottom, onDone }: { data: Saved; top: number; bottom: number; onDone: (next: Saved) => void }) {
  const c = useTheme();
  const qs = t.quiz.questions;
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(data.profile);
  const [start, setStart] = useState(data.shift.start);
  const total = qs.length + 1;
  const finish = () => {
    const hours = a.hours > 0 ? a.hours : 12;
    onDone({ ...data, profile: a, shift: { start, end: (start + hours * 60) % 1440 } });
  };
  const q = qs[step];
  return (
    <View style={{ flex: 1 }}>
      <Sky top={top} />
      <ScrollView contentContainerStyle={{ paddingTop: top + space.xl, paddingHorizontal: space.m, paddingBottom: space.l, gap: space.m }}>
        <View style={st.bar}>{Array.from({ length: total }, (_, i) => <View key={i} style={[st.seg, { backgroundColor: i <= step ? onSky.text : 'rgba(255,255,255,0.28)' }]} />)}</View>
        <Text style={st.count}>{t.quiz.step(step + 1, total)}</Text>
        <Text style={st.q}>{q ? q.q : t.quiz.start}</Text>
        <Glass style={{ gap: space.s, padding: space.m }}>
          {q ? q.options.map(([id, label]) => {
            const val = q.id === 'hours' ? Number(id) : id;
            const on = a[q.id as keyof Answers] === val && (q.id !== 'hours' || a.hours !== 12 || id === '12');
            return (
              <Pressable key={id} accessibilityRole="button" accessibilityState={{ selected: on }}
                onPress={() => { setA({ ...a, [q.id]: val }); setStep(step + 1); }}
                style={({ pressed }) => [st.opt, { backgroundColor: on ? c.glass.on : c.glass.fill, borderColor: on ? c.glass.onEdge : c.glass.edge, opacity: pressed ? 0.8 : 1 }]}>
                <Text style={[st.optText, { color: on ? '#FFFFFF' : c.text }]}>{label}</Text>
                <Icon name="right" color={on ? '#FFFFFF' : c.muted} s={size.icon - 4} />
              </Pressable>
            );
          }) : (
            <>
              <TimeField label={t.quiz.startLabel} value={start} onChange={setStart} />
              <GlassPill icon="right" label={t.quiz.next} onPress={finish} />
            </>
          )}
        </Glass>
      </ScrollView>
      {step > 0 && <View style={{ paddingHorizontal: space.l, paddingBottom: Math.max(bottom, space.m) }}><Link label={t.quiz.back} muted onPress={() => setStep(step - 1)} /></View>}
    </View>
  );
}

export function Result({ data, top, bottom, onNext }: { data: Saved; top: number; bottom: number; onNext: () => void }) {
  const c = useTheme();
  const p = data.profile;
  const first = t.result.lines[(p.notice || 'late') as keyof typeof t.result.lines];
  const helps = t.result.helpsBy[(p.pain || 'rest') as keyof typeof t.result.helpsBy];
  return (
    <View style={{ flex: 1 }}>
      <Sky top={top} />
      <ScrollView contentContainerStyle={{ paddingTop: top + space.xl, paddingHorizontal: space.m, paddingBottom: space.l, gap: space.m }}>
        <Text style={[st.q, { paddingHorizontal: space.s }]}>{t.result.title}</Text>
        <Glass style={{ gap: space.m }}>
          <Text style={[st.body, { color: c.text }]}>{first}</Text>
          <Text style={[st.body, { color: c.textSoft }]}>{t.result.shift(clock(data.shift.start).text, clock(data.shift.end).text)}</Text>
        </Glass>
        <Glass style={{ gap: space.m }}>
          <Caps>{t.result.helps}</Caps>
          {helps.map((h) => (
            <View key={h} style={st.help}>
              <View style={[st.tick, { backgroundColor: c.glass.on }]}><Icon name="check" color="#FFFFFF" s={14} /></View>
              <Text style={[st.body, { color: c.text, flex: 1 }]}>{h}</Text>
            </View>
          ))}
        </Glass>
      </ScrollView>
      <View style={{ paddingHorizontal: space.m, paddingBottom: Math.max(bottom, space.m), paddingTop: space.s }}>
        <GlassPill icon="right" label={t.result.next} onPress={onNext} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  sky: { position: 'absolute', left: 0, right: 0, top: 0 },
  bar: { flexDirection: 'row', gap: 6, paddingHorizontal: space.s },
  seg: { flex: 1, height: 4, borderRadius: 2 },
  count: { fontFamily: font.textBold, fontSize: type.small.size, color: onSky.soft, paddingHorizontal: space.s },
  q: { fontFamily: font.display, fontSize: type.title.size + 2, lineHeight: type.title.line + 4, letterSpacing: type.title.tracking, color: onSky.text, paddingHorizontal: space.s, marginBottom: space.s },
  opt: { minHeight: size.tap + 6, borderRadius: radius.inner, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.m, gap: space.s },
  optText: { flex: 1, fontFamily: font.textBold, fontSize: type.body.size + 1 },
  body: { fontFamily: font.text, fontSize: type.body.size, lineHeight: type.body.line + 2 },
  help: { flexDirection: 'row', alignItems: 'center', gap: space.m },
  tick: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});
