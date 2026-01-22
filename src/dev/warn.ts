import { DEV, IDevWarning } from './dev.types'

/**
 * Display a warning in development mode
 * Warnings are stripped in production builds
 * 
 * @example
 * ```typescript
 * warn({
 *   message: 'Missing key prop',
 *   component: 'For',
 *   hint: 'Add a key function for better performance'
 * })
 * ```
 */
export function warn(warning: IDevWarning | string): void {
  if (!DEV) return
  
  const msg = typeof warning === 'string' 
    ? warning 
    : formatWarning(warning)
  
  console.warn(`[pulsar] ${msg}`)
}

/**
 * Format warning with component and hint
 */
function formatWarning(warning: IDevWarning): string {
  let msg = warning.message
  
  if (warning.component) {
    msg = `[${warning.component}] ${msg}`
  }
  
  if (warning.hint) {
    msg += `\n  Hint: ${warning.hint}`
  }
  
  return msg
}
