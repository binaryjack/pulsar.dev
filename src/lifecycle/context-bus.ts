/**
 * Context Bus - Zero-dependency pending lifecycle callback store
 *
 * Both lifecycle-hooks.ts and execute.ts import this without creating cycles:
 *   lifecycle-hooks → context-bus  (no registry import)
 *   execute         → context-bus  (no lifecycle import)
 *
 * Works like a stack: each component execution pushes a slot on entry
 * and pops all collected callbacks on exit.
 */

export type LifecycleType = 'mount' | 'cleanup' | 'update' | 'beforeMount' | 'error';
export type LifecycleCallback = () => void;
export type ErrorCallback = (error: unknown) => void;
export type PendingSlot = {
  mount: LifecycleCallback[];
  cleanup: LifecycleCallback[];
  update: LifecycleCallback[];
  beforeMount: LifecycleCallback[];
  error: ErrorCallback[];
};

// Parallel stacks - one per lifecycle type
const mountStack: LifecycleCallback[][] = [];
const cleanupStack: LifecycleCallback[][] = [];
const updateStack: LifecycleCallback[][] = [];
const beforeMountStack: LifecycleCallback[][] = [];
const errorStack: ErrorCallback[][] = [];

/**
 * Called by execute.ts BEFORE invoking the component factory.
 * Opens a new collection slot on each stack.
 */
export function pushContext(): void {
  mountStack.push([]);
  cleanupStack.push([]);
  updateStack.push([]);
  beforeMountStack.push([]);
  errorStack.push([]);
}

/**
 * Called by execute.ts AFTER factory returns (in finally block).
 * Returns all callbacks collected during this slot, removes the slot.
 */
export function popContext(): PendingSlot {
  return {
    mount: mountStack.pop() ?? [],
    cleanup: cleanupStack.pop() ?? [],
    update: updateStack.pop() ?? [],
    beforeMount: beforeMountStack.pop() ?? [],
    error: errorStack.pop() ?? [],
  };
}

/**
 * Called by lifecycle-hooks (onMount / onCleanup / onUpdate).
 * Returns false if no active slot (called outside component context).
 */
export function registerCallback(type: LifecycleType, fn: LifecycleCallback): boolean {
  let stack: LifecycleCallback[][];
  if (type === 'mount') stack = mountStack;
  else if (type === 'cleanup') stack = cleanupStack;
  else if (type === 'update') stack = updateStack;
  else if (type === 'beforeMount') stack = beforeMountStack;
  else {
    // 'error' uses a separate typed stack — handled by registerErrorCallback
    return false;
  }

  if (stack.length === 0) return false;
  stack[stack.length - 1].push(fn);
  return true;
}

/**
 * Register an error callback for the currently executing component.
 * Returns false if called outside a component context.
 */
export function registerErrorCallback(fn: ErrorCallback): boolean {
  if (errorStack.length === 0) return false;
  errorStack[errorStack.length - 1].push(fn);
  return true;
}
