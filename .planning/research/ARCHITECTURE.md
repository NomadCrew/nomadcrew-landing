# Architecture Patterns: React to Astro Migration

**Project:** NomadCrew Landing Page Migration
**Domain:** React SPA to Astro 5.x with Cloudflare Pages
**Researched:** 2026-01-28

## Executive Summary

Migrating the NomadCrew landing page from React/Vite SPA to Astro 5.x preserves all existing Cloudflare Pages functionality while introducing a hybrid architecture that renders most content as static HTML with selective client-side React islands for interactivity. The Cloudflare adapter seamlessly converts Astro API endpoints into Cloudflare Functions, eliminating the need for the separate `functions/` directory.

**Key Architectural Shift:** From client-rendered SPA with React Router to file-based routed pages with React component islands hydrated on-demand.

## Recommended Architecture

### High-Level Component Structure

```
Current (React SPA):                     Target (Astro Hybrid):
┌─────────────────────┐                 ┌──────────────────────┐
│   React App (CSR)   │                 │  Astro Pages (SSG)   │
│  ┌───────────────┐  │                 │  ┌────────────────┐  │
│  │ React Router  │  │                 │  │ File-based     │  │
│  │ - /           │  │  ───────>       │  │ Routing        │  │
│  │ - /privacy    │  │                 │  │ - index.astro  │  │
│  └───────────────┘  │                 │  │ - privacy.astro│  │
│  ┌───────────────┐  │                 │  └────────────────┘  │
│  │ Components    │  │                 │  ┌────────────────┐  │
│  │ (All hydrated)│  │                 │  │ React Islands  │  │
│  └───────────────┘  │                 │  │ (Selective)    │  │
│  ┌───────────────┐  │                 │  └────────────────┘  │
│  │ API Calls     │  │                 │  ┌────────────────┐  │
│  │ /api/waitlist │  │                 │  │ API Endpoints  │  │
│  └───────────────┘  │                 │  │ (Astro)        │  │
└─────────────────────┘                 └──────────────────────┘
         │                                        │
         └────────────────┬───────────────────────┘
                          ▼
              ┌────────────────────────┐
              │  Cloudflare Pages      │
              │  + Workers/Functions   │
              │  + KV (env: RESEND_*)  │
              └────────────────────────┘
```

### Component Boundaries

| Component | Current Technology | Target Technology | Responsibility |
|-----------|-------------------|-------------------|----------------|
| **Entry Point** | `main.tsx` (React root) | `src/pages/*.astro` | Page routing and rendering |
| **Routing** | React Router (BrowserRouter) | File-based (`src/pages/`) | URL to page mapping |
| **Landing Page** | `LandingPage.tsx` (React) | `src/pages/index.astro` + React islands | Main page shell (Astro) + interactive components (React) |
| **Privacy Page** | `PrivacyPolicy.tsx` (React) | `src/pages/privacy.astro` | Static content page (pure Astro) |
| **Interactive Components** | React components (all hydrated) | React islands with hydration directives | Navbar, waitlist form, animations |
| **API Endpoint** | `functions/api/waitlist.ts` | `src/pages/api/waitlist.ts` | Waitlist submission handler |
| **Static Assets** | `public/` (Vite) | `public/` (Astro) | `.well-known/` files, unchanged |
| **Build System** | Vite | Vite (via Astro) | Bundling, optimization |
| **Deployment** | Cloudflare Pages | Cloudflare Pages + @astrojs/cloudflare adapter | Edge deployment |

## Integration Points with Cloudflare Pages

### 1. Cloudflare Adapter Configuration

**Current State:** Vite builds static assets, separate `functions/` directory for API endpoints.

