import type { INodeWatcher } from '../node-watcher.types';

/**
 * Cleanup a specific node and all its children
 * Disposes wires and removes component instances
 */
export const cleanup = function (this: INodeWatcher, node: Node): void {
  // Only process element nodes
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const element = node as Element;

  // Recursively cleanup children first
  Array.from(element.children).forEach((child) => {
    this.cleanup(child);
  });

  // Cleanup wires attached to this node
  if (this.registry._nodes.has(element)) {
    const wireSet = this.registry._nodes.get(element)!;

    // Call each wire disposer
    wireSet.forEach((disposer) => {
      try {
        disposer();
      } catch (error) {
        console.error('[NodeWatcher] Error disposing wire:', error);
      }
    });

    // WeakMap will automatically clean up when node is garbage collected
    // But we can help by explicitly deleting
    this.registry._nodes.delete(element);
  }

  // Cleanup component instance if this element has a component ID
  const compId = element.getAttribute('data-comp-id');
  if (compId && this.registry._instances.has(compId)) {
    this.registry._instances.delete(compId);
  }
};
