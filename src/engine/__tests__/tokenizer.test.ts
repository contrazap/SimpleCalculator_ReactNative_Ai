import { tokenize } from '@/engine/tokenizer';
import { CalcError } from '@/engine/types';

describe('tokenize', () => {
  it('splits numbers, operators, percent and parentheses', () => {
    expect(tokenize('12+3×(4−1)÷2%')).toEqual([
      { type: 'number', value: 12, text: '12' },
      { type: 'operator', operator: 'plus' },
      { type: 'number', value: 3, text: '3' },
      { type: 'operator', operator: 'times' },
      { type: 'openParen' },
      { type: 'number', value: 4, text: '4' },
      { type: 'operator', operator: 'minus' },
      { type: 'number', value: 1, text: '1' },
      { type: 'closeParen' },
      { type: 'operator', operator: 'divide' },
      { type: 'number', value: 2, text: '2' },
      { type: 'percent' },
    ]);
  });

  it('accepts leading and trailing decimal points', () => {
    expect(tokenize('.5')).toEqual([
      { type: 'number', value: 0.5, text: '.5' },
    ]);
    expect(tokenize('5.')).toEqual([{ type: 'number', value: 5, text: '5.' }]);
  });

  it('reads exponent notation produced by the formatter', () => {
    expect(tokenize('1.5E-7')[0]).toMatchObject({ value: 1.5e-7 });
    expect(tokenize('2E15')[0]).toMatchObject({ value: 2e15 });
  });

  it('accepts ASCII operator aliases and ignores spaces', () => {
    expect(tokenize('1 - 2 * 3 / 4').map((t) => t.type)).toEqual([
      'number',
      'operator',
      'number',
      'operator',
      'number',
      'operator',
      'number',
    ]);
  });

  it('returns no tokens for an empty string', () => {
    expect(tokenize('')).toEqual([]);
  });

  it('rejects unknown characters and a second decimal point', () => {
    expect(() => tokenize('2a')).toThrow(CalcError);
    expect(() => tokenize('1.2.3')).toThrow(CalcError);
    expect(() => tokenize('.')).toThrow(CalcError);
  });
});
