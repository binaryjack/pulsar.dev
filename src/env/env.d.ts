/**
 * TypeScript definitions for environment variables
 * Extend this interface to add type safety for your custom variables
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Vite built-in variables
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly BASE_URL: string;
  
  // Pulsar framework variables
  readonly PULSAR_ENV?: string;
  readonly PULSAR_DEBUG?: string;
  readonly PULSAR_ENABLE_DEVTOOLS?: string;
  readonly PULSAR_LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
  
  // Application variables (customize per project)
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_FEATURE_FLAGS?: string;
  
  // Add your custom variables here
  // readonly VITE_YOUR_VAR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Node.js environment variables (for SSR and build scripts)
declare namespace NodeJS {
  interface ProcessEnv extends Record<string, string | undefined> {
    NODE_ENV?: 'development' | 'production' | 'test';
    PULSAR_ENV?: string;
    PULSAR_DEBUG?: string;
    PULSAR_ENABLE_DEVTOOLS?: string;
  }
}
