import { invariant, warn } from '../dev'
import { getPortalManager } from './create-portal-manager'
import { IPortalProps, IPortalState } from './portal.types'

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
  const manager = getPortalManager()
  
  // Resolve target container
  let container: HTMLElement
  
  if (!props.mount) {
    container = document.body
  } else if (typeof props.mount === 'string') {
    const found = document.querySelector(props.mount)
    
    invariant(
      found instanceof HTMLElement,
      `Portal mount target "${props.mount}" not found`,
      'Portal',
      'Make sure the target element exists in the DOM'
    )
    
    container = found
  } else {
    container = props.mount
  }
  
  // Create placeholder comment to mark position
  const placeholder = document.createComment('portal')
  
  // Resolve children
  const content = typeof props.children === 'function'
    ? props.children()
    : props.children
  
  // Create portal state
  const state: IPortalState = {
    container,
    placeholder,
    content,
    cleanup: () => {
      if (content && container.contains(content)) {
        container.removeChild(content)
      }
      manager.unregister(state)
    }
  }
  
  // Register portal
  manager.register(state)
  
  // Mount content to target
  container.appendChild(content)
  
  // Warn in dev if container is body
  if (container === document.body) {
    warn({
      message: 'Portal mounting to document.body',
      component: 'Portal',
      hint: 'Consider using a dedicated portal root for better organization'
    })
  }
  
  // Return placeholder for original position
  // This allows proper cleanup when parent unmounts
  const wrapper = document.createElement('div')
  wrapper.style.display = 'none'
  wrapper.appendChild(placeholder)
  
  // Store cleanup reference on wrapper for parent removal
  Object.defineProperty(wrapper, '__portalCleanup', {
    value: state.cleanup,
    enumerable: false
  })
  
  return wrapper
}

/**
 * Cleanup all portals
 * Call this when app unmounts
 */
export function cleanupPortals(): void {
  const manager = getPortalManager()
  manager.cleanup()
}
