import { parse } from '@/engine/parser';
import { tokenize } from '@/engine/tokenizer';
import { CalcError } from '@/engine/types';

const tree = (input: string) => parse(tokenize(input));

describe('parse', () => {
  it('gives × and ÷ precedence over + and −', () => {
    expect(tree('2+3×4')).toEqual({
      type: 'binary',
      operator: 'plus',
      left: { type: 'number', value: 2 },
      right: {
        type: 'binary',
        operator: 'times',
        left: { type: 'number', value: 3 },
        right: { type: 'number', value: 4 },
      },
    });
  });

  it('is left-associative', () => {
    expect(tree('8−3−1')).toMatchObject({
      operator: 'minus',
      left: { operator: 'minus' },
      right: { value: 1 },
    });
  });

  it('parses unary minus and percent', () => {
    expect(tree('−5%')).toEqual({
      type: 'negate',
      operand: { type: 'percent', operand: { type: 'number', value: 5 } },
    });
  });

  it('treats a factor followed by "(" or a number as multiplication', () => {
    expect(tree('2(3)')).toMatchObject({ operator: 'times' });
    expect(tree('(2)3')).toMatchObject({ operator: 'times' });
  });

  it.each(['', '+', '2+', '×3', '(2', '2)', '()', '%'])(
    'rejects malformed input %p',
    (input) => {
      expect(() => tree(input)).toThrow(CalcError);
    },
  );
});
