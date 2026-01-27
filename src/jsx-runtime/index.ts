/**
 * Enhanced JSX Runtime with Registry Integration
 * Exports both standard JSX functions and registry-enhanced versions
 */

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
