import type { CalculatorAction } from '@/state/actions';

export type KeyVariant = 'digit' | 'operator' | 'danger' | 'accent';

export type KeyDef = {
  id: string;
  label: string;
  accessibilityLabel: string;
  variant: KeyVariant;
  action: CalculatorAction;
  /** Grid columns the key spans (default 1). */
  span?: number;
};

const digit = (
  d: Extract<CalculatorAction, { type: 'digit' }>['digit'],
): KeyDef => ({
  id: d,
  label: d,
  accessibilityLabel: d,
  variant: 'digit',
  action: { type: 'digit', digit: d },
});

export const KEYS = {
  clear: {
    id: 'clear',
    label: 'AC',
    accessibilityLabel: 'all clear',
    variant: 'danger',
    action: { type: 'clear' },
  },
  backspace: {
    id: 'backspace',
    label: '⌫',
    accessibilityLabel: 'backspace',
    variant: 'danger',
    action: { type: 'backspace' },
  },
  openParen: {
    id: 'openParen',
    label: '(',
    accessibilityLabel: 'open parenthesis',
    variant: 'operator',
    action: { type: 'openParen' },
  },
  closeParen: {
    id: 'closeParen',
    label: ')',
    accessibilityLabel: 'close parenthesis',
    variant: 'operator',
    action: { type: 'closeParen' },
  },
  divide: {
    id: 'divide',
    label: '÷',
    accessibilityLabel: 'divide',
    variant: 'operator',
    action: { type: 'operator', operator: 'divide' },
  },
  times: {
    id: 'times',
    label: '×',
    accessibilityLabel: 'multiply',
    variant: 'operator',
    action: { type: 'operator', operator: 'times' },
  },
  minus: {
    id: 'minus',
    label: '−',
    accessibilityLabel: 'minus',
    variant: 'operator',
    action: { type: 'operator', operator: 'minus' },
  },
  plus: {
    id: 'plus',
    label: '+',
    accessibilityLabel: 'plus',
    variant: 'operator',
    action: { type: 'operator', operator: 'plus' },
  },
  percent: {
    id: 'percent',
    label: '%',
    accessibilityLabel: 'percent',
    variant: 'operator',
    action: { type: 'percent' },
  },
  toggleSign: {
    id: 'toggleSign',
    label: '±',
    accessibilityLabel: 'plus minus',
    variant: 'operator',
    action: { type: 'toggleSign' },
  },
  decimal: {
    id: 'decimal',
    label: '.',
    accessibilityLabel: 'decimal point',
    variant: 'digit',
    action: { type: 'decimal' },
  },
  equals: {
    id: 'equals',
    label: '=',
    accessibilityLabel: 'equals',
    variant: 'accent',
    action: { type: 'evaluate' },
  },
  d0: digit('0'),
  d1: digit('1'),
  d2: digit('2'),
  d3: digit('3'),
  d4: digit('4'),
  d5: digit('5'),
  d6: digit('6'),
  d7: digit('7'),
  d8: digit('8'),
  d9: digit('9'),
} satisfies Record<string, KeyDef>;

const wide = (key: KeyDef, span: number): KeyDef => ({ ...key, span });

export type KeyLayout = { columns: number; rows: KeyDef[][] };

const K = KEYS;

export const PORTRAIT_LAYOUT: KeyLayout = {
  columns: 4,
  rows: [
    [K.clear, K.openParen, K.closeParen, K.backspace],
    [K.d7, K.d8, K.d9, K.divide],
    [K.d4, K.d5, K.d6, K.times],
    [K.d1, K.d2, K.d3, K.minus],
    [K.d0, K.decimal, K.percent, K.plus],
    [K.toggleSign, wide(K.equals, 3)],
  ],
};

export const LANDSCAPE_LAYOUT: KeyLayout = {
  columns: 6,
  rows: [
    [K.clear, K.backspace, K.d7, K.d8, K.d9, K.divide],
    [K.openParen, K.closeParen, K.d4, K.d5, K.d6, K.times],
    [K.percent, K.toggleSign, K.d1, K.d2, K.d3, K.minus],
    [wide(K.equals, 2), wide(K.d0, 2), K.decimal, K.plus],
  ],
};
