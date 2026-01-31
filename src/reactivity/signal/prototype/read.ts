import { $REGISTRY } from '../../../registry/core';
import { ISignal } from '../signal.types';

/**
 * Reads the signal value and tracks the dependency if called within an effect
 */
export const read = function <T>(this: ISignal<T>): T {
  // Auto-track in running effect (wire)
  const currentEffect = $REGISTRY._currentEffect;

  if (currentEffect) {
    // Add this signal to the effect's subscriptions
    currentEffect._subs.add(this as any);
    // Subscribe the effect to this signal
    this.subscribers.add(currentEffect.run);
  }

  return this._value;
};
