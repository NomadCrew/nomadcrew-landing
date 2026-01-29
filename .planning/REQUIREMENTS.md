# Requirements: NomadCrew Landing Page

**Defined:** 2026-01-28
**Core Value:** Visitors understand what NomadCrew does and can join the waitlist

## v2.0 Requirements

Requirements for Astro SEO Migration milestone. Each maps to roadmap phases.

### Migration & Infrastructure

- [x] **MIGR-01**: Site runs on Astro 5.x framework with TypeScript
- [ ] **MIGR-02**: Interactive components use React islands with selective hydration
- [x] **MIGR-03**: Site deploys to Cloudflare Pages (static output, no adapter needed)
- [x] **MIGR-04**: iOS/Android deep linking preserved (.well-known files work)
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
| MIGR-01 | Phase 1 | Complete |
| MIGR-02 | Phase 4 | Pending |
| MIGR-03 | Phase 2 | Complete |
| MIGR-04 | Phase 1 | Complete |
| MIGR-05 | Phase 6 | Pending |
| MIGR-06 | Phase 8 | Pending |
| MIGR-07 | Phase 8 | Pending |
| SEO-01 | Phase 3 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| SEO-04 | Phase 3 | Pending |
| SEO-05 | Phase 7 | Pending |
| SEO-06 | Phase 7 | Pending |
| SEO-07 | Phase 5 | Pending |
| SEO-08 | Phase 5 | Pending |
| SEO-09 | Phase 7 | Pending |
| SEO-10 | Phase 7 | Pending |
| BLOG-01 | Phase 7 | Pending |
| BLOG-02 | Phase 7 | Pending |
| BLOG-03 | Phase 7 | Pending |
| BLOG-04 | Phase 7 | Pending |
| BLOG-05 | Phase 7 | Pending |
| BLOG-06 | Phase 7 | Pending |
| BLOG-07 | Phase 7 | Pending |
| BLOG-08 | Phase 7 | Pending |
| BLOG-09 | Phase 7 | Pending |
| PERF-01 | Phase 8 | Pending |
| PERF-02 | Phase 8 | Pending |
| PERF-03 | Phase 8 | Pending |
| PERF-04 | Phase 8 | Pending |
| PERF-05 | Phase 4 | Pending |
| PERF-06 | Phase 4 | Pending |
| PERF-07 | Phase 8 | Pending |
| PERF-08 | Phase 8 | Pending |

**Coverage:**
- v2.0 requirements: 34 total
- Mapped to phases: 34 (100%)
- Unmapped: 0

**Phase Distribution:**
- Phase 1: 2 requirements (Foundation Setup)
- Phase 2: 1 requirement (Cloudflare Integration)
- Phase 3: 2 requirements (Static Pages Migration)
- Phase 4: 3 requirements (React Islands Extraction)
- Phase 5: 4 requirements (Landing Page Assembly)
- Phase 6: 1 requirement (API Endpoint Migration)
- Phase 7: 13 requirements (Blog System & SEO Enhancement)
- Phase 8: 8 requirements (Performance Optimization & CI/CD)

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-29 after roadmap creation*
