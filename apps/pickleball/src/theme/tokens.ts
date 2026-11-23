// The one token file. Every colour, size, radius and duration in the app comes from here (docs/world.md).
// Two palettes, dark and light (the light one doubles as "sun mode"), same keys. Court paint is the same in both.

// Court paint in the Dark Athletic style (Anass, 22 Nov 2026): a night court. Dark grey court, white lines,
// a black surround, one bright ball. The same in dark and light mode.
const court = {
  court: '#1C1C1E',
  courtDeep: '#2C2C2E', // the half you are pressing
  courtOut: '#0B0B0C',
  kitchenFill: '#2A2A2D', // the non-volley zone, one step lighter
  kitchen: 'rgba(255,255,255,0.75)',
  net: '#000000',
  paint: '#FFFFFF',
  ball: '#F8E84A', // spectrum yellow: fills only, always with dark ink on top
  ballInk: '#000000',
};

/** The spectral accent (design system 2026-11-22). Only small: a line, a ring, award moments. Never behind text. */
export const spectrum = {
  cyan: '#00D9FF',
  blue: '#315BFF',
  violet: '#873CFF',
  magenta: '#FF35B8',
  coral: '#FF5A55',
  orange: '#FF9B32',
  yellow: '#F8E84A',
  green: '#43E58B',
};
export const spectral = {
  full: [spectrum.cyan, spectrum.blue, spectrum.violet, spectrum.magenta, spectrum.coral, spectrum.orange, spectrum.yellow, spectrum.green],
  cool: [spectrum.cyan, spectrum.blue, spectrum.violet],
  warm: [spectrum.orange, spectrum.coral, spectrum.magenta],
} as const;

// Dark Athletic (Anass, 22 Nov 2026): pure black canvas, white type in three strengths, cards of 10% white,
// white for every "selected" and every main button, colour only as a small spectral accent.
export const dark = {
  mode: 'dark' as 'dark' | 'light',
  ...court,
  bg: '#000000',
  card: 'rgba(255,255,255,0.10)', // surface-glass
  cardHi: 'rgba(255,255,255,0.14)', // surface-glass-strong
  edge: 'rgba(255,255,255,0.14)', // card edge: each card stands apart from the black
  edgeHi: 'rgba(255,255,255,0.20)',
  text: '#FFFFFF',
  textSoft: 'rgba(255,255,255,0.65)',
  mute: 'rgba(255,255,255,0.45)',
  hair: 'rgba(255,255,255,0.12)',
  hairHex: '#FFFFFF', // the same line colour for drawings that need a plain colour plus an opacity
  hairOpacity: 0.12,
  solid: '#FFFFFF', // selected surfaces and the main button
  solidText: '#000000',
  solidMute: 'rgba(0,0,0,0.55)',
  accent: '#FFFFFF',
  accentText: '#000000',
  accentLine: '#FFFFFF',
  accentSoft: 'rgba(255,255,255,0.14)', // the active tab's pill
  highlight: '#FFFFFF', // numbers that matter
  live: spectrum.green,
  on: spectrum.green, // switch track when on
  stop: spectrum.coral,
  scrim: 'rgba(0,0,0,0.72)',
  sheet: '#1A1A1A', // surface-1
  showcase: '#090909', // canvas-raised: the case behind the award badges, in both modes
  bar: 'rgba(26,26,26,0.96)', // tab bar and banners
  handle: '#242424', // surface-2: the taped paddle handle in the line
  handleWrap: '#3A3A3C',
  /** Buttons that are not white: a lighter fill and an edge over 3:1 on black (WCAG 1.4.11). */
  control: 'rgba(255,255,255,0.16)',
  controlEdge: 'rgba(255,255,255,0.55)',
  /** The line under every title. */
  titleLine: 'rgba(255,255,255,0.28)',
};

export type Palette = typeof dark;

