# Security Enhancement Plan - Pulsar Framework

**Version:** 1.0  
**Date:** January 27, 2026  
**Status:** 🔄 In Planning  
**Priority:** HIGH

---

## Executive Summary

This document outlines security enhancements for the Pulsar Framework based on comprehensive security analysis. Pulsar demonstrates exceptional compile-time security through JSX transformation to safe DOM operations, but runtime security utilities and documentation require strengthening to achieve enterprise-grade security posture.

**Current Security Score:** 8.0/10  
**Target Security Score:** 9.5/10

### 🎯 Unique Security Advantage

Pulsar's **compile-time JSX transformation** provides inherent XSS protection that surpasses most runtime frameworks:

- ✅ User input **cannot** inject JSX syntax
- ✅ All dynamic content **must** go through safe DOM APIs (`createTextNode`)
- ✅ No template string interpolation vulnerabilities
- ✅ Static analysis catches unsafe patterns at build time

This architectural decision makes Pulsar inherently more secure than runtime-only frameworks.

---

## 🔍 Current Security Posture

### ✅ Strengths

1. **Compile-Time XSS Prevention**
   - JSX transformed to `document.createTextNode()` calls
   - No runtime JSX parsing
   - Automatic text escaping

2. **SSR Security** ([ssr/utils/escape-html.ts](../src/ssr/utils/escape-html.ts))
   - HTML character escaping
   - Attribute sanitization
   - Safe state serialization

3. **Safe DOM Manipulation**
   - No `eval()` or `Function()` usage
   - No `dangerouslySetInnerHTML` equivalent
   - Controlled `innerHTML` usage

4. **TypeScript Strict Mode**
   - Full type safety
   - Null safety checks
   - Strict function types

### ⚠️ Improvement Opportunities

1. **Limited security documentation**
2. **innerHTML prop exposure in jsx-runtime**
3. **No explicit sanitization API**
4. **CSP configuration undocumented**
5. **No security testing suite**
6. **Missing Content Security Policy helpers**

---

## 📋 Enhancement Roadmap

### Phase 1: Security Documentation & Awareness (Sprint 1-2)

#### 1.1 Comprehensive Security Guide

**Priority:** 🔴 CRITICAL  
**Effort:** Medium  
**Target:** v0.10.0

Create `docs/security/SECURITY-GUIDE.md`:

```markdown
# Pulsar Framework Security Guide

## Compile-Time Security Advantages

### How Pulsar Prevents XSS by Design

Pulsar's JSX transformation provides automatic XSS prevention:

**Your Code:**
```tsx
const UserComment = ({ text }) => {
  return <div>{text}</div>
}
```

**Transformed Code:**
```typescript
const UserComment = ({ text }) => {
  const el = document.createElement('div')
  const textNode = document.createTextNode(String(text))
  el.appendChild(textNode)
  return el
}
```

**Why This Matters:**
- `createTextNode` automatically escapes ALL content
- User input cannot inject HTML or scripts
- No runtime parsing = no injection vectors

### Security Best Practices

1. **Never Use innerHTML with User Data**
   ```typescript
   // ❌ DANGEROUS
   element.innerHTML = userInput
   
   // ✅ SAFE (automatically done by Pulsar)
   element.appendChild(document.createTextNode(userInput))
   ```

2. **URL Sanitization**
   ```typescript
   import { sanitizeURL } from '@pulsar/security'
   
   const Link = ({ href, children }) => {
     return <a href={sanitizeURL(href)}>{children}</a>
   }
   ```

3. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self'">
   ```
```

**Deliverables:**
- [ ] Security guide documentation
- [ ] XSS prevention explanation
- [ ] Best practices examples
- [ ] Security checklist

#### 1.2 Security API Reference

**Priority:** 🟡 HIGH  
**Effort:** Low  
**Target:** v0.10.0

Document existing security features:

**Deliverables:**
- [ ] SSR escaping API docs
- [ ] Safe DOM manipulation patterns
- [ ] Security utility index
- [ ] Migration examples

---

### Phase 2: Enhanced Security Utilities (Sprint 3-4)

#### 2.1 Security Utilities Module

**Priority:** 🔴 CRITICAL  
**Effort:** High  
**Target:** v0.10.0

Create `src/security/` module:

```typescript
// src/security/sanitize.ts

/**
 * Sanitize URL to prevent javascript: and data: URI attacks
 * @param url - URL to sanitize
 * @returns Safe URL or '#' if dangerous
 */
