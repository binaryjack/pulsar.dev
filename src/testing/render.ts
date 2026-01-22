/**
 * Component Renderer
 * Core rendering utilities for testing Pulsar components
 */

import { createApp } from '../bootstrap';
import type { IRenderOptions, IRenderResult } from './testing.types';

const cleanupFunctions: (() => void)[] = [];

/**
 * Renders a Pulsar component for testing
 */
export function render<T = any>(
  component: (props: T) => any,
  options: IRenderOptions<T> = {}
): IRenderResult<T> {
  const { props = {} as T, wrapper, container: customContainer } = options;

  // Create container
  const container = customContainer || document.createElement('div');
  if (!customContainer) {
    document.body.appendChild(container);
  }

  // Wrap component if wrapper provided
  const componentToRender = wrapper ? () => wrapper(component(props)) : () => component(props);

  // Create and mount app
  const app = createApp({
    root: container,
    component: componentToRender,
    props: props as T,
  });
  app.mount();

  // Track cleanup
  const cleanup = () => {
    app.unmount();
    if (!customContainer && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };
  cleanupFunctions.push(cleanup);

  // Rerender with new props
  const rerender = (newProps?: Partial<T>) => {
    const mergedProps = { ...props, ...newProps } as T;
    app.unmount();
    const rerenderedComponent = wrapper
      ? () => wrapper(component(mergedProps))
      : () => component(mergedProps);
    const newApp = createApp({
      root: container,
      component: rerenderedComponent,
      props: mergedProps,
    });
    newApp.mount();
  };

  // Debug helper
  const debug = () => {
    console.log('Container HTML:');
    console.log(container.innerHTML);
  };

  return {
    container,
    unmount: cleanup,
    rerender,
    debug,
  };
}

/**
 * Cleans up all rendered components
 */
export function cleanup(): void {
  cleanupFunctions.forEach((fn) => fn());
  cleanupFunctions.length = 0;
}

/**
 * Automatically cleanup after each test (for test frameworks)
 */
export function setupAutoCleanup(): void {
  if (typeof afterEach !== 'undefined') {
    afterEach(() => {
      cleanup();
    });
  }
}
