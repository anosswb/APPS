/**
 * The one token file of the Shift app. Every colour, size, radius and duration comes from here.
 * World: "Daybreak" (docs/world.md). Two modes, each designed on its own: dark (graphite) and light (stone).
 * Checked with tools/contrast.py on docs/palette.json.
 */
export interface Theme {
  dark: boolean;
  bg: string;
  surface: string;
  surfaceHi: string;
  line: string;
  text: string;
  textSoft: string;
  muted: string;
  dashed: string;
  /** the one action colour, as a fill: rest days, the alarm button */
  accent: string;
  onAccent: string;
  /** the same colour when it is text or an icon on the background */
  accentText: string;
  today: string;
  onToday: string;
  sleep: string;
  track: string;
}

export const themes: { dark: Theme; light: Theme } = {
  dark: {
    dark: true,
    bg: '#0C0E12',
    surface: '#161A20',
    surfaceHi: '#1F242C',
    line: '#262B34',
    text: '#F2EEE6',
    textSoft: '#C9CDD4',
    muted: '#8B93A1',
    dashed: '#3A414D',
    accent: '#F5B14C',
    onAccent: '#1A1003',
    accentText: '#F5B14C',
    today: '#F2EEE6',
    onToday: '#0C0E12',
    sleep: '#34466F',
    track: '#1A1E26',
  },
  light: {
    dark: false,
    bg: '#EEEFF2',
    surface: '#FFFFFF',
    surfaceHi: '#E2E4E9',
    line: '#D5D8DE',
    text: '#12151A',
    textSoft: '#30363F',
    muted: '#5A6370',
    dashed: '#AEB4BD',
    accent: '#F2A531',
    onAccent: '#1A1003',
    accentText: '#8F5200',
    today: '#12151A',
    onToday: '#FFFFFF',
    sleep: '#5C73A8',
    track: '#DDE0E6',
  },
};

/** The sky behind "Today" follows the phone's clock, in both modes. Top to horizon. Text on it is always sky.text. */
export const sky = {
  dawn: ['#081226', '#0E1D3A', '#22335A', '#5E4660', '#C9663F', '#F4A24C', '#FFD08A'],
  day: ['#123A73', '#1B4B8F', '#2C62AC', '#4A7FC2', '#7FA9D8', '#B4D0EA', '#DCE9F5'],
  dusk: ['#0C1730', '#1A2548', '#3A3260', '#7A4762', '#D0603F', '#F0913F', '#FFC470'],
  night: ['#05080F', '#070C18', '#0A1224', '#0D1830', '#12203D', '#172848', '#1D3052'],
  stops: [0, 0.38, 0.6, 0.77, 0.9, 0.97, 1],
  text: '#F4EDE2',
  textSoft: '#D5DCEC',
  sun: '#FFC470',
  sunCore: '#FFF3DC',
  star: '#DCE6FF',
  arc: '#FFE7C2',
} as const;

export const font = {
  display: 'BricolageGrotesque_800ExtraBold', // big words
  number: 'BricolageGrotesque_700Bold',
  text: 'InstrumentSans_500Medium',
  textBold: 'InstrumentSans_600SemiBold',
  textHeavy: 'InstrumentSans_700Bold',
} as const;

export const type = {
  hero: { size: 56, line: 54, tracking: -2.2 },
  title: { size: 30, line: 34, tracking: -0.9 },
  big: { size: 22, line: 26, tracking: -0.4 },
  body: { size: 16, line: 22, tracking: 0 },
  label: { size: 14, line: 18, tracking: 0 },
  small: { size: 12, line: 14, tracking: 0 },
  caps: { size: 11, line: 14, tracking: 1.2 },
} as const;

export const space = { xs: 6, s: 10, m: 16, l: 22, xl: 36 } as const;
export const radius = { day: 14, panel: 16, button: 18, full: 999 } as const;
export const size = { tap: 52, button: 64, dayCell: 78, ring: 22, ringR: 104, icon: 22, iconBig: 26, sun: 10, skyline: 60, sky: 318, nav: 62, step: 44, bar: 6, timeCol: 112, valCol: 96 } as const;
/** Slow and soft: the sun moves, nothing bounces. */
export const motion = { quick: 160, soft: 420, sun: 1200 } as const;