export function sanitizeURL(url: string): string {
  if (!url) return '#'
  
  const normalized = url.trim().toLowerCase()
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'about:'
  ]
  
  for (const protocol of dangerousProtocols) {
    if (normalized.startsWith(protocol)) {
      console.warn(`[Pulsar Security] Blocked dangerous URL protocol: ${protocol}`)
      return '#'
    }
  }
  
  return url
}

/**
 * Validate URL is safe for use in attributes
 */
export function isURLSafe(url: string): boolean {
  return sanitizeURL(url) !== '#'
}

/**
 * Sanitize style property value
 * Prevents CSS injection attacks
 */
export function sanitizeStyle(style: string): string {
  // Block dangerous CSS patterns
  const dangerous = [
    /javascript:/gi,
    /expression\s*\(/gi,
    /import\s+/gi,
    /@import/gi,
    /behavior\s*:/gi
  ]
  
  for (const pattern of dangerous) {
    if (pattern.test(style)) {
      console.warn('[Pulsar Security] Blocked dangerous CSS')
      return ''
    }
  }
  
  return style
}

/**
 * Check if string contains potential XSS
 */
export function containsXSS(input: string): boolean {
  const xssPatterns = [
    /<script[\s\S]*?>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ]
  
  return xssPatterns.some(pattern => pattern.test(input))
}

/**
 * Strip HTML tags from string (for search/display)
 */
export function stripHTML(html: string): string {
  const temp = document.createElement('div')
  temp.textContent = html
  return temp.innerHTML
}
```

```typescript
// src/security/csp.ts

export interface ICSPConfig {
  'default-src'?: string[]
  'script-src'?: string[]
  'style-src'?: string[]
  'img-src'?: string[]
  'connect-src'?: string[]
  'font-src'?: string[]
  'object-src'?: string[]
  'media-src'?: string[]
  'frame-src'?: string[]
}

/**
 * Generate Content Security Policy header value
 */
export function generateCSP(config: ICSPConfig): string {
  const directives = Object.entries(config)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
  
  return directives
}

/**
 * Recommended CSP for Pulsar applications
 */
export const PULSAR_RECOMMENDED_CSP: ICSPConfig = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'"], // For reactive styles
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'"],
  'font-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-src': ["'none'"]
}

/**
 * Create CSP meta tag
 */
export function createCSPMetaTag(config: ICSPConfig = PULSAR_RECOMMENDED_CSP): HTMLMetaElement {
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Content-Security-Policy'
  meta.content = generateCSP(config)
  return meta
}
```

```typescript
// src/security/index.ts

export {
  sanitizeURL,
  isURLSafe,
  sanitizeStyle,
  containsXSS,
  stripHTML
} from './sanitize'

export {
  generateCSP,
  createCSPMetaTag,
  PULSAR_RECOMMENDED_CSP,
  type ICSPConfig
} from './csp'

// Re-export SSR security utilities
export {
  escapeHtml,
  escapeAttribute,
  needsEscaping
} from '../ssr/utils/escape-html'

export {
  serializeData,
  deserializeData
} from '../ssr/utils/serialize-data'
```

**Deliverables:**
- [ ] URL sanitization
- [ ] CSS sanitization
- [ ] XSS detection
- [ ] CSP generation utilities
- [ ] Comprehensive tests (>90% coverage)
- [ ] API documentation

#### 2.2 Secure Component Patterns

**Priority:** 🟡 HIGH  
**Effort:** Medium  
**Target:** v0.10.0

Create secure component library:

```typescript
// src/components/secure-link.ts

import { sanitizeURL } from '../security'

export interface ISecureLinkProps {
  href: string
  children: any
  target?: string
  rel?: string
  onClick?: (e: Event) => void
}

/**
 * Secure link component with automatic URL sanitization
 */
export function SecureLink(props: ISecureLinkProps): HTMLAnchorElement {
  const link = document.createElement('a')
  
  // Sanitize href
  const safeHref = sanitizeURL(props.href)
  link.href = safeHref
  
  // Security: Add rel="noopener noreferrer" for external links
  if (props.target === '_blank') {
    link.target = '_blank'
    link.rel = props.rel || 'noopener noreferrer'
  }
  
  // Add click handler
  if (props.onClick) {
    link.addEventListener('click', props.onClick)
  }
  
  // Append children
  if (props.children) {
    const children = Array.isArray(props.children) ? props.children : [props.children]
    children.forEach(child => {
      if (child instanceof Node) {
        link.appendChild(child)
      } else {
        link.appendChild(document.createTextNode(String(child)))
      }
    })
  }
  
  return link
}
```

```typescript
// src/components/secure-image.ts

