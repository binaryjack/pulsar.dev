import type { ISignal } from '../reactivity/signal/signal.types';
import { $REGISTRY } from '../registry/core';

/**
 * Element attributes for t_element
 */
export interface IElementAttributes {
  [key: string]: unknown;
  'data-hid'?: string;
  'data-comp-id'?: string;
}

/**
 * SSR-aware element creation helper
 * Creates or picks an existing DOM element for hydration
 *
 * @param tag - HTML tag name
 * @param attrs - Element attributes (including data-hid for SSR)
 * @param isSSR - Whether we're in SSR hydration mode (picks nodes instead of creating)
 * @returns DOM Element
 */
export function t_element(tag: string, attrs: IElementAttributes = {}, isSSR = false): Element {
  let el: Element;

  // SSR Hydration: Pick existing node by data-hid
  if (isSSR && attrs['data-hid']) {
    const hidValue = attrs['data-hid'];
    const existing = document.querySelector(`[data-hid="${hidValue}"]`);
    if (existing && existing.tagName.toLowerCase() === tag.toLowerCase()) {
      el = existing;
      // Mark as hydrated to avoid re-applying static props
      (el as any).__hydrated = true;
    } else {
      if (existing) {
        console.warn(
          `[t_element] SSR hydration: Found element with data-hid="${hidValue}" but tag mismatch. Expected ${tag}, got ${existing.tagName}`
        );
      } else {
        console.warn(
          `[t_element] SSR hydration: Could not find element with data-hid="${hidValue}"`
        );
      }
      el = document.createElement(tag);
    }
  } else {
    // Normal creation
    el = document.createElement(tag);
  }

  const isHydrated = (el as any).__hydrated || false;

  // Apply attributes
  for (const [key, value] of Object.entries(attrs)) {
    if (key.startsWith('on')) {
      // Event listener (e.g., onClick, onDrag)
      const eventName = key.toLowerCase().substring(2);
      if (typeof value === 'function') {
        el.addEventListener(eventName, value as EventListener);
      }
    } else if (value !== null && value !== undefined) {
      // Check if it's a signal or getter
      const isSignal = typeof value === 'object' && '_isSignal' in value && value._isSignal;
      const isGetter = typeof value === 'function' && !isSignal;

      if (isSignal || isGetter) {
        // Reactive property - wire it
        $REGISTRY.wire(el, key, value as ISignal<unknown> | (() => unknown));
      } else {
        // Static property - only set if not hydrated
        if (!isHydrated) {
          if (key === 'className') {
            el.setAttribute('class', String(value));
          } else if (key.startsWith('data-') || key.startsWith('aria-')) {
            el.setAttribute(key, String(value));
          } else if (key === 'style' && typeof value === 'string') {
            el.setAttribute('style', value);
          } else {
            (el as any)[key] = value;
          }
        }
      }
    }
  }

  return el;
}
