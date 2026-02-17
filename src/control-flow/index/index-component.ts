/**
 * Index Component
 * Non-keyed list iteration where items are wrapped in signals
 *
 * Unlike <For> which uses keys for reconciliation, <Index> tracks items
 * by their array position and wraps each item in a signal. This makes it
 * more efficient when item identity is based on position rather than content.
 *
 * @example
 * ```tsx
 * // Item changes trigger updates, array order changes recreate all
 * <Index each={todos()}>
 *   {(todo, index) => (
 *     <li>
 *       {index}: <input value={todo().text} />
 *     </li>
 *   )}
 * </Index>
 * ```
 *
 * @example
 * ```typescript
 * // Programmatic usage
 * Index({
 *   each: () => items(),
 *   children: (item, index) => {
 *     const el = document.createElement('div')
 *     createEffect(() => {
 *       el.textContent = `${index}: ${item().name}`
 *     })
 *     return el
 *   }
 * })
 * ```
 */

import { createEffect, createSignal } from '../../reactivity';
import type { IIndexProps, IIndexState } from './index.types';

/**
 * Index component for non-keyed list rendering
 *
 * Each item is wrapped in a signal, so the item can change without
 * recreating the DOM node. The index is stable and not reactive.
 *
 * Use <Index> when:
 * - Items are identified by position, not content
 * - You need reactive item updates without DOM recreation
 * - Working with primitives or objects that change in place
 *
 * Use <For> when:
 * - Items have unique keys/IDs
 * - Array reordering is common
 * - Item identity matters more than position
 */
export function Index<T>(props: IIndexProps<T>): HTMLElement {
  const container = document.createElement('div');
  container.style.display = 'contents'; // Don't add extra wrapper

  // DEBUG: Track Index mounting
  // console.log('[Index] Mounted with props:', props);

  const state: IIndexState<T> = {
    items: new Map(),
    signals: new Map(),
    container,
    cleanups: new Map(),
  };

  createEffect(() => {
    // Evaluate array
    const array = typeof props.each === 'function' ? props.each() : props.each;

    // Handle empty array
    if (!array || array.length === 0) {
      // Clear all items
      clearAllItems(state);

      // Show fallback if provided
      if (props.fallback) {
        const fallback = typeof props.fallback === 'function' ? props.fallback() : props.fallback;
        container.appendChild(fallback);
      }
      return;
    }

    // Remove fallback if present
    if (state.items.size === 0 && container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const currentLength = state.items.size;
    const newLength = array.length;

    // Update existing items
    for (let i = 0; i < Math.min(currentLength, newLength); i++) {
      const signalData = state.signals.get(i) as any;
      if (signalData && signalData.setter) {
        signalData.setter(array[i]);
      }
    }

    // Add new items if array grew
    if (newLength > currentLength) {
      for (let i = currentLength; i < newLength; i++) {
        createItem(state, props, array[i], i);
      }
    }

    // Remove items if array shrank
    if (newLength < currentLength) {
      for (let i = newLength; i < currentLength; i++) {
        removeItem(state, i);
      }
    }
  });

  return container;
}

/**
 * Create a new item at the given index
 */
function createItem<T>(
  state: IIndexState<T>,
  props: IIndexProps<T>,
  value: T,
  index: number
): void {
  // Create signal for this item
  const [itemSignal, setItemSignal] = createSignal<T>(value);

  // Store getter and setter separately for updates
  state.signals.set(index, { getter: itemSignal, setter: setItemSignal } as any);

  // Create element using children function
  const element = props.children(itemSignal, index);

  // Append to container
  state.container.appendChild(element);
  state.items.set(index, element);
}

/**
 * Remove item at given index
 */
function removeItem<T>(state: IIndexState<T>, index: number): void {
  const element = state.items.get(index);
  if (element && state.container.contains(element)) {
    state.container.removeChild(element);
  }

  const cleanup = state.cleanups.get(index);
  if (cleanup) {
    cleanup();
    state.cleanups.delete(index);
  }

  state.items.delete(index);
  state.signals.delete(index);
}

/**
 * Clear all items from the Index
 */
function clearAllItems<T>(state: IIndexState<T>): void {
  state.items.forEach((element, index) => {
    if (state.container.contains(element)) {
      state.container.removeChild(element);
    }
    const cleanup = state.cleanups.get(index);
    if (cleanup) cleanup();
  });

  state.items.clear();
  state.signals.clear();
  state.cleanups.clear();
}
