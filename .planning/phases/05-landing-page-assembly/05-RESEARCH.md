# Phase 5: Landing Page Assembly - Research

**Researched:** 2026-01-31
**Domain:** Astro 5.x page composition, SEO metadata, structured data
**Confidence:** HIGH

## Summary

Landing page assembly in Astro 5.x involves composing static `.astro` pages that orchestrate React islands with appropriate hydration directives. The existing test-all-islands.astro page provides a proven pattern with 6 passing Playwright tests.

Open Graph and Twitter Card meta tags follow established patterns already present in BaseLayout.astro. JSON-LD structured data requires adding `<script type="application/ld+json">` blocks to the page head using Astro's `set:html` directive. The <150KB bundle size target is achievable—Framer Motion adds ~34KB minimum, React runtime adds ~30KB, leaving headroom for other dependencies.

**Primary recommendation:** Replace index.astro content with test-all-islands.astro structure, enhance BaseLayout.astro with JSON-LD schemas, and monitor bundle size using rollup-plugin-visualizer.

## Standard Stack

The established tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.16.16 | Static site generator | Islands architecture, 68% faster FCP, 73% smaller bundles |
| @astrojs/react | 4.4.2 | React integration | Enables React islands with selective hydration |
| React | 18.3.1 | UI framework | Powers interactive islands |
| Framer Motion | 11.11.17 | Animation library | Already used in extracted islands |
| Tailwind CSS | 4.0.0 | Utility-first CSS | Already integrated, zero runtime cost |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| rollup-plugin-visualizer | Latest | Bundle analysis | Monitor bundle size against 150KB target |
| @astrojs/check | 0.9.4 | Type checking | Validate Astro/React prop types |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Framer Motion | CSS animations | 34KB savings but requires rewriting all islands |
| Framer Motion | Preact with motion | ~31KB savings (React 30KB → Preact 3KB) but requires migration |
| Full schemas | Minimal schemas | Less SEO benefit, simpler implementation |

**Installation:**
```bash
npm install rollup-plugin-visualizer --save-dev
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── pages/
│   ├── index.astro           # Landing page (replace current)
│   ├── privacy.astro          # Existing static page
│   └── test-*.astro           # Test pages (keep for verification)
├── components/
│   ├── react/                 # Hydrated React islands
│   │   ├── Navbar.tsx         # client:load
│   │   ├── HeroSection.tsx    # client:idle
│   │   ├── FeatureCard.tsx    # client:visible
│   │   └── WaitlistForm.tsx   # client:visible
│   └── Footer.astro           # Static component (zero JS)
├── layouts/
│   └── BaseLayout.astro       # Enhanced with JSON-LD
└── styles/
    └── global.css
```

### Pattern 1: Page Composition with Islands
**What:** Astro .astro pages orchestrate multiple framework components with appropriate hydration directives
**When to use:** All pages with interactive elements
**Example:**
```astro
---
// Source: test-all-islands.astro (verified working)
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/react/Navbar.tsx';
import HeroSection from '../components/react/HeroSection.tsx';
import FeatureCard from '../components/react/FeatureCard.tsx';
import WaitlistForm from '../components/react/WaitlistForm.tsx';
import Footer from '../components/Footer.astro';
---

<BaseLayout title="Page Title" description="Page description">
  <!-- Critical navigation: immediate hydration -->
  <Navbar client:load />

  <!-- Hero animations: defer until browser idle -->
  <HeroSection client:idle />

  <!-- Below-fold features: hydrate when visible -->
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard client:visible icon="ClipboardList" title="..." description="..." />
        <FeatureCard client:visible icon="MessagesSquare" title="..." description="..." />
      </div>
    </div>
  </section>

  <!-- Waitlist form: hydrate when scrolled into view -->
  <section id="waitlist">
    <WaitlistForm client:visible />
  </section>

  <!-- Footer: static, no JS -->
  <Footer />
</BaseLayout>
```

