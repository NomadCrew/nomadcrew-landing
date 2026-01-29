# Phase 1: Foundation Setup - Research

**Researched:** 2026-01-29
**Domain:** Astro 5.x project initialization and configuration
**Confidence:** HIGH

## Summary

Phase 1 establishes the Astro 5.x development environment alongside the existing React/Vite setup, enabling a safe, incremental migration path. The foundation includes TypeScript configuration compatible with both Astro components and React islands, Tailwind CSS using the modern Vite plugin approach, and correct handling of .well-known files for iOS/Android deep linking.

**Key Implementation Pattern:** Astro and React/Vite can coexist during migration. The strategy is to initialize Astro with correct configuration, verify the setup with a test page, and ensure the .well-known files move to the public/ directory before any build process changes. This phase does NOT migrate existing React components - it only establishes the foundation for future phases.

**Primary recommendation:** Use manual Astro installation (not `npm create astro`) to maintain control over the existing project structure. Configure TypeScript to support both Astro and React, use `@tailwindcss/vite` plugin directly (not the deprecated `@astrojs/tailwind` integration), and move .well-known files to public/ as the first migration step.

## Standard Stack

The established packages for Astro 5.x foundation with React islands support:

### Core
| Package | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | `^5.16.16` | Core framework with Content Layer API | Latest stable, Vite 6 built-in, official Cloudflare partnership |
| `@astrojs/react` | `^4.4.2` | React component islands integration | Official integration for React support |
| `@astrojs/check` | `latest` | TypeScript checking for .astro files | Official type-checking tool, required for CI |

### Supporting
| Package | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@tailwindcss/vite` | `^4.0.0` | Tailwind CSS v4 Vite plugin | Required for Tailwind in Astro 5.2+ (replaces deprecated @astrojs/tailwind) |
| `typescript` | `~5.6.2` | TypeScript compiler | Already installed, keep existing version |
| `tailwindcss` | `^3.4.15` | CSS framework | Already installed, keep existing version |

### Already Installed (Keep)
| Package | Version | Status | Notes |
|---------|---------|--------|-------|
| `react` | `^18.3.1` | KEEP | Required for React islands |
| `react-dom` | `^18.3.1` | KEEP | Required for React rendering |
| `framer-motion` | `^11.11.17` | KEEP | Works in React islands without changes |
| `lucide-react` | `^0.460.0` | KEEP | Icon library works in React islands |
| `autoprefixer` | `^10.4.20` | KEEP | Tailwind CSS dependency |
| `postcss` | `^8.4.49` | KEEP | Tailwind CSS dependency |

### To Remove (Later Phases)
| Package | Reason |
|---------|--------|
| `vite` | Astro includes Vite 6 internally |
| `@vitejs/plugin-react` | Replaced by @astrojs/react |
| `react-router-dom` | Replaced by Astro file-based routing |
| `eslint` and plugins | Reconfigure for Astro in later phase |

**Installation:**
```bash
# Install Astro core packages
npm install astro@^5.16.16 @astrojs/react@^4.4.2

# Install development tools
npm install --save-dev @astrojs/check