**Target State:** Astro with `@astrojs/cloudflare` adapter in "advanced mode" (default).

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'hybrid', // SSG by default, opt-in to SSR per-page
  adapter: cloudflare({
    imageService: 'cloudflare', // Use Cloudflare Image Resizing
    platformProxy: {
      enabled: true // Enable local development runtime emulation
    }
  }),
  integrations: [
    react({
      // Enable experimental React children for better performance
      experimentalReactChildren: true
    })
  ]
});
```

**Key Change:** The adapter converts Astro API endpoints to Cloudflare Functions automatically. The separate `functions/` directory is **no longer needed** in advanced mode.

### 2. Environment Variables & Runtime Access

**Current:** Environment variables accessed via `context.env` in Cloudflare Functions.

**Target:** Same pattern preserved, accessed via `Astro.locals.runtime.env` in pages and `context.locals.runtime.env` in API endpoints.

```typescript
// src/pages/api/waitlist.ts (Astro API endpoint)
export async function POST({ request, locals }) {
  const runtime = locals.runtime;
  const apiKey = runtime.env.RESEND_API_KEY; // Same as current implementation

  // Rest of waitlist logic unchanged
}
```

**Configuration files:**
- `wrangler.jsonc` - Defines KV bindings, environment variables
- `.dev.vars` - Local development secrets

### 3. Static Asset Handling

**Current:** Vite copies `.well-known/` during build via custom npm script.

**Target:** Astro's `public/` directory handles this automatically.

```
.well-known/
├── assetlinks.json
└── apple-app-site-association
```

**No change required.** Files in `public/` are copied as-is to build output and served at the root path.

**Build script simplification:**
```json
// package.json
"build": "astro build" // No manual copy needed
```

### 4. Routing and _routes.json

**How it works:**

The `@astrojs/cloudflare` adapter generates `_routes.json` automatically based on your pages:
- Static pages → Served directly from Cloudflare Pages edge
- API endpoints → Routed to Cloudflare Functions
- SSR pages → Routed to Cloudflare Functions

**For this migration:**
- `/` → Static HTML (pre-rendered)
- `/privacy` → Static HTML (pre-rendered)
- `/api/waitlist` → Cloudflare Function (via Astro endpoint)

**Customization (if needed):**
```typescript
adapter: cloudflare({
  routes: {
    extend: {
      include: ['/api/*'], // Force specific paths to Functions
      exclude: ['/static/*'] // Force specific paths to static serving
    }
  }
})
```

## Data Flow Changes

### Current Flow (React SPA)

```
1. Browser requests /
2. Cloudflare Pages serves index.html + React bundle
3. React hydrates entire app
4. React Router handles /privacy navigation (client-side)
5. User submits form → fetch('/api/waitlist') → Cloudflare Function
```

**Performance characteristics:**
- Large JavaScript bundle (React + React Router + Framer Motion)
- All content requires JavaScript to render
- Time to Interactive (TTI) delayed by hydration

### Target Flow (Astro Hybrid)

```
1. Browser requests /
2. Cloudflare Pages serves pre-rendered HTML
3. HTML visible immediately (FCP < 1s)
4. Selective React islands hydrate (Navbar, WaitlistForm)
5. User clicks privacy → Native browser navigation to /privacy (server-routed)
6. User submits form → fetch('/api/waitlist') → Astro endpoint → Cloudflare Function
```

**Performance characteristics:**
- Smaller JavaScript bundle (only interactive components)
- Content visible without JavaScript
- Faster First Contentful Paint (FCP) and TTI
- SEO-friendly static HTML

## New vs Modified Components

### Components to Create (New)

| File | Purpose | Technology | Notes |
|------|---------|------------|-------|
| `src/pages/index.astro` | Landing page shell | Astro | Wraps React islands, manages layout |
| `src/pages/privacy.astro` | Privacy policy page | Astro | Pure static content, no React needed |
| `src/pages/api/waitlist.ts` | Waitlist API endpoint | Astro endpoint | Replaces `functions/api/waitlist.ts` |
| `src/components/WaitlistForm.tsx` | Waitlist form island | React | Extracted from LandingPage |
| `src/components/Navbar.tsx` | Navigation bar island | React | Extracted from LandingPage |
| `src/components/FeatureCard.tsx` | Feature card island | React | Extracted from LandingPage |
| `src/layouts/BaseLayout.astro` | Base page layout | Astro | Shared layout for pages |
| `astro.config.mjs` | Astro configuration | Config | Defines adapter, integrations |
| `wrangler.jsonc` | Cloudflare runtime config | Config | KV bindings, environment variables |

### Components to Modify

| File | Current | Target | Changes |
|------|---------|--------|---------|
| `package.json` | Vite + React scripts | Astro + React scripts | Update dependencies, build script |
| `tsconfig.json` | React JSX config | Astro + React config | Add `jsx: "react-jsx"`, `jsxImportSource: "react"` |
| `tailwind.config.js` | Include React files | Include Astro + React files | Update `content` paths to include `.astro` |
| `public/.well-known/*` | Manually copied | Automatic | No change, but simplify build script |

### Components to Archive (Optional)

| File | Reason |
|------|--------|
| `src/main.tsx` | No longer needed, Astro handles entry |
| `src/App.tsx` | React Router replaced by file-based routing |
| `src/LandingPage.tsx` | Split into Astro page + React islands |
| `src/PrivacyPolicy.tsx` | Converted to pure Astro page |
| `functions/api/waitlist.ts` | Replaced by Astro API endpoint |
| `vite.config.ts` | Replaced by `astro.config.mjs` |

## Migration Build Order

### Phase 1: Setup Astro with React (Parallel Architecture)

**Goal:** Run Astro alongside existing React app without breaking current functionality.

**Steps:**
1. Install Astro and dependencies
   ```bash
   npm install astro @astrojs/react @astrojs/cloudflare
   ```

2. Create `astro.config.mjs` with React integration

3. Create `src/layouts/BaseLayout.astro` (shared layout)

4. Create test page `src/pages/test.astro` to verify setup

5. Update `package.json` scripts:
   ```json
   {
     "dev": "astro dev",
     "build": "astro build",
     "preview": "astro preview"
   }
   ```

6. Verify local development works with `npm run dev`

**Validation:** Astro dev server runs, test page renders.

### Phase 2: Migrate Privacy Policy (Low-Risk Static Page)

**Goal:** Prove the migration pattern with a simple static page.

**Steps:**
1. Create `src/pages/privacy.astro`

2. Convert `PrivacyPolicy.tsx` JSX to Astro syntax (remove React-specific code)

3. Test locally at `/privacy`

4. Deploy to Cloudflare Pages staging

**Validation:** Privacy page renders correctly, no JavaScript needed.

### Phase 3: Create React Islands for Landing Page

**Goal:** Extract interactive components from monolithic React component.

**Steps:**
1. Create `src/components/Navbar.tsx` (React island)
   - Extract from `LandingPage.tsx`
   - Keep Framer Motion animations
   - Export as standalone component

2. Create `src/components/WaitlistForm.tsx` (React island)
   - Extract form logic and state
   - Keep validation and API call logic
   - Export as standalone component

3. Create `src/components/FeatureCard.tsx` (React island)
   - Extract feature rendering logic
   - Keep Framer Motion animations
   - Export as standalone component

4. Create `src/components/HeroSection.tsx` (React island)
   - Extract hero section
   - Keep Framer Motion animations
   - Export as standalone component

**Validation:** Each component works in isolation with hydration directives.

### Phase 4: Build Landing Page with Islands Architecture

**Goal:** Replace React SPA homepage with Astro page + React islands.

**Steps:**
1. Create `src/pages/index.astro`

2. Import React islands with appropriate hydration directives:
   ```astro
   ---
   import BaseLayout from '../layouts/BaseLayout.astro';
   import Navbar from '../components/Navbar';
   import HeroSection from '../components/HeroSection';
   import FeatureCard from '../components/FeatureCard';
   import WaitlistForm from '../components/WaitlistForm';
   ---

   <BaseLayout title="NomadCrew - Group Travel App">
     <Navbar client:load />
     <HeroSection client:visible />
     <div class="features">
       <FeatureCard client:visible />
     </div>
     <WaitlistForm client:visible />
   </BaseLayout>
   ```

3. Verify all interactive elements work

4. Test bundle size reduction

**Validation:** Landing page renders, interactivity preserved, performance improved.

### Phase 5: Migrate API Endpoint

**Goal:** Replace Cloudflare Function with Astro API endpoint.

**Steps:**
1. Create `src/pages/api/waitlist.ts`

2. Convert function signature:
   ```typescript
   // Old: functions/api/waitlist.ts
   export async function onRequest(context) { ... }

   // New: src/pages/api/waitlist.ts
   export async function POST({ request, locals }) { ... }
   ```

3. Update runtime access:
   ```typescript
   // Old
   const apiKey = context.env.RESEND_API_KEY;

   // New
   const apiKey = locals.runtime.env.RESEND_API_KEY;
   ```

4. Keep CORS headers and error handling logic

5. Test waitlist submission locally and in staging

**Validation:** Waitlist submissions work, emails sent via Resend API.

### Phase 6: Configure Cloudflare Deployment

**Goal:** Deploy fully migrated site to Cloudflare Pages.

**Steps:**
1. Create `wrangler.jsonc`:
   ```json
   {
     "name": "nomadcrew-landing",
     "compatibility_date": "2026-01-01",
     "kv_namespaces": [],
     "vars": {
       "ENVIRONMENT": "production"
     }
   }
   ```

2. Create `.assetsignore` in `public/`:
   ```
   _worker.js
   _routes.json
   ```

3. Set environment secrets in Cloudflare dashboard:
   - `RESEND_API_KEY`

4. Update Cloudflare Pages build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 18+

5. Deploy and verify:
   - `/` renders correctly
   - `/privacy` renders correctly
   - `/api/waitlist` accepts submissions
   - `.well-known/` files accessible

**Validation:** Production deployment works end-to-end.

### Phase 7: Performance Optimization

**Goal:** Fine-tune hydration and bundle splitting.

**Steps:**
1. Optimize hydration directives:
   - `Navbar`: `client:load` (needed immediately)
   - `HeroSection`: `client:idle` (defer until browser idle)
   - `FeatureCard`: `client:visible` (hydrate when scrolled into view)
   - `WaitlistForm`: `client:visible` (defer until user scrolls to form)

2. Analyze bundle size:
   ```bash
   npm run build
   # Review dist/_astro/ bundle sizes
   ```

3. Consider lazy-loading Framer Motion:
   ```typescript
   import { LazyMotion, domAnimation, m } from 'framer-motion';
   ```

4. Verify Core Web Vitals in Cloudflare Analytics

**Validation:** FCP < 1s, TTI < 3s, bundle size reduced by 40%+.

## Patterns to Follow

### Pattern 1: Astro Page with React Islands

**What:** Astro page shell with embedded React components for interactivity.

**When:** Pages with mostly static content and specific interactive areas.

**Example:**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import InteractiveWidget from '../components/InteractiveWidget';
---

<BaseLayout title="Page Title">
  <h1>Static Content</h1>
  <p>This renders as plain HTML, no JavaScript needed.</p>

  <InteractiveWidget client:visible />
</BaseLayout>
```

**Benefits:**
- Minimal JavaScript shipped
- Fast initial render
- SEO-friendly

### Pattern 2: Hydration Directive Selection

**What:** Choosing the right hydration strategy for each component.

**When:** Every React island needs a hydration directive.

**Decision Matrix:**

| Directive | Use Case | Example Component |
|-----------|----------|-------------------|
| `client:load` | Critical interactivity needed immediately | Navbar, authentication |
| `client:idle` | Important but not critical, can wait for browser idle | Hero animations, non-critical widgets |
| `client:visible` | Only needed when scrolled into view | Feature cards below fold, waitlist form |
| `client:media` | Only needed on specific screen sizes | Mobile-only menu, desktop-only features |
| `client:only` | Cannot render server-side (browser APIs required) | Map widgets, WebGL components |

**Example for this project:**
```astro
<Navbar client:load />           {/* User expects instant interactivity */}
<HeroSection client:idle />       {/* Animations can wait */}
<FeatureCard client:visible />    {/* Below fold, defer hydration */}
<WaitlistForm client:visible />   {/* Below fold, defer hydration */}
```

### Pattern 3: Shared State Between Islands

**What:** When multiple React islands need shared state.

**When:** Components on same page need to communicate.

**Solution:** Use nanostores or other lightweight state management.

```typescript
// src/stores/formState.ts
import { atom } from 'nanostores';

