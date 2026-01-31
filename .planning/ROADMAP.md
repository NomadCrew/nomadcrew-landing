# Roadmap: v2.0 Astro SEO Migration

**Milestone:** v2.0
**Created:** 2026-01-29
**Status:** Draft (awaiting approval)

## Overview

Migrate NomadCrew landing page from React/Vite SPA to Astro 5.x with selective React islands architecture. This migration delivers substantial SEO improvements through static HTML generation, adds a comprehensive blog system with Content Collections, and establishes automated CI/CD deployment. The 8-phase structure follows dependency order: foundation setup before feature migration, low-risk static pages before high-risk API endpoints, and performance optimization after measurable baselines are established.

## Phase Structure

### Phase 1: Foundation Setup

**Goal:** Astro development environment established with correct architecture patterns

**Dependencies:** None (foundation phase)

**Requirements:**
- MIGR-01: Site runs on Astro 5.x framework with TypeScript
- MIGR-04: iOS/Android deep linking preserved (.well-known files work)

**Success Criteria:**
1. Developer can run `npm run dev` and view Astro site at localhost:4321
2. TypeScript compilation works without errors (astro check passes)
3. .well-known files are accessible at /.well-known/[filename] in dev and build output
4. Test page renders with BaseLayout showing meta tags in page source

**Plans:** 5 plans

Plans:
- [x] 01-01-PLAN.md — Move .well-known files to public/
- [x] 01-02-PLAN.md — Install Astro packages and create config
- [x] 01-03-PLAN.md — Configure TypeScript for Astro + React
- [x] 01-04-PLAN.md — Set up Tailwind with Vite plugin
- [x] 01-05-PLAN.md — Create BaseLayout and test page

**Status:** Complete

---

### Phase 2: Cloudflare Integration

**Goal:** Production deployment configuration validated and ready for Astro

**Dependencies:** Phase 1 (requires Astro project structure)

**Requirements:**
- MIGR-03: Site deploys to Cloudflare Pages (static output, no adapter needed)

**Success Criteria:**
1. Build output valid for Cloudflare Pages (no _routes.json or under 100 rules)
2. wrangler.jsonc configured with correct output directory
3. Test deployment to Cloudflare Pages succeeds
4. .well-known files appear in deployed build
5. Cloudflare Auto Minify is disabled in dashboard settings

**Plans:** 1 plan

Plans:
- [x] 02-01-PLAN.md — Configure Wrangler and verify deployment readiness

**Status:** Complete

---

### Phase 3: Static Pages Migration

**Goal:** First content page migrated successfully to validate deployment pipeline

**Dependencies:** Phase 2 (requires working Cloudflare deployment)

**Requirements:**
- SEO-01: Each page has unique title and meta description
- SEO-04: Canonical URLs set for all pages

**Success Criteria:**
1. Privacy policy page accessible at /privacy with correct content
2. Page displays unique title and meta description in browser view source
3. Canonical URL meta tag present and correct in page source
4. Page renders identically to React version (visual regression test passes)

**Plans:** 1 plan

Plans:
- [x] 03-01-PLAN.md — Migrate Privacy Policy page with SEO and visual regression tests

**Status:** Complete

---

### Phase 4: React Islands Extraction

**Goal:** Interactive components isolated and ready for selective hydration

**Dependencies:** Phase 3 (validates Astro component patterns)

**Requirements:**
- MIGR-02: Interactive components use React islands with selective hydration
- PERF-05: Static components use Astro (no JS shipped)
- PERF-06: Interactive components use appropriate hydration (client:visible, client:idle)

**Success Criteria:**
1. Navbar component renders in isolation with client:load
2. WaitlistForm component renders in isolation with client:visible
3. FeatureCard component renders in isolation with client:visible
4. HeroSection component renders in isolation with client:idle
5. No hydration mismatch errors in browser console

**Plans:** 4 plans

Plans:
- [x] 04-01-PLAN.md — Extract Navbar component (client:load)
- [x] 04-02-PLAN.md — Extract HeroSection and FeatureCard components
- [x] 04-03-PLAN.md — Extract WaitlistForm and create static Footer
- [x] 04-04-PLAN.md — Integration testing and hydration verification

**Status:** Complete

---

### Phase 5: Landing Page Assembly

**Goal:** Main landing page delivering 70%+ bundle size reduction and faster load times

**Dependencies:** Phase 4 (requires extracted React islands)

**Requirements:**
- SEO-02: Open Graph tags render correctly for social sharing
- SEO-03: Twitter card meta tags display properly
- SEO-07: JSON-LD Organization schema on homepage
- SEO-08: JSON-LD WebSite schema with search action

**Success Criteria:**
1. Landing page accessible at / with all sections visible
2. All interactive elements function (animations, mobile menu, scrolling)
3. Facebook Sharing Debugger shows correct OG image and description
4. Twitter Card Validator displays preview correctly
5. Google Rich Results Test validates Organization and WebSite schemas
6. JavaScript bundle size is under 150KB gzipped

**Plans:** 4 plans

