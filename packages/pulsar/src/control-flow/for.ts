import { createEffect } from '../reactivity'
import { IForProps, IForState } from './control-flow.types'

/**
 * For component for list rendering
 * Efficiently updates DOM when array changes
 * 
 * @example
 * ```tsx
 * <For each={todos()} key={(todo) => todo.id}>
 *   {(todo, index) => <TodoItem todo={todo} index={index()} />}
 * </For>
 * ```
 * 
 * @example
 * ```typescript
 * For({
 *   each: () => items(),
 *   key: (item) => item.id,
 *   children: (item, index) => {
 *     const el = document.createElement('div')
 *     el.textContent = `${index()}: ${item.name}`
 *     return el
 *   }
 * })
 * ```
 */
export function For<T>(props: IForProps<T>): HTMLElement {
  const container = document.createElement('div')
  container.style.display = 'contents' // Don't add extra wrapper
  
  const state: IForState<T> = {
    items: new Map(),
    container,
    cleanups: new Map()
  }
  
  createEffect(() => {
    // Evaluate array
    const array = typeof props.each === 'function'
      ? props.each()
      : props.each
    
    // Handle empty array
    if (!array || array.length === 0) {
      // Clear all items
      state.items.forEach((element, key) => {
        if (container.contains(element)) {
          container.removeChild(element)
        }
        const cleanup = state.cleanups.get(key)
        if (cleanup) cleanup()
      })
      state.items.clear()
      state.cleanups.clear()
      
      // Show fallback if provided
      if (props.fallback) {
        const fallback = typeof props.fallback === 'function'
          ? props.fallback()
          : props.fallback
        container.appendChild(fallback)
      }
      return
    }
    
    // If no key function, simple approach: clear and recreate all
    if (!props.key) {
      // Clear all existing items
      state.items.forEach((element, key) => {
        if (container.contains(element)) {
          container.removeChild(element)
        }
        const cleanup = state.cleanups.get(key)
        if (cleanup) cleanup()
      })
      state.items.clear()
      state.cleanups.clear()
      
      // Create all items
      array.forEach((item, index) => {
        const indexSignal = () => index
        const element = props.children(item, indexSignal)
        container.appendChild(element)
        state.items.set(index, element)
      })
      return
    }
    
    // Key-based reconciliation
    const keyFn = props.key
    
    // Track which keys are in new array
    const newKeys = new Set<string | number>()
    const newItems = new Map<string | number, T>()
    
    array.forEach((item, index) => {
      const key = keyFn(item, index)
      newKeys.add(key)
      newItems.set(key, item)
    })
    
    // Remove items that are no longer in array
    state.items.forEach((element, key) => {
      if (!newKeys.has(key)) {
        if (container.contains(element)) {
          container.removeChild(element)
        }
        const cleanup = state.cleanups.get(key)
        if (cleanup) cleanup()
        state.items.delete(key)
        state.cleanups.delete(key)
      }
    })
    
    // Add or update items
    let position = 0
    array.forEach((item, index) => {
      const key = keyFn(item, index)
      
      if (!state.items.has(key)) {
        // Create new item
        const indexSignal = () => index
        const element = props.children(item, indexSignal)
        
        // Insert at correct position
        if (position >= container.children.length) {
          container.appendChild(element)
        } else {
          const referenceNode = container.children[position]
          container.insertBefore(element, referenceNode)
        }
        
        state.items.set(key, element)
        position++
      } else {
        // Item exists, ensure correct position
        const element = state.items.get(key)!
        const currentIndex = Array.from(container.children).indexOf(element)
        
        if (currentIndex !== position) {
          // Move to correct position
          if (position >= container.children.length) {
            container.appendChild(element)
          } else {
            const referenceNode = container.children[position]
            if (referenceNode !== element) {
              container.insertBefore(element, referenceNode)
            }
          }
        }
        position++
      }
    })
  })
  
  return container
}
