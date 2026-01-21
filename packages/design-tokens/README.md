# @pulsar/design-tokens

Framework-agnostic design tokens for the Pulsar ecosystem.

## Features

- ✅ Complete color palette (primary, secondary, neutral, success, warning, error)
- ✅ Spacing scale (xs → 4xl)
- ✅ Typography system (fonts, sizes, weights, line heights)
- ✅ Shadow tokens
- ✅ Border radius tokens
- ✅ Transition tokens
- ✅ Full TypeScript support
- ✅ Framework agnostic (works with any framework)

## Installation

```bash
pnpm add @pulsar/design-tokens
```

## Usage

```typescript
import {
  colorTokens,
  spacingTokens,
  typographyTokens,
  shadowTokens,
  borderRadiusTokens,
  transitionTokens
} from '@pulsar/design-tokens'

// Use in components
const buttonColor = colorTokens.primary[500]
const padding = spacingTokens.md
const fontSize = typographyTokens.fontSize.base
```

## Tokens

### Colors

Full color scales (50-950) for:
- `primary` - Blue
- `secondary` - Purple
- `neutral` - Gray
- `success` - Green
- `warning` - Amber
- `error` - Red

### Spacing

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px
- `4xl`: 96px

### Typography

- Font families: `sans`, `serif`, `mono`
- Font sizes: `xs` → `5xl`
- Font weights: `light`, `normal`, `medium`, `semibold`, `bold`
- Line heights: `tight`, `normal`, `relaxed`

### Shadows

- `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`

### Border Radius

- `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`

### Transitions

- Duration: `fast` (150ms), `normal` (300ms), `slow` (500ms)
- Timing: `linear`, `easeIn`, `easeOut`, `easeInOut`

## TypeScript

All tokens are fully typed with readonly interfaces for type safety.

```typescript
import type { IColorTokens, ISpacingTokens } from '@pulsar/design-tokens'
```

## License

MIT © [binaryjack](https://github.com/binaryjack)
