/**
 * Reactive Insert Function (SolidJS-inspired)
 * Handles reactive JSX expression insertion with automatic effect wrapping
 */

import type { ISignal } from '../reactivity/signal/signal.types';
import { $REGISTRY } from '../registry/core';
import type { IEffectOwner } from '../registry/core/registry.types';
import type { NormalizedValue, ReactiveChildren } from './jsx-runtime.types';

/**
 * Inserts content into a parent element with reactive tracking
 * @param parent - Parent element to insert into
 * @param accessor - Value or function returning value to insert
 * @param marker - Optional reference node for insertion position
 * @returns Disposer function to cleanup reactive tracking
 */
export function insert(
  parent: HTMLElement,
  accessor: ReactiveChildren,
  marker?: Node | null
): (() => void) | void {
  // If marker is undefined, append to end
  if (marker === undefined) {
    marker = null;
  }

  // Handle non-function (static) values
  if (typeof accessor !== 'function') {
    insertExpression(parent, accessor, marker);
    return;
  }

  // Reactive case: create standalone effect (not wired to a property)
  // Track ALL currently-inserted nodes so array results are fully cleaned up on re-run.
  let currentNodes: Node[] = [];

  const clearCurrent = (): void => {
    for (const node of currentNodes) {
      node.parentNode?.removeChild(node);
    }
    currentNodes = [];
  };

  const trackInsert = (node: Node): void => {
    parent.insertBefore(node, marker);
    currentNodes.push(node);
  };

  // Store previous effect
  const previousEffect = $REGISTRY._currentEffect;

  // Declare `effect` with `let` so the `run` arrow function can close over it.
  // This is required because `effect.run` is stored as a bare function reference by
  // `schedule.js` (pendingEffects.add(effect.run)) and called without a receiver
  // (`t()`), which makes `this` undefined in strict-mode. Arrow functions have no
  // own `this`, so they safely capture `effect` from the enclosing scope.
  let effect: IEffectOwner;

  // Arrow — no `this`, closes over `effect` once assignment below completes.
  const run = (): void => {
    // Re-establish reactive tracking on every run so that conditionally-read
    // signals (e.g. drawEnd() only inside `if (isDrawing())`) get subscribed
    // when the branch is first entered and un-subscribed when it is left.
    //
    // 1. Remove this effect from every previously-tracked signal.
    // 2. Clear _subs.
    // 3. Set _currentEffect = effect so signal.read() re-tracks deps.
    // 4. Run accessor — new reads rebuild _subs + signal.subscribers.
    // 5. Restore _currentEffect.
    const prevEffect = $REGISTRY._currentEffect;
    effect._subs.forEach((sig: ISignal<unknown>) => {
      sig.subscribers.delete(run);
    });
    effect._subs.clear();
    $REGISTRY._currentEffect = effect;
    let value: ReturnType<typeof accessor>;
    try {
      value = accessor(); // Tracks signal reads
    } finally {
      $REGISTRY._currentEffect = prevEffect;
    }

    // Handle different value types
    if (value === null || value === undefined) {
      clearCurrent();
      return;
    }

    const normalized = normalizeIncomingValue(value);

    // Update or create text node
    if (typeof normalized === 'string' || typeof normalized === 'number') {
      // Optimise: reuse an existing single Text node to avoid DOM churn
      if (currentNodes.length === 1 && currentNodes[0] instanceof Text) {
        if (currentNodes[0].data !== String(normalized)) {
          currentNodes[0].data = String(normalized);
        }
      } else {
        clearCurrent();
        trackInsert(document.createTextNode(String(normalized)));
      }
    } else if (normalized instanceof Node) {
      // Optimise: skip if same node is already present
      if (currentNodes.length === 1 && currentNodes[0] === normalized) {
        return;
      }
      clearCurrent();
      trackInsert(normalized);
    } else if (Array.isArray(normalized)) {
      // Clear ALL previously inserted nodes before inserting the new set
      clearCurrent();
      for (const item of normalized) {
        const normalizedItem = normalizeIncomingValue(item);
        if (normalizedItem instanceof Node) {
          trackInsert(normalizedItem);
        } else if (normalizedItem !== null && normalizedItem !== undefined) {
          trackInsert(document.createTextNode(String(normalizedItem)));
        }
      }
    }
  };

  // Construct the effect object AFTER run is defined so the arrow can close over it.
  effect = {
    _subs: new Set<ISignal<unknown>>(),
    _children: new Set<IEffectOwner>(),
    run,
    cleanup() {
      effect._subs.forEach((sig) => sig.unsubscribe?.(run));
      effect._subs.clear();
      effect._children.forEach((child) => child.dispose());
      effect._children.clear();
    },
    dispose() {
      effect.cleanup();
    },
  };

  // Link to parent effect owner if exists
  const parentOwner = $REGISTRY.getCurrentOwner();
  if (parentOwner) {
    parentOwner._children.add(effect);
  }

  // Set current effect for dependency tracking and run immediately.
  // Do NOT use $REGISTRY._currentEffect = effect here — run() sets it itself.
  effect.run();

  // Restore previous effect
  $REGISTRY._currentEffect = previousEffect;

  // Return disposer for cleanup
  return () => {
    effect.dispose();
  };
}

/**
 * Insert static expression (non-reactive)
 */
function insertExpression(parent: HTMLElement, value: ReactiveChildren, marker: Node | null): void {
  if (value === null || value === undefined) {
    return;
  }

  const normalized = normalizeIncomingValue(value);

  if (typeof normalized === 'string' || typeof normalized === 'number') {
    const textNode = document.createTextNode(String(normalized));
    parent.insertBefore(textNode, marker);
  } else if (normalized instanceof Node) {
    parent.insertBefore(normalized, marker);
  } else if (Array.isArray(normalized)) {
    for (const item of normalized) {
      insertExpression(parent, item, marker);
    }
  }
}

/**
 * Normalize incoming values to renderable types
 */
function normalizeIncomingValue(value: ReactiveChildren): NormalizedValue | NormalizedValue[] {
  // Handle boolean values
  if (typeof value === 'boolean') {
    return null;
  }

  // Handle null/undefined
  if (value === null || value === undefined) {
    return null;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value
      .map((v) => normalizeIncomingValue(v))
      .filter((v): v is NormalizedValue => v !== null);
  }

  // Pass through primitives and nodes
  return value as NormalizedValue;
}
