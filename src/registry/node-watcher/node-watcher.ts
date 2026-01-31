import type { ICoreRegistry } from '../core/registry.types';
import type { INodeWatcher } from './node-watcher.types';

// Import prototype methods
import { cleanup } from './prototype/cleanup';
import { dispose } from './prototype/dispose';
import { init } from './prototype/init';

/**
 * NodeWatcher Constructor
 * Watches for removed DOM nodes and automatically cleans up associated resources
 */
export const NodeWatcher = function (this: INodeWatcher, registry: ICoreRegistry) {
  // Store reference to registry
  Object.defineProperty(this, 'registry', {
    value: registry,
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Observer initially null (created in init)
  Object.defineProperty(this, 'observer', {
    value: null,
    writable: true,
    configurable: false,
    enumerable: false,
  });
} as unknown as { new (registry: ICoreRegistry): INodeWatcher };

// Attach prototype methods
Object.assign(NodeWatcher.prototype, {
  init,
  cleanup,
  dispose,
});