Plans:
- [x] 05-01-PLAN.md — Create OG image and configure bundle visualizer
- [x] 05-02-PLAN.md — Add JSON-LD schemas to BaseLayout
- [x] 05-03-PLAN.md — Compose landing page with all React islands
- [x] 05-04-PLAN.md — Verify with social sharing tools and Rich Results Test

**Status:** Complete

---

### Phase 6: API Endpoint Migration

**Goal:** Waitlist signup functions correctly without disruption

**Dependencies:** Phase 5 (landing page must consume API)

**Requirements:**
- MIGR-05: Waitlist API endpoint functions correctly (Resend integration)

**Success Criteria:**
1. Form submission with valid email returns success message
2. Form submission with invalid email shows validation error
3. Email confirmation delivers to submitted address within 60 seconds
4. Error states handle API failures gracefully with user-friendly messages
5. CORS headers allow requests from production domain

**Plans:** 3 plans

Plans:
- [x] 06-01-PLAN.md — Local dev setup and API tests
- [x] 06-02-PLAN.md — End-to-end form submission tests
- [x] 06-03-PLAN.md — Production deployment verification

**Status:** Complete

---

### Phase 7: Blog System & SEO Enhancement

**Goal:** Complete blog with maximum SEO optimization operational

**Dependencies:** Phase 6 (core site must be functional before adding blog)

**Requirements:**
- BLOG-01: Astro Content Collections configured for blog posts
- BLOG-02: MDX support enables rich content with components
- BLOG-03: Blog listing page displays all posts with pagination
- BLOG-04: Individual post pages render with full content
- BLOG-05: Posts have metadata (title, date, description, author, tags)
- BLOG-06: Tag pages filter posts by tag
- BLOG-07: Related posts section on each post page
- BLOG-08: Reading time estimate displays on posts
- BLOG-09: Social sharing buttons on blog posts
- SEO-05: robots.txt file controls crawler access
- SEO-06: XML sitemap auto-generates and updates on build
- SEO-09: JSON-LD Article schema on blog posts
- SEO-10: JSON-LD BreadcrumbList schema on blog posts

**Success Criteria:**
1. Blog listing page at /blog shows all published posts with pagination
2. Individual post accessible at /blog/[slug] with full content and formatting
3. Tag page at /blog/tags/[tag] filters posts correctly
4. Related posts section displays 3 relevant posts based on shared tags
5. sitemap.xml includes all blog posts and updates on new post
6. robots.txt accessible and allows crawling of all content
7. Google Rich Results Test validates Article schema on post pages
8. Social sharing buttons open correct share dialogs with pre-filled content

**Status:** Pending

---

### Phase 8: Performance Optimization & CI/CD

**Goal:** Production monitoring active and Core Web Vitals exceed "Good" thresholds

**Dependencies:** Phase 7 (requires complete feature set for accurate measurement)

**Requirements:**
- MIGR-06: GitHub Actions CI/CD pipeline automates build and deploy
- MIGR-07: Automated deployment triggers on push to main branch
- PERF-01: LCP (Largest Contentful Paint) ≤ 2.5 seconds
- PERF-02: INP (Interaction to Next Paint) ≤ 200ms
- PERF-03: CLS (Cumulative Layout Shift) ≤ 0.1
- PERF-04: Images optimized with WebP/AVIF formats
- PERF-07: Lighthouse CI runs in GitHub Actions pipeline
- PERF-08: Bundle size tracked and monitored

**Success Criteria:**
1. Push to main branch triggers automatic build and deployment to production
2. Lighthouse CI runs on every PR and posts scores as comment
3. Production landing page scores 90+ on Lighthouse Performance
4. Core Web Vitals measured from Field Data (Chrome UX Report) show all metrics in "Good" range
5. Images load in WebP format with AVIF fallback for supported browsers
6. Bundle size report shows breakdown by component and flags increases over 10%

**Status:** Pending

---

## Progress

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 | Foundation Setup | MIGR-01, MIGR-04 | Complete |
| 2 | Cloudflare Integration | MIGR-03 | Complete |
| 3 | Static Pages Migration | SEO-01, SEO-04 | Complete |
| 4 | React Islands Extraction | MIGR-02, PERF-05, PERF-06 | Complete |
| 5 | Landing Page Assembly | SEO-02, SEO-03, SEO-07, SEO-08 | Complete |
| 6 | API Endpoint Migration | MIGR-05 | Complete |
| 7 | Blog System & SEO Enhancement | BLOG-01 to BLOG-09, SEO-05, SEO-06, SEO-09, SEO-10 | Pending |
| 8 | Performance Optimization & CI/CD | MIGR-06, MIGR-07, PERF-01 to PERF-04, PERF-07, PERF-08 | Pending |

**Overall:** 6/8 phases complete (75%)

---

## Coverage

All 34 v2.0 requirements mapped to phases:
- Migration & Infrastructure (7): All mapped
- SEO Implementation (10): All mapped
- Blog/Content System (9): All mapped
- Performance (8): All mapped

No orphaned requirements.

---

*Last updated: 2026-01-31 after Phase 6 execution complete*
