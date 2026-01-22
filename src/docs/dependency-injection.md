# Dependency Injection Architecture

## Overview

pulsar's IoC (Inversion of Control) container provides enterprise-grade dependency injection inspired by the excellent [formular.dev ServiceManager](https://github.com/binaryjack/formular.dev). This system enables loosely coupled, testable, and maintainable application architectures.

## Why Dependency Injection?

### The Problem
```typescript
// ❌ Tight coupling - hard to test, hard to change
class ApiService {
  constructor() {
    this.config = new ConfigService()  // Direct dependency
    this.logger = new LoggerService()  // Hard to mock
  }
}
```

### The Solution
```typescript
// ✅ Loose coupling - easy to test, easy to change
class ApiService {
  constructor(
    private config: IConfigService,
    private logger: ILoggerService
  ) {}
}

// Container manages creation
container.register(SApiService, (sm) => 
  new ApiService(
    sm.resolve(SConfigService),
    sm.resolve(SLoggerService)
  )
)
```

## Core Concepts

### 1. Service Registration

Services are registered with **identifiers** (Symbols) and **factories**:

```typescript
// Symbol as unique identifier
export const SConfigService = Symbol.for('IConfigService')

// Interface for type safety
export interface IConfigService {
  getConfig<T>(key: string): T
}

// Implementation
class ConfigService implements IConfigService {
  getConfig<T>(key: string): T {
    // ...
  }
}

// Registration
serviceManager.register<IConfigService>(
  SConfigService,
  (container) => new ConfigService(),
  { lifetime: 'singleton' }
)
```

### 2. Service Lifetimes

#### Singleton
One instance for entire application lifetime:

```typescript
serviceManager.register(SConfigService, () => new ConfigService(), {
  lifetime: 'singleton'
})

const config1 = serviceManager.resolve(SConfigService)
const config2 = serviceManager.resolve(SConfigService)
// config1 === config2 ✓
```

**Use cases:**
- Configuration services
- Database connections
- Logging services
- Caching services

#### Transient
New instance every time:

```typescript
serviceManager.register(SHttpRequest, () => new HttpRequest(), {
  lifetime: 'transient'
})

const req1 = serviceManager.resolve(SHttpRequest)
const req2 = serviceManager.resolve(SHttpRequest)
// req1 !== req2 ✓
```

**Use cases:**
- Stateless operations
- Short-lived operations
- Request handlers
- Validators

#### Scoped
One instance per scope (e.g., per request):

```typescript
serviceManager.register(SUserContext, () => new UserContext(), {
  lifetime: 'scoped'
})

const scope1 = serviceManager.createScope()
const user1a = scope1.resolve(SUserContext)
const user1b = scope1.resolve(SUserContext)
// user1a === user1b ✓

const scope2 = serviceManager.createScope()
const user2 = scope2.resolve(SUserContext)
// user1a !== user2 ✓
```

**Use cases:**
- Request-scoped data
- User context
- Transaction boundaries
- Component trees

### 3. Dependency Resolution

#### Explicit Dependencies
```typescript
serviceManager.register(SApiService, (sm) => 
  new ApiService(
    sm.resolve(SConfigService),
    sm.resolve(SLoggerService)
  ), 
  { 
    lifetime: 'singleton',
    dependencies: [SConfigService, SLoggerService]
  }
)
```

#### Lazy Resolution
For optional dependencies or breaking circular references:

```typescript
class NotificationService {
  constructor(private sm: IServiceManager) {}
  
  // Lazy getter
  private get logger() {
    return this.sm.lazy<ILoggerService>(SLoggerService)()
  }
  
  notify(message: string) {
    this.logger.log(`Notification: ${message}`)
  }
}
```

### 4. Circular Dependency Detection

The container automatically detects circular dependencies:

```typescript
// ❌ This will throw an error
serviceManager.register(SA, (sm) => new A(sm.resolve(SB)))
serviceManager.register(SB, (sm) => new B(sm.resolve(SA)))

serviceManager.validateNoCycles()
// Error: Circular dependency detected: A -> B -> A
```

**Solution:** Use lazy resolution:

```typescript
// ✅ Break circular dependency
serviceManager.register(SA, (sm) => new A(sm.lazy(SB)))
serviceManager.register(SB, (sm) => new B(sm.lazy(SA)))
```

