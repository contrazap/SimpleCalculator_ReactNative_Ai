import { formatNumber, roundSignificant } from '@/engine/format';

describe('formatNumber', () => {
  it.each([
    [0, '0'],
    [-0, '0'],
    [42, '42'],
    [-7.5, '-7.5'],
    [0.30000000000000004, '0.3'],
    // 12 digits on the LCD, counting the leading zero (like a Casio).
    [1 / 3, '0.33333333333'],
    [2 / 3, '0.66666666667'],
    [-1 / 3, '-0.33333333333'],
    [123456.789, '123456.789'],
    [999999999999, '999999999999'],
    [0.000001, '0.000001'],
  ])('formats %p as %p', (value, expected) => {
    expect(formatNumber(value)).toBe(expected);
  });

  it('uses exponent notation for very large and very small numbers', () => {
    expect(formatNumber(1e12)).toBe('1E12');
    expect(formatNumber(1234567890123456)).toBe('1.234568E15');
    expect(formatNumber(-2.5e20)).toBe('-2.5E20');
    expect(formatNumber(1.5e-7)).toBe('1.5E-7');
  });

  it('rejects non-finite numbers', () => {
    expect(() => formatNumber(Infinity)).toThrow(RangeError);
    expect(() => formatNumber(NaN)).toThrow(RangeError);
  });
});

describe('roundSignificant', () => {
  it('removes float noise', () => {
    expect(roundSignificant(0.1 + 0.2, 15)).toBe(0.3);
  });
});
