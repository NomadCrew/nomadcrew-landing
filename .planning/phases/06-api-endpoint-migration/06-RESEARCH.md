# Phase 6: API Endpoint Migration - Research

**Researched:** 2026-01-31
**Domain:** Astro + Cloudflare Pages API endpoints
**Confidence:** HIGH

## Summary

The waitlist endpoint migration has two viable paths: (1) keep the existing Cloudflare Pages Functions in `functions/api/waitlist.ts` with static output, or (2) convert to Astro server endpoints with the Cloudflare adapter. Both approaches work on Cloudflare Pages, but have different implications for the project.

The **current implementation already works** - Cloudflare Pages automatically serves files in the `functions/` directory as serverless functions alongside static assets. The main decision is whether to migrate to Astro's endpoint format or keep the existing Cloudflare Pages Functions approach.

**Key finding:** With Astro 5, the `hybrid` output mode was deprecated. Static sites can now use selective server rendering by adding `export const prerender = false` to individual pages/endpoints while keeping `output: 'static'` in the config.

**Primary recommendation:** Keep static output mode and the existing `functions/api/waitlist.ts` implementation. This requires minimal changes (zero config changes), preserves the working implementation, and aligns with the project's static-first philosophy established in Phase 5.

## Standard Stack

The established approach for API endpoints in Astro + Cloudflare Pages:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Static site generator | Current stable version, deprecated hybrid mode |
| @astrojs/cloudflare | 13.x+ | Cloudflare adapter (optional) | Only needed for Astro server endpoints |
| wrangler | 4.42.0+ | Cloudflare deployment tool | Required for local dev, fixed Node.js compatibility issues |
| Resend SDK | Latest | Email API client | Official SDK with Worker support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @cloudflare/workers-types | Latest | TypeScript types | Type safety for Cloudflare runtime |
| Playwright | Latest | API testing | Integration testing for endpoints |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Cloudflare Pages Functions | Astro server endpoints | Pages Functions: no adapter needed, simpler. Astro endpoints: unified codebase, better DX |
| `functions/` directory | Astro `src/pages/api/` | Functions dir works with static output. Astro endpoints require adapter setup |
| Static output | Server/hybrid output | Static: simpler, fewer dependencies. Server: unified approach, more Astro-native |

**Installation:**
```bash
# For Approach 1 (Static + Pages Functions) - NO NEW PACKAGES NEEDED
# Current setup already works

# For Approach 2 (Astro endpoints + adapter) - ONLY if converting
npm install @astrojs/cloudflare
```

## Architecture Patterns

### Approach 1: Static Output + Cloudflare Pages Functions (Recommended)

**What:** Keep `output: 'static'` in astro.config.mjs and use the existing `functions/api/waitlist.ts`

**When to use:**
- Site is primarily static (current project state)
- Minimal API surface (only waitlist endpoint)
- Want simplest deployment with no adapter
- Already have working Pages Functions

**Project Structure:**
```
nomadcrew-landing/
├── functions/
│   └── api/
│       └── waitlist.ts          # Cloudflare Pages Function (current)
├── src/
│   └── components/
│       └── react/
│           └── WaitlistForm.tsx  # Calls /api/waitlist
├── astro.config.mjs              # output: 'static' (no adapter)
├── wrangler.jsonc                # Minimal config
└── .dev.vars                     # Local env vars
```

**Endpoint Format (Cloudflare Pages Functions):**
```typescript
// functions/api/waitlist.ts
// Source: Cloudflare Pages Functions API Reference
// https://developers.cloudflare.com/pages/functions/api-reference/

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export async function onRequest(context) {
  const { request, env } = context;

  // Handle OPTIONS for CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Access env vars via context.env
  const apiKey = env.RESEND_API_KEY;

  // Parse request
  const body = await request.json();

  // Return Response
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: corsHeaders }
  );
}
```

**Environment Variables:**
- Production: Set in Cloudflare Pages dashboard (Settings > Environment variables)
- Local dev: Create `.dev.vars` file with `RESEND_API_KEY=your_key`
- Access via: `context.env.VARIABLE_NAME`

**Deployment:**
- Astro builds to `dist/` (static assets)
- Cloudflare Pages automatically serves `functions/` as serverless functions
- No adapter needed, no build config changes

