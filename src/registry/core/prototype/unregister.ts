/**
 * Unregister method for ElementRegistry
 * Removes an element from the registry and cleans up metadata
 */
import type { IElementRegistry } from '../element-registry.types';

export function unregister(this: IElementRegistry, id: string): void {
  const entry = this.registry.get(id);

  if (!entry) {
    // Element not found, nothing to do
    return;
  }

  // Get metadata and call cleanup if exists
  const metadata = this.metadata.get(entry.element);
  if (metadata?.cleanup) {
    metadata.cleanup();
  }

  // Remove from parent-child tracking
  if (entry.parentId) {
    const siblings = this.parentChildren.get(entry.parentId);
    if (siblings) {
      siblings.delete(id);
      // Clean up empty sets
      if (siblings.size === 0) {
        this.parentChildren.delete(entry.parentId);
      }
    }
  }

  // Remove from registry
  this.registry.delete(id);

  // WeakMap will auto-cleanup metadata when element is GC'd
}
