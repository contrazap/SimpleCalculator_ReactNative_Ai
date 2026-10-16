import { calculate } from '@/engine/evaluate';
import { SYMBOLS, type CalcErrorKind, type Operator } from '@/engine/types';

import type { CalculatorAction, Digit } from './actions';
import {
  autoClose,
  endsWithOperator,
  endsWithValue,
  isPlainNumber,
  lastChar,
  openParenCount,
  resultToExpression,
  trailingNumber,
} from './expressionText';

export const MAX_EXPRESSION_LENGTH = 100;
export const MAX_NUMBER_DIGITS = 15;

/** A finished calculation, picked up by the history hook. */
export type Commit = { id: number; expression: string; result: string };

export type CalculatorState = {
  expression: string;
  /** The expression that produced the current result, shown as "12+3 =". */
  previous: string | null;
  justEvaluated: boolean;
  error: CalcErrorKind | null;
  lastCommit: Commit | null;
};

export const initialState: CalculatorState = {
  expression: '',
  previous: null,
  justEvaluated: false,
  error: null,
  lastCommit: null,
};

export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'digit':
      return inputDigit(state, action.digit);
    case 'decimal':
      return inputDecimal(state);
    case 'operator':
      return inputOperator(state, action.operator);
    case 'percent':
      return inputPercent(state);
    case 'toggleSign':
      return toggleSign(state);
    case 'openParen':
      return openParen(state);
    case 'closeParen':
      return closeParen(state);
    case 'backspace':
      return backspace(state);
    case 'clear':
      return { ...initialState, lastCommit: state.lastCommit };
    case 'evaluate':
      return evaluate(state);
    case 'load':
      return edit(state, action.expression);
  }
}

/** Moves back to editing mode with a new expression, if it fits. */
function edit(state: CalculatorState, expression: string): CalculatorState {
  if (expression.length > MAX_EXPRESSION_LENGTH) return state;
  return {
    ...state,
    expression,
    previous: null,
    justEvaluated: false,
    error: null,
  };
}

/** After a result or an error, new input starts a fresh expression. */
function startsFresh(state: CalculatorState): boolean {
  return state.justEvaluated || state.error !== null;
}

const endsWithClosedValue = (expression: string) => /[)%]$/.test(expression);

function inputDigit(state: CalculatorState, digit: Digit): CalculatorState {
  const base = startsFresh(state) ? '' : state.expression;
  if (endsWithClosedValue(base)) {
    return edit(state, base + SYMBOLS.times + digit);
  }

  const number = trailingNumber(base);
  if (number.includes('E')) return state;
  if (number.replace('.', '').length >= MAX_NUMBER_DIGITS) return state;
  // No leading zeros: "0" followed by "5" becomes "5".
  if (number === '0') return edit(state, base.slice(0, -1) + digit);
  return edit(state, base + digit);
}

function inputDecimal(state: CalculatorState): CalculatorState {
  const base = startsFresh(state) ? '' : state.expression;
  if (endsWithClosedValue(base)) {
    return edit(state, `${base}${SYMBOLS.times}0.`);
  }

  const number = trailingNumber(base);
  if (number.includes('.') || number.includes('E')) return state;
  return edit(state, base + (number === '' ? '0.' : '.'));
}

function inputOperator(
  state: CalculatorState,
  operator: Operator,
): CalculatorState {
  if (state.error) return state;
  const symbol = SYMBOLS[operator];
  if (state.justEvaluated) return edit(state, state.expression + symbol);

  const { expression } = state;
  // "5×" then "−" starts a negative number instead of replacing "×".
  if (
    operator === 'minus' &&
    (lastChar(expression) === SYMBOLS.times ||
      lastChar(expression) === SYMBOLS.divide)
  ) {
    return edit(state, expression + symbol);
  }

  // Repeated operators replace each other ("5+×" becomes "5×").
  let base = expression;
  while (endsWithOperator(base)) base = base.slice(0, -1);

  if (base === '' || lastChar(base) === SYMBOLS.openParen) {
    // Only a minus sign can start an expression or a group.
    return operator === 'minus' ? edit(state, base + symbol) : state;
  }
  return edit(state, base + symbol);
}

function inputPercent(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  if (state.justEvaluated) {
    return edit(state, state.expression + SYMBOLS.percent);
  }
  if (!/[\d.)]$/.test(state.expression)) return state;
  return edit(state, state.expression + SYMBOLS.percent);
}

function toggleSign(state: CalculatorState): CalculatorState {
  if (state.error) return state;
  const { expression } = state;

  if (state.justEvaluated) {
    return edit(
      state,
      expression.startsWith(SYMBOLS.minus)
        ? expression.slice(1)
        : SYMBOLS.minus + expression,
    );
  }

  if (endsWithClosedValue(expression)) {
    return edit(
      state,
      `${expression}${SYMBOLS.times}${SYMBOLS.openParen}${SYMBOLS.minus}`,
    );
  }

  const number = trailingNumber(expression);
  const before = expression.slice(0, expression.length - number.length);
  const negativeGroup = SYMBOLS.openParen + SYMBOLS.minus;

  if (before.endsWith(negativeGroup)) {
    return edit(state, before.slice(0, -negativeGroup.length) + number);
  }
  if (before === SYMBOLS.minus) return edit(state, number);
  return edit(state, before + negativeGroup + number);
}

function openParen(state: CalculatorState): CalculatorState {
  const base = startsFresh(state) ? '' : state.expression;
  const join = endsWithValue(base) ? SYMBOLS.times : '';
  return edit(state, base + join + SYMBOLS.openParen);
}

function closeParen(state: CalculatorState): CalculatorState {
  if (startsFresh(state)) return state;
  const { expression } = state;
  if (openParenCount(expression) === 0 || !endsWithValue(expression)) {
    return state;
  }
  return edit(state, expression + SYMBOLS.closeParen);
}

function backspace(state: CalculatorState): CalculatorState {
  // Casio-style: DEL after "E" returns to the expression so it can be fixed.
  if (state.error) return { ...state, error: null };
  if (state.justEvaluated) {
    return { ...initialState, lastCommit: state.lastCommit };
  }
  if (state.expression === '') return state;

  // Never leave a dangling exponent marker such as "1.5E" or "1.5E-".
  const shortened = state.expression.slice(0, -1).replace(/E-?$/, '');
  return edit(state, shortened);
}

function evaluate(state: CalculatorState): CalculatorState {
  if (state.error || state.justEvaluated) return state;
  if (state.expression === '' || isPlainNumber(state.expression)) return state;

  const expression = autoClose(state.expression);
  const result = calculate(expression);
  if (!result.ok) return { ...state, error: result.error };

  return {
    expression: resultToExpression(result.display),
    previous: expression,
    justEvaluated: true,
    error: null,
    lastCommit: {
      id: (state.lastCommit?.id ?? 0) + 1,
      expression,
      result: result.display,
    },
  };
}
