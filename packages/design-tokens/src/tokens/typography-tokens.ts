/**
 * Design tokens - Typography
 * Migrated from @atomos/prime
 */

export interface ITypographyTokens {
  readonly fontFamily: {
    readonly sans: string
    readonly serif: string
    readonly mono: string
  }
  readonly fontSize: {
    readonly xs: string
    readonly sm: string
    readonly base: string
    readonly lg: string
    readonly xl: string
    readonly '2xl': string
    readonly '3xl': string
    readonly '4xl': string
    readonly '5xl': string
  }
  readonly fontWeight: {
    readonly light: string
    readonly normal: string
    readonly medium: string
    readonly semibold: string
    readonly bold: string
  }
  readonly lineHeight: {
    readonly tight: string
    readonly normal: string
    readonly relaxed: string
  }
}

export const typographyTokens: ITypographyTokens = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    serif: 'ui-serif, Georgia, serif',
    mono: 'ui-monospace, monospace'
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem'       // 48px
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  }
}
