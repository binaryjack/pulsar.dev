/**
 * JSX Dev Runtime
 * Re-exports jsxDEV and related development-mode JSX functions
 * This file is auto-imported by TypeScript when jsx: 'react-jsx' or similar is configured
 */

// Re-export dev-mode JSX functions
export { Fragment, jsxDEV, jsxs } from './jsx-runtime';

// Also export standard JSX namespace
export namespace JSX {
  export type Element = HTMLElement;
  export type Child = HTMLElement | string | number | boolean | null | undefined;
  export type Children = Child | Child[];

  export interface IntrinsicElements {
    [elemName: string]: Record<string, unknown>;
  }

  export interface ElementChildrenAttribute {
    children: Record<string, never>;
  }
}