---

### Approach 2: Static Output + Astro Server Endpoints (Alternative)

**What:** Keep `output: 'static'` but add `@astrojs/cloudflare` adapter and convert endpoint to `src/pages/api/waitlist.ts`

**When to use:**
- Want Astro-native endpoint format
- Plan to add more endpoints later
- Prefer unified codebase (all code in src/)
- Value Astro's TypeScript integration

**Project Structure:**
```
nomadcrew-landing/
├── src/
│   ├── pages/
│   │   ├── api/
│   │   │   └── waitlist.ts      # Astro endpoint with prerender=false
│   │   └── index.astro          # Static pages
│   └── components/
│       └── react/
│           └── WaitlistForm.tsx
├── astro.config.mjs              # output: 'static', adapter: cloudflare()
├── wrangler.jsonc                # Extended config
└── .dev.vars                     # Local env vars
```

**Astro Config:**
```javascript
// astro.config.mjs
// Source: Astro Cloudflare Adapter Docs
// https://docs.astro.build/en/guides/integrations-guide/cloudflare/

import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://nomadcrew.uk',
  output: 'static',  // Keep static for most pages
  adapter: cloudflare({
    imageService: 'compile',  // Pre-compile images
    platformProxy: {
      enabled: true  // Enable local runtime access
    }
  }),
  integrations: [react({ include: ['**/react/*', '**/*.tsx'] })],
  // ... rest of config
});
```

**Endpoint Format (Astro):**
```typescript
// src/pages/api/waitlist.ts
// Source: Astro Endpoints Guide
// https://docs.astro.build/en/guides/endpoints/

// Mark as server-rendered (not pre-rendered at build time)
export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  // Access Cloudflare runtime via locals
  const env = locals.runtime.env;
  const apiKey = env.RESEND_API_KEY;

  // Parse request body
  const body = await request.json();
  const { email } = body;

  // Return Response
  return new Response(
    JSON.stringify({ success: true, message: 'Successfully joined waitlist' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};

// Handle OPTIONS for CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
```

**Environment Variables:**
- Production: Set in Cloudflare Pages dashboard
- Local dev: Create `.dev.vars` file
- Access via: `locals.runtime.env.VARIABLE_NAME`
- TypeScript types: Run `wrangler types` to generate `env.d.ts`

**Important:** The Cloudflare adapter uses "advanced mode" by default, which disables the `functions/` directory. If you add the adapter, you must migrate all Functions to Astro endpoints.

---

### Wrangler Configuration

**Minimal (for Approach 1):**
```jsonc
// wrangler.jsonc - Current configuration
{
  "$schema": "https://json.schemastore.org/wrangler.json",
  "name": "nomadcrew-landing-page",
  "compatibility_date": "2026-01-29",
  "pages_build_output_dir": "./dist"
}
```

**Extended (for Approach 2 with Resend SDK):**
```jsonc
// wrangler.jsonc - If using Resend SDK or Node.js APIs
{
  "$schema": "https://json.schemastore.org/wrangler.json",
  "name": "nomadcrew-landing-page",
  "compatibility_date": "2026-01-29",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "./dist"
}
```

**Note on nodejs_compat:**
- Required if using Resend's Node.js SDK (`import { Resend } from 'resend'`)
- Enables Node.js built-in polyfills in Cloudflare Workers runtime
- Requires `compatibility_date >= 2024-09-23`
- **Important:** Ensure Wrangler >= 4.42.0 to avoid `[object Object]` response bug with `enable_nodejs_process_v2` flag (default as of 2025-09-15)

**Current implementation uses fetch API directly**, so nodejs_compat is NOT required. Only add if migrating to Resend SDK.

---

### Anti-Patterns to Avoid

