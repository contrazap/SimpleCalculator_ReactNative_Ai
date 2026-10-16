/** Symbols as they appear in an expression string (and on the keys). */
export const SYMBOLS = {
  plus: '+',
  minus: '−',
  times: '×',
  divide: '÷',
  percent: '%',
  openParen: '(',
  closeParen: ')',
  decimal: '.',
} as const;

export type Operator = 'plus' | 'minus' | 'times' | 'divide';

export type Token =
  | { type: 'number'; value: number; text: string }
  | { type: 'operator'; operator: Operator }
  | { type: 'percent' }
  | { type: 'openParen' }
  | { type: 'closeParen' };

export type Node =
  | { type: 'number'; value: number }
  | { type: 'binary'; operator: Operator; left: Node; right: Node }
  | { type: 'negate'; operand: Node }
  | { type: 'percent'; operand: Node };

export type CalcErrorKind = 'SYNTAX' | 'DIV_ZERO' | 'OVERFLOW';

export class CalcError extends Error {
  readonly kind: CalcErrorKind;

  constructor(kind: CalcErrorKind, message?: string) {
    super(message ?? kind);
    this.name = 'CalcError';
    this.kind = kind;
  }
}

export type CalcResult =
  | { ok: true; value: number; display: string }
  | { ok: false; error: CalcErrorKind };