# Install Tailwind Vite plugin (replaces @astrojs/tailwind)
npm install --save-dev @tailwindcss/vite@^4.0.0
```

## Architecture Patterns

### Recommended Project Structure (After Phase 1)
```
nomadcrew-landing/
├── src/
│   ├── pages/                  # Astro pages (file-based routing)
│   │   └── test.astro         # Test page to verify setup
│   ├── layouts/               # Astro layout components (NEW)
│   │   └── BaseLayout.astro   # Shared layout with SEO meta tags
│   ├── components/            # React components (existing + new islands)
│   │   ├── LandingPage.tsx   # Existing React components (unchanged)
│   │   └── ...               # More React components
│   ├── styles/               # CSS/Tailwind (NEW)
│   │   └── global.css        # Tailwind CSS imports
│   ├── main.tsx              # React entry point (keep for now)
│   └── App.tsx               # React root (keep for now)
├── public/                    # Static assets served at /
│   └── .well-known/          # Deep linking files (MOVED HERE)
│       ├── assetlinks.json
│       └── apple-app-site-association
├── astro.config.mjs          # Astro configuration (NEW)
├── tsconfig.json             # Updated for Astro + React
├── tailwind.config.js        # Updated content paths
├── vite.config.ts            # Keep for now (used by Vite dev server)
└── package.json              # Updated scripts
```

### Pattern 1: Coexistence Strategy

**What:** Run Astro and React/Vite side-by-side during migration.

**When to use:** Phase 1 through Phase 3, until all pages migrated to Astro.

**How it works:**
1. Astro dev server runs on port 4321 (default)
2. Existing React app remains functional via Vite dev server
3. Developers can test Astro pages without breaking current functionality
4. Package.json scripts switch between Astro and Vite as needed

**Example:**
```json
// package.json
{
  "scripts": {
    "dev": "astro dev",           // NEW: Astro dev server (port 4321)
    "dev:vite": "vite",           // Keep existing Vite dev server
    "build": "astro build",       // NEW: Astro build
    "build:vite": "tsc -b && vite build && cp -r .well-known dist/", // Keep old build
    "preview": "astro preview",   // NEW: Preview Astro build
    "check": "astro check"        // NEW: TypeScript checking
  }
}
```

**Benefits:**
- Zero downtime during migration
- Can validate Astro setup independently
- Rollback possible at any stage
- Team can learn Astro gradually

### Pattern 2: BaseLayout for SEO Meta Tags

**What:** Shared Astro layout component that wraps pages with consistent SEO metadata.

**When to use:** Every Astro page needs SEO tags (title, description, Open Graph, etc.).

**Example:**
```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description: string;
  ogImage?: string;
}