export const formVisible = atom(false);
```

```tsx
// Navbar.tsx
import { useStore } from '@nanostores/react';
import { formVisible } from '../stores/formState';

export default function Navbar() {
  const isVisible = useStore(formVisible);
  // ...
}
```

**For this project:** Likely not needed initially, but useful if adding features like "scroll to form" from navbar.

### Pattern 4: API Endpoint Structure

**What:** Astro API endpoints replace Cloudflare Functions.

**When:** Handling API requests like form submissions.

**Example:**
```typescript
// src/pages/api/waitlist.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = locals.runtime;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Handle POST
  try {
    const { email } = await request.json();

    // Access environment variables
    const apiKey = runtime.env.RESEND_API_KEY;

    // Call external API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ /* email data */ })
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
};
```

**Benefits:**
- Type-safe with TypeScript
- Integrates with Astro middleware
- Auto-converts to Cloudflare Functions

## Anti-Patterns to Avoid

### Anti-Pattern 1: Over-Hydration

**What goes wrong:** Using `client:load` for all React components, negating performance benefits.

**Why it happens:** Default to `client:load` without considering alternatives.

**Consequences:**
- Large JavaScript bundle loaded upfront
- Slower Time to Interactive
- Wasted bandwidth for components user may never see

**Prevention:**
- Default to `client:visible` for below-fold content
- Use `client:idle` for non-critical interactivity
- Reserve `client:load` for truly critical components (navbar, authentication)

**Example:**
```astro
<!-- BAD: Everything hydrates immediately -->
<FeatureCard client:load />
<WaitlistForm client:load />
<Footer client:load />

