import type { Operator } from '@/engine/types';

export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type CalculatorAction =
  | { type: 'digit'; digit: Digit }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'percent' }
  | { type: 'toggleSign' }
  | { type: 'openParen' }
  | { type: 'closeParen' }
  | { type: 'backspace' }
  | { type: 'clear' }
  | { type: 'evaluate' }
  | { type: 'load'; expression: string };
