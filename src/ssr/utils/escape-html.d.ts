/**
 * HTML Escaping Utilities
 */
/**
 * Escape HTML special characters
 */
export declare const escapeHtml: (str: string) => string;
/**
 * Escape HTML attributes
 */
export declare const escapeAttribute: (str: string) => string;
/**
 * Check if value needs escaping
 */
export declare const needsEscaping: (str: string) => boolean;
