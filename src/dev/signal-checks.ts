import { DEV } from './dev.types'

/**
 * Validate signal usage patterns
 */

/**
 * Warn if reading signal outside effect context
 */
export function checkSignalUsage(signalName?: string): void {
  if (!DEV) return
  
  // Check if we're in an effect context
  // This would need integration with effect system
  const inEffect = checkEffectContext()
  
  if (!inEffect) {
    const name = signalName || 'Signal'
    console.warn(
      `[pulsar] ${name} was read outside an effect.`,
      '\nThis value will not update reactively.',
      '\nWrap in createEffect() or use in JSX expression.'
    )
  }
}

/**
 * Check if currently in effect context
 * This is a stub - needs integration with effect system
 */
function checkEffectContext(): boolean {
  // TODO: Integrate with actual effect tracking
  return false
}

/**
 * Warn about common signal mistakes
 */
export function validateSignalWrite(oldValue: unknown, newValue: unknown): void {
  if (!DEV) return
  
  // Warn about mutating objects
  if (
    typeof oldValue === 'object' && 
    oldValue !== null &&
    oldValue === newValue
  ) {
    console.warn(
      '[pulsar] Signal set to same object reference.',
      '\nMutating objects in place will not trigger updates.',
      '\nCreate a new object instead: setState({...state, key: value})'
    )
  }
}

/**
 * Warn about forgotten function calls
 */
export function checkForgottenCall(context: string): void {
  if (!DEV) return
  
  console.warn(
    `[pulsar] Possible forgotten () in ${context}.`,
    '\nDid you mean to call the signal? Use count() instead of count.'
  )
}