const {
  title,
  description,
  ogImage = 'https://nomadcrew.com/og-image.jpg'
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Usage in pages:**
```astro
---
// src/pages/test.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Test Page"
  description="Testing Astro setup"
>
  <h1>Astro is working!</h1>
</BaseLayout>
```

**Source:** [Astro Layouts Documentation](https://docs.astro.build/en/basics/layouts/)

### Pattern 3: TypeScript Configuration for Astro + React

**What:** tsconfig.json that supports both Astro components (.astro) and React components (.tsx).

**When to use:** Phase 1 initialization, before any component migration.

**Example:**
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Key points:**
- `extends: "astro/tsconfigs/strict"` provides Astro base configuration
- `jsx: "react-jsx"` enables React JSX syntax
- `jsxImportSource: "react"` tells TypeScript to use React for JSX
- `paths` enables @/ import alias (optional but recommended)

**Verification:**
```bash
npm run check
# Should complete without errors
```

**Source:** [Astro TypeScript Guide](https://docs.astro.build/en/guides/typescript/)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SEO meta tags | Manual meta tag management per page | BaseLayout with props or astro-seo package | Prevents missing tags, ensures consistency, handles Open Graph/Twitter Card complexity |
| TypeScript checking for .astro files | VSCode extension alone | @astrojs/check + npm script | CI/CD needs command-line checking, VSCode extensions don't fail builds |
| Tailwind CSS integration | Custom PostCSS config | @tailwindcss/vite plugin | Official Tailwind v4 plugin, replaces deprecated @astrojs/tailwind |
| Project initialization | Manual file creation | npm create astro (with caution) | BUT for this migration, manual setup is better to preserve existing structure |

**Key insight:** Astro's ecosystem is mature with official integrations. Don't create custom solutions for problems the Astro team already solved.

## Common Pitfalls

### Pitfall 1: .well-known Files Lost During Build

**What goes wrong:** The .well-known/ directory with iOS/Android deep linking files doesn't appear in build output, breaking mobile app deep links.

**Why it happens:**
- Current setup: Files in root, manually copied via `cp -r .well-known dist/`
- Astro behavior: Only copies files from public/ directory automatically
- Hidden directories (starting with `.`) easy to forget

**How to avoid:**
1. **BEFORE installing Astro:** Move .well-known to public/
   ```bash
   mkdir -p public
   mv .well-known public/.well-known
   ```
2. Verify structure: `public/.well-known/assetlinks.json` exists
3. After Astro build: Verify `dist/.well-known/assetlinks.json` exists
4. Remove manual copy from build script (Astro handles it)

**Warning signs:**
- Build output missing .well-known directory
- Mobile app deep linking fails after deployment
- 404 errors for `/.well-known/assetlinks.json`

**Source:** [Astro Project Structure - Public Directory](https://docs.astro.build/en/basics/project-structure/)

### Pitfall 2: TypeScript Config Conflicts Between Vite and Astro

**What goes wrong:** Existing Vite tsconfig.json conflicts with Astro's TypeScript requirements, causing build errors or missing type checking.

**Why it happens:**
- Current setup: tsconfig.json with references to tsconfig.app.json and tsconfig.node.json
- Astro expects: Single tsconfig.json extending astro/tsconfigs base
- Module resolution differs: Vite uses "Bundler", Astro uses its own

**How to avoid:**
1. Run `astro check` after installation to verify TypeScript setup
2. Update tsconfig.json to extend Astro base while keeping React support:
   ```json
   {
     "extends": "astro/tsconfigs/strict",
     "compilerOptions": {
       "jsx": "react-jsx",
       "jsxImportSource": "react"
     }
   }
   ```
3. Keep tsconfig.app.json and tsconfig.node.json for Vite during coexistence
4. Add `/// <reference types="astro/client" />` to src/env.d.ts

**Warning signs:**
- Import errors for .astro files
- "Cannot find module 'astro/client'" errors
- TypeScript errors in VSCode but build succeeds
- `astro check` fails with module resolution errors

**Source:** [Astro TypeScript Configuration](https://docs.astro.build/en/guides/typescript/)

### Pitfall 3: Using Deprecated @astrojs/tailwind Integration

**What goes wrong:** Following old tutorials that use `@astrojs/tailwind` integration, which was deprecated in Astro 5.2 for Tailwind v4 projects.

**Why it happens:**
- Tailwind v4 released December 2024 with official Vite plugin
- Astro 5.2 (January 2025) deprecated old integration
- Many tutorials written before this change
- `npx astro add tailwind` might install old integration

**How to avoid:**
1. **DO NOT** install `@astrojs/tailwind` package
2. **DO** install `@tailwindcss/vite` plugin:
   ```bash
   npm install --save-dev @tailwindcss/vite
   ```
3. Configure in astro.config.mjs:
   ```javascript
   import { defineConfig } from 'astro/config';
   import tailwind from '@tailwindcss/vite';

   export default defineConfig({
     vite: {
       plugins: [tailwind()],
     },
   });
   ```
4. Create `src/styles/global.css`:
   ```css
   @import "tailwindcss";
   ```
5. Import in BaseLayout.astro:
   ```astro
   ---
   import '../styles/global.css';
   ---
   ```

**Warning signs:**
- Package.json shows @astrojs/tailwind dependency
- Deprecation warnings in build output
- Tailwind styles not applying
- Console errors about missing Tailwind config

**Sources:**
- [Astro 5.2 Release Notes](https://astro.build/blog/astro-520/)
- [Install Tailwind CSS with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro)

### Pitfall 4: Tailwind Content Paths Missing .astro Files

**What goes wrong:** Tailwind classes in .astro files don't get processed, resulting in unstyled components even though Tailwind is configured.

**Why it happens:**
- Current tailwind.config.js only includes: `"./src/**/*.{js,ts,jsx,tsx}"`
- Astro components use .astro extension
- Tailwind's JIT compiler doesn't scan .astro files by default

**How to avoid:**
1. Update tailwind.config.js content paths:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx,astro}", // Added .astro
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```
2. Verify Tailwind processes .astro files during build
3. Test with a simple utility class in test page

**Warning signs:**
- Tailwind classes work in .tsx files but not .astro files
- No Tailwind CSS output in browser DevTools
- Build doesn't show errors but styles missing

**Source:** [Astro Tailwind Setup Guide](https://tailkits.com/blog/astro-tailwind-setup/)

### Pitfall 5: npm run dev Expects Vite, Not Astro

**What goes wrong:** After updating package.json scripts to use Astro, developers habitually run `npm run dev` expecting the old Vite server, causing confusion when Astro server starts on port 4321.

**Why it happens:**
- Muscle memory from existing workflow
- Port change from Vite default (5173) to Astro default (4321)
- Different HMR behavior between Vite and Astro

**How to avoid:**
1. Communicate script changes to team BEFORE updating package.json
2. Keep both scripts during coexistence period:
   ```json
   {
     "dev": "astro dev",       // NEW: Primary development
     "dev:vite": "vite",       // OLD: Fallback for React-only testing
     "dev:react": "vite"       // Clearer alias
   }
   ```
3. Update README with new commands
4. Configure Astro to use custom port if needed:
   ```javascript
   // astro.config.mjs
   export default defineConfig({
     server: {
       port: 4321, // Make explicit
       host: true  // Expose to network
     }
   });
   ```

**Warning signs:**
- "Wrong server is running" confusion
- Team members asking about port changes
- Debugging issues because testing wrong server

**Source:** [Astro CLI Commands](https://docs.astro.build/en/reference/cli-reference/)

## Code Examples

Verified patterns from official sources:

### Complete astro.config.mjs (Foundation Phase)

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://nomadcrew.com',

  // Static site generation (not SSR)
  output: 'static',

  // React integration for islands
  integrations: [
    react({
      // Enable React in .mdx files (optional, for future blog)
      include: ['**/react/*', '**/*.tsx'],
    }),
  ],

  // Vite configuration
  vite: {
    plugins: [tailwind()],
  },

  // Dev server configuration
  server: {
    port: 4321,
    host: true, // Expose to network for mobile testing
  },

  // Build configuration
  build: {
    // Output directory (default: dist)
    // Keep default for Cloudflare Pages compatibility
  },
});
```

**Source:** [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/)

### Test Page to Verify Setup

```astro
---
// src/pages/test.astro
import BaseLayout from '../layouts/BaseLayout.astro';

// This runs at build time (server-side)
const buildTime = new Date().toISOString();
---

<BaseLayout
  title="Astro Setup Test"
  description="Verifying Astro 5.x configuration"
>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Astro is Working! 🚀
      </h1>

      <div class="space-y-4 text-gray-700">
        <p class="text-lg">
          If you can see this page with Tailwind styles, the foundation setup is complete.
        </p>

        <div class="bg-green-100 border-l-4 border-green-500 p-4">
          <p class="font-semibold">✓ Astro 5.x initialized</p>
          <p class="font-semibold">✓ TypeScript configured</p>
          <p class="font-semibold">✓ Tailwind CSS working</p>
          <p class="font-semibold">✓ BaseLayout rendering</p>
        </div>

        <p class="text-sm text-gray-500">
          Build time: {buildTime}
        </p>
      </div>

      <div class="mt-8 p-4 bg-gray-100 rounded">
        <h2 class="text-xl font-semibold mb-2">Next Steps:</h2>
        <ol class="list-decimal list-inside space-y-1">
          <li>Verify .well-known files in public/ directory</li>
          <li>Run `npm run check` to verify TypeScript</li>
          <li>Test deep linking files are accessible</li>
          <li>Proceed to Phase 2: React islands migration</li>
        </ol>
      </div>
    </div>
  </main>
</BaseLayout>
```

**How to test:**
1. Run `npm run dev`
2. Navigate to http://localhost:4321/test
3. Verify Tailwind styles render correctly
4. Check browser console for errors
5. Inspect page source to see meta tags from BaseLayout

### Updated package.json Scripts

```json
{
  "name": "nomadcrew-landing",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "dev:vite": "vite",
    "build": "astro build",
    "build:vite": "tsc -b && vite build && cp -r .well-known dist/",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "eslint ."
  }
}
```

**Notes:**
- Keep `dev:vite` and `build:vite` scripts during coexistence
- Remove them in later phases once fully migrated
- `astro build` automatically handles .well-known files from public/

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @astrojs/tailwind integration | @tailwindcss/vite plugin | Astro 5.2 (Jan 2025) | Simpler config, official Tailwind v4 support, better performance |
| npm create astro for new projects | Manual installation for migrations | Best practice | Preserves existing project structure, avoids conflicts |
| Manual meta tag management | BaseLayout or astro-seo package | Since Astro 1.0 | Consistent SEO, prevents missing tags |
| Vite dev server only | Astro dev server with Vite internally | Astro architecture | File-based routing, SSG, better DX for content sites |

**Deprecated/outdated:**
- **@astrojs/tailwind**: Deprecated in Astro 5.2 for Tailwind v4 projects. Use @tailwindcss/vite instead.
- **Multiple tsconfig files**: Astro prefers single tsconfig.json. Keep Vite configs during coexistence only.
- **npm create astro for existing projects**: Better to install packages manually to avoid overwriting existing files.

## Open Questions

Things that couldn't be fully resolved:

1. **React Component Compatibility**
   - What we know: Most React components work as islands without changes
   - What's unclear: Whether existing framer-motion animations need adjustments
   - Recommendation: Test in Phase 2 when migrating first React component

2. **Cloudflare Adapter Configuration**
   - What we know: @astrojs/cloudflare adapter needed for deployment
   - What's unclear: Whether to install in Phase 1 or Phase 2
   - Recommendation: Defer to Phase 2 (Cloudflare integration) to keep Phase 1 focused on local dev setup

3. **ESLint Configuration**
   - What we know: Current ESLint config is Vite/React specific
   - What's unclear: Whether to reconfigure for Astro in Phase 1 or later
   - Recommendation: Defer to later phase, focus on core functionality first

4. **Coexistence Period Duration**
   - What we know: Astro and Vite can run side-by-side
   - What's unclear: How many phases should maintain dual setups
   - Recommendation: Maintain through Phase 3, remove Vite dependencies in Phase 4

## Sources

### Primary (HIGH confidence)
- [Astro Documentation](https://docs.astro.build/) - Official framework documentation
- [Install Astro Guide](https://docs.astro.build/en/install-and-setup/) - Setup instructions
- [Astro TypeScript Guide](https://docs.astro.build/en/guides/typescript/) - TypeScript configuration
- [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/) - File organization patterns
- [Astro Layouts](https://docs.astro.build/en/basics/layouts/) - Layout component patterns
- [Astro CLI Commands](https://docs.astro.build/en/reference/cli-reference/) - Dev server and build commands
- [Install Tailwind CSS with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) - Official Tailwind integration
- [Astro 5.2 Release](https://astro.build/blog/astro-520/) - Tailwind v4 support announcement

### Secondary (MEDIUM confidence)
- [Astro Tailwind Setup 2026](https://tailkits.com/blog/astro-tailwind-setup/) - Modern setup guide
- [Migrating from Create React App](https://docs.astro.build/en/guides/migrate-to-astro/from-create-react-app/) - Migration patterns
- [@astrojs/check npm](https://www.npmjs.com/package/@astrojs/check) - Type checking tool documentation
- [Astro Client Directives](https://dev.to/lovestaco/astros-client-directives-when-and-where-to-use-each-165g) - React islands hydration strategies

### Tertiary (LOW confidence - for future validation)
- React Component Compatibility: No specific issues found, but should test with actual components
- framer-motion in islands: Community reports success, but project-specific testing needed

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages verified via official npm and Astro docs
- Architecture: HIGH - Based on official Astro migration guides and project structure docs
- Pitfalls: HIGH - All from PITFALLS.md research and verified with official docs
- TypeScript config: HIGH - Official Astro TypeScript guide
- Tailwind setup: HIGH - Official Tailwind docs + Astro 5.2 release notes

**Research date:** 2026-01-29
**Valid until:** Approximately 30 days (Astro stable, but fast-moving ecosystem)

**Key constraints from prior research:**
- MIGR-01: Astro 5.16.16 specifically (latest stable)
- MIGR-04: .well-known files MUST work (critical for mobile app)
- Existing Tailwind 3.4.15 preserved (no breaking changes)
- Coexistence required (incremental migration strategy)

**Success criteria alignment:**
1. Developer can run `npm run dev` → Verified via CLI commands research
2. TypeScript compilation works → Verified via @astrojs/check package
3. .well-known files accessible → Verified via public/ directory pattern
4. Test page renders with BaseLayout → Example provided with meta tags
