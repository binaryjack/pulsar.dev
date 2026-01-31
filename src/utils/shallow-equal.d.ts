/**
 * Shallow equality comparison for props
 * Used by component memoization system
 *
 * @param a - First object to compare
 * @param b - Second object to compare
 * @param skipKeys - Keys to exclude from comparison (e.g., 'children')
 * @returns true if objects are shallowly equal
 */
export declare function shallowEqual(
  a: Record<string, any>,
  b: Record<string, any>,
  skipKeys?: string[]
): boolean;
