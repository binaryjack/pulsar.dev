/**
 * Clear method for ElementRegistry
 * Clears all entries from the registry
 */
import type { IElementRegistry } from '../element-registry.types';

export function clear(this: IElementRegistry): void {
  // Call cleanup for all entries
  for (const [id, entry] of this.registry.entries()) {
    const metadata = this.metadata.get(entry.element);
    if (metadata?.cleanup) {
      metadata.cleanup();
    }
  }

  // Clear all maps
  this.registry.clear();
  this.parentChildren.clear();

  // WeakMap will auto-cleanup when elements are GC'd
}
