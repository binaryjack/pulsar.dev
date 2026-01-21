/**
 * CSS Variable Generator
 * Transforms design tokens into CSS custom properties
 */

import {
    borderRadiusTokens,
    colorTokens,
    shadowTokens,
    spacingTokens,
    transitionTokens,
    typographyTokens
} from '@pulsar/design-tokens'

export interface CSSVariableOptions {
    /**
     * Prefix for all CSS variables
     * @default 'pulsar'
     */
    prefix?: string
    
    /**
     * Generate theme variants (dark mode, etc.)
     * @default false
     */
    includeThemes?: boolean
    
    /**
     * Include comments in generated CSS
     * @default true
     */
    includeComments?: boolean
}

/**
 * Generate CSS custom properties from design tokens
 */
export class CSSVariableGenerator {
    private prefix: string
    
    constructor(private options: CSSVariableOptions = {}) {
        this.prefix = options.prefix || 'pulsar'
    }
    
    /**
     * Generate all CSS variables
     */
    generate(): string {
        const sections: string[] = []
        
        if (this.options.includeComments !== false) {
            sections.push(this.generateHeader())
        }
        
        sections.push(':root {')
        sections.push(this.generateColorVariables())
        sections.push(this.generateSpacingVariables())
        sections.push(this.generateTypographyVariables())
        sections.push(this.generateShadowVariables())
        sections.push(this.generateBorderRadiusVariables())
        sections.push(this.generateTransitionVariables())
        sections.push('}')
        
        if (this.options.includeThemes) {
            sections.push(this.generateDarkMode())
        }
        
        return sections.join('\n\n')
    }
    
    private generateHeader(): string {
        return `/**
 * Pulsar Design System - CSS Variables
 * Auto-generated from @pulsar/design-tokens
 * Do not edit manually
 */`
    }
    
    private generateColorVariables(): string {
        const vars: string[] = []
        
        if (this.options.includeComments !== false) {
            vars.push('  /* Colors */')
        }
        
        Object.entries(colorTokens).forEach(([scale, shades]) => {
            Object.entries(shades).forEach(([shade, value]) => {
                vars.push(`  --${this.prefix}-color-${scale}-${shade}: ${value};`)
            })
        })
        
        return vars.join('\n')
    }
    
    private generateSpacingVariables(): string {
        const vars: string[] = []
        
        if (this.options.includeComments !== false) {
            vars.push('  /* Spacing */')
        }
        
        Object.entries(spacingTokens).forEach(([size, value]) => {
            vars.push(`  --${this.prefix}-spacing-${size}: ${value};`)
        })
        
        return vars.join('\n')
    }
    
    private generateTypographyVariables(): string {
        const vars: string[] = []
        
        if (this.options.includeComments !== false) {
            vars.push('  /* Typography */')
        }
        
        // Font families
        Object.entries(typographyTokens.fontFamily).forEach(([name, value]) => {
            vars.push(`  --${this.prefix}-font-${name}: ${value};`)
        })
        
        // Font sizes
        Object.entries(typographyTokens.fontSize).forEach(([size, value]) => {
            vars.push(`  --${this.prefix}-font-size-${size}: ${value};`)
        })
        
        // Font weights
        Object.entries(typographyTokens.fontWeight).forEach(([weight, value]) => {
            vars.push(`  --${this.prefix}-font-weight-${weight}: ${value};`)
        })
        
        // Line heights
        Object.entries(typographyTokens.lineHeight).forEach(([size, value]) => {
            vars.push(`  --${this.prefix}-line-height-${size}: ${value};`)
        })
        
        return vars.join('\n')
    }
    
    private generateShadowVariables(): string {
        const vars: string[] = []
        
        if (this.options.includeComments !== false) {
            vars.push('  /* Shadows */')
        }
        
        Object.entries(shadowTokens).forEach(([level, value]) => {
            vars.push(`  --${this.prefix}-shadow-${level}: ${value};`)
        })
        
        return vars.join('\n')
    }
    
    private generateBorderRadiusVariables(): string {
        const vars: string[] = []
        
        if (this.options.includeComments !== false) {
            vars.push('  /* Border Radius */')
        }
        
        Object.entries(borderRadiusTokens).forEach(([size, value]) => {
            vars.push(`  --${this.prefix}-radius-${size}: ${value};`)
        })
        
        return vars.join('\n')
    }
    
    private generateTransitionVariables(): string {
        const vars: string[] = []
        
        if (this.options.includeComments !== false) {
            vars.push('  /* Transitions */')
        }
        
        Object.entries(transitionTokens.duration).forEach(([speed, value]) => {
            vars.push(`  --${this.prefix}-duration-${speed}: ${value};`)
        })
        
        vars.push(`  --${this.prefix}-easing-linear: ${transitionTokens.timing.linear};`)
        vars.push(`  --${this.prefix}-easing-ease-in: ${transitionTokens.timing.easeIn};`)
        vars.push(`  --${this.prefix}-easing-ease-out: ${transitionTokens.timing.easeOut};`)
        vars.push(`  --${this.prefix}-easing-ease-in-out: ${transitionTokens.timing.easeInOut};`)
        
        return vars.join('\n')
    }
    
    private generateDarkMode(): string {
        return `/* Dark mode theme */
@media (prefers-color-scheme: dark) {
  :root {
    /* Invert color scales for dark mode */
    --${this.prefix}-color-neutral-50: ${colorTokens.neutral[900]};
    --${this.prefix}-color-neutral-100: ${colorTokens.neutral[800]};
    --${this.prefix}-color-neutral-200: ${colorTokens.neutral[700]};
    --${this.prefix}-color-neutral-300: ${colorTokens.neutral[600]};
    --${this.prefix}-color-neutral-400: ${colorTokens.neutral[500]};
    --${this.prefix}-color-neutral-500: ${colorTokens.neutral[400]};
    --${this.prefix}-color-neutral-600: ${colorTokens.neutral[300]};
    --${this.prefix}-color-neutral-700: ${colorTokens.neutral[200]};
    --${this.prefix}-color-neutral-800: ${colorTokens.neutral[100]};
    --${this.prefix}-color-neutral-900: ${colorTokens.neutral[50]};
  }
}`
    }
    
    /**
     * Generate CSS file
     */
    generateFile(outputPath: string): void {
        import('fs').then(fs => {
            import('path').then(path => {
                const dir = path.dirname(outputPath)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true })
                }
                
                fs.writeFileSync(outputPath, this.generate(), 'utf-8')
            })
        })
    }
}

/**
 * Generate CSS variables from design tokens
 */
export function generateCSSVariables(options?: CSSVariableOptions): string {
    const generator = new CSSVariableGenerator(options)
    return generator.generate()
}
