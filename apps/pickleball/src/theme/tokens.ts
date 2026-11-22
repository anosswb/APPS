// The one token file. Every colour, size, radius and duration in the app comes from here (docs/world.md).
// Two palettes, dark and light (the light one doubles as "sun mode"), same keys. Court paint is the same in both.

const court = {
  court: '#2147C9', // hard-court blue
  courtDeep: '#1A3AA6',
  courtOut: '#3F7D55', // the green surround of a US hard court
  kitchenFill: '#3A64E6', // the non-volley zone, painted a lighter blue
  kitchen: 'rgba(255,255,255,0.75)',
  net: '#0B0D12',
  paint: '#FFFFFF',
  ball: '#D8F23A', // optic yellow: fills only, always with dark ink on top
  ballInk: '#0B0D12',
};

// Dark is the main look (Anass, 22 Nov 2026): true black, dark grey panels, white type, one accent (ball
// yellow). Court colours appear only on the court. Light is plain grey and white, no coloured background.
export const dark = {
  mode: 'dark' as 'dark' | 'light',
  ...court,
  bg: '#000000',
  card: '#141416',
  cardHi: '#1C1C1F',
  edge: 'rgba(255,255,255,0.09)',
  edgeHi: 'rgba(255,255,255,0.16)',
  text: '#FFFFFF',
  textSoft: '#D1D1D6',
  mute: '#8E8E93',
  hair: 'rgba(255,255,255,0.10)',
  hairHex: '#FFFFFF', // the same line colour for drawings that need a plain colour plus an opacity
  hairOpacity: 0.12,
  solid: '#FFFFFF', // the one bright tile on a screen
  solidText: '#000000',
  accent: '#D8F23A',
  accentText: '#0B0D12',
  accentLine: '#D8F23A',
  highlight: '#D8F23A', // numbers that matter, the active tab
  stop: '#FF6B5E',
  scrim: 'rgba(0,0,0,0.66)',
  sheet: '#1C1C1E',
  showcase: '#07090E', // the dark display case behind the award badges, in both modes
  bar: 'rgba(24,24,27,0.96)', // tab bar and banners
};

export type Palette = typeof dark;

export const light: Palette = {
  mode: 'light',
  ...court,
  bg: '#F2F2F7',
  card: '#FFFFFF',
  cardHi: '#FFFFFF',
  edge: 'rgba(0,0,0,0.06)',
  edgeHi: 'rgba(0,0,0,0.10)',
  text: '#000000',
  textSoft: '#2C2C2E',
  mute: '#6C6C70',
  hair: 'rgba(0,0,0,0.08)',
  hairHex: '#000000',
  hairOpacity: 0.08,
  solid: '#000000',
  solidText: '#FFFFFF',
  accent: '#D8F23A',
  accentText: '#0B0D12',
  accentLine: '#0B0D12', // a yellow fill on a light screen needs an ink edge to read in sun
  highlight: '#2147C9',
  stop: '#C8261C',
  scrim: 'rgba(0,0,0,0.40)',
  sheet: '#FFFFFF',
  showcase: '#07090E',
  bar: 'rgba(255,255,255,0.96)',
};

export const font = {
  display: 'BarlowCondensed_800ExtraBold',
  displayItalic: 'BarlowCondensed_800ExtraBold_Italic',
  label: 'BarlowCondensed_600SemiBold',
  body: 'Archivo_500Medium',
  bodyBold: 'Archivo_700Bold',
} as const;

export const size = {
  hero: 40,
  title: 30,
  name: 26,
  nameSmall: 21,
  body: 16,
  small: 14,
  label: 14,
  scoreGiant: 168,
  call: 44,
  stat: 40,
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;

export const radius = { box: 6, tag: 24, glass: 24, pill: 999, chip: 16 } as const;

/** Tap targets: 56 minimum (sweaty hands, outdoor glare, older players). */
export const touch = { min: 56, big: 64 } as const;

export const line = { court: 3, hair: 1, button: 2 } as const;

export const motion = { quick: 140, slide: 220, courtIn: 560, ballFlight: 760, sweep: 900, nameStagger: 90, livePulse: 1400, banner: 3600 } as const;

/** Court tilt at rest: the court lies back a little, like seen from the stands. */
export const courtTilt = 22;

/** Glass on the court paint (drawn, not blurred: the same on every phone). */
export const glass = { tint: 'rgba(26,58,166,0.72)', sweep: 0.42 } as const;

/** Space the floating tab bar takes at the bottom of every tab. */
export const TAB_SPACE = 104;
