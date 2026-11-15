import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** The three marks of the puzzle, drawn like rubber stamps and pencil strokes. Our own drawings. */

export function Tree({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M11 18.5h2V22h-2z" fill={color} />
      <Path d="M12 2.2 16.6 8.4H14.4L18.7 13.6H15.9L20.6 19H3.4L8.1 13.6H5.3L9.6 8.4H7.4z" fill={color} />
    </Svg>
  );
}

export function Tent({ size, color, paper }: { size: number; color: string; paper: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 5.2V2.6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M12 4.4 21.6 20H2.4z" fill={color} />
      <Path d="M12 11.5 15.4 20H8.6z" fill={paper} />
    </Svg>
  );
}

export function Grass({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M8.6 15.5 7.4 10.6M12 15.5V9.4M15.4 15.5 16.6 10.6" stroke={color} strokeWidth={1.7} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function Chevron({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M14.5 5 7.5 12l7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/** One drop of ink. `full` = still in the pot; an empty drop is only its outline. */
export function Drop({ size, color, full }: { size: number; color: string; full: boolean }) {
  return (
    <Svg width={size} height={size * 1.3} viewBox="0 0 20 26">
      <Path
        d="M10 1.5C10 1.5 2.5 11 2.5 16.5a7.5 7.5 0 0 0 15 0C17.5 11 10 1.5 10 1.5z"
        fill={full ? color : 'none'}
        stroke={color}
        strokeWidth={full ? 0 : 1.4}
        opacity={full ? 1 : 0.45}
      />
    </Svg>
  );
}

/** The ink pot of the main game: a squat bottle with a label and one drop falling in red. */
export function InkPot({ size, color, accent, paper }: { size: number; color: string; accent: string; paper: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M16 9.5h16v3.5H16z" fill={color} />
      <Path d="M18.5 13h11v6h-11z" fill={color} />
      <Path d="M11 19h26l5 21.5c.3 1.3-.6 2.5-2 2.5H8c-1.4 0-2.3-1.2-2-2.5z" fill={color} />
      <Path d="M13 28h22v8H13z" fill={paper} />
      <Path d="M16 32h16" stroke={color} strokeWidth={1.2} />
      <Path d="M41 2.5s-3.2 4-3.2 6.3a3.2 3.2 0 0 0 6.4 0C44.2 6.5 41 2.5 41 2.5z" fill={accent} />
    </Svg>
  );
}

/** A plain stopwatch: dial, crown, and one red hand. */
export function Stopwatch({ size, color, accent }: { size: number; color: string; accent: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path d="M20 4h8v4h-8z" fill={color} />
      <Path d="M22.5 8h3v4h-3z" fill={color} />
      <Path d="M24 12.5a15.5 15.5 0 1 1 0 31a15.5 15.5 0 0 1 0-31z" fill="none" stroke={color} strokeWidth={3} />
      <Path d="M24 18v2.5M24 36.5V39M13.5 28H16M32 28h2.5" stroke={color} strokeWidth={2} />
      <Path d="M24 28l6.5-7" stroke={accent} strokeWidth={2.6} strokeLinecap="round" />
      <Path d="M24 26a2 2 0 1 1 0 4a2 2 0 0 1 0-4z" fill={color} />
    </Svg>
  );
}