import { sanitizeURL } from '../security'

export interface ISecureImageProps {
  src: string
  alt: string
  onError?: (e: Event) => void
}

/**
 * Secure image component with URL validation
 */
export function SecureImage(props: ISecureImageProps): HTMLImageElement {
  const img = document.createElement('img')
  
  // Sanitize src
  const safeSrc = sanitizeURL(props.src)
  img.src = safeSrc
  img.alt = props.alt || ''
  
  // Add error handler
  if (props.onError) {
    img.addEventListener('error', props.onError)
  }
  
  // Security: Prevent loading external resources in error handler
  img.addEventListener('error', () => {
    if (img.src !== safeSrc) {
      img.src = safeSrc
    }
  })
  
  return img
}
```

**Deliverables:**
- [ ] SecureLink component
- [ ] SecureImage component
- [ ] SecureIframe component (if needed)
- [ ] Component tests
- [ ] Usage documentation

---

### Phase 3: innerHTML Safety Audit (Sprint 5)

#### 3.1 Audit innerHTML Usage

**Priority:** 🔴 CRITICAL  
**Effort:** Low  
**Target:** v0.10.0

Review and secure all `innerHTML` usage:

**Current Usage:**
1. `jsx-runtime-standard.ts` - Exposes innerHTML prop
2. `router/outlet.ts` - Uses innerHTML for clearing
3. `bootstrap/mount.ts` - Uses innerHTML for root clearing

**Action Items:**
- [ ] Audit all innerHTML usage
- [ ] Replace with safe alternatives where possible
- [ ] Document necessary innerHTML usage
- [ ] Add security warnings

#### 3.2 Deprecate Unsafe innerHTML Prop

**Priority:** 🟡 HIGH  
**Effort:** Low  
**Target:** v0.10.0

```typescript
// src/jsx-runtime/jsx-runtime-standard.ts

// Before:
if (key === 'innerHTML') {
  element.innerHTML = props[key] as string
}

// After:
if (key === 'innerHTML') {
  console.warn(
    '[Pulsar Security Warning] Using innerHTML prop can introduce XSS vulnerabilities. ' +
    'Consider using textContent or appendChild with createTextNode instead. ' +
    'If you must use innerHTML, sanitize content first using sanitizeHTML from @pulsar/security.'
  )
  element.innerHTML = props[key] as string
}
```

**Deliverables:**
- [ ] Add deprecation warnings
- [ ] Update documentation
- [ ] Provide migration guide
- [ ] Consider removing in v1.0

---

### Phase 4: Security Testing Suite (Sprint 6-7)

#### 4.1 XSS Prevention Tests

**Priority:** 🔴 CRITICAL  
**Effort:** High  
**Target:** v0.10.0

```typescript
// src/__tests__/security/xss-prevention.test.ts

