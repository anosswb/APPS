/**
 * The one token file of the Shift app. Every colour, size, radius and duration comes from here.
 * World: "Daybreak", third pass (docs/world.md): calm blue, black and green, soft glass panels.
 * Two modes, each designed on its own. Checked with tools/contrast.py on docs/palette.json;
 * the two chart colours (work, rest/overtime) checked with the dataviz palette validator.
 */
export interface Theme {
  dark: boolean;
  bg: string;
  /** a glass panel: a see-through fill with a light edge */
  card: string;
  cardLine: string;
  /** the panel that sits on the sky: darker in dark mode so its text stays easy to read */
  cardOnSky: string;
  /** a solid raised piece: the chosen day, a stepper button */
  raised: string;
  line: string;
  text: string;
  textSoft: string;
  muted: string;
  /** the main button: a plain pill, black on light and white on dark */
  primary: string;
  onPrimary: string;
  /** work, links, the active tab */
  blue: string;
  /** rest days, overtime, money earned */
  green: string;
  sleep: string;
  track: string;
  /** liquid glass: the see-through fill, its edge, the light that sits on its top, and the lit (on) state */
  glass: { fill: string; edge: string; hi: string; on: string; onEdge: string };
  /** the quiet gradient behind every screen, so the glass has something to sit on */
  backdrop: string[];
  /** behind Today, top to bottom, by hour. The last stop is the background. */
  sky: { night: string[]; dawn: string[]; day: string[]; dusk: string[] };
}

export const themes: { dark: Theme; light: Theme } = {
  dark: {
    dark: true,
    bg: '#0A0B0D',
    card: 'rgba(255,255,255,0.07)',
    cardLine: 'rgba(255,255,255,0.12)',
    cardOnSky: 'rgba(12,14,20,0.66)',
    raised: '#24272D',
    line: 'rgba(255,255,255,0.09)',
    text: '#F5F6F7',
    textSoft: '#C6CAD1',
    muted: '#8A909B',
    primary: '#F5F6F7',
    onPrimary: '#0A0B0D',
    blue: '#4C82F7',
    green: '#27A866',
    sleep: '#3A4670',
    glass: { fill: 'rgba(255,255,255,0.08)', edge: 'rgba(255,255,255,0.20)', hi: 'rgba(255,255,255,0.18)', on: 'rgba(39,168,102,0.62)', onEdge: 'rgba(150,235,190,0.55)' },
    backdrop: ['#0F1E30', '#0A0F15', '#08090B'],
    track: '#22252B',
    sky: {
      night: ['#030406', '#0A1230', '#122458', '#0A0B0D'],
      dawn: ['#060912', '#12265E', '#2E55B0', '#0A0B0D'],
      day: ['#0A1A44', '#1C3F96', '#3566D6', '#0A0B0D'],
      dusk: ['#07091A', '#1A1F5C', '#3A3F9E', '#0A0B0D'],
    },
  },
  light: {
    dark: false,
    bg: '#E9ECF1',
    card: 'rgba(255,255,255,0.74)',
    cardLine: 'rgba(255,255,255,0.95)',
    cardOnSky: 'rgba(255,255,255,0.80)',
    raised: '#FFFFFF',
    line: 'rgba(14,16,19,0.09)',
    text: '#0E1013',
    textSoft: '#2F343C',
    muted: '#5D6470',
    primary: '#0E1013',
    onPrimary: '#FFFFFF',
    blue: '#2458E6',
    green: '#12824A',
    sleep: '#7C8DBE',
    glass: { fill: 'rgba(255,255,255,0.58)', edge: 'rgba(14,16,19,0.08)', hi: 'rgba(255,255,255,0.85)', on: 'rgba(18,130,74,0.92)', onEdge: 'rgba(255,255,255,0.55)' },
    backdrop: ['#CFDCEA', '#E2E8F0', '#EDF0F4'],
    track: '#D9DDE4',
    sky: {
      // Darker at the top than before: white text sits there and must stay readable (checked 16 Nov: 4.5:1 or more).
      night: ['#1E3358', '#2E4E78', '#8FA6CC', '#E9ECF1'],
      dawn: ['#2E4E78', '#3F6290', '#A9BDD8', '#E9ECF1'],
      day: ['#2F5580', '#40668F', '#B3C8DE', '#E9ECF1'],
      dusk: ['#2B3A6A', '#3D4F86', '#B0BAD9', '#E9ECF1'],
    },
  },
};
export const skyStops = [0, 0.35, 0.68, 1] as const;
/** Text that sits on the top of the sky, in both modes. */
export const onSky = { text: '#FFFFFF', soft: 'rgba(255,255,255,0.84)' } as const;

export const font = {
  display: 'BricolageGrotesque_600SemiBold', // big words and numbers
  number: 'BricolageGrotesque_600SemiBold',
  text: 'InstrumentSans_500Medium',
  textBold: 'InstrumentSans_600SemiBold',
  textHeavy: 'InstrumentSans_700Bold',
} as const;

export const type = {
  hero: { size: 48, line: 52, tracking: -1.6 },
  title: { size: 28, line: 32, tracking: -0.6 },
  big: { size: 21, line: 26, tracking: -0.3 },
  body: { size: 16, line: 22, tracking: 0 },
  label: { size: 14, line: 18, tracking: 0 },
  small: { size: 13, line: 17, tracking: 0 },
  caps: { size: 11, line: 14, tracking: 1.1 },
} as const;

export const space = { xs: 6, s: 10, m: 16, l: 22, xl: 34 } as const;
export const radius = { card: 28, inner: 18, pill: 999 } as const;
export const size = { tap: 50, button: 56, ring: 20, ringR: 100, ringSmall: 58, icon: 22, iconBig: 24, dot: 6, sun: 9, sky: 430, skyPart: 0.62, nav: 64, navSpace: 104, glassBtn: 52, glassIcon: 40, step: 44, bar: 6, timeCol: 108, valCol: 92, dayPill: 78, chart: 72, chartBar: 18 } as const;
export const motion = { quick: 160, soft: 420 } as const;
