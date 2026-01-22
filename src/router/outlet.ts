/**
 * Outlet component
 * Renders nested routes
 */

import type { IRoute } from './route.interface';
import { routerContext } from './router-context';

/**
 * Outlet component for nested routes
 * Renders the matched child route
 *
 * @example
 * <Route path="/dashboard">
 *   <Outlet />
 * </Route>
 */
export const Outlet = (): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'router-outlet';
  container.setAttribute('data-outlet', 'nested');

  // Render current nested route
  const renderNestedRoute = () => {
    const currentRoute = routerContext.currentRoute;

    if (!currentRoute) {
      container.innerHTML = '';
      return;
    }

    // Find nested routes
    if (currentRoute.children && Array.isArray(currentRoute.children)) {
      const childRoutes = currentRoute.children as IRoute[];
      const currentPath = routerContext.currentPath;

      // Match against child routes
      // (This is simplified - in practice, would need path prefix handling)
      const matchedChild = childRoutes.find((child) => currentPath.includes(child.path));

      container.innerHTML = '';

      if (matchedChild) {
        let content: HTMLElement | null = null;

        if (matchedChild.component) {
          content = matchedChild.component();
        } else if (matchedChild.element) {
          content = matchedChild.element;
        } else if (
          typeof matchedChild.children === 'object' &&
          'nodeType' in matchedChild.children
        ) {
          content = matchedChild.children as HTMLElement;
        }

        if (content) {
          container.appendChild(content);
        }
      }
    }
  };

  // Initial render
  renderNestedRoute();

  // Re-render on route change
  // (In practice, would use effect/watch on routerContext signals)

  return container;
};
