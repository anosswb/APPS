/**
 * The whole look in one file. World: the puzzle page of a Sunday newspaper, printed in two inks.
 * No colours, sizes or font names anywhere else in the code.
 */
export interface Palette {
  /** the paper */
  bg: string;
  /** a slightly lighter sheet, for the board */
  surface: string;
  /** black ink */
  text: string;
  /** pencil grey */
  muted: string;
  /** main buttons */
  primary: string;
  onPrimary: string;
  /** red ink: tents, the stamp, problems */
  accent: string;
  /** green ink: trees */
  pine: string;
  /** hairlines */
  rule: string;
  /** highlighter pen, for hints */
  highlight: string;
  /** light red wash under a mistake */
  wash: string;
}

export const palettes: { light: Palette; dark: Palette } = {
  light: {
    bg: '#F6F1E7',
    surface: '#FFFDF8',
    text: '#22201C',
    muted: '#655F55',
    primary: '#22201C',
    onPrimary: '#F6F1E7',
    accent: '#B3261E',
    pine: '#2F4A3A',
    rule: 'rgba(34,32,28,0.24)',
    highlight: '#F3DF7C',
    wash: 'rgba(179,38,30,0.14)',
  },
  dark: {
    bg: '#181613',
    surface: '#23201C',
    text: '#EFE8DA',
    muted: '#A89F90',
    primary: '#EFE8DA',
    onPrimary: '#181613',
    accent: '#FF8A7A',
    pine: '#9CC7A8',
    rule: 'rgba(239,232,218,0.24)',
    highlight: '#5F5320',
    wash: 'rgba(255,138,122,0.18)',
  },
};

export const font = {
  serif: 'Newsreader_400Regular',
  serifItalic: 'Newsreader_400Regular_Italic',
  serifMedium: 'Newsreader_500Medium',
  serifBold: 'Newsreader_700Bold',
  sans: 'LibreFranklin_500Medium',
  sansBold: 'LibreFranklin_700Bold',
} as const;

export const size = { masthead: 44, title: 28, body: 17, label: 12 } as const;
export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;
/** Print has square corners. */
export const radius = 2;
export const hairline = 1;
export const tapMin = 44;
