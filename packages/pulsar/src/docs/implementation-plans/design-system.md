# Design System First Implementation Plan

**Target:** v0.3.0  
**Priority:** Medium  
**Current State:** Tokens exist in atomos-prime (50%), needs extraction & tooling

---

## Current Situation

**Existing in `atomos-prime.dev/src/design/`:**

- ✅ Color tokens (primary, secondary, neutral, success, warning, error)
- ✅ Spacing tokens (xs → 4xl)
- ✅ Typography tokens (font sizes, weights, line heights)
- ✅ Border radius tokens
- ✅ Shadow tokens
- ✅ Transition tokens
- ✅ Variant system (solid, outline, ghost, soft)

**Missing:**

- ❌ Compile-time CSS variable generation
- ❌ Type-safe totokens/ # NEW standalone package
  ├── package.json
  ├── tsconfig.json
  ├── index.ts # Public API
  ├── tokens/
  │ ├── colors.ts # Migrate from atomos-prime
  │ ├── spacing.ts # Migrate from atomos-prime
  │ ├── typography.ts # Migrate from atomos-prime
  │ ├── border-radius.ts # Migrate from atomos-prime
  │ ├── shadows.ts # Migrate from atomos-prime
  │ └── transitions.ts # Migrate from atomos-prime
  ├── core/
  │ ├── define-theme.ts # Theme definition API (NEW)
  │ ├── theme-context.ts # Build-time context (NEW)
  │ └── token-resolver.ts # Resolve nested tokens (NEW)
  ├── generators/
  │ ├── css-variable-generator.ts # Generate :root CSS (NEW)
  │ ├── type-generator.ts # Generate TS types (NEW)
  │ └── dark-mode-generator.ts # Generate dark theme (NEW)
  ├── transformer/
  │ ├── token-transformer.ts # Compile-time token resolution (NEW)
  │ └── vite-plugin.ts # Vite integration (NEW)
  ├── importers/
  │ ├── figma-importer.ts # Import from Figma (NEW)
  │ └── json-importer.ts # Import from JSON (NEW)
  └── tests/
  ├── token-extraction.test.ts
  ├──Extract Existing Tokens to Standalone Package

```typescript
// packages/design-tokens/tokens/colors.ts
// Migrated from atomos-prime with enhancements
export const colorTokens = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... (keep existing from atomos-prime)
    950: '#172554',
  },
} as const;

// Auto-generate TypeScript types
export type ColorToken = typeof colorTokens;
```

### 2. Build-Time CSS Variable Generation

```typescript
// Input: Token definitions
import { colorTokens, spacingTokens } from '@pulsar/design-tokens'

// Output: Generated at build time
// dist/tokens.css
:root {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
}
```

### 3. Type-Safe Token Access (Compile Time)

```typescript
// Before (runtime, in atomos-prime)
import { colorTokens } from '@atomos/prime/design'
const color = colorTokens.primary[500]

// After (compile-time optimized)
import { token } from '@pulsar/design-tokens'
### Phase 1: Extract (Critical)
- [ ] Create `@pulsar/design-tokens` package
- [ ] Migrate color tokens from atomos-prime
- [ ] Migrate spacing tokens from atomos-prime
- [ ] Migrate typography tokens from atomos-prime
- [ ] Migrate shadow/border-radius/transition tokens
- [ ] Update atomos-prime to consume new package
- [ ] Zero breaking changes in atomos-prime
- [ ] Test atomos-prime components still work

### Phase 2: Tooling (High Priority)
- [ ] CSS variable generator at build time
- [ ] Type-safe `token()` accessor function
- [ ] TypeScript types auto-generated from tokens
- [ ] Vite plugin for automatic CSS generation
- [ ] Dark mode theme support
- [ ] Theme composition/merging

### Phase 3: Advanced (Medium Priority)
- [ ] Figma token import (JSON format)
- [ ] Token validation at compile time
- [ ] Nested token paths (`color.primary.500`)
- [ ] Responsive breakpoint system
- [ ] Typography scale generation
- [ ] Documentation with examples
- [ ] Test coverage >80%

### Phase 4: Distribution (Low Priority)
- [ ] NPM package published
- [ ] Works with React, Vue, Svelte
- [ ] CLI tool for token generation
- [ ] VS Code extension for token preview
// Define dark theme (new)
const darkTheme = defineTheme('dark', {
  colors: {
    primary: {
      500: '#60a5fa',  // Lighter for dark mode
      // ...
    }
  }
})

// Generated CSS
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary-500: #60a5fa;
  }
}
```

