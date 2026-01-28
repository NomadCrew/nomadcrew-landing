# NomadCrew Landing Page

## What This Is

A marketing landing page for NomadCrew, a group travel coordination app. The site captures waitlist signups, explains product features, and includes a privacy policy. Currently built with React/Vite, deployed on Cloudflare Pages.

## Core Value

**Visitors understand what NomadCrew does and can join the waitlist.** The landing page must load fast, rank well in search, and convert visitors to signups.

## Current Milestone: v2.0 Astro SEO Migration

**Goal:** Migrate to Astro 5.x for optimal SEO performance with comprehensive content system.

**Target features:**
- Full Astro 5.x migration with hybrid React islands
- Maximum SEO implementation (sitemap, JSON-LD, OG, robots.txt)
- Travel/nomad tips blog with Content Collections
- GitHub Actions CI/CD pipeline
- Cloudflare Pages deployment (preserved)

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- Waitlist signup with email confirmation (Resend integration)
- Privacy policy page
- iOS/Android deep linking (.well-known files)
- Responsive design with Tailwind CSS
- Framer Motion animations

### Active

<!-- Current scope. Building toward these. -->

- [ ] Astro 5.x framework migration
- [ ] React islands for interactive components
- [ ] Comprehensive SEO meta tags
- [ ] JSON-LD structured data (Organization, WebSite)
- [ ] Auto-generated sitemap
- [ ] robots.txt configuration
- [ ] Open Graph / Twitter cards
- [ ] Blog content system with Astro Content Collections
- [ ] GitHub Actions CI/CD workflow
- [ ] Image optimization (AVIF/WebP)
- [ ] Core Web Vitals optimization

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Mobile app development — separate project
- User authentication — landing page only, no user accounts
- Payment processing — no monetization on landing page
- Real-time features — static/SSG sufficient for marketing site
- Multi-language (i18n) — English only for v2.0

## Context

**Current Stack:**
- React 18.3.1 + TypeScript 5.6.2
- Vite 5.4.10 bundler
- Tailwind CSS 3.4.15
- Framer Motion 11.11.17
- Cloudflare Pages + Workers
- Resend for email delivery

**Migration Target:**
- Astro 5.x with @astrojs/react
- @astrojs/cloudflare adapter
- @astrojs/sitemap
- astro-seo + astro-seo-schema
- Content Collections for blog

**SEO Baseline (Current):**
- Minimal: basic viewport meta, favicon only
- No sitemap, no JSON-LD, no OG tags
- No robots.txt

## Constraints

- **Hosting**: Cloudflare Pages — existing infrastructure, must preserve
- **Functions**: Cloudflare Workers — waitlist API must continue working
- **Deep Links**: .well-known files must be preserved for app linking
- **Performance**: Core Web Vitals "Good" threshold (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro 5.x over Next.js | Better static performance, island architecture ideal for landing page | — Pending |
| Hybrid React islands | Preserve complex waitlist form logic, minimize rewrite | — Pending |
| Content Collections for blog | Type-safe, fast builds, native Astro feature | — Pending |
| Keep Cloudflare Pages | Existing deployment, good edge performance | — Pending |

---
*Last updated: 2026-01-28 after milestone v2.0 started*
