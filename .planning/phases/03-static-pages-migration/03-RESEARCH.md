# Phase 3: Static Pages Migration - Research

**Researched:** 2026-01-29
**Domain:** Astro static page generation and React-to-Astro migration
**Confidence:** HIGH

## Summary

Phase 3 involves migrating the first static page (Privacy Policy) from React to Astro's file-based routing system. This validates the entire deployment pipeline with real content while establishing patterns for future page migrations.

The standard approach is straightforward: create .astro pages in `src/pages/` that leverage the existing BaseLayout.astro for SEO meta tags, convert React JSX to Astro's template syntax, and use native HTML `<a>` tags for navigation. The Privacy Policy page is ideal as a first migration because it's purely static content with no interactivity requirements.

**Primary recommendation:** Create `src/pages/privacy.astro`, wrap content in BaseLayout with page-specific SEO props, convert JSX className to class, replace React Router links with HTML anchors, and verify meta tags in view source.

## Standard Stack

The established libraries/tools for Astro static page migration:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.16.16+ | Static site generator | Official framework, 68% faster FCP per project research |
| @astrojs/react | ^4.4.2 | React integration | Enables React islands for interactive components |
| TypeScript | ~5.6.2 | Type safety | Built-in Astro support, catches prop errors at compile time |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @playwright/test | latest | Visual regression testing | Verify pages render identically to React versions |
| @astrojs/check | ^0.9.4 | Type checking | Run before builds to catch type errors |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro pages | Keep React Router | Miss performance gains, no SSG benefits |
| Built-in layouts | Repeated meta tags | Code duplication, harder to maintain |
| TypeScript Props | Plain JavaScript | Lose type safety, harder to catch prop errors |

**Installation:**
```bash
# Already installed in Phase 1-2
# For visual regression testing:
pnpm add -D @playwright/test
npx playwright install
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/
│   ├── index.astro          # Homepage (future)
│   ├── privacy.astro         # Privacy policy (Phase 3)
│   └── terms.astro           # Terms (future)
├── layouts/
│   └── BaseLayout.astro      # Shared layout with SEO
├── components/
│   └── react/                # Interactive React islands
└── styles/
    └── global.css            # Tailwind imports
```

### Pattern 1: Static Page with SEO
**What:** Use BaseLayout.astro for all static pages to ensure consistent SEO meta tags
**When to use:** Every page that needs title, description, and canonical URL

**Example:**
```astro
---
// Source: https://docs.astro.build/en/basics/astro-pages/
import BaseLayout from '../layouts/BaseLayout.astro';

const title = "Privacy Policy";
const description = "Privacy policy for NomadCrew mobile app";
---

<BaseLayout title={title} description={description}>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
    <!-- Static content here -->
  </div>
</BaseLayout>
```

### Pattern 2: Converting React Components to Astro
**What:** Transform React component JSX to Astro template syntax
**When to use:** Static content pages with no interactivity

**Key transformations:**
- `className` → `class`
- `{children}` → `<slot />`
- Remove `export default function`
- Move JavaScript to frontmatter (--- delimiters)
- Inline styles: `style={{ color: 'red' }}` → `style="color: red"`
- Remove React imports (`useState`, `useEffect`) for static content

**Example:**
```astro
---
// Frontmatter: Server-side logic
const effectiveDate = "2024-12-28";
---

<!-- Template: HTML output -->
<section class="mb-8">
  <h2 class="text-2xl font-semibold mb-4">Information Collection</h2>
  <p>The Application collects information when you download and use it.</p>
  <ul class="list-disc pl-6 mb-4">
    <li>Your device's Internet Protocol address</li>
    <li>Pages visited and time spent</li>
  </ul>
</section>
```

### Pattern 3: Navigation Links
**What:** Use native HTML `<a>` tags instead of React Router `<Link>`
**When to use:** All inter-page navigation in Astro pages

**Migration:**
```diff
- import { Link } from 'react-router-dom';
- <Link to="/privacy-policy">Privacy Policy</Link>
+ <a href="/privacy">Privacy Policy</a>
```

### Pattern 4: TypeScript Props Interface
**What:** Define Props interface in frontmatter for type-checked component props
**When to use:** All reusable Astro components

**Example:**
```astro
---
// Source: https://docs.astro.build/en/guides/typescript/
interface Props {
  title: string;
  description: string;
  canonicalURL?: URL;
}

const { title, description, canonicalURL } = Astro.props;
---
```