###Migration Strategy

### Step 1: Create New Package

```bash
mkdir -p packages/design-tokens
cd packages/design-tokens
pnpm init
```

### Step 2: Copy Tokens from atomos-prime

```bash
# Copy token files
cp -r ../atomos-prime.dev/src/design/tokens/ ./tokens/

# Verify existing structure
# - color-tokens.ts ✅
# - spacing-tokens.ts ✅
# - typography-tokens.ts ✅
# - shadow-tokens.ts ✅
# - border-radius-tokens.ts ✅
# - transition-tokens.ts ✅
```

### Step 3: Add Build-Time Tooling

```typescript
// generators/css-variable-generator.ts
import { colorTokens, spacingTokens } from '../tokens';

export function generateCSSVariables() {
  const css = [':root {'];

  // Generate from existing tokens
  Object.entries(colorTokens.primary).forEach(([key, value]) => {
    css.push(`  --color-primary-${key}: ${value};`);
  });

  return css.join('\n') + '\n}';
}
```

### Step 4: Update atomos-prime

```typescript
// packages/atomos-prime.dev/src/design/index.ts
// Old: Export local tokens
// export * from './tokens'

// New: Re-export from standalone package
export * from '@pulsar/design-tokens';

// Keep variant system local (component-specific)
export * from './variants';
```

### Step 5: Verify No Breaking Changes

```bash
cd packages/atomos-prime.dev
pnpm build
pnpm test
# All tests should pass
```

---

## Implementation Phases

### Phase 1 (v0.3.0 - MVP): Extract & Package

**Duration:** 1-2 weeks  
**Goal:** Standalone package with existing tokens

1. Create package structure
2. Copy tokens from atomos-prime
3. Setup TypeScript build
4. Update atomos-prime imports
5. Verify no breaking changes

### Phase 2 (v0.3.0 - Core): Build-Time Tooling

**Duration:** 2-3 weeks  
**Goal:** CSS variable generation

1. CSS variable generator
2. Type-safe token accessor
3. Vite plugin integration
4. Dark mode support
5. Documentation

### Phase 3 (v0.4.0 - Advanced): Advanced Features

**Duration:** 3-4 weeks  
**Goal:** Production-ready tooling

1. Figma token import
2. Token validation
3. Theme composition
4. CLI tools
5. VS Code extension

---

## GitHub Agent

See: `.github/agents/design-system-agent.md`

**Special Instructions for Agent:**

- Start with Phase 1 (extraction) - critical for atomos-prime
- DO NOT modify token values, only move them
- Maintain 100% backward compatibility with atomos-prime
- Test atomos-prime components after each change
- The variant system stays in atomos-prime (component-specific logic)
  // Works with any framework
  import { colorTokens } from '@pulsar/design-tokens'

// Pulsar
<Button color={token('color.primary.500')} />

// React
<button style={{ color: `var(${token('color.primary.500')})` }} />

// Plain CSS
.button { color: var(--color-primary-500); } # Transform styled components
└── tests/
├── theme-generation.test.ts
└── type-safety.test.ts

````

---

## Core Features

### 1. Theme Definition

```typescript
const theme = defineTheme({
  colors: {
    brand: { primary: '#007bff', secondary: '#6c757d' },
  },
  spacing: [0, 4, 8, 16, 32, 64],
  typography: { baseSize: 16, scale: 'modular' },
});
````

### 2. Type-Safe Usage

```typescript
<Button color="brand.primary" /> // ✅ Autocomplete
<Button color="invalid" />       // ❌ TypeScript error
```

### 3. CSS Variable Output

```css
:root {
  --color-brand-primary: #007bff;
  --spacing-0: 0;
  --spacing-1: 4px;
}
```

### 4. Styled Components

```typescript
const Button = styled('button', {
  color: theme.colors.brand.primary,
  padding: theme.spacing[2],
});
// Compiles to CSS with variables
```

---

## Acceptance Criteria

- [ ] `defineTheme()` creates type-safe theme
- [ ] CSS variables generated at build time
- [ ] Dark mode support with media query
- [ ] Type-safe token access in components
- [ ] Nested token paths (`brand.primary.500`)
- [ ] Responsive breakpoint system
- [ ] Typography scale generation
- [ ] Zero runtime theme resolution
- [ ] Works with existing CSS
- [ ] Figma token import (JSON)
- [ ] Theme composition/merging
- [ ] Test coverage >80%
- [ ] Documentation with examples
- [ ] No JavaScript in output CSS

---

## GitHub Agent

See: `.github/agents/design-system-agent.md`
