# Phase 2: Cloudflare Integration - Research

**Researched:** 2026-01-29
**Domain:** Cloudflare Pages deployment for static Astro sites
**Confidence:** HIGH

## Summary

Phase 2 focuses on configuring Cloudflare Pages deployment for a **static Astro site**. Key finding: The `@astrojs/cloudflare` adapter is **NOT required** for static sites—it's only needed for SSR/on-demand rendering. The project uses `output: 'static'` (configured in Phase 1), so deployment is straightforward static asset hosting.

The primary tasks involve migrating from `wrangler.toml` to the recommended `wrangler.jsonc` format, configuring build settings for Cloudflare Pages, and ensuring the build output meets Cloudflare's requirements. Special attention needed for `_routes.json` generation (100 rule limit) and Auto Minify settings (deprecated but may affect custom domains).

**Primary recommendation:** Deploy as static site without the Cloudflare adapter. Migrate to `wrangler.jsonc` for future compatibility, configure correct build output directory (`./dist`), and verify deployment through Cloudflare dashboard or Wrangler CLI.

## Standard Stack

The established libraries/tools for Cloudflare Pages + Static Astro deployment:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.16.16+ | Static site generator | Official framework, native Cloudflare support |
| Wrangler | Latest (3.91.0+) | Cloudflare CLI deployment tool | Official Cloudflare deployment utility, required for CLI deploys |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/cloudflare | Latest (v11+) | SSR adapter for Cloudflare | ONLY for SSR/hybrid rendering—NOT needed for static sites |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| wrangler.jsonc | wrangler.toml | TOML still supported but Cloudflare recommends JSONC for new projects; some newer features only available in JSON format |
| Wrangler CLI deploy | Dashboard Git deploy | Dashboard simpler for CI/CD, Wrangler gives local control and testing |

**Installation:**
```bash
# Wrangler (for CLI deployment)
pnpm add -D wrangler

# @astrojs/cloudflare (NOT needed for this project - static site)
# Only install if converting to SSR later
```

## Architecture Patterns

### Recommended Project Structure (Static Deployment)
```
nomadcrew-landing/
├── dist/                    # Build output (Cloudflare Pages reads from here)
│   ├── index.html
│   ├── _astro/             # Compiled assets
│   └── ...
├── public/                  # Static assets (copied to dist/)
│   ├── _headers            # Optional: Custom HTTP headers
│   ├── _redirects          # Optional: Custom redirects (max 2,100)
│   └── .well-known/        # Verification files (SSL, etc.)
├── src/                     # Source code
├── wrangler.jsonc          # Cloudflare deployment config
└── astro.config.mjs        # Astro configuration
```

### Pattern 1: Static Site Configuration (Recommended for Phase 2)
**What:** Deploy Astro as pure static site without adapter
**When to use:** Project uses `output: 'static'` (current configuration)
**Example:**
```javascript
// astro.config.mjs
// Source: https://docs.astro.build/en/guides/deploy/cloudflare/
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://nomadcrew.uk',
  output: 'static', // No adapter needed
  integrations: [react()],
});
```

```jsonc
// wrangler.jsonc
// Source: https://developers.cloudflare.com/pages/functions/wrangler-configuration/
{
  "name": "nomadcrew-landing-page",
  "compatibility_date": "2026-01-29",
  "pages_build_output_dir": "./dist"
}
```

### Pattern 2: Wrangler Configuration Migration
**What:** Migrate from TOML to JSONC format
**When to use:** Project has existing `wrangler.toml` (current state)
**Example:**
```toml
# OLD: wrangler.toml
name = "nomadcrew-landing-page"
pages_build_output_dir = "./dist"
```

```jsonc
// NEW: wrangler.jsonc (recommended)
{
  "name": "nomadcrew-landing-page",
  "compatibility_date": "2026-01-29",
  "pages_build_output_dir": "./dist"
}
```

### Pattern 3: Special Files in public/ Directory
**What:** Cloudflare-specific configuration files
**When to use:** Need custom headers, redirects, or routing rules
**Example:**
```
// public/_headers
// Source: https://developers.cloudflare.com/pages/configuration/headers/
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff

// public/_redirects
// Source: https://developers.cloudflare.com/pages/configuration/redirects/
/old-path  /new-path  301
/api/*     https://api.example.com/:splat  200
```

