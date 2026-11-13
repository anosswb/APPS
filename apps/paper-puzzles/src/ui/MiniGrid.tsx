import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Puzzle } from '../game/types';
import { useTheme } from '../theme/ThemeContext';
import { hairline } from '../theme/tokens';
import { Tree } from './Glyphs';

/** A small picture of a puzzle for the front page: the trees only, never the answer. */
export function MiniGrid({ puzzle, width }: { puzzle: Puzzle; width: number }) {
  const { c } = useTheme();
  const n = puzzle.n;
  const cell = Math.floor((width - 3) / n);
  return (
    <View accessible={false} style={[styles.grid, { borderColor: c.text, backgroundColor: c.surface }]}>
      {Array.from({ length: n }, (_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: n }, (_, col) => (
            <View
              key={col}
              style={[
                styles.cell,
                { width: cell, height: cell, borderColor: c.rule },
                col === n - 1 && { borderRightWidth: 0 },
                row === n - 1 && { borderBottomWidth: 0 },
              ]}
            >
              {puzzle.trees[row * n + col] ? <Tree size={Math.round(cell * 0.86)} color={c.pine} /> : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { borderWidth: 1.5, alignSelf: 'flex-start' },
  row: { flexDirection: 'row' },
  cell: { borderRightWidth: hairline, borderBottomWidth: hairline, alignItems: 'center', justifyContent: 'center' },
});
