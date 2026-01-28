# Technology Stack: Astro 5.x Migration

**Project:** NomadCrew Landing Page
**Migration:** React/Vite → Astro 5.x with React Islands
**Researched:** 2026-01-28
**Confidence:** HIGH

## Executive Summary

Migrate from React SPA to Astro 5.x static-first architecture with React islands for interactive components. Use Astro's Content Layer API for blog system, native integrations for SEO, and preserve existing Cloudflare Pages deployment.

**Key Stack Changes:**
- **Framework:** Vite → Astro 5.16.16 (uses Vite 6 internally)
- **Styling:** Keep Tailwind CSS 3.4.15 with new Vite plugin approach
- **Interactive Components:** Convert to React islands with @astrojs/react
- **Content System:** Add Astro Content Collections with glob() loader
- **SEO Infrastructure:** Add @astrojs/sitemap, astro-seo, astro-robots-txt, schema-dts
- **Deployment:** Add @astrojs/cloudflare adapter for Pages deployment

---

## Core Framework

### Astro 5.16.16

| Package | Version | Purpose |
|---------|---------|---------|
| `astro` | `^5.16.16` | Core framework with Content Layer API |
| `@astrojs/react` | `^4.4.2` | React integration for islands |
| `@astrojs/cloudflare` | `^12.6.12` | SSR adapter for Cloudflare Pages |

**Why Astro 5.x:**
- **Content-first architecture:** Built for landing pages and blogs, not web apps
- **Zero JS by default:** Ships only HTML/CSS; hydrates components on-demand
- **Content Layer API (v5.0):** Up to 5x faster Markdown builds, 2x faster MDX
- **Vite 6 under the hood:** Keep existing Vite tooling familiarity
- **Islands architecture:** Selective hydration for interactive components (waitlist form)
- **First-class Cloudflare support:** Astro team joined Cloudflare in Jan 2026, enhanced integration

**Breaking Changes from React/Vite:**
- File-based routing replaces React Router
- `.astro` components for layouts/pages, `.tsx` for interactive islands
- No `index.html` entrypoint; Astro generates HTML from components
- Build output structure changes: `dist/` becomes static site, not SPA

**Installation:**
```bash
npm install astro@^5.16.16 @astrojs/react@^4.4.2 @astrojs/cloudflare@^12.6.12
```

**Configuration Required:**
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://nomadcrew.com',
  output: 'static', // Static site generation (not SSR)
  integrations: [react()],
  adapter: cloudflare({
    mode: 'directory', // For Cloudflare Pages
  }),
});
```

**Sources:**
- [Astro 5.16.16 Release](https://github.com/withastro/astro/releases) (latest stable)
- [Upgrade to Astro v5](https://docs.astro.build/en/guides/upgrade-to/v5/)
- [Astro joins Cloudflare](https://astro.build/blog/joining-cloudflare/)

---

## React Integration (Islands)

### @astrojs/react 4.4.2

**What it does:** Enables React components as "islands" of interactivity in static Astro pages.

**Why use it:**
- Preserve existing React components (waitlist form, animations)
- No rewrite required for Framer Motion animations
- Selective hydration: Only interactive components load JS
- Framework-agnostic: Can mix React with other frameworks if needed

**How it works:**
1. React components render as static HTML server-side by default
2. Add client directives (`client:load`, `client:visible`, etc.) to hydrate
3. Astro bundles React only once, shared across all islands
4. Zero JavaScript shipped for non-interactive components

**Existing Components Migration:**
```tsx
// Current: src/components/WaitlistForm.tsx
// After migration: Same file, import in .astro page

// src/pages/index.astro
---
import WaitlistForm from '../components/WaitlistForm.tsx';
---
<WaitlistForm client:load /> <!-- Hydrates on page load -->
```

**Client Directives:**
- `client:load` - Hydrate immediately on page load (for above-fold)
- `client:idle` - Hydrate when browser idle (for below-fold)
- `client:visible` - Hydrate when component enters viewport
- `client:only="react"` - Skip SSR, render only client-side

**Framer Motion Support:**
- Framer Motion works directly with React islands
- No additional configuration needed beyond `npm install framer-motion`
- Use `client:load` for animated components to avoid layout shift

**Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.3.1", // Keep existing version
    "react-dom": "^18.3.1", // Keep existing version
    "framer-motion": "^11.11.17" // Keep existing version
  }
}
```