### Pattern 2: JSON-LD in Layout Head
**What:** Structured data added to HTML head using script tags with set:html directive
**When to use:** Organization schema (homepage), WebSite schema (homepage)
**Example:**
```astro
---
// Source: https://w3c.github.io/json-ld-bp/ and https://schema.org/Organization
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  includeSchemas?: boolean; // Only true for homepage
}

const { title, description, ogImage = 'https://nomadcrew.uk/og-image.jpg', includeSchemas = false } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NomadCrew",
  "url": "https://nomadcrew.uk",
  "logo": "https://nomadcrew.uk/logo.png",
  "description": "The ultimate platform for digital nomads and remote workers",
  "foundingDate": "2024",
  "sameAs": [
    "https://twitter.com/nomadcrew",
    "https://linkedin.com/company/nomadcrew"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "hello@nomadcrew.uk"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "NomadCrew",
  "url": "https://nomadcrew.uk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nomadcrew.uk/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO Meta Tags -->
    <title>{title} | NomadCrew</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:site_name" content="NomadCrew" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <!-- JSON-LD Structured Data (homepage only) -->
    {includeSchemas && (
      <>
        <script type="application/ld+json" set:html={JSON.stringify(organizationSchema)} />
        <script type="application/ld+json" set:html={JSON.stringify(websiteSchema)} />
      </>
    )}
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pattern 3: Hydration Directive Selection
**What:** Choose appropriate client:* directive based on component priority and position
**When to use:** Every React island component
**Decision matrix:**
| Position | User Needs It | Directive | Example |
|----------|---------------|-----------|---------|
| Above fold | Immediately | `client:load` | Navbar navigation |
| Above fold | Not critical | `client:idle` | Hero animations |
| Below fold | When visible | `client:visible` | Features, waitlist form |
| Never visible | Never | No directive | Use Astro component |

**Source:** [Astro client directives explained](https://medium.com/@mirko.tomhave/astro-client-directives-explained-b0daac284c0)

### Pattern 4: Bundle Size Monitoring
**What:** Visual analysis of bundle composition to identify bloat
**When to use:** During development and in CI pipeline
**Example:**
```javascript
// astro.config.mjs
// Source: https://docs.astro.build/en/recipes/analyze-bundle-size/
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  vite: {
    plugins: [
      visualizer({
        emitFile: true,
        filename: 'stats.html'
      })
    ]
  }
});
```

After build, check `dist/stats.html` for bundle breakdown.

### Anti-Patterns to Avoid

- **Using client:load everywhere:** Defeats Astro's purpose, loads all JS immediately. Use client:idle or client:visible instead.
- **Mapping large arrays to spawn client islands:** Each island carries framework runtime. Render lists statically, hydrate only sorter/paginator.
- **Wrapping entire layouts in framework components:** Makes whole page a single React island. Use .astro files to orchestrate islands.
- **Passing functions as props:** Functions don't serialize. Use named slots or icon mapping pattern (see Phase 4 FeatureCard).
- **Omitting @context in JSON-LD:** Makes data semantically ambiguous. Always include `"@context": "https://schema.org"`.

**Source:** [Astro Islands Architecture Explained](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Open Graph tags | Custom meta tag logic | BaseLayout.astro pattern | Already implemented, standard props interface |
| JSON-LD schemas | Custom schema builder | Schema.org types with set:html | Official vocabulary, search engine recognized |
| Bundle analysis | Custom webpack stats parser | rollup-plugin-visualizer | Visual HTML report, Rollup integration |
| Twitter Card validation | Manual testing | Twitter Card Validator | Official tool, shows exact preview |
| Rich results testing | Custom schema validator | Google Rich Results Test | Official tool, shows eligibility |
| Social media caching | Wait for cache expiry | Facebook Sharing Debugger "Scrape Again" | Forces immediate re-fetch |

**Key insight:** SEO tooling is mature and standardized. Google and social platforms provide official validators. Use them rather than building custom validation.

## Common Pitfalls

### Pitfall 1: Missing OG Image Dimensions
**What goes wrong:** Social platforms fail to render image preview or use incorrect aspect ratio
**Why it happens:** Platforms have specific dimension requirements (1200x630px standard)
**How to avoid:**
- Use 1200x630px (16:9 aspect ratio) for universal compatibility
- Maximum 5MB file size
- Supported formats: JPG, PNG, WEBP (GIF shows only first frame)
- Test with Facebook Sharing Debugger and Twitter Card Validator
**Warning signs:** Preview shows broken image or wrong crop on social platforms

**Source:** [OG Image Size Guide 2026](https://myogimage.com/blog/og-image-size-meta-tags-complete-guide)

### Pitfall 2: JSON-LD Validation Errors
**What goes wrong:** Google Rich Results Test shows "No structured data found" or validation errors
**Why it happens:** Syntax errors, missing @context, or using string values instead of typed references
**How to avoid:**
- Always include `"@context": "https://schema.org"`
- Always include `"@type"` for all objects
- Use typed properties with `@type: "@id"` for external references
- Remove comments from JSON-LD (not supported by standard)
- Test with Google Rich Results Test before deployment
**Warning signs:** Rich Results Test shows errors or "No items detected"

**Source:** [W3C JSON-LD Best Practices](https://w3c.github.io/json-ld-bp/)

### Pitfall 3: Social Media Cache Staleness
**What goes wrong:** Updated OG tags don't appear on Facebook/Twitter after deployment
**Why it happens:** Platforms cache meta tags aggressively (24-48 hours)
**How to avoid:**
- Use Facebook Sharing Debugger "Scrape Again" button to force refresh
- Test OG tags BEFORE sharing publicly
- Use preview tools during development
**Warning signs:** Old title/description/image appears after tag updates

**Source:** [Facebook Sharing Debugger: How to Fix Link Preview Issues](https://socialrails.com/blog/facebook-sharing-debugger-fix-link-preview)

### Pitfall 4: Bundle Size Creep
**What goes wrong:** JavaScript bundle exceeds 150KB target, hurting performance
**Why it happens:** Each React island includes framework runtime (~30KB) plus Framer Motion (~34KB) plus component code
**How to avoid:**
- Monitor with rollup-plugin-visualizer during development
- Consider CSS animations instead of Framer Motion for simple effects
- Use client:visible aggressively for below-fold content
- Evaluate Preact alternative (~27KB savings) if needed
**Warning signs:** Build output shows >150KB gzipped JS, slow Time to Interactive

**Source:** [Framer Motion Bundle Size Impact](https://bundlephobia.com/package/framer-motion)

### Pitfall 5: SearchAction Without Actual Search
**What goes wrong:** WebSite schema includes SearchAction but /search doesn't exist
**Why it happens:** Copying schema examples without implementation
**How to avoid:**
- Only include SearchAction if search functionality exists
- For Phase 5, omit SearchAction (no search yet)
- Add SearchAction in Phase 7 when blog search is implemented
**Warning signs:** Rich Results Test passes but search links 404

### Pitfall 6: Nested React Islands Communication
**What goes wrong:** Child island can't access parent React context
**Why it happens:** Each island hydrates independently, no shared context
**How to avoid:**
- Keep islands isolated with props-based communication
- For complex state sharing, make it a single large React island
- Use Astro slots for composition, not React context
**Warning signs:** "Context is undefined" errors in child components

**Source:** [React Context in Astro](https://astropatterns.dev/p/react-love/react-context-in-astro)

## Code Examples

Verified patterns from official sources:

### Landing Page Assembly
```astro
---
// src/pages/index.astro
// Pattern verified in test-all-islands.astro with 6 passing Playwright tests
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/react/Navbar.tsx';
import HeroSection from '../components/react/HeroSection.tsx';
import FeatureCard from '../components/react/FeatureCard.tsx';
import WaitlistForm from '../components/react/WaitlistForm.tsx';
import Footer from '../components/Footer.astro';
---