## Integration with Bootstrap

### Basic Setup

```typescript
import { bootstrapApp } from '@core/bootstrap'
import { ServiceManager } from '@core/di/service-manager'

// Create service manager
const serviceManager = new ServiceManager()

// Register services
serviceManager.register<IConfigService>(
  SConfigService,
  () => new ConfigService({ mode: 'production' }),
  { lifetime: 'singleton' }
)

serviceManager.register<INotificationService>(
  SNotificationService,
  () => new NotificationService(),
  { lifetime: 'singleton' }
)

serviceManager.register<IBusinessApiService>(
  SBusinessApiService,
  (sm) => new BusinessApiService(
    sm.resolve(SConfigService),
    sm.resolve(SNotificationService)
  ),
  { lifetime: 'singleton', dependencies: [SConfigService, SNotificationService] }
)

// Build application with DI
const appRoot = bootstrapApp()
  .ioc(serviceManager)
  .root('#app')
  .onMount((element) => {
    console.log('[App] Mounted with DI')
  })
  .build()
```

### Fluent Registration

You can also register services directly on the builder:

```typescript
const appRoot = bootstrapApp()
  .ioc(serviceManager)
  .register<IConfigService>(
    SConfigService, 
    new ConfigService(mode)
  )
  .register<INotificationService>(
    SNotificationService, 
    new NotificationService()
  )
  .register<IBusinessApiService>(
    SBusinessApiService, 
    new BusinessApiService(
      serviceManager.resolve(SConfigService),
      serviceManager.resolve(SNotificationService)
    )
  )
  .root('#app')
  .build()
```

## Service Consumption

### In Components

```typescript
import { useService } from '@core/hooks/use-service'

export const Dashboard = () => {
  const apiService = useService<IBusinessApiService>(SBusinessApiService)
  const [data, setData] = useState<Data[]>([])
  
  useEffect(() => {
    async function loadData() {
      const result = await apiService.fetchData()
      setData(result)
    }
    loadData()
  }, [])
  
  return <div>{/* render data */}</div>
}
```

### Context Provider Pattern

```typescript
import { createContext } from '@core/context'
import { IServiceManager } from '@core/di/service-manager'

export const ServiceContext = createContext<IServiceManager>()

// Provider
<ServiceContext.Provider value={serviceManager}>
  <App />
</ServiceContext.Provider>

// Consumer
export const MyComponent = () => {
  const sm = useContext(ServiceContext)
  const config = sm.resolve<IConfigService>(SConfigService)
  
  return <div>{config.appName}</div>
}
```

## Advanced Patterns

### Service Locator Pattern

```typescript
import { ServiceLocator } from '@core/di/service-locator'

class MyService {
  constructor(private locator: ServiceLocator) {}
  
  doWork() {
    const logger = this.locator.get<ILoggerService>(SLoggerService)
    logger.log('Working...')
  }
}
```

### Hierarchical Containers

```typescript
// Root container
const rootContainer = new ServiceManager()
rootContainer.register(SConfigService, () => new ConfigService())

// Child scope
const requestScope = rootContainer.createScope()
requestScope.register(SRequestContext, () => new RequestContext())

// Child can access parent services
const config = requestScope.resolve(SConfigService)  // From parent
const context = requestScope.resolve(SRequestContext) // From child
```

### Factory Pattern

```typescript
// Factory interface
interface IUserFactory {
  createUser(name: string): IUser
}

// Factory implementation
class UserFactory implements IUserFactory {
  constructor(private sm: IServiceManager) {}
  
  createUser(name: string): IUser {
    const logger = this.sm.resolve<ILoggerService>(SLoggerService)
    return new User(name, logger)
  }
}

// Register factory
serviceManager.register(SUserFactory, (sm) => new UserFactory(sm), {
  lifetime: 'singleton',
  dependencies: [SServiceManager]
})
```

## Comparison with Other Frameworks

### Angular
```typescript
// Angular - Decorator-based
@Injectable({ providedIn: 'root' })
export class ConfigService { }

// pulsar - Explicit registration
serviceManager.register(SConfigService, () => new ConfigService(), {
  lifetime: 'singleton'
})
```

**pulsar advantages:**
- No decorators (simpler)
- Explicit control
- Better tree-shaking
- Framework agnostic