### Anti-Patterns to Avoid
- **Don't use client directives on static content:** Adding `client:load` to non-interactive components wastes bandwidth and slows hydration
- **Don't duplicate meta tags:** Always use BaseLayout, never inline meta tags in pages
- **Don't pass functions as props:** Astro renders to static HTML; functions aren't serializable across the server/client boundary
- **Don't access browser APIs in frontmatter:** `window`, `document`, `localStorage` don't exist during SSG

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SEO meta tags management | Manual meta tags per page | BaseLayout.astro with Props | Canonical URL generation, OpenGraph consistency, site-wide updates |
| Dark mode toggle | Custom theme switcher | Tailwind `dark:` classes + inline script | Prevents FOUC, localStorage sync, SSR-safe |
| Visual regression testing | Manual screenshot comparison | Playwright `toHaveScreenshot()` | Built-in diff algorithm, CI integration, baseline management |
| Props validation | Manual type checks | TypeScript Props interface | Compile-time safety, VS Code autocomplete, documentation |
| Page routing | Manual route config | File-based routing | Automatic URL generation, no boilerplate, convention over configuration |

**Key insight:** Astro's file-based routing and built-in meta tag support eliminate 90% of configuration code required in React SPAs. Migration is mostly about removing complexity, not adding it.

## Common Pitfalls

### Pitfall 1: Forgetting to Remove React-Specific Code
**What goes wrong:** Build fails with "useState is not defined" or hydration errors
**Why it happens:** Developers copy-paste React components without converting to Astro syntax
**How to avoid:**
- Remove all React imports (`useState`, `useEffect`, `useRef`) from static pages
- Remove `export default function` wrapper
- Move logic to frontmatter between `---` delimiters
- Only keep React for interactive components (future phases)

**Warning signs:**
- Import statements from 'react' in .astro files
- Function component wrappers in template section
- JSX syntax issues (className still used)

### Pitfall 2: Incorrect Navigation Links
**What goes wrong:** Links break after migration, 404 errors, or full page reloads instead of client-side navigation
**Why it happens:** File paths don't match expected URLs, or React Router links not converted
**How to avoid:**
- Astro file-based routing: `src/pages/privacy.astro` → `/privacy` (no .html extension)
- Convert `<Link to="/privacy-policy">` to `<a href="/privacy">`
- Test all navigation links in dev server before build
- Use Astro.site for absolute URLs: `new URL('/privacy', Astro.site)`

**Warning signs:**
- URLs with `.html` extensions in production
- React Router imports still present
- Console errors about router context

### Pitfall 3: Dark Mode Classes Not Working
**What goes wrong:** `dark:` Tailwind classes have no effect, theme toggle doesn't work
**Why it happens:** Tailwind default strategy is 'media' (system preference), not 'class'
**How to avoid:**
- Add `darkMode: 'class'` to tailwind.config.js if implementing theme toggle
- Current project uses `dark:` classes but no toggle mechanism yet
- If adding toggle in future: use inline script in BaseLayout to prevent FOUC

**Warning signs:**
- Dark mode only works with system preference
- Flash of incorrect theme on page load
- Theme doesn't persist across page navigation

### Pitfall 4: SEO Meta Tags Not Appearing in Source
**What goes wrong:** Browser view source shows missing or incorrect meta tags
**Why it happens:** Forgetting to pass props to BaseLayout, or typos in prop names
**How to avoid:**
- Always pass title and description props: `<BaseLayout title={...} description={...}>`
- Verify meta tags in view source (Ctrl+U), not just DevTools
- Test canonical URL points to correct deployed domain
- Use astro.config.mjs `site` setting for correct canonical generation

**Warning signs:**
- Empty `<title>` tag in source
- Canonical URL pointing to localhost
- Missing OpenGraph tags

