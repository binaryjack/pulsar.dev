/**
 * Server-Side Rendering - Render to String
 */
import type { ComponentFunction, IRenderResult, IRenderToStringOptions } from './ssr.types';
/**
 * Render a Pulsar component to an HTML string
 */
export declare const renderToString: (component: ComponentFunction, options?: IRenderToStringOptions) => IRenderResult;
