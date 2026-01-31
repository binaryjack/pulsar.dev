import type { ICoreRegistry } from '../registry.types';

/**
 * Boot client-side signals with server state
 * Re-seeds signal values without triggering effects during hydration
 */
export const boot = function (this: ICoreRegistry, state: Record<string, unknown> | null): void {
  if (!state) return;

  // Restore signals
  if (state.signals && typeof state.signals === 'object') {
    for (const [id, val] of Object.entries(state.signals)) {
      if (this._signals.has(id)) {
        const signal = this._signals.get(id)!;
        // Set private value directly to avoid triggering effects during boot
        if ('_value' in signal) {
          (signal as any)._value = val;
        }
      }
    }
  }

  // Restore HID counter
  if (typeof state.hid === 'number') {
    this._hidCounter = state.hid;
  }

  // Note: components are tracked dynamically during execution, not restored from state
};