### Pitfall 5: Build Works Locally, Fails in Production
**What goes wrong:** Dev server works fine, but Cloudflare Pages build fails
**Why it happens:** Case-sensitive imports, missing dependencies, Node version mismatches
**How to avoid:**
- Match import statement case to actual file names (Windows is forgiving, Linux is not)
- Pin Node.js version in `.nvmrc` or Cloudflare settings
- Test production build locally: `pnpm build && pnpm preview`
- Check for browser-only APIs in frontmatter (SSG can't access `window`)

**Warning signs:**
- Import errors mentioning case sensitivity
- "Module not found" in CI but not locally
- "window is not defined" during build

### Pitfall 6: Visual Regression Tests Too Strict
**What goes wrong:** Tests fail on irrelevant pixel differences (fonts, animations, timestamps)
**Why it happens:** Default Playwright screenshot comparison is zero-tolerance
**How to avoid:**
- Set reasonable thresholds: `maxDiffPixelRatio: 0.01` (1% tolerance)
- Disable animations before screenshots: inject CSS to set durations to 0s
- Mask dynamic content: `mask: [page.locator('.timestamp')]`
- Wait for fonts: `await page.evaluate(() => document.fonts.ready)`
- Lock viewport: `viewport: { width: 1280, height: 720 }`

**Warning signs:**
- Tests fail with "Screenshots differ by 2 pixels"
- Inconsistent results between test runs
- Anti-aliasing differences flagged as failures

## Code Examples

Verified patterns from official sources:

### Converting Privacy Policy Component

**Before (React):**
```tsx
// Source: src/PrivacyPolicy.tsx
export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Privacy Policy
      </h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Effective as of 2024-12-28
        </p>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information Collection</h2>
          <p>The Application collects information...</p>
        </section>
      </div>
    </div>
  );
}
```

**After (Astro):**
```astro
---
// Source: Astro migration pattern
import BaseLayout from '../layouts/BaseLayout.astro';

const title = "Privacy Policy";
const description = "Privacy policy for NomadCrew mobile app covering data collection, usage, and your rights.";
const effectiveDate = "2024-12-28";
---

<BaseLayout title={title} description={description}>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
      Privacy Policy
    </h1>

    <div class="prose prose-lg dark:prose-invert max-w-none">
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-8">
        Effective as of {effectiveDate}
      </p>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Information Collection and Use</h2>
        <p>The Application collects information when you download and use it. This information may include:</p>
        <ul class="list-disc pl-6 mb-4">
          <li>Your device's Internet Protocol address (e.g. IP address)</li>
          <li>The pages of the Application that you visit, the time and date of your visit, the time spent on those pages</li>
          <li>The time spent on the Application</li>
          <li>The operating system you use on your mobile device</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Third Party Services</h2>
        <p>The Application uses third-party services that have their own Privacy Policies:</p>
        <ul class="list-disc pl-6 mb-4">
          <li><a href="https://www.google.com/policies/privacy/" class="text-orange-600 hover:text-orange-800">Google Play Services</a></li>
          <li><a href="https://expo.io/privacy" class="text-orange-600 hover:text-orange-800">Expo</a></li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>If you have any questions regarding privacy while using the Application, please contact the Service Provider via email at:</p>
        <a href="mailto:nomadcrew5@gmail.com" class="text-orange-600 hover:text-orange-800">nomadcrew5@gmail.com</a>
      </section>

      <footer class="text-sm text-gray-600 dark:text-gray-400 mt-12 pt-8 border-t">
        <p>Generated by <a href="https://app-privacy-policy-generator.nisrulz.com/" class="text-orange-600 hover:text-orange-800">App Privacy Policy Generator</a></p>
      </footer>
    </div>
  </div>
</BaseLayout>
```

### Updating Footer Navigation

**Before (React Router):**
```tsx
// Source: src/Footer.tsx
import { Link } from 'react-router-dom';

<Link to="/privacy-policy" className="text-base text-gray-500 hover:text-orange-600">
  Privacy Policy
</Link>
```

**After (Astro compatible):**
```tsx
// Keep in React component for now, will be migrated in Phase 4
<a href="/privacy" className="text-base text-gray-500 hover:text-orange-600">
  Privacy Policy
</a>
```

### Playwright Visual Regression Test

```typescript
// Source: https://docs.playwright.dev/
// tests/privacy.spec.ts
import { test, expect } from '@playwright/test';

test('privacy policy renders correctly', async ({ page }) => {
  // Navigate to page
  await page.goto('http://localhost:4321/privacy');

  // Wait for fonts and stable state
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);

  // Disable animations for consistent screenshots
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }`
  });

  // Compare full page screenshot
  await expect(page).toHaveScreenshot('privacy-page.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01, // 1% tolerance
  });
});

test('privacy meta tags are correct', async ({ page }) => {
  await page.goto('http://localhost:4321/privacy');

  // Verify title
  await expect(page).toHaveTitle(/Privacy Policy.*NomadCrew/);

  // Verify meta tags
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toContain('Privacy policy for NomadCrew');

  // Verify canonical URL
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBe('https://nomadcrew.uk/privacy');
});
```

### Verifying Build Output

```bash
# Build for production
pnpm build

# Check dist directory structure
ls dist/
# Should show: privacy/index.html

# Preview production build
pnpm preview

# Verify in browser
# http://localhost:4321/privacy

