/**
 * Bootstrap module
 * Application lifecycle and outlet management
 */
export type { IApplicationBuilder } from './application-builder.interface';
export type { IApplicationInternal } from './application-internal.interface';
export type { IApplicationRootInternal } from './application-root-internal.interface';
export type { IApplicationRoot } from './application-root.interface';
export type { IApplication } from './application.interface';
export type { IBootstrapConfig } from './bootstrap-config.interface';
export type { IOutletInternal } from './outlet-internal.interface';
export type { IOutlet } from './outlet.interface';
export { Application } from './application';
export { ApplicationRoot } from './application-root';
export { Outlet } from './outlet';
export { createApp } from './create-app';
export { createOutlet } from './create-outlet';
export { bootstrapApp } from './builder';
export { mount as legacyMount } from './prototype/mount';
export { clear } from './prototype/outlet/clear';
export { render } from './prototype/outlet/render';
export { mount } from './prototype/root/mount';
export { unmount } from './prototype/root/unmount';
export { unmount as legacyUnmount } from './prototype/unmount';
export { update } from './prototype/update';
