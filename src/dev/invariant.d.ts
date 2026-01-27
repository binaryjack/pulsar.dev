/**
 * Assert a condition and throw an error if false
 * Only runs in development mode
 *
 * @example
 * ```typescript
 * invariant(
 *   value !== undefined,
 *   'Value is required',
 *   'MyComponent'
 * )
 * ```
 */
export declare function invariant(condition: boolean, message: string, component?: string, hint?: string): asserts condition;
