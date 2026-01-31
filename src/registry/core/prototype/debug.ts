/**
 * Debug Mode for Core Registry
 * Enable inspection of wires, components, and signals
 */

import type { ICoreRegistry } from '../registry.types';

/**
 * Enable debug mode
 * Adds debugging capabilities to $REGISTRY
 */
export const enableDebug = function (this: ICoreRegistry): void {
  Object.defineProperty(this, '_debugEnabled', {
    value: true,
    writable: true,
    configurable: true,
    enumerable: false,
  });

  console.log('[Pulsar Registry] Debug mode enabled');
};

/**
 * Disable debug mode
 */
export const disableDebug = function (this: ICoreRegistry): void {
  Object.defineProperty(this, '_debugEnabled', {
    value: false,
    writable: true,
    configurable: true,
    enumerable: false,
  });

  console.log('[Pulsar Registry] Debug mode disabled');
};

/**
 * Get all active wires for debugging
 * Returns array of { element, property, value, subscriptions }
 */
export const getWires = function (this: ICoreRegistry): Array<{
  element: HTMLElement;
  property: string;
  subscriptions: number;
}> {
  const wires: Array<{ element: HTMLElement; property: string; subscriptions: number }> = [];

  // Note: WeakMap doesn't allow iteration
  // In debug mode, we'd need to track wires separately
  console.warn('[Pulsar Registry] Wire inspection requires debug tracking (not yet implemented)');

  return wires;
};

/**
 * Get component tree for debugging
 * Returns nested structure of active components
 */
export const getComponentTree = function (this: ICoreRegistry): any {
  const tree: any = {};

  this._instances.forEach((context, id) => {
    tree[id] = {
      id: context.id,
      parent: context.parentId || null,
    };
  });

  return tree;
};

/**
 * Get all registered signals
 */
export const getSignals = function (this: ICoreRegistry): Record<string, any> {
  const signals: Record<string, any> = {};

  this._signals.forEach((signal, id) => {
    const signalAny = signal as any;
    signals[id] = {
      id,
      value: signalAny.read ? signalAny.read() : signal,
      type: typeof signal,
    };
  });

  return signals;
};

/**
 * Get statistics about registry usage
 */
export const getStats = function (this: ICoreRegistry): {
  components: number;
  signals: number;
  stackDepth: number;
  ownerStackDepth: number;
  hidCounter: number;
} {
  return {
    components: this._instances.size,
    signals: this._signals.size,
    stackDepth: this._stack.length,
    ownerStackDepth: this._ownerStack.length,
    hidCounter: this._hidCounter,
  };
};

/**
 * Log current registry state
 */
export const logState = function (this: ICoreRegistry): void {
  console.group('[Pulsar Registry] Current State');
  console.log('Stats:', this.getStats());
  console.log('Component Tree:', this.getComponentTree());
  console.log('Signals:', this.getSignals());
  console.groupEnd();
};

/**
 * Clear all registry state (for testing)
 */
export const reset = function (this: ICoreRegistry): void {
  this._stack.length = 0;
  this._instances.clear();
  this._signals.clear();
  this._ownerStack.length = 0;
  this._hidCounter = 0;
  this._currentEffect = null;

  console.log('[Pulsar Registry] State reset');
};
