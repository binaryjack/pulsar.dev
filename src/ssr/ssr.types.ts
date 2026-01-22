/**
 * Server-Side Rendering Types
 */

/**
 * SSR context passed to components during server rendering
 */
export interface ISSRContext {
  /** Current URL being rendered */
  url: string;

  /** HTTP request object (Node.js/Web) */
  request?: Request | any;

  /** HTTP response object (Node.js/Web) */
  response?: Response | any;

  /** Custom data passed to components */
  data?: Record<string, any>;

  /** Collected CSS styles during rendering */
  styles?: string[];

  /** Collected script tags during rendering */
  scripts?: string[];

  /** Flag indicating server-side rendering */
  isServer?: boolean;
}

/**
 * Options for renderToString function
 */
export interface IRenderToStringOptions {
  /** SSR context */
  context?: ISSRContext;

  /** Wrapper function for the rendered HTML */
  wrapper?: (html: string) => string;

  /** Collect CSS styles during rendering */
  collectStyles?: boolean;

  /** Collect script tags during rendering */
  collectScripts?: boolean;

  /** Serialize component state for hydration */
  serializeState?: boolean;
}

/**
 * Result from renderToString
 */
export interface IRenderResult {
  /** Rendered HTML string */
  html: string;

  /** Collected styles */
  styles?: string[];

  /** Collected scripts */
  scripts?: string[];

  /** Serialized state for hydration */
  state?: string;
}

/**
 * Options for hydrate function
 */
export interface IHydrateOptions {
  /** Serialized state from server */
  state?: any;

  /** Custom hydration root */
  root?: Element | string;
}

/**
 * Static site generation options
 */
export interface IStaticGenerationOptions {
  /** Routes to pre-render */
  routes: string[];

  /** Output directory */
  outDir: string;

  /** Component to render */
  component: any;

  /** Data fetching function */
  getData?: (route: string) => Promise<any>;

  /** HTML wrapper template */
  template?: (html: string, data?: any) => string;
}

/**
 * Component function type
 */
export type ComponentFunction = () => any;
