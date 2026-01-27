/**
 * UnregisterSubtree method for ElementRegistry
 * Recursively unregisters an element and all its descendants
 */
import type { IElementRegistry } from '../element-registry.types';

export function unregisterSubtree(this: IElementRegistry, rootId: string): void {
  // Collect all IDs to remove (breadth-first traversal)
  const toRemove: string[] = [];
  const queue: string[] = [rootId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    toRemove.push(currentId);

    // Add children to queue
    const children = this.getChildren(currentId);
    queue.push(...children);
  }

  // Remove all collected IDs
  for (const id of toRemove) {
    this.unregister(id);
  }
}