**Sources:**
- [@astrojs/react Documentation](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Framer Motion with Astro](https://thevalleyofcode.com/adding-react-framer-motion-animations-to-an-astro-site/)

---

## Styling

### Tailwind CSS with Vite Plugin

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | `^3.4.15` | Keep existing version |
| `@tailwindcss/vite` | `^4.0.0` | Official Vite plugin (NEW) |
| `autoprefixer` | `^10.4.20` | Keep existing |
| `postcss` | `^8.4.49` | Keep existing |

**CRITICAL CHANGE:** Astro 5.2+ deprecated `@astrojs/tailwind` integration. Use Tailwind's native Vite plugin instead.

**Why this changed:**
- Tailwind v4 provides official Vite plugin
- Eliminates Astro-specific middleware layer
- Simpler configuration, better performance
- Direct Tailwind tooling integration

**Migration Path:**
```bash
# REMOVE (if exists)
npm uninstall @astrojs/tailwind

# ADD (Astro 5.2+ does this automatically)
npx astro add tailwind
```

**Configuration:**
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwind()],
  },
});
```

**Existing Tailwind config preserved:**
- `tailwind.config.js` works without changes
- Existing utility classes unchanged
- JIT mode continues working
- Custom theme preserved

**Sources:**
- [Astro 5.2 Tailwind Support](https://astro.build/blog/astro-520/)
- [Tailwind CSS with Astro Guide](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [@astrojs/tailwind Deprecation Notice](https://docs.astro.build/en/guides/integrations-guide/tailwind/)

---

## Content System (Blog)

### Astro Content Collections with Content Layer API

| Package | Version | Purpose |
|---------|---------|---------|
| `@astrojs/mdx` | `^4.3.13` | MDX support for rich blog content |

**No additional packages needed:** Astro 5.x includes Content Collections built-in.

**Why Content Collections:**
- **Type-safe frontmatter:** Zod schemas catch errors at build time
- **Zero-config for Markdown:** Built-in support, no plugins needed
- **5x faster builds:** Content Layer API (Astro 5.0) massively optimized
- **glob() loader:** Load all blog posts from directory automatically
- **MDX support:** Mix Markdown with React components in content

**How it works:**
1. Define collection schema in `src/content.config.ts`
2. Store blog posts in any directory (not limited to `src/content/`)
3. Query with `getCollection()` and `getEntry()` helpers
4. Generate static routes with `getStaticPaths()`

**Configuration:**
```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('NomadCrew Team'),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

**Querying Content:**
```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
const sortedPosts = posts.sort((a, b) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---
```

**Dynamic Routes:**
```astro
---
// src/pages/blog/[slug].astro
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<Content />
```

**MDX Integration:**
```bash
npx astro add mdx
```

Enables React components in Markdown:
```mdx
---
title: "Blog Post with Interactive Components"
---

# Regular Markdown

<WaitlistForm client:visible />

More markdown content...
```

**Zod Version:** Astro 5.x uses Zod v3 internally (re-exported as `astro:content`). No separate installation required.

