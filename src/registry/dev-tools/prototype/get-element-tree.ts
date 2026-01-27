/**
 * Get hierarchical tree of registered elements
 */

import type { IElementTreeNode, IRegistryInspector } from '../registry-inspector.types';

/**
 * Get hierarchical tree of all registered elements
 * Builds tree structure starting from root elements (those without parents)
 */
export const getElementTree = function (this: IRegistryInspector): IElementTreeNode[] {
  const registry = this.appRoot.registry;
  const roots: IElementTreeNode[] = [];
  const built = new Set<string>();

  // Helper to build node recursively
  const buildNode = (elementId: string): IElementTreeNode | null => {
    if (built.has(elementId)) {
      return null; // Prevent infinite loops
    }
    built.add(elementId);

    const entry = registry.get(elementId);
    if (!entry) {
      return null;
    }

    // Get metadata summary
    const metadata = this.appRoot.registry.metadata.get(entry.element);
    const metadataSummary = metadata
      ? {
          effectCount: metadata.effects?.size || 0,
          signalCount: metadata.signals?.size || 0,
          hasCleanup: !!metadata.cleanup,
          renderCount: metadata.renderCount,
        }
      : undefined;

    // Build child nodes
    const childIds = registry.getChildren(elementId);
    const children: IElementTreeNode[] = [];

    for (const childId of childIds) {
      const childNode = buildNode(childId);
      if (childNode) {
        children.push(childNode);
      }
    }

    return {
      elementId,
      tagName: entry.element.tagName,
      type: entry.type,
      parentId: entry.parentId,
      children,
      metadata: metadataSummary,
    };
  };

  // Find root elements (no parent)
  for (const [elementId, entry] of Array.from(registry.registry.entries())) {
    if (!entry.parentId) {
      const node = buildNode(elementId);
      if (node) {
        roots.push(node);
      }
    }
  }

  return roots;
};
