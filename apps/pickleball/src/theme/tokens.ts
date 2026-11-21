// The one token file. Every colour, size, radius and duration in the app comes from here (docs/world.md).
// Light only, on purpose: the app is used outdoors in full sun, where a light screen with black ink reads best.
export const color = {
  ground: '#F3F2EC', // chalky concrete around the court
  card: '#FFFFFF',
  ink: '#111214',
  inkSoft: '#3B3E44',
  mute: '#55585E',
  hair: '#D9D8D0',
  court: '#2147C9', // hard-court blue
  courtDeep: '#1A3AA6',
  courtOut: '#3F7D55', // the green surround of a US hard court
  kitchen: 'rgba(255,255,255,0.75)',
  paint: '#FFFFFF', // court lines and names painted on the court
  ball: '#D8F23A', // optic yellow: fills only, always with ink on top
  ballInk: '#111214',
  stop: '#B42318', // remove / end session
  scrim: 'rgba(17,18,20,0.55)',
} as const;

export const font = {
  display: 'BarlowCondensed_800ExtraBold',
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
  label: 15,
  scoreGiant: 168,
  call: 44,
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;

export const radius = { box: 6, tag: 24 } as const;

/** Tap targets: 56 minimum (sweaty hands, outdoor glare, older players). */
export const touch = { min: 56, big: 64 } as const;

export const line = { court: 3, hair: 1, button: 2 } as const;

export const motion = { quick: 140, slide: 220 } as const;
