import { calculate } from '@/engine/evaluate';

const display = (input: string) => {
  const result = calculate(input);
  return result.ok ? result.display : result.error;
};

describe('calculate', () => {
  it.each([
    ['1+2', '3'],
    ['2+3×4', '14'],
    ['(2+3)×4', '20'],
    ['10÷4', '2.5'],
    ['8−3−1', '4'],
    ['2(3+1)', '8'],
    ['−5+2', '-3'],
    ['−(−4)', '4'],
    ['3×−2', '-6'],
    ['.5+.5', '1'],
    ['5.+1', '6'],
    ['1÷3×3', '1'],
  ])('%s = %s', (input, expected) => {
    expect(display(input)).toBe(expected);
  });

  it('hides float artifacts', () => {
    expect(display('0.1+0.2')).toBe('0.3');
    expect(display('0.1+0.2−0.3')).toBe('0');
    expect(display('1.1×1.1')).toBe('1.21');
    expect(display('0.3−0.1')).toBe('0.2');
  });

  describe('percent (Casio semantics)', () => {
    it.each([
      ['200+10%', '220'],
      ['200−10%', '180'],
      ['200×10%', '20'],
      ['200÷10%', '2000'],
      ['50%', '0.5'],
      ['−50%', '-0.5'],
      ['(100+100)+10%', '220'],
      ['200+10%×2', '200.2'],
    ])('%s = %s', (input, expected) => {
      expect(display(input)).toBe(expected);
    });
  });

  it('reports division by zero', () => {
    expect(display('5÷0')).toBe('DIV_ZERO');
    expect(display('5÷(2−2)')).toBe('DIV_ZERO');
    expect(display('5÷0%')).toBe('DIV_ZERO');
  });

  it('reports overflow', () => {
    expect(display('9E200×9E200')).toBe('OVERFLOW');
  });

  it('handles very large and very small numbers', () => {
    expect(display('12345678×87654321')).toBe('1.082152E15');
    expect(display('99999999×99999999')).toBe('1E16');
    expect(display('1÷3000000000')).toBe('3.333333E-10');
    expect(display('1E15+1')).toBe('1E15');
  });

  it.each(['', '2+', '2++3', '(2+3', '×5', '1.2.3'])(
    'reports a syntax error for %p',
    (input) => {
      expect(display(input)).toBe('SYNTAX');
    },
  );
});
