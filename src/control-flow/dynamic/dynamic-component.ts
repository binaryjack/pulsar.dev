/**
 * Dynamic Component
 * Runtime component selection and rendering
 *
 * Allows selecting which component to render at runtime based on data.
 * Supports both function components and string-based resolution from registry.
 *
 * @example
 * ```tsx
 * // Function-based
 * <Dynamic component={selectedComponent()} name="John" />
 *
 * // String-based (requires registry)
 * <Dynamic component="Button" text="Click me" />
 *
 * // With signal
 * <Dynamic component={() => componentMap[type()]} {...props} />
 * ```
 *
 * @example
 * ```typescript
 * // Programmatic usage
 * const element = Dynamic({
 *   component: () => type() === 'button' ? Button : Link,
 *   text: 'Click me',
 *   onClick: handleClick
 * })
 * ```
 */

import { createEffect } from '../../reactivity';
import { componentRegistry } from './component-registry';
import type { ComponentType, IDynamicProps, IDynamicState } from './dynamic.types';

/**
 * Dynamic component for runtime component selection
 *
 * Use Dynamic when:
 * - Component type changes based on data
 * - Rendering different components conditionally
 * - Building dynamic UIs from configuration
 * - Working with component maps/dictionaries
 *
 * Features:
 * - Function or string component resolution
 * - Automatic prop forwarding
 * - Reactive component switching
 * - Graceful error handling
 */
export function Dynamic<P = any>(props: IDynamicProps<P>): HTMLElement {
  const container = document.createElement('div');
  container.style.display = 'contents'; // Don't add extra wrapper

  const state: IDynamicState = {
    currentComponent: null,
    currentElement: null,
    container,
  };

  // Track the component and re-render when it changes
  createEffect(() => {
    // Resolve component (could be function, signal, or string)
    const componentValue =
      typeof props.component === 'function' && props.component.length === 0
        ? (props.component as () => ComponentType)()
        : props.component;

    // Resolve to actual component function
    const resolvedComponent = resolveComponent(componentValue);

    // If component changed, re-render
    if (resolvedComponent !== state.currentComponent) {
      state.currentComponent = resolvedComponent;

      // Remove old element
      if (state.currentElement) {
        container.removeChild(state.currentElement);
        state.currentElement = null;
      }

      // Render new component if resolved
      if (resolvedComponent) {
        try {
          // Extract props (exclude 'component' prop)
          const { component, ...forwardedProps } = props;

          // Render component with props
          const element = resolvedComponent(forwardedProps);
          container.appendChild(element);
          state.currentElement = element;
        } catch (error) {
          console.error('Error rendering dynamic component:', error);

          // Show error fallback
          const errorElement = createErrorElement(
            componentValue,
            error instanceof Error ? error.message : String(error)
          );
          container.appendChild(errorElement);
          state.currentElement = errorElement;
        }
      } else {
        // Component not found - show warning
        const warningElement = createWarningElement(componentValue);
        container.appendChild(warningElement);
        state.currentElement = warningElement;
      }
    }
  });

  return container;
}

/**
 * Resolve component from various types
 */
function resolveComponent(component: ComponentType | any): ((props: any) => HTMLElement) | null {
  // Null/undefined
  if (component == null) {
    return null;
  }

  // Already a function component
  if (typeof component === 'function') {
    return component as (props: any) => HTMLElement;
  }

  // String - lookup in registry
  if (typeof component === 'string') {
    return componentRegistry.resolve(component) || null;
  }

  // Unknown type
  return null;
}

/**
 * Create error fallback element
 */
function createErrorElement(component: any, message: string): HTMLElement {
  const div = document.createElement('div');
  div.style.cssText =
    'padding: 10px; background: #fee; border: 1px solid #fcc; border-radius: 4px;';
  div.innerHTML = `
    <strong style="color: #c00;">⚠️ Dynamic Component Error</strong><br/>
    <code style="font-size: 0.9em;">${escapeHtml(String(component))}</code><br/>
    <small style="color: #666;">${escapeHtml(message)}</small>
  `;
  return div;
}

/**
 * Create warning element for unresolved component
 */
function createWarningElement(component: any): HTMLElement {
  const div = document.createElement('div');
  div.style.cssText =
    'padding: 10px; background: #ffc; border: 1px solid #ff9; border-radius: 4px;';
  div.innerHTML = `
    <strong style="color: #960;">⚠️ Component Not Found</strong><br/>
    <code style="font-size: 0.9em;">${escapeHtml(String(component))}</code><br/>
    <small style="color: #666;">Make sure the component is registered or provide a function component.</small>
  `;
  return div;
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
