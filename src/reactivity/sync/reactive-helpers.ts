/**
 * Reactive helpers and utilities
 * Development-time warnings and best practices enforcement
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Tracks whether we're currently inside a reactive context
 * Used to detect common reactivity mistakes
 */
let reactiveContextDepth = 0;

/**
 * Enter a reactive context (called by createEffect, useSync, etc.)
 * @internal
 */
export function enterReactiveContext(): void {
  reactiveContextDepth++;
}

/**
 * Exit a reactive context
 * @internal
 */
export function exitReactiveContext(): void {
  reactiveContextDepth--;
}

/**
 * Check if currently inside a reactive context
 * @internal
 */
export function isInReactiveContext(): boolean {
  return reactiveContextDepth > 0;
}

/**
 * Warn when signal is read outside reactive context and assigned to constant
 * This catches the common mistake: const value = signal() instead of const value = () => signal()
 *
 * @example
 * ```typescript
 * // ❌ BAD - reads signal once, creates non-reactive constant
 * const hasErrors = validationResults().length > 0;
 *
 * // ✅ GOOD - creates reactive function
 * const hasErrors = () => validationResults().length > 0;
 *
 * // ✅ ALSO GOOD - reading inside reactive context (createEffect, etc.)
 * createEffect(() => {
 *   const hasErrors = validationResults().length > 0; // This is fine
 * });
 * ```
 */
export function warnNonReactiveSignalRead(signalName?: string): void {
  if (!isDevelopment) return;
  if (isInReactiveContext()) return;

  const name = signalName || 'signal';
  console.warn(
    `[Pulsar Reactivity Warning] Signal "${name}" read outside reactive context.\n` +
      `This creates a non-reactive constant that won't update.\n\n` +
      `❌ BAD:  const value = ${name}();\n` +
      `✅ GOOD: const value = () => ${name}();\n\n` +
      `OR read it inside createEffect/useSync subscribe function.`
  );
}

/**
 * Create a reactive function wrapper with dev-time validation
 * Ensures the function is actually reactive
 *
 * @example
 * ```typescript
 * // Instead of:
 * const hasErrors = () => validationResults().length > 0;
 *
 * // Use:
 * const hasErrors = reactive(() => validationResults().length > 0, 'hasErrors');
 * // Will warn in dev if the function doesn't read any signals
 * ```
 */
export function reactive<T>(fn: () => T, debugName?: string): () => T {
  if (!isDevelopment) return fn;

  let hasReadSignal = false;
  let warnedOnce = false;

  return () => {
    hasReadSignal = false;
    const previousDepth = reactiveContextDepth;
    enterReactiveContext();

    try {
      const result = fn();

      // Warn if function never read any signals (first call only)
      if (!hasReadSignal && !warnedOnce && previousDepth === 0) {
        warnedOnce = true;
        console.warn(
          `[Pulsar Reactivity Warning] Reactive function "${debugName || 'anonymous'}" doesn't read any signals.\n` +
            `This function will never trigger updates. Consider making it a regular function.`
        );
      }

      return result;
    } finally {
      exitReactiveContext();
    }
  };
}

/**
 * Mark that a signal was read (called internally by signal.read())
 * @internal
 */
export function markSignalRead(): void {
  // This would be called by signal.read() implementation
  // For now it's a placeholder for the reactive() helper
}
