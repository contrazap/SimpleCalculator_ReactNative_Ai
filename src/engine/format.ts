/** Significant digits the LCD shows. */
export const DISPLAY_DIGITS = 12;

const MAX_PLAIN = 10 ** DISPLAY_DIGITS;
const MIN_PLAIN = 1e-6;
const EXPONENT_FRACTION_DIGITS = 6;

/** Rounds to `digits` significant digits, which hides binary float noise. */
export function roundSignificant(value: number, digits: number): number {
  if (value === 0 || !Number.isFinite(value)) return value;
  return Number(value.toPrecision(digits));
}

/**
 * Formats a number for the LCD: at most 12 significant digits, no trailing
 * zeros, and exponent notation ("1.5E-7") outside the plain range.
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) throw new RangeError('Cannot format a non-finite number');

  const rounded = roundSignificant(value, DISPLAY_DIGITS);
  if (rounded === 0) return '0';

  const magnitude = Math.abs(rounded);
  if (magnitude >= MAX_PLAIN || magnitude < MIN_PLAIN) {
    return formatExponent(rounded);
  }

  const integerDigits = Math.max(1, Math.floor(Math.log10(magnitude)) + 1);
  const fractionDigits = Math.max(0, DISPLAY_DIGITS - integerDigits);
  return stripTrailingZeros(rounded.toFixed(fractionDigits));
}

function formatExponent(value: number): string {
  const [mantissa, exponent] = value
    .toExponential(EXPONENT_FRACTION_DIGITS)
    .split('e');
  return `${stripTrailingZeros(mantissa)}E${Number(exponent)}`;
}

function stripTrailingZeros(text: string): string {
  if (!text.includes('.')) return text;
  return text.replace(/0+$/, '').replace(/\.$/, '');
}
