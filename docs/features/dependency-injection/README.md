# Dependency Injection (IoC) Module

Enterprise-grade dependency injection system for pulsar Framework, inspired by [formular.dev's ServiceManager](https://github.com/binaryjack/formular.dev).

## Features

✨ **Core Capabilities:**
- Service registration with factory functions or classes
- Three lifetime strategies: singleton, transient, scoped
- Automatic dependency resolution
- Lazy resolution for performance
- Circular dependency detection
- Hierarchical containers (parent-child scopes)
- Full TypeScript type safety

🎯 **Why Use DI?**
- Loose coupling between components
- Easy testing with mock services
- Better code organization
- Improved maintainability
- Professional architecture patterns

## Quick Start

```typescript
import { ServiceManager, bootstrapApp } from '@core'

// 1. Define service
export const SApiService = Symbol.for('IApiService')

interface IApiService {
  fetch<T>(url: string): Promise<T>
}

class ApiService implements IApiService {
  async fetch<T>(url: string): Promise<T> {
    const response = await fetch(url)
    return response.json()
  }
}

// 2. Register service
const sm = new ServiceManager()

sm.register<IApiService>(
  SApiService,
  () => new ApiService(),
  { lifetime: 'singleton' }
)

// 3. Bootstrap with DI
const app = bootstrapApp()
  .ioc(sm)
  .root('#app')
  .build()

// 4. Use service
const api = app.serviceManager?.resolve<IApiService>(SApiService)
const data = await api.fetch('/users')
```

## Your Requested Pattern

```typescript
const appRoot = bootstrapApp()
  .ioc(serviceManager)
  .register<IConfigurationService>(
    SConfigurationService, 
    new ConfigurationService(mode)
  )
  .register<INotificationService>(
    SNotificationService, 
    new NotificationService()
  )
  .register<IBusinessApiService>(
    SBusinessApiService, 
    new BusinessApiService(
      serviceManager.resolve(SConfigurationService),
      serviceManager.resolve(SNotificationService)
    )
  )
  .root('#app')
  .onMount((element) => {
    console.log('[App] Mounted successfully', element)
  })
  .onError((error) => {
    console.error('[App] Error:', error)
  })
  .build()
```

## Documentation

- 📖 [Full Documentation](../docs/dependency-injection.md) - Comprehensive guide
- ⚡ [Quick Reference](../docs/di-quick-reference.md) - Cheat sheet
- 📝 [Implementation Summary](../docs/di-implementation-summary.md) - Technical details
- 💡 [Examples](./examples.ts) - Usage patterns
- 🧪 [Tests](./service-manager.test.ts) - Unit tests

## API Overview

### ServiceManager

```typescript
class ServiceManager implements IServiceManager {
  // Registration
  register<T>(identifier, factory, options?): IServiceManager
  registerClass<T>(identifier, constructor, options?): IServiceManager
  registerInstance<T>(identifier, instance): IServiceManager
  
  // Resolution
  resolve<T>(identifier): T
  tryResolve<T>(identifier): T | undefined
  lazy<T>(identifier): () => T
  
  // Scoping
  createScope(): IServiceManager
  
  // Validation
  validateNoCycles(): void
  
  // Cleanup
  dispose(): void
}
```

### Bootstrap Integration

```typescript
interface IApplicationBuilder {
  ioc(serviceManager: IServiceManager): IApplicationBuilder
  register<T>(identifier: ServiceIdType<T>, instance: T): IApplicationBuilder
  registerFactory<T>(
    identifier: ServiceIdType<T>,
    factory: ServiceFactoryType<T>,
    options?: { lifetime?: 'singleton' | 'transient' | 'scoped' }
  ): IApplicationBuilder
}
```

## Service Lifetimes

| Lifetime | Behavior | Use Case |
|----------|----------|----------|
| `singleton` | One instance per container | Config, DB connections, caches |
| `transient` | New instance every time | Stateless operations, validators |
| `scoped` | One instance per scope | Request context, user sessions |

## Advanced Features

### Lazy Resolution

```typescript
const lazyApi = sm.lazy<IApiService>(SApiService)
// Service not created yet

const api = lazyApi()  // Created on first call
const same = lazyApi() // Returns cached instance
```

### Hierarchical Scopes

```typescript
const root = new ServiceManager()
root.register(SConfigService, () => new ConfigService(), { lifetime: 'singleton' })

const child = root.createScope()
child.register(SRequestContext, () => new RequestContext(), { lifetime: 'scoped' })

// Child can access parent services
const config = child.resolve(SConfigService) // From parent
const context = child.resolve(SRequestContext) // From child
```

### Circular Dependency Detection

```typescript
// Automatic detection during resolution
try {
  const service = sm.resolve(SA)
} catch (error) {
  console.error('Circular dependency:', error.message)
}

// Explicit validation
if (process.env.NODE_ENV === 'development') {
  sm.validateNoCycles()
}
```

## Comparison with Other Frameworks

| Feature | Angular | Vue 3 | React | pulsar |
|---------|---------|-------|-------|---------|
| DI System | ✅ Built-in | ⚠️ provide/inject | ❌ Context only | ✅ Built-in |
| Type Safety | ✅ Full | ⚠️ Partial | ⚠️ Partial | ✅ Full |
| Lifecycle | ✅ Advanced | ⚠️ Basic | ❌ None | ✅ Advanced |
| Validation | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| Scopes | ✅ Yes | ❌ No | ❌ No | ✅ Yes |

## Inspired by formular.dev

This implementation draws from the excellent [formular.dev ServiceManager](https://github.com/binaryjack/formular.dev):

**Borrowed Concepts:**
- ✅ Symbol-based service identifiers
- ✅ Lazy resolution with caching
- ✅ Circular dependency detection
- ✅ Hierarchical container architecture
- ✅ Three-tier lifetime management
- ✅ Service locator pattern
- ✅ Disposal interface pattern

**pulsar Adaptations:**
- ✅ Integrated with bootstrap builder
- ✅ Optimized for client-side
- ✅ Aligned with prototype architecture
- ✅ Framework-specific conventions

## Examples

See [examples.ts](./examples.ts) for comprehensive usage patterns:

1. Basic Setup
2. Dependency Injection
3. Bootstrap Integration
4. Fluent Registration
5. Lazy Resolution
6. Scoped Services
7. Validation

## Testing

Run tests:
```bash
pnpm test di
```

See [service-manager.test.ts](./service-manager.test.ts) for test examples.

## Contributing

When adding services:
1. Define interface with `I` prefix
2. Create Symbol with `S` prefix using `Symbol.for()`
3. Implement interface in concrete class
4. Register with appropriate lifetime
5. Document dependencies

## License

Part of pulsar Framework - MIT License

---

**Questions or Issues?**
- 📖 Read the [full documentation](../docs/dependency-injection.md)
- 💡 Check the [examples](./examples.ts)
- 🐛 Open an issue on GitHub
