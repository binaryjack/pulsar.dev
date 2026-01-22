/**
 * Data Serialization for SSR
 */

/**
 * Serialize data for client hydration
 */
export const serializeData = function serializeData(data: any): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027');
};

/**
 * Deserialize data on the client
 */
export const deserializeData = function deserializeData<T = any>(str: string): T {
  return JSON.parse(str);
};

/**
 * Create hydration script with serialized state
 */
export const createHydrationScript = function createHydrationScript(state: any): string {
  const serialized = serializeData(state);
  return `<script id="__PULSAR_STATE__" type="application/json">${serialized}</script>`;
};

/**
 * Extract hydration state from DOM
 */
export const extractHydrationState = function extractHydrationState<T = any>(): T | null {
  if (typeof window === 'undefined') return null;

  const script = document.getElementById('__PULSAR_STATE__');
  if (!script) return null;

  try {
    return deserializeData<T>(script.textContent || '{}');
  } catch (error) {
    console.error('Failed to parse hydration state:', error);
    return null;
  }
};