# View source (Ctrl+U) and verify:
# - <title>Privacy Policy | NomadCrew</title>
# - <meta name="description" content="...">
# - <link rel="canonical" href="https://nomadcrew.uk/privacy">
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Router SPAs | File-based routing with Astro | 2024-2025 | 68% faster FCP, 73% smaller bundles |
| Client-side rendering | Static generation (SSG) | Astro 5.0+ | Perfect Lighthouse scores, instant page loads |
| Manual meta tag management | Layout components with Props | Astro patterns | Consistent SEO, no duplication |
| Tailwind @tailwindcss/typography | Tailwind v4 with @tailwindcss/vite | Tailwind v4 (2024) | Faster builds, simpler config |
| Manual screenshot diffs | Playwright toHaveScreenshot() | Playwright 1.22+ | Built-in visual testing, CI-friendly |

**Deprecated/outdated:**
- `@astrojs/tailwind` integration: Replaced by `@tailwindcss/vite` plugin for Tailwind v4
- `.html` file extensions in URLs: Astro removes by default, use `/privacy` not `/privacy.html`
- `renderers` array in astro.config.mjs: Replaced by `integrations` array in Astro 2.0+

## Open Questions

Things that couldn't be fully resolved:

1. **Dark mode strategy**
   - What we know: Project has `dark:` classes in existing React components, but no toggle mechanism
   - What's unclear: Should Phase 3 implement dark mode toggle, or defer to later phase?
   - Recommendation: Keep existing dark classes, defer toggle implementation to Phase 4 (Navigation). Migration should preserve appearance parity, not add features.

2. **Visual regression baseline source**
   - What we know: Success criteria requires "visual regression test passes"
   - What's unclear: Should baseline be React version, or first Astro render?
   - Recommendation: Manually verify first Astro render matches React in dev server, then use that as baseline. Purpose is catching future regressions, not comparing to React.

3. **Footer component migration timing**
   - What we know: Footer has navigation links that need URL updates
   - What's unclear: Should Footer be migrated to Astro in Phase 3, or stay React?
   - Recommendation: Update URLs only (`/privacy-policy` → `/privacy`), defer full Footer migration to Phase 4 when navigation patterns are established.

## Sources

### Primary (HIGH confidence)
- [Astro Docs: Migrating from Create React App](https://docs.astro.build/en/guides/migrate-to-astro/from-create-react-app/) - Component conversion patterns
- [Astro Docs: Pages](https://docs.astro.build/en/basics/astro-pages/) - File-based routing and page structure
- [Astro Docs: Framework Components](https://docs.astro.build/en/guides/framework-components/) - React integration and client directives
- [Astro Docs: Routing](https://docs.astro.build/en/guides/routing/) - URL structure and navigation
- [Astro Docs: TypeScript](https://docs.astro.build/en/guides/typescript/) - Props interface patterns
- [Astro Docs: Styling](https://docs.astro.build/en/guides/styling/) - CSS and Tailwind integration
- [Playwright Documentation: Visual Testing](https://playwright.dev/docs/test-snapshots) - Screenshot comparison API

### Secondary (MEDIUM confidence)
- [Astro Islands Architecture Explained](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide) - When to use client directives
- [Complete Guide to Astro SEO Optimization](https://astrojs.dev/articles/astro-seo-optimization/) - Meta tags and canonical URLs
- [Astro + Tailwind v4 Setup: 2026 Quick Guide](https://tailkits.com/blog/astro-tailwind-setup/) - Latest Tailwind integration
- [Playwright visual testing: a complete guide](https://testdino.com/blog/playwright-visual-testing/) - Setup and configuration
- [Astro Build Failing? Troubleshoot These 7 Common Causes](https://eastondev.com/blog/en/posts/dev/20251203-astro-build-failures-guide/) - Common issues and solutions

### Tertiary (LOW confidence - marked for validation)
- WebSearch results for dark mode patterns - Multiple sources agree on class strategy + inline script pattern
- Community blog posts on migration - Patterns verified against official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified with package.json, official docs, and existing project state
- Architecture: HIGH - Patterns from official Astro documentation and migration guides
- Pitfalls: HIGH - Combination of official troubleshooting docs and real-world migration issues
- Code examples: HIGH - Adapted from official docs and existing project structure
- Visual testing: MEDIUM - Playwright patterns verified, but not yet implemented in project

**Research date:** 2026-01-29
**Valid until:** ~60 days (Astro stable, React migration patterns mature)
**Re-research if:** Astro 6.0 released, major Playwright API changes, or Tailwind v5 announced
