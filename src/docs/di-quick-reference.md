# IoC/DI Quick Reference Guide

## Installation

The DI system is built into pulsar core - no additional installation needed!

```typescript
import { ServiceManager, bootstrapApp } from '@core'
```

## Basic Setup

### 1. Define Service Interface & Symbol

```typescript
// Service identifier (Symbol)
export const SConfigService = Symbol.for('IConfigService')

// Service interface
export interface IConfigService {
  get<T>(key: string): T
  set(key: string, value: any): void
}

// Implementation
class ConfigService implements IConfigService {
  get<T>(key: string): T { /* ... */ }
  set(key: string, value: any): void { /* ... */ }
}
```

### 2. Register Services

```typescript
const serviceManager = new ServiceManager()

serviceManager.register<IConfigService>(
  SConfigService,
  () => new ConfigService(),
  { lifetime: 'singleton' }
)
```

### 3. Bootstrap with DI

```typescript
const appRoot = bootstrapApp()
  .ioc(serviceManager)
  .register(SMyService, new MyService())
  .root('#app')
  .build()
```

## Service Lifetimes

```typescript
// Singleton - one instance for entire app
{ lifetime: 'singleton' }

// Transient - new instance every time
{ lifetime: 'transient' }

// Scoped - one instance per scope
{ lifetime: 'scoped' }
```

## Registration Methods

### Factory Function

```typescript
serviceManager.register(
  SMyService,
  (sm) => new MyService(),
  { lifetime: 'singleton' }
)
```

### Class with Dependencies

```typescript
serviceManager.registerClass(
  SApiService,
  ApiService,
  { 
    lifetime: 'singleton',
    dependencies: [SConfigService, SHttpClient]
  }
)
```

### Instance

```typescript
const instance = new MyService()
serviceManager.registerInstance(SMyService, instance)
```

## Resolution

### Direct Resolution

```typescript
const config = serviceManager.resolve<IConfigService>(SConfigService)
```

### Safe Resolution

```typescript
const config = serviceManager.tryResolve<IConfigService>(SConfigService)
if (config) {
  // use config
}
```

### Lazy Resolution

```typescript
const lazyConfig = serviceManager.lazy<IConfigService>(SConfigService)

// Service not created yet
const config = lazyConfig()  // Created on first call
```

## Common Patterns

### 1. Your Requested Pattern

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
    console.log('[App] Mounted', element)
  })
  .build()
```

### 2. Using Services in Components

```typescript
// Access from appRoot
const Dashboard = () => {
  const apiService = appRoot.serviceManager?.resolve<IApiService>(SApiService)
  
  return <div>{/* ... */}</div>
}
```

### 3. Hierarchical Scopes

```typescript
// Root container
const rootContainer = new ServiceManager()
rootContainer.register(SConfigService, () => new ConfigService(), {
  lifetime: 'singleton'
})

// Request scope
const requestScope = rootContainer.createScope()
requestScope.register(SRequestContext, () => new RequestContext(), {
  lifetime: 'scoped'
})

// Child can access parent services
const config = requestScope.resolve(SConfigService)
```

## Validation

```typescript
// Detect circular dependencies (development)
if (process.env.NODE_ENV === 'development') {
  serviceManager.validateNoCycles()
}
```

## Disposal

```typescript
// Cleanup on app shutdown
serviceManager.dispose()

// Services implementing IDisposableService will have dispose() called
class MyService implements IDisposableService {
  dispose() {
    // Cleanup resources
  }
}
```

## Common Service Symbols

```typescript
// Core services
export const SConfigService = Symbol.for('IConfigService')
export const SLoggerService = Symbol.for('ILoggerService')
export const SApiService = Symbol.for('IApiService')
export const SNotificationService = Symbol.for('INotificationService')

// Use Symbol.for() for global uniqueness
```

## Cheat Sheet

| Task | Code |
|------|------|
| Create manager | `new ServiceManager()` |
| Register factory | `.register(symbol, factory, options)` |
| Register class | `.registerClass(symbol, Class, options)` |
| Register instance | `.registerInstance(symbol, instance)` |
| Resolve | `.resolve<T>(symbol)` |
| Try resolve | `.tryResolve<T>(symbol)` |
| Lazy resolve | `.lazy<T>(symbol)()` |
| Create scope | `.createScope()` |
| Validate | `.validateNoCycles()` |
| Dispose | `.dispose()` |

## Complete Example

```typescript
// 1. Define services
export const SConfigService = Symbol.for('IConfigService')
export const SApiService = Symbol.for('IApiService')

interface IConfigService {
  apiUrl: string
}

interface IApiService {
  fetch<T>(endpoint: string): Promise<T>
}

class ConfigService implements IConfigService {
  apiUrl = 'https://api.example.com'
}

class ApiService implements IApiService {
  constructor(private config: IConfigService) {}
  
  async fetch<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.config.apiUrl}${endpoint}`)
    return response.json()
  }
}

// 2. Setup DI
const sm = new ServiceManager()

sm.register(SConfigService, () => new ConfigService(), {
  lifetime: 'singleton'
})

sm.register(SApiService, (container) => 
  new ApiService(container.resolve(SConfigService)), {
  lifetime: 'singleton',
  dependencies: [SConfigService]
})

// 3. Bootstrap
const app = bootstrapApp()
  .ioc(sm)
  .root('#app')
  .build()

// 4. Use in components
const api = app.serviceManager?.resolve<IApiService>(SApiService)
const data = await api.fetch('/users')
```

## Resources

- [Full Documentation](./dependency-injection.md)
- [Implementation Summary](./di-implementation-summary.md)
- [Examples](../di/examples.ts)
- [Tests](../di/service-manager.test.ts)
- [formular.dev Inspiration](https://github.com/binaryjack/formular.dev)
