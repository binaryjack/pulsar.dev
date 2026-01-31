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

  // Wire the show/hide logic
  $REGISTRY.wire(container, '__showUpdate', () => {
    const condition = typeof props.when === 'function' ? props.when() : props.when;

    if (condition) {
      // Show "when" content
      if (!whenElement) {
        // Create when content once
        if (typeof props.children === 'function') {
          whenElement = props.children();
        } else {
          whenElement = props.children as HTMLElement;
        }
      }

      // Swap if needed
      if (currentElement !== whenElement && whenElement) {
        // Remove fallback
        if (fallbackElement && container.contains(fallbackElement)) {
          container.removeChild(fallbackElement);
        }

        // Add when element
        if (whenElement && !container.contains(whenElement)) {
          container.appendChild(whenElement);
        }

        currentElement = whenElement;
      }
    } else {
      // Show fallback content
      if (props.fallback && !fallbackElement) {
        // Create fallback once
        fallbackElement =
          typeof props.fallback === 'function' ? props.fallback() : (props.fallback as HTMLElement);
      }

      // Swap if needed
      if (currentElement !== fallbackElement && fallbackElement) {
        // Remove when element
        if (whenElement && container.contains(whenElement)) {
          container.removeChild(whenElement);
        }

        // Add fallback if exists
        if (fallbackElement && !container.contains(fallbackElement)) {
          container.appendChild(fallbackElement);
        }

        currentElement = fallbackElement;
      }
    }
  });

  return container;
}
