/**
 * Service Manager - IoC Container
 * Dependency injection system inspired by formular.dev
 * Copyright (c) 2025 pulsar Framework
 */
import { IServiceManager } from './service-manager.types';
/**
 * ServiceManager constructor
 * Creates a new IoC container instance
 */
export declare const ServiceManager: {
    new (parent?: IServiceManager): IServiceManager;
};
