/**
 * GREY BOX (CHEATSHEET step 7). No design on purpose: system font, greys, plain boxes.
 * It exists to answer one question: is this faster and clearer than the paper roster?
 * The real look comes later (docs/world.md). The rules live in src/core and are tested.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { addDays, dayNumber, monthWeeks, todayKey, weekday } from './src/core/dates';
import { Hours, nextPayday, PaySetup, periodOf, periodPay } from './src/core/pay';
import { Preset, PRESETS } from './src/core/presets';
import { anchorFor, Changes, nextOff, nextWork, plannedOn, Rotation, runLength, ShiftCode, shiftOn } from './src/core/rotation';

const KEY = 'shift-app/grey-box-v1';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const NAME: Record<ShiftCode, string> = { D: 'Day shift', N: 'Night shift', S: 'Swing shift', X: '24-hour shift', O: 'Day off' };
const BOX: Record<ShiftCode, { bg: string; fg: string }> = {
  D: { bg: '#ffffff', fg: '#111111' },
  N: { bg: '#2b2b2b', fg: '#ffffff' },
  S: { bg: '#b5b5b5', fg: '#111111' },
  X: { bg: '#000000', fg: '#ffffff' },
  O: { bg: '#e6e6e6', fg: '#8a8a8a' },
};

interface Saved {
  presetId: string;
  rotation: Rotation;
  hours: Hours;
  changes: Changes;
  pay: PaySetup;
}

function fmt(key: string): string {
  const [, m, d] = key.split('-').map(Number);
  return `${DAYS[weekday(key)].slice(0, 3)}, ${MONTHS[m - 1].slice(0, 3)} ${d}`;
}
function inDays(n: number): string {
  return n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`;
}
function money(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Strip({ cycle, mark, onPick }: { cycle: ShiftCode[]; mark?: number; onPick?: (i: number) => void }) {
  return (
    <View style={s.strip}>
      {cycle.map((code, i) => (
        <Pressable
          key={i}
          disabled={!onPick}
          onPress={() => onPick?.(i)}
          accessibilityRole={onPick ? 'button' : undefined}
          accessibilityLabel={`Day ${i + 1} of the pattern: ${NAME[code]}`}
          style={[s.chip, onPick && s.chipBig, { backgroundColor: BOX[code].bg }, mark === i && s.chipMark]}
        >
          <Text style={{ color: BOX[code].fg, fontSize: onPick ? 15 : 10, fontWeight: '700' }}>{code === 'O' ? '' : code}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function Setup({ onDone }: { onDone: (preset: Preset, position: number) => void }) {
  const [preset, setPreset] = useState<Preset | null>(null);
  if (!preset) {
    return (
      <View>
        <Text style={s.h1}>What is your rotation?</Text>
        <Text style={s.muted}>Pick the one closest to yours. You can change single days later.</Text>
        {PRESETS.map((p) => (
          <Pressable key={p.id} onPress={() => setPreset(p)} accessibilityRole="button" accessibilityLabel={p.name} style={s.row}>
            <Text style={s.rowTitle}>{p.name}</Text>
            <Text style={s.muted}>{p.about}</Text>
            <Strip cycle={p.cycle} />
          </Pressable>
        ))}
      </View>
    );
  }
  return (
    <View>
      <Text style={s.h1}>Where are you today?</Text>
      <Text style={s.muted}>
        This is one full turn of "{preset.name}". Tap the box that is today, {DAYS[weekday(todayKey())]}.
      </Text>
      <Strip cycle={preset.cycle} onPick={(i) => onDone(preset, i)} />
      <Pressable onPress={() => setPreset(null)} accessibilityRole="button" style={s.link}>
        <Text style={s.linkText}>Back to the list</Text>
      </Pressable>
    </View>
  );
}

function Main({ data, change, reset }: { data: Saved; change: (next: Saved) => void; reset: () => void }) {
  const today = todayKey();
  const { rotation, hours, changes, pay } = data;
  const [ym, setYm] = useState(() => ({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) }));
  const weeks = useMemo(() => monthWeeks(ym.y, ym.m), [ym]);

  const now = shiftOn(rotation, today, changes);
  const off = nextOff(rotation, today, changes);
  const work = nextWork(rotation, today, changes);
  const run = runLength(rotation, today, changes);
  let dayOfRun = 0;
  if (now !== 'O') {
    dayOfRun = 1;
    while (dayOfRun < 366 && shiftOn(rotation, addDays(today, -dayOfRun), changes) !== 'O') dayOfRun++;
  }
  const period = periodOf(pay, today);
  const totals = periodPay(rotation, hours, pay, period.start, period.end, changes);
  const payday = nextPayday(pay, today);

  const tapDay = (key: string) => {
    const order: (ShiftCode | null)[] = [null, 'D', 'N', 'O'];
    const next = order[(order.indexOf(changes[key] ?? null) + 1) % order.length];
    const copy = { ...changes };
    if (next === null || next === plannedOn(rotation, key)) delete copy[key];
    else copy[key] = next;
    change({ ...data, changes: copy });
  };
  const setPay = (patch: Partial<PaySetup>) => change({ ...data, pay: { ...pay, ...patch } });

  return (
    <View>
      <View style={s.card}>
        <Text style={s.label}>TODAY · {fmt(today).toUpperCase()}</Text>
        <Text style={s.big}>{NAME[now]}</Text>
        {now !== 'O' ? (
          <Text style={s.line}>
            {hours[now]} hours · day {dayOfRun} of {run} in a row
          </Text>
        ) : null}
        {now !== 'O' && off ? (
          <Text style={s.line}>
            Next day off: {fmt(off)} ({inDays(dayNumber(off) - dayNumber(today))})
          </Text>
        ) : null}
        {now === 'O' && work ? (
          <Text style={s.line}>
            Back to work: {fmt(work)} ({inDays(dayNumber(work) - dayNumber(today))}), {NAME[shiftOn(rotation, work, changes)].toLowerCase()}
          </Text>
        ) : null}
      </View>

      <View style={s.card}>
        <Text style={s.label}>THIS PAY PERIOD · {fmt(period.start).toUpperCase()} TO {fmt(period.end).toUpperCase()}</Text>
        <Text style={s.big}>{totals.hours} hours</Text>
        <Text style={s.line}>
          {totals.regular} regular{totals.overtime ? ` + ${totals.overtime} overtime (over 40 in a week)` : ''}
        </Text>
        {totals.gross !== null ? <Text style={s.line}>About {money(totals.gross)} before taxes. An estimate.</Text> : null}
        <Text style={s.line}>
          Payday: {fmt(payday)} ({inDays(dayNumber(payday) - dayNumber(today))})
        </Text>
        <View style={s.controls}>
          <Text style={s.small}>Hourly rate $</Text>
          <TextInput
            accessibilityLabel="Hourly rate in dollars"
            keyboardType="decimal-pad"
            defaultValue={pay.rate ? String(pay.rate) : ''}
            placeholder="0.00"
            onChangeText={(text) => setPay({ rate: Math.max(0, Number(text.replace(',', '.')) || 0) })}
            style={s.input}
          />
          <Pressable onPress={() => setPay({ length: pay.length === 14 ? 7 : 14 })} accessibilityRole="button" style={s.pill}>
            <Text style={s.small}>Paid {pay.length === 14 ? 'every 2 weeks' : 'weekly'}</Text>
          </Pressable>
        </View>
        <View style={s.controls}>
          <Text style={s.small}>Period starts {fmt(period.start)}</Text>
          <Pressable onPress={() => setPay({ anchor: addDays(pay.anchor, -1) })} accessibilityRole="button" accessibilityLabel="Pay period starts one day earlier" style={s.pill}>
            <Text style={s.small}>− day</Text>
          </Pressable>
          <Pressable onPress={() => setPay({ anchor: addDays(pay.anchor, 1) })} accessibilityRole="button" accessibilityLabel="Pay period starts one day later" style={s.pill}>
            <Text style={s.small}>+ day</Text>
          </Pressable>
        </View>
        <View style={s.controls}>
          <Text style={s.small}>Payday {pay.paydayAfter} days after it ends</Text>
          <Pressable onPress={() => setPay({ paydayAfter: Math.max(0, pay.paydayAfter - 1) })} accessibilityRole="button" accessibilityLabel="Payday one day sooner" style={s.pill}>
            <Text style={s.small}>−</Text>
          </Pressable>
          <Pressable onPress={() => setPay({ paydayAfter: Math.min(21, pay.paydayAfter + 1) })} accessibilityRole="button" accessibilityLabel="Payday one day later" style={s.pill}>
            <Text style={s.small}>+</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.card}>
        <View style={s.monthHead}>
          <Pressable onPress={() => setYm(ym.m === 1 ? { y: ym.y - 1, m: 12 } : { y: ym.y, m: ym.m - 1 })} accessibilityRole="button" accessibilityLabel="Month before" style={s.pill}>
            <Text style={s.small}>‹</Text>
          </Pressable>
          <Text style={s.rowTitle}>
            {MONTHS[ym.m - 1]} {ym.y}
          </Text>
          <Pressable onPress={() => setYm(ym.m === 12 ? { y: ym.y + 1, m: 1 } : { y: ym.y, m: ym.m + 1 })} accessibilityRole="button" accessibilityLabel="Month after" style={s.pill}>
            <Text style={s.small}>›</Text>
          </Pressable>
        </View>
        <View style={s.week}>
          {DAYS.map((d) => (
            <Text key={d} style={[s.cellHead, s.small]}>
              {d[0]}
            </Text>
          ))}
        </View>
        {weeks.map((week, i) => (
          <View key={i} style={s.week}>
            {week.map((key, j) => {
              if (!key) return <View key={j} style={s.cell} />;
              const code = shiftOn(rotation, key, changes);
              const changed = changes[key] !== undefined;
              return (
                <Pressable
                  key={j}
                  onPress={() => tapDay(key)}
                  accessibilityRole="button"
                  accessibilityLabel={`${fmt(key)}: ${NAME[code]}${changed ? ', changed' : ''}`}
                  style={[s.cell, { backgroundColor: BOX[code].bg }, key === today && s.today]}
                >
                  <Text style={{ color: BOX[code].fg, fontSize: 12 }}>{Number(key.slice(8))}</Text>
                  <Text style={{ color: BOX[code].fg, fontSize: 16, fontWeight: '700' }}>{code === 'O' ? '' : code}</Text>
                  {changed ? <View style={[s.dot, { backgroundColor: BOX[code].fg }]} /> : null}
                </Pressable>
              );
            })}
          </View>
        ))}
        <Text style={s.muted}>Tap a day to change it: day, night, off, then back to the rotation. A dot marks a changed day.</Text>
      </View>

      <Pressable onPress={reset} accessibilityRole="button" style={s.link}>
        <Text style={s.linkText}>Change my rotation</Text>
      </Pressable>
      <Text style={s.muted}>Test version with no design yet. Hours and pay are estimates.</Text>
    </View>
  );
}

function Screen() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<Saved | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((text) => {
        if (text) setData(JSON.parse(text) as Saved);
      })
      .catch((error) => console.warn('Could not read the saved rotation', error))
      .finally(() => setReady(true));
  }, []);
  const change = (next: Saved | null) => {
    setData(next);
    const job = next ? AsyncStorage.setItem(KEY, JSON.stringify(next)) : AsyncStorage.removeItem(KEY);
    job.catch((error) => console.warn('Could not save', error));
  };

  if (!ready) return null;
  return (
    <ScrollView style={s.page} contentContainerStyle={{ padding: 16, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }} keyboardShouldPersistTaps="handled">
      <View style={s.column}>
        {data ? (
          <Main data={data} change={change} reset={() => change(null)} />
        ) : (
          <Setup
            onDone={(preset, position) => {
              const today = todayKey();
              // Guess: the pay period starts on the Sunday of this week, two weeks long, paid the Friday after.
              const sunday = addDays(today, -weekday(today));
              change({
                presetId: preset.id,
                rotation: { cycle: preset.cycle, anchor: anchorFor(today, position) },
                hours: { D: preset.hours, N: preset.hours, S: preset.hours, X: preset.hours, O: 0 },
                changes: {},
                pay: { length: 14, anchor: sunday, paydayAfter: 6, weekStarts: 0, rate: 0 },
              });
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Screen />
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f4f4f4' },
  column: { width: '100%', maxWidth: 520, alignSelf: 'center' },
  h1: { fontSize: 26, fontWeight: '700', color: '#111', marginBottom: 6 },
  muted: { fontSize: 14, color: '#666', marginTop: 4, lineHeight: 20 },
  row: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 12, marginTop: 10 },
  rowTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  strip: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 8 },
  chip: { width: 16, height: 16, borderWidth: 1, borderColor: '#999', alignItems: 'center', justifyContent: 'center' },
  chipBig: { width: 44, height: 48 },
  chipMark: { borderWidth: 3, borderColor: '#111' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 14, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#666', letterSpacing: 0.5 },
  big: { fontSize: 32, fontWeight: '800', color: '#111', marginTop: 2 },
  line: { fontSize: 16, color: '#222', marginTop: 4, lineHeight: 22 },
  small: { fontSize: 14, color: '#222' },
  controls: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#999', paddingHorizontal: 8, paddingVertical: 6, minWidth: 70, fontSize: 16, backgroundColor: '#fff' },
  pill: { borderWidth: 1, borderColor: '#999', paddingHorizontal: 12, minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' },
  monthHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  week: { flexDirection: 'row' },
  cellHead: { flex: 1, textAlign: 'center', paddingVertical: 4, color: '#666' },
  cell: { flex: 1, aspectRatio: 0.9, borderWidth: 0.5, borderColor: '#bbb', alignItems: 'center', justifyContent: 'center' },
  today: { borderWidth: 3, borderColor: '#d00' },
  dot: { position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: 3 },
  link: { minHeight: 44, justifyContent: 'center', marginTop: 4 },
  linkText: { fontSize: 16, color: '#111', textDecorationLine: 'underline' },
});
