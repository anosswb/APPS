import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME } from '../config/app';
import { bookSpec } from '../game/book';
import { challengePuzzle, inkDrops, raceLimitMs } from '../game/challenge';
import { dailyPuzzle, keyToDate, weekOf } from '../game/daily';
import { clock, t } from '../i18n/en';
import { useStore } from '../store/Store';
import { useTheme } from '../theme/ThemeContext';
import { hairline, space } from '../theme/tokens';
import { Btn } from '../ui/Btn';
import { InkGauge } from '../ui/Gauge';
import { InkPot, Stopwatch } from '../ui/Glyphs';
import { LevelStrip } from '../ui/LevelStrip';
import { MiniGrid } from '../ui/MiniGrid';
import { Rule } from '../ui/Rule';
import { Stamp } from '../ui/Stamp';
import { Type } from '../ui/Type';

interface Props {
  today: string;
  onDaily: () => void;
  onBook: () => void;
  onChallenge: (kind: 'race' | 'ink') => void;
  onRules: () => void;
  onArchive: () => void;
  onSettings: () => void;
  /** shown only when the full edition can really be bought and is not owned yet */
  onFullEdition?: () => void;
  bookIsLocked?: boolean;
}

/** The front page: masthead, the main game (one pot of ink), the clock, today's puzzle, free play. */
export function Home({ today, onDaily, onBook, onChallenge, onRules, onArchive, onSettings, onFullEdition, bookIsLocked }: Props) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { save } = useStore();
  const date = keyToDate(today);
  const puzzle = useMemo(() => dailyPuzzle(today), [today]);
  const done = save.daily[today];
  const started = !!save.games[puzzle.id]?.marks.some((m) => m !== 0);
  const spec = bookSpec(save.book.level, save.book.relief);
  const week = weekOf(today);
  const window = useWindowDimensions();
  const column = Math.min(window.width - space.xl * 2, 520);
  const ink = save.challenge.ink;
  const race = save.challenge.race;
  const inkPuzzle = useMemo(() => challengePuzzle('ink', ink.level), [ink.level]);
  const inkTents = inkPuzzle.solution.filter(Boolean).length;
  const inkPot = inkDrops(inkTents, ink.slack);
  const racePuzzle = useMemo(() => challengePuzzle('race', race.level), [race.level]);
  const raceTime = raceLimitMs(racePuzzle.n, racePuzzle.grade, race.factor);
  const bestSizes = Object.keys(save.records.best)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.page, { paddingTop: insets.top + space.l, paddingBottom: insets.bottom + space.xxl }]}
    >
      <View style={styles.column}>
        <Type variant="label" tone="muted" style={styles.center}>
          {t.dateLine(date)}
        </Type>
        <Type variant="masthead" accessibilityRole="header" style={[styles.center, styles.masthead]}>
          {APP_NAME}
        </Type>
        <Rule double />
        <Type variant="bodyItalic" tone="muted" style={[styles.center, styles.tagline]}>
          {t.home.tagline}
        </Type>

        {/* The main game: one pot of ink, set like the lead story of the page. */}
        <Type variant="label" tone="accent" style={styles.kicker}>
          {t.challenge.lead}
        </Type>
        <View style={styles.lead}>
          <View style={styles.leadText}>
            <Type variant="headline" accessibilityRole="header">
              {t.challenge.name.ink}
            </Type>
            <Type variant="label" tone="muted" style={styles.meta}>
              {`${t.challenge.level(ink.level)} · ${t.sizeLine(inkPuzzle.n, inkPuzzle.grade)}`}
            </Type>
          </View>
          <InkPot size={64} color={c.text} accent={c.accent} paper={c.bg} />
        </View>
        <Type tone="muted">{t.challenge.deck.ink(inkTents, inkPot)}</Type>
        <View style={styles.gauge}>
          <InkGauge total={inkPot} left={inkPot} width={column} showCount={false} />
        </View>
        {save.records.ink.best ? (
          <Type variant="label" tone="accent" style={styles.run}>
            {t.challenge.run(save.records.ink.streak, save.records.ink.best)}
          </Type>
        ) : null}
        <Btn label={t.challenge.play(ink.level)} onPress={() => onChallenge('ink')} style={styles.wide} />

        <View style={styles.gap} />
        <Rule />
        <View style={[styles.lead, styles.second]}>
          <View style={styles.leadText}>
            <Type variant="label" tone="muted" style={styles.kickerTight}>
              {t.challenge.second}
            </Type>
            <Type variant="title" accessibilityRole="header">
              {t.challenge.name.race}
            </Type>
            <Type variant="label" tone="muted" style={styles.meta}>
              {`${t.challenge.level(race.level)} · ${t.sizeLine(racePuzzle.n, racePuzzle.grade)}`}
            </Type>
          </View>
          <Stopwatch size={52} color={c.text} accent={c.accent} />
        </View>
        <Type tone="muted">{t.challenge.deck.race(clock(raceTime))}</Type>
        {save.records.race.best ? (
          <Type variant="label" tone="accent" style={styles.run}>
            {t.challenge.run(save.records.race.streak, save.records.race.best)}
          </Type>
        ) : null}
        <Btn label={t.challenge.play(race.level)} kind="outline" onPress={() => onChallenge('race')} style={styles.wide} />

        <View style={styles.gap} />
        <Rule double />
        <Type variant="label" tone="accent" style={styles.kicker}>
          {t.home.today}
        </Type>
        <View style={styles.lead}>
          <View>
            <MiniGrid puzzle={puzzle} width={112} />
            {done ? (
              <View style={styles.stampOver} pointerEvents="none">
                <Stamp word={t.home.solved} animate={false} small />
              </View>
            ) : null}
          </View>
          <View style={styles.leadText}>
            <Type variant="title" accessibilityRole="header">
              {t.home.dailyTitle(date)}
            </Type>
            <Type variant="label" tone="muted" style={styles.meta}>
              {t.sizeLine(puzzle.n, puzzle.grade)}
            </Type>
            <Type tone="muted">{t.home.dailyBlurb}</Type>
          </View>
        </View>
        <Btn label={done ? t.home.look : started ? t.home.resume : t.home.start} kind="outline" onPress={onDaily} style={styles.wide} />

        <View style={styles.weekHead}>
          <Type variant="label" tone="muted">
            {t.home.week}
          </Type>
          <Btn label={t.home.past} kind="quiet" onPress={onArchive} />
        </View>
        <View style={styles.week}>
          {week.map((key) => {
            const solved = !!save.daily[key];
            const isToday = key === today;
            return (
              <View key={key} style={styles.day} accessible accessibilityLabel={`${t.days[keyToDate(key).getDay()]}${solved ? ', solved' : ''}`}>
                <View
                  style={[
                    styles.dayBox,
                    { borderColor: isToday ? c.text : c.rule, borderWidth: isToday ? 1.5 : hairline },
                    solved && { backgroundColor: c.accent, borderColor: c.accent },
                  ]}
                />
                <Type variant="label" tone={isToday ? 'text' : 'muted'}>
                  {t.dayShort(keyToDate(key))}
                </Type>
              </View>
            );
          })}
        </View>

        <View style={styles.gap} />
        <Rule />
        <Type variant="label" tone="muted" style={styles.kicker}>
          {t.home.book}
        </Type>
        <View style={styles.bookRow}>
          <View style={styles.leadText}>
            <Type variant="title" accessibilityRole="header">
              {t.home.bookTitle(save.book.level)}
            </Type>
            <Type variant="label" tone="muted" style={styles.meta}>
              {t.sizeLine(spec.n, spec.grade)}
            </Type>
            <Type tone="muted">{bookIsLocked ? t.full.bookEnd : t.home.bookBlurb(save.book.solved)}</Type>
          </View>
        </View>
        <LevelStrip level={save.book.level} relief={save.book.relief} />
        <Btn label={bookIsLocked ? t.archive.seeFull : t.home.play(save.book.level)} kind="outline" onPress={onBook} style={styles.wide} />

        {bestSizes.length ? (
          <>
            <View style={styles.gap} />
            <Rule />
            <Type variant="label" tone="muted" style={styles.kicker}>
              {t.records.kicker}
            </Type>
            <Type tone="muted">{t.records.blurb}</Type>
            <Type variant="number" style={styles.challenge}>
              {bestSizes.map((n) => t.records.time(n, clock(save.records.best[String(n)]))).join('  ·  ')}
            </Type>
          </>
        ) : null}

        <View style={styles.gap} />
        <Rule />
        <View style={styles.footer}>
          <Btn label={t.home.rules} kind="quiet" onPress={onRules} />
          <Btn label={t.home.settings} kind="quiet" onPress={onSettings} />
          {onFullEdition ? <Btn label={t.full.homeLink} kind="quiet" onPress={onFullEdition} /> : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: space.xl, alignItems: 'center' },
  column: { width: '100%', maxWidth: 520 },
  center: { textAlign: 'center' },
  masthead: { marginTop: space.xs, marginBottom: space.s },
  tagline: { marginTop: space.s },
  kicker: { marginTop: space.xl, marginBottom: space.m },
  lead: { flexDirection: 'row', gap: space.l, alignItems: 'flex-start' },
  leadText: { flex: 1 },
  meta: { marginTop: space.xs, marginBottom: space.s },
  stampOver: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  wide: { marginTop: space.l },
  challenge: { marginTop: space.m },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: space.xs },
  dayBox: { width: 30, height: 30 },
  gauge: { marginTop: space.l },
  run: { marginTop: space.m },
  second: { marginTop: space.l },
  kickerTight: { marginBottom: space.xs },
  gap: { height: space.xl },
  bookRow: { flexDirection: 'row' },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: space.l, marginTop: space.s },
  weekHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.m, marginBottom: space.xs },
});
