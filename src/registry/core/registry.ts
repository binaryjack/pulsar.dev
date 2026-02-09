import type { ISignal } from '../../reactivity/signal/signal.types';
import type { IComponentContext, ICoreRegistry, IEffectOwner } from './registry.types';

// Import prototype methods
import { boot } from './prototype/boot';
import { disposeElement } from './prototype/dispose-element';
import { disposeTree } from './prototype/dispose-tree';
import { dump } from './prototype/dump';
import { execute } from './prototype/execute';
import { getCurrent } from './prototype/get-current';
import { getCurrentOwner } from './prototype/get-current-owner';
import { nextHid } from './prototype/next-hid';
import { runInScope } from './prototype/run-in-scope';
import { wire } from './prototype/wire';

// Import debug methods
import {
  disableDebug,
  enableDebug,
  getComponentTree,
  getSignals,
  getStats,
  getWires,
  logState,
  reset,
} from './prototype/debug';

/**
 * Core Registry Constructor
 * Global singleton for managing component lifecycle, state, and reactivity
 */
export const CoreRegistry = function (this: ICoreRegistry) {
  // Component context stack
  Object.defineProperty(this, '_stack', {
    value: [] as IComponentContext[],
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Signal storage for SSR
  Object.defineProperty(this, '_signals', {
    value: new Map<string, ISignal<unknown>>(),
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // DOM node to wire mappings (WeakMap for automatic cleanup)
  Object.defineProperty(this, '_nodes', {
    value: new WeakMap(),
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Component instances
  Object.defineProperty(this, '_instances', {
    value: new Map<string, IComponentContext>(),
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Hydration ID counter for SSR
  Object.defineProperty(this, '_hidCounter', {
    value: 0,
    writable: true,
    configurable: false,
    enumerable: false,
  });

  // Effect owner stack for nested effect tracking
  Object.defineProperty(this, '_ownerStack', {
    value: [] as IEffectOwner[],
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Current effect being executed
  Object.defineProperty(this, '_currentEffect', {
    value: null,
    writable: true,
    configurable: false,
    enumerable: false,
  });
} as unknown as { new (): ICoreRegistry };

// Attach prototype methods
Object.assign(CoreRegistry.prototype, {
  execute,
  getCurrent,
  wire,
  disposeElement,
  disposeTree,
  runInScope,
  getCurrentOwner,
  nextHid,
  boot,
  dump,
  // Debug methods
  enableDebug,
  disableDebug,
  getWires,
  getComponentTree,
  getSignals,
  getStats,
  logState,
  reset,
});