<BaseLayout
  title="Your All-in-One Group Travel App"
  description="Coordinate plans, share locations, manage expenses, and chat in real-time"
  includeSchemas={true}
>
  <Navbar client:load />
  <HeroSection client:idle />

  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          client:visible
          icon="ClipboardList"
          title="Trip Planning & Management"
          description="Plan, manage, and collaborate on group trips with destination search and shared tools."
        />
        <FeatureCard
          client:visible
          icon="MessagesSquare"
          title="Real-time Communication"
          description="Stay connected with group chat, real-time messaging, media sharing, and read receipts."
        />
        <FeatureCard
          client:visible
          icon="LocateFixed"
          title="Location Services"
          description="Share live locations, explore interactive maps, and discover nearby places together."
        />
        <FeatureCard
          client:visible
          icon="Banknote"
          title="Financial Management"
          description="Track expenses effortlessly and split costs fairly among your travel group."
        />
      </div>
    </div>
  </section>

  <section id="waitlist" class="py-16 px-4">
    <div class="container mx-auto max-w-xl text-center">
      <h2 class="text-3xl font-bold mb-6">Join the Waitlist</h2>
      <p class="text-gray-600 mb-8">
        Be among the first to experience a better way to travel together.
        Get early access and exclusive updates.
      </p>
      <WaitlistForm client:visible />
    </div>
  </section>

  <Footer />
