import type { ISignal } from '../../../reactivity/signal/signal.types';
import type { ICoreRegistry, WireDisposer } from '../registry.types';

/**
 * Wire a signal or getter to a DOM property path
 * Creates a reactive binding that auto-updates when the source changes
 *
 * @param el - Target DOM element
 * @param path - Property path (e.g., "textContent" or "style.left")
 * @param source - Signal or getter function
 * @returns Disposer function to stop the wire
 */
export const wire = function (
  this: ICoreRegistry,
  el: Element,
  path: string,
  source: ISignal<unknown> | (() => unknown)
): WireDisposer {
  // Determine if source is a Signal (has _isSignal marker and read method)
  const isSignal =
    typeof source === 'object' &&
    source !== null &&
    '_isSignal' in source &&
    (source as any)._isSignal === true &&
    typeof (source as any).read === 'function';

  // Determine if source is a getter function (not a signal)
  const isGetter = typeof source === 'function' && !isSignal;

  // Runtime guard: Handle static values gracefully (Tier 3 false positives)
  // If source is neither signal nor getter, treat as static value and set immediately
  if (!isSignal && !isGetter) {
    // Split property path
    const parts = path.split('.');
    const lastKey = parts.pop() as string;

    // Navigate to target object
    let target: any = el;
    for (const p of parts) {
      target = target[p];
    }

    // Set static value once
    target[lastKey] = source;

    // Return no-op disposer for consistency
    return () => {};
  }

  // Split property path (e.g., "style.left" -> ["style", "left"])
  const parts = path.split('.');
  const lastKey = parts.pop() as string;

  // Create the effect that updates the DOM
  const effect = () => {
    // Get the value from signal or getter
    const val = isSignal ? (source as ISignal<unknown>).read() : (source as () => unknown)();

    // Navigate to the target object
    let target: any = el;
    for (const p of parts) {
      target = target[p];
    }

    // Only update if value changed (avoid unnecessary DOM thrashing)
    if (target[lastKey] !== val) {
      target[lastKey] = val;
    }
  };

  // Store previous effect
  const previousEffect = this._currentEffect;

  // Set current effect for dependency tracking
  this._currentEffect = {
    _subs: new Set(),
    _children: new Set(),
    run: effect,
    cleanup: function () {
      this._subs.forEach((sig) => sig.unsubscribe?.(this.run));
      this._subs.clear();
      this._children.forEach((child) => child.dispose());
      this._children.clear();
    },
    dispose: function () {
      this.cleanup();
    },
  };

  // Link to parent effect owner if exists
  const parentOwner = this.getCurrentOwner();
  if (parentOwner) {
    parentOwner._children.add(this._currentEffect);
  }

  // Run effect immediately (triggers subscription)
  effect();

  // Store the completed effect for disposal
  const completedEffect = this._currentEffect;

  // Create disposer
  const disposer: WireDisposer = () => {
    if (completedEffect) {
      completedEffect.dispose();
    }
  };

  // Store disposer in node's wire set
  if (!this._nodes.has(el)) {
    this._nodes.set(el, new Set<WireDisposer>());
  }
  this._nodes.get(el)!.add(disposer);

  // Restore previous effect
  this._currentEffect = previousEffect;

  return disposer;
};