// Light ("sun mode"): the same system turned over. White cards on light grey, black for selected and main buttons.
export const light: Palette = {
  mode: 'light',
  ...court,
  bg: '#F2F2F4',
  card: '#FFFFFF',
  cardHi: '#FFFFFF',
  edge: 'rgba(0,0,0,0.06)',
  edgeHi: 'rgba(0,0,0,0.10)',
  text: '#000000',
  textSoft: 'rgba(0,0,0,0.70)',
  mute: 'rgba(0,0,0,0.50)',
  hair: 'rgba(0,0,0,0.08)',
  hairHex: '#000000',
  hairOpacity: 0.08,
  solid: '#000000',
  solidText: '#FFFFFF',
  solidMute: 'rgba(255,255,255,0.6)',
  accent: '#000000',
  accentText: '#FFFFFF',
  accentLine: '#000000',
  accentSoft: 'rgba(0,0,0,0.08)',
  highlight: '#000000',
  live: '#1E9E4A',
  on: '#000000',
  stop: '#C8261C',
  scrim: 'rgba(0,0,0,0.40)',
  sheet: '#FFFFFF',
  showcase: '#090909',
  bar: 'rgba(255,255,255,0.96)',
  handle: '#1C1C1E',
  handleWrap: '#3A3A3C',
  control: '#FFFFFF',
  controlEdge: 'rgba(0,0,0,0.45)',
  titleLine: 'rgba(0,0,0,0.22)',
};

// Fonts (Anass, 22 Nov 2026: "use those fonts"). Presicav and Neumatic Compressed are paid fonts, here only
// for test builds. They must be licensed for apps before any store release (RIGHTS.md).
export const font = {
  /** Athletic display: the giant score and hero figures (Presicav Heavy). */
  display: 'Presicav-Heavy',
  /** Screen titles and section titles (Presicav Bold). */
  heading: 'Presicav-Bold',
  /** Key figures on cards: stats, scores on court cards (Presicav Bold). */
  figure: 'Presicav-Bold',
  /** Small data: clocks, score calls, units (Spline Sans Mono, SIL OFL). */
  num: 'SplineSansMono_600SemiBold',
  /** Big condensed uppercase labels, 20 and up (Neumatic Compressed Semi-Bold). Unreadable smaller. */
  label: 'NeumaticCompressed-SemiBold',
  /** Small uppercase labels and metadata like GAMES, LONGEST (Spline Sans Mono, SIL OFL). */
  micro: 'SplineSansMono_500Medium',
  /** Player names (Neumatic Compressed Bold). */
  name: 'NeumaticCompressed-Bold',
  body: 'Inter_500Medium',
  bodyBold: 'Inter_600SemiBold',
} as const;

export const size = {
  hero: 25, // screen titles (wide heading font)
  title: 19, // sheet titles
  name: 26, // condensed names need more size than a normal face
  nameSmall: 22,
  body: 16,
  small: 14,
  label: 11.5,
  scoreGiant: 124,
  call: 34,
  stat: 28,
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;

/** Card radius 18 (design system), large surfaces 24. */
export const radius = { box: 8, tag: 18, glass: 18, xl: 24, pill: 999, chip: 12 } as const;

/** Tap targets: 56 minimum (sweaty hands, outdoor glare, older players). */
export const touch = { min: 56, big: 64 } as const;

export const line = { court: 3, hair: 1, button: 2 } as const;

/** The win moment (src/ui/Celebrate.tsx): burst length and how long the names stay. */
export const celebrate = { burst: 1100, hold: 1700 } as const;

export const motion = { quick: 140, slide: 220, courtIn: 560, ballFlight: 760, sweep: 900, nameStagger: 90, namesIn: 900, hotPulse: 650, livePulse: 1400, banner: 3600 } as const;

/** Court tilt at rest: the court lies back a little, like seen from the stands. */
export const courtTilt = 22;

/** Glass on the court paint (drawn, not blurred: the same on every phone). */
export const glass = { tint: 'rgba(0,0,0,0.72)', sweep: 0.32 } as const;

/** Space the floating tab bar takes at the bottom of every tab. */
export const TAB_SPACE = 104;