- **Don't mix approaches:** Either use `functions/` OR Astro endpoints, not both for the same route
- **Don't add adapter without migration:** Adding `@astrojs/cloudflare` disables `functions/` directory by default (advanced mode)
- **Don't forget prerender flag:** Astro endpoints default to static unless marked `export const prerender = false`
- **Don't use import.meta.env for secrets:** Runtime secrets must come from `context.env` (Pages Functions) or `locals.runtime.env` (Astro endpoints)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email validation | Custom regex | Server-side validation libraries or Resend's built-in validation | Handles edge cases (disposable emails, MX records, internationalized domains) |
| CORS middleware | Manual header checks | Cloudflare's built-in CORS helpers or standardized middleware | Handles preflight, credentials, origin validation correctly |
| Email delivery | SMTP server | Resend API (current), SendGrid, or Mailgun | Deliverability, bounce handling, SPF/DKIM setup, scaling |
| Rate limiting | In-memory counters | Cloudflare Rate Limiting, KV storage, or Durable Objects | Distributed systems need persistent state |
| Request validation | Manual checks | Zod, Valibot, or TypeBox schemas | Type safety, detailed error messages, runtime validation |

**Key insight:** Cloudflare Pages Functions and Workers are stateless and ephemeral. Don't rely on in-memory state or file system writes. Use Cloudflare's primitives (KV, Durable Objects, D1) for persistence.

## Common Pitfalls

### Pitfall 1: Same-Origin vs Cross-Origin CORS Confusion

**What goes wrong:** CORS headers are set but form submission still fails, or CORS works in dev but fails in production.

**Why it happens:**
- Same-origin requests (e.g., `https://nomadcrew.uk` calling `https://nomadcrew.uk/api/waitlist`) don't trigger CORS
- Cross-origin requests require proper `Access-Control-Allow-Origin` headers
- Preflight OPTIONS requests must be handled separately

**How to avoid:**
```typescript
// CORRECT: Handle both same-origin and cross-origin
export async function onRequest(context) {
  const { request } = context;

  // Always handle OPTIONS for cross-origin preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',  // Or specific domain
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'  // Cache preflight for 24h
      }
    });
  }

  // ... handle POST request
  // Return CORS headers on actual response too
  return new Response(json, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
```

**Warning signs:**
- Browser console shows CORS errors only on deployed site, not localhost
- OPTIONS requests return 405 Method Not Allowed
- Requests work in Postman but fail from browser

**Current project:** Form calls `/api/waitlist` from same origin (both served from `nomadcrew.uk`), so CORS headers are redundant but harmless. Keep them for future flexibility.

---

### Pitfall 2: Environment Variables in Wrong Scope

**What goes wrong:** `process.env.RESEND_API_KEY` returns `undefined`, or env vars work in dev but not production.

**Why it happens:**
- Cloudflare Workers don't support `process.env` or `import.meta.env` at runtime
- Build-time env vars (`import.meta.env`) are baked into static output
- Runtime secrets must come from Cloudflare's bindings (`context.env`)

**How to avoid:**
```typescript
// WRONG: These don't work in Cloudflare Workers runtime
const key = process.env.RESEND_API_KEY;  // ❌ undefined
const key = import.meta.env.RESEND_API_KEY;  // ❌ baked at build time

// CORRECT: Use context.env (Pages Functions)
export async function onRequest(context) {
  const key = context.env.RESEND_API_KEY;  // ✅ Runtime binding

  if (!key) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  // ...
}

// CORRECT: Use locals.runtime.env (Astro endpoints)
export const POST: APIRoute = async ({ locals }) => {
  const key = locals.runtime.env.RESEND_API_KEY;  // ✅ Runtime binding
  // ...
}
```

**Configuration:**
- **Local dev:** Create `.dev.vars` file in project root (not in `functions/` directory)
- **Production:** Add env vars in Cloudflare Pages dashboard: Settings > Environment variables > Add variable
- **Preview:** Can set different values for production vs preview deployments

**Warning signs:**
- Env vars work with `wrangler pages dev` but not in Astro dev server
- Different behavior between `npm run dev` and `npm run preview`
- "Missing API key" errors only in production

---

### Pitfall 3: Forgetting to Handle JSON Parse Errors

**What goes wrong:** Malformed requests crash the endpoint with unhandled exceptions.

**Why it happens:** `request.json()` throws if the body isn't valid JSON.

**How to avoid:**
```typescript
// WRONG: No error handling
const body = await request.json();
const { email } = body;

// CORRECT: Validate and handle errors
export async function onRequest(context) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON in request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Validate required fields
  if (!body.email) {
    return new Response(
      JSON.stringify({ error: 'Email is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ... continue processing
}
```

