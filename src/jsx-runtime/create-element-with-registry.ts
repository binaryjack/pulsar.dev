/**
 * Registry-Enhanced createElement
 * Automatically registers elements with the Element Registry during creation
 */

import { getCurrentAppRoot } from '../registry/app-root-context';
import type { EventHandler } from '../registry/event-delegation/registry-event-delegator.types';
import { generateId } from '../registry/id-generator';
import type { IElementEntry } from '../registry/types/element-entry.types';
import { ElementType } from '../registry/types/element-type.enum';
import type { JSXChild, JSXElementType, JSXKey, JSXProps } from './jsx-runtime.types';

/**
 * Registry context metadata (passed by transformer)
 */
export interface IRegistryContext {
  /** Parent element ID (from parent component) */
  parentId?: string;
  /** Index in parent's children array */
  index?: number;
  /** Element type classification */
  elementType?: ElementType;
}

/**
 * Create an element with automatic registry registration
 * This is the enhanced version used by the transformer
 */
export function createElementWithRegistry<P extends JSXProps = JSXProps>(
  type: JSXElementType<P>,
  props: P,
  registryCtx?: IRegistryContext,
  key?: JSXKey
): HTMLElement {
  // Create the element (component or intrinsic)
  let element: HTMLElement;

  // Get app root first (needed for event delegation)
  const appRoot = getCurrentAppRoot();

  if (typeof type === 'function') {
    // Component function
    element = type(props);
  } else {
    // Intrinsic element (div, span, button, etc.)
    // Pass appRoot and registryCtx for event delegation
    element = createIntrinsicElement(type, props, appRoot, registryCtx);
  }

  // Register with registry if ApplicationRoot is available
  if (appRoot && registryCtx) {
    // Generate hierarchical ID
    const elementId = generateId(appRoot.idContext, registryCtx.parentId, registryCtx.index);

    // Create registry entry
    const entry: IElementEntry = {
      element,
      type: registryCtx.elementType || ElementType.COMPONENT,
      parentId: registryCtx.parentId,
    };

    // Register element
    appRoot.registry.register(elementId, element, entry);

    // Store element ID on element for later lookups (uses type augmentation)
    element.__elementId = elementId;

    // Store parent ID for context propagation
    if (registryCtx.parentId) {
      element.__parentId = registryCtx.parentId;
    }
  }

  return element;
}

/**
 * Create an intrinsic HTML element
 */
function createIntrinsicElement(
  type: string,
  props: any,
  appRoot?: ReturnType<typeof getCurrentAppRoot>,
  registryCtx?: IRegistryContext
): HTMLElement {
  const element = document.createElement(type);

  // Store element ID early (before processing props) for event delegation
  if (appRoot && registryCtx) {
    const elementId = generateId(appRoot.idContext, registryCtx.parentId, registryCtx.index);

    // Use type augmentation property
    element.__elementId = elementId;
  }

  if (props) {
    Object.keys(props).forEach((key) => {
      if (key === 'children') {
        // Children handled by parent
        return;
      } else if (key === 'className' || key === 'class') {
        element.className = props[key] as string;
      } else if (key === 'innerHTML') {
        element.innerHTML = props[key] as string;
      } else if (key.startsWith('on')) {
        const eventName = key.toLowerCase().substring(2);
        // Drag events MUST use direct addEventListener — they require synchronous
        // preventDefault() before the browser checks drop eligibility.  The
        // delegation walk introduces too much indirection for that contract.
        // All other events go through the registry delegator for O(1) dispatch.
        const DIRECT_BIND_EVENTS = new Set([
          'dragover',
          'drop',
          'dragenter',
          'dragleave',
          'drag',
          'dragstart',
          'dragend',
        ]);
        const elementId = element.__elementId;

        if (!DIRECT_BIND_EVENTS.has(eventName) && elementId && appRoot) {
          // Use registry event delegator
          appRoot.eventDelegator.registerHandler(elementId, eventName, props[key] as EventHandler);
        } else {
          // Direct listener: drag events (by design) or fallback when no registry
          element.addEventListener(eventName, props[key] as EventListener);
        }
      } else if (key.startsWith('aria-') || key.startsWith('data-') || key === 'role') {
        element.setAttribute(key, String(props[key]));
      } else if (key === 'style' && typeof props[key] === 'object') {
        Object.assign(element.style, props[key]);
      } else if (props[key] !== undefined && props[key] !== null && key !== 'key') {
        (element as any)[key] = props[key];
      }
    });
  }

  return element;
}

/**
 * Append children to an element with registry tracking
 */
export function appendChildren(
  parent: HTMLElement,
  children: JSXChild | JSXChild[],
  parentId?: string
): void {
  const childArray = Array.isArray(children) ? children : [children];

  childArray.forEach((child, index) => {
    if (child instanceof Node) {
      // If child has __elementId, update parent relationship BEFORE appending
      // This ensures proper lifecycle tracking before MutationObserver fires
      if (child instanceof HTMLElement && child.__elementId && parentId) {
        const appRoot = getCurrentAppRoot();
        if (appRoot) {
          const elementId = child.__elementId;
          const entry = appRoot.registry.get(elementId);
          if (entry && !entry.parentId) {
            // Update parentId directly in the registry entry
            entry.parentId = parentId;

            // Update parent-child tracking
            if (!appRoot.registry.parentChildren.has(parentId)) {
              appRoot.registry.parentChildren.set(parentId, new Set<string>());
            }
            appRoot.registry.parentChildren.get(parentId)!.add(elementId);
          }
        }
      }

      // Now safely append to DOM
      parent.appendChild(child);
    } else if (typeof child === 'string' || typeof child === 'number') {
      parent.appendChild(document.createTextNode(String(child)));
    }
  });
}

/**
 * Create a text node with registry tracking
 * Used for dynamic text content
 */
export function createTextNode(content: string, parentId?: string): Text {
  const textNode = document.createTextNode(content);

  // Text nodes don't get registered (only elements)
  // But we can track them for debugging if needed

  return textNode;
}
