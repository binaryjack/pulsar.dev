/**
 * Pulsar JSX runtime
 * Provides JSX transformation functions for Pulsar framework
 *
 * Re-exports from modular structure for backward compatibility
 */
export * from './jsx-runtime/index';
export declare namespace JSX {
    type Element = HTMLElement;
    type Child = HTMLElement | string | number | boolean | null | undefined;
    type Children = Child | Child[];
    interface IntrinsicElements {
        [elemName: string]: Record<string, unknown>;
    }
    interface ElementChildrenAttribute {
        children: Record<string, never>;
    }
}
