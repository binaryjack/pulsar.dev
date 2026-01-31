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
 * @param isSSR - Whether we're in SSR hydration mode (picks nodes instead of creating). Auto-detected if data-hid is present.
 * @returns DOM Element
 */
export function t_element(tag: string, attrs: IElementAttributes = {}, isSSR = false): Element {
  let el: Element;

  // Auto-detect SSR hydration mode if data-hid is present
  const shouldHydrate = isSSR || !!attrs['data-hid'];

  // SSR Hydration: Pick existing node by data-hid
  if (shouldHydrate && attrs['data-hid']) {
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

  // CRITICAL: Apply data-hid FIRST for SSR (before any other attributes)
  // This ensures the attribute exists in server-rendered HTML for hydration
  if (attrs['data-hid'] && !el.hasAttribute('data-hid')) {
    el.setAttribute('data-hid', String(attrs['data-hid']));
  }

  // Apply attributes
  for (const [key, value] of Object.entries(attrs)) {
    // Skip data-hid as it's already applied above
    if (key === 'data-hid') {
      continue;
    }

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
        // Reactive property - always wire, even if hydrated
        $REGISTRY.wire(el, key, value as ISignal<unknown> | (() => unknown));
      } else if (key === 'style' && typeof value === 'object') {
        // Handle style object
        const styleObj = value as Record<string, string>;
        for (const [styleProp, styleValue] of Object.entries(styleObj)) {
          (el as HTMLElement).style[styleProp as any] = styleValue;
        }
      } else {
        // Static property - apply regardless of hydration to allow updates
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

  return el;
}
