import type { Operator } from '@/engine/types';
import type { CalculatorAction, Digit } from '@/state/actions';
import {
  calculatorReducer,
  initialState,
  MAX_NUMBER_DIGITS,
  type CalculatorState,
} from '@/state/calculatorReducer';
import { selectDisplay } from '@/state/selectors';

const OPERATOR_KEYS: Record<string, Operator> = {
  '+': 'plus',
  '−': 'minus',
  '×': 'times',
  '÷': 'divide',
};

/** Turns a key string such as "12+3=" into actions. "±" toggles sign, "<" is backspace, "C" clears. */
function keys(sequence: string): CalculatorAction[] {
  return [...sequence].map((key): CalculatorAction => {
    if (/\d/.test(key)) return { type: 'digit', digit: key as Digit };
    if (key in OPERATOR_KEYS)
      return { type: 'operator', operator: OPERATOR_KEYS[key] };
    switch (key) {
      case '.':
        return { type: 'decimal' };
      case '%':
        return { type: 'percent' };
      case '±':
        return { type: 'toggleSign' };
      case '(':
        return { type: 'openParen' };
      case ')':
        return { type: 'closeParen' };
      case '<':
        return { type: 'backspace' };
      case 'C':
        return { type: 'clear' };
      case '=':
        return { type: 'evaluate' };
      default:
        throw new Error(`Unknown key ${key}`);
    }
  });
}

function press(sequence: string, from: CalculatorState = initialState) {
  return keys(sequence).reduce(calculatorReducer, from);
}

const expressionAfter = (sequence: string) => press(sequence).expression;
const mainAfter = (sequence: string) => selectDisplay(press(sequence)).mainLine;

