/**
 * Design tokens - Transitions
 * Migrated from @atomos/prime
 */

export interface ITransitionTokens {
  readonly duration: {
    readonly fast: string
    readonly normal: string
    readonly slow: string
  }
  readonly timing: {
    readonly linear: string
    readonly easeIn: string
    readonly easeOut: string
    readonly easeInOut: string
  }
}

export const transitionTokens: ITransitionTokens = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  timing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