**Current implementation:** Already handles this correctly (lines 35-50 in existing `waitlist.ts`).

**Warning signs:**
- Cloudflare logs show 500 errors for some requests
- No response returned to client on malformed input
- Different error messages between dev and production

---

### Pitfall 4: Static vs Server Rendering Confusion with Astro 5

**What goes wrong:** Endpoint returns static data from build time instead of processing requests dynamically.

**Why it happens:** Astro 5 deprecated `output: 'hybrid'`. Now, with `output: 'static'`, all pages and endpoints are pre-rendered at build time unless explicitly opted out.

**How to avoid:**
```typescript
// WRONG: Endpoint is pre-rendered once at build time
// src/pages/api/waitlist.ts
export const POST: APIRoute = async ({ request }) => {
  // This runs ONCE during build, not per-request
  return new Response(JSON.stringify({ success: true }));
}

// CORRECT: Opt out of pre-rendering for dynamic endpoints
export const prerender = false;  // ✅ This line is critical

export const POST: APIRoute = async ({ request }) => {
  // Now this runs on every request
  const body = await request.json();
  // ... handle request dynamically
}
```

**Note:** This only applies to Approach 2 (Astro endpoints). Cloudflare Pages Functions (Approach 1) are always dynamic.

**Warning signs:**
- Endpoint returns same data regardless of input
- Changes to endpoint code don't reflect in deployed version
- Request body is empty or undefined

---

### Pitfall 5: Local Development Environment Mismatch

**What goes wrong:** Endpoint works locally but fails when deployed to Cloudflare Pages.

**Why it happens:**
- Astro dev server (`astro dev`) doesn't fully emulate Cloudflare runtime
- Need to use `wrangler pages dev` for accurate local testing
- Different environments load env vars differently

**How to avoid:**

**For Approach 1 (Pages Functions):**
```bash
# Build first
npm run build

# Test with Wrangler (matches production environment)
wrangler pages dev ./dist

# OR use the npm script
npm run preview:wrangler
```

**For Approach 2 (Astro endpoints):**
```javascript
// astro.config.mjs
export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true  // Enables Cloudflare runtime in astro dev
    }
  })
});
```

**Environment variables:**
- Create `.dev.vars` in project root (not `functions/` directory)
- Format: `KEY=value` (dotenv syntax)
- Add to `.gitignore`

**Testing workflow:**
1. `npm run dev` - Fast iteration, may not match production exactly
2. `npm run build && wrangler pages dev ./dist` - Accurate production preview
3. Deploy to Cloudflare Pages preview branch - Final verification

**Warning signs:**
- "Works on my machine" but fails in Cloudflare Pages deployment
- Env vars undefined in production but work locally
- Different response times or behaviors

---

### Pitfall 6: Resend API Rate Limiting

**What goes wrong:** High-traffic periods cause API failures or quota exceeded errors.

**Why it happens:** Resend has rate limits (2 requests/second by default), and the waitlist endpoint doesn't implement rate limiting or queueing.

**How to avoid:**
```typescript
// IMMEDIATE: Add error handling for rate limit responses
const resendResponse = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(emailData)
});

if (resendResponse.status === 429) {  // Too Many Requests
  return new Response(
    JSON.stringify({
      error: 'Too many signup requests. Please try again in a moment.'
    }),
    { status: 429, headers: { 'Content-Type': 'application/json' } }
  );
}

// FUTURE: Implement Cloudflare Queues for rate limit compliance
// See: https://developers.cloudflare.com/queues/tutorials/handle-rate-limits/
```

**Long-term solution:** Use Cloudflare Queues to batch email sends and respect Resend's rate limits. For initial launch, simple error handling is sufficient.

**Warning signs:**
- Intermittent "failed to send email" errors during high traffic
- Response errors mentioning rate limits
- Some users receive confirmation emails, others don't

## Code Examples

Verified patterns from official sources:

### Cloudflare Pages Function with Resend (Current Approach)

