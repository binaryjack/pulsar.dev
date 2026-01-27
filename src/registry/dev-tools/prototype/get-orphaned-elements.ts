/**
 * Find orphaned elements (no parent)
 */

import type { IElementDetails, IRegistryInspector } from '../registry-inspector.types';

/**
 * Get all orphaned elements
 * Elements without parents that might indicate memory leaks
 */
export const getOrphanedElements = function (this: IRegistryInspector): IElementDetails[] {
  const registry = this.appRoot.registry;
  const orphans: IElementDetails[] = [];

  // Check all registered elements
  for (const [elementId, entry] of Array.from(registry.registry.entries())) {
    // Element is orphaned if:
    // 1. It has no parent ID
    // 2. It's not attached to the DOM tree
    // 3. It's not the root element
    if (!entry.parentId && entry.element !== this.appRoot.rootElement) {
      // Check if actually disconnected from DOM
      if (!document.contains(entry.element)) {
        const details = this.getElementDetails(elementId);
        if (details) {
          orphans.push(details);
        }
      }
    }
  }

  return orphans;
};
