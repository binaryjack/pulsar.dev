/**
 * HTML Escaping Utilities
 */

const htmlEscapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = function escapeHtml(str: string): string {
  return String(str).replace(/[&<>"']/g, (char) => htmlEscapeMap[char] || char);
};

/**
 * Escape HTML attributes
 */
export const escapeAttribute = function escapeAttribute(str: string): string {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

/**
 * Check if value needs escaping
 */
export const needsEscaping = function needsEscaping(str: string): boolean {
  return /[&<>"']/.test(str);
};
