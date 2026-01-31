import { $REGISTRY } from '../../registry/core';
import { ISignal, ISignalOptions } from './signal.types';

// Import prototype methods
import { dispose } from './prototype/dispose';
import { read } from './prototype/read';
import { subscribe } from './prototype/subscribe';
import { unsubscribe } from './prototype/unsubscribe';
import { write } from './prototype/write';

// Signal ID counter for SSR
let signalIdCounter = 0;

/**
 * Reset signal ID counter (used for SSR server-side rendering)
 */
export function resetSignalIdCounter(): void {
  signalIdCounter = 0;
}

/**
 * Signal constructor function (prototype-based class)
 * Reactive primitive for fine-grained reactivity
 */
export const Signal = function <T>(this: ISignal<T>, initialValue: T, options?: ISignalOptions<T>) {
  // Generate unique ID for SSR support
  const id = `sig_${++signalIdCounter}`;

  // Define ID property
  Object.defineProperty(this, '_id', {
    value: id,
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Define _isSignal marker
  Object.defineProperty(this, '_isSignal', {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Define value property
  Object.defineProperty(this, '_value', {
    value: initialValue,
    writable: true,
    configurable: false,
    enumerable: false,
  });

  // Define subscribers set
  Object.defineProperty(this, 'subscribers', {
    value: new Set<() => void>(),
    writable: false,
    configurable: false,
    enumerable: false,
  });

  // Define options if provided
  if (options) {
    Object.defineProperty(this, 'options', {
      value: options,
      writable: false,
      configurable: false,
      enumerable: false,
    });
  }

  // Register in $REGISTRY for SSR
  $REGISTRY._signals.set(id, this as any);
} as unknown as { new <T>(initialValue: T, options?: ISignalOptions<T>): ISignal<T> };

// Attach prototype methods
Object.assign(Signal.prototype, {
  read,
  write,
  subscribe,
  unsubscribe,
  dispose,
});
