import { popContext, pushContext } from '../../../lifecycle/context-bus';
import type { IComponentContext, ICoreRegistry, WireDisposer } from '../registry.types';

/**
 * Execute a component factory within a tracked context
 * Creates a new component context and pushes it onto the stack.
 * Collects onMount / onCleanup / onUpdate registrations via context-bus
 * and binds them to the component's root element after the factory runs.
 */
export const execute = function <T>(
  this: ICoreRegistry,
  id: string,
  parentId: string | null,
  factory: () => T
): T {
  console.log('[REGISTRY.execute] START:', id, 'parentId:', parentId);

  // Create component context
  const context: IComponentContext = {
    id,
    parentId,
    provides: Object.create(null),
  };

  // Store instance
  this._instances.set(id, context);

  // Push onto registry stack
  this._stack.push(context);

  // Open a lifecycle collection slot (for onMount/onCleanup/onUpdate)
  pushContext();

  // Track whether popContext was already called (success path)
  let contextPopped = false;

  try {
    // Execute factory in context
    const result = factory();

    console.log(
      '[REGISTRY.execute] RESULT:',
      id,
      'result:',
      result,
      'instanceof HTMLElement:',
      result instanceof HTMLElement
    );

    // Collect lifecycle callbacks registered during factory execution
    const pending = popContext();
    contextPopped = true;

    if (result instanceof HTMLElement) {
      // Mount callbacks: run immediately after element is created
      for (const fn of pending.mount) {
        try {
          fn();
        } catch (e) {
          console.error('[execute] onMount error:', e);
        }
      }

      // Cleanup callbacks: attach as wire disposers so disposeElement runs them
      if (pending.cleanup.length > 0) {
        let wireSet = this._nodes.get(result);
        if (!wireSet) {
          wireSet = new Set<WireDisposer>();
          this._nodes.set(result, wireSet);
        }
        for (const fn of pending.cleanup) {
          wireSet.add(fn as WireDisposer);
        }
      }
    }

    return result;
  } finally {
    // Keep stacks balanced: pop context-bus slot if factory threw before popContext
    if (!contextPopped) popContext();
    // Always pop registry stack
    this._stack.pop();
  }
};
