import React, { useMemo, useRef } from 'react';
import { PanResponder, Pressable, StyleSheet, View } from 'react-native';

import { Line, Puzzle, TENT, GRASS } from '../game/types';
import { t } from '../i18n/en';
import { useTheme } from '../theme/ThemeContext';
import { font, hairline } from '../theme/tokens';
import { Grass, Tent, Tree } from './Glyphs';
import { Type } from './Type';
import { useScreenReader } from './useScreenReader';

interface Props {
  puzzle: Puzzle;
  marks: number[];
  /** total width available, numbers included */
  width: number;
  locked?: boolean;
  /** squares the hint is about (highlighter pen) */
  focus?: number[];
  /** squares that explain the hint (outlined) */
  because?: number[];
  /** the row or column the hint is about */
  line?: Line;
  /** squares that break a visible rule */
  problems?: number[];
  overLines?: Line[];
  onStrokeStart?: (cell: number) => void;
  onStrokeMove?: (cell: number) => void;
}

export function boardMetrics(n: number, width: number): { cell: number; edge: number } {
  const cell = Math.floor((width - 3) / (n + 0.62));
  return { cell, edge: Math.floor(cell * 0.62) };
}

/** The puzzle grid with its numbers. It only draws and reports touches; the screen decides what a touch means. */
export function Board({ puzzle, marks, width, locked, focus, because, line, problems, overLines, onStrokeStart, onStrokeMove }: Props) {
  const { c } = useTheme();
  // With a screen reader on, every square is its own button and the drag layer is taken away.
  const reader = useScreenReader();
  const n = puzzle.n;
  const { cell, edge } = boardMetrics(n, width);
  const last = useRef(-1);
  const handlers = useRef({ onStrokeStart, onStrokeMove, locked, cell, n });
  handlers.current = { onStrokeStart, onStrokeMove, locked, cell, n };

  const pan = useMemo(() => {
    const cellAt = (x: number, y: number): number => {
      const h = handlers.current;
      const col = Math.floor(x / h.cell);
      const row = Math.floor(y / h.cell);
      if (col < 0 || row < 0 || col >= h.n || row >= h.n) return -1;
      return row * h.n + col;
    };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !handlers.current.locked,
      onMoveShouldSetPanResponder: () => !handlers.current.locked,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const i = cellAt(e.nativeEvent.locationX, e.nativeEvent.locationY);
        last.current = i;
        if (i >= 0) handlers.current.onStrokeStart?.(i);
      },
      onPanResponderMove: (e) => {
        const i = cellAt(e.nativeEvent.locationX, e.nativeEvent.locationY);
        if (i < 0 || i === last.current) return;
        last.current = i;
        handlers.current.onStrokeMove?.(i);
      },
    });
  }, []);

  const focusSet = new Set(focus);
  const becauseSet = new Set(because);
  const problemSet = new Set(problems);
  const numberSize = Math.max(13, Math.min(20, Math.round(cell * 0.42)));
  const glyph = Math.round(cell * 0.78);

  const count = (kind: 'row' | 'col', index: number) => {
    const want = kind === 'row' ? puzzle.rows[index] : puzzle.cols[index];
    let have = 0;
    for (let k = 0; k < n; k++) if (marks[kind === 'row' ? index * n + k : k * n + index] === TENT) have++;
    const over = !!overLines?.some((l) => l.kind === kind && l.index === index);
    const lit = line?.kind === kind && line.index === index;
    return (
      <View
        key={`${kind}${index}`}
        accessible={reader}
        accessibilityLabel={reader ? t.game.lineCount(kind, index + 1, want, have) : undefined}
        style={[
          styles.count,
          kind === 'row' ? { width: edge, height: cell } : { width: cell, height: edge },
          lit && { backgroundColor: c.highlight },
        ]}
      >
        <Type
          variant="number"
          tone={over ? 'accent' : have === want ? 'muted' : 'text'}
          style={{ fontSize: numberSize, lineHeight: numberSize * 1.2, fontFamily: have === want && !over ? font.serif : font.serifBold }}
        >
          {want}
        </Type>
      </View>
    );
  };

  return (
    <View accessible={!reader} accessibilityLabel={t.game.gridLabel(n)} style={{ width: edge + cell * n + 3 }}>
      <View style={styles.row}>
        <View style={{ width: edge, height: edge }} />
        {Array.from({ length: n }, (_, col) => count('col', col))}
      </View>
      <View style={styles.row}>
        <View>{Array.from({ length: n }, (_, row) => count('row', row))}</View>
        <View style={[styles.grid, { borderColor: c.text, backgroundColor: c.surface }]}>
          {Array.from({ length: n }, (_, row) => (
            <View key={row} style={styles.row}>
              {Array.from({ length: n }, (_, col) => {
                const i = row * n + col;
                const mark = marks[i];
                const bg = focusSet.has(i) ? c.highlight : problemSet.has(i) ? c.wash : undefined;
                const what = puzzle.trees[i] ? 'tree' : mark === TENT ? 'tent' : mark === GRASS ? 'grass' : 'empty';
                const canChange = reader && !locked && !puzzle.trees[i];
                const Square = canChange ? Pressable : View;
                return (
                  <Square
                    key={col}
                    accessible={reader}
                    accessibilityRole={canChange ? 'button' : undefined}
                    accessibilityLabel={reader ? t.game.square(row + 1, col + 1, what, problemSet.has(i)) : undefined}
                    accessibilityHint={canChange ? t.game.squareHint : undefined}
                    onPress={canChange ? () => onStrokeStart?.(i) : undefined}
                    style={[
                      styles.cell,
                      { width: cell, height: cell, borderColor: c.rule },
                      col === n - 1 && { borderRightWidth: 0 },
                      row === n - 1 && { borderBottomWidth: 0 },
                      bg ? { backgroundColor: bg } : null,
                    ]}
                  >
                    {puzzle.trees[i] ? (
                      <Tree size={glyph} color={c.pine} />
                    ) : mark === TENT ? (
                      <Tent size={glyph} color={c.accent} paper={bg ?? c.surface} />
                    ) : mark === GRASS ? (
                      <Grass size={glyph} color={c.muted} />
                    ) : null}
                    {becauseSet.has(i) ? <View pointerEvents="none" style={[styles.ring, { borderColor: c.text }]} /> : null}
                  </Square>
                );
              })}
            </View>
          ))}
          {reader ? null : <View style={StyleSheet.absoluteFill} {...pan.panHandlers} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  count: { alignItems: 'center', justifyContent: 'center' },
  grid: { borderWidth: 1.5 },
  cell: { borderRightWidth: hairline, borderBottomWidth: hairline, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 2 },
});
