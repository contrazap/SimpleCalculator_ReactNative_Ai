import { formatNumber, roundSignificant } from './format';
import { parse } from './parser';
import { tokenize } from './tokenizer';
import { CalcError, type CalcResult, type Node } from './types';

// Rounding every intermediate result to 15 significant digits keeps float
// noise from accumulating (0.1 + 0.2 − 0.3 is 0, not 5.55E-17).
const INTERMEDIATE_DIGITS = 15;

export function evaluate(node: Node): number {
  return checked(evaluateNode(node));
}

function evaluateNode(node: Node): number {
  switch (node.type) {
    case 'number':
      return node.value;
    case 'negate':
      return -evaluateNode(node.operand);
    case 'percent':
      return checked(evaluateNode(node.operand) / 100);
    case 'binary':
      return checked(evaluateBinary(node));
  }
}

function evaluateBinary(node: Extract<Node, { type: 'binary' }>): number {
  const left = evaluateNode(node.left);

  // Casio semantics: in "a + b%" and "a − b%", the percentage is of a.
  // For × and ÷, b% is simply b / 100 (200 × 10% = 20, 200 ÷ 10% = 2000).
  const isAdditive = node.operator === 'plus' || node.operator === 'minus';
  const right =
    isAdditive && node.right.type === 'percent'
      ? (left * evaluateNode(node.right.operand)) / 100
      : evaluateNode(node.right);

  switch (node.operator) {
    case 'plus':
      return left + right;
    case 'minus':
      return left - right;
    case 'times':
      return left * right;
    case 'divide':
      if (right === 0) throw new CalcError('DIV_ZERO');
      return left / right;
  }
}

function checked(value: number): number {
  if (!Number.isFinite(value)) throw new CalcError('OVERFLOW');
  const rounded = roundSignificant(value, INTERMEDIATE_DIGITS);
  return Object.is(rounded, -0) ? 0 : rounded;
}

/** Tokenizes, parses, evaluates and formats an expression string. */
export function calculate(input: string): CalcResult {
  try {
    const value = evaluate(parse(tokenize(input)));
    return { ok: true, value, display: formatNumber(value) };
  } catch (error) {
    if (error instanceof CalcError) return { ok: false, error: error.kind };
    throw error;
  }
}
