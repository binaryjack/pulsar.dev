/**
 * Base36 encoding/decoding utilities
 * Provides compact string representation of numbers
 */
/**
 * Encode a non-negative integer to base36 string
 * @param num - Non-negative integer to encode
 * @returns Base36 encoded string
 * @throws Error if number is negative or not an integer
 */
export declare function encodeBase36(num: number): string;
/**
 * Decode a base36 string to integer
 * @param str - Base36 encoded string
 * @returns Decoded integer
 * @throws Error if string contains invalid characters
 */
export declare function decodeBase36(str: string): number;
