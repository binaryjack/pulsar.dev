/**
 * Get full path from root to element
 */

import type { IRegistryInspector } from '../registry-inspector.types';

/**
 * Get path from root element to target element
 * Returns array of element IDs from root to target
 */
export const getPath = function (this: IRegistryInspector, elementId: string): string[] {
  const registry = this.appRoot.registry;
  const path: string[] = [];
  let currentId: string | undefined = elementId;

  // Walk up the parent chain
  while (currentId) {
    path.unshift(currentId); // Add to front
    const entry = registry.get(currentId);
    if (!entry || !entry.parentId) {
      break;
    }
    currentId = entry.parentId;
  }

  return path;
};
