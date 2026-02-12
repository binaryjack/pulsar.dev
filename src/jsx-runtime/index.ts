/**
 * Enhanced JSX Runtime with Registry Integration
 * Exports both standard JSX functions and registry-enhanced versions
 */

// NEW: Registry Pattern SSR-aware element creation
export { t_element } from './t-element';
export type { IElementAttributes } from './t-element';

// Reactive insertion (SolidJS-inspired)
export { insert } from './insert';

// Standard JSX runtime (backward compatibility)
export { Fragment, jsx, jsxDEV, jsxs, jsxsDEV } from './jsx-runtime-standard';

// Registry-enhanced runtime (for transformer use)
export {
  appendChildren,
  createElementWithRegistry,
  createTextNode,
  type IRegistryContext,
} from './create-element-with-registry';

// Types
export type {
  ICreateElementProps,
  IFragmentProps,
  JSXChild,
  JSXElementType,
  JSXKey,
  JSXProps,
  JSXSource,
} from './jsx-runtime.types';
