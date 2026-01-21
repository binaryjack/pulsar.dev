# TypeScript Compiler API Features Implementation Plan

**Target:** v0.2.0  
**Priority:** High (Core Differentiator)  
**Current State:** Basic transformer (50%)

---

## Implementation Rules

1. **Use TS Compiler API** - `ts.Program`, `ts.TypeChecker` for analysis
2. **Zero Runtime Cost** - All checks at compile time
3. **Preserve Type Info** - Don't lose TypeScript semantics
4. **Incremental** - Don't break existing transformer
5. **Fast Compilation** - Cache type checks

---

## File Structure

```
packages/transformer/
├── index.ts                          # Main transformer entry
├── compiler-api/
│   ├── type-checker.ts              # TS TypeChecker wrapper
│   ├── symbol-resolver.ts           # Symbol resolution utilities
│   └── type-extractor.ts            # Extract type information
├── features/
│   ├── type-safe-routing.ts         # Route param extraction
│   ├── di-validation.ts             # DI compile-time checks
│   ├── prop-validation.ts           # Auto prop validators
│   ├── context-validation.ts        # Context type safety
│   └── error-enhancer.ts            # Enhanced error messages
├── analyzers/
│   ├── component-analyzer.ts        # Analyze component types
│   ├── dependency-analyzer.ts       # Analyze DI dependencies
│   └── route-analyzer.ts            # Analyze route definitions
├── generators/
│   ├── validator-generator.ts       # Generate runtime validators
│   ├── type-guard-generator.ts      # Generate type guards
│   └── error-generator.ts           # Generate error helpers
└── tests/
    ├── type-safe-routing.test.ts
    ├── di-validation.test.ts
    └── integration.test.ts
```

---

## Core Features

### 1. Type-Safe Routing

```typescript
// Input
const routes = defineRoutes({
  '/users/:userId/posts/:postId': UserPostPage,
});

// Generated
type UserPostPageProps = {
  params: { userId: string; postId: string };
};
```

### 2. DI Compile-Time Validation

```typescript
// Error at compile time
@Component()
class MyComponent {
  constructor(
    @Inject(NonExistentService) // ❌ Compile error: Service not registered
  ) {}
}
```

### 3. Auto Prop Validation

```typescript
interface ButtonProps {
  label: string;
  /** @minimum 0 @maximum 100 */
  progress: number;
}
// Generates runtime validator from JSDoc + types
```

### 4. Enhanced Errors

```typescript
setCount('invalid');
// Error: Expected number, got string
// 💡 Suggestion: setCount(parseInt("invalid"))
// 📚 Docs: https://pulsar.dev/errors/type-mismatch
```

---

## Acceptance Criteria

- [ ] Route param types auto-extracted
- [ ] DI dependencies validated at compile time
- [ ] Props validated from TypeScript types
- [ ] Context usage validated (Provider required)
- [ ] Error messages include suggestions
- [ ] Error messages include documentation links
- [ ] Type information preserved through transform
- [ ] Incremental compilation works
- [ ] Compilation time <2x slower than baseline
- [ ] Works with `ttypescript` and Vite
- [ ] Test coverage >85%
- [ ] Documentation with examples
- [ ] No false positives in validation

---

## GitHub Agent

See: `.github/agents/typescript-api-agent.md`