describe('calculatorReducer', () => {
  describe('entering numbers', () => {
    it('appends digits', () => {
      expect(expressionAfter('123')).toBe('123');
    });

    it('drops leading zeros', () => {
      expect(expressionAfter('007')).toBe('7');
      expect(expressionAfter('5+007')).toBe('5+7');
    });

    it('adds a zero before a leading decimal point', () => {
      expect(expressionAfter('.5')).toBe('0.5');
      expect(expressionAfter('2×.5')).toBe('2×0.5');
    });

    it('ignores a second decimal point in the same number', () => {
      expect(expressionAfter('1.2.3')).toBe('1.23');
      expect(expressionAfter('1.2+3.4')).toBe('1.2+3.4');
    });

    it(`caps a number at ${MAX_NUMBER_DIGITS} digits`, () => {
      expect(expressionAfter('1234567890123456789')).toBe('123456789012345');
    });

    it('multiplies implicitly after ")" or "%"', () => {
      expect(expressionAfter('(2)3')).toBe('(2)×3');
      expect(expressionAfter('50%2')).toBe('50%×2');
    });
  });

  describe('operators', () => {
    it('replaces repeated operators', () => {
      expect(expressionAfter('5+×')).toBe('5×');
      expect(expressionAfter('5+−+')).toBe('5+');
    });

    it('allows a minus after × or ÷ for negative numbers', () => {
      expect(expressionAfter('5×−3')).toBe('5×−3');
      expect(press('5×−3=').expression).toBe('−15');
    });

    it('ignores operators other than minus at the start', () => {
      expect(expressionAfter('×')).toBe('');
      expect(expressionAfter('−5')).toBe('−5');
      expect(expressionAfter('(×')).toBe('(');
    });
  });

  describe('percent', () => {
    it('follows Casio semantics', () => {
      expect(mainAfter('200+10%=')).toBe('220');
      expect(mainAfter('200−10%=')).toBe('180');
      expect(mainAfter('200×10%=')).toBe('20');
      expect(mainAfter('200÷10%=')).toBe('2000');
      expect(mainAfter('50%=')).toBe('0.5');
    });

    it('needs a value before it and cannot repeat', () => {
      expect(expressionAfter('%')).toBe('');
      expect(expressionAfter('5+%')).toBe('5+');
      expect(expressionAfter('5%%')).toBe('5%');
    });
  });

  describe('sign toggle', () => {
    it('wraps the last number as a negative group and back', () => {
      expect(expressionAfter('5±')).toBe('(−5');
      expect(expressionAfter('5±±')).toBe('5');
      expect(expressionAfter('12+5±')).toBe('12+(−5');
      expect(mainAfter('12+5±')).toBe('7');
    });

    it('starts a negative group on an empty expression', () => {
      expect(expressionAfter('±3')).toBe('(−3');
    });

    it('negates a result', () => {
      expect(expressionAfter('2+3=±')).toBe('−5');
      expect(expressionAfter('2−3=±')).toBe('1');
    });
  });

  describe('parentheses', () => {
    it('only closes open groups after a value', () => {
      expect(expressionAfter(')')).toBe('');
      expect(expressionAfter('(2+)')).toBe('(2+');
      expect(expressionAfter('(2))')).toBe('(2)');
    });

    it('multiplies implicitly before "("', () => {
      expect(expressionAfter('2(')).toBe('2×(');
    });

    it('auto-closes open groups on =', () => {
      const state = press('(2+3×(1+1=');
      expect(state.previous).toBe('(2+3×(1+1))');
      expect(selectDisplay(state).mainLine).toBe('8');
    });
  });

  describe('evaluate', () => {
    it('respects precedence and hides float artifacts', () => {
      expect(mainAfter('2+3×4=')).toBe('14');
      expect(mainAfter('0.1+0.2=')).toBe('0.3');
    });

    it('records a commit for history', () => {
      const state = press('2+3=');
      expect(state.lastCommit).toEqual({
        id: 1,
        expression: '2+3',
        result: '5',
      });
      expect(press('×2=', state).lastCommit).toEqual({
        id: 2,
        expression: '5×2',
        result: '10',
      });
    });

    it('continues from the result with an operator, starts fresh with a digit', () => {
      expect(expressionAfter('2+3=×2')).toBe('5×2');
      expect(expressionAfter('2+3=7')).toBe('7');
      expect(expressionAfter('2+3=.')).toBe('0.');
    });

    it('does nothing for an empty expression, a plain number, or a repeat', () => {
      expect(press('=')).toEqual(initialState);
      expect(press('5=').justEvaluated).toBe(false);
      expect(press('2+3==').lastCommit?.id).toBe(1);
    });

    it('shows E for division by zero and keeps the expression', () => {
      const state = press('5÷0=');
      expect(state.error).toBe('DIV_ZERO');
      expect(state.expression).toBe('5÷0');
      expect(selectDisplay(state)).toMatchObject({
        mainLine: 'E',
        isError: true,
      });
    });

    it('shows E for a malformed expression', () => {
      expect(press('5+=').error).toBe('SYNTAX');
    });

    it('formats very large and very small results', () => {
      expect(mainAfter('99999999×99999999=')).toBe('1E16');
      expect(mainAfter('1÷3000000000=')).toBe('3.333333E-10');
    });

    it('can keep calculating from an exponent result', () => {
      expect(mainAfter('99999999×99999999=÷2=')).toBe('5E15');
    });
  });

  describe('errors', () => {
    it('clears the error with backspace and returns to the expression', () => {
      const state = press('5÷0=<');
      expect(state.error).toBeNull();
      expect(state.expression).toBe('5÷0');
    });

    it('starts fresh on a digit and ignores operators', () => {
      expect(expressionAfter('5÷0=7')).toBe('7');
      expect(expressionAfter('5÷0=+')).toBe('5÷0');
    });
  });

  describe('backspace and clear', () => {
    it('does nothing on an empty input', () => {
      expect(press('<')).toEqual(initialState);
    });

    it('removes the last character', () => {
      expect(expressionAfter('12+<')).toBe('12');
      expect(expressionAfter('12<<<')).toBe('');
    });

    it('clears a result entirely', () => {
      expect(expressionAfter('2+3=<')).toBe('');
    });

    it('never leaves a dangling exponent', () => {
      const result = press('99999999×99999999=+');
      expect(press('<<', result).expression).toBe('1E1');
      expect(press('<<<', result).expression).toBe('1');
    });

    it('AC clears everything but keeps the last commit id', () => {
      const state = press('2+3=4C');
      expect(state).toEqual({ ...initialState, lastCommit: state.lastCommit });
      expect(state.lastCommit?.id).toBe(1);
    });
  });

  it('loads an expression from history', () => {
    const state = calculatorReducer(press('9'), {
      type: 'load',
      expression: '1+1',
    });
    expect(state.expression).toBe('1+1');
    expect(selectDisplay(state).mainLine).toBe('2');
  });
});

describe('selectDisplay', () => {
  it('shows 0 when empty', () => {
    expect(selectDisplay(initialState)).toEqual({
      expressionLine: '',
      mainLine: '0',
      isError: false,
      isPreview: false,
    });
  });

  it('shows the number literally while it is typed', () => {
    expect(mainAfter('0.')).toBe('0.');
    expect(mainAfter('1.50')).toBe('1.50');
  });

  it('shows a live preview', () => {
    expect(selectDisplay(press('12+3'))).toMatchObject({
      expressionLine: '12+3',
      mainLine: '15',
      isPreview: true,
    });
  });

  it('falls back to the last number when the expression is incomplete', () => {
    expect(mainAfter('12+')).toBe('12');
    expect(mainAfter('12+3×')).toBe('3');
  });

  it('shows the previous expression after a result', () => {
    expect(selectDisplay(press('2−7='))).toEqual({
      expressionLine: '2−7 =',
      mainLine: '-5',
      isError: false,
      isPreview: false,
    });
  });
});
