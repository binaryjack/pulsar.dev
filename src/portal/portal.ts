import { invariant, warn } from '../dev';
import {
  getLogicalParentId,
  getPhysicalParentId,
  registerPortalContent,
} from '../registry/portal-registry';
import { getPortalManager } from './create-portal-manager';
import { IPortalProps, IPortalState } from './portal.types';

/**
 * Normalize children to a single HTMLElement
 * Handles arrays, primitives, and null values from JSX transformer
 *
 * @param child - Raw child value (single element, array, primitive, function result)
 * @returns Single HTMLElement or null
 */
function normalizeChildren(child: any): HTMLElement | null {
  // Handle null/undefined/boolean (JSX conditionals)
  if (child === null || child === undefined || child === false || child === true) {
    return null;
  }

  // Handle arrays (from JSX transformer)
  if (Array.isArray(child)) {
    // Empty array
    if (child.length === 0) return null;

    // Single child - unwrap and normalize recursively
    if (child.length === 1) return normalizeChildren(child[0]);

    // Multiple children - wrap in display:contents container
    const wrapper = document.createElement('div');
    wrapper.style.display = 'contents';
    wrapper.dataset.portalWrapper = 'true';

    child.forEach((c) => {
      const normalized = normalizeChildren(c);
      if (normalized) {
        wrapper.appendChild(normalized);
      }
    });

    // Return null if wrapper is empty after normalization
    if (wrapper.childNodes.length === 0) return null;

    return wrapper;
  }

  // Handle text/number (JSX text nodes)
  if (typeof child === 'string' || typeof child === 'number') {
    const span = document.createElement('span');
    span.textContent = String(child);
    return span;
  }

  // Handle DOM nodes
  if (child instanceof Node) {
    return child as HTMLElement;
  }

  // Unknown type - log warning and return null
  warn({
    message: `Portal received unsupported child type: ${typeof child}`,
    component: 'Portal',
    hint: 'Children should be HTMLElement, array, or primitive types',
  });

  return null;
}

/**
 * Portal component for rendering content outside parent hierarchy
 * Useful for modals, tooltips, dropdowns, etc.
 *
 * @example
 * ```tsx
 * <Portal mount="#modal-root">
 *   <Modal>{content}</Modal>
 * </Portal>
 * ```
 *
 * @example
 * ```typescript
 * Portal({
 *   mount: document.body,
 *   children: () => {
 *     const modal = document.createElement('div')
 *     modal.className = 'modal'
 *     return modal
 *   }
 * })
 * ```
 */
export function Portal(props: IPortalProps): HTMLElement {
  const manager = getPortalManager();

  // Resolve target container
  let container: HTMLElement;

  // Support id + target pattern: <Portal id="form-a" target="commands" />
  if (props.id && props.target) {
    const selector = `#${props.id}-${props.target}`;
    const found = document.querySelector(selector);

    if (found instanceof HTMLElement) {
      container = found;
    } else {
      // Target slot not in DOM yet — this is expected when Portal is inside Show
      // and the target PortalSlot is part of a sibling component rendered in the
      // same synchronous batch.  Defer mounting to the next microtask, by which
      // time Show will have appended the sibling Modal to the DOM.
      const deferWrapper = document.createElement('div');
      deferWrapper.style.display = 'none';
      const deferPlaceholder = document.createComment('portal:pending');
      deferWrapper.appendChild(deferPlaceholder);

      const rawChildren = typeof props.children === 'function' ? props.children() : props.children;
      const content = normalizeChildren(rawChildren);

      if (content) {
        queueMicrotask(() => {
          const deferred = document.querySelector(selector);

          if (deferred instanceof HTMLElement) {
            const logicalParentId = getLogicalParentId(deferPlaceholder as any);
            const physicalParentId = getPhysicalParentId(deferred);

            const { cleanup: registryCleanup } = registerPortalContent({
              parentId: logicalParentId,
              physicalParentId,
              content: content,
              target: deferred,
            });

            const deferManager = getPortalManager();
            const deferState: IPortalState = {
              container: deferred,
              placeholder: deferPlaceholder,
              content,
              cleanup: () => {
                if (deferred.contains(content)) {
                  content.remove();
                }
                registryCleanup();
                deferManager.unregister(deferState);
              },
            };

            deferManager.register(deferState);
            deferred.appendChild(content);

            Object.defineProperty(deferWrapper, '__portalCleanup', {
              value: deferState.cleanup,
              enumerable: false,
            });
          } else {
            warn({
              message: `Portal deferred mount: target "${selector}" still not found after microtask`,
              component: 'Portal',
              hint: `Make sure <PortalSlot id="${props.id}" name="${props.target}" /> is rendered before or at the same time as this Portal`,
            });
          }
        });
      }

      return deferWrapper;
    }
  } else if (!props.mount) {
    container = document.body;
  } else if (typeof props.mount === 'string') {
    const found = document.querySelector(props.mount);

    invariant(
      found instanceof HTMLElement,
      `Portal mount target "${props.mount}" not found`,
      'Portal',
      'Make sure the target element exists in the DOM'
    );

    container = found;
  } else {
    container = props.mount;
  }

  // Create placeholder comment to mark position
  const placeholder = document.createComment('portal');

  // Resolve and normalize children
  // JSX transformer passes children as array, normalize handles all cases
  const rawChildren = typeof props.children === 'function' ? props.children() : props.children;
  const content = normalizeChildren(rawChildren);

  // Handle empty portal (no content after normalization)
  if (!content) {
    warn({
      message: 'Portal has no content to render',
      component: 'Portal',
      hint: 'Check that children prop is not empty or null',
    });

    // Return empty wrapper (no cleanup needed)
    const emptyWrapper = document.createElement('div');
    emptyWrapper.style.display = 'none';
    emptyWrapper.appendChild(placeholder);
    return emptyWrapper;
  }

  // Get logical parent ID (where Portal is in the component tree)
  const logicalParentId = getLogicalParentId(placeholder as any);

  // Get physical parent ID (where content will be mounted)
  const physicalParentId = getPhysicalParentId(container);

  // Register portal content with registry
  const { elementId, cleanup: registryCleanup } = registerPortalContent({
    parentId: logicalParentId,
    physicalParentId,
    content,
    target: container,
  });

  // Store element ID on content for future lookups
  if (elementId) {
    Object.defineProperty(content, '__elementId', {
      value: elementId,
      enumerable: false,
    });
  }

  // Create portal state
  const state: IPortalState = {
    container,
    placeholder,
    content,
    cleanup: () => {
      if (content && container.contains(content)) {
        content.remove();
      }
      registryCleanup();
      manager.unregister(state);
    },
  };

  // Register portal
  manager.register(state);

  // Mount content to target
  container.appendChild(content);

  // Warn in dev if container is body
  if (container === document.body) {
    warn({
      message: 'Portal mounting to document.body',
      component: 'Portal',
      hint: 'Consider using a dedicated portal root for better organization',
    });
  }

  // Return placeholder for original position
  // This allows proper cleanup when parent unmounts
  const wrapper = document.createElement('div');
  wrapper.style.display = 'none';
  wrapper.appendChild(placeholder);

  // Store cleanup reference on wrapper for parent removal
  Object.defineProperty(wrapper, '__portalCleanup', {
    value: state.cleanup,
    enumerable: false,
  });

  return wrapper;
}

/**
 * Cleanup all portals
 * Call this when app unmounts
 */
export function cleanupPortals(): void {
  const manager = getPortalManager();
  manager.cleanup();
}
