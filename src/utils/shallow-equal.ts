/**
 * Shallow equality comparison for props
 * Used by component memoization system
 *
 * @param a - First object to compare
 * @param b - Second object to compare
 * @param skipKeys - Keys to exclude from comparison (e.g., 'children')
 * @returns true if objects are shallowly equal
 */
export function shallowEqual(
  a: Record<string, any>,
  b: Record<string, any>,
  skipKeys: string[] = []
): boolean {
  // Fast path: same reference
  if (a === b) return true;

  // Type check
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;

  // Get keys (excluding skipKeys)
  const keysA = Object.keys(a).filter((k) => !skipKeys.includes(k));
  const keysB = Object.keys(b).filter((k) => !skipKeys.includes(k));

  // Different number of keys
  if (keysA.length !== keysB.length) return false;

  // Compare each key value (reference equality)
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (a[key] !== b[key]) return false;
  }

  return true;
}