<!-- GOOD: Strategic hydration -->
<FeatureCard client:visible />
<WaitlistForm client:visible />
<!-- Footer has no interactivity, doesn't need React -->
<footer>...</footer>
```

### Anti-Pattern 2: React for Static Content

**What goes wrong:** Using React components for purely static content like privacy policy.

**Why it happens:** Converting React components 1:1 to React islands without questioning if React is needed.

**Consequences:**
- Unnecessary JavaScript shipped
- More complex code than needed
- Harder to maintain

**Prevention:**
- Ask "Does this need interactivity?" for each component
- If answer is no, use pure Astro component
- Only use React islands where state, events, or animations are needed

**Example:**
```astro
<!-- BAD: React for static content -->
<PrivacyPolicyReactComponent client:load />

<!-- GOOD: Pure Astro for static content -->
<div class="privacy-policy">
  <h1>Privacy Policy</h1>
  <p>Effective as of 2024-12-28</p>
  <!-- ... rest of static content ... -->
</div>
```

### Anti-Pattern 3: Mixing Functions Directory with Astro Endpoints

**What goes wrong:** Keeping `functions/` directory alongside Astro API endpoints.

**Why it happens:** Trying to migrate incrementally without understanding adapter modes.

**Consequences:**
- Confusing deployment behavior
- Route conflicts
- Advanced mode disables `functions/` directory silently

**Prevention:**
- Use Astro API endpoints (`src/pages/api/`) exclusively
- Delete `functions/` directory after migration
- Rely on `@astrojs/cloudflare` adapter to generate Functions

**Example:**
```
❌ BAD:
├── functions/
│   └── api/
│       └── waitlist.ts
└── src/
    └── pages/
        └── api/
            └── newsletter.ts

