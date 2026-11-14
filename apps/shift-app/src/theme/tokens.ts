/**
 * The one token file of the Shift app. Every colour, size, radius and duration comes from here.
 * World: "Daybreak" (docs/world.md). Dark only. Checked with tools/contrast.py on docs/palette.json.
 */
export const color = {
  bg: '#0B0F17', // the ground at night
  surface: '#141A26', // a work day in the week strip
  line: '#1B2332',
  text: '#F4EDE2', // cream
  textSoft: '#D5DCEC',
  muted: '#8E99AE',
  dashed: '#323C50', // a day not known yet
  sun: '#FFC470', // the one action colour: rest, the alarm button, the active tab
  onSun: '#201004',
  sunCore: '#FFF3DC',
  restTop: '#FFD08A', // a rest day is a small sunrise
  restMid: '#F4A24C',
  restBottom: '#E8873F',
  onRest: '#3A1804',
  today: '#F4EDE2',
  onToday: '#0B0F17',
  sleep: '#2A3B63', // the sleep part of the day ring
  ringTrack: '#161D2A',
} as const;

/** The sky behind "Today" follows the phone's clock. Top to horizon. */
export const sky = {
  dawn: ['#081226', '#0E1D3A', '#22335A', '#5E4660', '#C9663F', '#F4A24C', '#FFD08A'],
  day: ['#123A73', '#1B4B8F', '#2C62AC', '#4A7FC2', '#7FA9D8', '#B4D0EA', '#DCE9F5'],
  dusk: ['#0C1730', '#1A2548', '#3A3260', '#7A4762', '#D0603F', '#F0913F', '#FFC470'],
  night: ['#05080F', '#070C18', '#0A1224', '#0D1830', '#12203D', '#172848', '#1D3052'],
} as const;
export const skyStops = [0, 0.38, 0.6, 0.77, 0.9, 0.97, 1] as const;
export const star = '#DCE6FF';
export const arc = '#FFE7C2';

export const font = {
  display: 'BricolageGrotesque_800ExtraBold', // big words
  number: 'BricolageGrotesque_700Bold',
  text: 'InstrumentSans_500Medium',
  textBold: 'InstrumentSans_600SemiBold',
  textHeavy: 'InstrumentSans_700Bold',
} as const;

export const type = {
  hero: { size: 68, line: 64, weight: '800', tracking: -2.7 },
  title: { size: 34, line: 36, weight: '800', tracking: -1 },
  number: { size: 24, line: 26, weight: '700', tracking: -0.5 },
  body: { size: 17, line: 24, weight: '500', tracking: 0 },
  label: { size: 15, line: 20, weight: '600', tracking: 0 },
  small: { size: 12, line: 14, weight: '600', tracking: 0 },
} as const;

export const space = { xs: 6, s: 10, m: 16, l: 26, xl: 40 } as const;
export const radius = { day: 20, button: 24, full: 999 } as const;
export const size = { tap: 56, button: 72, dayCell: 86, ring: 26, icon: 22, iconBig: 28, sun: 11, skyline: 60, nav: 64, step: 44 } as const;
/** Slow and soft: the sun moves, nothing bounces. Reduce Motion turns the sun's travel into a plain fade. */
export const motion = { quick: 160, soft: 420, sun: 1200 } as const;
