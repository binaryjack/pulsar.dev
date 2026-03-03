import { popContext, pushContext } from '../../../lifecycle/context-bus';
import type { IComponentContext, ICoreRegistry, WireDisposer } from '../registry.types';

/**
 * Execute a component factory within a tracked context.
 * Lifecycle order: beforeMount → factory → mount → (update on reactive re-run) → cleanup on dispose.
 */
export const execute = function <T>(
  this: ICoreRegistry,
  id: string,
  parentId: string | null,
  factory: () => T
): T {
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

  // Open a lifecycle collection slot (for all lifecycle callbacks)
  pushContext();

  // Track whether popContext was already called (success path)
  let contextPopped = false;

  try {
    // Execute factory in context
    const result = factory();

    // Collect lifecycle callbacks registered during factory execution
    const pending = popContext();
    contextPopped = true;

    if (result instanceof HTMLElement) {
      // beforeMount: run synchronously before the element is handed to caller
      for (const fn of pending.beforeMount) {
        fn();
      }

      // Mount callbacks: run immediately after element is created
      for (const fn of pending.mount) {
        try {
          fn();
        } catch (e) {
          console.error('[Pulsar] onMount error in component', id, ':', e);
        }
      }

      // Update callbacks: wire as wire disposers so reactive re-runs invoke them
      if (pending.update.length > 0) {
        let wireSet = this._nodes.get(result);
        if (!wireSet) {
          wireSet = new Set<WireDisposer>();
          this._nodes.set(result, wireSet);
        }
        for (const fn of pending.update) {
          // Wrap as a disposer-compatible function (disposers take no args)
          wireSet.add(fn as WireDisposer);
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
  } catch (factoryError: unknown) {
    // Collect error callbacks before re-throwing so they fire in context
    if (!contextPopped) {
      const pending = popContext();
      contextPopped = true;
      for (const fn of pending.error) {
        try {
          fn(factoryError);
        } catch (_handlerError) {
          // Error handlers must not throw — swallow silently
        }
      }
    }
    throw factoryError;
  } finally {
    // Keep stacks balanced: pop context-bus slot if factory threw before popContext
    if (!contextPopped) popContext();
    // Always pop registry stack
    this._stack.pop();
  }
};
