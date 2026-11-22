// The app's one icon set: square-cut 2 px strokes, drawn for this app. No emoji, no mixed sets.
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { useTheme } from '../theme/theme';

export type IconName =
  | 'plus' | 'undo' | 'gear' | 'people' | 'courts' | 'close' | 'up' | 'ball' | 'minus' | 'chart' | 'award'
  | 'share' | 'speaker' | 'lock' | 'check' | 'chevron' | 'trash' | 'timer' | 'board';

export function Icon({ name, size = 24, tint }: { name: IconName; size?: number; tint?: string }) {
  const c = useTheme();
  const col = tint ?? c.text;
  const p = { stroke: col, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'plus' && <Path d="M12 5v14M5 12h14" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
      {name === 'close' && <Path d="M6 6l12 12M18 6L6 18" {...p} />}
      {name === 'up' && <Path d="M6 14l6-6 6 6" {...p} />}
      {name === 'chevron' && <Path d="M9 6l6 6-6 6" {...p} />}
      {name === 'check' && <Path d="M5 12.5l4.5 4.5L19 7.5" {...p} />}
      {name === 'undo' && <Path d="M9 5L4 10l5 5M4 10h10a6 6 0 010 12h-3" {...p} />}
      {name === 'courts' && (
        <>
          <Rect x={3} y={4} width={18} height={16} rx={1.5} {...p} />
          <Line x1={12} y1={4} x2={12} y2={20} {...p} />
          <Line x1={8.5} y1={4} x2={8.5} y2={20} {...p} strokeWidth={1.2} />
          <Line x1={15.5} y1={4} x2={15.5} y2={20} {...p} strokeWidth={1.2} />
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
      {name === 'chart' && <Path d="M4 20V11M10 20V5M16 20v-7M21 20H3" {...p} />}
      {name === 'award' && (
        <>
          <Rect x={6} y={2.5} width={12} height={12} rx={4} {...p} />
          <Path d="M10.5 14.5v3.5a1.5 1.5 0 003 0v-3.5" {...p} />
          <Path d="M10.5 20.5h3" {...p} />
        </>
      )}
      {name === 'share' && <Path d="M12 15V3M7.5 7.5L12 3l4.5 4.5M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" {...p} />}
      {name === 'speaker' && <Path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" {...p} />}
      {name === 'lock' && (
        <>
          <Rect x={5} y={10.5} width={14} height={10} rx={2.5} {...p} />
          <Path d="M8 10.5V8a4 4 0 018 0v2.5" {...p} />
        </>
      )}
      {name === 'trash' && <Path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" {...p} />}
      {name === 'timer' && (
        <>
          <Circle cx={12} cy={13.5} r={7.5} {...p} />
          <Path d="M12 13.5V9.5M9.5 2.5h5" {...p} />
        </>
      )}
      {name === 'board' && (
        <>
          <Rect x={3} y={4} width={18} height={13} rx={2} {...p} />
          <Path d="M8 21h8M12 17v4M7 9h6M7 12h10" {...p} />
        </>
      )}
      {name === 'ball' && (
        <>
          <Circle cx={12} cy={12} r={9} fill={c.ball} stroke={c.ballInk} strokeWidth={1.5} />
          {[
            [12, 7],
            [8, 11],
            [16, 11],
            [10, 15.5],
            [14.5, 15.5],
          ].map(([x, y]) => (
            <Circle key={`${x}-${y}`} cx={x} cy={y} r={1.2} fill={c.ballInk} />
          ))}
        </>
      )}
    </Svg>
  );
}
