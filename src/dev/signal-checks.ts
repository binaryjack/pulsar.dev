import { DEV } from './dev.types';

/**
 * Context tracking for effect execution
 */
let effectDepth = 0;
const effectStack: string[] = [];

export function enterEffect(name: string = 'anonymous'): void {
  effectDepth++;
  effectStack.push(name);
}

export function exitEffect(): void {
  effectDepth--;
  effectStack.pop();
}

/**
 * Validate signal usage patterns
 */

/**
 * Check if a value is actually a signal function
 * @example
 * const isSignal = isSignalFunction(sidebarOpen)
 * if (isSignal) console.warn('Did you mean sidebarOpen()?')
 */
export function isSignalFunction(value: unknown): value is () => unknown {
  return (
    typeof value === 'function' &&
    // Check for signal marker if available
    ((value as any).__isSignal === true ||
      // Or check if function has no parameters (signals are 0-arg)
      (value as Function).length === 0)
  );
}

/**
 * Warn if reading signal outside effect context
 */
export function checkSignalUsage(signalName?: string): void {
  if (!DEV) return;

  // Check if we're in an effect context
  const inEffect = effectDepth > 0;

  if (!inEffect) {
    const name = signalName || 'Signal';
    const context = effectStack.length > 0 ? ` (in ${effectStack[effectStack.length - 1]})` : '';
    console.warn(
      `[pulsar] ⚠️ ${name} was read outside an effect${context}.`,
      '\nThis value will not update reactively.',
      '\nWrap in createEffect() or use in JSX expression.'
    );
  }
}

/**
 * Check if currently in effect context
 */
function checkEffectContext(): boolean {
  return effectDepth > 0;
}

/**
 * Detect when signal functions are passed to props expecting values
 * This catches the "forgot to call signal()" mistake
 *
 * @example
 * const value = checkForgottenSignalCall(sidebarOpen, 'sidebarOpen', 'Header.sidebarOpen')
 * // Warns: Signal "sidebarOpen" passed without calling. Use sidebarOpen() instead.
 */
export function checkForgottenSignalCall(
  actualValue: unknown,
  expectedType: string | 'boolean' | 'string' | 'number' | 'object',
  componentPropPath: string = ''
): unknown {
  if (!DEV) return actualValue;

  // Check if value is a signal function but expected type is NOT a function
  if (isSignalFunction(actualValue) && expectedType !== 'function') {
    const varName = (actualValue as any).name || 'signal';
    const propPath = componentPropPath ? ` in ${componentPropPath}` : '';

    console.warn(
      `[pulsar] ⚠️ Forgotten signal call${propPath}!`,
      `\nSignal "${varName}" passed to prop expecting ${expectedType}.`,
      `\nDid you mean: ${varName}() instead of ${varName}?`,
      `\nSignals must be called with () to get their current value.`
    );

    // Return called value in dev to help catch related errors
    try {
      return (actualValue as any)();
    } catch {
      return actualValue;
    }
  }

  return actualValue;
}

/**
 * Warn about common signal mistakes
 */
export function validateSignalWrite(oldValue: unknown, newValue: unknown): void {
  if (!DEV) return;

  // Warn about mutating objects
  if (typeof oldValue === 'object' && oldValue !== null && oldValue === newValue) {
    console.warn(
      '[pulsar] ⚠️ Signal set to same object reference.',
      '\nMutating objects in place will not trigger updates.',
      '\nCreate a new object instead: setState({...state, key: value})'
    );
  }
}

/**
 * Warn about forgotten function calls
 */
export function checkForgottenCall(context: string): void {
  if (!DEV) return;

  console.warn(
    `[pulsar] Possible forgotten () in ${context}.`,
    '\nDid you mean to call the signal? Use count() instead of count.'
  );
}
