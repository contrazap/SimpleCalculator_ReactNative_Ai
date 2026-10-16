import { SYMBOLS } from '@/engine/types';

/** Pure helpers for inspecting the expression string the user is editing. */

const OPERATOR_CHARS: ReadonlySet<string> = new Set([
  SYMBOLS.plus,
  SYMBOLS.minus,
  SYMBOLS.times,
  SYMBOLS.divide,
]);

const NUMBER = String.raw`(?:\d+\.?\d*|\.\d+)(?:E-?\d+)?`;
const TRAILING_NUMBER = new RegExp(`${NUMBER}$`);
const PLAIN_NUMBER = new RegExp(`^${NUMBER}$`);
const ALL_NUMBERS = new RegExp(NUMBER, 'g');

export function lastChar(expression: string): string {
  return expression.slice(-1);
}

export function endsWithOperator(expression: string): boolean {
  return OPERATOR_CHARS.has(lastChar(expression));
}

/** True for "12", "0.", ".5", "1.5E-7"; false for anything with an operator. */
export function isPlainNumber(expression: string): boolean {
  return PLAIN_NUMBER.test(expression);
}

/** True when the expression ends with something a value can follow. */
export function endsWithValue(expression: string): boolean {
  return /[\d.)%]$/.test(expression);
}

/** The number literal at the end of the expression ("" if there is none). */
export function trailingNumber(expression: string): string {
  return TRAILING_NUMBER.exec(expression)?.[0] ?? '';
}

/** The last number literal anywhere in the expression. */
export function lastNumber(expression: string): string | undefined {
  const matches = expression.match(ALL_NUMBERS);
  return matches?.at(-1);
}

export function openParenCount(expression: string): number {
  let depth = 0;
  for (const char of expression) {
    if (char === SYMBOLS.openParen) depth += 1;
    if (char === SYMBOLS.closeParen) depth = Math.max(0, depth - 1);
  }
  return depth;
}

/** Closes any parentheses the user left open, like Android's calculator. */
export function autoClose(expression: string): string {
  return expression + SYMBOLS.closeParen.repeat(openParenCount(expression));
}

/** Converts a formatted result ("-5") into expression text ("−5"). */
export function resultToExpression(display: string): string {
  return display.replace(/^-/, SYMBOLS.minus);
}
