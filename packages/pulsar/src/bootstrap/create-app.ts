import { Application } from './application'
import { IApplication } from './application.interface'
import { IBootstrapConfig } from './bootstrap-config.interface'
import { mount } from './prototype/mount'
import { unmount } from './prototype/unmount'
import { update } from './prototype/update'

// Attach prototype methods
Application.prototype.mount = mount
Application.prototype.unmount = unmount
Application.prototype.update = update

/**
 * Create an application instance
 */
export function createApp<TProps = unknown>(
    config: IBootstrapConfig<TProps>
): IApplication {
    return new Application(config) as unknown as IApplication
}

/**
 * Create and immediately mount an application
 */
export function bootstrapApp<TProps = unknown>(
    config: IBootstrapConfig<TProps>
): IApplication {
    const app = createApp(config)
    
    // Auto-mount when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => app.mount())
    } else {
        app.mount()
    }
    
    return app
}
