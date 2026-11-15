/** One icon set: Lucide (ISC licence, see THIRD_PARTY.md). Only the paths we use. */
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { size } from '../theme/tokens';

export type IconName = 'check' | 'alarm' | 'calendar' | 'pay' | 'home' | 'day' | 'left' | 'right' | 'minus' | 'plus';

export function Icon({ name, color, s = size.icon }: { name: IconName; color: string; s?: number }) {
  const p = { stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      {name === 'alarm' && (<><Circle cx="12" cy="13" r="8" {...p} /><Path d="M12 9v4l2 2M5 3 2 6M22 6l-3-3M6.38 18.7 4 21M17.64 18.67 20 21" {...p} /></>)}
      {name === 'calendar' && (<><Rect x="3" y="3" width="18" height="18" rx="2" {...p} /><Path d="M8 2v3M16 2v3M3 9h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" {...p} /></>)}
      {name === 'pay' && (<><Rect x="2" y="6" width="20" height="12" rx="2" {...p} /><Circle cx="12" cy="12" r="2" {...p} /><Path d="M6 12h.01M18 12h.01" {...p} /></>)}
      {name === 'home' && <Path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...p} />}
      {name === 'day' && (<><Circle cx="12" cy="12" r="10" {...p} /><Path d="M12 6v6l4 2" {...p} /></>)}
      {name === 'left' && <Path d="m15 18-6-6 6-6" {...p} />}
      {name === 'right' && <Path d="m9 18 6-6-6-6" {...p} />}
      {name === 'check' && <Path d="M20 6 9 17l-5-5" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
      {name === 'plus' && <Path d="M5 12h14M12 5v14" {...p} />}
    </Svg>
  );
}