**Important:** `_headers`, `_redirects`, and `_routes.json` are NOT served as static assets—they're parsed by Cloudflare Pages at deployment.

### Anti-Patterns to Avoid
- **Installing @astrojs/cloudflare for static sites:** Unnecessary complexity, adds SSR overhead
- **Using `output: 'server'` or `output: 'hybrid'` without adapter:** Causes build failures
- **Setting build output directory to `public` instead of `dist`:** Causes blank pages after deployment
- **Not setting `compatibility_date` in wrangler.jsonc:** May cause unexpected runtime behavior
- **Enabling Auto Minify on custom domains:** Deprecated feature can still cause hydration issues if manually re-enabled

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Custom routing logic for static assets | Manual _routes.json | Astro's default build output | Astro already generates optimal structure; _routes.json only needed for SSR |
| Local Cloudflare runtime emulation | Custom dev server | Wrangler's `wrangler pages dev ./dist` | Official tool provides accurate runtime simulation |
| Minification during build | Custom minifier | Astro's built-in Vite minification | Already included, Auto Minify deprecated |
| Custom redirect handling | Server-side redirects | `_redirects` file in public/ | Cloudflare handles at edge, faster than server |
| Custom header management | Middleware/runtime headers | `_headers` file in public/ | Applied at edge, better performance |

**Key insight:** Cloudflare Pages provides powerful edge-level features (_headers, _redirects) that are faster and simpler than custom implementations. Astro's static build output is already optimized for Cloudflare.

## Common Pitfalls

### Pitfall 1: Installing Cloudflare Adapter for Static Sites
**What goes wrong:** Developers assume `@astrojs/cloudflare` is required for Cloudflare Pages deployment
**Why it happens:** Adapter is prominently featured in Cloudflare/Astro docs, but those docs cover both SSR and static deployments
**How to avoid:** Check `output` setting in `astro.config.mjs`. If `output: 'static'`, DO NOT install adapter
**Warning signs:**
- Build generates `_worker.js` file (indicates SSR mode)
- Error messages about "server-side rendering" during build
- Unexpectedly large build output

**Source:** [Official Astro Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) explicitly state: "If you're using Astro as a static site builder, you don't need an adapter."

### Pitfall 2: _routes.json Exceeding 100 Rule Limit
**What goes wrong:** Deployment fails with "Error 8000057: Rules in `_routes.json` are over the 100 rule limit"
**Why it happens:**
- Frameworks auto-generate `_routes.json` listing all static files in exclude array
- Large sites with many pages/assets exceed 100 combined include/exclude rules
- Each rule max 100 characters
**How to avoid:**
- For **static sites**: Don't generate `_routes.json` at all (not needed)
- If needed: Use wildcard patterns (`/api/*`) instead of individual file rules
- Invert logic: exclude all with `/*`, include only dynamic routes
**Warning signs:**
- Build succeeds locally but fails on Cloudflare
- `_routes.json` file in dist/ with large exclude array
- Many individual file paths in routes file

