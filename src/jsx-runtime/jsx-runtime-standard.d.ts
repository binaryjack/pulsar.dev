/**
 * Standard JSX Runtime (Backward Compatible)
 * Original JSX functions without registry integration
 */
import type { IFragmentProps, JSXElementType, JSXKey, JSXProps, JSXSource } from './jsx-runtime.types';
export declare function jsx<P extends JSXProps = JSXProps>(type: JSXElementType<P>, props: P, key?: JSXKey): HTMLElement;
export declare function jsxs<P extends JSXProps = JSXProps>(type: JSXElementType<P>, props: P, key?: JSXKey): HTMLElement;
export declare function jsxDEV<P extends JSXProps = JSXProps>(type: JSXElementType<P>, props: P, key?: JSXKey, isStaticChildren?: boolean, source?: JSXSource, self?: unknown): HTMLElement;
export declare function jsxsDEV<P extends JSXProps = JSXProps>(type: JSXElementType<P>, props: P, key?: JSXKey, isStaticChildren?: boolean, source?: JSXSource, self?: unknown): HTMLElement;
export declare function Fragment(props: IFragmentProps): DocumentFragment;
