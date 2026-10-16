import { calculate } from '@/engine/evaluate';
import { SYMBOLS } from '@/engine/types';

import type { CalculatorState } from './calculatorReducer';
import { autoClose, isPlainNumber, lastNumber } from './expressionText';

export type DisplayModel = {
  /** Small upper line: the expression being typed, or "12+3 =" after a result. */
  expressionLine: string;
  /** Big LCD line: only digits, ".", "-", "E". */
  mainLine: string;
  isError: boolean;
  /** True when mainLine is a live preview rather than a committed result. */
  isPreview: boolean;
};

const toLcd = (text: string) => text.replaceAll(SYMBOLS.minus, '-');

export function selectDisplay(state: CalculatorState): DisplayModel {
  const { expression } = state;

  if (state.error) {
    return {
      expressionLine: expression,
      mainLine: 'E',
      isError: true,
      isPreview: false,
    };
  }
  if (state.justEvaluated) {
    return {
      expressionLine: `${state.previous ?? ''} =`,
      mainLine: toLcd(expression),
      isError: false,
      isPreview: false,
    };
  }

  const editing = { expressionLine: expression, isError: false };
  if (expression === '') return { ...editing, mainLine: '0', isPreview: false };
  // Show the literal while it is typed, so "0." and "1.50" stay visible.
  if (isPlainNumber(expression)) {
    return { ...editing, mainLine: expression, isPreview: false };
  }

  const preview = calculate(autoClose(expression));
  if (preview.ok)
    return { ...editing, mainLine: preview.display, isPreview: true };
  return {
    ...editing,
    mainLine: lastNumber(expression) ?? '0',
    isPreview: false,
  };
}