</BaseLayout>
```

### Organization Schema (Homepage)
```javascript
// Source: https://schema.org/Organization and https://jsonld.com/organization/
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NomadCrew",
  "url": "https://nomadcrew.uk",
  "logo": {
    "@type": "ImageObject",
    "url": "https://nomadcrew.uk/logo.png",
    "width": 600,
    "height": 60
  },
  "description": "Your all-in-one group travel app. Coordinate plans, share locations, manage expenses, and chat in real-time.",
  "foundingDate": "2024",
  "email": "hello@nomadcrew.uk",
  "sameAs": [
    "https://twitter.com/nomadcrew",
    "https://linkedin.com/company/nomadcrew",
    "https://github.com/nomadcrew"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "hello@nomadcrew.uk"
  }
}
```

### WebSite Schema (Homepage)
```javascript
// Source: https://schema.org/WebSite and https://gist.github.com/warnakey/dc900fd47b288a712936920ec9023dfd
// NOTE: Omit potentialAction in Phase 5 (no search yet). Add in Phase 7 when blog search exists.
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "NomadCrew",
  "url": "https://nomadcrew.uk",
  "description": "Your all-in-one group travel app"
}
```

### Enhanced BaseLayout with Schemas
```astro
---
// src/layouts/BaseLayout.astro
// Enhanced version with JSON-LD support
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  includeSchemas?: boolean;
}

const {
  title,
  description,
  ogImage = 'https://nomadcrew.uk/og-image.jpg',
  includeSchemas = false
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);

// Only defined if includeSchemas is true
const organizationSchema = includeSchemas ? {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NomadCrew",
  "url": "https://nomadcrew.uk",
  "logo": {
    "@type": "ImageObject",
    "url": "https://nomadcrew.uk/logo.png",
    "width": 600,
    "height": 60
  },
  "description": "Your all-in-one group travel app. Coordinate plans, share locations, manage expenses, and chat in real-time.",
  "foundingDate": "2024",
  "email": "hello@nomadcrew.uk",
  "sameAs": [
    "https://twitter.com/nomadcrew",
    "https://linkedin.com/company/nomadcrew",
    "https://github.com/nomadcrew"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "hello@nomadcrew.uk"
  }
} : null;

const websiteSchema = includeSchemas ? {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "NomadCrew",
  "url": "https://nomadcrew.uk",
  "description": "Your all-in-one group travel app"
} : null;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="generator" content={Astro.generator} />

    <!-- SEO Meta Tags -->
    <title>{title} | NomadCrew</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:site_name" content="NomadCrew" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <!-- JSON-LD Structured Data (homepage only) -->
    {organizationSchema && (
      <script type="application/ld+json" set:html={JSON.stringify(organizationSchema)} />
    )}
    {websiteSchema && (
      <script type="application/ld+json" set:html={JSON.stringify(websiteSchema)} />
    )}
  </head>
  <body class="min-h-screen bg-white text-gray-900 antialiased">
    <slot />
  </body>
</html>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Monolithic React SPA | Astro islands architecture | Astro 2.0 (2023) | 68% faster FCP, 73% smaller bundles |
| SSR for all pages | Static generation + selective hydration | Astro 1.0 (2022) | Cloudflare Pages support, zero server cost |
| client:load for all | client:visible/idle for below-fold | Astro 2.0 (2023) | Lazy loading, better INP scores |
| Microdata format | JSON-LD format | Google recommendation (2020) | Cleaner HTML, easier maintenance |
| Twitter-specific API | Open Graph fallback | Twitter 2022 | Fewer meta tags needed (twitter:card only) |
| Google Structured Data Tool | Google Rich Results Test | Tool migration (2021) | Focus on rich result eligibility vs. generic validation |

**Deprecated/outdated:**
- **Google Structured Data Testing Tool**: Replaced by Rich Results Test (2021). Old tool shut down.
- **client:media={QUERY}**: Rarely used, client:visible preferred for responsive components.
- **React.lazy in Astro islands**: Astro handles code splitting automatically, manual lazy loading unnecessary.

