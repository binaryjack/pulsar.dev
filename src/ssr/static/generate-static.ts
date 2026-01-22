/**
 * Static Site Generation
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { renderToString } from '../render-to-string';
import type { IStaticGenerationOptions } from '../ssr.types';

/**
 * Generate static HTML files for multiple routes
 */
export const generateStatic = async function generateStatic(
  options: IStaticGenerationOptions
): Promise<void> {
  const { routes, outDir, component, getData, template } = options;

  // Ensure output directory exists
  await fs.mkdir(outDir, { recursive: true });

  // Generate each route
  for (const route of routes) {
    try {
      // Fetch data if provided
      const data = getData ? await getData(route) : undefined;

      // Render component
      const result = renderToString(component, {
        context: {
          url: route,
          data,
          isServer: true,
        },
        serializeState: true,
      });

      // Apply template
      const html = template
        ? template(result.html, data)
        : createDefaultTemplate(result.html, route, result.state);

      // Determine output file path
      const filePath = getOutputPath(outDir, route);

      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      // Write HTML file
      await fs.writeFile(filePath, html, 'utf-8');

      console.log(`[SSG] Generated: ${route} -> ${filePath}`);
    } catch (error) {
      console.error(`[SSG] Failed to generate ${route}:`, error);
      throw error;
    }
  }

  console.log(`[SSG] Generated ${routes.length} pages`);
};

/**
 * Create default HTML template
 */
const createDefaultTemplate = function createDefaultTemplate(
  html: string,
  route: string,
  state?: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pulsar App - ${route}</title>
</head>
<body>
  <div id="app">${html}</div>
  ${state || ''}
  <script type="module" src="/main.js"></script>
</body>
</html>`;
};

/**
 * Get output file path for a route
 */
const getOutputPath = function getOutputPath(outDir: string, route: string): string {
  // Convert route to file path
  // /home -> /home/index.html
  // /about -> /about/index.html
  // /users/123 -> /users/123/index.html

  const cleanRoute = route.replace(/\/$/, '') || '/';
  const segments = cleanRoute.split('/').filter(Boolean);

  if (segments.length === 0) {
    return path.join(outDir, 'index.html');
  }

  return path.join(outDir, ...segments, 'index.html');
};
