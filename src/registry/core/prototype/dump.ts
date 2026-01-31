import type { ICoreRegistry } from '../registry.types';

/**
 * Dump all signal values for SSR serialization
 * Creates a snapshot of the reactive state
 */
export const dump = function (this: ICoreRegistry): Record<string, unknown> {
  const signals: Record<string, unknown> = {};

  this._signals.forEach((signal, id) => {
    // Read the signal's internal value
    if ('_value' in signal) {
      signals[id] = (signal as any)._value;
    }
  });

  // Get component IDs from component tree
  const components = Array.from(this._components.keys());

  return {
    signals,
    components,
    hid: this._hidCounter,
  };
};
