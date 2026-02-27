import type { ISignal } from '../reactivity/signal/signal.types';
import { $REGISTRY } from '../registry/core';
import { SVG_NAMESPACE, isSvgElement, isSvgTag } from '../utils/svg-tags';
import { insert } from './insert';
import type { IElementAttributes, ReactiveChildren } from './jsx-runtime.types';

// Re-export for public API
export type { IElementAttributes, ReactiveChildren } from './jsx-runtime.types';

/**
 * SSR-aware element creation helper
 * Creates or picks an existing DOM element for hydration
 *
 * @param tag - HTML tag name
 * @param attrs - Element attributes (including data-hid for SSR)
 * @param children - Child elements or text content (array)
 * @param isSSR - Whether we're in SSR hydration mode (picks nodes instead of creating). Auto-detected if data-hid is present.
 * @returns DOM Element
 */
export function t_element(
  tag: string,
  attrs: IElementAttributes = {},
  children: ReactiveChildren[] = [],
  isSSR = false
): Element {
  let el: Element;

  // Auto-detect SSR hydration mode if data-hid is present
  const shouldHydrate = isSSR || !!attrs['data-hid'];

  // SSR Hydration: Pick existing node by data-hid
  if (shouldHydrate && attrs['data-hid']) {
    const hidValue = attrs['data-hid'];
    const existing = document.querySelector(`[data-hid="${hidValue}"]`);
    if (existing?.tagName.toLowerCase() === tag.toLowerCase()) {
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
      el = isSvgTag(tag)
        ? document.createElementNS(SVG_NAMESPACE, tag)
        : document.createElement(tag);
    }
  } else {
    // Normal creation
    el = isSvgTag(tag)
      ? document.createElementNS(SVG_NAMESPACE, tag)
      : document.createElement(tag);
  }

  const isHydrated = (el as any).__hydrated || false;

  // CRITICAL: Apply data-hid FIRST for SSR (before any other attributes)
  // This ensures the attribute exists in server-rendered HTML for hydration
  if (attrs['data-hid'] && !(el as HTMLElement).dataset.hid) {
    (el as HTMLElement).dataset.hid = String(attrs['data-hid']);
  }

  // Apply attributes
  for (const [key, value] of Object.entries(attrs)) {
    // Skip data-hid as it's already applied above
    if (key === 'data-hid') {
      continue;
    }

    if (key === 'ref') {
      // Ref callback - invoke with the element after creation
      // Deferred via microtask so the element is fully configured before callback
      if (typeof value === 'function') {
        const refFn = value as (el: Element) => void;
        Promise.resolve().then(() => refFn(el));
      }
      continue;
    } else if (key.startsWith('on')) {
      // Event listener (e.g., onClick, onDrag)
      const eventName = key.toLowerCase().substring(2);
      if (typeof value === 'function') {
        el.addEventListener(eventName, value as EventListener);
      }
    } else if (value !== null && value !== undefined) {
      // Check if it's a signal or getter
      const isSignal = typeof value === 'object' && '_isSignal' in value && value._isSignal;
      const isGetter = typeof value === 'function' && !isSignal;

      if (isGetter && key === 'style') {
        // String style getter: wire via cssText so el.style.cssText = newValue works
        // el.style is a read-only CSSStyleDeclaration; direct assignment is a no-op
        $REGISTRY.wire(el, 'style.cssText', value as () => unknown);
      } else if (isSignal || isGetter) {
        // Reactive property - always wire, even if hydrated
        $REGISTRY.wire(el, key, value as ISignal<unknown> | (() => unknown));
      } else if (key === 'style' && typeof value === 'object') {
        // Handle style object - check each property for reactivity
        const styleObj = value as Record<string, any>;
        for (const [styleProp, styleValue] of Object.entries(styleObj)) {
          const isStyleSignal =
            styleValue && typeof styleValue === 'object' && typeof styleValue[0] === 'function';
          const isStyleGetter = typeof styleValue === 'function';

          if (isStyleSignal || isStyleGetter) {
            // Reactive style property - wire it
            $REGISTRY.wire(
              el,
              `style.${styleProp}`,
              styleValue as ISignal<unknown> | (() => unknown)
            );
          } else {
            // Static style property - apply directly
            (el as HTMLElement).style[styleProp as any] = styleValue;
          }
        }
      } else if (key === 'className' || key === 'class') {
        // Static property - apply regardless of hydration to allow updates
        if (typeof value === 'string') {
          el.setAttribute('class', value);
        }
      } else if (key.startsWith('data-') || key.startsWith('aria-')) {
        if (typeof value === 'string' || typeof value === 'number') {
          el.setAttribute(key, String(value));
        }
      } else if (key === 'style' && typeof value === 'string') {
        el.setAttribute('style', value);
      } else if (isSvgElement(el)) {
        // SVG elements: arbitrary property assignment silently fails for
        // geometry attributes (cx, cy, r, d, points, etc.) because those
        // properties are read-only SVGAnimated* objects on the DOM interface.
        // Fall back to setAttribute for safe, universal attribute setting.
        el.setAttribute(key, String(value));
      } else {
        (el as any)[key] = value;
      }
    }
  }

  // Append children
  if (children && children.length > 0) {
    for (const child of children) {
      if (child === null || child === undefined) {
        // Skip null/undefined
        continue;
      } else if (child instanceof Node) {
        // DOM node - append directly
        el.appendChild(child);
      } else if (typeof child === 'function') {
        // Reactive child - use insert() for automatic effect wrapping
        insert(el as HTMLElement, child);
      } else if (typeof child === 'string' || typeof child === 'number') {
        // Text content - create text node
        el.appendChild(document.createTextNode(String(child)));
      } else if (Array.isArray(child)) {
        // Nested array - flatten and append
        for (const nestedChild of child) {
          if (nestedChild === null || nestedChild === undefined) {
            continue;
          } else if (nestedChild instanceof Node) {
            el.appendChild(nestedChild);
          } else if (typeof nestedChild === 'function') {
            // Reactive nested child
            insert(el as HTMLElement, nestedChild);
          } else if (typeof nestedChild === 'string' || typeof nestedChild === 'number') {
            el.appendChild(document.createTextNode(String(nestedChild)));
          }
        }
      }
    }
  }

  return el;
}
