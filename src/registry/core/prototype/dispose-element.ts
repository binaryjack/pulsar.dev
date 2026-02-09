import type { ICoreRegistry } from '../registry.types';

/**
 * Dispose all wire effects for a specific element
 * Called during unmount to clean up reactive subscriptions
 *
 * @param el - Element whose wires should be disposed
 */
export const disposeElement = function (this: ICoreRegistry, el: Element): void {
  if (!this._nodes.has(el)) {
    return; // No wires for this element
  }

  const wireSet = this._nodes.get(el)!;

  // Call each wire disposer
  wireSet.forEach((disposer) => {
    try {
      disposer();
    } catch (error) {
      console.error('[CoreRegistry] Error disposing wire:', error);
    }
  });

  // Clear the set (WeakMap entry will be GC'd when element is)
  wireSet.clear();
  this._nodes.delete(el);
};
