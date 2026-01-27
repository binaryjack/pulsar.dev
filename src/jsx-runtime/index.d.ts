/**
 * Enhanced JSX Runtime with Registry Integration
 * Exports both standard JSX functions and registry-enhanced versions
 */
export { Fragment, jsx, jsxDEV, jsxs, jsxsDEV } from './jsx-runtime-standard';
export { appendChildren, createElementWithRegistry, createTextNode, type IRegistryContext, } from './create-element-with-registry';
export type { ICreateElementProps, IFragmentProps, JSXChild, JSXElementType, JSXKey, JSXProps, JSXSource, } from './jsx-runtime.types';
