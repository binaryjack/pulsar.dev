/**
 * SSR Public Exports
 */

// Core SSR functions
export { createSSRContext } from './create-ssr-context';
export { hydrate } from './hydrate';
export { renderToString } from './render-to-string';

// Registry-based SSR (new)
export { bootFromState, dumpState, getHydrationScript } from './hydration';

// Utilities
export { escapeAttribute, escapeHtml } from './utils/escape-html';
export {
  createHydrationScript,
  deserializeData,
  extractHydrationState,
  serializeData,
} from './utils/serialize-data';

// Static site generation
export { generateStatic } from './static/generate-static';

// Types
export type {
  ComponentFunction,
  IHydrateOptions,
  IRenderResult,
  IRenderToStringOptions,
  ISSRContext,
  IStaticGenerationOptions,
} from './ssr.types';
