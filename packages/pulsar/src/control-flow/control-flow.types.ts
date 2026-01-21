/**
 * Control flow component types for pulsar
 */

/**
 * Show component props
 * Conditionally renders children based on when condition
 */
export interface IShowProps {
  /**
   * Condition to determine visibility
   * Can be a boolean or a function returning boolean
   */
  when: boolean | (() => boolean)
  
  /**
   * Fallback content when condition is false
   */
  fallback?: HTMLElement | (() => HTMLElement)
  
  /**
   * Content to show when condition is true
   */
  children: HTMLElement | (() => HTMLElement)
}

/**
 * For component props
 * Renders a list of items with efficient reconciliation
 */
export interface IForProps<T> {
  /**
   * Array of items or function returning array
   */
  each: T[] | (() => T[])
  
  /**
   * Function to extract unique key from item
   * Used for efficient reconciliation
   */
  key?: (item: T, index: number) => string | number
  
  /**
   * Render function for each item
   */
  children: (item: T, index: () => number) => HTMLElement
  
  /**
   * Fallback content when array is empty
   */
  fallback?: HTMLElement | (() => HTMLElement)
}

/**
 * Internal state for For component
 */
export interface IForState<_T = unknown> {
  /**
   * Map of key to DOM node
   */
  items: Map<string | number, HTMLElement>
  
  /**
   * Container element
   */
  container: HTMLElement
  
  /**
   * Cleanup functions for each item
   */
  cleanups: Map<string | number, () => void>
}
