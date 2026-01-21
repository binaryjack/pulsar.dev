/**
 * Design tokens - Spacing
 * Migrated from @atomos/prime
 */

export interface ISpacingTokens {
  readonly xs: string
  readonly sm: string
  readonly md: string
  readonly lg: string
  readonly xl: string
  readonly '2xl': string
  readonly '3xl': string
  readonly '4xl': string
}

export const spacingTokens: ISpacingTokens = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem'    // 96px
}
