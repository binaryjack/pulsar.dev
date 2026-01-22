/**
 * JSX Runtime Types
 * Type definitions for JSX transformation
 */

/**
 * JSX component function type
 */
export type JSXComponentFunction<P = Record<string, unknown>> = (props: P) => HTMLElement;

/**
 * JSX element type - can be string tag or component function
 */
export type JSXElementType<P = Record<string, unknown>> = string | JSXComponentFunction<P>;

/**
 * JSX key type for list reconciliation
 */
export type JSXKey = string | number | null | undefined;

/**
 * JSX props type with children
 */
export interface JSXProps {
  children?: JSXChild | JSXChild[];
  key?: JSXKey;
  [key: string]: unknown;
}

/**
 * JSX child types
 */
export type JSXChild = HTMLElement | DocumentFragment | string | number | boolean | null | undefined;

/**
 * JSX dev mode source location
 */
export interface JSXSource {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}

/**
 * Fragment props
 */
export interface IFragmentProps {
  children?: JSXChild | JSXChild[];
}

/**
 * Internal props for createElement
 */
export interface ICreateElementProps extends Record<string, unknown> {
  children?: JSXChild | JSXChild[];
  className?: string;
  innerHTML?: string;
  [key: `on${string}`]: ((event: Event) => void) | unknown;
  [key: `aria-${string}`]: string | unknown;
  [key: `data-${string}`]: string | unknown;
  role?: string;
}
