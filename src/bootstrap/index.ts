/**
 * Bootstrap module
 * Application lifecycle and outlet management
 */

// Export types
export type { IApplicationBuilder } from './application-builder.interface'
export type { IApplicationInternal } from './application-internal.interface'
export type { IApplicationRootInternal } from './application-root-internal.interface'
export type { IApplicationRoot } from './application-root.interface'
export type { IApplication } from './application.interface'
export type { IBootstrapConfig } from './bootstrap-config.interface'
export type { IOutletInternal } from './outlet-internal.interface'
export type { IOutlet } from './outlet.interface'

// Export constructors (for advanced use cases)
export { Application } from './application'
export { ApplicationRoot } from './application-root'
export { Outlet } from './outlet'

// Export factory functions (primary public API)
export { createApp } from './create-app'
export { createOutlet } from './create-outlet'

// Export new builder API (recommended)
export { bootstrapApp } from './builder'

// Export prototype methods (for extension)
export { mount as legacyMount } from './prototype/mount'
export { clear } from './prototype/outlet/clear'
export { render } from './prototype/outlet/render'
export { mount } from './prototype/root/mount'
export { unmount } from './prototype/root/unmount'
export { unmount as legacyUnmount } from './prototype/unmount'
export { update } from './prototype/update'

