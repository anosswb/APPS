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
