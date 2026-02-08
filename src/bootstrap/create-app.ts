import { Application } from './application';
import { IApplication } from './application.interface';
import { IBootstrapConfig } from './bootstrap-config.interface';
import { mount } from './prototype/mount';
import { unmount } from './prototype/unmount';
import { update } from './prototype/update';

// Attach prototype methods
Application.prototype.mount = mount;
Application.prototype.unmount = unmount;
Application.prototype.update = update;

/**
 * Create an application instance
 */
export function createApp<TProps = unknown>(config: IBootstrapConfig<TProps>): IApplication {
  return new Application(config) as unknown as IApplication;
}

/**
 * Create and immediately mount an application
 */
export function bootstrapApp<TProps = unknown>(config: IBootstrapConfig<TProps>): IApplication {
  console.log('[Bootstrap/createApp] Creating application...');
  console.log('[Bootstrap/createApp] Config:', config);

  const app = createApp(config);

  console.log('[Bootstrap/createApp] Application created:', app);
  console.log(`[Bootstrap/createApp] app.mount type: ${typeof app.mount}`);

  // Auto-mount when DOM is ready
  console.log(`[Bootstrap/createApp] document.readyState: ${document.readyState}`);
  if (document.readyState === 'loading') {
    console.log('[Bootstrap/createApp] DOM still loading, adding DOMContentLoaded listener...');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Bootstrap/createApp] DOMContentLoaded fired, calling mount()...');
      app.mount();
    });
  } else {
    console.log('[Bootstrap/createApp] DOM ready, calling mount() immediately...');
    app.mount();
  }

  return app;
}
