# Requirements: NomadCrew Landing Page

**Defined:** 2026-01-28
**Core Value:** Visitors understand what NomadCrew does and can join the waitlist

## v2.0 Requirements

Requirements for Astro SEO Migration milestone. Each maps to roadmap phases.

### Migration & Infrastructure

- [ ] **MIGR-01**: Site runs on Astro 5.x framework with TypeScript
- [ ] **MIGR-02**: Interactive components use React islands with selective hydration
- [ ] **MIGR-03**: Site deploys to Cloudflare Pages via @astrojs/cloudflare adapter
- [ ] **MIGR-04**: iOS/Android deep linking preserved (.well-known files work)
- [ ] **MIGR-05**: Waitlist API endpoint functions correctly (Resend integration)
- [ ] **MIGR-06**: GitHub Actions CI/CD pipeline automates build and deploy
- [ ] **MIGR-07**: Automated deployment triggers on push to main branch

### SEO Implementation

- [ ] **SEO-01**: Each page has unique title and meta description
- [ ] **SEO-02**: Open Graph tags render correctly for social sharing
- [ ] **SEO-03**: Twitter card meta tags display properly
- [ ] **SEO-04**: Canonical URLs set for all pages
- [ ] **SEO-05**: robots.txt file controls crawler access
- [ ] **SEO-06**: XML sitemap auto-generates and updates on build
- [ ] **SEO-07**: JSON-LD Organization schema on homepage
- [ ] **SEO-08**: JSON-LD WebSite schema with search action
- [ ] **SEO-09**: JSON-LD Article schema on blog posts
- [ ] **SEO-10**: JSON-LD BreadcrumbList schema on blog posts

### Blog/Content System

- [ ] **BLOG-01**: Astro Content Collections configured for blog posts
- [ ] **BLOG-02**: MDX support enables rich content with components
- [ ] **BLOG-03**: Blog listing page displays all posts with pagination
- [ ] **BLOG-04**: Individual post pages render with full content
- [ ] **BLOG-05**: Posts have metadata (title, date, description, author, tags)
- [ ] **BLOG-06**: Tag pages filter posts by tag
- [ ] **BLOG-07**: Related posts section on each post page
- [ ] **BLOG-08**: Reading time estimate displays on posts
- [ ] **BLOG-09**: Social sharing buttons on blog posts

### Performance

- [ ] **PERF-01**: LCP (Largest Contentful Paint) ≤ 2.5 seconds
- [ ] **PERF-02**: INP (Interaction to Next Paint) ≤ 200ms
- [ ] **PERF-03**: CLS (Cumulative Layout Shift) ≤ 0.1
- [ ] **PERF-04**: Images optimized with WebP/AVIF formats
- [ ] **PERF-05**: Static components use Astro (no JS shipped)
- [ ] **PERF-06**: Interactive components use appropriate hydration (client:visible, client:idle)
- [ ] **PERF-07**: Lighthouse CI runs in GitHub Actions pipeline
- [ ] **PERF-08**: Bundle size tracked and monitored

## Future Requirements (v2.1+)

Deferred to future releases. Not in current roadmap.

### Content Enhancements

- **CONT-01**: Newsletter subscription from blog
- **CONT-02**: Author profiles with bio pages
- **CONT-03**: Comment system integration
- **CONT-04**: Content search functionality

### Advanced SEO

- **ASEO-01**: Multi-language support (i18n)
- **ASEO-02**: AMP pages for blog posts
- **ASEO-03**: Google News sitemap

### Analytics

- **ANLY-01**: Privacy-respecting analytics (Plausible/Fathom)
- **ANLY-02**: Conversion tracking for waitlist signups
- **ANLY-03**: Core Web Vitals real-user monitoring

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| User authentication | Landing page only, no user accounts needed |
| Database/CMS | File-based Content Collections sufficient for blog |
| Real-time features | Static/SSG sufficient for marketing site |
| E-commerce | No monetization on landing page |
| Mobile app | Separate project |
| Multi-language (i18n) | English only for v2.0, defer to v2.1 |
| Comments | Adds moderation burden, defer to v2.1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| MIGR-01 | TBD | Pending |
| MIGR-02 | TBD | Pending |
| MIGR-03 | TBD | Pending |
| MIGR-04 | TBD | Pending |
| MIGR-05 | TBD | Pending |
| MIGR-06 | TBD | Pending |
| MIGR-07 | TBD | Pending |
| SEO-01 | TBD | Pending |
| SEO-02 | TBD | Pending |
| SEO-03 | TBD | Pending |
| SEO-04 | TBD | Pending |
| SEO-05 | TBD | Pending |
| SEO-06 | TBD | Pending |
| SEO-07 | TBD | Pending |
| SEO-08 | TBD | Pending |
| SEO-09 | TBD | Pending |
| SEO-10 | TBD | Pending |
| BLOG-01 | TBD | Pending |
| BLOG-02 | TBD | Pending |
| BLOG-03 | TBD | Pending |
| BLOG-04 | TBD | Pending |
| BLOG-05 | TBD | Pending |
| BLOG-06 | TBD | Pending |
| BLOG-07 | TBD | Pending |
| BLOG-08 | TBD | Pending |
| BLOG-09 | TBD | Pending |
| PERF-01 | TBD | Pending |
| PERF-02 | TBD | Pending |
| PERF-03 | TBD | Pending |
| PERF-04 | TBD | Pending |
| PERF-05 | TBD | Pending |
| PERF-06 | TBD | Pending |
| PERF-07 | TBD | Pending |
| PERF-08 | TBD | Pending |

**Coverage:**
- v2.0 requirements: 34 total
- Mapped to phases: 0
- Unmapped: 34 (pending roadmap creation)

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-28 after initial definition*
