/**
 * Bootstrap module
 * Application lifecycle and outlet management
 */
export { Application } from './application';
export type { IApplicationBuilder } from './application-builder.interface';
export type { IApplicationInternal } from './application-internal.interface';
export { ApplicationRoot } from './application-root';
export type { IApplicationRootInternal } from './application-root-internal.interface';
export type { IApplicationRoot } from './application-root.interface';
export type { IApplication } from './application.interface';
export type { IBootstrapConfig } from './bootstrap-config.interface';
export { bootstrapApp } from './builder';
export { createApp } from './create-app';
export { createOutlet } from './create-outlet';
export { Outlet } from './outlet';
export type { IOutletInternal } from './outlet-internal.interface';
export type { IOutlet } from './outlet.interface';
export { mount as legacyMount } from './prototype/mount';
export { clear } from './prototype/outlet/clear';
export { render } from './prototype/outlet/render';
export { mount } from './prototype/root/mount';
export { unmount } from './prototype/root/unmount';
export { unmount as legacyUnmount } from './prototype/unmount';
export { update } from './prototype/update';
export { pulse } from './pulse';
export type { IPulseConfig } from './pulse';
