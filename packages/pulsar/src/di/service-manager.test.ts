/**
 * ServiceManager Tests
 * Unit tests for the IoC container
 */

import { ServiceManager } from './service-manager'
import { IServiceManager } from './service-manager.types'

describe('ServiceManager', () => {
    let serviceManager: IServiceManager

    beforeEach(() => {
        serviceManager = new ServiceManager()
    })

    afterEach(() => {
        serviceManager.dispose()
    })

    describe('Registration', () => {
        it('should register a service with factory', () => {
            const STestService = Symbol.for('ITestService')
            
            serviceManager.register(
                STestService,
                () => ({ value: 42 }),
                { lifetime: 'singleton' }
            )

            expect(serviceManager.isRegistered(STestService)).toBe(true)
        })

        it('should register a service with class', () => {
            const STestService = Symbol.for('ITestService')
            
            class TestService {
                value = 42
            }

            serviceManager.registerClass(
                STestService,
                TestService,
                { lifetime: 'singleton' }
            )

            const instance = serviceManager.resolve<TestService>(STestService)
            expect(instance.value).toBe(42)
        })

        it('should register a service instance', () => {
            const STestService = Symbol.for('ITestService')
            const instance = { value: 42 }

            serviceManager.registerInstance(STestService, instance)

            const resolved = serviceManager.resolve(STestService)
            expect(resolved).toBe(instance)
        })
    })

    describe('Resolution', () => {
        it('should resolve a registered service', () => {
            const STestService = Symbol.for('ITestService')
            
            serviceManager.register(
                STestService,
                () => ({ value: 42 }),
                { lifetime: 'singleton' }
            )

            const instance = serviceManager.resolve(STestService)
            expect(instance).toEqual({ value: 42 })
        })

        it('should throw when resolving unregistered service', () => {
            const STestService = Symbol.for('ITestService')

            expect(() => {
                serviceManager.resolve(STestService)
            }).toThrow('Service not found')
        })

        it('should return undefined for tryResolve on unregistered service', () => {
            const STestService = Symbol.for('ITestService')

            const result = serviceManager.tryResolve(STestService)
            expect(result).toBeUndefined()
        })
    })

    describe('Lifetimes', () => {
        it('should cache singleton instances', () => {
            const STestService = Symbol.for('ITestService')
            
            serviceManager.register(
                STestService,
                () => ({ value: Math.random() }),
                { lifetime: 'singleton' }
            )

            const instance1 = serviceManager.resolve(STestService)
            const instance2 = serviceManager.resolve(STestService)

            expect(instance1).toBe(instance2)
        })

        it('should create new transient instances', () => {
            const STestService = Symbol.for('ITestService')
            
            serviceManager.register(
                STestService,
                () => ({ value: Math.random() }),
                { lifetime: 'transient' }
            )

            const instance1 = serviceManager.resolve(STestService)
            const instance2 = serviceManager.resolve(STestService)

            expect(instance1).not.toBe(instance2)
        })

        it('should cache scoped instances within scope', () => {
            const STestService = Symbol.for('ITestService')
            
            serviceManager.register(
                STestService,
                () => ({ value: Math.random() }),
                { lifetime: 'scoped' }
            )

            const instance1 = serviceManager.resolve(STestService)
            const instance2 = serviceManager.resolve(STestService)

            expect(instance1).toBe(instance2)
        })
    })

    describe('Dependencies', () => {
        it('should resolve service with dependencies', () => {
            const SConfigService = Symbol.for('IConfigService')
            const SApiService = Symbol.for('IApiService')

            class ConfigService {
                value = 42
            }

            class ApiService {
                constructor(public config: ConfigService) {}
            }

            serviceManager.registerClass(
                SConfigService,
                ConfigService,
                { lifetime: 'singleton' }
            )

            serviceManager.registerClass(
                SApiService,
                ApiService,
                { 
                    lifetime: 'singleton',
                    dependencies: [SConfigService]
                }
            )

            const api = serviceManager.resolve<ApiService>(SApiService)
            expect(api.config.value).toBe(42)
        })

        it('should detect circular dependencies', () => {
            const SA = Symbol.for('A')
            const SB = Symbol.for('B')

            serviceManager.register(SA, (sm) => sm.resolve(SB), {
                dependencies: [SB]
            })

            serviceManager.register(SB, (sm) => sm.resolve(SA), {
                dependencies: [SA]
            })

            expect(() => {
                serviceManager.resolve(SA)
            }).toThrow('Circular dependency detected')
        })

        it('should validate no cycles', () => {
            const SA = Symbol.for('A')
            const SB = Symbol.for('B')

            serviceManager.register(SA, (sm) => sm.resolve(SB), {
                dependencies: [SB]
            })

            serviceManager.register(SB, (sm) => sm.resolve(SA), {
                dependencies: [SA]
            })

            expect(() => {
                serviceManager.validateNoCycles()
            }).toThrow('Circular dependency detected')
        })
    })

    describe('Lazy Resolution', () => {
        it('should create lazy resolver', () => {
            const STestService = Symbol.for('ITestService')
            let instantiated = false

            serviceManager.register(
                STestService,
                () => {
                    instantiated = true
                    return { value: 42 }
                },
                { lifetime: 'singleton' }
            )

            const lazyService = serviceManager.lazy(STestService)
            expect(instantiated).toBe(false)

            const instance = lazyService()
            expect(instantiated).toBe(true)
            expect(instance.value).toBe(42)
        })

        it('should cache lazy resolver results', () => {
            const STestService = Symbol.for('ITestService')

            serviceManager.register(
                STestService,
                () => ({ value: Math.random() }),
                { lifetime: 'singleton' }
            )

            const lazyService = serviceManager.lazy(STestService)
            
            const instance1 = lazyService()
            const instance2 = lazyService()

            expect(instance1).toBe(instance2)
        })
    })

    describe('Scopes', () => {
        it('should create child scope', () => {
            const scope = serviceManager.createScope()

            expect(scope).toBeDefined()
            expect(scope).not.toBe(serviceManager)
        })

        it('should access parent services from scope', () => {
            const STestService = Symbol.for('ITestService')

            serviceManager.register(
                STestService,
                () => ({ value: 42 }),
                { lifetime: 'singleton' }
            )

            const scope = serviceManager.createScope()
            const instance = scope.resolve(STestService)

            expect(instance.value).toBe(42)
        })

        it('should have separate scoped instances', () => {
            const STestService = Symbol.for('ITestService')

            serviceManager.register(
                STestService,
                () => ({ value: Math.random() }),
                { lifetime: 'scoped' }
            )

            const scope1 = serviceManager.createScope()
            const scope2 = serviceManager.createScope()

            const instance1 = scope1.resolve(STestService)
            const instance2 = scope2.resolve(STestService)

            expect(instance1).not.toBe(instance2)
        })
    })

    describe('Disposal', () => {
        it('should call dispose on disposable services', () => {
            const STestService = Symbol.for('ITestService')
            let disposed = false

            class DisposableService {
                dispose() {
                    disposed = true
                }
            }

            serviceManager.registerClass(
                STestService,
                DisposableService,
                { lifetime: 'singleton' }
            )

            serviceManager.resolve(STestService)
            serviceManager.dispose()

            expect(disposed).toBe(true)
        })

        it('should throw when using after disposal', () => {
            serviceManager.dispose()

            expect(() => {
                serviceManager.register(Symbol.for('Test'), () => ({}))
            }).toThrow('disposed')
        })
    })

    describe('Utilities', () => {
        it('should get service name from symbol', () => {
            const STestService = Symbol.for('ITestService')
            const name = serviceManager.getServiceName(STestService)

            expect(name).toContain('ITestService')
        })

        it('should get service name from string', () => {
            const name = serviceManager.getServiceName('TestService')

            expect(name).toBe('TestService')
        })

        it('should list registered services', () => {
            const SA = Symbol.for('A')
            const SB = Symbol.for('B')

            serviceManager.register(SA, () => ({}))
            serviceManager.register(SB, () => ({}))

            const services = serviceManager.getRegisteredServices()

            expect(services).toContain(SA)
            expect(services).toContain(SB)
        })
    })
})
