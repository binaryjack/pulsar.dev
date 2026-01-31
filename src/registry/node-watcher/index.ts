import { $REGISTRY } from '../core';
import { NodeWatcher } from './node-watcher';
import type { INodeWatcher } from './node-watcher.types';

/**
 * Global Node Watcher Instance ($WATCHER)
 * Singleton instance for automatic cleanup of removed DOM nodes
 */
export const $WATCHER: INodeWatcher = new NodeWatcher($REGISTRY);

// Export types and constructor
export { NodeWatcher } from './node-watcher';
export type { INodeWatcher } from './node-watcher.types';
