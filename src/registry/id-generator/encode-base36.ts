/**
 * Base36 encoding/decoding utilities
 * Provides compact string representation of numbers
 */

const BASE36_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * Encode a non-negative integer to base36 string
 * @param num - Non-negative integer to encode
 * @returns Base36 encoded string
 * @throws Error if number is negative or not an integer
 */
export function encodeBase36(num: number): string {
  if (!Number.isInteger(num) || num < 0) {
    throw new Error('Base36 encoding requires non-negative integer');
  }

  if (num === 0) {
    return '0';
  }

  let result = '';
  let remaining = num;

  while (remaining > 0) {
    const digit = remaining % 36;
    result = BASE36_CHARS[digit] + result;
    remaining = Math.floor(remaining / 36);
  }

  return result;
}

/**
 * Decode a base36 string to integer
 * @param str - Base36 encoded string
 * @returns Decoded integer
 * @throws Error if string contains invalid characters
 */
export function decodeBase36(str: string): number {
  if (!str || typeof str !== 'string') {
    throw new Error('Base36 decoding requires non-empty string');
  }

  const lowerStr = str.toLowerCase();
  let result = 0;

  for (let i = 0; i < lowerStr.length; i++) {
    const char = lowerStr[i];
    const value = BASE36_CHARS.indexOf(char);

    if (value === -1) {
      throw new Error(`Invalid base36 character: "${char}"`);
    }

    result = result * 36 + value;
  }

  return result;
}