✅ GOOD:
└── src/
    └── pages/
        └── api/
            ├── waitlist.ts
            └── newsletter.ts
```

### Anti-Pattern 4: Not Configuring TypeScript for React

**What goes wrong:** TypeScript errors when using React components in Astro.

**Why it happens:** Forgetting to update `tsconfig.json` with React-specific settings.

**Consequences:**
- Type errors in React components
- JSX syntax not recognized
- IDE autocomplete broken

**Prevention:**
- Update `tsconfig.json` when adding React integration:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### Anti-Pattern 5: Hardcoding Environment Variables

**What goes wrong:** Directly accessing `process.env` instead of using Cloudflare runtime.

**Why it happens:** Carrying over patterns from Node.js environments.

**Consequences:**
- Environment variables not available in Cloudflare runtime
- Security issues exposing secrets client-side
- Build failures

**Prevention:**
- Always access via `locals.runtime.env` in Astro endpoints
- Never use `process.env` in Cloudflare context
- Use `.dev.vars` for local development

**Example:**
```typescript
// ❌ BAD
const apiKey = process.env.RESEND_API_KEY;

// ✅ GOOD
export const POST: APIRoute = async ({ locals }) => {
  const apiKey = locals.runtime.env.RESEND_API_KEY;
};
```

## Scalability Considerations

### At Current Scale (Landing Page Only)

**Approach:**
- Static site generation (SSG) for all pages
- `output: 'static'` in Astro config
- No SSR needed

**Why:**
- Landing page content rarely changes
- Privacy policy updates infrequent
- Maximum edge caching benefit

**Performance:**
- All pages served as static HTML from edge
- Zero compute cost for page requests
- Only API endpoint incurs compute

### At 100-1000 Users/Day

**Approach:**
- Continue with SSG
- Add Cloudflare Analytics
- Monitor API endpoint performance

**Why:**
- Static pages scale infinitely on Cloudflare edge
- API endpoint handles form submissions easily
- No database, minimal state

**Considerations:**
- Resend API rate limits (check plan)
- Consider adding honeypot spam protection
- Add basic rate limiting if needed

### At 10K+ Users/Day

**Approach:**
- Evaluate adding database for waitlist (D1 or external)
- Consider A/B testing different landing page variants
- Add more comprehensive analytics

**Why:**
- May want to track signup sources, conversion rates
- Database more reliable than email-only tracking
- A/B testing requires dynamic routing

**Migration path:**
```typescript
// astro.config.mjs
export default defineConfig({
  output: 'hybrid', // Most pages static, opt-in to SSR
  adapter: cloudflare()
});
```

```astro
---
// src/pages/index.astro
export const prerender = false; // Enable SSR for this page
---
```

### At 100K+ Users/Day (Hypothetical Full App)

**Approach:**
- Migrate to full SSR for dynamic content
- Use Cloudflare KV for session storage
- Consider Cloudflare D1 for database
- Implement comprehensive caching strategy

**Why:**
- High traffic requires dynamic personalization
- Edge compute provides low latency globally
- Cloudflare's platform scales automatically

**Architecture evolution:**
- Landing page remains SSG
- Dashboard becomes SSR with authentication
- API becomes more complex with database queries

## Performance Benchmarks

### Expected Performance Improvements

Based on [Astro islands architecture research](https://docs.astro.build/en/concepts/islands/), typical React SPA to Astro migrations see:

| Metric | React SPA (Current) | Astro Hybrid (Target) | Improvement |
|--------|---------------------|----------------------|-------------|
| **First Contentful Paint (FCP)** | ~2.5s | ~0.8s | 68% faster |
| **Time to Interactive (TTI)** | ~4.5s | ~2.0s | 56% faster |
| **Total Blocking Time (TBT)** | ~800ms | ~150ms | 81% reduction |
| **JavaScript Bundle Size** | ~450KB | ~120KB | 73% reduction |
| **Lighthouse Score** | ~75 | ~95+ | +20 points |

**Factors contributing to improvement:**
1. Static HTML renders immediately (no hydration delay)
2. Selective hydration reduces JavaScript payload
3. `client:visible` defers below-fold component hydration
4. Framer Motion lazy-loaded only for interactive components
5. Automatic code splitting by Astro bundler

### Measurement Strategy

**Before Migration (Baseline):**
```bash
# Run Lighthouse on current React SPA
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse
```

**After Migration (Validation):**
```bash
# Run Lighthouse on Astro build
npm run build
npm run preview
# Compare metrics
```

**Production Monitoring:**
- Enable Cloudflare Web Analytics
- Track Core Web Vitals in Cloudflare dashboard
- Monitor API endpoint response times

## Cloudflare-Specific Optimizations

### 1. Image Optimization

**Current:** Images served directly from `public/` folder.

**Target:** Use Cloudflare Image Resizing.

```typescript
// astro.config.mjs
adapter: cloudflare({
  imageService: 'cloudflare'
})
```

**Usage in components:**
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image src={heroImage} alt="Hero" width={1200} height={600} />
```