## Open Questions

Things that couldn't be fully resolved:

1. **SearchAction Implementation Timeline**
   - What we know: WebSite schema supports SearchAction for site search functionality
   - What's unclear: Whether to include SearchAction stub in Phase 5 or wait for Phase 7 blog search
   - Recommendation: Omit SearchAction in Phase 5. Add in Phase 7 when actual search exists. Google penalizes broken functionality.

2. **Bundle Size with Current Dependencies**
   - What we know: React (~30KB) + Framer Motion (~34KB) = ~64KB minimum
   - What's unclear: Actual bundle size with all islands composed (need build to measure)
   - Recommendation: Add rollup-plugin-visualizer in first task, measure actual size, optimize if >150KB.

3. **OG Image Creation**
   - What we know: Needs 1200x630px image at /og-image.jpg
   - What's unclear: Whether og-image.jpg exists in public/ directory
   - Recommendation: Verify og-image.jpg exists, create if missing (task for planner).

4. **Social Media Profile URLs**
   - What we know: Organization schema should include sameAs URLs
   - What's unclear: Actual Twitter/LinkedIn/GitHub URLs for NomadCrew
   - Recommendation: Use placeholder URLs, update with real URLs when available.

## Sources

### Primary (HIGH confidence)
- [Astro Islands Architecture - Official Docs](https://docs.astro.build/en/concepts/islands/) - Core islands concepts
- [Astro Framework Components - Official Docs](https://docs.astro.build/en/guides/framework-components/) - React integration best practices
- [Astro Bundle Size Analysis - Official Docs](https://docs.astro.build/en/recipes/analyze-bundle-size/) - rollup-plugin-visualizer usage
- [Schema.org Organization](https://schema.org/Organization) - Official schema specification
- [W3C JSON-LD Best Practices](https://w3c.github.io/json-ld-bp/) - Official implementation guidelines
- test-all-islands.astro - Verified working pattern (6 passing Playwright tests)

### Secondary (MEDIUM confidence)
- [Astro Islands Architecture Explained - Strapi](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide) - Best practices and pitfalls
- [Astro Client Directives Explained - Medium](https://medium.com/@mirko.tomhave/astro-client-directives-explained-b0daac284c0) - Performance comparison
- [JSON-LD Organization Example - jsonld.com](https://jsonld.com/organization/) - Implementation patterns
- [WebSite Schema GitHub Gist](https://gist.github.com/warnakey/dc900fd47b288a712936920ec9023dfd) - SearchAction example
- [OG Image Size Guide 2026](https://myogimage.com/blog/og-image-size-meta-tags-complete-guide) - Dimension requirements
- [Facebook Sharing Debugger Guide](https://socialrails.com/blog/facebook-sharing-debugger-fix-link-preview) - Cache clearing
- [Google Rich Results Test - Official](https://search.google.com/test/rich-results) - Validation tool

### Tertiary (LOW confidence)
- [Framer Motion Bundle Size - Bundlephobia](https://bundlephobia.com/package/framer-motion) - Size metrics
- [React Context in Astro](https://astropatterns.dev/p/react-love/react-context-in-astro) - Island isolation patterns
- [Astro Project Structure Best Practices](https://tillitsdone.com/blogs/astro-js-file-organization-guide/) - Organization conventions

## Metadata

**Confidence breakdown:**
- Assembly approach: HIGH - Pattern verified in test-all-islands.astro with Playwright tests
- Open Graph implementation: HIGH - Existing BaseLayout.astro pattern, official spec
- Twitter Cards: HIGH - Official Twitter documentation, fallback to OG tags
- JSON-LD schemas: HIGH - Schema.org and W3C official specifications
- Bundle size optimization: MEDIUM - Theoretical calculation, needs actual build measurement
- Testing approach: HIGH - Official Google/Facebook/Twitter validation tools

**Research date:** 2026-01-31
**Valid until:** 2026-03-02 (30 days - stable ecosystem)

**Key findings:**
1. Proven assembly pattern exists (test-all-islands.astro)
2. Open Graph tags already implemented in BaseLayout.astro
3. JSON-LD requires schema objects + set:html directive
4. Bundle size monitoring requires rollup-plugin-visualizer
5. Official validation tools exist for all SEO requirements
6. 150KB target achievable with current stack (~64KB minimum + headroom)
