/** One icon set: Lucide (ISC licence, see THIRD_PARTY.md). Only the paths we use. */
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { size } from '../theme/tokens';

export type IconName = 'edit' | 'bell' | 'moon' | 'flag' | 'login' | 'logout' | 'utensils' | 'hourglass' | 'receipt' | 'check' | 'alarm' | 'calendar' | 'pay' | 'home' | 'day' | 'left' | 'right' | 'minus' | 'plus';

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
      {name === 'edit' && <Path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" {...p} />}
      {name === 'bell' && <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" {...p} />}
      {name === 'moon' && <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" {...p} />}
      {name === 'flag' && <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" {...p} />}
      {name === 'login' && <Path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" {...p} />}
      {name === 'logout' && <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" {...p} />}
      {name === 'utensils' && <Path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" {...p} />}
      {name === 'hourglass' && <Path d="M5 22h14M5 2h14M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2" {...p} />}
      {name === 'receipt' && <Path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1ZM16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11" {...p} />}
      {name === 'check' && <Path d="M20 6 9 17l-5-5" {...p} />}
      {name === 'minus' && <Path d="M5 12h14" {...p} />}
      {name === 'plus' && <Path d="M5 12h14M12 5v14" {...p} />}
    </Svg>
  );
}
