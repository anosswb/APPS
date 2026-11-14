import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getHint, Hint, isSolved, visibleProblems } from '../game/hints';
import { GRASS, Puzzle, TENT, UNKNOWN } from '../game/types';
import { clock, t } from '../i18n/en';
import { GameSave } from '../store/save';
import { useTheme } from '../theme/ThemeContext';
import { hairline, space, tapMin } from '../theme/tokens';
import { Board } from '../ui/Board';
import { Btn } from '../ui/Btn';
import { Chevron } from '../ui/Glyphs';
import { haptic } from '../ui/haptics';
import { sound } from '../ui/sound';
import { Rule } from '../ui/Rule';
import { Stamp } from '../ui/Stamp';
import { Type } from '../ui/Type';

interface Props {
  puzzle: Puzzle;
  title: string;
  initial?: GameSave;
  /** opened to look at a puzzle that was already solved */
  alreadySolved?: boolean;
  /** show the short "how to mark" line */
  showLegend?: boolean;
  nextLabel?: string;
  /** a quiet line above the buttons once the puzzle is solved */
  afterLine?: string;
  /** a small notice under that line (the daily-reminder question) */
  afterExtra?: React.ReactNode;
  onKeep: (game: GameSave) => void;
  onSolved: (ms: number, hints: number) => void;
  /** for the anonymous numbers: which kind of hint was shown */
  onHint?: (kind: string, what?: string) => void;
  onNext?: () => void;
  onExit: () => void;
  onRules: () => void;
}

