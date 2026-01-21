/**
 * Build-time CLI for design tokens
 * Generates CSS variables from tokens
 */

import fs from 'fs'
import path from 'path'
import { CSSVariableGenerator } from './css-generator.js'

const args = process.argv.slice(2)
const outputDir = args[0] || './dist'

console.log('🎨 Generating CSS variables from design tokens...')

const generator = new CSSVariableGenerator({
    prefix: 'pulsar',
    includeThemes: true,
    includeComments: true
})

const outputPath = path.join(outputDir, 'variables.css')

// Ensure directory exists
const dir = path.dirname(outputPath)
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
}

// Generate and write
fs.writeFileSync(outputPath, generator.generate(), 'utf-8')

console.log(`✅ Generated: ${outputPath}`)