**Source:** [Cloudflare Pages Routing Docs](https://developers.cloudflare.com/pages/functions/routing/) - "no more than 100 include/exclude rules combined"

### Pitfall 3: Wrong Output Directory Configuration
**What goes wrong:** Pages deploy successfully but show blank/404 pages
**Why it happens:**
- Configured `pages_build_output_dir` to `public` instead of `dist`
- Framework preset auto-fill may be incorrect
**How to avoid:**
- Always verify `pages_build_output_dir: "./dist"` in wrangler.jsonc
- Match Astro's default output directory
- Test locally with `wrangler pages dev ./dist` after build
**Warning signs:**
- Deployment succeeds but site doesn't load
- 404 errors on all pages
- Assets not found

**Source:** [Community Reports](https://community.cloudflare.com/t/cant-build-static-astro-site-on-cloudflare-pages-can-locally/702282)

### Pitfall 4: Node.js Version Mismatches
**What goes wrong:** Build succeeds locally but fails on Cloudflare Pages
**Why it happens:**
- Cloudflare Pages v2 build system defaults to Node.js 18.17.1
- Local development may use newer Node.js features
- Dependency version differences between environments
**How to avoid:**
- Set `NODE_VERSION` environment variable in Cloudflare dashboard (recommend `20` or `22`)
- Pin dependencies to exact versions in package.json
- Test with same Node version locally
**Warning signs:**
- "Unexpected token" or syntax errors during Cloudflare build
- Dependencies work locally but fail in cloud
- Build output shows old Node.js version

**Source:** [Cloudflare Build Configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)

### Pitfall 5: Auto Minify Causing Hydration Issues
**What goes wrong:** React islands fail to hydrate on production, console shows hydration mismatches
**Why it happens:**
- Auto Minify feature (deprecated Aug 2024) may still be enabled on custom domains
- HTML minification corrupts React hydration markers
**How to avoid:**
- Verify Auto Minify is disabled in Cloudflare dashboard: Speed > Optimization
- Check custom domain settings (pages.dev domains don't have minify)
- Rely on Astro's built-in Vite minification instead
**Warning signs:**
- Works on pages.dev preview, breaks on custom domain
- Console errors: "Hydration failed" or "Text content does not match"
- Interactive React components don't work in production

**Source:** [Astro Cloudflare Deployment Guide](https://docs.astro.build/en/guides/deploy/cloudflare/) - "Client-side hydration may fail as a result of Cloudflare's Auto Minify setting"

**Note:** Auto Minify was deprecated in August 2024, so this should not affect new deployments in 2026. However, existing custom domains may still have it enabled.

### Pitfall 6: .well-known Files Not Deploying
**What goes wrong:** SSL verification, Apple App Site Association, or other `.well-known` files return 404
**Why it happens:**
- Files placed in wrong directory (src/ instead of public/)
- Cloudflare Access blocking public access
- Build process not copying files
**How to avoid:**
- Place `.well-known/` directory in `public/` folder
- Configure Cloudflare Access exceptions for `/.well-known/*` paths
- Verify files appear in `dist/.well-known/` after build
**Warning signs:**
- SSL validation fails
- Apple app association file not accessible
- 404 on `https://example.com/.well-known/...`

**Source:** [Community Discussions](https://community.cloudflare.com/t/allow-to-serve-from-well-known/507153) - confirmed working in 2022+

## Code Examples

Verified patterns from official sources:

### Cloudflare Pages Deployment via Wrangler CLI
```bash
# Source: https://docs.astro.build/en/guides/deploy/cloudflare/

# Install Wrangler
pnpm add -D wrangler

# Build Astro site
pnpm run build

# Preview locally with Cloudflare runtime
npx wrangler pages dev ./dist

# Deploy to Cloudflare Pages
npx wrangler pages deploy ./dist
```

### Dashboard Deployment Configuration
```yaml
# Source: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
# Configure in Cloudflare Dashboard: Workers & Pages > Create

Framework preset: Astro
Production branch: main
Build command: pnpm run build
Build output directory: dist

# Environment Variables (optional)
NODE_VERSION: 20
```

### Testing Build Output Locally
```bash
# Source: https://docs.astro.build/en/guides/deploy/cloudflare/

# Build the site
pnpm run build

# Serve with Wrangler (simulates Cloudflare Pages runtime)
npx wrangler pages dev ./dist

# Or use Astro's preview (standard HTTP server)
pnpm run preview
```

### Custom Headers Example
```
# Source: https://developers.cloudflare.com/pages/configuration/headers/
# File: public/_headers

# Apply to all routes
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

# Route-specific headers
/api/*
  Access-Control-Allow-Origin: *
  Cache-Control: no-cache

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### Custom Redirects Example
```
# Source: https://developers.cloudflare.com/pages/configuration/redirects/
# File: public/_redirects

# 301 permanent redirects
/old-blog/*  /blog/:splat  301

# 302 temporary redirects
/temporary  /new-location  302

# Proxy (200 status, no redirect)
/api/*  https://api.backend.com/:splat  200

# Limits: 2,000 static + 100 dynamic = 2,100 total max
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| wrangler.toml | wrangler.jsonc | Wrangler v3.91.0 (2024) | Future features only available in JSON format |
| Auto Minify at edge | Build-time minification (Vite) | Deprecated Aug 2024 | Prevents hydration issues, faster builds |
| Manual adapter installation | `npx astro add cloudflare` | Astro 2.0+ (2023) | Automatic config updates, fewer errors |
| `node_compat = true` | `compatibility_flags = ["nodejs_compat"]` | Wrangler v3 (2023) | Consistent syntax, better compatibility |
| Node.js 16 default | Node.js 20/22 recommended | Pages v2 (2024) | Better ES module support, modern syntax |

**Deprecated/outdated:**
- **Auto Minify:** Deprecated August 2024. Use Astro's built-in Vite minification instead
- **wrangler.toml for new projects:** Still supported but Cloudflare recommends wrangler.jsonc
- **`node_compat` flag:** Replaced by `nodejs_compat` in compatibility_flags array (Wrangler v3)

## Open Questions

Things that couldn't be fully resolved:

1. **nodejs_compat flag for static sites**
   - What we know: Flag enables Node.js runtime APIs in Workers/Pages Functions
   - What's unclear: Whether static sites need this flag at all (no runtime code execution)
   - Recommendation: Omit `compatibility_flags` for Phase 2 (static deployment). Add only if Phase 6 (API endpoints) requires it

2. **_routes.json generation for static sites**
   - What we know: File controls which routes invoke Functions vs serve static assets
   - What's unclear: Whether Astro generates this file for static builds, or if it's only for SSR
   - Recommendation: Build the site and check if `dist/_routes.json` exists. If not, no action needed

3. **Auto Minify current status on existing domains**
   - What we know: Feature deprecated August 2024
   - What's unclear: Whether existing nomadcrew.uk domain has it enabled from previous deployment
   - Recommendation: Check Cloudflare dashboard Speed > Optimization settings and disable if present

## Sources

### Primary (HIGH confidence)
- [Astro Cloudflare Deployment Guide](https://docs.astro.build/en/guides/deploy/cloudflare/) - Official Astro deployment instructions
- [Astro Cloudflare Adapter Guide](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) - When adapter is/isn't needed
- [Cloudflare Pages Astro Guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) - Official Cloudflare deployment guide
- [Cloudflare Pages Wrangler Configuration](https://developers.cloudflare.com/pages/functions/wrangler-configuration/) - wrangler.jsonc schema and requirements
- [Cloudflare Pages Routing](https://developers.cloudflare.com/pages/functions/routing/) - _routes.json structure and 100 rule limit
- [Cloudflare Workers Node.js Compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/) - nodejs_compat flag details
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) - TOML vs JSONC comparison

### Secondary (MEDIUM confidence)
- [Cloudflare Pages Headers](https://developers.cloudflare.com/pages/configuration/headers/) - _headers file usage
- [Cloudflare Pages Redirects](https://developers.cloudflare.com/pages/configuration/redirects/) - _redirects file limits and syntax
- [Node.js Compatibility Improvements 2025](https://blog.cloudflare.com/nodejs-workers-2025/) - nodejs_compat v2 updates
- [Cloudflare Auto Minify Deprecation](https://community.cloudflare.com/t/deprecating-auto-minify/655677) - Deprecation announcement

### Tertiary (LOW confidence - community reports)
- [Community: Static Build Issues](https://community.cloudflare.com/t/cant-build-static-astro-site-on-cloudflare-pages-can-locally/702282) - Common mistakes
- [Community: .well-known Support](https://community.cloudflare.com/t/allow-to-serve-from-well-known/507153) - Verification that .well-known works
- [GitHub: _routes.json Limit Issues](https://github.com/withastro/docs/issues/3039) - Community discussion on route limits

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation confirms static sites don't need adapter
- Architecture: HIGH - Wrangler.jsonc format and structure verified from Cloudflare docs
- Pitfalls: HIGH - Cross-verified with official docs and multiple community reports
- State of the art: MEDIUM - Deprecation dates confirmed, but some features may have changed post-documentation

**Research date:** 2026-01-29
**Valid until:** 2026-02-28 (30 days - stable platform, slow-moving standards)

**Key decision points for planner:**
1. Do NOT install @astrojs/cloudflare adapter (static site)
2. Migrate wrangler.toml → wrangler.jsonc (future compatibility)
3. Verify build output directory is `./dist`
4. Check Auto Minify status on custom domain (likely already disabled)
5. Place .well-known files in public/ directory for Phase 6 API work
