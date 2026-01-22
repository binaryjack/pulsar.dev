/**
 * Build complete URL from base URL, path, and query parameters
 */

export function buildURL(
  baseURL: string,
  url: string,
  params?: Record<string, string | number | boolean>
): string {
  // Combine baseURL and url
  let fullURL = url;

  if (baseURL) {
    // Remove trailing slash from baseURL
    const cleanBase = baseURL.replace(/\/$/, '');
    // Remove leading slash from url
    const cleanURL = url.replace(/^\//, '');
    // Combine
    fullURL = `${cleanBase}/${cleanURL}`;
  }

  // Add query parameters if provided
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    if (queryString) {
      const separator = fullURL.includes('?') ? '&' : '?';
      fullURL = `${fullURL}${separator}${queryString}`;
    }
  }

  return fullURL;
}