export function Game({ puzzle, title, initial, alreadySolved, showLegend, nextLabel, afterLine, afterExtra, onKeep, onSolved, onHint: reportHint, onNext, onExit, onRules }: Props) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const size = puzzle.n * puzzle.n;

  const [marks, setMarks] = useState<number[]>(() =>
    initial && initial.marks.length === size ? initial.marks.slice() : new Array(size).fill(UNKNOWN),
  );
  const [undo, setUndo] = useState<number[][]>([]);
  const [hints, setHints] = useState(initial?.hints ?? 0);
  const [hint, setHint] = useState<Hint | null>(null);
  const [solved, setSolved] = useState(() => !!alreadySolved || (!!initial && isSolved(puzzle, initial.marks)));
  const [finalMs, setFinalMs] = useState(initial?.ms ?? 0);
  const freshWin = useRef(false);

  // Time on the puzzle, counted only while the app is open. Kept for the solved line, never shown as pressure.
  const banked = useRef(initial?.ms ?? 0);
  const since = useRef(Date.now());
  const elapsed = useCallback(() => banked.current + (Date.now() - since.current), []);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') since.current = Date.now();
      else {
        banked.current += Date.now() - since.current;
        since.current = Date.now();
      }
    });
    return () => sub.remove();
  }, []);

  // What a drag is painting: the mark, and the mark it replaces.
  const stroke = useRef<{ to: number; from: number } | null>(null);

  const commit = useCallback(
    (next: number[], hintCount: number) => {
      setMarks(next);
      const won = isSolved(puzzle, next);
      const ms = elapsed();
      onKeep({ marks: next, ms, hints: hintCount });
      if (won && !solved) {
        freshWin.current = true;
        setSolved(true);
        setFinalMs(ms);
        setHint(null);
        haptic.stamp();
        sound.stamp();
        onSolved(ms, hintCount);
      }
    },
    [elapsed, onKeep, onSolved, puzzle, solved],
  );

  const onStrokeStart = useCallback(
    (i: number) => {
      if (solved || puzzle.trees[i]) {
        stroke.current = null;
        return;
      }
      const from = marks[i];
      const to = (from + 1) % 3;
      stroke.current = { to, from };
      setUndo((u) => [...u.slice(-199), marks]);
      setHint(null);
      const next = marks.slice();
      next[i] = to;
      if (to === TENT) {
        haptic.tent();
        sound.peg();
      } else {
        haptic.mark();
        sound.pencil();
      }
      commit(next, hints);
    },
    [commit, hints, marks, puzzle.trees, solved],
  );

  const onStrokeMove = useCallback(
    (i: number) => {
      const s = stroke.current;
      // Dragging paints grass or clears. Tents are placed one deliberate tap at a time.
      if (!s || s.to === TENT || solved || puzzle.trees[i] || marks[i] !== s.from) return;
      const next = marks.slice();
      next[i] = s.to;
      haptic.mark();
      sound.pencil();
      commit(next, hints);
    },
    [commit, hints, marks, puzzle.trees, solved],
  );

  const onUndo = useCallback(() => {
    if (!undo.length || solved) return;
    const previous = undo[undo.length - 1];
    setUndo((u) => u.slice(0, -1));
    setHint(null);
    commit(previous, hints);
  }, [commit, hints, solved, undo]);

  const onHint = useCallback(() => {
    if (solved) return;
    const h = getHint(puzzle, marks);
    setHint(h);
    reportHint?.(h.kind, h.kind === 'step' ? h.step.technique : h.kind === 'mistake' ? h.reason : undefined);
    const count = hints + 1;
    setHints(count);
    onKeep({ marks, ms: elapsed(), hints: count });
  }, [elapsed, hints, marks, onKeep, puzzle, reportHint, solved]);

  const applyHint = useCallback(() => {
    if (!hint) return;
    const next = marks.slice();
    if (hint.kind === 'step') for (const i of hint.step.cells) next[i] = hint.step.mark;
    else if (hint.kind === 'reveal') for (const i of hint.cells) next[i] = hint.mark;
    else if (hint.kind === 'mistake') for (const i of hint.cells) next[i] = UNKNOWN;
    setUndo((u) => [...u.slice(-199), marks]);
    setHint(null);
    sound.pencil();
    commit(next, hints);
  }, [commit, hint, hints, marks]);

  const problems = useMemo(() => visibleProblems(puzzle, marks), [puzzle, marks]);
  const focus = hint?.kind === 'step' ? hint.step.cells : hint?.kind === 'reveal' || hint?.kind === 'mistake' ? hint.cells : undefined;
  const because = hint?.kind === 'step' ? hint.step.because : undefined;
  const line = hint?.kind === 'step' ? hint.step.line : hint?.kind === 'mistake' ? hint.line : undefined;

  const boardWidth = Math.min(window.width - space.l * 2, 520);
  const empty = !marks.some((m) => m === GRASS || m === TENT);

  const tentsWanted = useMemo(() => puzzle.solution.filter(Boolean).length, [puzzle]);
  const tentsPlaced = marks.filter((m) => m === TENT).length;

  return (
    <View style={[styles.screen, { backgroundColor: c.bg }]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.page, { paddingTop: insets.top + space.s, paddingBottom: space.xl + (solved ? insets.bottom : 0) }]}
        scrollEnabled={solved || !!hint}
      >
        <View style={[styles.column, { width: boardWidth }]}>
          <View style={styles.bar}>
            <Pressable accessibilityRole="button" accessibilityLabel={t.game.back} onPress={onExit} hitSlop={8} style={styles.back}>
              <Chevron size={20} color={c.text} />
              <Type variant="label">{t.game.back}</Type>
            </Pressable>
            <Btn label={t.game.rules} kind="quiet" onPress={onRules} />
          </View>
          <Rule strong />
          <Type variant="title" accessibilityRole="header" style={styles.title}>
            {title}
          </Type>
          <View style={styles.metaRow}>
            <Type variant="label" tone="muted">
              {t.sizeLine(puzzle.n, puzzle.grade)}
            </Type>
            <Type variant="label" tone={tentsPlaced > tentsWanted ? 'accent' : 'muted'}>
              {t.game.tents(tentsPlaced, tentsWanted)}
            </Type>
          </View>

          <View>
            <Board
              puzzle={puzzle}
              marks={marks}
              width={boardWidth}
              locked={solved}
              focus={focus}
              because={because}
              line={line}
              problems={problems.touching}
              overLines={problems.over}
              onStrokeStart={onStrokeStart}
              onStrokeMove={onStrokeMove}
            />
            {solved ? (
              <View style={styles.stampOver} pointerEvents="none">
                <Stamp word={t.game.solvedStamp} animate={freshWin.current} />
              </View>
            ) : null}
          </View>

          {solved ? (
            <View style={styles.after}>
              <Type variant="bodyItalic" tone="muted" style={styles.center}>
                {t.game.solvedLine(clock(finalMs), hints)}
              </Type>
              {afterLine ? (
                <Type tone="muted" style={[styles.center, styles.afterBtn]}>
                  {afterLine}
                </Type>
              ) : null}
              {afterExtra}
              {onNext ? <Btn label={nextLabel ?? t.game.next} onPress={onNext} style={styles.afterBtn} /> : null}
              <Btn label={t.game.home} kind="outline" onPress={onExit} style={styles.afterBtn} />
            </View>
          ) : hint ? (
            <View style={styles.note} accessibilityLiveRegion="polite">
              <Rule />
              <Type variant="bodyItalic" style={styles.noteText}>
                {t.hint(hint)}
              </Type>
              <View style={styles.noteActions}>
                {hint.kind !== 'solved' ? (
                  <Btn label={hint.kind === 'mistake' ? t.game.clearThem : t.game.markIt} kind="quiet" onPress={applyHint} />
                ) : null}
                <Btn label={t.game.gotIt} kind="quiet" onPress={() => setHint(null)} />
              </View>
              <Rule />
            </View>
          ) : showLegend || empty ? (
            <Type tone="muted" style={[styles.center, styles.legend]}>
              {t.game.legend}
            </Type>
          ) : null}
        </View>
      </ScrollView>

      {solved ? null : (
        <View style={[styles.dock, { borderTopColor: c.rule, backgroundColor: c.bg, paddingBottom: insets.bottom + space.m }]}>
          <View style={[styles.tools, { width: boardWidth }]}>
            <Btn label={t.game.undo} kind="outline" onPress={onUndo} disabled={!undo.length} style={styles.tool} />
            <Btn label={t.game.hint} kind="outline" onPress={onHint} style={styles.tool} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { alignItems: 'center', paddingHorizontal: space.l },
  column: { maxWidth: 520 },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: tapMin },
  back: { flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: tapMin, paddingRight: space.m },
  title: { marginTop: space.l },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xs, marginBottom: space.m },
  stampOver: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  screen: { flex: 1 },
  dock: { alignItems: 'center', paddingTop: space.m, paddingHorizontal: space.l, borderTopWidth: hairline },
  tools: { flexDirection: 'row', gap: space.m, maxWidth: 520 },
  tool: { flex: 1 },
  note: { marginTop: space.l },
  noteText: { marginTop: space.m },
  noteActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: space.s, marginVertical: space.xs },
  legend: { marginTop: space.l },
  center: { textAlign: 'center' },
  after: { marginTop: space.l },
  afterBtn: { marginTop: space.m },
});
