import { t_element } from '../jsx-runtime/t-element';
import { $REGISTRY } from '../registry/core';
import { IForProps, IForState } from './control-flow.types';

/**
 * For component using Registry Pattern with proper reconciliation
 * Efficiently updates DOM when array changes with move detection
 *
 * KEY FEATURES:
 * - Stable DOM nodes (children persist, only reorder)
 * - Move detection (no recreation when items reorder)
 * - Position tracking for correct insertion
 *
 * @example
 * ```tsx
 * <For each={todos()} key={(todo) => todo.id}>
 *   {(todo, index) => <TodoItem todo={todo} index={index()} />}
 * </For>
 * ```
 */
export function ForRegistry<T>(props: IForProps<T>): HTMLElement {
  // Use display:contents container to avoid extra wrapper
  const container = t_element('div', {
    style: 'display: contents',
  }) as HTMLElement;

  const state: IForState<T> = {
    items: new Map(),
    container,
    cleanups: new Map(),
    fallbackElement: null, // Track fallback element for cleanup
  };

  // Use registry wire to track array changes
  $REGISTRY.wire(container, '__forUpdate', () => {
    // Evaluate array
    const array = typeof props.each === 'function' ? props.each() : props.each;

    // Handle empty array
    if (!array || array.length === 0) {
      // Clear all items
      state.items.forEach((element, key) => {
        if (container.contains(element)) {
          container.removeChild(element);
        }
        const cleanup = state.cleanups.get(key);
        if (cleanup) cleanup();
      });
      state.items.clear();
      state.cleanups.clear();

      // Show fallback if provided (and not already shown)
      if (props.fallback && !state.fallbackElement) {
        const fallback = typeof props.fallback === 'function' ? props.fallback() : props.fallback;
        if (fallback instanceof HTMLElement) {
          container.appendChild(fallback);
          state.fallbackElement = fallback;
        }
      }
      return;
    }

    // Remove fallback if present (array has items now)
    if (state.fallbackElement) {
      if (container.contains(state.fallbackElement)) {
        container.removeChild(state.fallbackElement);
      }
      state.fallbackElement = null;
    }

    // If no key function, use index as key
    const keyFn = props.key || ((_, idx) => idx);

    // Build new keys map and track order
    const newKeys = new Set<string | number>();
    const newOrder: Array<{ key: string | number; item: T; index: number }> = [];

    array.forEach((item, index) => {
      const key = keyFn(item, index);
      newKeys.add(key);
      newOrder.push({ key, item, index });
    });

    // PHASE 1: Remove items no longer in array
    state.items.forEach((element, key) => {
      if (!newKeys.has(key)) {
        if (container.contains(element)) {
          container.removeChild(element);
        }
        const cleanup = state.cleanups.get(key);
        if (cleanup) cleanup();
        state.items.delete(key);
        state.cleanups.delete(key);
      }
    });

    // PHASE 2: Add new items and reorder existing items
    newOrder.forEach(({ key, item, index }, orderIndex) => {
      let element = state.items.get(key);

      // Create new element if doesn't exist
      if (!element) {
        const indexSignal = () => {
          const currentArray = typeof props.each === 'function' ? props.each() : props.each;
          return currentArray.indexOf(item);
        };

        element = props.children(item, indexSignal);

        if (!(element instanceof HTMLElement)) {
          console.warn('[ForRegistry] Child must return HTMLElement');
          return;
        }

        state.items.set(key, element);
      }

      // CRITICAL: Reorder element to correct position
      const currentChildren = Array.from(container.children);
      const currentIndex = currentChildren.indexOf(element);

      if (currentIndex === -1) {
        // Element not in DOM - insert at correct position
        if (orderIndex === 0) {
          // Insert at beginning
          if (container.firstChild) {
            container.insertBefore(element, container.firstChild);
          } else {
            container.appendChild(element);
          }
        } else {
          // Insert after previous element
          const prevKey = newOrder[orderIndex - 1].key;
          const prevElement = state.items.get(prevKey);
          if (prevElement && container.contains(prevElement)) {
            insertAfter(container, element, prevElement);
          } else {
            container.appendChild(element);
          }
        }
      } else if (currentIndex !== orderIndex) {
        // Element exists but in wrong position - move it
        if (orderIndex === 0) {
          // Move to beginning
          container.insertBefore(element, container.firstChild);
        } else {
          // Move after previous element
          const prevKey = newOrder[orderIndex - 1].key;
          const prevElement = state.items.get(prevKey);
          if (prevElement && container.contains(prevElement)) {
            insertAfter(container, element, prevElement);
          }
        }
      }
      // else: element is already in correct position, do nothing
    });
  });

  return container;
}

/**
 * Helper: Insert element after reference node
 */
function insertAfter(parent: HTMLElement, newNode: HTMLElement, referenceNode: HTMLElement): void {
  if (referenceNode.nextSibling) {
    parent.insertBefore(newNode, referenceNode.nextSibling);
  } else {
    parent.appendChild(newNode);
  }
}