```typescript
// functions/api/waitlist.ts
// Source: Cloudflare Pages Functions API Reference
// https://developers.cloudflare.com/pages/functions/api-reference/

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Only accept POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { email } = body;

    // Validate required fields
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check for required env var
    if (!env.RESEND_API_KEY) {
      console.error('[Waitlist] Missing RESEND_API_KEY');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Send email via Resend API (using fetch, not SDK)
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'NomadCrew <welcome@nomadcrew.uk>',
        to: email,
        subject: 'Welcome to NomadCrew Waitlist!',
        html: '<p>Thanks for joining our waitlist!</p>'
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('[Waitlist] Resend API error:', resendData);
      throw new Error(resendData.message || 'Failed to send email');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully joined waitlist' }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('[Waitlist] Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        details: error.message
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
```

**Key points:**
- Uses Cloudflare Pages Functions format (`onRequest` export)
- Accesses env vars via `context.env`
- Uses fetch API (no SDK dependency, no nodejs_compat needed)
- Handles OPTIONS for CORS preflight
- Comprehensive error handling
- **This is the current working implementation**

---

### Astro Server Endpoint Alternative

```typescript
// src/pages/api/waitlist.ts
// Source: Astro Endpoints Guide
// https://docs.astro.build/en/guides/endpoints/

// Critical: Mark as server-rendered
export const prerender = false;

import type { APIRoute } from 'astro';

// Handle POST requests
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Access Cloudflare runtime via locals
    const env = locals.runtime.env;
    const apiKey = env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('Missing RESEND_API_KEY');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'NomadCrew <welcome@nomadcrew.uk>',
        to: email,
        subject: 'Welcome to NomadCrew Waitlist!',
        html: '<p>Thanks for joining our waitlist!</p>'
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return new Response(
        JSON.stringify({ error: 'Failed to send confirmation email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully joined waitlist' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('Waitlist error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// Handle CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
};
```

**Key differences from Pages Functions:**
- Uses Astro's `APIRoute` type and HTTP method exports
- Requires `export const prerender = false`
- Accesses env via `locals.runtime.env` instead of `context.env`
- Needs `@astrojs/cloudflare` adapter configured
- More TypeScript-friendly with Astro types

---

### Local Testing Setup

```bash
# .dev.vars (create in project root)
# Source: Cloudflare Environment Variables docs
# https://developers.cloudflare.com/workers/configuration/environment-variables/

RESEND_API_KEY=re_your_api_key_here
```

**Testing commands:**
```bash
# Approach 1: Test Pages Functions with Wrangler
npm run build
wrangler pages dev ./dist

# Or use npm script (already configured)
npm run preview:wrangler

# Approach 2: Test Astro endpoints with platformProxy
npm run dev  # If platformProxy.enabled = true
```

