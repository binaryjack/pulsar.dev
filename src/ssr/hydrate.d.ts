/**
 * Client-Side Hydration
 */
import type { ComponentFunction, IHydrateOptions } from './ssr.types';
/**
 * Hydrate a server-rendered component
 * Attaches event listeners and reactivity to existing DOM
 */
export declare const hydrate: (component: ComponentFunction, target: Element | string, options?: IHydrateOptions) => void;
