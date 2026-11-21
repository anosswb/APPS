// The app's one icon set: square-cut 2.25 px strokes, drawn for this app. No emoji, no mixed sets.
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { color } from '../theme/tokens';

export type IconName = 'plus' | 'undo' | 'gear' | 'people' | 'courts' | 'close' | 'up' | 'ball' | 'minus';

export function Icon({ name, size = 24, tint = color.ink }: { name: IconName; size?: number; tint?: string }) {
  const p = { stroke: tint, strokeWidth: 2.25, strokeLinecap: 'square' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
      {name === 'close' && <Path d="M6 6l12 12M18 6L6 18" {...p} />}
      {name === 'up' && <Path d="M6 14l6-6 6 6" {...p} />}
      {name === 'undo' && <Path d="M9 5L4 10l5 5M4 10h10a6 6 0 010 12h-3" {...p} />}
      {name === 'courts' && (
        <>
          <Rect x={3} y={4} width={18} height={16} {...p} />
          <Line x1={12} y1={4} x2={12} y2={20} {...p} />
          <Line x1={8} y1={4} x2={8} y2={20} {...p} strokeWidth={1.25} />
          <Line x1={16} y1={4} x2={16} y2={20} {...p} strokeWidth={1.25} />
        </>
      )}
      {name === 'people' && (
        <>
          <Circle cx={9} cy={8} r={3.25} {...p} />
          <Path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" {...p} />
          <Path d="M16 5.2a3.2 3.2 0 010 6M18 14.5c1.9.8 3 2.8 3 5.5" {...p} />
        </>
      )}
      {name === 'gear' && (
        <>
          <Circle cx={12} cy={12} r={3} {...p} />
          <Path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" {...p} />
        </>
      )}
      {name === 'ball' && (
        <>
          <Circle cx={12} cy={12} r={9} fill={color.ball} stroke={color.ink} strokeWidth={1.5} />
          {[
            [12, 7],
            [8, 11],
            [16, 11],
            [10, 15.5],
            [14.5, 15.5],
          ].map(([x, y]) => (
            <Circle key={`${x}-${y}`} cx={x} cy={y} r={1.2} fill={color.ink} />
          ))}
        </>
      )}
    </Svg>
  );
}