**Integration test with Playwright:**
```typescript
// tests/api/waitlist.spec.ts
// Source: Playwright API Testing Guide
// https://www.browserstack.com/guide/playwright-api-test

import { test, expect } from '@playwright/test';

test.describe('Waitlist API', () => {
  test('should accept valid email', async ({ request }) => {
    const response = await request.post('/api/waitlist', {
      data: { email: 'test@example.com' }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('should reject missing email', async ({ request }) => {
    const response = await request.post('/api/waitlist', {
      data: {}
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Email');
  });

  test('should handle CORS preflight', async ({ request }) => {
    const response = await request.fetch('/api/waitlist', {
      method: 'OPTIONS'
    });

    expect(response.status()).toBe(204);
    expect(response.headers()['access-control-allow-origin']).toBeTruthy();
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `output: 'hybrid'` | `output: 'static'` + `prerender = false` | Astro 5.0 (2024) | Simpler mental model, explicit opt-in to SSR |
| Adapter required for all endpoints | Functions directory for static sites | Always available | Can avoid adapter for simple use cases |
| `import.meta.env` for secrets | `context.env` / `locals.runtime.env` | Cloudflare runtime | Runtime secrets, not build-time |
| Advanced mode only | Directory mode option | Cloudflare Pages 2023 | Can keep functions/ folder if needed |
| Manual SMTP | Transactional email APIs | Industry standard | Resend, SendGrid, Postmark for reliability |

**Deprecated/outdated:**
- **`output: 'hybrid'`**: Removed in Astro 5. Use `output: 'static'` with `prerender = false` on specific endpoints
- **`mode: 'directory'` for adapter**: Advanced mode (default) is now standard, only use directory mode if you specifically need `functions/` folder alongside Astro endpoints
- **Resend API v1**: Current version is v2, check docs for latest endpoints (current implementation uses v2 `/emails` endpoint)

## Open Questions

Things that couldn't be fully resolved:

1. **Should we migrate or keep existing implementation?**
   - What we know: Both approaches work, current implementation is functional
   - What's unclear: Long-term maintenance preference (separate functions/ vs unified src/)
   - Recommendation: **Keep current implementation (Approach 1)** for Phase 6. Migration can be deferred until there's a clear need (e.g., adding many more endpoints, wanting unified testing)

2. **Email deliverability and spam filtering**
   - What we know: Resend handles SPF/DKIM, but domain reputation takes time
   - What's unclear: Whether `welcome@nomadcrew.uk` sending address is verified and DNS configured
   - Recommendation: Verify sending domain in Resend dashboard, test with multiple email providers (Gmail, Outlook, ProtonMail)

3. **Rate limiting strategy**
   - What we know: Resend has 2 req/sec limit, current implementation has no rate limiting
   - What's unclear: Expected traffic volume, whether to implement client-side or server-side limiting
   - Recommendation: Start with error handling (Pitfall 6), add Cloudflare Rate Limiting or Queues if traffic warrants it

4. **Testing strategy for email delivery**
   - What we know: Can test API calls, harder to verify actual email delivery
   - What's unclear: Best approach for E2E testing without spamming real emails
   - Recommendation: Use Resend's test mode API key for local dev, verify with personal email for production deployment

## Sources

### Primary (HIGH confidence)
- [Astro Cloudflare Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) - Adapter configuration, environment variables, modes
- [Cloudflare Pages Functions API Reference](https://developers.cloudflare.com/pages/functions/api-reference/) - onRequest format, context object, env access
- [Astro Endpoints Guide](https://docs.astro.build/en/guides/endpoints/) - Server endpoints, prerender flag, APIRoute types
- [Cloudflare Environment Variables Docs](https://developers.cloudflare.com/workers/configuration/environment-variables/) - .dev.vars format, production config
- [Cloudflare Workers Resend Tutorial](https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/) - Integration pattern, env var access
- [Cloudflare Pages Advanced Mode](https://developers.cloudflare.com/pages/functions/advanced-mode/) - _worker.js behavior, functions/ directory interaction

### Secondary (MEDIUM confidence)
- [Cloudflare Community: Setting Up Functions for Astro](https://community.cloudflare.com/t/setting-up-cloudflare-functions-for-an-astro-project/617686) - Confirmed adapter disables functions/ directory
- [Astro on Cloudflare Fully Automated Part 2](https://simongreer.co.uk/blog/astro-on-cloudflare-fully-automated-part-2/) - Real-world deployment patterns
- [From Form to Function: Astro + Cloudflare Contact Forms](https://www.solaire.dev/articles/astro-endpoints-cloudflare) - Similar use case implementation
- [Best Practice for Astro Endpoints | Zell Liew](https://zellwk.com/blog/astro-endpoint-best-practice/) - Prerendering pitfalls, static vs SSR
- [Playwright API Testing Guide](https://www.browserstack.com/guide/playwright-api-test) - Integration testing approach
- [Cloudflare Blog: Node.js Workers 2025](https://blog.cloudflare.com/nodejs-workers-2025/) - nodejs_compat compatibility flag updates

### Tertiary (LOW confidence - community discussions)
- GitHub Issue #8520 - nodejs_compat configuration discussions
- GitHub Issue #7976 - .dev.vars environment variable loading
- Community discussions on hybrid mode deprecation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs from Astro and Cloudflare, verified with Context7
- Architecture: HIGH - Both approaches documented in official sources, current implementation already working
- Pitfalls: MEDIUM-HIGH - Mix of official docs and community-reported issues, cross-verified where possible
- Testing: MEDIUM - Playwright docs verified, email testing best practices from industry sources

**Research date:** 2026-01-31
**Valid until:** 2026-03-31 (60 days - relatively stable domain, but Astro and Cloudflare iterate quickly)

**Key dependencies:**
- Astro 5.x architecture (stable as of Jan 2026)
- Cloudflare Pages Functions runtime (stable)
- Resend API v2 (stable, check for updates quarterly)
- Wrangler compatibility flags (updates tied to compatibility_date)
