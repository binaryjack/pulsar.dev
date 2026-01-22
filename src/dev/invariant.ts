import { DEV, IDevError } from './dev.types'

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
export function invariant(
  condition: boolean,
  message: string,
  component?: string,
  hint?: string
): asserts condition {
  if (!DEV) return
  
  if (!condition) {
    const error: IDevError = new Error(
      `[pulsar] ${component ? `[${component}] ` : ''}${message}`
    )
    error.component = component
    error.hint = hint
    
    if (hint) {
      error.message += `\n  Hint: ${hint}`
    }
    
    throw error
  }
}
