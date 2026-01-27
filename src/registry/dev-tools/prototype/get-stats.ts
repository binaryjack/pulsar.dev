/**
 * Get registry statistics
 */

import { ElementType } from '../../types';
import type { IRegistryInspector, IRegistryStats } from '../registry-inspector.types';

/**
 * Get comprehensive statistics about the registry
 */
export const getStats = function (this: IRegistryInspector): IRegistryStats {
  const registry = this.appRoot.registry;
  const totalElements = registry.size();

  // Count by type
  const elementsByType: Record<string, number> = {
    [ElementType.STATIC]: 0,
    [ElementType.DYNAMIC]: 0,
    [ElementType.COMPONENT]: 0,
  };

  let orphanedElements = 0;
  let deepestNesting = 0;
  let totalChildren = 0;
  let parentsWithChildren = 0;

  // Analyze all elements
  for (const [elementId, entry] of Array.from(registry.registry.entries())) {
    // Count by type
    elementsByType[entry.type] = (elementsByType[entry.type] || 0) + 1;

    // Check if orphaned
    if (!entry.parentId && entry.element !== this.appRoot.rootElement) {
      if (!document.contains(entry.element)) {
        orphanedElements++;
      }
    }

    // Calculate depth
    const depth = this.getDepth(elementId);
    if (depth > deepestNesting) {
      deepestNesting = depth;
    }

    // Count children
    const childIds = registry.getChildren(elementId);
    if (childIds.length > 0) {
      totalChildren += childIds.length;
      parentsWithChildren++;
    }
  }

  // Calculate average children per parent
  const averageChildrenPerParent =
    parentsWithChildren > 0 ? totalChildren / parentsWithChildren : 0;

  // Estimate memory usage
  // Rough estimate: each entry ~200 bytes (map overhead + refs + metadata)
  const memoryEstimate = totalElements * 200;

  return {
    totalElements,
    elementsByType,
    orphanedElements,
    deepestNesting,
    averageChildrenPerParent,
    memoryEstimate,
  };
};
