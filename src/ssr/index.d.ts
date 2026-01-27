/**
 * SSR Public Exports
 */
export { createSSRContext } from './create-ssr-context';
export { hydrate } from './hydrate';
export { renderToString } from './render-to-string';
export { escapeAttribute, escapeHtml } from './utils/escape-html';
export { createHydrationScript, deserializeData, extractHydrationState, serializeData, } from './utils/serialize-data';
export { generateStatic } from './static/generate-static';
export type { ComponentFunction, IHydrateOptions, IRenderResult, IRenderToStringOptions, ISSRContext, IStaticGenerationOptions, } from './ssr.types';
