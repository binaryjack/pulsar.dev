# Enhanced Router Implementation Plan

**Target:** v0.2.0  
**Priority:** High  
**Current State:** Basic hash routing (30%)

---

## Implementation Rules

1. **Zero Breaking Changes** - Extend existing `Router`/`Route` components
2. **Type-Safe First** - Full TypeScript inference for params/query
3. **No External Dependencies** - Pure Pulsar implementation
4. **Signal-Based** - Use reactive primitives for state
5. **Test Coverage >80%** - Unit + integration tests required

---

## File Structure

```
src/router/
├── index.ts                      # Public API exports
├── router.ts                     # Enhanced Router component
├── route.ts                      # Enhanced Route component
├── router-context.ts             # Router state context
├── navigation.ts                 # Navigation utilities
├── hooks/
│   ├── use-router.ts            # useRouter() hook
│   ├── use-navigate.ts          # useNavigate() hook
│   ├── use-params.ts            # useParams() hook
│   ├── use-search-params.ts     # useSearchParams() hook
│   └── use-location.ts          # useLocation() hook
├── guards/
│   ├── guard.interface.ts       # Guard interface
│   ├── auth-guard.ts            # Auth guard example
│   └── guard-manager.ts         # Guard execution
├── matching/
│   ├── path-matcher.ts          # Path pattern matching
│   ├── param-extractor.ts       # Extract :params from path
│   └── query-parser.ts          # Parse query strings
├── history/
│   ├── history-manager.ts       # History API wrapper
│   └── hash-fallback.ts         # Hash mode fallback
└── router.test.ts               # Test suite
```

---

## Core Features

### 1. Param Extraction

```typescript
<Route path="/users/:userId/posts/:postId" component={PostPage} />
// PostPage receives: { params: { userId: string, postId: string } }
```

### 2. Programmatic Navigation

```typescript
const navigate = useNavigate();
navigate('/users/123');
navigate('/posts', { state: { from: 'home' } });
```

### 3. Guards

```typescript
<Route path="/admin" component={Admin} guards={[authGuard, adminGuard]} />
```

### 4. Nested Routes

```typescript
<Route path="/dashboard">
  <Route path="/settings" component={Settings} />
  <Route path="/profile" component={Profile} />
</Route>
```

---

## Acceptance Criteria

- [ ] Path params extraction (`/users/:id`)
- [ ] Query string parsing (`?page=1&sort=name`)
- [ ] `useRouter()` hook returns current route state
- [ ] `useNavigate()` programmatic navigation
- [ ] `useParams()` type-safe params access
- [ ] Guards execute before route activation
- [ ] Guards can cancel/redirect navigation
- [ ] Nested routes render correctly
- [ ] History API support (pushState)
- [ ] Hash fallback for legacy browsers
- [ ] 404 fallback handling
- [ ] Route transitions don't unmount entire tree
- [ ] Test coverage >80%
- [ ] TypeScript inference for route params
- [ ] No regressions on existing hash router

---

## GitHub Agent

See: `.github/agents/router-agent.md`
