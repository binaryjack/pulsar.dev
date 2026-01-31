import { ICoreRegistry } from '../core/registry.types';

/**
 * Node Watcher
 * Automatically cleans up wires and component instances when DOM nodes are removed
 */
export interface INodeWatcher {
  readonly registry: ICoreRegistry;
  readonly observer: MutationObserver | null;

  /**
   * Initialize the watcher (should be called once on framework boot)
   */
  init(): void;

  /**
   * Cleanup a specific node and its children
   */
  cleanup(node: Node): void;

  /**
   * Dispose the watcher
   */
  dispose(): void;
}