### Vue 3
```typescript
// Vue 3 - provide/inject
app.provide('config', new ConfigService())

// pulsar - Typed DI
serviceManager.register<IConfigService>(SConfigService, () => new ConfigService())
```

**pulsar advantages:**
- Full TypeScript support
- Lifetime management
- Dependency validation
- Better refactoring

### React
```typescript
// React - Context
const ConfigContext = createContext(new ConfigService())

// pulsar - Service container
const config = useService<IConfigService>(SConfigService)
```

**pulsar advantages:**
- Single source of truth
- Lifecycle management
- Circular dependency detection
- Better performance

## Best Practices

### 1. Use Symbols for Identifiers
```typescript
// ✅ Symbol - unique, collision-free
export const SConfigService = Symbol.for('IConfigService')

// ❌ String - collision-prone
export const ConfigServiceKey = 'ConfigService'
```

### 2. Define Interfaces
```typescript
// ✅ Interface + implementation
export interface IConfigService {
  getConfig(key: string): any
}

class ConfigService implements IConfigService {
  getConfig(key: string): any { }
}

// ❌ Direct class dependency
class ApiService {
  constructor(private config: ConfigService) { }
}
```

### 3. Declare Dependencies
```typescript
// ✅ Explicit dependencies
serviceManager.register(SApiService, (sm) => 
  new ApiService(sm.resolve(SConfigService)),
  { dependencies: [SConfigService] }
)

// ❌ Hidden dependencies
serviceManager.register(SApiService, () => 
  new ApiService(new ConfigService())
)
```

### 4. Validate Early
```typescript
// Development mode
if (process.env.NODE_ENV === 'development') {
  serviceManager.validateNoCycles()
}
```

### 5. Use Appropriate Lifetimes
```typescript
// ✅ Stateless - singleton
serviceManager.register(SConfigService, ..., { lifetime: 'singleton' })

// ✅ Stateful - scoped or transient
serviceManager.register(SUserContext, ..., { lifetime: 'scoped' })
serviceManager.register(SHttpRequest, ..., { lifetime: 'transient' })
```

## Testing

### Mocking Services

```typescript
// Production code
serviceManager.register(SApiService, () => new ApiService())

// Test code
const mockApiService: IApiService = {
  fetchData: jest.fn().mockResolvedValue([])
}

testServiceManager.registerInstance(SApiService, mockApiService)

// Test component
const { container } = render(<Dashboard />, {
  serviceManager: testServiceManager
})
```

### Integration Testing

```typescript
describe('Dashboard Integration', () => {
  let serviceManager: IServiceManager
  
  beforeEach(() => {
    serviceManager = new ServiceManager()
    serviceManager.register(SConfigService, () => new ConfigService())
    serviceManager.register(SApiService, (sm) => 
      new ApiService(sm.resolve(SConfigService))
    )
  })
  
  afterEach(() => {
    serviceManager.dispose()
  })
  
  it('should load data', async () => {
    const api = serviceManager.resolve<IApiService>(SApiService)
    const data = await api.fetchData()
    expect(data).toBeDefined()
  })
})
```

## Performance Considerations

### 1. Lazy Resolution
Use lazy resolution for optional or conditional dependencies:

```typescript
// ✅ Lazy - only resolves when called
const lazyLogger = sm.lazy<ILoggerService>(SLoggerService)

if (DEBUG_MODE) {
  lazyLogger().log('Debug info')
}

// ❌ Eager - always resolves
const logger = sm.resolve<ILoggerService>(SLoggerService)
```

### 2. Singleton for Heavy Services
```typescript
// ✅ Database connection - singleton
serviceManager.register(SDatabase, () => new DatabaseConnection(), {
  lifetime: 'singleton'
})
```

### 3. Dispose Properly
```typescript
// Clean up resources
serviceManager.dispose()
```

## Resources

- [formular.dev ServiceManager](https://github.com/binaryjack/formular.dev/tree/main/packages/lib/src/core/managers/service-manager) - Inspiration for this implementation
- [Dependency Injection Principles](https://martinfowler.com/articles/injection.html) - Martin Fowler's classic article
- [InversifyJS](https://inversify.io/) - Popular TypeScript DI container

## Related Documentation

- [Architecture Overview](./architecture.md) - System architecture
- [Bootstrap System](../bootstrap/README.md) - Application initialization
- [Hooks](./hooks.md) - Using services in components