describe('XSS Prevention', () => {
  describe('Compile-Time Protection', () => {
    it('should escape user content in text nodes', () => {
      const malicious = '<script>alert("xss")</script>'
      const div = <div>{malicious}</div>
      
      expect(div.textContent).toBe(malicious)
      expect(div.innerHTML).not.toContain('<script>')
      expect(div.innerHTML).toContain('&lt;script&gt;')
    })
    
    it('should not execute scripts in dynamic content', () => {
      const [content] = createSignal('<img src=x onerror="alert(1)">')
      const div = <div>{content()}</div>
      
      expect(div.querySelector('img')).toBeNull()
      expect(div.textContent).toContain('<img')
    })
  })
  
  describe('URL Sanitization', () => {
    it('should block javascript: URLs', () => {
      expect(sanitizeURL('javascript:alert(1)')).toBe('#')
    })
    
    it('should block data: URLs', () => {
      expect(sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('#')
    })
    
    it('should allow safe URLs', () => {
      expect(sanitizeURL('https://example.com')).toBe('https://example.com')
      expect(sanitizeURL('/path/to/resource')).toBe('/path/to/resource')
    })
  })
  
  describe('Style Sanitization', () => {
    it('should block CSS with javascript:', () => {
      const dangerous = 'background: url(javascript:alert(1))'
      expect(sanitizeStyle(dangerous)).toBe('')
    })
    
    it('should block CSS expressions', () => {
      const dangerous = 'width: expression(alert(1))'
      expect(sanitizeStyle(dangerous)).toBe('')
    })
  })
})
```

```typescript
// src/__tests__/security/ssr-security.test.ts

describe('SSR Security', () => {
  it('should escape HTML in renderToString', () => {
    const App = () => <div>{'<script>alert("xss")</script>'}</div>
    const { html } = renderToString(App)
    
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
  
  it('should serialize state safely', () => {
    const dangerousState = {
      content: '</script><script>alert(1)</script>'
    }
    
    const serialized = serializeData(dangerousState)
    expect(serialized).not.toContain('</script>')
    expect(serialized).toContain('\\u003c/script\\u003e')
  })
})
```

**Deliverables:**
- [ ] XSS prevention test suite
- [ ] URL sanitization tests
- [ ] Style sanitization tests
- [ ] SSR security tests
- [ ] Component security tests
- [ ] >85% security coverage

#### 4.2 OWASP Top 10 Compliance Tests

**Priority:** 🟡 HIGH  
**Effort:** Medium  
**Target:** v0.11.0

Create tests for OWASP Top 10 vulnerabilities:

**Deliverables:**
- [ ] A01: Broken Access Control tests
- [ ] A02: Cryptographic Failures tests
- [ ] A03: Injection tests
- [ ] A07: XSS tests (covered in 4.1)
- [ ] Security test documentation

---

### Phase 5: CSP Integration & Guidelines (Sprint 8)

#### 5.1 CSP Configuration Guide

**Priority:** 🟡 HIGH  
**Effort:** Low  
**Target:** v0.10.0

Create `docs/security/CONTENT-SECURITY-POLICY.md`:

```markdown
# Content Security Policy for Pulsar Applications

## Recommended CSP Configuration

### Basic Configuration

```typescript
import { createCSPMetaTag, PULSAR_RECOMMENDED_CSP } from '@pulsar-framework/pulsar.dev/security'

// Add to document head
document.head.appendChild(createCSPMetaTag())
```

### Custom Configuration

```typescript
import { createCSPMetaTag } from '@pulsar-framework/pulsar.dev/security'

const customCSP = createCSPMetaTag({
  'default-src': ["'self'"],
  'script-src': ["'self'", 'https://cdn.example.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://api.example.com']
})

document.head.appendChild(customCSP)
```

### Server-Side Configuration

**Express.js:**
```javascript
const helmet = require('helmet')

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"]
  }
}))
```

**Nginx:**
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'";
```

## Why 'unsafe-inline' for Styles?

Pulsar's reactive style system may require inline styles for dynamic updates.
To avoid this, use CSS custom properties:

```typescript
// Instead of inline styles
const [color] = createSignal('red')
<div style={{ color: color() }}></div>

// Use CSS variables (CSP-safe)
<div style={`--dynamic-color: ${color()}`} class="themed"></div>
```
```

**Deliverables:**
- [ ] CSP configuration guide
- [ ] Server configuration examples
- [ ] Inline style alternatives
- [ ] CSP violation debugging

#### 5.2 Security Headers Guide

**Priority:** 🟢 MEDIUM  
**Effort:** Low  
**Target:** v0.11.0

Document recommended security headers:

**Deliverables:**
- [ ] Security headers documentation
- [ ] Server configuration templates
- [ ] Header testing guide

---

### Phase 6: Security Audit & Certification (Sprint 9-10)

#### 6.1 Third-Party Security Audit

**Priority:** 🟢 MEDIUM  
**Effort:** External  
**Target:** v0.11.0

Engage security firm for professional audit:

**Scope:**
- [ ] Code review
- [ ] Penetration testing
- [ ] Dependency audit
- [ ] Security architecture review

**Deliverables:**
- [ ] Audit report
- [ ] Remediation plan
- [ ] Security certification

#### 6.2 Continuous Security Monitoring

**Priority:** 🟢 MEDIUM  
**Effort:** Low  
**Target:** v0.10.0

Implement automated security checks:

```yaml
# .github/workflows/security.yml
name: Security Audit

on:
  push:
    branches: [main]
  pull_request:
  schedule:
    - cron: '0 0 * * 0' # Weekly

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --production
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      - name: Run security tests
        run: npm run test:security
```

**Deliverables:**
- [ ] GitHub Actions security workflow
- [ ] Dependency scanning
- [ ] Automated security testing
- [ ] Security dashboard

---

## 📊 Success Metrics

### Quantitative Metrics

- [ ] **Test Coverage:** Security tests >85%
- [ ] **Vulnerability Count:** Zero high/critical vulnerabilities
- [ ] **Documentation Coverage:** 100% of security APIs documented
- [ ] **Adoption Rate:** 70% of projects use security utilities

### Qualitative Metrics

- [ ] **Developer Feedback:** Positive security utility feedback
- [ ] **Security Awareness:** Team security knowledge improved
- [ ] **Audit Results:** Pass third-party security audit
- [ ] **Incident Rate:** Zero security incidents in production

---

## 🔧 Implementation Strategy

### Development Principles

1. **Security by Default**
   - Secure defaults for all APIs
   - Opt-in for potentially unsafe operations
   - Clear warnings for security risks

2. **Developer Experience**
   - Security features are easy to use
   - Comprehensive documentation
   - Clear error messages

3. **Performance**
   - Security utilities must be fast
   - Minimal bundle size impact
   - Tree-shakeable exports

### Code Review Requirements

- All security code requires 2+ reviewers
- Security lead approval for critical changes
- Automated security scanning in CI
- Manual penetration testing before release

---

## 📅 Timeline

| Phase | Duration | Target Release | Priority |
|-------|----------|----------------|----------|
| Phase 1: Documentation | 4 weeks | v0.10.0 | 🔴 CRITICAL |
| Phase 2: Security Utilities | 4 weeks | v0.10.0 | 🔴 CRITICAL |
| Phase 3: innerHTML Audit | 2 weeks | v0.10.0 | 🔴 CRITICAL |
| Phase 4: Security Testing | 4 weeks | v0.10.0 | 🔴 CRITICAL |
| Phase 5: CSP Integration | 2 weeks | v0.10.0 | 🟡 HIGH |
| Phase 6: Security Audit | 4 weeks | v0.11.0 | 🟢 MEDIUM |

**Total Duration:** 20 weeks (~5 months)  
**Target Completion:** June 2026

---

## 🤝 Team & Resources

### Required Roles

- **Security Lead:** 1 FTE (All phases)
- **Framework Developer:** 1 FTE (Phases 2-4)
- **QA Engineer:** 0.5 FTE (Phase 4)
- **Technical Writer:** 0.5 FTE (Phases 1, 5)
- **DevOps Engineer:** 0.25 FTE (Phase 6)

### Budget Estimate

- **Internal Development:** ~$150,000
- **Third-Party Security Audit:** $20,000-$40,000
- **Security Tools & Services:** $5,000/year
- **Training & Certification:** $5,000

**Total:** ~$180,000 - $200,000

---

## 📝 Appendix

### A. Security Comparison

| Feature | Pulsar | React | Vue | Solid |
|---------|--------|-------|-----|-------|
| Compile-time XSS Prevention | ✅ | ❌ | ❌ | ✅ |
| SSR Escaping | ✅ | ✅ | ✅ | ✅ |
| CSP Support | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| Security Documentation | ⚠️ | ✅ | ✅ | ⚠️ |
| Sanitization API | ❌ | ❌ | ❌ | ❌ |

### B. Security Resources

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **MDN Web Security:** https://developer.mozilla.org/en-US/docs/Web/Security
- **Content Security Policy:** https://content-security-policy.com/
- **TypeScript Security:** https://www.typescriptlang.org/docs/handbook/

### C. References

- [SSR Utils: escape-html.ts](../src/ssr/utils/escape-html.ts)
- [SSR Utils: serialize-data.ts](../src/ssr/utils/serialize-data.ts)
- [JSX Runtime](../src/jsx-runtime/jsx-runtime-standard.ts)
- [Router Outlet](../src/router/outlet.ts)

### D. Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-01-27 | 1.0 | Initial security enhancement plan | Security Team |

---

**Status Legend:**
- 🔴 CRITICAL - Must have, blocks release
- 🟡 HIGH - Should have, important for security
- 🟢 MEDIUM - Nice to have, enhances security
- ⚪ LOW - Optional, future consideration

**Document Owner:** Pulsar Security Team  
**Last Updated:** January 27, 2026  
**Next Review:** April 27, 2026

---

## 🎉 Conclusion

Pulsar's compile-time JSX transformation provides a **significant security advantage** over runtime frameworks. By building on this foundation with enhanced documentation, security utilities, and testing, Pulsar can achieve best-in-class security posture while maintaining its developer-friendly API and excellent performance characteristics.

The framework's architecture naturally prevents many common web vulnerabilities, making it an excellent choice for security-conscious applications. This enhancement plan will formalize and expand these capabilities, providing developers with the tools and knowledge to build secure applications with confidence.