**Benefits:**
- Automatic WebP/AVIF conversion
- Responsive image generation
- Edge caching

### 2. Edge Caching Strategy

**Static Pages:**
```
Cache-Control: public, max-age=31536000, immutable
```

**API Endpoints:**
```typescript
return new Response(json, {
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json'
  }
});
```

### 3. Cloudflare Workers KV (Future)

If adding session storage or feature flags:

```typescript
// astro.config.mjs
adapter: cloudflare({
  sessionKVBindingName: 'SESSION_STORAGE'
})
```

```typescript
// In API endpoint
const session = await locals.runtime.env.SESSION_STORAGE.get(sessionId);
```

### 4. Platform Proxy for Local Development

```typescript
adapter: cloudflare({
  platformProxy: {
    enabled: true
  }
})
```

**Benefits:**
- Emulate Cloudflare runtime locally
- Test KV bindings without deployment
- Validate environment variable access

## TypeScript Configuration

### Full tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "types": ["@cloudflare/workers-types"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Runtime Type Safety

Generate types from `wrangler.jsonc`:

```bash
npm install -D @cloudflare/workers-types
npx wrangler types
```

Extend runtime types:

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    // Additional local types if needed
  }
}
```

## Migration Validation Checklist

### Functional Validation

- [ ] Landing page renders correctly
- [ ] Privacy page renders correctly
- [ ] Navbar animations work (Framer Motion)
- [ ] Hero section animations work
- [ ] Feature cards animate on scroll
- [ ] Waitlist form accepts email input
- [ ] Waitlist form validates email
- [ ] Waitlist form submits to API endpoint
- [ ] API endpoint sends email via Resend
- [ ] Success message displays after submission
- [ ] Error handling works for API failures
- [ ] `.well-known/assetlinks.json` accessible
- [ ] `.well-known/apple-app-site-association` accessible

### Performance Validation

- [ ] FCP < 1 second
- [ ] TTI < 3 seconds
- [ ] Lighthouse Performance score > 90
- [ ] JavaScript bundle < 150KB (gzipped)
- [ ] No layout shift (CLS < 0.1)
- [ ] Images lazy-load correctly
- [ ] Below-fold components hydrate on scroll

### Deployment Validation

- [ ] Local development works (`npm run dev`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Preview mode works (`npm run preview`)
- [ ] Cloudflare Pages deployment succeeds
- [ ] Environment variables accessible in production
- [ ] API endpoint works in production
- [ ] CORS headers correct
- [ ] No console errors in browser

### SEO Validation

- [ ] Meta tags present on all pages
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Structured data (JSON-LD) if applicable
- [ ] Sitemap.xml generated
- [ ] robots.txt configured
- [ ] Canonical URLs set

## Sources

### High Confidence (Official Documentation)

- [Astro Cloudflare Adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Migrating from Create React App](https://docs.astro.build/en/guides/migrate-to-astro/from-create-react-app/)
- [Astro Framework Components](https://docs.astro.build/en/guides/framework-components/)
- [Cloudflare Pages Astro Guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Astro Routing](https://docs.astro.build/en/guides/routing/)
- [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/)
- [Astro TypeScript](https://docs.astro.build/en/guides/typescript/)

### Medium Confidence (Community Resources & Recent News)

- [Cloudflare Acquires Astro (January 2026)](https://www.cloudflare.com/press/press-releases/2026/cloudflare-acquires-astro-to-accelerate-the-future-of-high-performance-web-development/)
- [Astro is Joining Cloudflare](https://blog.cloudflare.com/astro-joins-cloudflare/)
- [Adding React Framer Motion to Astro](https://thevalleyofcode.com/adding-react-framer-motion-animations-to-an-astro-site/)
- [Build SPA with Astro](https://logsnag.com/blog/react-spa-with-astro)
- [Astro vs Next.js vs Remix 2026 Comparison](https://octahedroid.com/blog/astro-vs-nextjs-vs-remix-react-router-static-site-generators-comparison-2026)

### Low Confidence (Requires Validation)

- Performance benchmarks are estimates based on typical migrations
- Resend API integration pattern preserved but should be tested
- KV namespace usage is documented but not required for initial migration
