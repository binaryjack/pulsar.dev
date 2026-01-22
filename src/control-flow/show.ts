import { createEffect } from '../reactivity'
import { IShowProps } from './control-flow.types'

/**
 * Show component for conditional rendering
 * Only renders children when condition is true
 * 
 * @example
 * ```tsx
 * <Show when={isLoggedIn()} fallback={<Login />}>
 *   <Dashboard />
 * </Show>
 * ```
 * 
 * @example
 * ```typescript
 * Show({
 *   when: () => count() > 5,
 *   fallback: () => document.createTextNode('Count is low'),
 *   children: () => document.createTextNode('Count is high')
 * })
 * ```
 */
export function Show(props: IShowProps): HTMLElement {
  const container = document.createElement('div')
  container.style.display = 'contents' // Don't add extra wrapper
  
  let currentElement: HTMLElement | null = null
  
  createEffect(() => {
    // Evaluate condition
    const condition = typeof props.when === 'function' 
      ? props.when() 
      : props.when
    
    // Remove current element if exists
    if (currentElement) {
      container.removeChild(currentElement)
      currentElement = null
    }
    
    // Render based on condition
    if (condition) {
      currentElement = typeof props.children === 'function'
        ? props.children()
        : props.children
    } else if (props.fallback) {
      currentElement = typeof props.fallback === 'function'
        ? props.fallback()
        : props.fallback
    }
    
    // Append new element if exists
    if (currentElement) {
      container.appendChild(currentElement)
    }
  })
  
  return container
}
