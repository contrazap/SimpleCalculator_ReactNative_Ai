/**
 * Retro Casio palette. A single classic theme: it ignores the system
 * light/dark setting on purpose (see docs/PLAN.md §3).
 */
export const colors = {
  body: '#2A2C2E',
  bodyEdge: '#1A1B1C',
  bodyHighlight: '#3A3D40',
  brandText: '#D8DBDE',
  brandAccent: '#E0A23A',
  subtleText: '#AEB3B8',

  solarCell: '#3B2A22',
  solarCellLine: '#5A4236',

  lcd: '#B7C3A0',
  lcdShadow: '#7D8A68',
  lcdText: '#1C2116',
  lcdGhost: 'rgba(28, 33, 22, 0.08)',
  lcdMuted: '#3E4A31',

  keyDigit: '#3B3E42',
  keyDigitPressed: '#2A2C2F',
  keyDigitText: '#F2F3F4',
  keyOperator: '#A3A8AD',
  keyOperatorPressed: '#878C91',
  keyOperatorText: '#141516',
  keyDanger: '#B23A26',
  keyDangerPressed: '#8E2E1E',
  keyDangerText: '#FFFFFF',
  keyAccent: '#C25A12',
  keyAccentPressed: '#9C480E',
  keyAccentText: '#FFFFFF',
  keyShadow: '#121314',

  screen: '#2A2C2E',
  divider: '#45484C',
  rowPressed: '#35383B',
  text: '#F2F3F4',
  textMuted: '#AEB3B8',
  switchTrack: '#C25A12',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radii = {
  key: 10,
  lcd: 6,
  body: 18,
} as const;

export const fonts = {
  lcd: 'DSEG7Classic-Regular',
  label: 'SairaCondensed-Regular',
  labelBold: 'SairaCondensed-Bold',
} as const;

export const fontSizes = {
  lcdMain: 48,
  lcdExpression: 20,
  key: 26,
  keySmall: 20,
  brand: 18,
  caption: 12,
  body: 18,
  title: 22,
} as const;

/** Keys stay usable at large system font sizes without overflowing. */
export const MAX_FONT_SCALE = 1.4;

export const metrics = {
  keyPressOffset: 2,
  keyBevel: 3,
  keyBevelPressed: 1,
  keyElevation: 3,
  keyElevationPressed: 1,
  lcdBevelTop: 4,
  lcdBevelLeft: 3,
  lcdLineHeightRatio: 1.25,
  lcdCompactScale: 0.75,
  solarCellWidth: 22,
  solarCellHeight: 26,
  solarCellRadius: 2,
  solarCells: 4,
  brandLetterSpacing: 4,
  captionLetterSpacing: 1,
  pressedOpacity: 0.6,
} as const;
