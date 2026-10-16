import { CalcError, type Operator, type Token } from './types';

// Accepts "12", "12.", ".5" and an optional exponent ("1.5E-7"), which only
// appears when a formatted result is reused as the start of a new expression.
const NUMBER_PATTERN = /^(?:\d+\.?\d*|\.\d+)(?:E[-−]?\d+)?/;

const OPERATORS: Record<string, Operator> = {
  '+': 'plus',
  '−': 'minus',
  '-': 'minus',
  '×': 'times',
  '*': 'times',
  '÷': 'divide',
  '/': 'divide',
};

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < input.length) {
    const char = input[index];

    if (char === ' ') {
      index += 1;
      continue;
    }

    const numberMatch = NUMBER_PATTERN.exec(input.slice(index));
    if (numberMatch) {
      const text = numberMatch[0];
      // "1.2.3" would otherwise split into "1.2" and ".3".
      if (input[index + text.length] === '.') {
        throw new CalcError('SYNTAX', 'Number has two decimal points');
      }
      const value = Number(text.replace('−', '-'));
      if (!Number.isFinite(value)) throw new CalcError('OVERFLOW');
      tokens.push({ type: 'number', value, text });
      index += text.length;
      continue;
    }

    const operator = OPERATORS[char];
    if (operator) {
      tokens.push({ type: 'operator', operator });
    } else if (char === '%') {
      tokens.push({ type: 'percent' });
    } else if (char === '(') {
      tokens.push({ type: 'openParen' });
    } else if (char === ')') {
      tokens.push({ type: 'closeParen' });
    } else {
      throw new CalcError('SYNTAX', `Unexpected character "${char}"`);
    }
    index += 1;
  }

  return tokens;
}
