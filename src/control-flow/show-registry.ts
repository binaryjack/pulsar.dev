import { t_element } from '../jsx-runtime/t-element';
import { $REGISTRY } from '../registry/core';
import { IShowProps } from './control-flow.types';

/**
 * Show component using Registry Pattern
 * Conditionally renders children based on when condition
 *
 * KEY DIFFERENCE: Uses wire() to reactively show/hide content
 * without destroying and recreating DOM nodes
 *
 * CLEANUP: Wire disposer is stored in $REGISTRY._nodes and will be
 * automatically cleaned up by NodeWatcher when container is removed
 *
 * @example
 * ```tsx
 * <Show when={isVisible()} fallback={<Loading />}>
 *   <Content />
 * </Show>
 * ```
 */
export function ShowRegistry(props: IShowProps): HTMLElement {
  // Container with display:contents
  const container = t_element('div', {
    style: 'display: contents',
  }) as HTMLElement;

  let currentElement: HTMLElement | null = null;
  let whenElement: HTMLElement | null = null;
  let fallbackElement: HTMLElement | null = null;

  const normalize = (child: any): HTMLElement | null => {
    if (child === null || child === undefined || child === false || child === true) return null;
    if (Array.isArray(child)) {
        if (child.length === 0) return null;
        if (child.length === 1) return normalize(child[0]);
        const div = document.createElement('div');
        div.style.display = 'contents';
        child.forEach(c => {
           const n = normalize(c);
           if (n) div.appendChild(n);
        });
        return div;
    }
    if (typeof child === 'string' || typeof child === 'number') {
        const span = document.createElement('span');
        span.textContent = String(child);
        return span;
    }
    if (child instanceof Node) return child as HTMLElement;
    return null; // fallback
  };

  // Wire the show/hide logic
  $REGISTRY.wire(container, '__showUpdate', () => {
    const condition = typeof props.when === 'function' ? props.when() : props.when;

    if (condition) {
      // Show "when" content
      if (!whenElement) {
        // Create when content once
        const raw = typeof props.children === 'function' ? props.children() : props.children;
        whenElement = normalize(raw);
      }

      // Swap if needed
      if (currentElement !== whenElement) {
        // Remove fallback if present
        if (fallbackElement && fallbackElement.parentNode === container) {
          container.removeChild(fallbackElement);
        }

        // Add when element if missing
        if (whenElement && whenElement.parentNode !== container) {
          container.appendChild(whenElement);
        } else if (!whenElement && currentElement) {
           // whenElement is null (empty), ensure nothing is shown
        }

        currentElement = whenElement;
      }
    } else {
      // Hide "when" content
      if (whenElement && whenElement.parentNode === container) {
        container.removeChild(whenElement);
      }

      // Show fallback content if provided
      if (props.fallback) {
        if (!fallbackElement) {
          // Create fallback once
          const raw = typeof props.fallback === 'function'
              ? props.fallback()
              : props.fallback;
          fallbackElement = normalize(raw);
        }

        // Add fallback if not already in container
        if (fallbackElement && fallbackElement.parentNode !== container) {
          container.appendChild(fallbackElement);
        }

        currentElement = fallbackElement;
      } else {
        // No fallback, just ensure container is empty
        currentElement = null;
      }
    }
  });

  return container;
}