**Sources:**
- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [Content Collections Complete Guide (2026)](https://inhaq.com/blog/getting-started-with-astro-content-collections/)
- [MDX Integration](https://docs.astro.build/en/guides/integrations-guide/mdx/)

---

## SEO Infrastructure

### Sitemap Generation

| Package | Version | Purpose |
|---------|---------|---------|
| `@astrojs/sitemap` | `^3.6.0` | Auto-generate XML sitemap |

**Why this package:**
- Official Astro integration, maintained by core team
- Automatic discovery of all pages and routes
- Dynamic routes from Content Collections included
- i18n support for multi-language sites
- Zero-config for basic usage

**Installation:**
```bash
npx astro add sitemap
```

**Configuration:**
```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nomadcrew.com', // REQUIRED
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'), // Exclude pages
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
```

**Output:** Generates `sitemap-index.xml` and numbered sitemaps in `dist/`.

**Sources:**
- [@astrojs/sitemap Documentation](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [npm: @astrojs/sitemap](https://www.npmjs.com/package/@astrojs/sitemap)

---

### SEO Meta Tags

| Package | Version | Purpose | Confidence |
|---------|---------|---------|------------|
| `astro-seo` | `^0.8.4` | SEO component with Open Graph, Twitter cards | MEDIUM |

**Why astro-seo:**
- Single component for all SEO tags (title, description, OG, Twitter)
- 1.2k GitHub stars, 34k weekly downloads
- Simplifies meta tag management across pages
- MIT licensed, stable API (v0.8.4 since mid-2024)

**Caveat:** Last updated ~1.5 years ago. Stable but not actively developed.

**Alternative Approach:** Manual meta tags in Astro layouts (no package needed).

**Usage:**
```astro
---
import { SEO } from 'astro-seo';
---
<SEO
  title="NomadCrew - Co-working spaces for digital nomads"
  description="Find and book co-working spaces worldwide"
  canonical="https://nomadcrew.com"
  openGraph={{
    basic: {
      title: "NomadCrew",
      type: "website",
      image: "https://nomadcrew.com/og-image.jpg",
    }
  }}
  twitter={{
    card: "summary_large_image",
  }}
/>
```

**Installation:**
```bash
npm install astro-seo
```

**Sources:**
- [GitHub: jonasmerlin/astro-seo](https://github.com/jonasmerlin/astro-seo)
- [npm: astro-seo](https://www.npmjs.com/package/astro-seo)

---

### Robots.txt

| Package | Version | Purpose |
|---------|---------|---------|
| `astro-robots-txt` | `^1.0.0` | Auto-generate robots.txt |

**Why this package:**
- Most popular (19.8k weekly downloads)
- Zero-config setup
- Supports custom rules and policies
- Maintained by alextim (Astro community member)

**Installation:**
```bash
npm install --save-dev astro-robots-txt
```

**Configuration:**
```js
// astro.config.mjs
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://nomadcrew.com', // REQUIRED
  integrations: [
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/api'],
        },
      ],
      sitemap: true, // Auto-link sitemap
    }),
  ],
});
```

**Output:** Generates `robots.txt` in `dist/`.

**Sources:**
- [npm: astro-robots-txt](https://www.npmjs.com/package/astro-robots-txt)
- [GitHub: alextim/astro-lib](https://github.com/alextim/astro-lib)

---

### JSON-LD Structured Data

| Package | Version | Purpose | Confidence |
|---------|---------|---------|------------|
| `schema-dts` | `^1.1.5` | TypeScript types for Schema.org | MEDIUM |

**Why schema-dts:**
- Google-maintained TypeScript definitions for Schema.org
- Type-safe JSON-LD creation
- Prevents invalid structured data
- Used widely in Astro community

**Caveat:** Last updated ~10 months ago (March 2025). Stable but slow release cadence.

**Alternative Approach:** Manual JSON-LD without types (zero dependencies).

**Usage:**
```astro
---
import type { BlogPosting, WithContext } from 'schema-dts';

const structuredData: WithContext<BlogPosting> = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Blog Post Title',
  author: {
    '@type': 'Person',
    name: 'Author Name',
  },
  datePublished: '2026-01-28',
};
---
<script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
```

**Installation:**
```bash
npm install --save-dev schema-dts
```

**Sources:**
- [npm: schema-dts](https://www.npmjs.com/package/schema-dts)
- [Adding JSON-LD in Astro](https://johndalesandro.com/blog/astro-add-json-ld-structured-data-to-your-website-for-rich-search-results/)
- [Structured Data in Astro](https://stephen-lunt.dev/blog/astro-structured-data/)

---

## Deployment

### Cloudflare Pages Adapter

| Package | Version | Purpose |
|---------|---------|---------|
| `@astrojs/cloudflare` | `^12.6.12` | Cloudflare Pages deployment adapter |

**Why this adapter:**
- **Astro + Cloudflare partnership:** Astro team joined Cloudflare Jan 2026
- **Enhanced integration:** First-class support for Cloudflare Workers/Pages
- **Static mode optimized:** Perfect for static sites (not using SSR features)
- **_routes.json generation:** Automatic routing configuration

**Deployment Mode:** Use `mode: 'directory'` for Cloudflare Pages (static site).

**Configuration:**
```js
// astro.config.mjs
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static', // Static site generation
  adapter: cloudflare({
    mode: 'directory',
  }),
});
```

**Cloudflare Pages Setup:**
- **Build command:** `npm run build`
- **Build output directory:** `dist/`
- **Node version:** 18+
- **Environment variables:** Set in Cloudflare dashboard

**GitHub Actions CI/CD:**
Cloudflare Pages integrates directly with GitHub (no custom Actions needed):
1. Connect repository in Cloudflare dashboard
2. Set build settings (command, output directory)
3. Auto-deploy on push to main branch

**Alternative:** Use Cloudflare's CLI (`wrangler`) for manual deploys.

**Sources:**
- [@astrojs/cloudflare Documentation](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Deploy Astro to Cloudflare Pages](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Cloudflare: Deploy Astro Site](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)

---

## Existing Stack (Keep)

### Preserved Dependencies

| Package | Version | Purpose | Keep/Remove |
|---------|---------|---------|-------------|
| `react` | `^18.3.1` | React for islands | KEEP |
| `react-dom` | `^18.3.1` | React DOM renderer | KEEP |
| `framer-motion` | `^11.11.17` | Animations in React islands | KEEP |
| `lucide-react` | `^0.460.0` | Icons in React components | KEEP |
| `tailwindcss` | `^3.4.15` | Styling (via Vite plugin) | KEEP |
| `autoprefixer` | `^10.4.20` | CSS vendor prefixes | KEEP |
| `postcss` | `^8.4.49` | CSS processing | KEEP |
| `typescript` | `~5.6.2` | TypeScript support | KEEP |

### Dependencies to Remove

| Package | Version | Purpose | Why Remove |
|---------|---------|---------|------------|
| `vite` | `^5.4.10` | Bundler | Astro includes Vite 6 |
| `@vitejs/plugin-react` | `^4.3.3` | Vite React plugin | Replaced by @astrojs/react |
| `react-router-dom` | `^7.1.1` | Client-side routing | Astro file-based routing |
| `eslint` | `^9.13.0` | Linting | Consider astro-eslint-parser |
| `eslint-plugin-react-*` | Various | React linting | Consider Astro-specific config |

### Development Dependencies

Astro includes:
- Vite 6 (bundler)
- TypeScript compiler
- HMR (Hot Module Replacement)
- Dev server

**Add for Astro:**
```bash
npm install --save-dev @astrojs/check
```

TypeScript checking for `.astro` files:
```bash
npx astro check
```

---

## Installation Summary

### New Packages to Install

```bash
# Core framework
npm install astro@^5.16.16 @astrojs/react@^4.4.2 @astrojs/cloudflare@^12.6.12

# Content system
npm install @astrojs/mdx@^4.3.13

# SEO infrastructure
npm install @astrojs/sitemap@^3.6.0 astro-seo@^0.8.4
npm install --save-dev astro-robots-txt schema-dts

# Tailwind Vite plugin (Astro 5.2+)
npm install --save-dev @tailwindcss/vite

# Development tools
npm install --save-dev @astrojs/check
```

### Packages to Uninstall

```bash
npm uninstall vite @vitejs/plugin-react react-router-dom
npm uninstall eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh
npm uninstall globals typescript-eslint
```

**Note:** Remove Vite and ESLint packages only after migration is complete and verified.

---

## Configuration Files Changes

### Add: astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nomadcrew.com',
  output: 'static',
  integrations: [
    react(),
    mdx(),
    sitemap(),
    robotsTxt(),
  ],
  adapter: cloudflare({ mode: 'directory' }),
  vite: {
    plugins: [tailwind()],
  },
});
```

### Add: src/content.config.ts

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('NomadCrew Team'),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

### Modify: tsconfig.json

Add Astro types:
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### Remove: vite.config.ts

Astro replaces Vite configuration. Vite-specific options go in `astro.config.mjs` under `vite: {}`.

---

## Anti-Patterns (What NOT to Add)

### DON'T: Use Astro for Client-Heavy Apps

**Avoid:**
- Complex client-side state management (Zustand, Redux)
- Client-side routing beyond Astro's built-in
- Full-page React/SPA approach

**Why:** Astro is content-first. For web apps, stick with React/Next.js.

**NomadCrew Context:** Landing page + blog = perfect Astro use case. Waitlist form is the only interactive component.

---

### DON'T: Install Markdown Plugins Separately

**Avoid:**
```bash
npm install remark-gfm rehype-autolink-headings
```

**Why:** Astro includes common plugins. Only add if you need specific features.

**Do instead:** Check Astro's built-in Markdown features first.

---

### DON'T: Mix Client-Side Data Fetching

**Avoid:**
```tsx
// Don't: Client-side fetch in islands
function BlogList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(setPosts);
  }, []);
}
```

**Why:** Defeats static generation benefits. Adds loading states, CORS complexity.

**Do instead:**
```astro
---
// Build-time data fetching
const posts = await getCollection('blog');
---
```

---

### DON'T: Add CMS Until Validated

**Avoid:** Installing Contentful, Sanity, Strapi, etc. prematurely.

**Why:** Content Collections with Markdown/MDX is simpler, zero cost, Git-based. Add CMS only when non-technical editors need UI.

**NomadCrew Context:** Start with Markdown files. Add CMS in Phase 3 if needed.

---

### DON'T: Over-Hydrate Components

**Avoid:**
```astro
<Header client:load />
<Footer client:load />
<Sidebar client:load />
```

**Why:** Ships unnecessary JavaScript. Most layout components can be static Astro components.

**Do instead:** Use `.astro` for static layouts, React only for interactive widgets.

---

## Confidence Assessment

| Area | Level | Notes |
|------|-------|-------|
| Core Framework (Astro) | HIGH | Official docs, latest version verified (5.16.16) |
| React Integration | HIGH | Official integration, well-documented |
| Content Collections | HIGH | Official feature, Content Layer API in v5.0 |
| Sitemap/Cloudflare | HIGH | Official integrations, actively maintained |
| SEO Packages (astro-seo) | MEDIUM | Stable but not recently updated (0.8.4 from mid-2024) |
| schema-dts | MEDIUM | Google-maintained but slow updates (1.1.5 from Mar 2025) |
| Tailwind Vite Plugin | HIGH | Official Tailwind tooling, documented in Astro 5.2 |
| robots.txt Package | HIGH | Community package, 19.8k weekly downloads |

---

## Migration Risks

### Risk 1: React Component Compatibility

**Issue:** Some React patterns may not work in islands (Context, Suspense boundaries).

**Mitigation:**
- Test existing React components with `client:load` first
- Most components work without changes
- React Context requires single-root wrapping (documented pattern)

**NomadCrew Context:** Waitlist form is simple controlled component, low risk.

---

### Risk 2: Build Process Changes

**Issue:** CI/CD scripts reference `vite build`.

**Mitigation:**
- Update build command to `astro build`
- Update preview command to `astro preview`
- Cloudflare Pages auto-detects Astro projects

**NomadCrew Context:** Update `package.json` scripts, Cloudflare dashboard build command.

---

### Risk 3: Routing Differences

**Issue:** React Router paths won't work after migration.

**Mitigation:**
- Astro uses file-based routing: `src/pages/about.astro` → `/about`
- Dynamic routes: `src/pages/blog/[slug].astro` → `/blog/:slug`
- Privacy policy: Move to `src/pages/privacy.astro`

**NomadCrew Context:** Simple site structure, minimal routing complexity.

---

## Sources

### Official Documentation (HIGH Confidence)
- [Astro Documentation](https://docs.astro.build/)
- [Upgrade to Astro v5](https://docs.astro.build/en/guides/upgrade-to/v5/)
- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [@astrojs/react Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [@astrojs/sitemap Integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [@astrojs/cloudflare Integration](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Tailwind CSS with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)

### Package Versions (HIGH Confidence)
- [@astrojs/react npm](https://www.npmjs.com/package/@astrojs/react) - v4.4.2
- [@astrojs/sitemap npm](https://www.npmjs.com/package/@astrojs/sitemap) - v3.6.0
- [@astrojs/cloudflare npm](https://www.npmjs.com/package/@astrojs/cloudflare) - v12.6.12
- [@astrojs/mdx npm](https://www.npmjs.com/package/@astrojs/mdx) - v4.3.13
- [Astro Releases](https://github.com/withastro/astro/releases) - v5.16.16

### Community Resources (MEDIUM Confidence)
- [astro-seo GitHub](https://github.com/jonasmerlin/astro-seo)
- [astro-robots-txt npm](https://www.npmjs.com/package/astro-robots-txt)
- [schema-dts npm](https://www.npmjs.com/package/schema-dts)
- [Framer Motion with Astro](https://thevalleyofcode.com/adding-react-framer-motion-animations-to-an-astro-site/)
- [Astro Content Collections Complete Guide (2026)](https://inhaq.com/blog/getting-started-with-astro-content-collections/)
- [JSON-LD in Astro](https://johndalesandro.com/blog/astro-add-json-ld-structured-data-to-your-website-for-rich-search-results/)

### Recent News (2026)
- [Astro joins Cloudflare](https://astro.build/blog/joining-cloudflare/)
- [Astro 2025 Year in Review](https://astro.build/blog/year-in-review-2025/)
- [Astro 5.2 Release (Tailwind 4 support)](https://astro.build/blog/astro-520/)
