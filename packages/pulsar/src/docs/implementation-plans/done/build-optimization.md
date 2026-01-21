# Aggressive Build-Time Optimization Implementation Plan

**Target:** v0.3.0  
**Priority:** High (Core Differentiator)  
**Current State:** Basic JSX transform (40%)

---

## Implementation Rules

1. **Analyze Everything** - Deep static analysis of AST
2. **Safe Optimizations** - Never break semantics
3. **Measurable Impact** - Bundle size reduction >20%
4. **Fast Builds** - Optimization time <500ms
5. **Plugin Architecture** - Modular optimization passes

---

## File Structure

```
packages/transformer/optimizer/
├── index.ts                          # Optimizer orchestrator
├── analyzers/
│   ├── dead-code-analyzer.ts        # Find unused code
│   ├── constant-analyzer.ts         # Find compile-time constants
│   ├── purity-analyzer.ts           # Detect pure functions
│   └── dependency-analyzer.ts       # Analyze imports
├── optimizers/
│   ├── constant-folder.ts           # Fold constants
│   ├── dead-code-eliminator.ts      # Remove unused code
│   ├── tree-shaker.ts               # Advanced tree shaking
│   ├── code-splitter.ts             # Smart code splitting
│   └── inline-optimizer.ts          # Inline small functions
├── warnings/
│   ├── bundle-size-warner.ts        # Warn on large imports
│   ├── unused-warner.ts             # Warn unused imports
│   └── performance-warner.ts        # Warn slow patterns
├── reporters/
│   ├── optimization-reporter.ts     # Report savings
│   └── bundle-analyzer.ts           # Analyze output
└── tests/
    ├── constant-folding.test.ts
    ├── dead-code.test.ts
    └── tree-shaking.test.ts
```

---

## Core Features

### 1. Constant Folding

```typescript
const THEME = { primary: '#007bff', spacing: 8 }
<div style={{ color: THEME.primary, padding: THEME.spacing }} />
// Compiles to: <div style="color:#007bff;padding:8px"></div>
```

### 2. Dead Code Elimination

```typescript
const unused = fetchUsers() // Never used
return <div>{users.map(u => u.name)}</div>
// fetchUsers() call removed
```

### 3. Smart Code Splitting

```typescript
const Heavy = lazy(() => import('./Heavy'));
// Compiler detects below-the-fold
// Automatically preloads on scroll/hover
```

### 4. Bundle Size Warnings

```typescript
import { huge } from 'massive-lib'; // ⚠️ Adds 500KB
// Suggest: import only what you need
```

---

## Acceptance Criteria

- [ ] Constant folding for objects/arrays
- [ ] Dead code elimination beyond Rollup
- [ ] Pure function detection and inlining
- [ ] Unused import removal
- [ ] Smart code splitting with preload
- [ ] Bundle size warnings >100KB
- [ ] Optimization report generated
- [ ] Bundle size reduced >20%
- [ ] Build time increase <10%
- [ ] Works with Vite and Rollup
- [ ] Sourcemaps preserved
- [ ] Test coverage >85%
- [ ] Configurable optimization levels
- [ ] No false positives in dead code

---

## GitHub Agent

See: `.github/agents/optimization-agent.md`
