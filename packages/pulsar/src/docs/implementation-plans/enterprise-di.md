# Enterprise-Grade DI Implementation Plan

**Target:** v1.0.0  
**Priority:** High (Core Differentiator)  
**Current State:** Basic ServiceManager (60%)

---

## Implementation Rules

1. **Extend Existing** - Build on current `ServiceManager`
2. **Decorator Support** - Use TypeScript decorators
3. **Zero Config** - Automatic discovery where possible
4. **Scope Hierarchy** - Request → Session → Singleton
5. **Interceptor Pipeline** - Composable middleware

---

## File Structure

```
packages/pulsar/src/di/
├── index.ts                          # Public API
├── decorators/
│   ├── injectable.decorator.ts      # @Injectable()
│   ├── inject.decorator.ts          # @Inject()
│   ├── optional.decorator.ts        # @Optional()
│   └── scope.decorator.ts           # @Scoped()
├── interceptors/
│   ├── interceptor.interface.ts     # Interceptor contract
│   ├── interceptor-chain.ts         # Chain of responsibility
│   ├── logging.interceptor.ts       # Example: logging
│   ├── caching.interceptor.ts       # Example: caching
│   └── retry.interceptor.ts         # Example: retry logic
├── modules/
│   ├── module.decorator.ts          # @Module()
│   ├── module-registry.ts           # Module registration
│   └── module-resolver.ts           # Dependency resolution
├── scopes/
│   ├── scope-manager.ts             # Manage scope lifecycle
│   ├── request-scope.ts             # HTTP request scope
│   └── session-scope.ts             # User session scope
├── advanced/
│   ├── factory.provider.ts          # Factory providers
│   ├── async.provider.ts            # Async initialization
│   └── conditional.provider.ts      # Conditional registration
└── tests/
    ├── decorators.test.ts
    ├── interceptors.test.ts
    ├── modules.test.ts
    └── integration.test.ts
```

---

## Core Features

### 1. Decorators

```typescript
@Injectable({ lifetime: 'scoped' })
class ApiService {
  @LogExecutionTime()
  @CacheResult({ ttl: 5000 })
  async fetchUser(id: string) {}
}
```

### 2. Module System

```typescript
@Module({
  imports: [AuthModule, ApiModule],
  providers: [UserService, ProfileService],
  exports: [UserService],
})
class UserModule {}
```

### 3. Interceptors

```typescript
class LoggingInterceptor implements Interceptor {
  async intercept(context: ExecutionContext, next: () => Promise<any>) {
    console.log('Before');
    const result = await next();
    console.log('After');
    return result;
  }
}
```

### 4. Scoped Services

```typescript
@Injectable({ scope: 'request' })
class RequestContext {
  constructor(@Inject('HTTP_REQUEST') private req: Request) {}
}
```

---

## Acceptance Criteria

- [ ] `@Injectable()` decorator works
- [ ] `@Inject()` property/constructor injection
- [ ] `@Optional()` for optional dependencies
- [ ] `@Module()` with imports/exports
- [ ] Module dependency resolution
- [ ] Interceptor pipeline execution
- [ ] Request-scoped services
- [ ] Session-scoped services
- [ ] Circular dependency detection
- [ ] Lazy initialization support
- [ ] Factory providers
- [ ] Async providers
- [ ] Test coverage >85%
- [ ] Migration guide from basic DI
- [ ] Performance: <1ms per resolution

---

## GitHub Agent

See: `.github/agents/enterprise-di-agent.md`
