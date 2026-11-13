import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { font, size } from '../theme/tokens';

type Variant = 'masthead' | 'title' | 'body' | 'bodyItalic' | 'label' | 'number';
type Tone = 'text' | 'muted' | 'accent' | 'onPrimary';

const STYLES: Record<Variant, TextStyle> = {
  masthead: { fontFamily: font.serifBold, fontSize: size.masthead, lineHeight: size.masthead * 1.05, letterSpacing: -0.5 },
  title: { fontFamily: font.serifMedium, fontSize: size.title, lineHeight: size.title * 1.15 },
  body: { fontFamily: font.serif, fontSize: size.body, lineHeight: size.body * 1.4 },
  bodyItalic: { fontFamily: font.serifItalic, fontSize: size.body, lineHeight: size.body * 1.4 },
  label: { fontFamily: font.sansBold, fontSize: size.label, lineHeight: size.label * 1.4, letterSpacing: 1.4, textTransform: 'uppercase' },
  number: { fontFamily: font.serifMedium, fontSize: size.body, lineHeight: size.body * 1.2 },
};

interface Props extends TextProps {
  variant?: Variant;
  tone?: Tone;
}

/** The only way text is put on screen. Four sizes, two families. */
export function Type({ variant = 'body', tone = 'text', style, ...rest }: Props) {
  const { c } = useTheme();
  return <RNText maxFontSizeMultiplier={1.4} {...rest} style={[STYLES[variant], { color: c[tone] }, style]} />;
}
