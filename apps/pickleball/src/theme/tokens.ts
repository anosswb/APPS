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

export const dark = {
  mode: 'dark' as 'dark' | 'light',
  ...court,
  bg: '#05070B',
  glow1: '#2147C9',
  glow2: '#3F7D55',
  glow3: '#D8F23A',
  glowOpacity: 0.5,
  text: '#F4F6FA',
  textSoft: '#C9CED8',
  mute: '#8C95A6',
  hair: 'rgba(255,255,255,0.10)',
  glassTop: 'rgba(255,255,255,0.15)',
  glassBottom: 'rgba(255,255,255,0.04)',
  glassRim: 'rgba(255,255,255,0.10)',
  glassRimHi: 'rgba(255,255,255,0.55)',
  glassShine: 0.28,
  solid: '#F4F6FA', // the one bright tile on a screen
  solidText: '#0B0D12',
  accent: '#D8F23A',
  accentText: '#0B0D12',
  accentLine: '#D8F23A',
  stop: '#FF6B5E',
  scrim: 'rgba(0,0,0,0.62)',
  sheet: '#10141C',
  showcase: '#07090E', // the dark display case behind the award badges, in both modes
  shadow: 'rgba(0,0,0,0.45)',
  bar: 'rgba(17,21,30,0.97)', // tab bar and banners: glass you cannot read through
};

export type Palette = typeof dark;

export const light: Palette = {
  mode: 'light',
  ...court,
  bg: '#EAEEF5',
  glow1: '#7E9CFF',
  glow2: '#8FD3A8',
  glow3: '#E6FF5C',
  glowOpacity: 0.55,
  text: '#0B0D12',
  textSoft: '#2B3038',
  mute: '#59606C',
  hair: 'rgba(11,13,18,0.10)',
  glassTop: 'rgba(255,255,255,0.92)',
  glassBottom: 'rgba(255,255,255,0.62)',
  glassRim: 'rgba(11,13,18,0.08)',
  glassRimHi: 'rgba(255,255,255,1)',
  glassShine: 0.6,
  solid: '#0B0D12',
  solidText: '#F4F6FA',
  accent: '#D8F23A',
  accentText: '#0B0D12',
  accentLine: '#0B0D12', // a yellow fill on a light screen needs an ink edge to read in sun
  stop: '#C8261C',
  scrim: 'rgba(11,13,18,0.45)',
  sheet: '#F7F8FB',
  showcase: '#07090E',
  shadow: 'rgba(30,40,70,0.18)',
  bar: 'rgba(255,255,255,0.95)',
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
