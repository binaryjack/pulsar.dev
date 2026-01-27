/**
 * Calculate nesting depth for an element
 */

import type { IRegistryInspector } from '../registry-inspector.types';

/**
 * Calculate how deeply nested an element is
 * Root elements return 0
 */
export const getDepth = function (this: IRegistryInspector, elementId: string): number {
  const registry = this.appRoot.registry;
  let depth = 0;
  let currentId: string | undefined = elementId;

  // Walk up the parent chain
  while (currentId) {
    const entry = registry.get(currentId);
    if (!entry || !entry.parentId) {
      break;
    }
    depth++;
    currentId = entry.parentId;
  }

  return depth;
};
