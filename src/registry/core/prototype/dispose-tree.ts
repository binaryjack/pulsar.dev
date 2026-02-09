import type { ICoreRegistry } from '../registry.types';

/**
 * Recursively dispose wire effects for an element and all its descendants
 * Called during ApplicationRoot unmount to clean up entire component tree
 *
 * @param rootElement - Root element of the tree to dispose
 */
export const disposeTree = function (this: ICoreRegistry, rootElement: Element): void {
  // Dispose wires for this element
  this.disposeElement(rootElement);

  // Recursively dispose children
  const children = Array.from(rootElement.children);
  children.forEach((child) => {
    this.disposeTree(child);
  });
};
