/**
 * Element type enumeration
 * Defines the different types of elements tracked in the registry
 */
export enum ElementType {
  /**
   * Component element - created by JSX component
   */
  COMPONENT = 'component',

  /**
   * Static element - not reactive, no signal dependencies
   */
  STATIC = 'static',

  /**
   * Dynamic element - has signal dependencies or is reactive
   */
  DYNAMIC = 'dynamic',

  /**
   * Array item - element created by .map() or array iteration
   */
  ARRAY_ITEM = 'array-item',

  /**
   * Portal content - element rendered via Portal component
   */
  PORTAL_CONTENT = 'portal-content',
}
