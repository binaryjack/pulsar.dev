/**
 * Pulsar JSX runtime
 * Provides JSX transformation functions for Pulsar framework
 *
 * Re-exports from modular structure for backward compatibility
 */

// Re-export everything from the new modular structure
export * from './jsx-runtime/index';

// JSX namespace for TypeScript
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
